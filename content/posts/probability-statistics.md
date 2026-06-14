---
title: "Probability & Statistics"
date: 2024-02-21T14:07:21-06:00
tags:
  - "Class Notes"
---

> These are my notes from Mark Maxwell's courses — Probability I and Introduction to Mathematical Statistics — and his textbook, *Probability & Statistics with Applications, Second Edition*. I've stitched them together into one reference (with much help from Claude).

There's a clean way to think about the difference between probability and statistics. **Probability reasons forward**: given a known model of the world, what's the chance of seeing some outcome? **Statistics reasons backward**: given outcomes we actually observed, what was the model that produced them?

This post walks that whole road. Part I builds up probability from counting through random variables and their generating functions. Part II is a catalog of the named distributions that show up again and again. Part III uses all of it to do statistical inference — estimating unknown parameters and testing hypotheses from data.



# Part I: Probability

## Counting

Before we can talk about the probability of an outcome, we often need to count how many outcomes there are. The foundation is the **multiplication principle** (the fundamental theorem of counting): if one choice has $N(A)$ possible results and a second has $N(B)$, the two together have $N(A) \cdot N(B)$.

> If I have 3 shirts and 2 pairs of shorts, I have $3 \cdot 2 = 6$ possible outfits. A 9-digit social security number, each digit ranging over 10 values, has $10^9$ possibilities.

### Factorials

For a whole number $n$, **$n$ factorial** is the product of every positive integer up to $n$:

$$n! = n \cdot (n-1) \cdot (n-2) \cdots 3 \cdot 2 \cdot 1$$

By convention $0! = 1$. For example, $5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$.

### Permutations

A **permutation** is an *ordered* selection of $r$ distinct objects from $n$ — order matters. The number of such permutations is denoted $_nP_r$:

$$_nP_r = n \cdot (n-1) \cdots (n-r+1) = \frac{n!}{(n-r)!}$$

> A trifecta bet picks the 1st, 2nd, and 3rd place finishers *in order* from 14 horses. Any of 14 can win, leaving 13 for second and 12 for third: $14 \cdot 13 \cdot 12 = 2184$ possible wagers. In formula form, $\frac{14!}{(14-3)!} = \frac{14!}{11!} = 14 \cdot 13 \cdot 12$.

### Combinations

A **combination** is an *unordered* selection — only *whether* an object is chosen matters, not the order. Think of a poker hand: being dealt two aces is the same hand regardless of which came first. We write it $_nC_r$, read "$n$ choose $r$":

$$_nC_r = \frac{_nP_r}{r!} = \frac{n!}{r!\,(n-r)!}$$

It's just the permutation count divided by $r!$, since each unordered set of $r$ objects was counted $r!$ times by the ordered permutations. The same quantity is written many ways, most commonly the **binomial coefficient** $\binom{n}{r}$ — so named because it's the coefficient of each term in a binomial expansion.

A useful symmetry:

$$\binom{n}{r} = \binom{n}{n-r}$$

because choosing $r$ to keep is the same as choosing $n-r$ to leave behind. (Pick 2 of 5 cookies to eat ⟺ pick 3 to *not* eat.) This is exactly the mirror symmetry you see in Pascal's Triangle.

### Partitions

Choosing a combination really splits $n$ objects into two groups: the "in" group and the "out" group. **Partitions** generalize this to $k$ groups. The number of ways to split $n$ distinct objects into subsets of sizes $r_1, r_2, \dots, r_k$ (where $r_1 + \cdots + r_k = n$) is the **multinomial coefficient**:

$$\binom{n}{r_1, r_2, \dots, r_k} = \frac{n!}{r_1!\,r_2! \cdots r_k!}$$

A combination is just the two-group special case, $\binom{n}{r} = \binom{n}{r,\, n-r}$.

> Our 14-person ultimate frisbee team fields 7 at a time: 3 handlers, 2 wings, 2 cutters, and 7 on the bench. The number of lineups is $\frac{14!}{3!\,2!\,2!\,7!} = 720720$.

### Four Ways to Sample

Counting problems usually come down to two yes/no questions: does **order** matter, and do we sample **with replacement**? The four combinations each have their own tool:

| | **Order matters** | **Order doesn't matter** |
|---|---|---|
| **Without replacement** | Permutation: $_nP_r = \frac{n!}{(n-r)!}$ | Combination: $\binom{n}{r}$ |
| **With replacement** | $n^r$ | Stars & bars: $\binom{n-1+r}{r}$ |

The trickiest case is sampling *with* replacement when order *doesn't* matter, which uses $\binom{n-1+r}{r}$.

> A dozen bagels come in 3 types (so $n = 3$, $r = 12$). The number of distinct orders is $\binom{3-1+12}{12} = \binom{14}{12} = 91$.

