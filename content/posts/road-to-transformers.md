---
title: "The Road to Transformers"
date: 2023-10-07T15:54:05-05:00
tags:
  - "Class Notes"
---

> These are my notes from Eunsol Choi's NLP class at UT Austin, cleaned up and stitched together into a single story (with the future help of GPT-5.5).

Before Transformers ate the world, NLP was a patchwork of ideas that each solved one piece of the puzzle. You had classifiers that could tell spam from not-spam, sequence models that could read a sentence left to right, and embeddings that turned words into geometry. None of these were dead ends. The Transformer is best understood not as a clean break but as the moment all of these threads got braided together.

This post walks that road in roughly the order the ideas arrived. We'll start with the most basic question in all of machine learning — *how do you assign a label to something?* — and end with self-attention.



## Classification: Generative vs. Discriminative

Almost every task in classical NLP can be framed as classification: given some text $x$, assign it a label $y$. Is this review positive or negative? Is this word a noun or a verb? Is this email spam?

There are two fundamentally different philosophies for how to build such a classifier, and the distinction shows up everywhere once you learn to see it.

**Generative models** try to model the joint distribution $p(x, y)$ — the full story of how the data was *generated*. They assume a functional form for both $p(y)$ (how likely is each label) and $p(x \mid y)$ (what does the data look like given a label). To classify a new point, you ask which label was most likely to have produced it:

$$
\hat{y} = \text{argmax}_{y \in C} \; p(y) \, p(x \mid y)
$$

Naive Bayes and Bayesian networks live here.

**Discriminative models** skip the storytelling. They model the conditional $p(y \mid x)$ directly — the only quantity you actually need to make a decision — and never bother to describe how $x$ itself is distributed:

$$
\hat{y} = \text{argmax}_{y \in C} \; p(y \mid x)
$$

Logistic regression, perceptrons, and essentially all neural networks are discriminative. They tend to win at raw prediction accuracy, since they spend all their capacity on the decision boundary rather than on modeling the data. Generative models, in exchange, give you a probability model of $x$ you can sample from or reason about.

Here are the four classic classifiers from the course, and what really separates them:

| Model | How parameters are learned | Characteristics | Training |
|---|---|---|---|
| Naive Bayes | Counting data statistics | Generative, probabilistic | One pass through data |
| Log-linear | Gradient descent | Discriminative, probabilistic | SGD (batched) |
| Perceptron | Reacting to mistakes | Discriminative | Iterate to best validation accuracy |
| Neural network | Gradient descent + backprop | Discriminative, probabilistic | SGD (batched) |

### Naive Bayes

Naive Bayes is the canonical generative classifier. It makes one heroic assumption — that every feature is *conditionally independent* given the label. For text, that means the model pretends each word in a document was drawn independently once you know the topic. This is obviously false (words depend on each other constantly), but the assumption makes the math trivial and the model works shockingly well in practice.

Under that assumption, the joint probability factorizes into a product over words:

$$
p(x, y) = p(y) \prod_{i=1}^{|x|} p(w_i \mid y)
$$

You learn each $p(w_i \mid y)$ by simply counting word frequencies per class — a single pass over the data, no optimization required. To classify a new document, you pick the label that maximizes the same product:

$$
\hat{y} = \text{argmax}_{y \in C} \; p(y) \prod_{i=1}^{|x|} p(w_i \mid y)
$$

### Log-Linear (Maximum Entropy) Models

Log-linear models — logistic regression and its multi-class cousin — are the discriminative answer to Naive Bayes. Instead of counting, they learn weights $w$ over a feature vector $\phi(x)$ by gradient descent.

For **binary** classification, you squash a linear score through a sigmoid to get a probability:

$$
P(y = 1 \mid x, w) = \frac{1}{1 + e^{-(w \cdot \phi(x))}}
$$

For **multi-class** classification, the sigmoid generalizes to a softmax over a joint feature vector $\phi(x, y)$ that depends on both input and candidate label:

$$
P(y \mid x, w) = \frac{e^{\,w \cdot \phi(x, y)}}{\sum_{y'} e^{\,w \cdot \phi(x, y')}}
$$

