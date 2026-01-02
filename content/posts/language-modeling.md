+++
title = "Language Modeling: Word Embedings & Architectures"
date = 2023-10-07T15:54:05-05:00
tags = ["Class Notes"]
+++
{{< katex >}}{{< /katex >}}

> These are a few of my notes from Eunsol Choi's NLP class at UT Austin.



## Word Embeddings
Word embeddings are a type of word representation that captures the semantic meaning of words in a continuous vector space. Unlike one-hot encoding, where each word is represented as a binary vector of all zeros except for a single '1', word embeddings capture much richer information, including semantic relationships, word context, and even aspects of syntax.

### Mechanisms for Generating Word Embeddings

#### Word2Vec
One of the most popular techniques for creating word embeddings is Word2Vec, which comes in two flavors:

1. **Continuous Bag of Words (CBOW)**: In this model, the context (surrounding words) is used to predict the target word.
    $$
    P(w|w_{-1}, w_{+1}) = \text{softmax}(W \cdot (c(w_{-1}) + c(w_{+1})))
    $$

2. **Skip-grams**: Here, the target word is used to predict the context. It essentially reverses the roles of the target and context words compared to CBOW.
    $$
    P(w'|w) = \text{softmax}(W \cdot e(w))
    $$

Both models leverage neural networks behind the scenes and are trained on large corpora to generate meaningful embeddings.

#### GloVe (Global Vectors for Word Representation)
GloVe is another method for generating word embeddings. It works by creating a word-context matrix and factorizing it to generate embeddings. The model aims to capture global statistics of the corpus in its embeddings.



## Language Modeling
Language modeling aims to estimate the likelihood of a sequence of words. These models underpin a wide array of applications beyond just generating text. For example, they play a pivotal role in machine translation systems by selecting the most probable translation among various alternatives. Similarly, in automatic speech recognition, language models help in distinguishing between words that sound similar but are spelled differently.

### The Mechanics of N-Gram Models
In the realm of language modeling, n-grams refer to contiguous sequences of 'n' items (words, characters, etc.) from a given sample of text or speech. An n-gram model uses these n-grams to predict the next word in a sequence based on the preceding $n-1$ words.

N-gram models typically employ **Maximum Likelihood Estimation (MLE)** to learn the probabilities. The idea is to count the frequency of each n-gram in the training corpus and then normalize these counts to form probabilities. Mathematically, the conditional probability of each word can be formulated based on its preceding $n-1$ words and their frequency of occurrence.

### Strategies for Handling Sparse Data
Real-world language is infinitely creative, and thus even a vast corpus will contain gaps: n-grams that didn't occur in the training data but might occur in actual usage. This sparsity is a significant challenge in language modeling.

To mitigate the problem of sparse data, **Laplace Smoothing** (or Add-One Smoothing) is commonly used. The technique involves adding a count of one to every n-gram that appears in the training data, including those that didn't appear at all. This way, no n-gram has a zero probability. However, it has the downside of significantly overestimating the probabilities of rare or unseen n-grams, which could introduce bias in the predictions.

### Evaluating the Effectiveness of Language Models
**Extrinsic Evaluation Metrics:**
In extrinsic evaluation, the language model is assessed based on its performance in a specific downstream task, such as machine translation or speech recognition. One example is the Word Error Rate (WER), commonly used in speech recognition to measure the rate at which words are incorrectly recognized.

**Intrinsic Evaluation Metrics:**
For intrinsic evaluation, the focus is on measuring how well the model fits the data it was trained on, without concern for any particular application. One popular metric is perplexity, which quantifies how well the probability distribution predicted by the model aligns with the actual distribution of the words in the text. Lower perplexity is generally better and is mathematically defined as:

$$
PP = 2^{-l}
$$

Where $l$ is the average log-probability of the test set.



## ELMo: Embeddings from Language Models
Unlike traditional word embedding techniques like word2vec or GloVe, which generate a single static vector for each word, ELMo produces dynamic embeddings. This means that the word representation changes based on its contextual usage in a sentence, capturing nuances like polysemy (same word having multiple meanings).

ELMo utilizes a bidirectional Long Short-Term Memory (BiLSTM) architecture to produce its embeddings. The model is trained as a language model on a large corpus of text. The BiLSTM reads the text from both directions (from left to right and right to left), capturing the context surrounding each word. After training, the embeddings are extracted from the hidden layers of the BiLSTM, allowing for rich, context-dependent representations.

When ELMo generates an embedding for a word, it takes into account both the forward and the backward context in which the word appears. This is achieved by concatenating the hidden states of the BiLSTM from both directions. Mathematically, the ELMo representation $ E $ of a token $ t $ is computed as follows:

$$
E(t) = Concat \left[ \text{BiLST}M_{\text{forward}}(t), \text{BiLST}M_{\text{backward}}(t) \right]
$$

ELMo embeddings are pretrained on a large corpus and can be fine-tuned for specific tasks. The pretrained embeddings act as an effective initialization, capturing general language semantics. The fine-tuning step allows the model to adapt to the particular nuances and vocabulary of the specific task at hand, such as named entity recognition or sentiment analysis.



## BERT: Bidirectional Encoder Representations from Transformers
Unlike traditional models that read text data in a single direction (either left-to-right or right-to-left), BERT leverages a Transformer-based model architecture to understand the context and relationships between words in both directions.

BERT utilizes the Transformer architecture, specifically the encoder portion. The model is trained in an unsupervised manner using a combination of two training objectives: Masked Language Modeling and Next Sentence Prediction.

### Training Objectives
**Masked Language Modeling:**
In this task, a certain percentage of input tokens are masked at random. The objective is to predict these masked tokens based on their context. The model learns to understand the syntax and semantics of the language to perform this task efficiently.

$$
\text{Objective: } \log P(\text{Masked Word} | \text{Context})
$$

**Next Sentence Prediction:**
The model is provided with two sentences and tasked to predict if the second sentence logically follows the first one. This task helps BERT to capture long-distance dependencies between words and understand the context at a sentence level.

$$
\text{Input: [CLS] Sentence 1 [SEP] Sentence 2}
$$
$$
\text{Objective: Predict whether Sentence 2 follows Sentence 1}
$$

Similar to ELMo, BERT also follows a two-step process: pretraining and fine-tuning. During pretraining, the model is trained on a large corpus of text using the objectives mentioned above. Once pretrained, BERT can be fine-tuned for specific tasks like text classification, sentiment analysis, and more.



## Transformers
Transformers are a class of neural network architecture that have become the de facto standard for a wide array of natural language processing (NLP) tasks. Introduced in the paper "Attention Is All You Need" by Vaswani et al. in 2017, transformers have replaced recurrent and convolutional neural networks in many applications due to their efficiency and effectiveness in capturing long-term dependencies.

### Variants and Evolutions
Transformers have evolved into various forms:
1. **Encoder-only models** like BERT are primarily used for classification tasks and are pre-trained on a large corpus.
2. **Decoder-only models** like GPT (Generative Pretrained Transformer) are suited for generative tasks.
3. **Encoder-Decoder models** like T5 and BART (and the original transformer model) utilize both encoder and decoder but are trained differently to perform multiple tasks.

### Components
**Self-Attention Mechanism:**
The self-attention mechanism allows each token in the input sequence to focus on other parts of the sequence. It operates akin to a fuzzy hashtable where a query is compared against keys to return a weighted sum of values.
The attention mechanism can be formally represented as:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V
$$

Here, $ Q, K, $ and $ V $ are the query, key, and value matrices, respectively. $ d_k $ is the dimension of the key.
**Feedforward Networks and Output Layer:**
Self-attention essentially re-averages value vectors, introducing no non-linearity. A feedforward layer follows the attention layer to introduce non-linear transformations.

After attention mechanisms, a feedforward network followed by a linear layer projects the embeddings to the output space. Finally, a softmax layer outputs a probability distribution over the vocabulary.

**Residual Connections:**
These connections help in training deep networks by allowing gradients to flow through the network more easily. Mathematically:

$$x_l = F(x_{l-1}) + x_{l-1}$$

**Layer Normalization:**
Normalization within each layer offsets the internal covariate shift, which can impede training.

**Multi-Headed Self-Attention:**
The idea is to run multiple instances of attention in parallel and concatenate their outputs. This allows the model to focus on different aspects of the input simultaneously.

**Positional Embeddings:**
To give the model some information about the positions of the words in the sequence, positional embeddings are added to the word embeddings. These could be sine/cosine functions or even one-hot encoded vectors.

**Masked Multi-Head Self-Attention:**
To prevent the decoder from seeing future tokens, their attention scores are set to zero during computation.

**Encoder-Decoder Attention:**
The decoder attends to the encoder's output. Keys and values come from the encoder, and queries come from the decoder.