A closely related idea is **distribution**: instead of pulling objects out of a sample space, you're placing objects into it. Sampling takes a ball *out* of an urn; distribution puts a ball *in*.



## The Axioms of Probability

A probability model describes an experiment with multiple possible outcomes — flipping a coin, rolling dice — where we can't know the result in advance. Three pieces of vocabulary:

1. The **sample space** is the set of all possible outcomes.
2. The **event space** consists of subsets of the sample space.
3. A **probability** assigns each event a number measuring its likelihood, from 0 to 1.

Probability is pinned down by three axioms:

1. $0 \le Pr(E) \le 1$ for any event $E$ (0 is impossible, 1 is certain).
2. $Pr(U) = 1$, where $U$ is the entire sample space.
3. The probability of a union of mutually exclusive events is the sum of their individual probabilities.

> For a fair coin, $U = \{H, T\}$ with each outcome at probability $0.5$, and $Pr(U) = 0.5 + 0.5 = 1$.

From these axioms, a handful of properties follow. Let $A$ and $B$ be events:

1. **Monotonicity**: $A \subseteq B \implies Pr(A) \le Pr(B)$.
2. **Intersection bound**: $Pr(A \cap B) \le \min(Pr(A), Pr(B))$.
3. **Union bound**: $Pr(A \cup B) \le Pr(A) + Pr(B)$.
4. **Negation**: $Pr(\bar{A}) = 1 - Pr(A)$.
5. **Inclusion–exclusion**: $Pr(A \cup B) = Pr(A) + Pr(B) - Pr(A \cap B)$. (Picture two overlapping circles — the intersection gets counted twice, so subtract it once.)
6. **Law of total probability**: if disjoint events $A_1, \dots, A_k$ cover the sample space, then $\sum_{i=1}^{k} Pr(A_i) = 1$.



## Conditional Probability and Bayes' Theorem

The **conditional probability** of $A$ given that $B$ occurred is

$$Pr(A \mid B) = \frac{Pr(A \cap B)}{Pr(B)}$$

Rearranging gives the probability of both events happening, which you can factor in either order:

$$Pr(A \cap B) = Pr(B) \cdot Pr(A \mid B) = Pr(A) \cdot Pr(B \mid A)$$

Setting those two factorizations equal and solving is exactly **Bayes' Theorem**. In its full form, suppose the sample space is partitioned into disjoint events $B_1, \dots, B_n$. Then for any event $A$:

$$Pr(B_j \mid A) = \frac{Pr(B_j) \cdot Pr(A \mid B_j)}{\sum_{i=1}^{n} Pr(B_i) \cdot Pr(A \mid B_i)}$$

### Bayesian Inference

Bayes' Theorem is the engine of **backward reasoning**: inferring a likely *cause* from an observed *effect*. We can't directly see which cause occurred, but we can compute its conditional probability given what we observed.

> Three coolers each hold 10 drinks; they contain 1, 2, and 8 root beers respectively. You pull out a root beer — which cooler did it likely come from? First, the chance of a root beer *given* each cooler is $\frac{1}{10}, \frac{2}{10}, \frac{8}{10}$. Each cooler is equally likely to be chosen ($\frac{1}{3}$), so the overall chance of grabbing a root beer is
> $$Pr(\text{root beer}) = \tfrac{1}{3}\big(\tfrac{1}{10} + \tfrac{2}{10} + \tfrac{8}{10}\big) = \tfrac{11}{30}.$$
> Bayes then gives the posterior probabilities $\frac{1}{11}, \frac{2}{11}, \frac{8}{11}$ for the three coolers.

### Credibility

**Credibility theory** is just Bayesian inference applied repeatedly — continually updating an estimate as new evidence arrives.

> Suppose a new customer has an 80% prior chance of being a good driver ($G$) and 20% of being bad ($B$), where good and bad drivers crash with probability $0.10$ and $0.50$ in a year. The overall accident probability is
> $$Pr(A) = (.10)(.80) + (.50)(.20) = .18.$$
> After observing one accident, Bayes revises the chance of being a good driver down from 80% to $Pr(G \mid A) = \frac{(.10)(.80)}{.18} = \frac{4}{9} \approx 44.4\%$. After *two* straight years with accidents, it drops further to $\frac{4}{29} \approx 13.8\%$.

### Independence

Events $A$ and $B$ (with nonzero probability) are **independent** if any one of these equivalent conditions holds:

1. $Pr(A \mid B) = Pr(A)$
2. $Pr(B \mid A) = Pr(B)$
3. $Pr(A \cap B) = Pr(A) \cdot Pr(B)$ — the **multiplicative rule**.

Intuitively, independence means learning that one event occurred tells you nothing about the other. The multiplicative rule extends to any collection of mutually independent events:

$$Pr(A \cap B \cap \cdots \cap N) = Pr(A) \cdot Pr(B) \cdots Pr(N)$$



