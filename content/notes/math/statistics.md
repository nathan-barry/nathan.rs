+++
title = "Mathematical Statistics"
description = "My notes over Mark Maxwell's course, Introduction to Mathematical Statistics, and textbook, Probability & Statistics with Applications, Second Edition."
date = 2024-02-21T14:07:21-06:00
tags = ["Math Notes"]
+++

{{< toc >}}



## Sampling Distributions and Estimation
---

Normally in a probability experiment, we don't know the true values of a model's parameters, and therefore, we must estimate them using random observations. Because the observations are random, our estimates are subject to the vagaries of chance. We find ourselves in a paradoxical situation in which the parameters are fixed, but unknown, while the estimates are random, but observable.

Below are a few standard parameter estimation procedures used in statistics and an introduction to confidence intervals.

<br>

### Estimating the Population Mean
Let $X$ be a random variable with finite mean $\mu_X$ and variance $\sigma_X^2$. We refer to $X$ as the **population** random variable.

Let $X_1, X_2, \dots, X_N$ be independent, identically distributed observations of $X$, abbreviated as $(X_i)_{i=1}^n$ I.D.D. $\sim X$.

Then $(X_i)_{i=1}^n$ is called a **random sample** of $X$.

The **sample mean** is defined as:

$$\bar{X}=\frac1n \cdot \sum_{i=1}^n X_i$$

The following properties follow:
1. The expected value:
$$\mu_{\bar{X}} =  E[\bar{X}] = E[ X] = \mu_X$$


2. The variance and standard deviation:
    $$\sigma_{\bar{X}}^2 = \text{Var}[\bar{X}] = \frac{\sigma_X^2}{n}$$
    $$\sigma_{\bar{X}} = \frac{\sigma_X}{\sqrt{n}}$$

3. The Central Limit Theorem: For large sampel size $n$, the distribution of $\bar{X}$ is approximately normal with the mean and variance above. If the population $X$ is normal, then $\bar{X}$ is also normal.

The first property says that $\bar{X}$ is an **unbiased estimator** of the population mean, which means that the expected value of the sample mean equals the population mean.

The usual way of conveying the accuracy of an estimator for a population mean is through the statement

$$1-\alpha = \text{Pr}[|\bar{X}-\mu_X| \le \epsilon]$$

where:
- The epsilon is the **margin of error**. It represents the absolute deviation of the sample mean from the population mean.
- The probability $1-\alpha$ is the **confidence level** and is equal to the likelihood that the sample and population mean are within a specified margin of error.

In general, for a fixed sample size, the higher the confidence level, the larger the margin of error and vice versa.

<br>

#### Estimating the Mean of a Normal Population with known Variance

Let $X$ be a normally distributed population random variable with a known variance $\sigma_X^2$. Let $\bar{X}$ be the sample mean from a random sample of size $n$.

For a given confidence level $1-\alpha$, we have the margin of error in estimating $\mu_X$ by $\bar{X}$ is given by $\epsilon=z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}$ and thus:

$$1-\alpha = \text{Pr}\Big[|\bar{X}-\mu_X| \le z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}\Big]$$

We say that that:

$$\bar{X}\pm \epsilon = \Big(\bar{X} - z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}, \bar{X} + z_{\alpha/2}\cdot\frac{\sigma_X}{\sqrt{n}}\Big)$$
is a $1-\alpha$ symmetric **confidence interval** for estimating the population mean $\mu_X$.


<br>

### Estimating the Population Variance

The population variance is rarely known in advanced. Thus, we use random samples to devise a suitable estimate.

<br>

#### Deviations from the Sample Mean

Let $X$ be a population random variable and $(X_i)_{i=1}^n$ be a random sample from $X$. We have that:

1. $$\sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n (X_i - \mu_X)^2 -n(\bar{X}-\mu_X)^2$$

2. $Cov(\bar{X}, X_i - \bar{X})=0$ for each $i=1,2,\dots,n$.

<br>

#### The Sample Variance

We define **Sample Variance** by:

$$S^2 = \frac{1}{n-1}\sum_{i=1}^n (X_i - \bar{X})^2$$

