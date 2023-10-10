+++
title = "Common Random Variables"
description = "An overview of different common random variables and their properties (and perhaps a few uncommon ones too)."
date = 2023-09-06T11:40:24-05:00
tags = ["Probability Notes"]
+++

{{< toc >}}


## Overview
***

A random variable is a function that maps a sample space to a set of real numbers which represents outcomes.

$$X: U \rightarrow \R$$

We use upper case letters to denote random variables and lower case letters to represent outcomes that the random variable may take on.

Each random variable has a probability distribution associated with it. The probabilities must be positive and sum to one. There are two different kinds of random variables: Discrete and Continuous.

You can read more about them on my [Univariate Probability Primer](/notes/univariate-probability-primer) post.


## Discrete Random Variables
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



## Continuous Random Variables
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


