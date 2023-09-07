+++
title = "Solving Equations: Bisection, Fixed-Iteration, and Newton's Method"
description = "My notes over chapter 1 of Timothy Sauer's Numerical Analysis textbook. Most examples and some sentences were taken directly from the book."
date = 2023-09-06T12:19:28-05:00
tags = ["Numerical Analysis Notes"]
status = "Work In Progress"
+++

{{< toc >}}



## Solving Equations
***

Solving equations is one of the most basic problems in scientific computing. First and foremost, we will talk about the differences between a function and an equation.

A function is a rule that maps each input exactly to one output. In other terms, for function $f: X \rightarrow Y$ where X is the domain and Y is the co-domain, for every $x\in X$ there is a unique output $y\in Y$.

$$\forall x\in X\quad \exists! y\in Y\quad s.t\quad f(x) = y$$

An equation is a mathematical statement that asserts the equality of two expressions. It can be true for some values and false for others, unlike a function, which is just a rule for generating output based on the input.

### Relationship between Functions and Equations

1. Equations can define functions: For example, $y=2x+3$ can be used to define function $f(x)=2x+3$

2. Functions can appear in equations: For instance, we can have an equation $f(x) = g(x)$ which states that for every input, $f$ and $g$ will have the same output.

3. Solving equations involving functions: When looking to solve an equation like $f(x)=0$, you're looking to find all values that make the equation true. We call $x$ roots or zeros of the function.

4. Not all equations define functions: The equation $x^2 + y^2 = 1$ does not define a function because each $x$ value maps to multiple $y$ values.


As stated above, solving for an equation is finding every value of a variable where the equation holds true. Every equation that can define a function can be written in the form $f(x)=0$ just by moving everything to the left side.{{%sidenote%}}You might ask, "Can we solve for $f(x)=1$ or $f(x)=74892$? Can't we just set it to anything? The answer to that is technically yes. When solving for an equation, it is convention to let the equation be $f(x)=0$ since it has a lot of nice properties associated with it.{{%/sidenote%}}

Any $x$ where the equation $f(x)=0$ holds is called a **root** or a **zero**.
Thus solving equations consists of finding the roots or zeros of a function. We will cover multiple iterative methods for locating solutions $x$ of the equation $f(x)=0$. 

## The Bisection Method
***
In general, the first step to solving an equation is to verify that a root exists. One way to do this is to bracket the root: find an interval $[a,b]$ for which the pair $f(a), f(b)$ consists of a positive and negative number. This can be expressed as $f(a)f(b) < 0$. If $f$ is a continuous function, then there will be a root $r$ between $a$ and $b$ for which $f(r)=0$.

### Method Implementation 

The bisection method is very similar to binary search. We bracket the root between $a$ and $b$ and check whether the function evaluated at the mid point $(a - b)/2$ is positive or negative. If it is negative, that means we can replace $a$ with $c$ to get a smaller bracket around the root. If it is positive, then we replace $b$ with $c$.

Below is Python code implementing the method:{{%sidenote%}}Omitted for type hints for brevity. First time I've seen type hints for functions passed as parameters. `f: Callable[[int], int]`.{{%/sidenote%}}

```python
def bisection_method(f, a, b, tolerance=.0005):
    while (b - a)/2 > tolerance: # while distance from center > tolerance
        c = (b + a)/2
        if f(c) = 0:
            break
        if f(a)f(c) < 0: # f(c) is positive
            b = c
        else: # f(c) is negative
            a = c
    return (b + a)/2 # returns approximate root
```

### Accuracy and Speed

If $[a,b]$ is the starting interval, then after $n$ bisection steps, the interval $[a_n, b_n]$ has length $(b - a)/2^n$. Choosing the midpoint $x_c=(b+a)/2$ gives us:

$$\textnormal{Solution error}=|x_c-r|\lt\frac{b - a}{2^{n+1}}$$

And thus the error is at most $(b - a)/2^{n+1}$. Each step cuts the possible error by a factor of two.

The method takes $n+2$ function evaluations. The $n$ comes from evaluating $f(c)$ at every iteration. The $2$ comes from evaluating the original $a$ and $b$.

Realistically, if $a$ and $b$ happen to be both positive or both negative, the range doesn't bracket the root, so another $a$ or $b$ must be chosen. Thus, the constant is however many evaluations it takes to satisfy $f(a)f(b)<0$.

###### Definition

A solution is **correct within $p$ decimal places** if the error is less than $0.5 \times 10^{-p}$. To find the number of steps it would take to reach a solution correct within $p$ decimal places, you just solve for $n$ below:

$$\frac{b - a}{2^{n+1}} < 0.5\times 10^{-p}$$

