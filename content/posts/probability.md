+++
title = "Probability"
date = 2023-09-02T11:14:53-05:00
tags = ["Class Notes"]
+++
{{< katex >}}{{< /katex >}}

> My notes over Mark Maxwell's course, Probability I, and his textbook, Probability & Statistics with Applications, Second Edition.



## Combinatorial Probability
The fundamental theorem of counting is also known as the *multiplication principle*.

Given that there are $N(A)$ outcomes, and for each of these outcomes, there are $N(B)$ outcomes, then the total number of outcomes for the two combined is equal to $N(A)\cdot N(B)$. 

**Example 1:** If I have 3 shirts and 2 pairs of shorts, the total number of outfits I have are:

$$N(A)\cdot N(B)=total\qquad\Rightarrow\qquad 3\cdot2=6$$

**Example 2:** How many possible combinations does a social security number have?

A social security number had 9 digits, each digit ranges from 0 to 9 (10 different outcomes), so the total number of outcomes are

$$10\cdot10\cdot10\cdot10\cdot10\cdot10\cdot10\cdot10\cdot10=10^9$$

### Factorials
Let $n$ be a whole number. Then $n!$ (read as "n factorial") is defined by

$$n! = n\cdot(n-1)\cdot(n-2)\cdot\cdots\cdot3\cdot2\cdot1$$

By convention, we define $0!=1$.

**Example:** 5 factorial is:

$$5!=5\cdot4\cdot3\cdot2\cdot1=120$$

### Permutations
Given a set of $n$ *distinguishable* objects, an *ordered selection* (order matters) of $r$ different elements is called a permutation.

**Example:** Lets say we are betting on a horse race. There are 14 horses. A trifecta bet consists of selecting the first three finishers in order (1st, 2nd, and 3rd).

