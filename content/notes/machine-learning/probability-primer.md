+++
title = "Univariate Probability Primer"
description = "A mildly completely overview of basic univariate probability."
date = 2023-09-02T11:14:53-05:00
tags = ["Primers"]
+++

{{< toc >}}



## Probability Basics 
***

Probability models are based on experiments for where there are *multiple possible outcomes*, such as flipping a coin or tossing a pair of dice. We cannot tell which outcome will occur in advance, in contrast to deterministic models. 

To define probability on a set, we have:
1. The set of all outcomes is called the **sample space**.
2. Subsets of the sample space are called the **events space**.
3. The numbers assigned to outcomes are called **probabilities**, and they measure the likelihood of an outcome along a scale from 0% to 100%.

Outcomes are called events, so the sample space is a set of all events with each event assigned a probability.

### Axioms Of Probability Theory

1. <p>\(0 \le Pr(E) \le 1\) for any event \(E\)</p>
2. <p>\(Pr(U)=1\), where \(U\) denotes the entire sample space.</p>
3. The probability of the union of mutually exclusive events is the sum of the individual probabilities of those disjoint sets.

In other words, the probability for each event must be between 0 and 1, where 0 is impossible and 1 is guaranteed to happen. The probability of the sample space must be equivalent to 1 because it contains every possible outcome.

<p>
 With a fair coin, the sample space is \(U = \{H, T\}\), with heads and tails both having a probability of 0.5. The probability of \(U\) is of course the combined probability of outcomes heads and tails, which sum to 1.
</p>


### Properties

Here are some basic properties of probability.{{%sidenote%}}Some taken from Arian Maleki and Tom Do's *Review of Probability Theory* material.{{%/sidenote%}} Let A and B both be event spaces:

1. If the A is a subset of B, then the probability of A is less than the probability of B.
$$A\subseteq B\implies Pr(A) \leq Pr(B)\)$$
2. The probability of the intersection of A and B is less than or equal to the lowest of either probability. It is equal if A and B are the same set.
$$Pr(A\cap B)\leq min(Pr(A), Pr(B)\)$$
3. *Union Bound:* The probability of both A and B is less than or equal to the combined probability of both.
$$Pr(A\cup B)\leq Pr(A) + Pr(B)$$
4. *Negation Rule:* The probability of A not happening is 1 - A.
$$Pr(\bar{A})=1-Pr(A)$$
5. *Inclusion-Exclusion Rule:* The probability of A plus the probability of B is the sum of the union plus the sum of the intersection.
 $$Pr(A)+Pr(B)=Pr(A\cup B)+Pr(A\cap B)$$
    We can rewrite the inclusion-exclusion rule as below. Think of two circles. If they overlap, the intersection is counted for twice, so you remove one.
$$Pr(A\cup B)=Pr(A)+Pr(B)-Pr(A\cap B)$$
6. *Law of Total Probability:* If the set of disjoint events equal the sample space, then the probability of that set is 1.
$$\cup_{i=1}^k A_i = U \implies \sum_{i=1}^{k}Pr(A_i)=1$$


### Conditional Probability

The conditional probability that any event A occurs given that event B occurs is:

$$Pr(A|B)=\frac{Pr(A\cap B)}{Pr(B)}$$

<p>
From this, we have that \(Pr(A\cap B)\) is:
</p>

$$Pr(A\cap B) = Pr(B)\cdot Pr(A|B) = Pr(A)\cdot Pr(B|A)$$


### Independence

Let A and B be events with non-zero probabilities. We say A and B are *independent* if any (and hence all) of the following hold:
1. <p>\(Pr(A|B)=Pr(A)\)</p>
2. <p>\(Pr(B|A)=Pr(B)\)</p>
3. <p>\(Pr(A\cap B)=Pr(A)\cdot Pr(B)\)</p>

The last one is called the *multiplicative rule.*
The events are said to be *dependent* if any don't hold.


<p>
Independence can be thought as knowing information about one event happening does not give us any information about the other. Hence, A and B are independent if the probability of A given B is the exact same as if B never happened.
</p>

The independence for collections of events is the same as case 3, but for more than 2 events.
$$Pr(A\cap B\cap\dots\cap N)=Pr(A)\cdot Pr(B)\cdot\dots\cdot Pr(N)$$



## Random Variables
***
A random variable is a function that maps a sample space to a set of real numbers that outcomes.

$$X: U \rightarrow \R$$

We use upper case letters to denote random variables and lower case letters to represent outcomes that the random variable may take on.