The sample variance $S^2$ is an **unbiased** estimator of $\sigma_X^2$. That is:
$$E[S^2]=\sigma_X^2$$

<br>

#### Properties of the Sample Variance

If $X$ is a normal population random variable with $(X_i)_{i=1}^n$ as a random sample from $X$.

1. The sample mean $\bar{X}$ and the sample variance $S^2$ are independent random variables.
2. The random variable $\frac{(n-1)S^2}{\sigma_X^2}$ is chi-squared with $(n-1)$ degrees of freedom. That is:
$$\frac{(n-1)S^2}{\sigma_X^2} \sim \chi^2(n-1)=\Gamma\Big(\frac{n-1}{2}, 2\Big)$$

<br>

#### Confidence Interval for the Population Variance

If $X$ is a normal population random variable with $(X_i)_{i=1}^n$ as a random sample from $X$ and $S^2$ as the sample variance, then the interval

$$\bigg(\frac{(n-1)\cdot S^2}{\chi_{\alpha/2}^2 (n-1)},\frac{(n-1)\cdot S^2}{\chi_{1-\alpha/2}^2 (n-1)}\bigg)$$

constitutes a $1-\alpha$ confidence interval for estimating $\sigma_X^2$.


<br>

### Estimating Proportions

Let $(X_i)_{i=1}^n$ be a random sample taken from the Bernoulli trial population $X$. Let $p$ be the probability of success for the population $X$, and let $\hat{p}=\bar{X}=\frac1{n}\sum X_i$.
This is just the binomial random variable with parameters $p$ and $n$, but in this case, we are trying to find what $p$ is.

1. $\hat{p}$ is the proportion of successes in the sample.
2. $\hat{p}$ is an unbiased estimator of $p$. That is $E[\hat{p}]=p$.
3. For large $n$, the following is approximately a standard normal random variable:
    $$Z\approx\frac{\hat{p}-p}{\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}}$$
4. For large $n$, an approximate symmetric $1-\alpha$ confidence interval for $p$ is given by $\hat{p}\pm \epsilon$, where:
$$\epsilon=\text{margin of error}=z_{\alpha/2}\cdot \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$


<br>

### Estimating the Difference Between Means

A common question is whether or not two populations have the same mean.

Let $X$ and $Y$ be independent normal populations. Assume that $\sigma_X^2$ and $\sigma_Y^2$ are known. Let each have sample means $\bar{X}$ and $\bar{Y}$ with samples of size $m$ and $n$ respectively. Let $W=X-Y$ and let $\bar{W}=\bar{X}-\bar{Y}$. Then:

1. $$E[\bar{W}] = E[W] = \mu_X - \mu_Y$$
2. $$Var[\bar{W}] = Var[\bar{X}] - Var[\bar{Y}] = \frac{\sigma_X^2}{m} - \frac{\sigma_Y^2}{n}$$
3. For a confidence level of $1-\alpha$, the margin of error in estimating $\mu_X - \mu_Y$ with $\bar{W}=\bar{X}-\bar{Y}$ is given by:
$$\epsilon=z_{\alpha/2}\sqrt{\frac{\sigma_X^2}{m} - \frac{\sigma_Y^2}{n}}$$
4. $\bar{W}\pm\epsilon$ is a symmetric $1-\alpha$ confidence interval for $\mu_X - \mu_Y$.

<br>

#### Pooled Sample Variance

For small populations, we assume that the two populations have equal variances (the following works only for this case).

Let independent normal populations $X$ and $Y$ have the sample variances $S_X^2$ and $S_Y^2$ respectively. Define the **pooled sample variance** $S_p^2$ by:

$$S_P^2 = \frac{(m-1)S_X^2 + (n-1)S_Y^2}{(m+n-2)}$$

Then we have the following properties:

1. $$E[S_P^2]=\sigma^2$$
2. $$\frac{(m+n-2)S_P^2}{\sigma^2}\sim \chi^2(m+n-2)$$
3. $$\frac{\bar{W}-\mu_W}{S_P \sqrt{\frac1m + \frac1n}}\sim t(m+n-2)$$



