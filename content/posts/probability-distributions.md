+++
title = "Common Probability Distributions"
date = 2024-02-08T12:29:32-06:00
tags = ["Class Notes"]
+++
{{< katex >}}{{< /katex >}}

> An overview of common discrete and continuous distributions found in probability and statistics, from Mark Maxwell's textbook, Probability & Statistics with Applications, Second Edition.



## Common Discrete Distributions
---

### Discrete Uniform
A random variable $X$ is said to have a **discrete uniform distribution** if its probability function is:

$$Pr(X=x)=\frac{1}{n}$$

for $x=1,2,\dots,n$.

#### Main Properties 
- Expected Value: 
$$E[X ]=\frac{n+1}{2}$$

- Variance:
$$Var[X ]= \frac{n^2-1}{12}$$

#### Additional Properties
- Median: Same as Expected Value
- Mode: None 


---
### Bernoulli

A Bernoulli trial is an experiment that has two outcomes (true-false; girl-boy, success-fail, in-out, etc).

Suppose that the random variable $X$ has probability function given by: 
$$Pr[X=1]=p \quad \text{and} \quad Pr[X=0]=(1-p)=q$$
Then $X$ is called a <b>Bernoulli random variable</b> with probability of success $p$.

#### Main Properties
- Expected Value: 
$$E[X ]=p$$

- Variance:
$$Var[X ]=p\cdot q$$


---
### Binomial

<p>
\(X \sim Binomial(n, p)\)
</p>

<p>
Let \(X\) be <i>the number of successes</i> in \(n\) independent repetitions of Bernoulli Trials with probability of success \(p\).
The random variable \(X\) has probability function given by
$$Pr(X=x)={n\choose x}\cdot p^x\cdot q^{n-x}$$
for \(x = 0,1,2,\dots,n\) and \(0\le p\le 1\).
The random variable \(X\) is called a <b>binomial random variable</b> with <i>parameters</i> \(n\) and \(p\).
</p>

#### Parameters 
- $n$ - Number of trials
- $p$ - Probability of success

#### Main Properties
- Expected Value: 
$$E[X ]=n\cdot p$$

- Variance: 
$$Var[X ]=n\cdot p \cdot q$$

#### Additional Properties
- Moment Generating Function:
$$M_S(t)=(q+pe^t)^n$$


---
### Geometric

<p>\(X \sim Geometric(p)\)</p>

<p>
Consider a series of independent Bernoulli Trials with probability of success \(p\) and let the random variable \(X\) be <i>the number of failures before the first success.</i>
\(X\) has the probability function given by
$$Pr(X=k)=p\cdot q^k$$
where \(k\in \{0,1,2,\dots\}\) and \(0\lt p\lt 1\).
The random variable \(X\) is called a <b>geometric random variable</b> with <i>parameter</i> \(p\).
</p>

#### Parameters 
- $p$ - Probability of success

#### Main Properties
- Expected Value: 
$$E[X ] = \frac{q}{p}$$

- Variance: 
$$Var[X ] = \frac{q}{p^2}$$

#### Additional Properties
- Mode is 0

- Moment Generating Function:
$$M_X(t)=\frac{p}{1-qe^t}$$


---
#### Negative Binomial
<p>\(X \sim NegativeBinomial(r, p)\)</p>

<p>
The negative binomial distribution is a generalization of the Geometric Distribution but until \(r\) successes instead of just one.
</p>
<p>
Consider a series of independent Bernoulli Trials with probability of success \(p\) and let the random variable \(X\) be <i>the number of failures before the \(r^{th}\) success.</i>
\(X\) has the probability distribution given by
$$Pr(X=k)={r+k-1\choose k}\cdot p^r \cdot q^k$$
for \(k=0,1,2,\dots,\) and \(0\lt p\lt 1\).
The random variable \(X\) is called a <b>negative binomial random variable</b> with parameters \(r\) and \(p\).
</p>

#### Parameters 
- $r$ - Number of successes
- $p$ - Probability of success

#### Main Properties
- Expected Value: (The mean and variance is the same as the geometric distribution, but multiplied by $r$)
$$E[X ]=\frac{rq}{p}$$

- Variance: 
$$Var[X ]=\frac{rq}{p^2}$$


#### Additional Properties
- Mode is 0

- Momentum Generating Function:
$$M_S(t)=\bigg(\frac{p}{1-qe^t}\bigg)^r$$


---
### Hyper-Geometric
\\(X \sim HyperGeometric(G,B,n)\\)

