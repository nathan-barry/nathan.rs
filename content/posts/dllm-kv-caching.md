---
title: "KV Caching for dLLMs is Noise Process Agnostic"
date: 2026-06-26T18:31:55-07:00
tags: ['2026']
featured: true
hero: "/js/diffusion-noise.js"
---

The typical language model is **autoregressive** (AR): it predicts one token at a time, left to right, each token conditioned on the ones before it. This bakes in two limitations: it cannot revise earlier tokens if later context makes them appear wrong, and its latency grows linearly with length, since every token takes its own forward pass.

Diffusion language models avoid these problems.[^arch] Generation starts from a sequence of pure noise, and at each step the model predicts a cleaner version of every position at once. Repeat this for a fixed number of steps and the noisy sequence resolves into legible text. Because the whole sequence is refined in parallel, the model can revise any position as it goes.

Despite side-stepping these two problems, diffusion language models have one major limitation that makes efficient inference hard: they don't naively support KV caching.

## Why diffusion breaks KV caching

AR generation is cheap because of **KV caching**. The causal attention mask means each position attends only to earlier ones, so a token's keys and values (its internal state in the attention mechanism) are fixed the moment they're computed. No later token can change them. You compute each token's KV once, store it, and reuse it for the rest of generation.
Without caching, generating $n$ tokens costs on the order of $n^2$ work; with it, it's roughly linear.

<!-- anim: AR generation with KV caching -->
<figure class="post-anim"><canvas data-anim="ar-cache" role="img" aria-label="Autoregressive generation: each token is computed once, then cached and reused. The active token reads all cached tokens to its left."></canvas></figure>

Diffusion language models use **bidirectional** attention with no causal mask, so every token attends to every other token.[^bert] That means if a token changes anywhere in the sequence, it shifts the keys and values of all the others. And since generation works by changing tokens every step, every position's keys and values can drift at every step. Thus, diffusion models can't use normal KV caching.

<!-- anim: diffusion generation, every position drifts every step -->
<figure class="post-anim"><canvas data-anim="diffusion-drift" role="img" aria-label="Diffusion generation: the whole sequence is present at once, and as each step changes tokens, drift accumulates across every position."></canvas></figure>

The good news is that generation quality is robust to slight key and value drift. KV cache approximation (using stale KV states and refreshing them periodically) allows dLLMs to reuse cached KV states without sacrificing quality. Once you allow approximate caching, the question stops being "is caching possible" and becomes a tradeoff: how much can you reuse, and how stale can it get, before quality starts to slip?

## Masked vs. uniform noise

First, what *is* diffusion? At its core, it's a pair of processes. A **forward process** takes real data and destroys its information a little at a time, step by step, until nothing is left but noise. We then train a model to run the **reverse process**: undoing each step to recover the original data.

The canonical example is with images: take a photo, add a bit of Gaussian noise over and over until it's static noise, and train a network to walk it back. To generate, you start from fresh static and run the reverse process.

<figure>
  <img src="/images/cat-diffusion-process.webp" alt="Forward diffusion on an image: a photo is destroyed into noise a little at a time. Generation runs this in reverse." />
  <figcaption>Image from <a href="https://cvpr2022-tutorial-diffusion-models.github.io/">CVPR 2022 Tutorial on Diffusion Models</a>.</figcaption>
</figure>

There are many ways to "destroy information." For text, the two noise processes that matter here are **masking** and **uniform**.[^noise-types]