Each random variable has a probability distribution associated with it. The probabilities must be positive and sum to one. There are two different kinds of random variables: Discrete and Continuous.


### Discrete Random Variables

Random variables that map to a finite number of possible values are called discrete. An example is flipping a coin. There are two possible outcomes: the coin landing on heads or tails.

<p>
The probability of a discrete random variable \(X\) taking on some value \(x\) is denoted as \(Pr(X=x)\). \(Pr(X=x_i)\) is called the probability mass function of \(X\), also denoted as \(p_X(x)\).
</p>

**Example:** Let X be a random variable that represents how many times we flip a coin that lands on heads. If we flip the coin twice, there are 4 possible outcomes. The sample space is:

<p>$$U=\{\{H, H\}, \{H, T\}, \{T, H\},\{T, T\}\}$$</p>

<p>
Our random variable \(X\) can take the form of 0, 1, or 2 since the sample space only contains events with 0, 1 or 2 heads.
In other words, the set of real numbers \(X\) maps to is \(\{0, 1, 2\}\). Thus, any outcome \(X\) can take on is represented by \(x\in\{0, 1, 2\}\). We can see that the probability that the outcome is 2 is \(Pr(X=2)=.25\) because there is only one event with 2 heads.
</p>

### Continuous Random Variables

Random varaibles that map to an infinite possible values are called continuous. An example is how long it takes for the coin to hit the ground. The coin can be in the air for 1 second, or 1.1, or 1.111.... There is an infinite set of values that the outcome can take on.

<p>
The probability of the outcome being any exact value is precisely 0, so we work with ranges. The probability of a continuous random variable \(X\) taking on some value between \(a\) and \(b\) where \(a \lt b\) is denoted as \(Pr(a\leq X\leq b)\).
</p>

<p>
In this case, we might represent the probability that the coin is in the air between 1 and 2 seconds as \(Pr(1\leq X\leq 2)\).
</p>


### Cumulative Distribution Functions (CDFs)

<p>
The Cumulative Distribution Function of a discrete random variable \(X\) is defined by:
</p>

$$F_X(x) := Pr(X \leq x)$$

and for continuous random variables: 

$$F_X(x) := Pr(-\infty < X \leq x)$$

<p>
That is, the value of the CDF of \(X\) at the point \(x\) is the probability of the event that \(X\) is less than or equal to \(x\).
</p>

#### CDF Properties

1. <p>\(F_X(x)\) is a non-decreasing function with range [0,1].</p>
2. <p>\(\lim_{x\rightarrow-\infty}\:F_X(x)=0\)</p>
3. <p>\(\lim_{x\rightarrow\infty}\:F_x(x)=1\)</p>
4. <p>The probability of \(X\) taking values between \(a\) and \(b\) is the same as the CDF at point \(b\) minus the CDF at point \(a\). In other words:</p>
 $$Pr(a\le X\le b) = F_X(b)-F_X(a)$$


### Probability Density Functions (PDFs)

The probability density function (PDF) of a continuous random variable is similar to the probability mass function of a discrete random variable. 

<p>
Let \(X\) be a continuous random variable with CDF \(F_X(x)\) that is differentiable everywhere. The derivative of \(F_X(x)\), denoted by \(f_X(x)\), is called the <i>density function</i> of the random variable \(X\).
</p>


#### Relation between the CDF and the Density Function for X

1. The density function is calculated from the CDF by differentiating: $$f_X(x)=F'(x)$$

2. The CDF is calculated from the density function by integrating: $$F_X(x)=\int_{-\infty}^{x}f_X(t)dt$$

#### PDF Properties

1. <p>\(f_x(x) \ge 0\), that is, all density functions are non-negative.</p>
2. <p>\(\int_{-\infty}^\infty f_X(x)dx = 1\)</p>
3. <p>\(Pr(a\le X\le b)=\int_a^b f_X(x)dx\)</p>



## Measures Of Central Tendency and Dispersion
***

Measures of central tendency are statistical measures used to represent the "middle" or "central point" of a data set with a single value. Common ones include:

- Expected Value (Mean)
- Median (50th Percentile)
- Midrange
- Mode
- Quartiles and Percentiles

Likewise, measures of dispersion is used to measure how spread out the values of a data set are. Common ones include:

- Range
- Variance
- Standard Deviation
- Coefficient of Variation

We'll cover the most important and commonly used: expected value, variance, and standard deviation.


### Expected Value

