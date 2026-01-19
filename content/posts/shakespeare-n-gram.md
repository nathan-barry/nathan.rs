+++
title = "Generating Shakespeare Without Neural Networks"
date = 2026-01-17T18:47:03-06:00
tags = ["Programming", "2026"]
draft = true
+++
{{< katex >}}{{< /katex >}}

Learning how to generate Shakespeare has become the "Hello World" of language models. Recently, I've been messing with alternative language models (diffusion language models instead of autoregressive transformers) and the concept of **nonparametric language models** came to my attention.
A model is nonparametric if it does not have parameters which require training (thus, no neural networks).

A year ago, I read paper which scaled a **unbounded n-gram** (nonparametric) language model to trilions of tokens. Their model had applications in helping guide LLMs during generation, but had poor open generation capabilities by itself.

I'll explain how this nonparametric model works and how I improved its standalone language generation capabilities, as visualized below:

<img alt="Infini-gram vs GPT" style="max-width: 100%" src="/images/unbounded-n-gram.gif">

*Speed and quality test of my final implementation compared to a nanoGPT implementation, both using the Tiny Shakespeare dataset.*



## Classical N-Grams

A classic example of a nonparametric language model is the humble **n-gram**. An n-gram is essentially a sequence of n items from a given text. These items can either be characters, words, or tokens (defined in the model).

Normally, datasets consist of many text documents, but for simplicity, let's say our dataset is the following string:

```
AABBCCBC
```

We could model this with n-grams of various sizes. For $n=1$ (AKA a unigram), we would basically create a mapping of each character to the number of times they appear in the dataset:

```
Counts:       Normalized:
A -> 2        A -> .25
B -> 3        B -> .375
C -> 3        C -> .375
```

If we wanted to generate more of the sequence, we could just sample from the normalized counts which make a probability distribution of the potential next token. 

This unigram model isn't entirely too useful as it doesn't use any context of past characters. To gain better modeling capability, we can include the context of the previous character by expanding $n$ from $1$ to $2$ (AKA a bigram).

This causes our lookup table to go from a list of size $n$ to a matrix of size $n\times n$, where the columns are the previous character and the rows are the current character:

```
Counts:            Normalized:
   A  B  C             A    B    C
A  1  0  0         A  .5    0    0
B  1  1  1         B  .5  .33   .5
C  0  2  1         C   0  .66   .5
```

If we wanted to generate more of the sequence, we would look at the last character, and sample from its column, as each column represents the probability distribution over the vocabulary. [^0]n-grams are essentially ($n-1$)-order Markov chains.

We can see that the larger $n$ is, the more previous tokens the model takes into account. This leads to better language modeling ability, but causes the lookup table increases exponentially in size, making large $n$ unviable in practice.



## Unbounded N-Grams

I first came across this concept in the paper, [Infini-gram](). Essentially, instead of computing the lookup table for all n-grams for a specific $n$, we can instead simulate any arbitrary n-gram lookup table for a dataset by using a [suffix array](). This makes using n-grams for large $n$ tractable.

A **suffix array** is a sorted array of all suffixes of a piece of text. It is easiest to understand with an example. Let's have the same example dataset as before, but with each character's index below it:

```
A A B B C C B C   # Dataset
0 1 2 3 4 5 6 7   # Indices
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

The suffix array is an array, not of suffixes, but of their **indices** in this sorted order. These indices act as pointers into the original dataset in which we can retrieve the suffixes.
We can see that the suffix array for this example is `[0, 1, 6, 2, 3, 7, 5, 4]`.

Below is a simple python implementation for constructing this:

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

Suffix arrays are useful for efficiently detecting whether a string appears in a dataset. If we wanted to see whether the string `CCB` appears in our toy dataset, we can do this in `O(log(n))` time by performing binary search on the suffix array. This comes from the wonderful property of being lexigraphically sorted.

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

### Next Character Prediction

Let's say we have the string `BABBC` and we want to know what characters could come next. 

We can check to see if (and how many times) `BABBC` appears in the suffix array.
If it does appear, we count which characters come immediately after, giving us a probability distribution of potential next characters. Otherwise, we shorten the context by one (now `ABBC`), and check again. Repeat until eventually you find a match, then sample from the distribution of next characters. This idea is called **synchronous back-off**.


```python
def sample(text, suffix_array, context):
    """Sample next character using progressively shorter context suffixes."""
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
    """Generate text up to max_chars."""
    result = prompt
    while len(result) < max_chars:
        result += sample(text, suffix_array, result, result)
    return result