## Random Variables

A **random variable** is a function that maps each outcome in the sample space to a real number:

$$X: U \rightarrow \mathbb{R}$$

By convention, uppercase letters ($X$) denote the random variable and lowercase ($x$) the specific values it takes. Every random variable carries a probability distribution whose probabilities are non-negative and sum to one. Random variables come in two flavors — **discrete** (a countable set of values, like a die roll) and **continuous** (an uncountable range, like a waiting time) — and we'll treat each in turn.

### Expected Value

The **expected value** $E[X]$ (also written $\mu_X$) is the probability-weighted average of a random variable — the "center of mass" of its distribution. In the discrete and continuous cases respectively:

$$E[X] = \sum_{x} x \cdot Pr(X = x), \qquad E[X] = \int_{-\infty}^{\infty} x \cdot f_X(x)\, dx$$

> For a fair 6-sided die, $E[X] = \frac{1}{6}(1 + 2 + 3 + 4 + 5 + 6) = 3.5$.

Two properties make expectation easy to work with. It's **linear under affine transformations**, and **additive across random variables** (even dependent ones):

$$E[aX + b] = a\,E[X] + b, \qquad E[X + Y] = E[X] + E[Y]$$

### Variance

The **variance** measures spread around the mean. Denoted $Var[X]$ or $\sigma_X^2$:

$$Var[X] = E\big[(X - E[X])^2\big] = E[X^2] - E[X]^2$$

That second form (mean of the square minus square of the mean) is usually the easier one to compute. The **standard deviation** $\sigma_X$ is its square root, putting the spread back in the original units. Under an affine transformation, the shift $b$ doesn't change the spread and the scale $a$ comes out squared:

$$Var[aX + b] = a^2 \cdot Var[X]$$

### Tail Bounds: Chebyshev and Markov

Even without knowing a distribution's exact shape, we can bound how much probability sits in its tails. **Chebyshev's Theorem** says that for any $k \gt  1$, the chance of landing more than $k$ standard deviations from the mean is at most $1/k^2$:

$$Pr\big(|X - \mu_X| \gt  k\,\sigma_X\big) \le \frac{1}{k^2}$$

**Markov's Inequality** bounds the upper tail of a non-negative random variable using only its mean: for $a \gt  0$,

$$Pr[Y \gt  a] \le \frac{\mu_Y}{a}$$



## Discrete Random Variables

For a discrete random variable, $Pr(X = x)$ is given by the **probability mass function** (PMF), written $p_X(x)$.

> Flip a coin twice and let $X$ count the heads. The sample space is $\{HH, HT, TH, TT\}$, so $X \in \{0, 1, 2\}$ with $Pr(X = 2) = 0.25$ (only $HH$ gives two heads).

### Cumulative Distribution Function

The **cumulative distribution function** (CDF) accumulates probability up to a point: $F(x) = Pr(X \le x)$. For a discrete variable it's a step function, and the jump at each value recovers the PMF:

$$Pr(X = x_i) = F(x_i) - F(x_{i-1})$$

It satisfies $0 \le F(x) \le 1$ for all $x$ and $F(\infty) = 1$.

### Joint Distributions

When two random variables come from the same experiment, their **joint distribution** gives the probability of both taking particular values at once:

$$p(x, y) = Pr\big(\{X = x\} \cap \{Y = y\}\big)$$

$X$ and $Y$ are **independent** when the joint factors into the marginals for all $x, y$:

$$p(x, y) = p_X(x) \cdot p_Y(y)$$

This independence sharpens the expectation and variance rules. For *any* $X$ and $Y$, $E[X + Y] = E[X] + E[Y]$. If they're additionally independent, then also:

$$E[XY] = E[X] \cdot E[Y], \qquad Var[X + Y] = Var[X] + Var[Y]$$



## Generating Functions

Generating functions are a slick trick: they encode an entire distribution into a single function whose derivatives hand you the moments (the expected value, variance, and beyond).

### Probability Generating Function

For a random variable $X$ taking non-negative integer values with $p_n = Pr[X = n]$, the **probability generating function** (PGF) is

$$h(s) = \sum_{i=0}^{\infty} p_i\, s^i = E[s^X]$$

Its derivatives at $s = 1$ recover the mean and variance:

