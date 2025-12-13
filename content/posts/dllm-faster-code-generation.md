+++
title = "Text Diffusion Models are Faster at Writing Code"
date = 2025-12-13T08:13:54-06:00
tags = ["Machine Learning"]
+++



## Speculative Decoding and Diffusion Language Models
---
In speculative decoding (for autoregressive models), we speed up generation by using a smaller model to generate multiple tokens, which are then verified in parallel by a larger model.
The core idea is that most tokens are easily predictable; thus, we should be able to use a smaller and faster model for them.
The classic example is the following sentence:

>“Geoffrey Hinton did his PhD at the University ___ ___”.

A small model can predict the next word “of” with high confidence, while the next token “Edinburgh” is much harder, requiring a larger model to verify.

Language diffusion models *sort-of* have something analogous to speculative decoding built-in by default (and in some ways, a better version).

For diffusion language models with confidence-aware parallel decoding[^1], the model generates all tokens above a given confidence threshold at each step. Thus, “easy” tokens are generated in parallel.
Some ways in which this is better than speculative decoding is that it is global (works across the entire context, not just for the next K tokens) and doesn’t require running two separate models.
In the following example:

> Repeat the word grape over and over again.

a diffusion language model could generate the prediction "grape" for the entire context length in one step, while in speculative decoding, even if the entire sequence is easily predictable, it can only predict K tokens at a time (typically around 4-8, from what I've read).

<img alt="language diffusion vs speculative sampling on grape example" style="max-width: 100%" src="/images/grape-diffusion.gif">



## Coding is Structured Generation
---
This benefit of increased parallel decoding partially depends on the structuredness of a text, which exists on a spectrum. An increase in confidence per output token directly leads to more tokens being decoded on average per step.[^1]

> Increased structure -> reduced entropy -> increased confidence -> higher parallel decoding

The grape example above is trivially structured, while normal text generation is unstructured and high entropy. Writing code (an actually useful domain) is somewhere in between.

I had a large hunch that for structured tasks (like coding), the average number of tokens generated in parallel per step is higher than in normal text generation, and monotonically increases with the amount of structuredness present in the domain of the output.

I recall reading that [Google Gemini](https://deepmind.google/models/gemini-diffusion/) was much closer to *state of the art* for code generation than it was for reasoning tasks when it was first released. Perhaps this improvement for structured tasks is a general motif when it comes to these models?



## Experiments and Results
---
I threw together a small test and used the model from the paper [Fast dLLM v2](https://arxiv.org/abs/2509.26328) (available on Huggingface) to generate roughly 256 tokens for 10 different prompts (each ran 10 times on A100s with an additional 2 generations for warmup):
- Trivially Structured:
  - Repeat the word grape over and over again.
- Code Generation:
  - Write a Python function which, when given an array nums of unique integers, returns all the possible permutations. You may return the answer in any order.
  - Write a Python class for a binary search tree with insert, search, and delete methods.
  - Implement bubble sort in Python with detailed comments explaining each step.
- Structured Data:
  - Generate a comprehensive JSON schema for an e-commerce order system. Include nested objects for: customer information, payment details, shipping information, and order metadata. Populate with realistic example data.
  - Write complete HTML markup for a responsive user registration form that includes: personal information fields, address fields, and submit/reset buttons. Include proper form structure with fieldsets, labels, appropriate input types, required attributes, and placeholder text.
- Unstructured Text
  - Write a creative short story about a time traveler discovering an ancient civilization.
  - Explain the philosophical implications of artificial consciousness and whether machines can truly think.
  - Describe the history of the Renaissance period in Europe.
- Memorized:
  - Recite to me the Declaration of Independence, word for word, starting with 'The unanimous Declaration of the'.
  
The code for everything can be [found here](https://github.com/nathan-barry/dllm-structured-generation-tests), which additionally includes generated output and metadata for each run. Below are the results:

```
Trivially Structured (Grape):
  Average: 108.41 tokens/sec
    - Trivially Structured - Repeat Grape: 108.41 ± 2.46 tok/s

Code Generation:
  Average: 72.14 ± 18.37 tokens/sec
    - Code - Return Permutations: 54.95 ± 0.11 tok/s
    - Code - Binary Search Tree: 97.61 ± 0.52 tok/s
    - Code - Bubble Sort: 63.86 ± 1.02 tok/s

Structured Data:
  Average: 53.86 ± 1.33 tokens/sec
    - Structured Data - JSON: 52.53 ± 0.28 tok/s
    - Structured Data - HTML: 55.19 ± 1.23 tok/s

Unstructured Text:
  Average: 31.01 ± 2.06 tokens/sec
    - Unstructured - Creative Story: 28.10 ± 0.57 tok/s
    - Unstructured - Abstract Essay: 32.63 ± 0.59 tok/s
    - Unstructured - Historical Description: 32.31 ± 0.10 tok/s

High Confidence (Memorized):
  Average: 34.74 tokens/sec
    - Memorized - Declaration of Independence: 34.74 ± 0.75 tok/s

============================================================
KEY FINDING - Code vs Unstructured Text:
Code generation: 72.14 tok/s
Unstructured text: 31.01 tok/s
Speedup: 2.33x
============================================================
```

As predicted, the grape example was dramatically faster than the unstructured text. What was surprising was how much faster (2.33 times speedup!) code generation was compared to unstructured text, even across multiple examples.

More testing should be done, but I imagine that there is a negative correlation between relative speedup and program complexity, and that boiler plate code (ex. `self.input = input`) would have a higher speedup compared to logic-heavy sections.

Another interesting result was that generating the start of the Declaration of Independence, a document which the model must have memorized, didn't have much speedup. This tiny ablation study suggests that it really is the structuredness of the output, not memorization, which matters.



## Conclusion
---
This was a small test thrown together in under an hour, and more rigorous evaluations should be done, but these preliminary results hint that this idea might be true to some degree.

An important limitation to address: In autoregressive decoding, we [constrained decoding](https://www.aidancooper.co.uk/constrained-decoding/) where we set all syntactically invalid tokens to have a probability of zero, ensuring that we are only generating text which follows some rules (JSON formatting, syntactically correct code, etc). For diffusion language models, this can't naively be applied. However, similar to figuring out KVCache reuse with the advent of [KVCache approximation](https://arxiv.org/abs/2505.22618), we might find a practical solution to this problem.[^2]



#### Footnotes
[^1]: Read the section "Confidence-Aware Parallel Decoding" in the paper, [Fast-dLLM](https://arxiv.org/abs/2505.22618).
[^2]: There are lots of papers of doing semi-autoregressive generation using diffusion language models. See [AR-Diffusion](https://arxiv.org/abs/2305.09515), [Fast-dLLM](https://arxiv.org/abs/2505.22618), [Block Diffusion](https://arxiv.org/abs/2503.09573), etc.