<br>

## Hypothesis Testing
---

In hypothesis testing, we generally have a null hypothesis, denoted as $H_0$, which generally is the baseline position or belief, usually stated as a particular value. This value may be based on previous testing, wisdom, or guesswork. The objective of the teset is to determin on the basis of new data whether or not the null hypothesis should be accepted or rejected in favor of an alternative hypothesis, which we denote as $H_1$.

In a typical test, we use data to construct something called a **test statistic**, and if the value of this statistic falls within a specified range called the **rejection region** (also called the **critical region**), then the null hypothesis is rejected in favor of the alternative.


<br>

### Hypothesis Testing Framework

There are two types of errors we might make when accepting or rejecting the null hypothesis. A **Type I** Error (False Positive) occurs if we reject the null hypothesis even though it is true. A **Type II** Error (False Negative) occurs if we accept the null hypothesis even though it is false.

&nbsp; | $H_0$ is True | $H_0$ is False
--- | --- | --- 
Reject $H_0$  | Type I Error | Correct 
Accept $H_0$  | Correct | Type II Error

Let $X$ be a population random variable with an unknown parameter $\theta$. Consider a hypothesis test consisting of the following hypotheses:

$$H_0: \theta = \theta_0 \qquad H_1: \theta = \theta_1\qquad \text{where }\theta_0\neq\theta_1$$

Let $X_1,\dots,X_n$ be a random sample of size $n$ from $X$ and let $\hat{\theta}$ be a test statistic calculated from the random sample. Let $C$ denote the **rejection region**, consisting of the values of the test statistic $\hat{\theta}$ for which the null hypothesis will be rejected. Then,

1. $\alpha$ denotes the **probability of a Type I error** (also referred to as the **significance level** of the test), meaning that,
$$\alpha = Pr[\text{ rejecting } H_0 | H_0 \text{ true }] = Pr[\hat{\theta}\in C| \theta = \theta_0]$$


2. $\beta$ denotes the **probability of a Type II error**, meaning that,
$$\beta = Pr[\text{ accepting } H_0 | H_1 \text{ true }] = Pr[\hat{\theta}\notin C| \theta = \theta_1]$$


3. $1-\beta$, the complementary probability, is called the **power** of the test, meaning that,
$$1-\beta = Pr[\text{ rejecting } H_0 | H_1 \text{ true }] = Pr[\hat{\theta}\in C| \theta = \theta_1]$$

Usually there is a trade off between minimizing $\alpha$ and minimizing $\beta$ as decreasing one increases the other.

Normally the alternative hypothesis is a complementary range of values. A hypothesis specifying a range of values for the parameter is called a **composite hypothesis**.

<br>

#### Significance Level of a Test

When the alternative hypothesis is composite, we can only calculate the probability of Type I errors. The only conclusion we can draw is either to reject or accept the null hypothesis. This type of test usually specifies the allowable probability of a Type I error, also called the **significance level** and is equal to $\alpha$. This is the probability the test statistic is in the rejection region given that the null hypothesis holds.

Rejecting the null hypothesis at the significance level of $\alpha$ is equivalent to having a $1-\alpha$ confidence interval that misses the null hypothesis value.

<br>

#### The p-Value of a Hypothesis Test

Often, the result of a hypothesis test is conveyed by stating the **p-value** of the test. The p-value is the probability that the test statistic is at least as extreme as the actual observed value, given that the null hypothesis is true. Thus, we only reject the null hypothesis if and only if the p-value is smaller than $\alpha$. It quantifies how close we came to the boundery line between accepting and rejecting.

<br>

#### General Procedure for Hypothesis Testing

Let $X$ be a population random variable with an unknown parameter $\theta$ and let $X_1, ..., X_n$ be a random sample from $X$.

1. Formulate the null and alternative hypotheses in terms of $\theta$:
    - $H_0:\theta = \theta_0$ (stated as a simple hypothesis)
    - $H_1:$ a composite hypothesis taking one of the forms,
        - $\theta \neq \theta_0$ (two-tailed rejection region)
        - $\theta \gt \theta_0$ (right-tailed rejection region)
        - $\theta \lt \theta_0$ (left-tailed rejection region)