<p>
The expected value can be thought of the weighted average of a random variable. It is usually represented as either \(E[X]\) or as \(\mu_X\) where \(X\) is a random variable.
</p>

For the discrete case, we have:

$$E[X]:=\sum_{x\in X} x\cdot Pr(X=x)$$

For the continuous case, we have:

$$E[X]:=\int_{-\infty}^{-\infty} x\cdot f_X(x) dx$$

<p>
<b>Example:</b> For a 6-sided die, the probability of each side is \(\frac16\). Let the random varaible \(X\) be the number of dots we roll. Thus:
</p>

$$E[X] = \bigg(\frac16\cdot 1\bigg)+\bigg(\frac16\cdot 2\bigg)+\bigg(\frac16\cdot 3\bigg)+\bigg(\frac16\cdot 4\bigg)+\bigg(\frac16\cdot 5\bigg)+\bigg(\frac16\cdot 6\bigg) = 3.5$$

<p>
An important property is that it can be transformed under a linear transformation.
For a random variable \(X\) and real numbers \(a\) and \(b\), we have:
</p>

$$E[a\cdot X+b] = a\cdot E[X] + b$$

Another property is *linearity of expectation.* For two different random variables X and Y, we have:

$$E[X + Y] = E[X] + E[Y]$$


### Variance

<p>
The variance of a random variable represents the spread of its distribution around around its mean.
It is often donated as \(Var[X]\) or \(\sigma_X^2\). It is formally defined as:
</p>
$$Var[X] = E[(X - E[X])^2]$$

From this expression we can derive:
$$Var[X] = E[X^2] - E[X]^2$$

<p>
The <b>standard deviation</b> is just the square root of the variance, denoted as \(\sigma_X\).
</p>

Many distributions (i.e. uniform, Poisson, etc.) have a quick way of finding the expected value, variance, and other measures of central tendency and dispersion.

<p>
An important property is that it can be transformed under a linear transformation.
For a random variable \(X\) and real numbers \(a\) and \(b\), we have:
</p>

$$Var[a\cdot X+b] = a^2\cdot Var[X]$$



## Common Discrete Random Variables
***

### Discrete Uniform

<p>A random variable \(X\) is said to have a <b>discrete uniform distribution</b> if its probability function is \(Pr(X=x)=\frac{1}{n}\) for \(x=1,2,\dots,n\)</p>

The expected value can be calculated as: 
$$E[X]=\frac{n+1}{2}$$

The variance can be calculated as:
$$Var[X]= \frac{n^2-1}{12}$$


### Bernoulli

A Bernoulli trial is an experiment that has two outcomes (for example, true-false; girl-boy, success-fail, in-out, etc).

<p>
Suppose that the random variable \(X\) has probability function given by \(Pr[X=1]=p\) and \(Pr[X=0]=1-p\). Then \(X\) is called a <b>Bernoulli random variable</b> with probability of success \(p\).
</p>

The expected value can be calculated as: 
$$E[X]=p$$

The variance can be calculated as: 
$$Var[X]=p\cdot(1-p)$$


### Binomial

<p>
\(X \sim Binomial(n, p)\)
</p>

<p>
Let \(X\) be <i>the number of successes</i> in \(n\) independent repetitions of Bernoulli Trials with probability of success \(p\).
The random variable \(X\) has probability function given by $$Pr(X=x)={n\choose x}\cdot p^x\cdot (1-p)^{n-x}$$ for \(x = 0,1,2,\dots,n\) and \(0\le p\le 1\).
The random variable \(X\) is called a <b>binomial random variable</b> with <i>parameters</i> \(n\) and \(p\).
</p>

The expected value can be calculated as: 
$$E[X]=n\cdot p$$

The variance can be calculated as: 
$$Var[X]=n\cdot p \cdot q$$


### Geometric

<p>\(X \sim Geometric(p)\)</p>

<p>
Consider a series of independent Bernoulli Trials with probability of success \(p\) and let the random variable \(X\) be <i>the number of failures before the first success.</i>
\(X\) has the probability function given by $$Pr(X=k)=p\cdot(1-p)^{k-1}$$ where \(k\in \{0,1,2,\dots\}\) and \(0\lt p\lt 1\).
The random variable \(X\) is called a <b>geometric random variable</b> with <i>parameter</i> \(p\).
</p>


The expected value can be calculated as: 
$$E[X] = \frac{1-p}{p}$$

The variance can be calculated as: 
$$Var[X] = \frac{1-p}{p^2}$$

#### Negative Binomial
<p>\(X \sim NegativeBinomial(r, p)\)</p>

