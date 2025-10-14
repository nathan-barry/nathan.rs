+++
title = "Can BERT do Language Diffusion?"
date = 2025-06-03T13:22:01-07:00
tags = ["Machine Learning"]
draft = true
+++

<br>
<img alt="RoBERTa Diffusion" style="max-width: 100%;" src="/images/roberta-diffusion.gif">
<br>

(THIS IS AN UNFINISHED ROUGH DRAFT)

Google DeepMind recently unveiled Gemini Diffusion, an experimental language model that generates text using diffusion. Unlike traditional GPT-style models that generate one word at a time, Gemini Diffusion creates whole blocks of text by refining random noise step-by-step.

After reading the paper "Large Language Diffusion Models", I was surprised to find that discrete language diffusion is just a variation of masked language modeling (MLM), something we’ve been doing since 2018.
This is a write-up over my attempt to fine-tuned RoBERTa (an old MLM model) to do language generation.




## A Short History of Transformers
---
The Transformer architecture, introduced in the 2017 paper “Attention is all you need”, was built around an encoder-decoder framework. In 2018, researchers realized that the encoder and decoder components of the model could be decoupled (with the advent of BERT and GPT), and two distinct families of models were created:

1. **Encoder-only models (BERT-style, bidirectional)**
    - Focus on masked language modeling (MLM): randomly mask out a subset of tokens of each input, train the encoder to reconstruct the missing tokens (fill in the blanks).
    - Sees the entire (partially masked) context at once, learns bidirectional representations.
    - Excelled at tasks requiring a full‐sentence (or paragraph) representation (e.g., classification and retrieval).

2. **Decoder-only models (GPT-style, autoregressive)**
    - Focus on next‐token prediction: at each position $t$, predict the token at position $t + 1$ given all tokens up to $t$ as context.  
    - Sees only left context (unidirectional), learns to predict the next token in the sequence.
    - Excelled at generative tasks where you produce text one token at a time, such as open‐ended generation, summarization, and translation.

Both BERT and GPT were released in 2018. Originally, BERT saw immediate use in tasks such as classification, whereas GPT remained a research novelty due to its minimal generation capabilities. Eventually, the generation capabilities of autoregressive transformers vastly improved, and the general training objective of “next token prediction” meant a much larger space of possibilities and use cases.


## Discrete Language Diffusion Models
---

Diffusion models were first popularized in image generation. In image generation, diffusion models gradually add Gaussian noise to an image (forward process) and then train a neural network to iteratively denoise it (reverse process). A high‐level summary of continuous diffusion with images is:

1. **Forward process**: Start from a clean image _x₀_, then add small amounts of (usually Gaussian) noise at each timestep until you end up with near‐pure noise.  
2. **Reverse process**: Train a model (often a U‐Net) to predict the noise at each timestep, gradually recovering the original image in discrete denoising steps.

Applying this idea to language means we need a way to add noise to text and then remove it in stages. 
The simplest way to do this is a **masking‐based noise process**:

1. **Forward (masking) process**:  
   - At timestep _t = 0_, you have a fully uncorrupted text sequence.  
   - At each subsequent timestep _t > 0_, randomly replace a fraction of tokens with a special `[MASK]` token according to a pre‐defined schedule (e.g., gradually increasing the masked proportion from 0% to 100%).  
   - By the final timestep _T_, the entire sequence may be masked (all tokens are `[MASK]`).

2. **Reverse (denoising) process**:  
   - Train a model (often a standard Transformer encoder) to predict the original token IDs given a partially masked sequence at timestep _t_.  
   - This is akin to performing masked language modeling at varying mask rates: at early timesteps, only a few tokens are masked (easy to predict); at later timesteps, many tokens are masked (harder).  
   - By chaining together predictions from high‐mask‐rate back down to zero, you can recover (or generate) a full sequence.

In this discrete diffusion framework, the model learns a **likelihood bound** on the data distribution by optimizing a sum of denoising losses over all timesteps, rather than a single MLM objective at a fixed mask probability. 

By introducing variable masking rates and a scheduled sequence of denoising steps (inspired by diffusion theory), we can transform BERT’s masked language modeling objective into a full generative procedure.

## RoBERTa Diffusion
---

In 2019, the paper RoBERTa was released. It was essentially just an enhancement of the original BERT model, with better hyperparameters and data training size.