The Hyper-Geometric distribution is similar to a Binomial Distribution except that you are removing from the population every time you sample (sample without replacement, thus trials are not independent).

<p>
A finite population consists of \(G\) objects (successes) and \(B\) objects (fails). Let \(X\) be the number of \(G\) objects drawn without replacement in a sample of size \(n\). The random variable \(X\) has the probability function given by:
$$Pr(X=k)=\frac{_GC_k\cdot {_BC_{n-k}}}{_{G+B}C_n}$$
where \(k\) is the number of observed successes with \(0\le k\le G\) and \(0\le n-k\le B\). The random variable \(X\) is called a <b>hyper-geometric random variable</b> with parameters \(G\), \(B\), and \(n\).
</p>

#### Parameters 
- $G$ - Number of good objects
- $B$ - Number of bad objects 
- $n$ - Number of samples 

#### Main Properties
- Expected Value:
$$E[X ]=n\cdot\Big(\frac{G}{G+B}\Big)$$

- Variance:
$$Var[X ]=n\cdot\Big(\frac{G}{G+B}\Big)\cdot\Big(\frac{B}{G+B}\Big)\cdot\Big(\frac{G+B-n}{G+B-1}\Big)$$


---
### Poisson
\\(X \sim Poisson(\lambda)\\)

The Poisson distribution is used to count the number of times a random and sporadically occurring phenomenon actually occurs over a period of observation.

<p>
Suppose that the random variable \(X\) has the probability function given by
$$Pr(X=k)=e^{-\lambda}\frac{\lambda^k}{k!}$$
for \(k=0,1,2,\dots\) and \(\lambda>0\).
The random variable \(X\) is called a <b>Poisson random variable</b> with parameter \(\lambda\).
<p>

#### Parameters 
- $\lambda$ - Number of occurrences that occur over a period of observation

#### Main Properties
- Expected Value:
$$E[X ]=\lambda$$

- Variance:
$$Var[X ]=\lambda$$

#### Additional Properties
- The sums of independent Poisson Random Variables is:
$$E[X ] = E[X_1 + X_2] = \lambda_1+\lambda_2$$

- Mode: If $\lambda$ is an integer, then $\text{Mode} = \\{\lambda, \lambda - 1\\}$. Otherwise, $\text{Mode} = \lfloor\lambda\rfloor$

- Moment Generating Function:
$$M_X(t)=e^{\lambda\cdot(e^t-1)}$$



## Common Continuous Distributions
---

### Uniform on Interval [A, B]
\\(X \sim Uniform[A, B]\\)

A continuous uniform random variable is the continuous version of discrete uniform random variable. The density function is constant on its domain.


#### Main Properties
- Density Function:
$$f_X(x)=\frac{1}{B-A}\qquad A\le x\le B$$

- CDF:
$$F_X(x)=\frac{x-A}{B-A}\qquad A\le x \le B$$

- Expected Value:
$$E[X ]=\frac{A+B}{2}$$

- Variance:
$$Var[X ]=\frac{(B-A)^2}{12}$$

#### Additional Properties
- Median: Same as Expected Value
- Mode: None

- Probability between $a$ and $b$:
$$Pr[a\le X\le b]=\frac{b-a}{B-A}=\frac{\textnormal{Length of Event}}{\textnormal{Length of Domain}}$$


---
### Exponential
\\(X \sim Exponential(\beta)\\)

The exponential distribution is closely related to the Poisson Distribution. Recall that a Poisson process is a way of modeling certain random and sporadically occurring phenomena in which the overall mean rate of occurrence is \\(\lambda\\) per unit time.

The Poisson random Variable \\(Y\\) models the *number of occurrences in a given unit time period.*

The *exponential* random variable \\(X\\) is used to model the time until the next occurrence, which we will often refer to as the *waiting time.*

The exponential random variable \\(X\\) can be though of as the *time until the next occurrence* in a Poisson process. In this case \\(\lambda\\) represents the mean rate of occurrence and \\(\beta\\) represents the mean time between occurrences.

#### Parameters 
- $\beta=\frac1\lambda$ - Average time until next occurrence

#### Main Properties

- Density Function:
$$f_X(x)=\lambda e^{-\lambda x}=\frac1\beta e^{-(1/\beta)x}\qquad0\le x<\infty$$

- CDF:
$$F_X(X)=1-e^{-\lambda x}=1-e^{-(1/\beta) x}\qquad 0\le x<\infty$$

- Expected Value:
$$E[X ]=\frac1\lambda=\beta$$