$$E[X] = h'(1), \qquad Var[X] = h''(1) + h'(1) - \big(h'(1)\big)^2$$

### Moment Generating Function

The PGF only works for integer-valued variables. The **moment generating function** (MGF) does the same job for any random variable, discrete or continuous:

$$M_X(t) = E\big[e^{tX}\big]$$

The name comes from its defining property: the $k$-th derivative at $0$ gives the $k$-th moment, $E[X^k]$.

$$M_X^{(k)}(0) = E[X^k]$$

A few more properties make MGFs powerful, especially for sums:

1. **Affine transformation**: if $Y = aX + b$, then $M_Y(t) = e^{bt} M_X(at)$.
2. **Sums of independents**: if $S = X_1 + \cdots + X_n$ with the $X_i$ independent, the MGF of the sum is the *product* of MGFs, $M_S(t) = \prod_i M_{X_i}(t)$.
3. **I.I.D. corollary**: if those $X_i$ are also identically distributed, $M_S(t) = [M_X(t)]^n$.

This last property is why MGFs are the natural tool for analyzing sums of independent variables — multiplication is far easier than the convolution you'd otherwise need. There's also a handy shortcut: defining $h(t) = \ln M_X(t)$ gives $E[X] = h'(0)$ and $Var[X] = h''(0)$ directly.



## Continuous Random Variables

A continuous random variable can take any value in a range, so the probability of *any exact* value is precisely 0 — we work with intervals instead, like $Pr(a \le X \le b)$.

### CDF and Density

The **CDF** is defined the same as before, $F_X(x) = Pr(X \le x)$, and is now a smooth non-decreasing function running from 0 to 1. Probabilities of intervals are differences of the CDF:

$$Pr(a \le X \le b) = F_X(b) - F_X(a)$$

The continuous analog of the PMF is the **probability density function** (PDF), $f_X(x)$ — the derivative of the CDF. The two are linked by differentiation and integration:

$$f_X(x) = F'_X(x), \qquad F_X(x) = \int_{-\infty}^{x} f_X(t)\, dt$$

A valid density is non-negative and integrates to 1, and the probability of an interval is the area under the curve:

$$\int_{-\infty}^{\infty} f_X(x)\, dx = 1, \qquad Pr(a \le X \le b) = \int_a^b f_X(x)\, dx$$

### Moments from the Density

Expectation and variance carry over by swapping sums for integrals:

$$E[X] = \int_{-\infty}^{\infty} x \cdot f_X(x)\, dx, \qquad E[g(X)] = \int_{-\infty}^{\infty} g(x) \cdot f_X(x)\, dx$$

$$Var[X] = E[X^2] - E[X]^2 = \int_{-\infty}^{\infty} x^2 f_X(x)\, dx - \left(\int_{-\infty}^{\infty} x f_X(x)\, dx\right)^2$$

> **Example.** For $f(x) = 20x^3(1-x)$ on $[0, 1]$:
> $$E[X] = 20\int_0^1 x^4(1-x)\, dx = 20\Big[\tfrac{1}{5} - \tfrac{1}{6}\Big] = \tfrac{20}{30} = \tfrac{2}{3}.$$

For a non-negative random variable on $(A, B)$, there's also a neat expression for the mean directly in terms of the CDF:

$$E[X] = A + \int_A^B \big[1 - F(x)\big]\, dx$$

### Mode and Median

The **mode** is the value that maximizes the density $f(x)$ — found by setting $f'(x) = 0$ and checking for a maximum. The **median** is the 50th percentile, the point $x_{.5}$ where $F(x_{.5}) = 0.5$. More generally the $100p$-th percentile is the $x_p$ with $F(x_p) = p$.

### Mixture Distributions

You can blend two distributions. Given random variables $Y$ and $Z$ with CDFs $F_Y$ and $F_Z$ and a weight $p \in (0, 1)$, the **two-point mixture** has CDF

$$F_X(x) = p\,F_Y(x) + (1-p)\,F_Z(x)$$

Its moments are the same weighted blend of the component moments: $E[X^n] = p\,E[Y^n] + (1-p)\,E[Z^n]$.

### Application: Insurance Payments

Continuous distributions model insurance losses nicely. If $X$ is a loss on $(A, B)$ and the policy has a **deductible** $d$, the insurer pays nothing until the loss exceeds $d$:

$$Y = \begin{cases} 0 & A \le X \lt  d \\ X - d & d \le X \lt  B \end{cases}$$

The expected payout integrates only over the region where the policy pays:

$$E[Y] = \int_d^B (x - d) \cdot f_X(x)\, dx$$

A **cap** $C$ works the other way, limiting the maximum payout, giving $E[Y] = \int_A^C x\,f_X(x)\,dx + C \cdot Pr[X \gt  C]$. Both have compact CDF forms — for a benefit capped at $C$ and one with deductible $d$:

$$E[Y^C] = A + \int_A^C [1 - F_X(x)]\, dx, \qquad E[Y_d] = \int_d^B [1 - F_X(x)]\, dx$$

and a combined deductible-and-cap policy is just their difference, $Y_d^C = Y^C - Y_d$.



# Part II: Common Distributions

Most real problems don't need a distribution built from scratch — they fit one of a handful of standard families. Each is characterized by a few parameters and comes with known formulas for its mean, variance, and MGF. This part is a reference catalog: discrete families first, then continuous.

## Discrete Distributions

### Discrete Uniform

Every value $1, 2, \dots, n$ is equally likely — the distribution of a fair die.

$$Pr(X = x) = \frac{1}{n}, \qquad E[X] = \frac{n+1}{2}, \qquad Var[X] = \frac{n^2 - 1}{12}$$

### Bernoulli

A single trial with two outcomes — success (probability $p$) or failure (probability $q = 1 - p$). Every other discrete distribution here is built from Bernoulli trials.

$$Pr[X = 1] = p, \quad Pr[X = 0] = q, \qquad E[X] = p, \qquad Var[X] = pq$$

### Binomial — $X \sim \text{Binomial}(n, p)$

The number of successes in $n$ **independent** Bernoulli trials. We choose which $x$ of the $n$ trials succeed, then weight by their probabilities:

$$Pr(X = x) = \binom{n}{x} p^x q^{n-x}, \qquad x = 0, 1, \dots, n$$

$$E[X] = np, \qquad Var[X] = npq, \qquad M_X(t) = (q + p e^t)^n$$

### Geometric — $X \sim \text{Geometric}(p)$

The number of **failures before the first success** in a sequence of Bernoulli trials.

$$Pr(X = k) = p\,q^k, \qquad k = 0, 1, 2, \dots$$

$$E[X] = \frac{q}{p}, \qquad Var[X] = \frac{q}{p^2}, \qquad M_X(t) = \frac{p}{1 - q e^t}$$

### Negative Binomial — $X \sim \text{NegBinomial}(r, p)$

The geometric distribution generalized: the number of failures before the **$r$-th** success. Its mean and variance are just the geometric's, scaled by $r$.

$$Pr(X = k) = \binom{r + k - 1}{k} p^r q^k$$

$$E[X] = \frac{rq}{p}, \qquad Var[X] = \frac{rq}{p^2}, \qquad M_X(t) = \left(\frac{p}{1 - q e^t}\right)^r$$

### Hypergeometric — $X \sim \text{HyperGeometric}(G, B, n)$

Like the binomial, but **without replacement** — so the trials aren't independent. From a population of $G$ "good" and $B$ "bad" objects, draw $n$ and count the good ones.

$$Pr(X = k) = \frac{\binom{G}{k} \binom{B}{n-k}}{\binom{G+B}{n}}$$

$$E[X] = n \cdot \frac{G}{G+B}, \qquad Var[X] = n \cdot \frac{G}{G+B} \cdot \frac{B}{G+B} \cdot \frac{G+B-n}{G+B-1}$$

That last factor in the variance is the *finite population correction* — it's what distinguishes sampling without replacement from the binomial.

### Poisson — $X \sim \text{Poisson}(\lambda)$

Counts how many times a rare, sporadic event occurs over a fixed observation period, where $\lambda$ is the average count. A signature feature: its mean and variance are both $\lambda$.

$$Pr(X = k) = e^{-\lambda} \frac{\lambda^k}{k!}, \qquad k = 0, 1, 2, \dots$$

$$E[X] = \lambda, \qquad Var[X] = \lambda, \qquad M_X(t) = e^{\lambda(e^t - 1)}$$

Independent Poissons add cleanly: $X_1 + X_2 \sim \text{Poisson}(\lambda_1 + \lambda_2)$.

## Continuous Distributions

### Uniform on $[A, B]$ — $X \sim \text{Uniform}[A, B]$

Constant density across an interval — the continuous version of a fair die.

$$f_X(x) = \frac{1}{B - A}, \qquad F_X(x) = \frac{x - A}{B - A}, \qquad A \le x \le B$$

$$E[X] = \frac{A + B}{2}, \qquad Var[X] = \frac{(B - A)^2}{12}$$

Probabilities are just length ratios: $Pr[a \le X \le b] = \frac{b - a}{B - A} = \frac{\text{length of event}}{\text{length of domain}}$.

### Exponential — $X \sim \text{Exponential}(\beta)$

The continuous partner of the Poisson distribution. Where a Poisson counts *occurrences* in a period, the exponential models the **waiting time until the next occurrence**. Here $\lambda$ is the mean rate and $\beta = 1/\lambda$ is the mean time between events.

$$f_X(x) = \lambda e^{-\lambda x} = \tfrac{1}{\beta} e^{-x/\beta}, \qquad F_X(x) = 1 - e^{-\lambda x}, \qquad 0 \le x \lt  \infty$$

$$E[X] = \frac{1}{\lambda} = \beta, \qquad Var[X] = \frac{1}{\lambda^2} = \beta^2, \qquad M_X(t) = \frac{\lambda}{\lambda - t}\ \ (t \lt  \lambda)$$

Its defining trait is the **memoryless property**: having already waited time $a$ tells you nothing about the remaining wait.

$$Pr[X \gt  a + b \mid X \gt  a] = Pr[X \gt  b]$$

### Normal — $X \sim \text{Normal}(\mu, \sigma^2)$

The familiar bell curve, fully determined by its mean $\mu$ and variance $\sigma^2$. The **standard normal** $Z$ is the special case $\mu = 0,\, \sigma^2 = 1$:

$$f_Z(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2/2}, \qquad M_Z(t) = e^{t^2/2}$$

Every other normal is an affine transformation of $Z$, which is how you **standardize** to look probabilities up in a $Z$-table:

$$X = \sigma_X Z + \mu_X \quad \iff \quad Z = \frac{X - \mu_X}{\sigma_X}$$

The general density and MGF are:

$$f_X(x) = \frac{1}{\sigma_X\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x - \mu}{\sigma_X}\right)^2}, \qquad M_X(t) = e^{\mu t + \frac{1}{2}\sigma^2 t^2}$$