14 can get 1st, but the winning horse cannot also finish 2nd, so only the 13 remaining horses can get 2nd. Similarly, only 12 horses can be selected for 3rd (Permutations are similar to combinations, but since order matters (while it doesn't in combinations), the amount of different possible outcomes are much higher).

$$14\cdot13\cdot12=2184$$

There are 2184 different possible trifecta wagers.

**The Permutation Formula:**
The number of permutations on $n$ objects when choosing $r$ many at a time is denoted by $_nP_r$.

$$_nP_r=n\cdot(n-1)\cdot(n-2)\cdot\cdots\cdot(n-r+1)=\frac{n!}{(n-r)!}$$

Other common ways to denote permutations are:

$$_nP_r\quad=\quad P(n, r)\quad=\quad P_r^n$$

**Example (Continued):** We saw in the last example that with $P_{3}^{14}$, we know that $(n-r+1)=12$ so

$$P_{3}^{14}=14\cdot(14-1)\cdot(14-2)=14\cdot13\cdot12$$

To express it in the usual permutation formula:

$$P_{3}^{14}=\frac{14!}{(14-3)!}=\frac{14!}{11!}=14\cdot13\cdot12$$

### Combinations
A combination is similar to permutations but the *order doesn't matter.* It only matters if an object is selected or not.
Think of a poker hand. It doesn't matter what order you were dealt two aces, all that matters is that they were dealt at all.

A combination is denoted with $_nC_r$ and is read as "$n$ choose $r$".

**Combination Formula:**
The number of combinations of $r$ objects chosen from a collection of $n$ distinguishable objects is given by:

$$_nC_r=\frac{_nP_r}{r!}=\frac{n!}{r!(n-r)!}$$

You'll notice that this is just the permutation formula $_nP_r$ multiplied by $\frac{1}{r!}$. 

Combinations produce a smaller result than permutations because, since order doesn't matter, drawing two objects, denoted as $N$, are treated both as $N$ instead of $N_1$ and $N_2$ as in permutations where order matters.

Other common ways to denote permutations are:

$$_nC_r\quad=\quad \bigg({n\atop r}{}\bigg)\quad=\quad C(n, r)\quad=\quad C_r^n$$

$_nC_r=({n\atop r})$ is especially common and is referred to as the *Binomial Coefficient* since it is the coefficient of each term in a *Binomial Expansion* according to *The Binomial Theorem*.

**Properties:**
$$\Big({n \atop r}\Big)=\Big({n \atop n-r}\Big)$$

This is because choosing $r$ is the same as *not* choosing $n-r$. Let's say we have 5 cookies. Choosing 2 cookies to eat is the exact same as choosing 3 to *not* eat.

You can look at Pascal's Triangle and see how the last term is the same as the first term in any of the given sequence. Pascal's Triangle is just a visual version of listed combinations.

### Partitions
With combinations, whenever we select a combination of $r$ object from $n$ distinguishable objects, we are essentially dividing the $n$ objects into two groups, those that are "in" and those that are out.
Selecting a combination of objects in effect is partitioning it into two groups.

We can find out the total number of combinations in a combination with more than two partitions with multinomial coefficients.

The number of partitions of $n$ distinct objects into $k$ subsets of sizes $r_1, r_2,\cdots, r_k$ where $r_1+r_2+\cdots+r_k=n$ is called a multinomial coefficient, denoted by

$$\bigg({n\atop r_1,r_2,\cdots,r_k}\bigg)=\frac{n!}{r_1!r_2!\cdots r_k!}$$

If you couldn't tell, a combination is just a more simple form of this.
Because a combination is just an "in" and an "out" partition ($r_1$ and $r_2$), we know that the sizes of $r_1$ and $r_2$ must be $r$ and $r-n$.

The combination formula

$$\bigg({n\atop r}{}\bigg)=\frac{n!}{r!(n-r!)}$$

is the exact same as a multinomial efficient with two partitions

$$\bigg({n\atop r_1,r_2}\bigg)=\frac{n!}{r_1!r_2!}$$

Like how combinations are called the binomial coefficient from a binomial expansion according to the binomial theorem, partitions are the multinomial coefficients from a multinomial expansion according to The Multinomial Theorem.

**Example:** There are 14 people on our CS ultimate frisbee team. Anyone can play any position. Only 7 can be on the field at once. We need 3 handlers, 2 wings, and 2 cutters. What is the total number of different combinations the team can make up?

$$\frac{14!}{3!\cdot2!\cdot2!\cdot7!}=720720$$



## Sampling and Distribution
There's 4 types of sampling:
1. Sampling without replacement where order does not matters.
    - Example: Calculate the number of 4 letter words with no duplicate letters.
    - Here, use a Permutation.
2. Sampling without replacement where order matters.
    - Example: Calculate the number of 4 letter words with no duplicate letters and the letters are arranged in alphabetical order.
    - Here, use a Combination.
3. Sampling with replacement where order does not matters.
    - Example: Calculate the number of 4 letter words, duplicate letters allowed.
    - Multiply the numbers together (fundamental theorem of counting).
4. Sampling with replacement where order matters
    - Example: Calculate the number of 4 letter words, duplicate letters allowed, and the letters are arranged in alphabetical order.
    - Here, use Partitions.

### Sampling With Replacement When Order Doesn't Matter
The number of unordered samples of $r$ objects, with replacement, from $n$ distinguishable objects is:

$$_{n-1+r}C_r$$

where $r$ is the total number of objects you're choosing and $n$ is the number of distinguishable objects.

**Example:** Select a dozen bagels where there are 3 types: Asiago cheese, plain, and nine grain. In this case, $n=3$ and $r=12$.

$$_{n-1+r}C_r = _{14}C _{12} = 91$$

How this compares with what it says for number 3 above, I have no idea, my notes says nothing about it. Eventually I'll get around to asking ChatGPT.

### Distribution
Distribution is very similar to sampling, but instead of "pulling" an object out of the sample space, we are distributing an object to it.

An example is that, with sampling, you are taking a ball out of an urn. With distribution, you're putting a ball into an urn.



## Probability Basics 
Probability models are based on experiments for where there are *multiple possible outcomes*, such as flipping a coin or tossing a pair of dice. We cannot tell which outcome will occur in advance, in contrast to deterministic models. 

To define probability on a set, we have:
1. The set of all outcomes is called the **sample space**.
2. Subsets of the sample space are called the **events space**.
3. The numbers assigned to outcomes are called **probabilities**, and they measure the likelihood of an outcome along a scale from 0% to 100%.

Outcomes are called events, so the sample space is a set of all events with each event assigned a probability.

### Axioms Of Probability Theory
1. $0 \le Pr(E) \le 1$ for any event $E$
2. $Pr(U)=1$, where $U$ denotes the entire sample space.
3. The probability of the union of mutually exclusive events is the sum of the individual probabilities of those disjoint sets.

In other words, the probability for each event must be between 0 and 1, where 0 is impossible and 1 is guaranteed to happen. The probability of the sample space must be equivalent to 1 because it contains every possible outcome.

With a fair coin, the sample space is $U = \{H, T\}$, with heads and tails both having a probability of 0.5. The probability of $U$ is of course the combined probability of outcomes heads and tails, which sum to 1.

**Properties:** Here are some basic properties of probability (some taken from Arian Maleki and Tom Do's *Review of Probability Theory* material). Let A and B both be event spaces:
1. If the A is a subset of B, then the probability of A is less than the probability of B.
$$A\subseteq B\implies Pr(A) \leq Pr(B)$$
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

From this, we have that $Pr(A\cap B)$ is:

$$Pr(A\cap B) = Pr(B)\cdot Pr(A|B) = Pr(A)\cdot Pr(B|A)$$

Notice that this is just Bayes' Theorem (further explained below).

### Bayes' Theorem
Suppose that the sample space $S$ is partitioned into disjoint subsets $B_1, B_2,\dots,B_n$. That is, $S=B_1\cup B_2\cup\cdots\cup B_n$ and $Pr(B_i)>0$ for all $i=1,2,\dots,n$. Then for event $A$

$$Pr(B_j |A)=\frac{Pr(B_j\cap A)}{Pr(A)}=\frac{Pr(B_j)\cdot Pr(A |B_j)}{\sum_{i=1}^{n}Pr(B_i)\cdot Pr(A |B_i)}$$

### Bayesian Inference
Bayesian inference is backwards reasoning when you infer a *cause* by observing an *effect.* 

We cannot know for sure what happens on the first stage of something, but we can calculate the conditional probability for the causes based on the observed effect.

**Example:** Lets say that there are 3 coolers, each has 10 drinks. One has 1 rootbeer, another has 2, and one has 8.

If you pick out a rootbeer, you can look at that *effect* and find out the conditional probability of pulling it out of each cooler.

Chances it is rootbeer given it's from its respective cooler:

$$Pr(rootbeer | cooler 1)=\frac1{10}$$
$$Pr(rootbeer | cooler 2)=\frac2{10}$$
$$Pr(rootbeer | cooler 3)=\frac8{10}$$

Chances it being from each cooler:

$$Pr(cooler 1 | rootbeer)=\frac{Pr(cooler 1\cap rootbeer)}{Pr(rootbeer)}=\frac{\frac13*\frac1{10}}{\frac{11}{30}}=\frac1{11}$$
$$Pr(cooler 2 | rootbeer)=\frac{Pr(cooler 2\cap rootbeer)}{Pr(rootbeer)}=\frac{\frac13*\frac2{10}}{\frac{11}{30}}=\frac2{11}$$
$$Pr(cooler 3 | rootbeer)=\frac{Pr(cooler 3\cap rootbeer)}{Pr(rootbeer)}=\frac{\frac13*\frac8{10}}{\frac{11}{30}}=\frac8{11}$$

Total chances of grabbing a rootbeer from a cooler:

$$Pr(rootbeer)=\frac1{30}+\frac2{30}+\frac8{30}=\frac{11}{30}$$

It's called Bayes' Inference since it uses conditional probability which is just Bayes' Theorem.

### Independence
Let A and B be events with non-zero probabilities. We say A and B are *independent* if any (and hence all) of the following hold:
1. $Pr(A|B)=Pr(A)$
2. $Pr(B|A)=Pr(B)$
3. $Pr(A\cap B)=Pr(A)\cdot Pr(B)$

The last one is called the *multiplicative rule.*
The events are said to be *dependent* if any don't hold.

Independence can be thought as knowing information about one event happening does not give us any information about the other. Hence, A and B are independent if the probability of A given B is the exact same as if B never happened.

The independence for collections of events is the same as case 3, but for more than 2 events.
$$Pr(A\cap B\cap\dots\cap N)=Pr(A)\cdot Pr(B)\cdot\dots\cdot Pr(N)$$

### Credibility
Credibility theory is the continual updating of probability estimates based on new experiences.

**Example:** We assume you are an average customer, so that there is an 80% chance you are a good driver ($G$) and a 20% chance you are a bad driver ($B$). Let $A$ be the event you have an accident in the next year. We assume at most one accident per year.

Suppose we observe an accident (an effect) in the first year. We are able to revise our estimate of your risk category based on your experience.

Using standard calculations with Bayes' Theorem, we can see that the probability you have an accident is:

$$Pr(A)=Pr(A|G)\cdot Pr(G) + Pr(A|B)\cdot Pr(B)=(.10)(.80)+(.50)(.20)=.18$$

The conditional probability that you are a good driver given you've had an accident:

$$Pr(G|A)=\frac{(.10)(.80)}{(.10)(.80)+(.50)(.20)}=\frac49$$

The conditional probability that you are a bad driver given you've had an accident:

$$Pr(B|A)=1-\frac{4}{9}=\frac59$$

Therefore our assessment as to whether or not you are in the good category drops from 80% to a more suspicious 44.4%.

If you get into an accident two years straight, the chances of you being a good driver drops to 13.8%

$$Pr(G|A)=\frac{(4/90)}{(4/90)+(25/90)}=\frac{4}{29}$$
$$Pr(B|A)=1-\frac{4}{29}=\frac{25}{29}$$

### Random Variables
A random variable is a function that maps a sample space to a set of real numbers which represent outcomes.

$$X: U \rightarrow \R$$

We use upper case letters to denote random variables and lower case letters to represent outcomes that the random variable may take on.

Each random variable has a probability distribution associated with it. The probabilities must be positive and sum to one. There are two different kinds of random variables: Discrete and Continuous.



## Measures Of Central Tendency and Dispersion
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

We'll cover the most important and commonly used: expected value, variance, and standard deviation (the rest can be found in the Appendix).

### Expected Value
The expected value can be thought of the weighted average of a random variable. It is usually represented as either $E[X]$ or as $\mu_X$ where $X$ is a random variable.

For the discrete case, we have:

$$E[X]:=\sum_{x\in X} x\cdot Pr(X=x)$$

For the continuous case, we have:

$$E[X]:=\int_{-\infty}^{\infty} x\cdot f_X(x) dx$$

**Example:** For a 6-sided die, the probability of each side is $\frac16$. Let the random varaible $X$ be the number of dots we roll. Thus:

$$E[X] = \bigg(\frac16\cdot 1\bigg)+\bigg(\frac16\cdot 2\bigg)+\bigg(\frac16\cdot 3\bigg)+\bigg(\frac16\cdot 4\bigg)+\bigg(\frac16\cdot 5\bigg)+\bigg(\frac16\cdot 6\bigg) = 3.5$$

An important property is that it can be transformed under a linear transformation.
For a random variable $X$ and real numbers $a$ and $b$, we have:

$$E[a\cdot X+b] = a\cdot E[X] + b$$

Another property is *linearity of expectation.* For two different random variables X and Y, we have:

$$E[X + Y] = E[X] + E[Y]$$

### Variance
The variance of a random variable represents the spread of its distribution around around its mean.
It is often donated as $Var[X]$ or $\sigma_X^2$. It is formally defined as:

$$Var[X] = E[(X - E[X])^2]$$

From this expression we can derive:
$$Var[X] = E[X^2] - E[X]^2$$

The **standard deviation** is just the square root of the variance, denoted as $\sigma_X$.

Many distributions (i.e. uniform, Poisson, etc.) have a quick way of finding the expected value, variance, and other measures of central tendency and dispersion.

An important property is that it can be transformed under a linear transformation.
For a random variable $X$ and real numbers $a$ and $b$, we have:

$$Var[a\cdot X+b] = a^2\cdot Var[X]$$

### Chebychev's Theorem
Chebychev's Theorem is a general result that applies to most discrete random variables.

Asserts that for a given positive number $k$, there is a universal upper bound for the probability that a random variable $X$ will be more than $k$ standard deviations away from its mean.

Let $X$ be a discrete random variable with finite mean $\mu_X$ and standard deviation $\sigma_X$. Let $k$ be greater than 1. Then the probability that $X$ is more than $k$ standard deviations from the mean is less than or equal to $\frac{1}{k^2}$. That is:

$$Pr(X<\mu_X-k\cdot\sigma_X\quad or\quad X>\mu_X+k\cdot\sigma_X) = Pr(|X-\mu|>k\cdot\sigma_X)\le\frac{1}{k^2}$$

### Markov's Inequality
Markov's inequality relates probabilities to expectation and provides loose bounds for the cumulative probability distribution of a random variable.

Let $Y$ be a discrete random variable taking only non-negative values, with finite mean $\mu_Y$. Then for an $a>0$:

$$Pr[Y>a]\le\frac{\mu_Y}{a}$$



## Discrete Random Variables
Random variables that map to a finite number of possible values are called discrete. An example is flipping a coin. There are two possible outcomes: the coin landing on heads or tails.

The probability of a discrete random variable $X$ taking on some value $x$ is denoted as $Pr(X=x)$. $Pr(X=x_i)$ is called the probability mass function of $X$, also denoted as $p_X(x)$.

**Example:** Let X be a random variable that represents how many times we flip a coin that lands on heads. If we flip the coin twice, there are 4 possible outcomes. The sample space is:

<p>$$U=\{\{H, H\}, \{H, T\}, \{T, H\},\{T, T\}\}$$</p>

Our random variable $X$ can take the form of 0, 1, or 2 since the sample space only contains events with 0, 1 or 2 heads.
In other words, the set of real numbers $X$ maps to is $\{0, 1, 2\}$. Thus, any outcome $X$ can take on is represented by $x\in\{0, 1, 2\}$. We can see that the probability that the outcome is 2 is $Pr(X=2)=.25$ because there is only one event with 2 heads.

### Expected Value
If $X$ is a discrete random variable with probability function $p(x_i):=Pr(X=x_i)$, then the expected value of $X$ is given by:

$$\mu_X=E[X]=\sum_i x_i\cdot p(x_i)$$

In other words, it's each value of $x_i$ multiplied by its probability (which is between 0 and 1).

For a transformed discrete random variable, 

$$\mu_Y=E[Y]=E[ g(X) ]=\sum_i g(x_i)\cdot p(x_i)$$

**Expected Value of a Discrete Linear Transformation**

Let $X$ be a discrete random variable and let $Y=a\cdot X+b$, where $a$ and $b$ are real numbers. Then:
$$E[Y] = E[a\cdot X+b] = a\cdot E[X]+b$$

### Variance
If $X$ if a discrete random variable with mean $\mu_X$ and probability function $Pr(X=x_i)=p(x_i)$, then the variance of $X$ is:

$$Var[X]=\sigma_X^2=\sum_{x_i}(x_i-\mu_X)^2\cdot p(x_i)$$

More commonly in the form:

$$Var[X] = E[X^2] - E[X]^2$$

**Variance of a Discrete Linear Transformation**

Let $X$ be a discrete random variable and let $Y=a\cdot X+b$, where $a$ and $b$ are real numbers. Then:
$$Var[Y] = Var[a\cdot X+b] = a^2\cdot Var[X]$$

### Cumulative Probability Distribution
Let X be a discrete random variable. For each real number $x$, let $F(x) = Pr(X\le x)$
The function $F(x)$ is called the cumulative distribution function (CDF) for $X$

It must satisfy the following:
1. $0\le F(x) == Pr(X\le x)$ for all $X$
2. If $x_{i-1}<x_i$ are consecutive values in the probability distribution table of $X,$ then: $$Pr(X=x_i) = F(x_i)-F(x_{i-1}) = Pr(X\le x_i)-Pr(X\le x_{i-1})=p(x_i)$$
3. We define $F(\infty)=Pr(X<\infty)=1$

The graph of the CDF for a discrete random variable will be a step function

### Jointly Distributed Discrete Random Variables
Let $X$ and $Y$ be random variables arising from the same discrete probability experiment. The **joint distribution** of $X$ and $Y$ is given by:

$$p(x,y)=Pr[\{X=x\}\cap\{Y=y\}]$$

We say $X$ and $Y$ are independent if **for all** $x$ and $y$ the events $\{X=x\}$ and $\{Y=y\}$ are independent. That is:

$$p(x,y)=Pr[\{X=x\}\cap\{Y=y\}]= Pr[X=x]\cdot Pr[Y=y]=p_X(x)\cdot p_Y(y)$$

**Properties:** Let $X$ and $Y$ be random variables arising from the same probability experiment. Then:

1. $E[X+Y] = E[ X] + E[Y]$

Further, if $X$ and $Y$ are independent, then:

2. $E[X\cdot Y] = E[ X]\cdot E[Y]$ 
3. $Var[X+Y]=Var[ X]+Var[Y]$

### Probability Generating Functions
Allows you to compute the expected value and variance of random variables

Let $X$ be a random variable taking non-negative integer values.
Let $p_n = Pr[X=n]$. Then the probability generating function for $X$ is defined by:

$$h(s)=\sum_{i=0}^{\infty} p_i s^i=E[s^X]$$
$$E[X]=h'(1)\qquad and\qquad Var[X]=h''_X(1)+h'_X(1)-(h'_X(1))^2$$



## Moment Generating Functions
Earlier we learned a technique for transforming a discrete distribution of whole numbers into a power series.

This power series was named the *probability generating function (PGF)*, and it was used for calculating the moments of the underlying distribution (random variable).

By moments, we mean moments about zero, so that the $k^{th}$ moment is $E[X^k]$ for $k=0,1,2\dots$.  

The main purpose of introducing the probability generating function was to *simplify* the calculations of expected value, variance, and standard deviation of standard discrete probability distributions.

A related transformation, called the *moment generating function (MGF)*, serves the same purpose but works equally well for discrete or continuous random variables.

The idea is to transform the distribution into a calculus function, and use the derivatives to calculate the moments of the underlying random variable.

### Definition
Let $X$ be any random variable. The *moment generating function (MGF)* of $X$ is denoted by $M_X(t)$ and is defined by:

$$M_X(t)=E_X[e^{tX}]$$

Observe that $Y=e^{tX}$ is a transformation of the random variable $X$ and we can calculate its expected value.

$$M_X(t)=E_X[e^{tX}]=\sum_{k=0}^{\infty}e^{tk}p_k\qquad p_k=Pr[X=k]$$

**Properties:**
1. **Moments:** (superscript (k) means the $k^{th}$ derivative)
$$M_X^{(k)}(0)=E[X^k]$$

2. **Linear Transformation:** If $Y=aX+b$, then 
$$M_Y(t)=e^{bt}M_X(at).$$

3. **Sums of Independent Random Variables:** If $X,\dots X_n$ are independent random variables and $S=X_1+\cdots+X_n$, then
$$M_S(t)=M_{X_1}(t)\cdot M_{X_2}(t)\cdots M_{X_n}(t)$$

4. **Corollary to (3):** If $X,\dots X_n$ are independent random variables, all with common distribution $X,$ then
$$M_S(t)=[M_X(t)]^n$$

**Shortcut Formulas**

Let $X$ be a random variable with MGF $M_X(t)$. Define $h(t)=\ln(M_X(t))$

1. $E[ X]=h'(0)$
2. $Var[ X]=h''(0)$



## Continuous Random Variables
Random variables that map to an infinite possible values are called continuous. An example is how long it takes for the coin to hit the ground. The coin can be in the air for 1 second, or 1.1, or 1.111.... There is an infinite set of values that the outcome can take on.

The probability of the outcome being any exact value is precisely 0, so we work with ranges. The probability of a continuous random variable $X$ taking on some value between $a$ and $b$ where $a \lt b$ is denoted as $Pr(a\leq X\leq b)$.

In this case, we might represent the probability that the coin is in the air between 1 and 2 seconds as $Pr(1\leq X\leq 2)$.

### Cumulative Distribution Functions (CDFs)
The Cumulative Distribution Function of a continuous random variable $X$ is defined by:

$$F_X(x) = Pr(-\infty < X \leq x)$$

That is, the value of the CDF of $X$ at the point $x$ is the probability of the event that $X$ is less than or equal to $x$.

Note: all of the notation below all refer to the CDF:

$$P_Z(z)=\Phi(z)=F_Z(z)$$

**CDF Properties:**
1. $F_X(x)$ is a non-decreasing function with range [0,1].
2. $\lim_{x\rightarrow-\infty} F_X(x)=0$
3. $\lim_{x\rightarrow\infty} F_x(x)=1$
4. The probability of $X$ taking values between $a$ and $b$ is the same as the CDF at point $b$ minus the CDF at point $a$. In other words:
 $$Pr(a\le X\le b) = F_X(b)-F_X(a)$$

### Probability Density Functions (PDFs)
The probability density function (PDF) of a continuous random variable is similar to the probability mass function of a discrete random variable. 

Let $X$ be a continuous random variable with CDF $F_X(x)$ that is differentiable everywhere. The derivative of $F_X(x)$, denoted by $f_X(x)$, is called the <i>density function</i> of the random variable $X$.

Relation between the CDF and the Density Function for X:
1. The density function is calculated from the CDF by differentiating: $$f_X(x)=F'(x)$$
2. The CDF is calculated from the density function by integrating: $$F_X(x)=\int_{-\infty}^{x}f_X(t)dt$$

**PDF Properties:**
1. $f_x(x) \ge 0$, that is, all density functions are non-negative.
2. $\int_{-\infty}^\infty f_X(x)dx = 1$
3. $Pr(a\le X\le b)=\int_a^b f_X(x)dx$

The mode is the global maximum of the density function.
- Can solve by graphing and finding the highest point.
- Can also set $f'(x)=0$ and find the critical points (check for maximum).

### Expected Value (from the density function)
Let $X$ be a continuous random variable with the density function $f(x)$. The expected value is calculated by:

$$E[X]=\int_{-\infty}^{\infty}x\cdot f(x) dx$$

The expected value of a transformation $g(X)$ of $X$ is calculated simply by:

$$E[g(x)]=\int_{-\infty}^{\infty} g(x)\cdot f(x) dx$$

**Example 1:** Calculate the expected value $E[ X]$ from the density function $f(x)=20x^3(1-x)$, $0\le x\le1$.

$$E[X]=\int_0^1x\cdot f(x) dx=20\int_0^1x^4(1-x) dx=20\int_0^1(x^4-x^5) dx$$ $$=20\Big[\frac15-\frac16\Big]=\frac{20}{30}=\frac23$$

**Example 2:** Calculate the expected value of $e^x$ from the density function $f(x)=2e^{-2x}, 0\le x<\infty$

$$E[e^x]=\int_0^\infty e^x(2e^{-2x}) dx=2\int_0^\infty e^{-x} dx=2\frac{e^{-x}}{-1}\Bigg|_0^{\infty}=2(1-0)=2$$

### Expected Value (from the CDF)
Let $X$ be a non-negative random variable living on the interval $(A, B)$, then:

$$E[X]=A+\int_A^B[1-F(x)] dx$$

### Variance
The variance of a random Variable $X$ is denoted by $Var[X]$ (or $\sigma_X^2$) and is defined as:

$$Var[X] := E\Big[(X-\mu_X)^2\Big]=\int_{-\infty}^{\infty} (X-\mu_X)^2 f_X(x) dx$$

You can see that it is just the continuous random variable.

Can also be represented in the variance formula form:

$$Var[X]=E[X^2]-E[X]^2=\int_{-\infty}^{\infty}x^2f_X(x) dx-\Bigg(\int_{-\infty}^{\infty}x f_X(x) dx\Bigg)^2$$

### Mode
The Mode of $X$ is defined as the value(s), $x_{mode}$ that maximizes $f(x)$. Can only have up to two modes.

The mode can be found by finding the global maximum of $f(x)$, AKA by differentiating $f(x)$ and setting the derivative to zero to locate the critical points and checking them to see which one is the maximum.

### Medians and Percentiles
Suppose $p$ is a number between 0 and 1. The $100p^{th}$ Percentile of $X$ is the point $x_p$ such that $p=Pr[X\le x_p]$.

The $50^{th}$ percentile is called the median, and is denoted by $x_{.5}$.

$$p=Pr[X\le x_p]=F(x_p)$$

### Two-Point Mixed Distributions
Let $Y$ and $Z$ be any two given random variables with cumulative distribution functions $F_y$ and $F_Z$, respectively, and let $p$ be a number where $0<p<1$. For any real number x define:

$$F_X(x)=p F_Y(x)+(1-p) F_Z(x)$$

The resulting random variable X is called a *two-point mixture* of $Y$ and $Z$ with mixing weights $p$ and $1-p$.

**Calculating Moments of Two-Point Mixture Distributions**

Let X be a two-point mixture of $Y$ and $Z$ with mixing weights $p$ and $1-p$. Then the expected value is

$$E[X^n]=p E[Y^n]+(1-p) E[Z^n]$$



## Applications of Continuous Distributions

### Deductible Insurance
Consider a given loss amount random variable $X$ living on the interval $(A, B)$ where $0\le A<B<\infty$. We denote the deductible amount by $d$, where $A\le d<B$.
Let $Y$ be the payment random variable resulting from the deductible $d$. Then the relationships between $X$ and $Y$ is given by
$$
Y=\begin{cases}
0 & A\le X<d \\\
X-d & d\le X<B
\end{cases}
$$
Often a problem will ask for $E [Y]$, the expected value of $Y$ (how much the insurance company pays out). $$E[Y]=\int_A^d0\cdot f_X(x) dx +\int_d^B(x-d)\cdot f_X(x) dx$$ $$=\int_d^B(x-d)\cdot f_X(x) dx$$

### Capped Insurance
Another common practice for reducing $Y$ is to cap the covered loss at a given constant, $C$, which is less than the maximum actual loss $B$. Then the relationship between $X$ and $Y$ is given by

$$
Y=\begin{cases}
X & A\le X<C \\\
C & C\le X<B \end{cases}
$$

The expected value:

$$E[Y]=\int_A^Cx f_X(x) dx +\int_C^BC  f_X(x) dx=\int_A^Cx f_X(x) dx +C\int_C^Bf_X(x) dx$$
$$=\int_A^Cx f_X(x) dx +C\cdot Pr[X>C]$$

### The CDF Method for Deductible and Caps
The following are compact formulas in terms of the CDF of $X$ for capped benefits, benefits with a deductible, and a combined policy.

Let $X$ be a continuous loss random variable with domain $(A, B); 0\le A<B$, and let $C$ be any number such that $A<C<B$.

Let $Y^C$ (benefit capped at C) be:

$$
Y^C=\begin{cases}
X & A\le X<C \\\
C & C\le X<B
\end{cases}
$$

Let $Y_d$ (benefit with deductible of d) be:

$$
Y_d=\begin{cases}
0 & A\le X<d \\
X-d & d\le X<B
\end{cases}
$$

Let $Y_d^C$ (benefit with deductible of d and cap of C) be:

$$
Y_d^C=\begin{cases}
0 & A\le X<d \\
X-d & d\le X<C \\
C-d & C\le X<B
\end{cases}
$$

Then the following properties are true:

$$(i)\qquad X=Y^C+Y_d$$
$$(ii)\quad E[Y^C]=A+\int_A^C[1-F_X(x)] dx$$
$$(iii)\quad E[Y_d]=\int_d^B[1-F_X(x)] dx$$
$$(iv)\qquad Y_d^C=Y^C-Y_d$$
$$(v)\quad E[Y_d^C]=\int_d^C[1-F_X(x)] dx$$



## Appendix

### More Central Tendencies

**Median:** If $x_1, x_2,\cdots,x_n$ is a collection of $n$ data points listed from smallest to largest, then the median of the data equals
1. The middle $x$ if $n$ is odd
2. The expected value of the two $x$'s closest to the middle if $n$ is even

**Midrange:** If $\{x_1,x_2,\cdots,x\}$ is a collection of $n$ data points listed from smallest to largest, then the midrange of the data is defined to be:

$$\frac{x_1+x_n}{2}=\frac{min+max}{2}$$

**Mode:** If $x_1,x_2,\dots,x_n$ is a collection of $n$ data points, then the mode of the data is defined as, 
1. The value of $x_i$ that *occurs most frequently*
2. The two values $x_i$ and $x_j$ if they occur the same number of times, and more frequently than the remaining points (bi-modal)
3. DNE otherwise

**Percentiles::** Percentiles are used to rank items in relative order

If $x_1, x_2, \cdots, x_n$ are $n$ data points arranged in ascending order, then $x$, corresponds to the $\big(100\cdot\frac{i}{n+1}\big)^{th}$ percentile.

**Quartiles:**
- The **first quartile** corresponds to the 25th percentile and is denoted: $Q_1$
- The **second quartile** corresponds to the 50th percentile and is denoted: $Q_2$
- The **third quartile** corresponds to the 75th percentile and is denoted: $Q_3$


Note: sometimes the first quartile refers to the entire range from the lowest value up to $Q_1$, and similarly for other quartiles.

### More Measures of Dispersion

**Range:** If $x_1, x_2,\cdots,x_n$ are a collection of $n$ data points listed in ascending order, then:
1. The **minimum** value is min$(x_1,x_2,\cdots,x_n)=x_1$ 
2. The **maximum** value is max$(x_1,x_2,\cdots,x_n)=x_n$ 
3. The **range** of the data is $range = max - min$
4. The **inter-quartile range (IQR)** is $IQR = Q_3 - Q_1$

**Standardized Random Variables:** Let $x$ be a value from a probability distribution with expected value $\mu$ and standard deviation $\sigma$. Then the **z-score** for $x$ is defined to be:

$$z=\frac{x-\mu}{\sigma}$$

Let $X$ be a discrete random variable and let $Z=\frac{X-\mu}{\sigma}$. Then $Z$ is called the **standardization of X**. $Z$ always has a mean equal to 0 and a standard deviation equal to 1.


**Coefficient of Variation:** This is a statistic that measure the relative variability of a random variable - the ratio of the standard deviation to the mean.

- Is a dimensionless number that is used in reliability theory and renewal theory.
- Good when comparing between data sets with different units or means instead of Standard Deviation.
- A random variable $X$ with mean $\mu$ and standard deviation $\mu$ has a coefficient of variation of:

$$\frac{100\cdot\sigma}{\mu}\%$$

### Odds
In gambling, it is common to give the ratio of expected losses to expected wins in a fixed number of plays.
This ratio is referred to as "the odds against winning."

For example, if me winning a race between Peter Chacko has odds of 2:1 (read as "two to one"). That means that if we run 3 identical race, I would be expected to win once and lose twice.

$$Pr(\text{win})=\frac{1 \text{ win}}{1 \text{ win}+2 \text{ losses}}$$

To convert odds to probability, you can use the formula that the one above hints at. If the odds against the event $A$ are quoted as $b:a$, then:

$$Pr(A)=\frac{a}{a+b}$$

The odds against event $A$ are quoted as the ratio:

$$Pr(A \text{ doesn't occur}):Pr(A \text{ does occur})$$
$$=Pr(\bar{A}):Pr(A)$$
$$=Pr(1-p):Pr(p)$$

**Example:** With the race example above, if the chance of me winning, $Pr(W)$, was $\frac13$, then

$$Pr(\bar{W}):Pr(W) \quad=\quad 1-\frac13:\frac13 \quad=\quad \frac23:\frac13 \quad=\quad 2:1$$

### Set Theory
A *set* is a collection of objects. The objects belonging to the set are called *elements* or *members*.

We use the symbol $\in$ to denote that a particular object is an element of a set, and the symbol $\notin$ to denote that it isn't in a set.
The *universal* set contains all possible objects, and every set is a *subset* of the universal set.

There are three common methods to define a particular set. 
1. A description in words: "The first six prime numbers"
2. The listing method: {2, 3, 5, 7, 11, 13}
3. Set Builder Notation: {$x_n|x_n$ is the $n^{th}$ prime number, $n=1,2,\dots,6$}

**Set Operations:** Suppose that $A$ and $B$ represent two sets. Suppose that $U$ represents the universal set.

1. **Union**: (read as "A union B" or as "A or B")

$$A\cup B = \\{x | x\in A \vee x\in B\\}$$ 

2. **Intersection**: (read as "A intersect B" or as "A and B")

$$A\cap B = \\{x | x\in A \wedge x\in B\\}$$ 

3. **Complement**: (read as "A complement" or as "not A")

$$\bar{A}= \\{x | x\in U \wedge x\notin A\\}$$ 

4. **Difference**: (read as "A takeaway B")

$$A-B= \\{x | x\in A \wedge x\notin B\\}$$ 

5. **Subset**:

$$A\subseteq B= \\{x\in A| x\notin B\\}$$ 

An important property is De Morgan's Laws. For any two sets $A$ and $B$:

$$\overline{A\cap B}=\overline{A}\cup \overline{B}$$
$$\overline{A\cup B}=\overline{A}\cap \overline{B}$$