- Variance:
$$Var[X ]=\frac{1}{\lambda^2}=\beta^2$$

#### Additional Properties

- Moment Generating Function:
$$M_X(t)=\frac{\lambda}{\lambda-t}=\frac1{1-\beta t}\qquad t<\lambda$$

- Median:

$$x_{.5}=\beta\cdot \ln(2)$$

- Mode is 0

- The Memoryless Property:

    $$Pr[X>b]=Pr[X>a+b|X>a]$$

    In words, the probability of waiting at least time \\(b\\) is the same as the probability of waiting an additional time \\(b\\) given that time \\(a\\) has already elapsed.


---
### Standard Normal
\\(X \sim Normal(\mu=0,\sigma^2=0)\\)

Normal distributions are the familiar bell-shaped curve. Each normal random variable is completely determined by its expected value \\(\mu\\) and variance \\(\sigma^2\\).

There are a few kinds of normal distributions.
1. Standard Normal Distribution
2. General Normal Distribution
3. Lognormal Distribution

The standard normal distribution is a normal distribution that is normalized around 0. A random variable \\(X\\) is said to be *normally distributed* if it can be written as a linear transformation of the standard normal distribution \\(Z\\).

$$X=a\cdot Z+b$$

#### Standard Normal Properties
- Density Function:
$$f_Z(z)=\frac1{\sqrt{2\pi}}e^{-(z^2/2)}\qquad -\infty<z<\infty$$