There's no closed form for the CDF, so we write it with $\Phi$, the standard normal CDF, and use tables: $F_X(x) = \Phi\big(\frac{x - \mu_X}{\sigma_X}\big)$. Normals are closed under addition — $(X + Y) \sim N(\mu_X + \mu_Y,\, \sigma_X^2 + \sigma_Y^2)$.

> **Example.** If $X \sim N(5, 2^2)$, find $Pr(X \lt  9.3)$. Standardizing, $z = \frac{9.3 - 5}{2} = 2.15$, so $Pr(X \lt  9.3) = Pr(Z \lt  2.15) = .9842$ from the table.

### Lognormal

If $X = \ln(Y)$ is normal, then $Y = e^X$ is **lognormal**. Because it's an exponential of a normal, $Y$ is always positive — which makes it a natural model for quantities that grow multiplicatively, like asset prices.

$$f_Y(y) = \frac{1}{y\sigma_X\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{\ln y - \mu_X}{\sigma_X}\right)^2}, \qquad F_Y(y) = \Phi\!\left(\frac{\ln y - \mu_X}{\sigma_X}\right)$$

$$E[Y] = e^{\mu_X + \frac{1}{2}\sigma_X^2}, \qquad Var[Y] = e^{2\mu_X + \sigma_X^2}\big(e^{\sigma_X^2} - 1\big)$$

