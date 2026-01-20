+++
title = "Generating Shakespeare Without Neural Networks"
date = 2026-01-17T18:47:03-06:00
tags = ["Machine Learning", "2026"]
draft = true
+++
{{< katex >}}{{< /katex >}}

Learning how to generate Shakespeare has become the ["Hello World"](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program) of language models.[^1]
Recently, I've been messing with [alternative language models](https://github.com/nathan-barry/tiny-diffusion) (diffusion language models instead of autoregressive transformers) and came across **unbounded n-gram** models. These models are purely statistical and don't require optimizing weights or training.

A year ago, I read the paper [Infini-gram](https://arxiv.org/abs/2401.17377), which scaled an unbounded n-gram model to trillions of tokens. While their model had applications like supplementing and helping guide LLMs during generation, it did not explore the standalone generation capabilities of the model.

In this post, I'll explain how this model works and how I improved its language generation capabilities, as visualized below:

<img alt="Infini-gram vs GPT" style="max-width: 100%" src="/images/unbounded-n-gram.gif">

*Speed and quality test of my final implementation compared to a nanoGPT implementation, both using the Tiny Shakespeare dataset.*



## Classical N-Grams

An **n-gram** is a sequence of n tokens from a given text, and an **n-gram language model** estimates the probability of each token by **counting how frequently it follows the previous n-1 tokens** in the training dataset.

Normally, datasets consist of many text documents, but for simplicity, let's say our dataset is the following string of characters, with each token being a single character:

```
AABBCCBC
```

We could model this with n-grams of various sizes. For $n=1$ (AKA a unigram), since there are no previous tokens ($n-1=0$), we just count how many times each character appears in the dataset:

```
Counts:       Probabilities:
A: 2          A: .25
B: 3          B: .375
C: 3          C: .375
```

If we wanted to generate more of the sequence, we could just sample from the probability distribution to generate the next token. 

This unigram model isn't entirely too useful as it doesn't use any context of past characters. To gain better modeling capability, we can include the context of the previous character by expanding $n$ from $1$ to $2$ (AKA a bigram).

This causes our lookup table to go from a list of size $n$ to a matrix of size $n\times n$, where the columns are the previous character and the rows are the current character:

```
Counts:            Probabilities:
   A  B  C             A    B    C
A  1  0  0         A  .5    0    0
B  1  1  1         B  .5  .33   .5
C  0  2  1         C   0  .66   .5
```

To generate more of the sequence, we would look at the last character and sample from its column, as each column represents the probability distribution over the potential next tokens.[^2]

We can see that the larger $n$ is, the more previous tokens the model takes into account. This leads to more accurate language modeling ability, but causes the lookup table to **grow exponentially in size**, which makes using large values of $n$ intractable in practice.



## Suffix Arrays and Unbounded N-Grams

Essentially, instead of computing the lookup table for all n-grams for a specific $n$, we can instead simulate any arbitrary n-gram lookup table for a dataset by using a [suffix array](https://en.wikipedia.org/wiki/Suffix_array). This makes using n-grams for large $n$ tractable.

A **suffix array** is a sorted array of all suffixes of a piece of text. It is easiest to understand with an example. Let's take the same example as before, but with each character's index below it:

```
A A B B C C B C   # Dataset
0 1 2 3 4 5 6 7   # Token Indices
```

Below is a list of all the suffixes of this string (including their starting position index), along with a lexographically sorted version:

```
Suffixes:           Sorted:
0: AABBCCBC         0 -> AABBCCBC   # Lexigraphically smallest
1:  ABBCCBC         1 -> ABBCCBC
2:   BBCCBC         6 -> BC
3:    BCCBC         2 -> BBCCBC
4:     CCBC         3 -> BCCBC
5:      CBC         7 -> C
6:       BC         5 -> CBC
7:        C         4 -> CCBC       # Lexigraphically largest
```

The suffix array is an array, not of suffixes, but of their **indices** in this sorted order. These indices act as pointers into the original dataset, in which we can retrieve the suffixes.
We can see that the suffix array for this example is `[0, 1, 6, 2, 3, 7, 5, 4]`.

Below is a simple Python implementation for constructing this data structure:

```python
def createSuffixArray(text: str) -> list[int]:  
    # Create list of (suffix, original_index) tuples
    suffixes = [(text[i:], i) for i in range(len(text))]
    # Sort by suffix string
    suffixes.sort()
    # Extract just the indices
    return [index for suffix, index in suffixes]
    
text = "AABBCCBC"
suffix_array = createSuffixArray(text)
print(suffix_array)  # [0, 1, 6, 2, 3, 7, 5, 4]
```

### Efficient Query Search and Next Character Prediction


Suffix arrays are useful for efficiently counting how many times a string appears in a dataset. If we wanted to see whether the string `CCB` appears in our toy dataset, we can do this in `O(log(n))` time by performing binary search on the suffix array. This comes from the wonderful property of being lexigraphically sorted.

```python
def search(text: str, suffix_array: list[int], query: str) -> bool:
    left, right = 0, len(suffix_array) - 1
    
    while left <= right:
        mid = (left + right) // 2
        suffix = text[suffix_array[mid]:]
        
        # Check if suffix starts with query
        if suffix.startswith(query):
            return True
        elif query < suffix:
            right = mid - 1
        else:
            left = mid + 1
    
    return False

print(search(text, suffix_array, "CCB"))  # True
print(search(text, suffix_array, "ABC"))  # False
```

Since we can efficiently determine whether an arbitrary length query appears in a dataset, we can use this for answering n-gram queries.

Let's say we have the string `BABBC` and we want to know what characters could come next. 
We can check to see if (and how many times) `BABBC` appears in the suffix array.
If it does appear, we count which characters come immediately after, giving us a probability distribution of potential next characters. Otherwise, we shorten the context by one (now `ABBC`) and check again. 
We repeat this process until we eventually find a match. This idea is called **synchronous back-off**.[^3]


```python
def sample(text, suffix_array, context):
    # Sample next character using progressively shorter context suffixes
    for i in range(len(context)):
        query = context[i:]
        chars = []
        # Find all suffixes starting with query (linear scan for simplicity)
        for idx in suffix_array:
            if text[idx:].startswith(query):
                next_pos = idx + len(query)
                if next_pos < len(text):
                    chars.append(text[next_pos])
        if chars:
            return random.choice(chars)

def generate(text, suffix_array, prompt, max_chars):
    result = prompt
    # Generate text up to max_chars
    while len(result) < max_chars:
        result += sample(text, suffix_array, result, result)
    return result
```

What this does is look for the **maximum n-gram for which we have matches**. 

For `BABBC`, it searches for a 6-gram. Since it doesn't appear in the dataset, it then looks to see if `ABBC` appears. Since this does appear, it finds all the times it occurs (appears only once), and results in `C` being the next character (for the 5-gram, `ABBCC`).



## Novel Language Generation

I made [tiny-infini-gram](https://github.com/nathan-barry/tiny-infini-gram/tree/main), an efficient unbounded n-gram implementation written in Go, with [Tiny Shakespeare](https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt) as the dataset. The main reason for Go was that it already had an efficient [suffix array implementation](https://pkg.go.dev/index/suffixarray) in its expansive standard library.

**Observation**: One thing I quickly noticed was that the above sampling method often led to output that was **verbatim copied** from the dataset.

The Infini-gram paper defines a notion of **sparsity**: a sample is sparse if and only if there is exactly one match, and thus, only **one token to predict**. Choosing this token leads to another sparse sample, creating a cycle. This cycle of sparse sampling results in verbatim copying from the dataset *until it reaches the end*.

Let's take the text `First Citizen:\nBefo`. This appears exactly once in our dataset, with the next character being an `r`. If we append the `r` to the original text, we will see that this new version still has exactly one match, with the next character being an `e`.

Continuing this process, we end up generating the rest of the document verbatim from this starting point.

```
First Citizen:\nBefo
First Citizen:\nBefor
First Citizen:\nBefore
...
First Citizen:\nBefore we proceed any further, hear me speak...
```

In some situations, this might be desirable behavior; it essentially acts as a document retrieval mechanism.
We want to generate *new* Shakespeare, however. Thus, we need to think of a new sampling algorithm that allows for novelty without hurting quality.

### Selective Back-off Interpolation Sampling

The idea that I came up with is a variant of **N-gram interpolation**. N-gram interpolation is when you take the weighted mean of multiple n-gram model probability distributions (ex. from unigram, bigram, trigram, etc).

In my algorithm, we select $k$ n-grams to interpolate. To select which ones:
1. **Find the largest n-gram** that contains non-zero probabilities. This $n$ will have $m$ appearances in the dataset (most likely $m=1$).
2. **Back off** until the next $n$ has a new $m$ **which is greater than the previously seen** $m$ (and thus has a different probability distribution).
3. **Repeat $k$ times** and **mix these $k$ probability distributions** (with exponential weight decay or something similar).

This gives us a distribution that's heavily weighted toward the longest context (biasing towards larger $n$) but allows for diversity from shorter contexts (to prevent verbatim copying).

```python
# Pseudocode of sampling algorithm
def sample(text, suffix_array, context, k):
    levels = []
    last_total = 0
    
    # Collect k levels with increasing matches
    for i from 0 to len(context):
        suffix = context[i:]
        
        # Find all matches and count next characters
        counts = {}
        for each position in suffix_array:
            if text at position starts with suffix:
                next_char = character after suffix
                counts[next_char] += 1
        
        # Add level if total increased
        total = sum(counts)
        if total > last_total:
            levels.append(counts)
            last_total = total
            if len(levels) == k:
                break
    
    # Combine with exponential decay weights
    combined = {}
    for i, counts in levels:
        weight = 0.1**i
        for char, count in counts:
            combined[char] += weight * count
    
    # Sample from combined distribution
    return normalzied_random_choice(combined)
```

### Generation Results

Below is an example generation, along with some statistics. During generation, we track the average and standard deviation for $n$ and $m$ (`numMatches`) for each level.

```
First Citizen:
Ye's Bohemia? sport?

LEONTES:
Bear the sow-hearted friends,
Unard likes of it.

KING RICHARD III:
Slave, I have been drinking all night; I think you are. When
you speak. Boy! O slave!
Pardon me, Marcius is worthy
O'er I meet him be revenged on thee.

GLOUCESTER:
It is a quarrel moves me so, friend? What reply, ha? What
sayest thou increase the number of the dead;
And make him good time.

DUKE VINCENTIO:
The hand that have prevail'd
With that she should not come.
Had she affection

Generated 500 chars in 0.0366s
  Level 1: n(med=17.0, avg=19.85, std=10.78) m(med=1.0, avg=4.1, std=28.2)
  Level 2: n(med=8.0, avg=9.06, std=4.34) m(med=4.0, avg=23.3, std=132.8)
```

That's pretty *decent* for a model with no parameters! Although Tiny Shakespeare is a very small dataset, its specificity (non-open-endedness, lower entropy domain) makes it easier to get decent generation.

With a $k=2$, we see that the first level's median $n$ is 17 characters (roughly 3-4 full words). The second level's median is 8 characters (~1.5 words). Both distibutions of $n$ are slightly skewed right.

For `numMatches`, the first level's median is $m=1$ (what we expected) and the second's level median is $4$. The standard deviations are expectedly high due to scenarios where a small $n$ leads to very high $m$, leading to high variance.



## Comparison to NanoGPT

Below is the same animation as above, comparing the generation quality and speed of both models. The first thing that sticks out is the difference in generation speed. We can see that my infini-gram implementation takes `0.08` seconds for generation, **250x** faster than the 10M parameter nanoGPT implementation (running on my M1 MacBook Pro).

<img alt="Infini-gram vs GPT" style="max-width: 100%" src="/images/unbounded-n-gram.gif">
    
An important thing to note is that suffix arrays do not require GPUs at all and require minimal CPUs and RAM.[^4] The suffix array can stay entirely on disk when performing the binary search, only pulling in one page at each step in a sequential manner (thus, it doesn't benefit from more RAM or CPU cores).

From the eyeball test, NanoGPT looks like it produces more coherent Shakespeare, but I am happy that our nonparametric model was able to produce something so decent!

### Likelihood, Loss, and Perplexity

To quantitatively compare these models, we need to understand how language models are evaluated.

A language model assigns a probability to each possible next token given the context. The probability the model assigns to a sequence is called the **likelihood**. For a test sequence of tokens, $x_1, x_2, ..., x_N$, the likelihood is:

$$P(x_1, x_2, ..., x_N) = P(x_1) \cdot P(x_2|x_1) \cdot P(x_3|x_1, x_2) \cdots P(x_N|x_{<N})$$

A better model assigns higher probability to the test sequence, so higher likelihood is better. However, likelihood gets exponentially small as sequences get longer (multiplying many probabilities between 0 and 1), making it impractical to work with directly.

To handle this, we take the logarithm. Since $\log(a \cdot b) = \log(a) + \log(b)$, the log-likelihood becomes a sum:

$$\log P(x_1, ..., x_N) = \sum_{i=1}^{N} \log P(x_i | x_{<i})$$

This transforms our exponentially shrinking product into a manageable sum. By convention, we use **negative log-likelihood (NLL)** as a loss function, since we want to *minimize* it (minimizing negative log-likelihood is equivalent to maximizing likelihood). We also average it per character:

$$\text{NLL} = -\frac{1}{N}\sum_{i=1}^{N} \log_2 P(x_i | x_{<i})$$

The standard metric for evaluating language models is **perplexity**. Perplexity is a measurement of how well a model predicts text.
**Perplexity** is simply the exponential of the NLL:

$$\text{Perplexity} = 2^{\text{NLL}} = 2^{-\frac{1}{N}\sum_{i=1}^{N} \log_2 P(x_i | x_{<i})}$$

Why exponentiate back? Perplexity has an intuitive interpretation: it represents the **effective vocabulary size** the model is choosing from at each step. A perplexity of 3 means the model is as uncertain as if it were guessing uniformly among 3 tokens.[^5] Lower perplexity is better.

### NanoGPT Perplexity During Training

During training, we generally split our dataset into two parts: a train set (with the majority of the dataset) and a validation set (usually small).
We train the model using the train set, and use the validation set to see how well our model performs on data it hasn't seen before.

We can see how the perplexity and loss for both splits change during training. At the start, the model generates gibberish since its weights are randomly initialized.

```
step 0: train(loss=4.2683, ppl=71.40), val(loss=4.2670, ppl=71.31)
First Citizen:
B?qfzxbDkRZkNwc.wj,ZTkOLOT,ebtK
b:!PeCkMBbzA$3:.aSGgO-33SM:??gLTauhX:YVXJtpXfNuyqhPM$G.tbVc dXl!Dva.eWDwccHPmRWk,fDEZaYJxzC$mWX
YoR&$LMtofCiEIfB!!&V!OW;KdilWZ,
e3 ixYe-EYnkciK;lxW;HFGVdroG EsSXUB;qWk J
```

At step 1000, we see the lowest validation loss and perplexity. A divergence starts to form between the train and validation sets as the model starts to overfit the training dataset.

```
step 1000: train(loss=1.1014, ppl=3.01), val(loss=1.5465, ppl=4.69)
First Citizen:
Bloody and first?

POMPEY:
Here, and the die:
Sads being age to hope the cause no vex to change!
A widow's name, I say, she's to beat so against thee.

Nurse:
Well, and thou such as thy weapons, with c
```

By the end of training, the validation loss is almost as high as at the start of training. But the train perplexity shows that the model produces text very similar to the training dataset.

```
step 5000: train(loss=0.1260, ppl=1.13), val(loss=4.0455, ppl=57.14)
First Citizen:
Bad him his own mine eyes, should be a toother.
Good Signior, what made the king!
Go, play, if you be gived me ustraist:
Your hand, and brought you soS to oft.

KING RICHARD II:
We pity this young rece
```

You can pull the weights and play with the model [here](). Local inference for 500 tokens only takes roughly 10 seconds on an M1 MacBook Pro.

### Unbounded N-Gram Perplexity

The Infini-gram paper doesn't measure perplexity for language generation. The main reason is that the sampling technique they used produces an **infinite perplexity**.

Sparse samples (suffixes with only one match) gives us a probability distribution where one token has $100\\%$ probability while every other token has $0\\%$.
Thus, the correct token may have a zero probability assigned to it, leading to infinite or insanely high (if using n-gram [smoothing](https://en.wikipedia.org/wiki/Word_n-gram_language_model#Smoothing_techniques)) perplexity scores.

Our **Selective Back-off Interpolation Sampling** solves this by mixing in increasingly diverse probability distributions that contain fewer (and less likely) tokens with zero probabilities.

Here are the train and validation perplexities for a variety of $k$.

```
(k=1)  train ppl: 1.00    val ppl: 4036.19   # Verbatim copying
(k=2)  train ppl: 1.17    val ppl:   97.73
(k=3)  train ppl: 1.28    val ppl:   18.24
(k=5)  train ppl: 1.42    val ppl:    7.10 
(k=-1) train ppl: 1.45    val ppl:    6.06   # Uses all levels, maximum k
```

We can see that as $k$ increases, so does the train perplexity, while the validation perplexity decreases. This is analogous to overfitting in normal neural networks. By overfitting to the training data, we get a model with lower train loss and perplexity, but worse generalization capabilities for unseen data.

With language modeling, we are often faced with a **tradeoff between quality and diversity**. When $k=1$, it generates perfect Shakespeare (literally), but nothing original. If we increase $k$, novelty increases but quality slightly decreases, as by definition, the model is generating output more out of distribution.

```
First Citizen:
Ye's come to beg
Hat this house, if it be souls the place where he abide the encounter of as you have been!

QUEEN ELIZABETH:
The king! wave thee.

CLAUDIO:
Nay, 'tis no matter, sir, what had the white and desert thou love me?

ISABELLA:
Ay, and mine,
That laint, man? the watce?
There is no cause to mou against me war the plaines?
```

*Above is example output where $k$ is set to the maximum. The quality, while still decent, is slightly worse than with a smaller $k$.*



## Conclusions

Unbounded n-grams prove that you don't always need neural networks to generate decent text. By combining suffix arrays with novel sampling strategies, we achieved generation quality that approaches small transformers at $250\times$ the speed.

In many ways, statistical models have greater extremities than deep learning models. While people have called transformers [stochastic parrots](https://dl.acm.org/doi/pdf/10.1145/3442188.3445922), unbounded n-gram models are quite *literally* stochastic parrots.

Raw statistical models face an inherent **memorization-novelty tradeoff**. While transformers learn abstractions that can generalize, n-grams are deterministic retrieval systems. Our Selective Back-off Interpolation Sampling method strikes a balance, preventing verbatim copying while preserving coherence.

I wonder how generation quality scales with the size of the dataset. I believe that there are real world use cases for models like this. Perhaps these models are good enough to serve as draft models for speculative decoding. Maybe there are tasks where exact retrieval is desirable or which are easy enough that these models are more than capable of handling.
Maybe another weekend I'll investigate this!



## Citation

If you found this post useful for a project, please kindly cite this page:

> Barry, Nathan. "Generating Shakespeare Without Neural Networks". nathan.rs (Jan 2026). http://nathan.rs/posts/shakespeare-n-gram.

Or

```
@article{barry2026ngram,
  title   = "Generating Shakespeare Without Neural Networks",
  author  = "Barry, Nathan",
  journal = "nathan.rs",
  year    = "2026",
  month   = "Jan",
  url     = "http://nathan.rs/posts/shakespeare-n-gram"
}
```


## Footnotes

[^1]: Andrej Karpathy's beginner [videos](https://www.youtube.com/watch?v=kCc8FmEb1nY) and [nanoGPT](https://github.com/karpathy/nanoGPT) implementations use [Tiny Shakespeare](https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt).
[^2]: A keen observer will have noticed that n-grams language model are essentially ($n-1$)-order Markov chains.
[^3]: The paper, [Using Suffix Arrays as Language Models: Scaling the n-gram](https://pure.mpg.de/rest/items/item_1222599_3/component/file_1222598/content), says the name, synchronous back-off, came from another paper, which I cannot find a copy of.
[^4]: Constructing the suffix array can benefit greatly from more RAM, but is unnecessary for querying once it is built.
[^5]: A uniform distribtuion over $V$ choices gives each choice a probability of $\frac{1}{V}$.The negative log-likelihood of uniformity is: $$\text{NLL}=-\log_2\Big(\frac{1}{V}\Big)=\log_2(V)$$So perplexity becomes: $$\text{Perplexity}=2^{\text{NLL}}=2^{\log_2{V}}=V$$Thus, **the perplexity of a uniform distribution over $V$ items is exactly $V$**.
