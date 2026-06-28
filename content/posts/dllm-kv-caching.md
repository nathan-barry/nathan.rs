---
title: "KV Caching for dLLMs is Noise Process Agnostic"
date: 2026-06-26T18:31:55-07:00
tags: ['2026']
featured: true
hero: "/js/diffusion-noise.js"
draft: true
---

Almost every language model you've used is **autoregressive** (AR): it predicts one token at a time, left to right, each token conditioned on the ones before it. This bakes in two limitations: it can't revise an earlier token if later context makes it look wrong, and its latency grows linearly with length, since every token takes its own forward pass.

Diffusion language models work the other way. Generation starts from a sequence of pure noise, and at each step the model reads the whole noisy sequence and predicts a cleaner version of every position at once. Repeat this for a fixed number of steps and the noise resolves into text. The whole sequence is refined in parallel, so the model can revise any position as it goes.

Despite these benefits, diffusion language models have seen limited usage due to the fact that efficient serving is a much more complex story.

## Why diffusion breaks KV caching

The reason AR generation is cheap is **KV caching**. AR models use a causal attention mask, so each position attends only to previous positions. That guarantees a token's keys and values (its internal state inside the attention mechanism) never change once they're computed, because future tokens don't affect past token KV states. So you compute each token's keys and values once, store them, and reuse them for the rest of generation. Without caching, generating $n$ tokens costs on the order of $n^2$ work; with it, it's roughly linear.

<!-- anim: AR generation with KV caching -->
<figure class="post-anim"><canvas data-anim="ar-cache" role="img" aria-label="Autoregressive generation: each token is computed once, then cached and reused. The active token reads all cached tokens to its left."></canvas></figure>

Diffusion models don't get this for free. Today's diffusion language models use **bidirectional** attention with no causal mask, so every token attends to every other token[^bert]. That means if a token changes anywhere in the sequence, it shifts the keys and values of all the others. And since generation works by changing tokens every step, every position's keys and values can move at every step. Thus, diffusion models can't use normal KV caching.

<!-- anim: diffusion generation, every position drifts every step -->
<figure class="post-anim"><canvas data-anim="diffusion-drift" role="img" aria-label="Diffusion generation: the whole sequence is present at once and every position's keys and values drift a little at every step, cooling as generation resolves but never reaching zero."></canvas></figure>

The good new is that generation quality is slightly robust to some key and value drift. KV cache approximation (using stale KV states and refreshing them periodically) allows dLLMs to reuse cached KV states without sacrificing quality. Once you allow approximate caching, the question stops being "is caching possible" and becomes a tradeoff: how much can you reuse, and how stale can it get, before quality starts to slip?

## Masked vs. uniform noise

An important idea to first clarify is, what *is* diffusion? Diffusion is just concept of defining two processes. We first define a forward process that takes in input data and slowly *destroy* the information, step by step, until none is left. We then train a model to undo that process.

The canonical example is with images: take a photo, add a bit of Gaussian noise over and over until it's static noise, and train a network to walk it back. To generate, you start from fresh static and run the reverse process.

<figure>
  <img src="/images/cat-diffusion-process.webp" alt="Forward diffusion on an image: a photo is destroyed into noise a little at a time. Generation runs this in reverse." />
  <figcaption>Image from <a href="https://cvpr2022-tutorial-diffusion-models.github.io/">CVPR 2022 Tutorial on Diffusion Models</a>.</figcaption>
</figure>

"Destroying information" is a very general concept, and there are many ways to do it. For text, the main two that matter here are **masking** and **uniform corruption**.[^1]