```

What this does is look for the **maximum n-gram for which we have a match**. 

For `BABBC`, it searches for a 6-gram. Since it doesn't appear in the dataset, it then looks to see if `ABBC` appears. Since this does appear, it finds all the times it occurs (appears only once), and results in `C` being the next character (for the 5-gram, `ABBCC`).



## Nonparametric Language Generation

I made [tiny-infini-gram](), an efficient unbounded n-gram implementation written in Go, with [Tiny Shakespeare]() as the dataset. The main reason for Go was because it already had an efficient [suffix array implementation]() in its expansive standard library.

**Observation**: One thing I quickly noticed was that the above sampling method often led to output that was **verbatim copied** from the dataset.

The Infini-gram paper defines a notion of **sparsity**: a sample is sparse if and only if there is exactly one match and **one next-character to predict**. Choosing the only option leads to another sparse sample, creating a cycle. This cycle of sparse sampling results in verbatim copying from the dataset until it reaches the end.

Let's take the text `First Citizen:\nBefo`. This appears exactly once in the dataset, with the next character being an `r`. If we append the `r` to the original text, we will see that this new version still has exactly one match, with the next character being an `e`.

Continuing this process, we end up generating the rest of the document verbatim from this starting point.

```
First Citizen:\nBefo
First Citizen:\nBefor
First Citizen:\nBefore
...
First Citizen:\nBefore we proceed any further, hear me speak...
```

In some situations, this might be desirable; it essentially acts as document retrieval mechanism.
We want to generate *new* Shakespeare, however. Thus, we need to think of a new sampling algorithm which allows for novelty without hurting quality.

### Selective Back-off Interpolation Sampling

This is the idea that I came up with which is a variant of **N-gram interpolation**. N-gram interpolation is when you mix the probability distributions of multiple n-grams models together (ex. from unigram, bigram, trigram, etc).

In my algorithm, we select $k$ n-grams to interpolate. To select which ones:
1. **First, find the largest n-gram** which contains non-zero probabilities. This $n$ will have $m$ appearances in the dataset (most likely $m=1$).
2. **Then, back-off** until the next $n$ has a new $m$ **which is greater than the previously seen** $m$ (and thus has a different probability distribution).
3. **Repeat $k$ times** and **combine these $k$ probability distributions** (with exponential weight decay or something similar).

This gives us a distribution that's heavily weighted toward the longest context (biasing towards larger $n$) but allows for diversity from shorter contexts (to preventing verbatim copying).

```python
# Pseudocode of sampling algorithm
def sample(context, k):
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

Below is an example generation, along with some statistics. During generation, we track the average and standard deviation for $n$ and `numMatches` for each level.

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

With a $k=2$, we see that the first level's median $n$ is 17 characters (roughly 3-4 full words). The second level median is 8 characters (~1.5 words). Both distibutions of $n$ are slightly skewed right.

For `numMatches`, the first level's median is $m=1$ (what we expected) and the second level median is $4$. The standard deviations are expectedly high due scenarios where a small $n$ leads to very high $m$, leading to high variance.



## Comparison to NanoGPT

Below is the same animation as above, comparing the geneartion quality and speed of both the models. The first thing that sticks out is the difference in generation speed. We can see that my infini-gram implementation takes `0.08` seconds for generation, **250x** faster than the 10M parameter nanoGPT implementation (running on my M1 MacBook Pro).

<img alt="Infini-gram vs GPT" style="max-width: 100%" src="/images/unbounded-n-gram.gif">
    