2. Specify the significance level $\alpha$.
3. Specify a test statistic $\hat \theta$ based on the random sample $X_1,...,X_n$. This test statistic should be formulated in such a way that its distribution follows one of the standard statistical random variables: $z, t, \chi^2$, or $F$.
4. Construct the **rejection region** using $\alpha$, the distribution of $\hat \theta$, and the tail appropriate for the alternative hypothesis in (1).
5. Evaluate the test statistic $\hat \theta$ using the observed values of the random sample $X_1,...,X_n$ and determine whether or not it falls in the rejection region. Reject $H_0$ if $\hat \theta$ is in the rejection region and accept $H_0$ otherwise.
6. If feasible, calculate the p-value of the test based on the calculated value of $\hat \theta$.


<br>

### Hypothesis Testing for Population Means

We'll give multiple scenarios for testing hypotheses concerning the population mean. In each, the test statistic is based on the sample mean $\bar X$, but we use different tools based on the distribution of $X$, the sample size, and whether the population standard deviation is known.

Three common scenarios are:

1. $X$ is **normal** with a **known standard deviation** $\sigma_X$.
    
    Here, $\bar X$ is normal with a standard deviation given by $\sigma_{\bar X} = \frac{\sigma_X}{\sqrt{n}}$. The test statistic, $Z$, is given below, where $\mu_X$ is the value given in $H_0$.

    $$Z = \frac{\bar X - \mu_X}{\sigma_{\bar X}} = \frac{\bar X - \mu_X}{\frac{\sigma_X}{\sqrt{n}}}$$

2. The distribution of $X$ is unknown but the sample size is large enough that we can conclude $\bar X$ is **approximately normal** from the Central Limit Theorem.

3. $X$ is **normal** but the standard deviation $\sigma_X$ is **unknown** and **must be estimated** using the sample standard deviation $S$.

    Here, the test statistic is the Student t with $n-1$ degrees of freedom (which is shown below and in the Appendix). This scenario is generally used for small sample sizes. If the sample size is large, then it overlaps with the second scenario where the test statistic is approximately normal.

    $$\frac{\bar X - \mu_X}{S/\sqrt n} \sim t(n-1)$$


<br>

### Hypothesis Testing for Population Variance

Assume that $X$ is a normal population and that $X_1, ..., X_n$ is a random sample. If we wish to test for an unknown population variance or standard deviation, a natural test statistic is a standardized version of the sample variance $S^2$ (defined above). Recall that:

$$\frac{(n-1)S^2}{\sigma_X^2} \sim \chi^2(n-1)=\Gamma\Big(\frac{n-1}{2}, 2\Big)$$


<br>

### Hypothesis Testing for Proportions

Let us consider a hypothesis test for $p$ taking the form:
- $H_0: p=p_0$ (stated as a simple hypothesis)
- $H_1:$  a composite hypothesis of one of the forms:
    - $p \neq p_0$ (two-tailed rejection region)
    - $p \gt p_0$ (right-tailed rejection region)
    - $p \lt p_0$ (left-tailed rejection region)

For large $n$, the test statistic $\frac{\hat p - p_0}{\sigma_X / \sqrt n}$ is approximately normal.

Since $X$ is a Bernoulli trial, we have $\sigma_X = \sqrt{p(1-p)}$. Since we are assuming the null hypothesis to be true, the test statistic takes the following form:

$$Z \approx\frac{\hat{p}-p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}}$$


<br>

### Hypothesis Testing for Differences in Population Means

Let $X$ and $Y$ be independent populations and let $(X_i)^m$ and $(Y_j)^n$ be random samples with sample means $\bar X$ and $\bar Y$ with sample standard deviations $S_X$ and $S_Y$. This is for sample sizes of larger or equal to 30.

Let $W=X-Y$, with $\bar W=\bar X-\bar Y$, and let $\mu_{W_0}$ denote the null hypothesis value of $\mu_W=\mu_X-\mu_Y$. Then:

1. $$E[\bar{W}] = E[W] = \mu_X - \mu_Y = \mu_W$$
2. $$Var[\bar{W}] = Var[\bar{X}] - Var[\bar{Y}] = \frac{S_X^2}{m} - \frac{S_Y^2}{n}$$
3. The test statistic, $Z$ used for determining whether to accept or reject the null hypothesis is given by:
$$Z=\frac{\bar W - \mu_{W_0}}{\sqrt{\frac{S_X^2}{m} - \frac{S_Y^2}{n}}}$$

<br>

#### Testing the Difference Between Population Proportions

The same thing can be used for differences in proportions. Let $X$ and $Y$ be independent Bernoulli trial populations with means $p_X$ and $p_Y$. Let $(X_i)^m$ and $(Y_j)^n$ be random samples and let $\hat p_X = \bar X$ and $\hat p_Y = \bar Y$. Similary, assume the sample sizes are greater or equal to 30.

Let $(p_x - p_y)_0$ denote the null hypothesis value of the difference in population means, and let $\bar W = \bar X - \bar Y = \hat p_X - \hat p_Y$. Then:

1. $$E[\bar W] = p_X - p_Y$$
2. $$Var[\bar{W}] \approx \frac{\hat p_X(1 - \hat p_X)}{m} - \frac{\hat p_Y(1 - \hat p_Y)}{n}$$
3. The test statistic used for determining whether to accept or reject the null hypothesis is given by:

$$Z\approx\frac{p_X - p_Y - (p_x - p_y)}{\sqrt{\frac{\hat p_X(1 - \hat p_X)}{m} - \frac{\hat p_Y(1 - \hat p_Y)}{n}}}$$

4. If the null hypothesis is $H_0: p_x = p_y$ (equivalently $(p_X-p_Y)_0 = 0$), then the common value of $p$ is estimated using a pooled proportion of successes given by:

    $$\bar p = \frac{\sum_{i=1}^m X_i + \sum_{j=1}^n Y_j}{m+n} = \frac{m\hat p_X + n \hat p_Y}{m+n}$$

    and the test statistic becomes:

    $$Z\approx\frac{p_X - p_Y}{\sqrt{\bar p(1 - \bar p)\cdot(\frac1m + \frac1n)}}$$



<br>

## Appendix 
---
### Chi-Squared

Measurements of quantities (length, weight, etc) are subject to error. These errors tend to follow a normal distribution. In statistics, we often work with the squares of the sums of errors. Thus, the square of the normal distribution is important.

The Chi-Square Distribution is a name for the distribution of the square of the normal distribution.

<br>

#### Properties

Let $Z\sim N(0, 1)$ be the standard normal random variable.
1. $Z^2 \sim\Gamma(\frac12, 2)$ is called **chi-squared with 1 degree of freedom**, and denoted as $\chi^2(1)$.
2. Sum of $Z^2$: Let $S=Z_1^2 + Z_2^2 + \cdots + Z_n^2$. Then $S\sim\Gamma(\frac{n}2, 2)$ and is called **chi-square with n degrees of freedom**, and is denoted as $\chi^2(n)$.
3. $E[S]=n$ and Var[S]=2n


<br>

### Student's t-Distribution

This distribution arises from using the sample variance instead of the population variance to construct a confidence interval for the mean. Since the population variance is rarely known, this is very useful.

The main use of this distribution is for writing the confidence intervals for the mean of a normal population.

Let $Z$ and $V$ be independent random variables such that $Z$ has a normal standard distribution and $V$ has a chi-squared distribution with $n$ degrees of freedom.

Let $t(n)$ be a transformation of $Z$ and $V$ taking the form:

$$t(n)=\frac{Z}{\sqrt{V/n}}$$

Then $t(n)$ is said to have the Student t-distribution with n degrees of freedom.

The density function for $t(n)$ is:
$$f_T(t)=\frac{\Gamma(\frac{n+1}{2})}{\sqrt{n\pi}\cdot\Gamma(\frac{n}2)}\cdot \Big(\frac{1}{1+t^2/n}\Big)^{(n+1)/2}$$

