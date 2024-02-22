+++
title = "Statistics"
description = "WORK IN PROGRESS. My notes over Mark Maxwell's course, Introduction to Mathematical Statistics, and textbook, Probability & Statistics with Applications, Second Edition."
date = 2024-02-21T14:07:21-06:00
tags = ["Math Notes"]
+++

{{< toc >}}



## Sampling Distributions and Estimation
---

### The Sample Mean as an Estimator
Let $X$ be a random variable with finite mean $\mu_X$ and variance $\sigma_X^2$. We refer to $X$ as the **population** random variable.

Let $X_1, X_2, \dots, X_N$ be independent, identically distributed observations of $X$, abbreviated as $(X_i)_{i=1}^n$ I.D.D. $\sim X$.

Then $(X_i)_{i=1}^n$ is called a **random sample** of $X$.

The **sample mean** is defined as:

$$\bar{X}=\frac1n \cdot \sum_{i=1}^n X_i$$

The following properties follow:
1. The expected value:
$$\mu_{\bar{X}} =  E[\bar{X}] = E[ X] = \mu_X$$


2. The variance:
    $$\sigma_{\bar{X}}^2 = \text{Var}[\bar{X}] = \frac{\sigma_X^2}{n}$$
    Equivalently, the standard deviation:
    $$\sigma_{\bar{X}} = \frac{\sigma_X}{\sqrt{n}}$$

3. The Central Limit Theorem: For large sampel size $n$, the distribution of $\bar{X}$ is approximately normal with the mean and variance above. If the population $X$ is normal, then $\bar{X}$ is also normal.

The first property says that $\bar{X}$ is an **unbiased estimator** of the population mean, which means that the expected value of the sample mean equals the population mean.

The usual way of conveying the accuracy of an estimator for a population mean is through the statement:

$$1-\alpha = \text{Pr}[|\bar{X}-\mu_X| \le \epsilon]$$

- The epsilon is the **margin of error**. It represents the absolute deviation of the sample mean from the population mean.
- The probability $1-\alpha$ is the **confidence level** and is equal to the likelihood that the sample and population mean are within a specified margin of error.

#### Estimating the Mean of a Normal Population with known Variance

Let $X$ be a normally distributed population random variable with a known variance $\sigma_X^2$. Let $\bar{X}$ be the sample mean from a random sample of size $n$.

For a given confidence level $1-\alpha$, we have the margin of error in estimating $\mu_X$ by $\bar{X}$ is given by $\epsilon=z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}$ and thus:

$$1-\alpha = \text{Pr}\Big[|\bar{X}-\mu_X| \le z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}\Big]$$

We say that that:

$$\bar{X}\pm \epsilon = \Big(\bar{X} - z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}, \bar{X} + z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}\Big)$$
is a $1-\alpha$ symmetric **confidence interval** for estimating the population mean $\mu_X$.

### Estimating the Population Variance

The population variance is rarely known in advanced. Thus, we use random samples to devise a suitable estimate.

#### Deviations form the Sample Mean

Let $X$ be a population random variable and $(X_i)_{i=1}^n$ be a random sample from $X$. We have that:

1. $$\sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n (X_i - \mu_X)^2 -n(\bar{X}-\mu_X)^2$$

2. $Cov(\bar{X}, X_i - \bar{X})=0$ for each $i=1,2,\dots,n$.

#### The Sample Variance

We define **Sample Variance** by:

$$S^2 = \frac{1}{n-1}\sum_{i=1}^n (X_i - \bar{X})^2$$

The sample variance $S^2$ is an **unbiased** estimator of $\sigma_X^2$. That is:
$$E[S^2]=\sigma_X^2$$

#### Properties of the Sample Variance form a Normal Population

If $X$ is a normal population random variable with $(X_i)_{i=1}^n$ as a random sample from $X$.

1. The sample mean $\bar{X}$ and the sample variance $S^2$ are independent random variables.
2. The random variable $\frac{(n-1)S^2}{\sigma_X^2}$ is chi-squared with $(n-1)$ degrees of freedom. That is:
$$\frac{(n-1)S^2}{\sigma_X^2} \sim \chi^2(n-1)=\Gamma(\frac{n-1}{2}, 2)$$

#### Confidence Interval for the Variance of a Normal Population

If $X$ is a normal population random variable with $(X_i)_{i=1}^n$ as a random sample from $X$ and $S^2$ as the sample variance, then the interval

$$\bigg(\frac{(n-1)\cdot S^2}{\chi_{\alpha/2}^2 (n-1)},\frac{(n-1)\cdot S^2}{\chi_{1-\alpha/2}^2 (n-1)}\bigg)$$

constitutes a $1-\alpha$ confidence interval for estimating $\sigma_X^2$.