and you predict the highest-scoring label, $\hat{y} = \text{argmax}_{y \in C} \; w \cdot \phi(x, y)$.

The "maximum entropy" name comes from a beautiful fact: among all distributions consistent with the feature statistics you've observed, the softmax is the one that assumes the *least* beyond them — the flattest, highest-entropy distribution that still fits the data.

### The Perceptron

The perceptron is the simplest neural network there is, and it learns in the most intuitive way imaginable: it only reacts when it's wrong. Start with a weight vector of all zeros and make predictions using the sign of a linear score:

$$
\hat{y} = \text{sign}(w \cdot \phi(x^i))
$$

- **If correct** ($\hat{y} = y^i$): do nothing.
- **If wrong**: nudge the weights toward the right answer.
  - True label positive: $w \leftarrow w + \phi(x^i)$
  - True label negative: $w \leftarrow w - \phi(x^i)$

There's a clean way to see the perceptron as a hard-edged version of logistic regression. Logistic regression updates by $w \leftarrow w + \phi(x)\,(1 - P(y=1 \mid x))$ for positive examples and $w \leftarrow w - \phi(x)\,P(y=1 \mid x)$ for negative ones. The perceptron is just the limit where that probability collapses to 0 or 1 — a fully confident model that only corrects outright mistakes.

### Neural Networks

A neural network stacks the same basic unit the perceptron uses, but with a smooth nonlinearity so it can be trained by gradient descent. A single neuron computes

$$
\sigma\!\left(\sum_i w_i x_i + b\right)
$$

where $\sigma$ is a nonlinear activation, the $w_i$ are weights, and $b$ is a bias. Wire many of these together in layers and you can represent wildly nonlinear decision boundaries.

The reason this is tractable at all is **backpropagation**: by treating the network as a computational graph and applying the chain rule backwards through it, you can compute the gradient of the loss with respect to *every* parameter in time linear in the size of the graph. That single algorithm is what makes everything after this section possible.

### Training: Cross-Entropy and Gradient Descent

Whatever the classifier, the goal is the same — make the predicted distribution match the true one. The standard way to measure the gap is **cross-entropy loss**:

$$
H(p, q) = -\,\mathbb{E}_p[\log q]
$$

For a single labeled example, where the truth puts all its mass on the correct label $y^i$, this collapses to the negative log-probability the model assigns to that label:

$$
H = -\log p(y^i \mid x^i)
$$

Minimizing this over the dataset is identical to *maximizing* the log-likelihood of the data:

$$
L(w) = \log \prod_{i=1}^N p(y^i \mid x^i; w) = \sum_{i=1}^N \log p(y^i \mid x^i; w)
$$

