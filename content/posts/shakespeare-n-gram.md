+++
title = "Generating Shakespeare Without Neural Networks"
date = 2026-01-17T18:47:03-06:00
tags = ["Programming", "2026"]
draft = true
+++
{{< katex >}}{{< /katex >}}

Creating a language model to generate Shakespeare has become the "Hello World" of NLP. Recently, I've been messing with diffusion language models to do this task. But the idea of **nonparametric** language models came to my mind.
A nonparametric language model is one which does not have any parameters to train. Generally, these models grow in capabilities by seeing more data.

I recall reading a paper (elaborated on below) which scaled one, an **unbounded n-gram** language model, to trilions of tokens. Their model had applications in helping guide LLMs during generation, but had poor open generation capabilities by itself. I'll explain how this nonparametric model works and the strategies I used to improve its language generation capabilities.

<img alt="Infini-gram vs GPT" style="max-width: 100%" src="/images/unbounded-n-gram.gif">

*Above is a visualization of my final implementation compared to a nanoGPT implementation, both using the Tiny Shakespeare dataset.*



## Classical N-Grams

A classic example is the humble **n-gram**. An n-gram is essentially a sequence of n items from a given text. These items can be characters, words, or tokens; it is user defined.

Normally, datasets consist of many text documents, but for simplicity, let's say our dataset is the following string:

```
AABBCCBC
```

We could model this with n-grams of various sizes. For $n=1$ (AKA a unigram), we would basically create a mapping of each character to the number of times they appear:

```
Mapping:      Normalized:
A -> 2        A -> .25
B -> 3        B -> .375
C -> 3        C -> .375
```

If we wanted to generate more of the sequence, we could just sample from the normalized probabilities. However, this unigram model isn't entirely too useful; it presumes each character is independent. To gain better modeling capability, let's expand $n$ from $1$ to $2$ (AKA a bigram).

This causes our lookup table to go from a list of size $n$ to a matrix of size $n\times n$, where the columns are the previous character and the rows are the current:

```
Mapping:           Normalized:
   A  B  C             A    B    C
A  1  0  0         A  .5    0    0
B  1  1  1         B  .5  .33   .5
C  0  2  1         C   0  .66   .5
```

If we wanted to generate more of the sequence, we would look at the last character, and sample from that column, as each column represents the probability over the vocabulary. You might have noticed that n-grams are essentially ($n-1$)-order Markov chains.

We can see that the larger $n$ is, the better this model becomes, but that the lookup table increases exponentially, making large $n$ unviable in practice.



## Unbounded N-Grams

I first came across this concept in the paper, [Infini-gram](). Essentially, instead of computing the lookup table for all n-grams for a specific $n$ (whose space grows exponentially), we can instead simulate any arbitrary n-gram lookup table for a dataset by using a [suffix array]().

A suffix array is a sorted array of all suffixes of a text. It is easiest to understand with an example. Let's have the same example dataset as before:

```
AABBCCBC
```

Below is a list of all suffixes (including their starting index) to this string, along with a sorted version:

```
Suffixes:           Sorted:
0: AABBCCBC         0 -> AABBCCBC
1:  ABBCCBC         1 -> ABBCCBC
2:   BBCCBC         6 -> BC
3:    BCCBC         2 -> BBCCBC
4:     CCBC         3 -> BCCBC
5:      CBC         7 -> C
6:       BC         5 -> CBC
7:        C         4 -> CCBC
```

The suffix array is an array of the indices in this new lexigraphically sorted order . Thus, the suffix array for this example is `[0, 1, 6, 2, 3, 7, 5, 4]`.

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

Suffix arrays are good for doing exact-string match queries. If we wanted to see whether the string `CCB` appears in the dataset, we can do this in `O(log(n))` time by performing binary search on the suffix array. This comes from the wonderful property that it is lexigraphically sorted.

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

What we care about, though, is simulating an arbitrary n-gram lookup. Let's say we have the string `BABBC` and we want to know what character would come next. 

What we can do is, for the `BABBC`, check to see if (and how many times) it appears in the suffix array. If it does appear, we count which characters come immediately after. If it doesn't appear, shorten the context by one (`ABBC`), and check again. Repeat until eventually you find a match, and sample from the distribution of next characters. This idea is called **synchronous back-off**.


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

What this does is look for the **maximum n for which we have a match**. 

For `BABBC`, it searches for a 6-gram. Since it doesn't appear in the dataset, it then looks to see if `ABBC` appears. Since this does appear, it finds all the times it occurs (appears only once), and results in `C` being the next character (for the 5-gram, `ABBCC`).



## Nonparametric Language Generation

I made [tiny-infini-gram](), an efficient unbounded n-gram implementation written in Go, in just 131 lines of code, with [Tiny Shakespeare]() as the dataset. The main reason to choose Go was because it already had an efficient [suffix array implementation]() in its standard library.