**Masked diffusion** replaces tokens with a special `[MASK]` token. Generation looks like filling in blanks. This is BERT-style masking turned into a generative process, and it's what powers most of the diffusion models you've heard of, like [LLaDA](https://arxiv.org/abs/2502.09992), Dream, Inception's Mercury, and [Gemini Diffusion](https://deepmind.google/models/gemini-diffusion/).

<!-- anim: masked generation -->
<figure class="post-anim"><canvas data-anim="masked" role="img" aria-label="Masked diffusion: every position starts as [MASK], then flips to a real word and is fixed. You can always tell which positions are unresolved."></canvas></figure>

**Uniform diffusion** replaces tokens with a *random vocabulary token* instead. Generation looks like going from nonsense to coherent text.

<!-- anim: uniform generation -->
<figure class="post-anim"><canvas data-anim="uniform" role="img" aria-label="Uniform diffusion: every position always shows a real, ordinary-looking word, so corrupted and correct positions are indistinguishable and any position can change at any step."></canvas></figure>

These two ways of adding noise lead to very different behavior and properties during generation.

Masked diffusion has a property called an **absorbing state**: each position makes exactly one *state transition*, from `[MASK]` to a real token, and then stays fixed. A position's keys and values experience the most drift during a state transition, so decoded positions create obvious caching opportunities.

Uniform diffusion has no absorbing state: a position can transition an *arbitrary number* of times, and nothing ever signals that a position has settled. On the surface, there's no obvious set of positions safe to cache, and it wasn't clear that any caching opportunities existed at all.

## Observations and findings

That's the question [my thesis](/thesis.pdf) started from. My KV caching engine for uniform diffusion ended up, surprisingly, looking almost identical to the popular engines built for masked diffusion (Fast-dLLM in particular).[^masked-caches] Given how differently the two noise processes behave, why should that be? After a lot of experimentation, I found it comes down to two properties of diffusion generation that seem to hold regardless of the noise process.[^thesis]

### Left-to-right decoding preference

The space of decoding strategies is much larger for diffusion than for AR. AR has a single decoding order, left to right and one token at a time; its decoding strategies mostly revolve around reshaping the distribution you sample the next token from. A diffusion model updates a whole block of positions at once and can revisit any position at any step. So the decision isn't just *how* to reshape each distribution, but *how many* positions to update[^parallel-decoding] and *in what order*.

In both noise processes, that decision is usually confidence-based:[^conf] each step updates the positions the model is most sure about. And the positions it's most sure about tend to sit right next to context that's already resolved. Since the prompt anchors the left, confidence-based decoding ends up filling in roughly left to right on its own, without anyone enforcing an order.

<!-- anim: confidence fills in left to right -->
<figure class="post-anim"><canvas data-anim="confidence-ltr" role="img" aria-label="A fluctuating confidence level across positions, running higher near the resolved context on the left and lower on the right, so confidence-based decoding tends to progress left to right without being forced to."></canvas></figure>

**Block-wise** generation just draws a clean boundary around this: treat one contiguous block as the region you're actively working on, and treat everything outside it as not currently changing. That's the setup [Fast-dLLM](https://arxiv.org/abs/2505.22618) uses for masked diffusion: cache the prompt and the decoded tokens, and recompute only the active block. It reaches speedups of up to around 27×.[^fastdllm-27x]

<!-- anim: block-wise decoding / local drift map -->
<figure class="post-anim"><canvas data-anim="blockwise" role="img" aria-label="Block-wise decoding: an active block sweeps left to right. Inside the block positions drift heavily and are recomputed each step; the prompt, completed blocks, and future blocks stay cool and cached."></canvas></figure>

This left-to-right preference is noise process agnostic: any confidence-based decoding algorithm tends to produce it, no matter how tokens are corrupted.

### KV drift is local

When a token changes, the disturbance to the cache is concentrated on that token and its immediate neighbors, and it falls off quickly with distance in both directions.[^drift] Under block-wise generation, where the changing tokens are penned into one block, almost all the drift piles up inside the current block.

<!-- anim: local KV drift around a changing token -->
<figure class="post-anim"><canvas data-anim="drift-local" role="img" aria-label="When one token changes, KV drift spikes at that position and falls off sharply with distance in both directions; positions a few steps away barely move."></canvas></figure>

These two properties are what dLLM caching strategies depend on, and neither depends on the noise process. So the masked diffusion caching strategies port over almost directly: cache the stable regions, recompute the changing one, and refresh all positions occasionally. My uniform-cache engine is essentially that, and it runs more than an order of magnitude faster than the uncached baseline with no meaningful quality loss (tested on 3B and 10B parameter models).

## Conclusion

Both of the properties that make caching work are agnostic to the noise process. A left-to-right decoding preference falls out of confidence-based decoding no matter how you corrupt tokens, and KV drift stays local whether or not there's an absorbing state to guarantee it. Masked diffusion just made these easy to see, with decoded tokens you could point to and call "done."

Uniform diffusion has none of that structure, and the same behavior shows up anyway. That suggests local drift and left-to-right decoding are general features of how diffusion language models denoise, which means the existing toolbox of masked diffusion caching methods should carry over to other noise processes. Confirming it really extends past masked and uniform is the next step.

## Citation

> Barry, Nathan. "KV Caching for dLLMs is Noise Process Agnostic". nathan.rs (Jun 2026). https://nathan.rs/posts/dllm-kv-caching.

```
@article{barry2026dllmcache,
  title   = "KV Caching for dLLMs is Noise Process Agnostic",
  author  = "Barry, Nathan",
  journal = "nathan.rs",
  year    = "2026",
  month   = "Jun",
  url     = "https://nathan.rs/posts/dllm-kv-caching"
}
```


[^arch]: Diffusion language models use the same transformer architecture as AR models; they just use a different training objective and apply no causal attention mask.
[^bert]: This is the same bidirectional setup [BERT](https://arxiv.org/abs/1810.04805) uses: every token's representation is built from the entire sequence, left and right, rather than only the tokens before it. It's why a diffusion model can revise any position using the full context, where an autoregressive model only ever sees what came before. Read more in my other post, [BERT is just a Single Text Diffusion Step](/posts/roberta-diffusion/).
[^noise-types]: There are other noise processes (Gaussian, embedding-based, etc.), but masked and uniform (and hybrids combining them) have so far had the best results for language modeling.
[^masked-caches]: Elastic-Cache and Fast-dLLM are the current SOTA for masked diffusion KV caching, and both take advantage of the properties below.
[^thesis]: My thesis, [*Block-Wise KV Caching for Uniform Diffusion Language Models*](/thesis.pdf). Most of the empirical claims in this post (token dynamics, KV drift, and the speedups) come from experiments I ran there.
[^conf]: The uniform diffusion decoding algorithm selects positions based on the largest shift in the most confident token's probability mass (instead of selecting just the most confident). This is the adaptive sampling scheme from the GIDD scaling work.
[^drift]: Quantified in the KV drift analysis of my thesis: completed blocks, the prompt, and far-future blocks show roughly 24–1000× lower drift than the actively decoding block, while still receiving a large share of the attention mass.
[^parallel-decoding]: Masked diffusion suffers from the "curse of parallel decoding": committing several tokens in a single step locks in errors it can't undo, which caps how few steps it can take. Uniform diffusion can revise those errors on a later step, so it degrades far more gracefully as the step count drops.
[^fastdllm-27x]: The widely quoted 27× combines caching with confidence-aware parallel decoding; caching on its own accounts for less.