and we hunt for the weights $w^* = \text{argmax}_w \, L(w)$ by walking downhill on the loss. The size of each step is the learning rate $\eta$: too small and training crawls; too large and it overshoots the minimum and can diverge. (Optimizers like Adam exist precisely to make this step-size problem less painful, but that's [a separate story](/posts/gd/).)



## Representing Words

Classifiers are only as good as the features you feed them. The most naive way to represent a word is **one-hot encoding**: a vector of all zeros with a single 1 in the slot for that word. But one-hot vectors are useless for capturing meaning — every pair of distinct words is exactly equidistant, so "cat" is no closer to "dog" than it is to "democracy."

**Word embeddings** fix this by mapping each word to a dense vector in a continuous space, learned so that words used in similar contexts end up near each other. This is the *distributional hypothesis* made concrete: you shall know a word by the company it keeps.

### Word2Vec

The most famous recipe for learning embeddings is Word2Vec, which comes in two flavors that are mirror images of each other:

1. **Continuous Bag of Words (CBOW)** predicts a target word from its surrounding context:
   $$
   P(w \mid w_{-1}, w_{+1}) = \text{softmax}\big(W \cdot (c(w_{-1}) + c(w_{+1}))\big)
   $$

2. **Skip-gram** flips it around and predicts the context from the target word:
   $$
   P(w' \mid w) = \text{softmax}\big(W \cdot e(w)\big)
   $$

Both are trained as simple prediction tasks over a large corpus. The trick is that we don't care about the prediction itself — we care about the weight matrix $W$ we learn along the way, whose rows *are* the embeddings. Train the network to predict context well, and meaning falls out of the weights for free.

### GloVe

GloVe (Global Vectors) takes a more statistical route. Instead of sliding a prediction window over the text, it builds a global word–context co-occurrence matrix for the whole corpus and factorizes it. Where Word2Vec captures local context one window at a time, GloVe bakes in corpus-wide co-occurrence statistics directly. Both land in a similar place: a geometry where directions encode meaning.



## Language Modeling

Embeddings tell us what individual words mean. **Language modeling** asks a harder question: how likely is an entire *sequence* of words? Formally, a language model estimates the probability of a sequence, usually by factoring it into next-word predictions. This single capability underpins a startling range of applications — machine translation (pick the most probable translation), speech recognition (disambiguate words that sound alike), autocomplete, and eventually all of generative AI.

### N-Grams

The classical approach is the **n-gram model**. An n-gram is a contiguous run of $n$ tokens, and an n-gram model predicts the next word using only the previous $n-1$ words — a fixed, finite window of context. You estimate the probabilities by **Maximum Likelihood Estimation**: count how often each n-gram appears in your training corpus and normalize.

The Achilles' heel of n-grams is **sparsity**. Language is endlessly creative, so no matter how large your corpus, you'll constantly encounter n-grams at test time that never appeared in training — and the model assigns them probability zero. The classic patch is **Laplace (add-one) smoothing**: pretend you saw every possible n-gram one extra time, so nothing has zero probability. It works, but it bluntly overestimates rare events.

N-grams might look like a historical footnote, but they're surprisingly far from dead — you can scale them to unbounded context with suffix arrays and get a parameter-free language model that generates real text. I wrote a [whole separate post](/posts/unbounded-n-gram/) on doing exactly that.

### Evaluating a Language Model

There are two ways to judge a language model:

- **Extrinsic** evaluation measures performance on a downstream task you actually care about — for example, Word Error Rate in a speech recognition pipeline. This is what ultimately matters, but it's expensive and entangles the LM with the rest of the system.
- **Intrinsic** evaluation measures how well the model fits held-out text on its own terms. The standard metric is **perplexity**:
  $$
  PP = 2^{-l}
  $$
  where $l$ is the average log-probability the model assigns to the test set. Lower is better. Intuitively, perplexity is the *effective number of choices* the model is deciding between at each step — a perplexity of 3 means it's as uncertain as if it were guessing uniformly among three words. (If you want the full likelihood-to-perplexity derivation, I work through it in the [n-gram post's appendix](/posts/unbounded-n-gram/#appendix-likelihood-loss-and-perplexity).)



## Neural Sequence Models

N-grams are fundamentally limited by their fixed window: a 5-gram can never use information from six words ago. The neural era of NLP is largely the story of escaping that window — building models that can, in principle, carry information across an entire sequence.

### Recurrent Neural Networks

The RNN was the first serious attempt. Instead of a fixed window, it carries a **hidden state** $h_t$ — a running summary of everything seen so far — and updates it one token at a time:

$$
h_t = \text{activation}(W_{hh} \, h_{t-1} + W_{xh} \, x_t + b_h)
$$
$$
y_t = W_{hy} \, h_t + b_y
$$

The same weight matrices $W_{hh}, W_{xh}, W_{hy}$ are reused at every time step, which is what lets a single RNN handle sequences of any length. In theory, $h_t$ can encode arbitrarily long-range context.

### The Vanishing Gradient Problem

In practice, that promise breaks down. Training an RNN means **backpropagation through time** — unrolling the network across every step and propagating gradients all the way back. With a squashing activation like $\tanh$, each step multiplies the gradient by something less than one, so over many steps the gradient shrinks exponentially toward zero.

The result is **vanishing gradients**: the model effectively can't learn dependencies more than a handful of steps apart. It's a kind of catastrophic forgetting — by the time the signal travels back far enough to matter, there's nothing left of it.

### LSTMs

Long Short-Term Memory networks were designed specifically to fight this. An LSTM augments the hidden state with a separate **memory cell** and a set of **gates** — the forget gate, input gate, and output gate — that learn to control what information enters the cell, what gets erased, and what gets read out. Because information can flow along the memory cell with minimal interference, gradients survive across far longer spans, and the model can actually learn long-range dependencies that a vanilla RNN would forget.

### Sequence-to-Sequence

RNNs and LSTMs read a sequence, but many tasks (translation, summarization) require *transforming* one sequence into another of a different length. **Seq2Seq** handles this with two networks:

1. An **encoder** reads the input $x = (x_1, \dots, x_n)$ and compresses it into a single fixed-length **context vector** meant to capture the whole sentence's meaning.
2. A **decoder** takes that context vector and unrolls it into an output sequence $y = (y_1, \dots, y_m)$, which can be a completely different length.

Training maximizes the conditional likelihood of the correct output given the input, predicting each output token from the input and all previously generated tokens:

$$
\max \; \sum_{x,y} \sum_{i=1}^{n} \log P(y_i^\* \mid x,\, y_1^\*, \dots, y_{i-1}^\*)
$$

At inference time the decoder generates left to right, starting from a `<SOS>` token and feeding each prediction back in. How you pick each token matters: greedy decoding takes the single most likely token, while beam search and top-k sampling trade a little speed for noticeably better output.

### Attention

Seq2Seq has an obvious bottleneck, and it's worth dwelling on because it's the seed of everything that follows. The encoder has to cram an *entire* input sentence — however long — into one fixed-size context vector. For a long sentence, that's like summarizing a paragraph in a single number and asking the decoder to reconstruct it.

**Attention** removes the bottleneck. Instead of forcing the decoder to rely on one frozen summary, it lets the decoder look back at *all* the encoder's hidden states and decide, at each output step, which input words to focus on.

Concretely, when producing output token $i$, the model scores every input state $h_j$ for relevance, normalizes the scores into weights with a softmax, and builds a custom context vector as a weighted sum:

$$
\alpha_{ij} = \frac{\exp(e_{ij})}{\sum_{j'} \exp(e_{ij'})}, \qquad e_{ij} = f(\bar{h}_i, h_j)
$$
$$
c_i = \sum_j \alpha_{ij} \, h_j
$$

The scoring function $f$ can be as simple as a dot product. The decoder then uses this freshly assembled $c_i$ to produce its output. The key idea — *let the model dynamically decide what to pay attention to* — turned out to be so powerful that it eventually swallowed the rest of the architecture.

### A Detour: CNNs for Sequences

Before we get there, it's worth noting that recurrence isn't the only way to process sequences. Convolutional neural networks, famous for images, also work on text. A 1D convolution slides learned filters across the sequence, with each filter acting like a learned n-gram detector; stacking layers lets early filters catch local patterns (short phrases) while deeper layers compose them into longer-range structure. **Strides** control how far each filter jumps, letting you trade resolution for speed.

CNNs have real advantages: their filters share weights across the whole sequence (few parameters), and unlike an RNN — which must process tokens one after another — every position can be convolved in parallel. That parallelism foreshadows exactly why the Transformer, which also ditches sequential recurrence, scales so well on modern hardware.



## The Transformer Era

We now have all the pieces: embeddings to represent words, the language-modeling objective to train on, and attention to route information dynamically across a sequence. The final act is putting attention in charge.

### ELMo: Context-Dependent Embeddings

First, a crucial bridge. Word2Vec and GloVe give each word *one* fixed vector — but "bank" in "river bank" and "bank account" obviously shouldn't share an embedding. **ELMo** (Embeddings from Language Models) solves this by producing *contextual* embeddings: the vector for a word depends on the sentence it appears in.

ELMo runs a **bidirectional LSTM** over the text, reading it both left-to-right and right-to-left so that each word's representation absorbs context from both sides:

$$
E(t) = \text{Concat}\big[\, \text{BiLSTM}_{\text{forward}}(t),\; \text{BiLSTM}_{\text{backward}}(t) \,\big]
$$

These representations are pretrained on a huge corpus as a language model, then fine-tuned on whatever downstream task you have. This **pretrain-then-fine-tune** recipe — learn general language structure once, specialize cheaply many times — is the template the entire modern field still runs on.

### Transformers

In 2017, ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762) took the title literally. The Transformer throws out recurrence and convolution entirely and builds the whole model out of attention. Because there's no sequential dependency between positions, the whole sequence is processed in parallel — which is exactly why Transformers train so much faster than RNNs and scale to enormous datasets.

