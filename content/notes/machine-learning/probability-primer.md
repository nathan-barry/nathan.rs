+++
title = "Probability Primer"
description = "A possibly adequate overview of probability."
date = 2023-09-02T11:14:53-05:00
tags = ["Primers"]
status = "Work In Progress"
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

$$Pr(A\cap B)\quad=\quad Pr(B)\cdot Pr(A|B)\quad=\quad Pr(A)\cdot Pr(B|A)$$


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
The probability of a discrete random variable \(X\) taking on some value \(x\) is denoted as \(Pr(X=x)\). In general, \(Pr(X=x_i)\) is called the probability mass function of \(X\).
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
