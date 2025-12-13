+++
title = "BERT is just a Single Text Diffusion Step"
date = 2025-10-20
tags = ["Machine Learning"]
+++
{{< katex >}}{{< /katex >}}

> This article appeared on Hacker News. Link to the [discussion here](https://news.ycombinator.com/item?id=45644328). Additionally, [Andrej Karpathy](https://karpathy.ai) wrote his thoughts about the post, [linked here](https://x.com/karpathy/status/1980347971935068380?s=20).

<img alt="Text Diffusion" style="max-width: 100%" src="/images/roberta-diffusion.gif">

A while back, Google DeepMind unveiled [Gemini Diffusion](https://deepmind.google/models/gemini-diffusion/), an experimental language model that generates text using diffusion. Unlike traditional GPT-style models that generate one word at a time, Gemini Diffusion creates whole blocks of text by refining random noise step-by-step.

I read the paper [Large Language Diffusion Models](https://arxiv.org/abs/2502.09992) and was surprised to find that discrete language diffusion is just a generalization of masked language modeling (MLM), something we’ve been doing since [2018](https://arxiv.org/abs/1810.04805).
The first thought I had was, "can we finetune a BERT-like model to do text generation?"[^1] I decided to try a quick proof of concept out of curiosity.



## A Short History of Transformers
---
The original Transformer architecture, introduced in [2017](https://arxiv.org/abs/1706.03762), was an encoder-decoder model. In 2018, researchers realized that the encoder and decoder components of the model could be separated (with the advent of [BERT](https://arxiv.org/abs/1810.04805) and [GPT](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)), and two distinct families of models were created:

1. **Encoder-only models (BERT-style, bidirectional)**

Encoder models used masked language modeling (MLM) as a training objective: randomly mask out a subset of tokens of each input and train the encoder to reconstruct the missing tokens (fill in the blanks).
The model sees the entire (partially masked) context at once and learns bidirectional representations.
This architecture excelled at tasks requiring a full‐sentence (or paragraph) representation (e.g., classification and retrieval).

2. **Decoder-only models (GPT-style, autoregressive)**

Decoder models used next‐token prediction as a training objective: at each position $t$, predict the token at position $t + 1$ given all tokens up to $t$ as context. Only the left context is used to predict future values (unidirectional).
This architecture excelled at generative tasks where you produce text one token at a time, such as open‐ended generation, summarization, and translation.

Originally, BERT saw immediate use in tasks such as classification, whereas GPT-style models didn't become popular until later (due to initial limited capabilities). Eventually, the generation capabilities of autoregressive (decoder) transformers vastly improved. The general training objective of “next token prediction” means a much larger space of use cases when compared to encoder models.



## Discrete Language Diffusion Models
---

Diffusion models were first popularized in image generation. In image generation, diffusion models gradually add Gaussian noise to an image (forward process) and then train a neural network to iteratively denoise it (reverse process). A high‐level summary of continuous diffusion with images is:

1. **Forward process**: Start from a clean image _x₀_, then add small amounts of (usually Gaussian) noise at each timestep until you end up with near‐pure noise.  
2. **Reverse process**: Train a model (often a U‐Net) to predict the noise at each timestep, gradually recovering the original image in discrete denoising steps.

Applying this idea to language means we need a way to add noise to text and then remove it in stages. 
The simplest way to do this is a **masking‐based noise process**:

1. **Forward (masking) process**:  
   - At timestep _t = 0_, you have a fully uncorrupted text sequence.  
   - At each subsequent timestep _t > 0_, randomly replace a fraction of tokens with a special `<MASK>` token according to a pre‐defined schedule (e.g., gradually increasing the masked proportion from 0% to 100%).
   - By the final timestep _T_, the entire sequence may be masked (all tokens are `<MASK>`).

2. **Reverse (denoising) process**:  
   - Train a model (often a standard Transformer encoder) to predict the original token IDs given a partially masked sequence at timestep _t_.  
   - This is akin to performing masked language modeling at varying mask rates: at early timesteps, only a few tokens are masked (easy to predict); at later timesteps, many tokens are masked (harder).  
   - By chaining together predictions from high‐mask‐rate back down to zero, you can recover (or generate) a full sequence.

In this discrete text diffusion framework, the model learns a likelihood bound on the data distribution by optimizing a sum of denoising losses over all timesteps, rather than a single MLM objective at a fixed mask probability. 

As we can see, BERT's masked language modeling objective is the **same training objective as text diffusion, but just for a subset of masking rates**.
By introducing variable masking rates (from 0 to 1) and a scheduled sequence of denoising steps (inspired by diffusion theory), we can transform BERT’s masked language modeling objective into a full generative procedure.



## RoBERTa Diffusion
---

In 2019, [RoBERTa](https://arxiv.org/abs/1907.11692) was released. It was essentially just an enhancement of the original BERT model, with better hyperparameters, data training size, and a more simple training objective (MLM only, removed next sentence prediction).

Here, we use the HuggingFace `transformers` and `dataset` libraries to pull in the original RoBERTa weights, tokenizer, and the Trainer class to easily finetune the model on the WikiText dataset.
The main code ([full code here](https://github.com/nathan-barry/RoBERTaDiffusion)) looks like this below:


```python
# Load and tokenize dataset and instantiate the model
dataset = load_dataset("wikitext", "wikitext-2-raw-v1")
tokenizer = RobertaTokenizerFast.from_pretrained("roberta-base")
model = RobertaForMaskedLM.from_pretrained("roberta-base")

# Create the training args and Trainer instance
training_args = TrainingArguments(
    output_dir="finetuned-roberta-diffusion",
    overwrite_output_dir=True,
    num_train_epochs=NUM_EPOCHS,
    per_device_train_batch_size=BATCH_SIZE,
    save_strategy="epoch",
    save_total_limit=1,
    logging_steps=200,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["validation"],
    data_collator=diffusion_collator, # custom implementation
    tokenizer=tokenizer,
)

# Train & save
trainer.train()
trainer.save_model("finetuned-roberta-diffusion")
```

Currently, we have 10 diffusion steps, so we randomly sample a percentage $p$ out of `mask_probs` (1.0, 0.9, 0.9, ..., 0.1) and mask that percent of the tokens in each batch.
The custom `diffusion_collator` function ([see code here](https://github.com/nathan-barry/RoBERTaDiffusion/blob/main/finetune.py#L77)) samples one mask-probability `p` from `mask_probs` per batch and sets each token to `<MASK>` with `p` probability.

To be able to condition the generation on a "prompt", we currently never mask the first 16 tokens. That means that during training, each step will always have the first 16 tokens as context for generation.

Simplified code for the `diffusion_collator` looks like:

```python
  def diffusion_collator(examples):
      batch = tokenizer.pad(examples, return_tensors="pt")

      # Randomly select masking probability for this batch
      mask_prob = random.choice([1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1])

      # Never mask the first PREFIX_LEN tokens (preserved context)
      maskable_positions = batch.input_ids[:, PREFIX_LEN:]

      # Create random mask for the chosen probability
      mask = torch.rand(maskable_positions.shape) < mask_prob

      # Apply masking
      batch.input_ids[:, PREFIX_LEN:][mask] = tokenizer.mask_token_id
      batch.labels = batch.input_ids.clone()

      return batch
```

For inference, we start with an input that is a tensor of size 256 (since we are generating blocks of 256 tokens). The first 16 positions are the token ids that correspond to the prompt, and the last 240 are just `<MASK>` tokens. We iterate through the denoising schedule, and at each step, we generate a prediction and then remask the sequence again. The process looks like this:

```
Step 0: [PREFIX] <mask> <mask> <mask> <mask> <mask> ...     (100% masked)
Step 1: [PREFIX] will <mask> over <mask> control ...        (90% masked)
Step 2: [PREFIX] will begin <mask> greater control ...      (80% masked)
...
Step 10: [PREFIX] will begin to assert greater control ...  (0% masked - DONE)
```

Simplified code for generation looks like:

```python
# Generate text through iterative denoising
for step, mask_prob in enumerate(mask_probs):
    # Forward pass: predict masked tokens
    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        predictions = outputs.logits  # shape: (1, MAX_LEN, vocab_size)

    # For each masked position, sample from top-k/top-p filtered distribution
    for pos in range(PREFIX_LEN, MAX_LEN):
        if input_ids[0, pos] == tokenizer.mask_token_id:
            logits = predictions[0, pos, :]
            # Apply top-k and top-p filtering
            filtered_logits = top_k_top_p_filtering(logits, top_k=TOP_K, top_p=TOP_P)
            probs = F.softmax(filtered_logits, dim=-1)
            # Sample token
            sampled_token = torch.multinomial(probs, 1)
            input_ids[0, pos] = sampled_token

    # Re-mask a portion of non-prefix tokens for next iteration
    if mask_prob > 0:
        mask_indices = torch.rand(MAX_LEN - PREFIX_LEN) < mask_prob
        input_ids[0, PREFIX_LEN:][mask_indices] = tokenizer.mask_token_id
```

> Note: There are many different ways to do inference with these models. In the example above, we did something what might be referred to as "iterative refinement". This method doesn't take into account token confidence and can lead to indiscriminantly remasking "good" tokens.
>
> Other methods include `top-k parallel decoding`, where you unmask the top $k$ most confident tokens at each step, and `confidence-aware parallel decoding`, where you unmask all tokens that are above some confidence threshold (or the most confident token, if none meet that criterion). Because these methods prioritize "revealing" the most confident tokens first, it tends to lead to more coherent output.
> Both these methods never remask, which has also been suggested to have nice mathematical properties.[^2]
>
> Interestingly enough, in this experiment, the last method gave less coherent outputs than the first (lots of repeating the same words). I believe this is because the model is heavily undertrained for this new training objective (for the amount of compute I've given it), and the iterative refinement's randomness in remasking actually makes it more robust to this specific type of degeneration. Food for thought!

Here is an example output generation of the fine-tuned model after training on an H200 for 30 minutes (the first line is the initial prompt):

```
Following their victory in the French and Indian War, Britain began to assert
greater...

...dominion over Europe beginning about the early 19th. There conflict took
place on the island, between British and Irish Ireland. British officials 
administered British Ireland, a Celtic empire under the control of the Irish 
nationalist authorities, defined as a dominion of Britain. As the newly Fortic 
states acquired independent and powerful status, many former English colonies
played their part in this new, British @-@ controlled colonial system. Following
this period the Non @-@ Parliamentaryist Party won its influence in Britain in 
1890, led by the support of settlers from the Irish colonies. Looking inwards, 
Sinclair, Lewis questioned, and debated the need to describe " The New Britain "
```

The output looks surprisingly coherent! Most of the quirks present are actually just quirks from the formatting of WikiText (spaces around punctuation ` " `, turning hyphens `-` into `@-@`).

Below is a comparison between our diffusion model and GPT-2:

<img alt="RoBERTa Diffusion vs GPT" style="max-width: 100%" src="/images/roberta-diffusion-gpt.gif">

We see GPT-2's output is more coherent and slightly faster (~9 seconds vs ~13) but I'm pleasantly surprised with how good my simple implementation was. It is a good proof of concept, and with new approaches like AR-Diffusion and Skip-Step Diffusion (and a more optimized implementation), the quality and speed can be drastically improved.

> Note: This difference in speed is an "apples to oranges" comparison. The GPT-2 inference is using a library that has been heavily optimized, while my code is not.
>
> There are serious differences in performance characteristics between the two different architectures, and it is an open question whether diffusion language models can out perform autoregressive models in deployed settings.[^3]



## Conclusion
---

We’ve seen that masked language models like RoBERTa, originally designed for fill-in-the-blank tasks, can be repurposed into fully generative engines by interpreting variable-rate masking as a discrete diffusion process. By gradually corrupting text with `<MASK>` tokens and training the model to iteratively denoise at increasing mask intensities, we effectively turn the standard MLM objective into a step-by-step generation procedure.

Even without architectural changes, a fine-tuned RoBERTa can generate coherent looking text after slightly modifying the training objective, validating the idea that BERT-style models are essentially just text diffusion models trained on one masking rate.



#### Footnotes
[^1]: After I wrote the article, I stumbled upon the paper [DiffusionBERT](https://arxiv.org/abs/2211.15029), which does essentially the same thing but with more rigorous testing! Check it out if this post interested you.
[^2]: The addition of never remasking simplifies [D3PM](https://arxiv.org/abs/2107.03006)'s NELBO training objective and leads to an improved likelihood, according to the paper, [Simple and Effective Masked Diffusion Language Models](https://arxiv.org/abs/2406.07524)
[^3]: Bidirectional attention disallows the naive use of KVCaching. Additionally, it turns the attention mechanism from a memory-bound to a compute-bound operation, reducing the effectiveness of batching requests together (the GPU is already saturated). This is an area that requires further study and improvements, as there are probably many more tricks to getting around this (like [KVCache approximation](https://arxiv.org/abs/2505.22618)).