The architecture spawned three families that still define the landscape:

1. **Encoder-only** models (BERT) for understanding tasks like classification and retrieval.
2. **Decoder-only** models (GPT) for generation.
3. **Encoder–decoder** models (T5, BART, and the original Transformer) for sequence-to-sequence tasks.

A few components make it work:

**Self-attention.** The same attention idea from Seq2Seq, but a sequence now attends *to itself*: every token compares against every other token to decide what's relevant. It behaves like a soft, differentiable hash table — a query is matched against keys to retrieve a weighted blend of values:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

Here $Q$, $K$, $V$ are the query, key, and value matrices, and the $\sqrt{d_k}$ scaling keeps the dot products from blowing up as the key dimension grows.

**Multi-head attention.** Run several attention operations in parallel and concatenate them, so the model can attend to different kinds of relationships at once — say, syntax in one head and coreference in another.

**Feedforward layers.** Self-attention only ever re-averages existing value vectors, which adds no nonlinearity on its own. A feedforward network after each attention block supplies that nonlinearity; a final linear layer plus softmax then projects to a probability distribution over the vocabulary.

**Positional embeddings.** Since attention treats its input as an unordered set, the model has no inherent sense of word order. We inject it explicitly by adding positional encodings (often sinusoidal) to the word embeddings.