<p>
The negative binomial distribution is a generalization of the Geometric Distribution but until \(r\) successes instead of just one.
</p>
<p>
Consider a series of independent Bernoulli Trials with probability of success \(p\) and let the random variable \(X\) be <i>the number of failures before the \(r^{th}\) success.</i>
\(X\) has the probability distribution given by $$Pr(X=k)={r+k-1\choose k}\cdot p^r \cdot (1-p)^k$$ for \(k=0,1,2,\dots,\) and \(0\lt p\lt 1\).
The random variable \(X\) is called a <b>negative binomial random variable</b> with parameters \(r\) and \(p\).
</p>

The expected value can be calculated as: 
$$E[X]=\frac{r(1-p)}{p}$$
The variance can be calculated as: 
$$E[X]=\frac{r(1-p)}{p^2}$$

- **Note:** The mean and variance is the same as the geometric distribution, but multiplied by $r$

### Hyper-Geometric
\\(X \sim HyperGeometric(S,F,n)\\)

The Hyper-Geometric distribution is similar to a Binomial Distribution except that you are removing from the population every time you sample (sample without replacement, thus trials are not independent).

<p>
A finite population consists of \(S\) objects (successes) and \(F\) objects (fails). Let \(X\) be the number of \(S\) objects drawn without replacement in a sample of size \(n\). The random variable \(X\) has the probability function given by:
$$Pr(X=k)=\frac{_SC_k\cdot {_FC_{n-k}}}{_{S+F}C_n}$$
where \(k\) is the number of observed successes with \(0\le k\le S\) and \(0\le n-k\le F\). The random variable \(X\) is called a <b>hyper-geometric random variable</b> with parameters \(S\), \(F\), and \(n\).
</p>

The expected value can be calculated as: 
$$E[X]=n\cdot\Big(\frac{S}{S+F}\Big)$$

The variance can be calculated as: 
$$Var[X]=n\cdot\Big(\frac{S}{S+F}\Big)\cdot\Big(\frac{F}{S+F}\Big)\cdot\Big(\frac{S+G-n}{S+F-1}\Big)$$

### Poisson
\\(X \sim Poisson(\lambda)\\)

The Poisson distribution is used to count the number of times a random and sporadically occurring phenomenon actually occurs over a period of observation.

<p>
Suppose that the random variable \(X\) has the probability function given by
$$Pr(X=k)=e^{-\lambda}\frac{\lambda^k}{k!}$$
for \(k=0,1,2,\dots\) and \(\lambda>0\).
The random variable \(X\) is called a <b>Poisson random variable</b> with parameter \(\lambda\).
<p>

The expected value and variance are both equal to \\(\lambda\\):
$$Var[X]=E[X]=\lambda$$

*Neat Property:* The sums of independent Poisson Random Variables is:
$$E[X] = E[X_1 + X_2] = \lambda_1+\lambda_2$$



## Common Continuous Random Variables
***

### Uniform on Interval [A, B]
\\(X \sim Uniform[A, B]\\)

A continuous uniform random variable is the continuous version of discrete uniform random variable. The probability of a single point is always zero. The density function is constant on its domain.

We say \\(X\\) has the uniform distribution on \\([A, B]\\) if the density function is given by:
$$f_X(x)=\frac{1}{B-A}\qquad A\le x\le B$$

#### Properties

1. The CDF is given by:
$$F_X(x)=\frac{x-A}{B-A}\qquad A\le x \le B$$

2. The expected value can be calculated as:

$$E[X]=\frac{A+B}{2}$$

3. The expected value can be calculated as:

$$Var[X]=\frac{(B-A)^2}{12}$$

4. If \\(A\le a\le b\le B\\), then:

$$Pr[a\le X\le b]=\frac{b-a}{B-A}=\frac{\textnormal{Length of Event}}{\textnormal{Length of Domain}}$$


### Exponential
\\(X \sim Exponential(\lambda)\\)

The exponential distribution is closely related to the Poisson Distribution. Recall that a Poisson process is a way of modeling certain random and sporadically occurring phenomena in which the overall mean rate of occurrence is \\(\lambda\\) per unit time.

The Poisson random Variable \\(X\\) models the *number of occurrences in a given unit time period.* Notice that \\(X\\) take integer values and hence is a Discrete Random Variable.

The *exponential* random variable \\(X\\) is used to model the time until the next occurrence, which we will often refer to as the *waiting time.*