### Gamma — $X \sim \Gamma(\alpha, \beta)$

A generalization of the exponential, built on the **gamma function** $\Gamma(\alpha) = \int_0^\infty x^{\alpha-1} e^{-x}\, dx$ (which satisfies $\Gamma(n) = (n-1)!$ for integer $n$, and $\Gamma(\tfrac{1}{2}) = \sqrt{\pi}$). The shape parameter $\alpha$ can be read as a number of events and the scale $\beta$ as the time between them.

$$f_X(x) = \frac{1}{\beta^\alpha \Gamma(\alpha)} x^{\alpha-1} e^{-x/\beta}, \qquad 0 \le x \lt  \infty$$

$$E[X] = \alpha\beta, \qquad Var[X] = \alpha\beta^2, \qquad M_X(t) = \left(\frac{1}{1 - \beta t}\right)^\alpha$$

Independent gammas with a shared scale add: $X + Y \sim \Gamma(\alpha_X + \alpha_Y,\, \beta)$. A key special case, $Z^2 \sim \Gamma(\tfrac{1}{2}, 2)$, is the **chi-squared** distribution that drives much of Part III.

### Beta — $X \sim \text{Beta}(\alpha, \beta)$

Lives on the unit interval $[0, 1]$, which makes it the go-to distribution for modeling *probabilities and proportions*. It's built on the **beta function** $B(\alpha, \beta) = \int_0^1 x^{\alpha-1}(1-x)^{\beta-1}\, dx = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha + \beta)}$.

$$f_X(x) = \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)} x^{\alpha-1}(1-x)^{\beta-1}, \qquad 0 \lt  x \lt  1$$

$$E[X] = \frac{\alpha}{\alpha + \beta}, \qquad Var[X] = \frac{\alpha\beta}{(\alpha + \beta)^2(\alpha + \beta + 1)}$$



# Part III: Mathematical Statistics

Now we flip the direction. In probability, we knew the model and computed the odds of outcomes. In **statistics**, we observe outcomes and work backward to the unknown model. We find ourselves in a slightly paradoxical situation: the parameters we want are *fixed but unknown*, while the estimates we compute from data are *random but observable*.

## Estimation and Confidence Intervals

Let $X$ be a **population** random variable with mean $\mu_X$ and variance $\sigma_X^2$. We draw a **random sample** $X_1, \dots, X_n$ — independent, identically distributed copies of $X$ — and summarize it with the **sample mean**:

$$\bar{X} = \frac{1}{n} \sum_{i=1}^n X_i$$