- CDF: (There's no good way to get the CDF. Use a lookup table for probabilities)
    $$F_Z(z)=\int_{-\infty}^zf_Z(u) du$$


- Expected Value:
$$\mu_Z=0$$

- Variance:
$$\sigma_Z^2=1$$

#### Additional Properties
- Median and mode are 0

- Moment Generating Function:
$$M_Z(t)=e^{t^2/2}$$


---
### General Normal
\\(X \sim Normal(\mu,\sigma^2)\\)

Let \\(X=a\cdot Z+b\\).

#### Parameters
- $\mu$ - The mean of the distribution
- $\sigma^2$ - The sigma of the distribution


#### Main Properties
- Density Function:
$$f_X(x)=\frac{1}{\sigma_X\sqrt{2\pi}}e^{-\frac12(\frac{x-\mu}{\sigma_X})^2}\qquad -\infty<x<\infty$$

- CDF:
$$F_X(x)=\Phi\bigg(\frac{x-\mu_X}{\sigma_X}\bigg)$$

- Expected Value:
$$E[X ]=\mu_x=b$$

- Variance:
$$Var[X ]=\sigma_X^2=a^2$$

#### Additional Properties
- Moment Generating Function:

$$M_X(t)=e^{\mu\cdot t+(1/2)\sigma^2t^2}$$

- We can add two normal distributions $X$ and $Y$ together:

$$(X+Y)\sim N(\mu_X+\mu_Y,\sigma_X^2+\sigma_Y^2)$$

- We can normalize the distribution to get a standard uniform distribution:

$$X=\sigma_X\cdot Z+\mu_X\quad \iff \quad Z=\frac{X-\mu_X}{\sigma_X}$$


- We can calculate the probability in a range from the below calculation (usually need lookup tables):

$$Pr[c\le X\le d]=\Phi\bigg(\frac{d-\mu_X}{\sigma_X}\bigg)-\Phi\bigg(\frac{c-\mu_X}{\sigma_X}\bigg)$$


**Example**

Suppose that the random variable $X$ is normally distributed with mean equal to 5 and standard deviation equal to 2, that is, $X\sim N(5,2^2)$. Find $Pr(X<9.3)$ and $Pr(-.2<X<6.9)$.

We begin by computing the related Z-Score for each. Let $Z$ denote the standard normal distribution. If $x=9.3$, then:

$$z=\frac{x-\mu}{\sigma}=\frac{9.3-5}{2}=2.15$$
$$Pr(X<9.3)=Pr(Z<2.15)=.9842$$


---
### Lognormal

We say the random variable $Y$ has a *lognormal distribution* if the transformed random variable $X=\ln(Y)$ is normally distributed with a expected value $\mu_X$ and variance $\sigma_X^2$.

This is equivalent to writing $Y=e^X$, where $X\sim N(\mu_X, \sigma_X^2)$. From the properties of the exponential function, $Y$ is a non-negative random variable regardless of what $\mu_X$ and $\sigma_X^2$ are.

This is common in modeling exponential growth or decay when the rate of growth is treated as a normal distribution instead of fixed.

#### Parameters
- $\mu_X$ - Mean of the underlying distribution
- $\sigma_X^2$ - Variance of the underlying distribution

#### Properties
Let $Y=e^X$ where $X\sim N(\mu_X, \sigma_X^2)$.

- Density Function:
$$f_Y(y)=\frac{1}{y\sigma_X\sqrt{2\pi}}e^{-\frac12(\frac{\ln y-\mu_X}{\sigma_X})^2}$$

- CDF:
$$F_Y(y)=\Phi\bigg(\frac{\ln y-\mu_X}{\sigma_X}\bigg)\qquad 0<y<\infty$$

- Expected Value:
$$E[Y]=e^{\mu_X+(1/2)\sigma_X^2}$$

- Variance:
$$Var[Y]=e^{2\mu_X+\sigma_X^2}\cdot(e^{\sigma_X^2}-1)$$

#### Additional Properties
- For $0<a<b$,
$$Pr[a<Y\le b ]=\Phi\bigg(\frac{\ln b-\mu_X}{\sigma_X}\bigg)-\Phi\bigg(\frac{\ln a-\mu_X}{\sigma_X}\bigg)$$


---
### Gamma
$X \sim \Gamma(\alpha,\beta)$

The Gamma distribution generalizes the Exponential distribution. It makes use of the gamma function as explained below.

The definition of the Gamma function is:
$$\Gamma(\alpha)=\int_0^\infty x^{\alpha-1}e^{-x}dx \qquad 0\lt\alpha\lt\infty$$

Properties of the Gamma function are:
1. Iteration Formula: $\Gamma(\alpha) = (\alpha - 1)\cdot\Gamma(\alpha-1)$ for all $\alpha > 1$.
2. If $\alpha=n$ is a positive integer, then $\Gamma(n)=(n-1)!$
3. $\Gamma(\frac12)=\sqrt\pi$

#### Parameters
- $\alpha$ - shape parameter (number of events)
- $\beta$ - scale parameter (average time until occurrence)

#### Properties
- Density Function:
$$f_X(x)=\frac1{\beta^\alpha\cdot\Gamma(\alpha)}\cdot x^{\alpha-1}e^{-(1/\beta)x} \qquad 0 \le x < \infty$$

- CDF: Integrate the density function (no cookie-cutter solution)

- Expected Value:
$$E[X ]= \alpha\cdot\beta$$

- Variance:
$$Var[X ]= \alpha\cdot\beta^2$$

#### Additional Properties
- Moment Generating Function (defined for all $t<\lambda$)
$$M_X(t)=\big(\frac{\lambda}{\lambda-t}\big)^\alpha=\big(\frac{1}{1-\beta t}\big)^\alpha$$

- If $X$ and $Y$ are independent Gamma random variables, then $X+Y\sim\Gamma(\alpha_X+\alpha_Y, \beta)$

- If $X\sim\Gamma(\alpha, \beta)$ and $Y=k\cdot X$, then $Y\sim\Gamma(\alpha, k\cdot\beta)$

- For any $\alpha, \beta>0$, 
$$\int_0^\infty x^{\alpha-1}e^{-(1/\beta)x}dx = \beta^\alpha\cdot\Gamma(\alpha)$$

- $Z^2\sim\Gamma(\frac12, 2)$. This distribution is called chi-square with 1 degree of freedom, denoted as $\chi^2(1)$


---
### Beta
$X \sim Beta(\alpha,\beta)$

This distribution lives on the unit interval $[0, 1]$. It is based on the Beta function which is explained below.

The beta function is defined as the following definite integral:
$$B(\alpha, \beta) = \int_0^1 x^{\alpha-1}(1-x)^{\beta-1}dx$$

Properties of the beta function are:
1. $B(\alpha, \beta) = B(\beta, \alpha)$
2. $B(\alpha, \beta) = 2\int_0^{\pi/2}(sin^{2\alpha-1}\theta)(cos^{2\beta-1}\theta)d\theta$
1. $B(\alpha, \beta) = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}$

#### Parameters
- $\alpha$ - Shape parameter
- $\beta$ - Shape parameter

#### Properties
- Density Function:
$$f_X(x)=\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}\cdot x^{\alpha-1}\cdot(1-x)^{\beta-1} \qquad 0<x<1$$

- CDF: Integrate the density function (no cookie-cutter solution)

- Expected Value:
$$E[X ]=\frac{\alpha}{\alpha + \beta}$$

- Variance:
$$Var[X ]=\frac{\alpha\beta}{(\alpha + \beta)^2(\alpha + \beta + 1)}$$