An important thing to note is that suffix arrays do not require GPUs at all, and require minimum CPUs and RAM[^0]Although constructing it benefits from more ram. The suffix array can stay entirely on disk when performing the binary search, only pulling in one page at each step in a sequential manner (thus, doesn't benefit form more RAM or CPU cores).

From the eyeball test, NanoGPT looks like it produces more coherent Shakespeare, but I am happy that our nonparametric model was able to produce something so decent!

### Likelihood, Loss, and Perplexity

To quantitatively compare these models, we need to understand how language models are evaluated.

Let's say we are trying to predict the $i$th token (denoted as $x_i$) which comes after a sequence of previous $i-1$ tokens (denoted as $x_{<i}$).
Language models take in $x_{<1}$ and output a probability distribution over the set of possible next characters. The probability it assigned to the actual character $x_i$ correctly is $P(x_i | x_{<i})$. This is known as the **likelihood**.

With our previous bigram example for the dataset `AABBCCBC`, we see that if the previous token is `B`, we get the following probability distribution:

```
Bigram Model:           Probabilities Given B:
    A    B    C                  
A  .5    0    0         P(A|B) =   0
B  .5  .33   .5         P(B|B) = .33
C   0  .66   .5         P(C|B) = .66
```

If we were trying to predict the last token in the dataset, `C`, we would see that the likelihood is $P(C|B)=0.66$. This shows that the model has a $66\\%$ chance of predicting the correct value.

To get a single number for model quality, we average the negative log of these probabilities across an example in our test set:

$$\text{NLL} = -\frac{1}{N}\sum_{i=1}^{N} \log_2 P(x_i | x_{<i})$$

This is called the **negative log-likelihood** (the loss funcion) for a sequence. This function has a nice shape which monotonically decreases between 0 and 1 (the range of probabilities). If the model assigns $100\\%$ probability to the correct tokens, the loss is 0. If it assigns a $0\\%$ chance to a correct token, the loss is infinite. The more confident and correct the model is, the lower the loss.

The standard metric for evaluating language models is **perplexity**. Perplexity is a measurement for how well a model predicts text. The formula is simply:

$$\text{Perplexity} = 2^{\text{NLL}}$$

Why exponentiate back? Perplexity has an intuitive interpretation: it represents the **effective vocabulary size** the model is choosing from at each step. A perplexity of 4 means the model is as uncertain as if it were guessing uniformly among 4 characters[^0]Show the math below. Lower perplexity is better.

### NanoGPT Perplexity During Training

During training, we generally split our dataset into two parts: a train set (contains the majority of the dataset) and a validation set (usually small).
We train the model using the train set, and use the validation set to see how well our model performs on data it hasn't seen before.

We can see how the perplexity and loss for both splits change during training. At the start, the model generates gibberish since its weights are completely untrained.

```
step 0: train(loss=4.2683, ppl=71.40), val(loss=4.2670, ppl=71.31)
First Citizen:
B?qfzxbDkRZkNwc.wj,ZTkOLOT,ebtK
b:!PeCkMBbzA$3:.aSGgO-33SM:??gLTauhX:YVXJtpXfNuyqhPM$G.tbVc dXl!Dva.eWDwccHPmRWk,fDEZaYJxzC$mWX
YoR&$LMtofCiEIfB!!&V!OW;KdilWZ,
e3 ixYe-EYnkciK;lxW;HFGVdroG EsSXUB;qWk J
```

At step 1000 is when we see the lowest validation loss and perplexity. A divergence start to form between the train and validation sets as the model overfits to the training dataset.

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

By the end of training, the validation loss is almost as high as at the start of training. But the training perplexity shows that the model produces text very similar to the training dataset.

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

The Infini-gram paper doesn't measure perpelxity for language generation. The main reason is because the sampling technique they used produces an **infinite perplexity**.

Sparse samples (suffixes with only one match) gives us a probability distribution where one token has $100\\%$ probability while every other token has 0. Thus, if we have a sparse sample, the correct token may have a $0\\%$ probability assigned to it, leading to infinite or insanely high (if using n-gram smoothing) perplexity scores.

[Selective Back-off Interpolation Sampling]() solves this by mixing in increasingly diverse probability distributions with fewer (and less likely) zero probabilities.

Here are the train and validation perplexities for a variety of $k$.

```
(k=1)  train ppl: 1.00    val ppl: 4036.19   # Verbatim copying
(k=2)  train ppl: 1.17    val ppl:   97.73
(k=3)  train ppl: 1.28    val ppl:   18.24
(k=5)  train ppl: 1.42    val ppl:    7.10 
(k=-1) train ppl: 1.45    val ppl:    6.06   # Uses all levels, maximum k
```

We can see that as $k$ increases, so does the train perplexity, while the validation perplexity decreases. This is analogous to overfitting in normal neural networks. By overfitting to the training data, we get a model with lower train loss and perplexity, but worse generalization capabilities (and thus have a higher loss and perplexity) for unseen data.

With language modeling, we are often dealt with a **tradeoff between quality and diversity**. When $k=1$, it generates perfect Shakespeare (literally), but nothing original. If we increase $k$, novelty increases but quality slightly decreases, as by definition, the model is generating output more out of distribution.

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

*Above is example output where $k$ is set to the maximum. The quality, while still decent, is slightly worse than with smaller $k$.*


## Conclusions

Here, we saw that nonparametric models can 
Nonparametric models are like transformer models, but more. While people called the latter stochastic parrots, they are quite *literally* stochastic parrots. Hit harder by the tradeoff of accuracy (and memorization) and diversity.