The sample mean has three properties that make it the workhorse of estimation:

1. It's **unbiased**: $E[\bar{X}] = \mu_X$, so on average it nails the true mean.
2. Its variance **shrinks with sample size**: $Var[\bar{X}] = \frac{\sigma_X^2}{n}$, so $\sigma_{\bar{X}} = \frac{\sigma_X}{\sqrt{n}}$. More data, tighter estimate.
3. The **Central Limit Theorem**: for large $n$, $\bar{X}$ is approximately normal *regardless of the shape of $X$* — a remarkable fact that underwrites nearly everything below.

### Confidence Intervals

An estimate is more honest when it comes with a margin of error. We express accuracy as

$$1 - \alpha = Pr\big[|\bar{X} - \mu_X| \le \epsilon\big]$$

where $\epsilon$ is the **margin of error** and $1 - \alpha$ is the **confidence level**. For a fixed sample size there's a tradeoff: demanding more confidence forces a wider margin.

For a normal population with **known variance**, the margin is $\epsilon = z_{\alpha/2} \cdot \frac{\sigma_X}{\sqrt{n}}$, giving the symmetric **confidence interval**:

$$\bar{X} \pm z_{\alpha/2} \cdot \frac{\sigma_X}{\sqrt{n}}$$

### Estimating the Variance

The population variance is usually unknown too. We estimate it with the **sample variance**, which divides by $n - 1$ rather than $n$ — *Bessel's correction*, the adjustment that makes the estimator unbiased ($E[S^2] = \sigma_X^2$):

$$S^2 = \frac{1}{n-1} \sum_{i=1}^n (X_i - \bar{X})^2$$

For a normal population, the scaled sample variance follows a **chi-squared** distribution, which lets us build a confidence interval for $\sigma_X^2$:

$$\frac{(n-1)S^2}{\sigma_X^2} \sim \chi^2(n-1)$$

### Estimating Proportions

When the population is a Bernoulli trial, estimating its success probability $p$ means estimating a **proportion**. The estimator $\hat{p} = \bar{X}$ (the sample fraction of successes) is unbiased, and for large $n$ it's approximately normal, giving the interval $\hat{p} \pm \epsilon$ with

$$\epsilon = z_{\alpha/2} \cdot \sqrt{\frac{\hat{p}(1 - \hat{p})}{n}}$$

### Comparing Two Populations

To ask whether two populations share a mean, set $W = X - Y$ and estimate with $\bar{W} = \bar{X} - \bar{Y}$. Because $X$ and $Y$ are independent, the variances **add** (this is the key fact — variance of a difference of independent variables is a *sum*):

$$E[\bar{W}] = \mu_X - \mu_Y, \qquad Var[\bar{W}] = \frac{\sigma_X^2}{m} + \frac{\sigma_Y^2}{n}$$

so the margin of error is $\epsilon = z_{\alpha/2} \sqrt{\frac{\sigma_X^2}{m} + \frac{\sigma_Y^2}{n}}$.

When sample sizes are small and we can assume the two populations share a variance, we combine their sample variances into a **pooled sample variance**, which then drives a Student-$t$ statistic:

$$S_P^2 = \frac{(m-1)S_X^2 + (n-1)S_Y^2}{m + n - 2}$$



## Hypothesis Testing

A **hypothesis test** weighs a default belief against an alternative. The **null hypothesis** $H_0$ is the baseline (often "no effect," stated as a specific value); the **alternative** $H_1$ is what we'd switch to if the data are surprising enough. We compute a **test statistic** from the data, and if it lands in the **rejection region**, we reject $H_0$.

Two kinds of mistakes are possible, and they trade off against each other:

| | $H_0$ **is true** | $H_0$ **is false** |
|---|---|---|
| **Reject $H_0$** | Type I error (false positive) | Correct |
| **Accept $H_0$** | Correct | Type II error (false negative) |

These error rates have names:

1. $\alpha = Pr[\text{reject } H_0 \mid H_0 \text{ true}]$ is the **significance level** — the Type I error rate.
2. $\beta = Pr[\text{accept } H_0 \mid H_1 \text{ true}]$ is the **Type II error rate**.
3. $1 - \beta = Pr[\text{reject } H_0 \mid H_1 \text{ true}]$ is the **power** of the test.

Lowering $\alpha$ generally raises $\beta$, so test design is a balancing act. A useful duality: rejecting $H_0$ at significance level $\alpha$ is equivalent to a $1 - \alpha$ confidence interval that *misses* the null value.

### The p-Value

Results are often reported as a **p-value**: the probability, assuming $H_0$ is true, of seeing a test statistic at least as extreme as the one observed. It measures how close we came to the boundary between accepting and rejecting — we reject $H_0$ exactly when the p-value is below $\alpha$.

### The General Procedure