**Masked diffusion** replaces tokens with a special `[MASK]` token. Generation looks like filling in blanks. This is BERT-style masking turned into a generative process, and it's what powers most of the diffusion models you've heard of, like [LLaDA](https://arxiv.org/abs/2502.09992), Dream, Inception's Mercury, and [Gemini Diffusion](https://deepmind.google/models/gemini-diffusion/).

<!-- anim: masked generation -->
<figure class="post-anim"><canvas data-anim="masked" role="img" aria-label="Masked diffusion: every position starts as [MASK], then flips to a real word and is fixed. You can always tell which positions are unresolved."></canvas></figure>

**Uniform diffusion** replaces tokens with a *random vocabulary token* instead. A corrupted token is just a normal token that happens to be wrong.

<!-- anim: uniform generation -->
<figure class="post-anim"><canvas data-anim="uniform" role="img" aria-label="Uniform diffusion: every position always shows a real, ordinary-looking word, so corrupted and correct positions are indistinguishable and any position can change at any step."></canvas></figure>


These two ways of adding noise lead to very different generation behavior.
Masked diffusion has a property called an **absorbing state**: each position makes exactly one *state transition*, from `[MASK]` to a real token, and then stays there. This splits the sequence at every step into masked positions, still being worked out, and decoded ones that are done. A position's keys and values experience the most drift during a state transition, so decoded positions are obvious caching opportunities where you can reuse them and refresh only occasionally. Every masked-diffusion caching method builds on this observation.[^2]

Uniform diffusion has no absorbing state property: a position can transition an *arbitrary number* of times, and nothing ever signals that one has settled.[^3] On the surface level, there's no obvious set of positions that are safe to cache and it was unclear whether opportunities existed. That's the question [my thesis](/thesis.pdf) started from.

## Observations and findings
I ended up finding that most the popular masking dllm KV caching strategies (primarily Fast-dLLM) works for uniform diffusion as well. But with all these differences, the question is why?

### Left-to-right decoding preference

To begin with, diffusion gives you a much larger decoding space than AR. AR has one decoding order, left to right one token at a time, and its decoding strategies mostly revolve around reshaping the distribution you sample each token from. A diffusion model works on a whole block of positions at once, where you can sample from any position (generally multiple at once) at any time. Thus, we are concerned with not only reshaping a distribution, but choosing how many to reshape and in what order.

Most diffusion decoding strategies in both noise paradigms are confidence-based. Decoding is guided by which positions the model is most sure about (or which has the largest shift in confidence).
The positions a model is most sure about tend to sit right next to context that's already resolved. Since the prompt is always there on the left, confidence-based decoding tends to fill in left to right on its own, without anyone forcing it to.

**Block-wise** generation just draws a clean boundary around this: treat one contiguous block as the region you're actively working on, and treat everything outside it as not currently changing. That's the setup [Fast-dLLM](https://arxiv.org/abs/2505.22618) uses for masked diffusion: cache the prompt and the decoded tokens, recompute only the active block, and it gets speedups of up to around 27×.[^4]

<!-- anim: block-wise decoding / local drift map -->
<figure class="post-anim"><canvas data-anim="blockwise" role="img" aria-label="Block-wise decoding: an active block sweeps left to right. Inside the block positions drift heavily and are recomputed each step; the prompt, completed blocks, and future blocks stay cool and cached."></canvas></figure>

This property of generation is noise process agnostic. Regardless of noise process, we will tend to see a left-to-right generation preference with any confidence-based decoding algorithm.

### KV drift is local

When a token changes, the disturbance to the cache is concentrated on that token and its immediate neighbors, and it falls off quickly with distance in both directions. Under block-wise generation, where the changing tokens are penned into one block, almost all the drift piles up inside the current block. Completed blocks, the prompt, and far-off future blocks barely move from step to step — orders of magnitude less than the active block — even though they still take in a big share of the model's attention, and even though nothing structural is protecting them. They're stable simply because that's how the denoising behaves.

<!-- anim: local KV drift around a changing token -->
<figure class="post-anim"><canvas data-anim="drift-local" role="img" aria-label="When one token changes, KV drift spikes at that position and falls off sharply with distance in both directions; positions a few steps away barely move."></canvas></figure>

That's exactly the condition Fast-dLLM's recipe needs. The region that's actually changing is a contiguous block, everything outside it is close to stable, so you cache outside the block and recompute within the block — no absorbing state required. My method is essentially that: on the first step of each block it runs one full forward pass to refresh the whole cache, then for the rest of the block it recomputes only the current block, letting those tokens attend against the full cache. It's close to a direct port of the masked recipe onto a uniform model, and it works — more than an order of magnitude faster than the uncached baseline, with no meaningful quality loss, from a 3B model up to a 10B one.

The contribution isn't really the method, it's the measurement. The interesting part isn't that I built a cache for uniform diffusion; it's that it ended up looking very similar to kv caching implementations that we already had.

## Conclusion

The property that makes diffusion models cacheable is local KV drift under a confidence-driven, roughly left-to-right decoding order. The natural assumption was that this rode on masked diffusion's absorbing state — that you could cache decoded positions *because* they were frozen. But uniform diffusion has no absorbing state and no frozen positions, and the same locality shows up anyway.

That points to something more general than any single model or method. Local drift looks like a feature of how diffusion language models denoise, not a feature of the masking process specifically. If that holds, the existing toolbox of masked-diffusion caching methods should carry over to other noise processes — uniform now, and probably the hybrid and not-yet-invented ones later — more or less as-is. Checking whether it really extends past uniform and masked is the obvious next step.

[^bert]: This is the same bidirectional setup [BERT](https://arxiv.org/abs/1810.04805) uses: every token's representation is built from the entire sequence, left and right, rather than only the tokens before it. It's also why a diffusion model can revise any position using the full context, where an autoregressive model only ever sees what came before.
[^1]: There are other noise processes — Gaussian, embedding-based, and hybrids that mix masking and uniform — but masked and uniform are the two that have worked best for language, so I'll stick to them.
[^2]: dKV-Cache, dLLM-Cache, Elastic-Cache, and the Fast-dLLM approach I come back to below are all versions of this. They differ mainly in which positions they refresh and how often.
[^3]: With no `[MASK]` flag marking the noise, the model has a harder job — it must infer not just what each corrupted position should be but which positions are corrupted at all — which is also uniform diffusion's main selling point. Because every position is always up for revision, a uniform model can fix its own mistakes mid-generation, where a masked model is stuck with whatever it commits. This lets uniform diffusion take much more aggressive steps: masked diffusion suffers from the "curse of parallel decoding," where committing several tokens in one step locks in errors it can't undo, while uniform can clean them up later — so it degrades far more gracefully as you cut the step count. It also scales well; a recent [scaling study](https://arxiv.org/abs/2512.10858) found its quality gap with masked diffusion shrinking from 3.2% to 1.7% as compute grew three orders of magnitude.
[^4]: The widely quoted 27× combines caching with confidence-aware parallel decoding; caching on its own accounts for less.