One thing I quickly noticed was that the above sampling method often led to output that was verbatim copied from the dataset. The Infini-gram paper defines a notion of sparsity: a sample is sparse if and only if there is exactly one match and one token to predict.

For example, let's take the text `First Citizen:\nBefo`. This appears exactly once in the dataset, with the next character being an `r`. If we append the `r` to the original text, we will see that this new version still has only exactly one match, with the next character being an `e`.

Continuing this process, we end up generating the rest of the document verbatim from this starting point.

```
First Citizen:\nBefo
First Citizen:\nBefor
First Citizen:\nBefore
...
First Citizen:\nBefore we proceed any further, hear me speak...
```

In some situations, this might be desirable; it essentially acts as document retrieval mechanism. For language generation though, we want to generate *new* Shakespeare. Thus, we need to think of a sampling algorithm which supports this.

### Selective Back-off Interpolation Sampling

This is an idea that I came up with which is a variant of **N-gram interpolation**. N-gram interpolation is where you mix the probability distributions of multiple n-grams models (ex. unigram, bigram, trigram, etc).

In my algorithm, we will select $k$ n-grams to interpolate. To select which ones:
1. **First, find the largest n-gram** which contains non-zero probabilities. This $n$ will have $m$ appearances in the dataset (most likely $m=1$).
2. **Then, back-off** until the next $n$ has a **new $m$ which is greater than the previously seen $m$** (and thus has a different probability distribution).
3. **Repeat $k$ times** and **combine these $k$ probability distributions** (with exponential weight decay or something similar).

This gives us a distribution that's heavily weighted toward the longest context (capturing Shakespearean style) but enriched with vocabulary from shorter contexts (preventing verbatim copying).

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

During generation, we track the average and standard deviation for $n$ and `numMatches` for each level. Below is an example generation, along with its statistics below:

```
First Citizen:
Our business is not so.

ELBOW:
Pray now, buy some putter-out of their
but I shall follow it as apprehension.
With all her double gain of hairy. Let me have no
lying:
And thus most capital: thou be safe? such a sacred vow
And she to hang before all day.

DUKE VINCENTIO:
I do conspiracy?
A death.

ISABELLA:
Most bound more he would have said, and more he spoke,
you have cause,
So him to-morrow's brow; but in the
extremity of the gentle king,
Have I defend thee heaven and to you; I mean,
In this while:

Generated 500 chars in 0.0401s
  Level 1: n(med=17.0, avg=20.01, std=11.72) m(med=1.0, avg=3.4, std=15.8)
  Level 2: n(med=8.0, avg=8.59, std=3.75) m(med=4.0, avg=41.1, std=275.8)
```

With a $k=2$, we see that the first level's median $n$ is 17 characters (roughly 3-4 full words). The second level median is 8 characters (~1.5 words). Both distibutions of $n$ are slightly skewed right.

For `numMatches`, the first level's median is $m=1$ (what we expected) and the second level median is $4$. The standard deviations are expectedly high due scenarios where a small $n$ leads to very high $m$, leading to high variance.

The main takeaway is that the output actually looks decent! Although Tiny Shakespeare is a very tiny dataset, it is quite specific (not open-ended, lower entropy domain), so it is easier to get better generation.



## Comparison to NanoGPT

<img alt="Infini-gram vs GPT" style="max-width: 100%" src="/images/unbounded-n-gram.gif">

Both look decent. Unbounded n-gram is 250x faster.

### Perplexity

In the Infini-gram paper, they didn't measure perplexity of the model.

### NanoGPT Perplexity

```
step 0: train(loss=4.2683, ppl=71.40), val(loss=4.2670, ppl=71.31)
First Citizen:
B?qfzxbDkRZkNwc.wj,ZTkOLOT,ebtK
b:!PeCkMBbzA$3:.aSGgO-33SM:??gLTauhX:YVXJtpXfNuyqhPM$G.tbVc dXl!Dva.eWDwccHPmRWk,fDEZaYJxzC$mWX
YoR&$LMtofCiEIfB!!&V!OW;KdilWZ,
e3 ixYe-EYnkciK;lxW;HFGVdroG EsSXUB;qWk J
```

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

```
step 2500: train(loss=0.3331, ppl=1.40), val(loss=2.7550, ppl=15.72)
First Citizen:
Beseeverable less,
For Warwick shall be found i' the side:
Sad Boldly beg you home to be prosperited,
Will within your clords greater post to Ravenspurgh.

DUKE OF I had sigh of this,
You do munimage t

step 3000: train(loss=0.2153, ppl=1.24), val(loss=3.2137, ppl=24.87)
First Citizen:
Bid them if stamper person made a man
Which serves they can should be a coward which
Trows growes with your love to the maid.
Therefore forth live Bolingbroke to beard,
And let believe it not. Within h
```

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


### Tiny Infini-Gram Perplexity


## Conclusions

Nonparametric models are like transformer models, but more. While people called the latter stochastic parrots, they are quite *literally* stochastic parrots. Hit harder by the tradeoff of accuracy (and memorization) and diversity.