The shape of the distribution is similar to the standard normal distribution, and as $n$ goes to infinity, it is exactly the standard normal distribution.

<br>

#### Application

Let $X$ be a normal population with $X\sim N(\mu_X, \sigma_X^2)$, with $\mu_X$ and $\sigma_X^2$ both unknown. Let $(X_i)_{i=1}^n$ be a random sample with sample mean $\bar{X}$ and sample variance $S^2$.

1. The random variable below is the same as $t(n-1)$.
$$\frac{\bar{X}-\mu_X}{S/\sqrt{n}}\sim t(n-1)$$

2. A symmetric $1-\alpha$ confidence interval for $\bar{X}$ is given by:

$$\bigg(\bar{X}-t_{\alpha/2}(n-1)\cdot\frac{S}{\sqrt{n}}, \bar{X}+t_{\alpha/2}(n-1)\cdot\frac{S}{\sqrt{n}}\bigg)$$


<br>

### F-Distribution

This distribution arises when we study the ratio of two independent chi-squared random variables, which allows us to estimate the ratio of the variances of each population.

Let $U$ and $V$ be independent non-negative random variables with $U\sim\chi^2(m)$ and $V\sim\chi^2(n)$.

The random variable $F(m, n) = \frac{U/m}{V/n}$ is said to have the F-Distribution with degrees of freedom m and n.

The density function for $F(m, n)$ is given by:

$$f_F(w)=\Big(\frac{m}{n}\Big)^{m/2} \cdot \frac{\Gamma(\frac{m+n}2)}{\Gamma(\frac{m}2)\Gamma(\frac{n}2)} \cdot \frac{w^{(m/2)-1}}{(1+\frac{m}{n}w)^{(m+n)/2}}$$

for $w>0$.

<br>

#### Application

Let $X$ and $Y$ be independent normal populations with variances of $\sigma_X^2$ and $\sigma_Y^2$ respectively. Let $(X_i)$ and $(Y_j)$ be random samples from $X$ and $Y$ with resulting sample variances $S_X^2$ and $S_Y^2$. Then:

$$\frac{S_X^2/\sigma_X^2}{S_Y^2/\sigma_Y^2} \sim F(m-1, n-1)$$ 

A $1-\alpha$ confidence interval for $\frac{\sigma_X^2}{\sigma_Y^2}$ is given by:

$$\bigg(\frac{S_X^2}{S_Y^2}\cdot\frac{1}{F_{\alpha/2}(m-1,n-1)}, \frac{S_X^2}{S_Y^2}\cdot F_{\alpha/2}(n-1,m-1)\bigg)$$

<br>

#### Properties of $F(m,n)$

1. $$F(n,m) = \frac1{F(m,n)}$$
1. $$[t(n)]^2 = F(1,n)$$
3. $$F_{1-\alpha}(m,n) = \frac1{F_{\alpha}(n,m)}$$


<br>

### Testing for Independence by a Contingency Table

Let $X$ and $Y$ be discrete jointly distributed random variables with actual frequencies given by $f_{ij}$. Let $e_{ij}$ be the frequencies resulting from the assumption that $X$ and $Y$ have independent marginal probability distributions:

$$e_{ij} = \frac{f_i \cdot f_j}{f}$$

where $i$ and $j$ are the number of rows and columns. Let the test statistic

$$T=\sum_{i=1}^r \sum_{j=1}^c \frac{(f_{ij}-e_{ij})^2}{e_{ij}}$$

Then, 

1. $$T\approx \chi^2\big((r-1)\cdot(c-1)\big)$$

2. The hypothesis of independence between $X$ and $Y$ can be rejected at the $\alpha$ level of significance providing $T\geq \chi_\alpha^2\big((r-1)\cdot(c-1)\big)$

Test statistic $T$ represents the sum of suitably standardized square deviations between the actual frequencies and the expected frequencies under the assumption of independence. Thus, the null hypothesis of independence is rejected if $T$ is sufficiently large.
