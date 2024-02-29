+++
title = "Mathematical Statistics"
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



### Chi-Squared

Measurements of quantities (length, weight, etc) are subject to error. These errors tend to follow a normal distribution. In statistics, we often work with the squares of the sums of errors. Thus, the square of the normal distribution is important.

The Chi-Square Distribution is a name for the distribution of the square of the normal distribution.

#### Properties

Let $Z\sim N(0, 1)$ be the standard normal random variable.
1. $Z^2 \sim\Gamma(\frac12, 2)$ is called **chi-squared with 1 degree of freedom**, and denoted as $\chi^2(1)$.
2. Sum of $Z^2$: Let $S=Z_1^2 + Z_2^2 + \cdots + Z_n^2$. Then $S\sim\Gamma(\frac{n}2, 2)$ and is called **chi-square with n degrees of freedom**, and is denoted as $\chi^2(n)$.
3. $E[S]=n$ and Var[S]=2n



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



### Student's t-Distribution

This distribution arises from using the sample variance instead of the population variance to construct a confidence interval for the mean. Since the population variance is rarely known, this becomes fairly useful.

The main use of this distribution is for writing the confidence intervals for the mean of a normal population.

Let $Z$ and $V$ be independent random variables such that $Z$ has a normal standard distribution and $V$ has a chi-squared distribution with $n$ degrees of freedom.

Let $t(n)$ be a transformation of $Z$ and $V$ taking the form:

$$t(n)=\frac{Z}{\sqrt{V/n}}$$

Then $t(n)$ is said to have the Student t-distribution with n degrees of freedom.

The density function for $t(n)$ is:
$$f_T(t)=\frac{\Gamma(\frac{n+1}{2})}{\sqrt{n\pi}\cdot\Gamma(\frac{n}2)}\cdot \Big(\frac{1}{1+t^2/n}\Big)^{(n+1)/2}$$

The shape of the distribution is similar to the standard normal distribution, and as $n$ goes to infinity, it is exactly the standard normal distribution.

#### Application

Let $X$ be a normal population with $X\sim N(\mu_X, \sigma_X^2)$, with $\mu_X$ and $\sigma_X^2$ both unknown. Let $(X_i)_{i=1}^n$ be a random sample with sample mean $\bar{X}$ and sample variance $S^2$.

1. The random variable below is the same as $t(n-1)$.
$$\frac{\bar{X}-\mu_X}{S/\sqrt{n}}\sim t(n-1)$$

2. A symmetric $1-\alpha$ confidence interval for $\bar{X}$ is given by:

$$\bigg(\bar{X}-t_{\alpha/2}(n-1)\cdot\frac{S}{\sqrt{n}}, \bar{X}+t_{\alpha/2}(n-1)\cdot\frac{S}{\sqrt{n}}\bigg)$$



### F-Distribution

This distribution arises when we study the ratio of two independent chi-squared random variables, which allows us to estimate the ratio of the variances of each population.

Let $U$ and $V$ be independent non-negative random variables with $U\sim\chi^2(m)$ and $V\sim\chi^2(n)$.

The random variable $F(m, n) = \frac{U/m}{V/n}$ is said to have the F-Distribution with degrees of freedom m and n.

The density function for $F(m, n)$ is given by:

$$f_F(w)=\Big(\frac{m}{n}\Big)^{m/2} \cdot \frac{\Gamma(\frac{m+n}2)}{\Gamma(\frac{m}2)\Gamma(\frac{n}2)} \cdot \frac{w^{(m/2)-1}}{(1+\frac{m}{n}w)^{(m+n)/2}}$$

for $w>0$.

#### Application

Let $X$ and $Y$ be independent normal populations with variances of $\sigma_X^2$ and $\sigma_Y^2$ respectively. Let $(X_i)$ and $(Y_j)$ be random samples from $X$ and $Y$ with resulting sample variances $S_X^2$ and $S_Y^2$. Then:

$$\frac{S_X^2/\sigma_X^2}{S_Y^2/\sigma_Y^2} \sim F(m-1, n-1)$$ 

A $1-\alpha$ confidence interval for $\frac{\sigma_X^2}{\sigma_Y^2}$ is given by:

$$\bigg(\frac{S_X^2}{S_Y^2}\cdot\frac{1}{F_{\alpha/2}(m-1,n-1)}, \frac{S_X^2}{S_Y^2}\cdot F_{\alpha/2}(n-1,m-1)\bigg)$$

#### Properties of $F(m,n)$

1. $$F(n,m) = \frac1{F(m,n)}$$
1. $$[t(n)]^2 = F(1,n)$$
3. $$F_{1-\alpha}(m,n) = \frac1{F_{\alpha}(n,m)}$$



### Estimating Proportions

Let $(X_i)_{i=1}^n$ be a random sample taken from the Bernoulli trial population $X$. Let $p$ be the probability of success for the population $X$, and let $\hat{p}=\bar{X}=\frac1{n}\sum X_i$.

1. $\hat{p}$ is the proportion of successes in the sample.
2. $\hat{p}$ is an unbiased estimator of $p$. That is $E[\hat{p}]=p$.
3. For large $n$,
    $$\frac{\hat{p}-p}{\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}}$$
    is approximately a standard normal random variable.
4. For large $n$, an (approximate) symmetric $1-\alpha$ confidence interval for $p$ is given by $\hat{p}\pm \epsilon$, where:
$$\epsilon=\text{margin of error}=z_{\alpha/2}\cdot \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