I used the HuggingFace `transformers` and `dataset` libraries to easily pull in the original RoBERTa weights, tokenizer, and the Trainer class to easily finetune the model on the WikiText dataset.
The code looks like this below:

```python
# Load and tokenize dataset and instantiate the model
dataset = load_dataset("wikitext", "wikitext-2-raw-v1")
tokenizer = RobertaTokenizerFast.from_pretrained("roberta-base")
# ...
tokenized = dataset.map(
    tokenize_function,
    batched=True,
    remove_columns=["text"],
)

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

The custom `diffusion_collator` function (see code in repo) is doing the heavy lifting:
1. Currently we have 10 diffusion steps, so we randomly sample a percentage $p$ out of `mask_probs` (1.0, 0.9, 0.9, ..., 0.1) and mask that percent of the tokens each batch.
2. Diffusion models generate text in chunks of a fixed size. I chose 256 mainly since 512, what RoBERTa normally uses, was too long to fit into a visualization.
3. To be able to condition the generation on a "prompt", we currently never mask the first 16 tokens. That means that during training, each step will always have the first 16 tokens as context for generation.

Here is an example output generation of the fine-tuned model with the first line as the prompt:

```
Following their victory in the French and Indian War, Britain began to assert
greater ...

... dominion over Europe beginning about the early 19th. There conflict took
place on the island, between British and Irish Ireland. British officials 
administered British Ireland, a Celtic empire under the control of the Irish 
nationalist authorities, defined as a dominion of Britain. As the newly Fortic 
states acquired independent and powerful status, many former English colonies
played their part in this new, British @-@ controlled colonial system. Following
this period the Non @-@ Parliamentaryist Party won its influence in Britain in 
1890, led by the support of settlers from the Irish colonies. Looking inwards, 
Sinclair, Lewis questioned, and debated the need to describe " The New Britain "
```

This output is suprisingly decently coherent.
The spaces around certain punctuation and also the appearence of "@-@" are just quirks of the formatting of WikiText (`British-controled` becomes `British @-@ controled`).

Below is a comparison between our diffusion model and GPT-2:

<br>
<img alt="RoBERTa Diffusion vs GPT" style="max-width: 100%" src="/images/roberta-diffusion-gpt.gif">
<br>

We can clearly see that GPT-2 is much more coherent and slightly faster (~9 seconds vs ~13) but I'm pleasantly suprised with how good my simple implementation was. It is a good proof of concept, and with new approaches like AR-Diffusion and Skip-Step Diffusion, the quality and speed can be drastically improved.

### Conclusion

In this exploration, we’ve seen that masked language models like RoBERTa, originally designed for fill-in-the-blank tasks, can be repurposed into fully generative engines by interpreting variable-rate masking as a discrete diffusion process. By gradually corrupting text with `[MASK]` tokens and training the model to iteratively denoise at increasing mask intensities, we effectively turn the standard MLM objective into a step-by-step generation procedure. Our proof-of-concept demonstrates that even without architectural changes, RoBERTa can produce surprisingly coherent passages, validating the core idea that “language diffusion” is, at heart, a generalization of classical masked language modeling.

Of course, there’s a trade-off. Compared to decoder-only transformers like GPT-2, diffusion-based RoBERTa is currently slower and its outputs—while coherent—can exhibit artifacts such as suboptimal punctuation spacing or tokenization quirks from the WikiText dataset. However, this gap can be narrowed through a number of promising directions:

* **Advanced schedules**: Techniques like AR-Diffusion or Skip-Step Diffusion can reduce the number of denoising steps without sacrificing quality, dramatically improving generation speed.
* **Hybrid architectures**: Incorporating lightweight decoder modules or cross-attention layers could help the model focus on longer-range dependencies during the reverse process.
* **Fine-tuned tokenization**: Adapting the tokenizer or employing byte-pair encodings that minimize artifacts (e.g., reducing occurrences of `@-@`) will make outputs cleaner.
* **Larger pre-training corpora**: Re-training or further pre-training on data closer to the target domain can improve both fluency and factual accuracy.

Ultimately, discrete language diffusion offers a compelling alternative to autoregressive generation—one that leverages bidirectional context at every step and provides a principled likelihood framework for text. As the research community continues to refine diffusion schedules and model architectures, we can expect these models to close the gap on speed and coherence, unlocking new possibilities for flexible, high-quality text generation. If you’re curious to experiment further, the full code and model checkpoints are available in the repo—happy diffusing!