1. State $H_0$ (a simple hypothesis, $\theta = \theta_0$) and $H_1$ (a composite one: $\theta \ne \theta_0$ two-tailed, $\theta \gt  \theta_0$ right-tailed, or $\theta \lt  \theta_0$ left-tailed).
2. Pick the significance level $\alpha$.
3. Choose a test statistic whose distribution under $H_0$ is one of the standard ones — $z$, $t$, $\chi^2$, or $F$.
4. Build the rejection region from $\alpha$, that distribution, and the appropriate tail.
5. Evaluate the statistic on the data; reject $H_0$ if it falls in the rejection region.
6. If possible, report the p-value.

### Test Statistics for Means, Variances, and Proportions

For a population **mean**, the statistic is built from $\bar{X}$, but the right tool depends on what we know:

- **Normal population, known $\sigma_X$**: use the $z$-statistic $Z = \frac{\bar{X} - \mu_X}{\sigma_X / \sqrt{n}}$.
- **Unknown distribution, large $n$**: the CLT makes $\bar{X}$ approximately normal, so the same $z$-statistic applies.
- **Normal population, unknown $\sigma_X$** (estimated by $S$): use the Student-$t$ statistic, $\frac{\bar{X} - \mu_X}{S / \sqrt{n}} \sim t(n-1)$. This is the typical small-sample case.

For a population **variance**, the natural statistic is the chi-squared one from before, $\frac{(n-1)S^2}{\sigma_X^2} \sim \chi^2(n-1)$. For a **proportion**, assuming $H_0: p = p_0$, the variance of a Bernoulli is $p_0(1 - p_0)$, so

$$Z \approx \frac{\hat{p} - p_0}{\sqrt{\frac{p_0(1 - p_0)}{n}}}$$

For a **difference** of two means (with samples of size $\ge 30$), $W = X - Y$ gives the test statistic — again with the variances *added*:

$$Z = \frac{\bar{W} - \mu_{W_0}}{\sqrt{\frac{S_X^2}{m} + \frac{S_Y^2}{n}}}$$

The same template handles a difference of proportions, pooling the two samples to estimate the common proportion under $H_0: p_X = p_Y$.



## Appendix: The Sampling Distributions

Three distributions recur throughout statistical inference, all descended from the normal. They're worth collecting in one place.

### Chi-Squared

Measurement errors tend to be normal, and we frequently work with *sums of squared* errors — so the distribution of a squared normal matters. If $Z \sim N(0, 1)$, then $Z^2 \sim \chi^2(1)$ is **chi-squared with 1 degree of freedom**. Summing $n$ independent squares gives chi-squared with $n$ degrees of freedom:

$$S = Z_1^2 + \cdots + Z_n^2 \sim \chi^2(n) = \Gamma\!\left(\tfrac{n}{2}, 2\right), \qquad E[S] = n, \quad Var[S] = 2n$$

### Student's t

This arises whenever we use the *sample* variance in place of the unknown population variance — which is almost always. If $Z$ is standard normal and $V \sim \chi^2(n)$ are independent, then

$$t(n) = \frac{Z}{\sqrt{V/n}}$$

has the **Student-$t$ distribution with $n$ degrees of freedom**. It looks like a heavier-tailed normal, and as $n \to \infty$ it converges exactly to the standard normal. Its main use is the confidence interval for a normal mean when $\sigma$ is unknown:

$$\bar{X} \pm t_{\alpha/2}(n-1) \cdot \frac{S}{\sqrt{n}}$$

### The F-Distribution

To compare *two* variances, we look at the ratio of two independent chi-squareds. If $U \sim \chi^2(m)$ and $V \sim \chi^2(n)$, then

$$F(m, n) = \frac{U/m}{V/n}$$

has the **F-distribution**. It's the tool for building a confidence interval on the ratio $\frac{\sigma_X^2}{\sigma_Y^2}$ of two normal populations, since $\frac{S_X^2/\sigma_X^2}{S_Y^2/\sigma_Y^2} \sim F(m-1, n-1)$. Two handy identities: $F(n, m) = \frac{1}{F(m, n)}$ and $[t(n)]^2 = F(1, n)$.

### Testing Independence with a Contingency Table

Finally, chi-squared also tests whether two categorical variables are independent. Given observed frequencies $f_{ij}$ in a table, compute the frequencies $e_{ij} = \frac{f_i \cdot f_j}{f}$ we'd *expect* if the variables were independent, then sum the standardized squared deviations:

$$T = \sum_{i=1}^r \sum_{j=1}^c \frac{(f_{ij} - e_{ij})^2}{e_{ij}} \approx \chi^2\big((r-1)(c-1)\big)$$

A large $T$ means the observed data stray far from what independence predicts, so we reject the hypothesis of independence at level $\alpha$ when $T \ge \chi^2_\alpha\big((r-1)(c-1)\big)$.