**Residual connections and layer normalization.** Each sublayer is wrapped in a residual connection, $x_l = F(x_{l-1}) + x_{l-1}$, giving gradients a clean path through very deep stacks, while layer normalization keeps activations well-behaved and training stable.

**Masking.** In a decoder, **masked self-attention** zeroes out attention to future positions so the model can't peek ahead while generating. In an encoder–decoder setup, **cross-attention** lets the decoder attend to the encoder's output — queries from the decoder, keys and values from the encoder — which is exactly the original Seq2Seq attention, now generalized.

### BERT

BERT (Bidirectional Encoder Representations from Transformers) takes the Transformer *encoder* and trains it to understand language deeply by looking in both directions at once. It's pretrained on two self-supervised objectives:

- **Masked Language Modeling.** Randomly hide some fraction of the input tokens and train the model to reconstruct them from the surrounding context, maximizing $\log P(\text{masked word} \mid \text{context})$. Because it sees both left and right context simultaneously, BERT learns genuinely bidirectional representations — something a left-to-right model structurally cannot.
- **Next Sentence Prediction.** Given two sentences, predict whether the second actually follows the first, pushing the model to learn relationships across sentence boundaries.

Like ELMo, BERT is pretrained once on a massive corpus and then fine-tuned for specific tasks — classification, sentiment analysis, question answering, and more.

There's a fun epilogue here. That masked-token objective looks like a one-off trick, but it turns out to be a single step of a *diffusion* process: crank the masking rate up and down on a schedule and a BERT-style model becomes a full text generator. I built one and [wrote about it](/posts/roberta-diffusion/) — it's a neat reminder that the "understanding" and "generation" branches of this tree are closer than they look.



## Conclusion

Step back and the through-line is clear. We started with the basic act of classification and the split between generative and discriminative models. We gave words geometry with embeddings, learned to score whole sequences with language models, and chased long-range context through RNNs, LSTMs, and Seq2Seq. Each hit a wall — fixed windows, vanishing gradients, the context-vector bottleneck — and attention was the idea that kept dissolving those walls, until eventually attention was the whole model.

What's striking in hindsight is how little was thrown away. Cross-entropy, softmax, the pretrain-then-fine-tune recipe, the encoder/decoder split, attention itself — none of it was invented from scratch for the Transformer. It was all sitting in these earlier ideas, waiting to be combined. That's usually how the big jumps happen.