Let \\(\beta=\frac1\lambda\\). We say the non-negative random variable \\(X\\) has an exponential distribution with mean \\(\beta\\) if the CDF of \\(X\\) takes the form:
$$F_X(X)=1-e^{-\lambda x}=1-e^{-(1/\beta) x}\qquad 0\le x<\infty$$

The exponential random variable \\(X\\) can be though of as the *time until the next occurrence* in a Poisson process. In this case \\(\lambda\\) represents the mean rate of occurrence and \\(\beta\\) represents the mean time between occurrences.

#### Properties
1. The density function of an exponential random variable is:

$$f_X(x)=\lambda e^{-\lambda x}=\frac1\beta e^{-(1/\beta)x}\qquad0\le x<\infty$$

2. The expected value of the random variable is:

$$E[X]=\frac1\lambda=\beta$$

3. The variance is:

$$Var[X]=\frac{1}{\lambda^2}=\beta^2$$

<!-- 4. The Moment Generating Function is: -->

<!-- $$M_X(t)=\frac{\lambda}{\lambda-t}=\frac1{1-\beta t}\qquad t<\lambda$$ -->

<!-- 5. The median of an exponential random variable with mean $\beta$ is: -->

<!-- $$x_{.5}=\beta\cdot \ln(2)$$ -->

4. *The Memoryless Property:* Let \\(X\\) be an exponential random variable with mean \\(\beta\\). We have:

    $$Pr[X>b]=Pr[X>a+b|X>a]$$

    In words, the probability of waiting at least time \\(b\\) is the same as the probability of waiting an additional time \\(b\\) given that time \\(a\\) has already elapsed.



### Normal (Gaussian)
\\(X \sim Normal(\mu,\sigma^2)\\)

Normal distributions are the familiar bell-shaped curve. Each normal random variable is completely determined by its expected value \\(\mu\\) and variance \\(\sigma^2\\).

There are a few kinds of normal distributions.
1. Standard Normal Distribution
2. General Normal Distribution
3. Lognormal Distribution

The standard normal distribution is a normal distribution that is normalized around 0. A random variable \\(X\\) is said to be *normally distributed* if it can be written as a linear transformation of the standard normal distribution \\(Z\\).

$$X=a\cdot Z+b$$

#### Standard Normal Properties

1. The density function is:

$$f_Z(z)=\frac1{\sqrt{2\pi}}e^-(z^2/2)\qquad -\infty<z<\infty$$

2. The CDF is:

$$F_Z(z)=\int_{-\infty}^zf_Z(u)\,du$$

3. The expected value equals 0:

$$\mu_Z=0$$

4. The variance equals 1:

$$\sigma_Z^2=1$$

<!-- 5. The moment generating function is: -->

<!-- $$M_Z(t)=e^{t^2/2}$$ -->


#### General Normal Properties

Let \\(X=a\cdot Z+b\\) where \\(a>0\\) and \\(-\infty<b<\infty\\).

1. The density function is:

$$f_X(x)=\frac{1}{\sigma_X\sqrt{2\pi}}e^{-\frac12(\frac{x-\mu}{\sigma_X})^2}\qquad -\infty<x<\infty$$

2. The CDF is:

$$F_X(x)=\Phi\bigg(\frac{x-\mu_X}{\sigma_X}\bigg)$$


3. The expected value is calculated as:

$$E[X]=\mu_x=b$$

4. The variance is calculated as:

$$Var[X]=\sigma_X^2=a^2$$

5. We can normalize it to get a standard uniform distribution:

    $$X=\sigma_X\cdot Z+\mu_X\quad \iff \quad Z=\frac{X-\mu_X}{\sigma_X}$$


<!-- 6. The Moment Generating Function is: -->

<!-- $$M_X(t)=e^{\mu_Xt+(1/2)\sigma_X^2t^2}$$ -->

6. We can calculate the probability in a range from the below calculation (usually need lookup tables):

    $$Pr[c\le X\le d]=\Phi\bigg(\frac{d-\mu_X}{\sigma_X}\bigg)-\Phi\bigg(\frac{c-\mu_X}{\sigma_X}\bigg)$$

7. If \\(X\sim N(\mu_X, \sigma_X^2)\\) and \\(Y\sim N(\mu_Y,\sigma_Y^2)\\) are independent random variables, then:

$$(X+Y)\sim N(\mu_X+\mu_Y,\sigma_X^2+\sigma_Y^2)$$

<br>
That's about as much as I have to write on univariate probability. If you're reading this, I'll probably have a primer on multivariate probability written, which you should check out.
<br>


