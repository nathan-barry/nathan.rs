+++
title = "Solving Equations: Bisection, Fixed-Iteration, and Newton's Method"
description = "My notes over chapter 1 of Timothy Sauer's Numerical Analysis textbook. This chapter covers multiple iterative ways to solve for the roots of an equation."
date = 2023-09-06T12:19:28-05:00
tags = ["Numerical Analysis Notes"]
status = "Work In Progress"
priority = 2
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
        if f(c) == 0:
            break
        if f(a)*f(c) < 0: # f(c) is positive
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

###### Example
Here is the same code as above but modified to where we only perform a given number of steps. We will see how fast the function $cos(x) + x$ converges to the root $r\approx 0.7390851332$.

We also made it a little more efficient by caching the function evaluations and also added a check to enforce that $a$ and $b$ evaluated to different signs.

```python
def bisection_method(f, a, b, steps):
    f_a, f_b = f(a), f(b)
    if f_a * f_b > 0:
        raise Exception("Both same size")

    for i in range(steps):
        c = (b + a)/2
        print(f"Guess {i + 1}:", c)
        f_c = f(c)
        if f_c == 0:
            break
        if f_a * f_c < 0:
            b, f_b = c, f_c
        else:
            a, f_a = c, f_c

bisection_method(lambda x: math.cos(x) - x, 0, 1, 10)
```

```
>>> bisection_method(lambda x: math.cos(x) - x, 0, 1, 10)
Guess 1: 0.5
Guess 2: 0.75
Guess 3: 0.625
Guess 4: 0.6875
Guess 5: 0.71875
Guess 6: 0.734375
Guess 7: 0.7421875
Guess 8: 0.73828125
Guess 9: 0.740234375
Guess 10: 0.7392578125
```

It looks like we were correct to 3 places after 10 iterations. We see that this matches the calculation above. By solving for $n$ where $a=0, b=1$ and $p=3$, we see that:


$$\frac{1}{2^{n+1}} < 0.5\times 10^{-3}\implies n > 9.966 $$




## Fixed-Point Iteration
***

Some functions, if recursively nested, converge to a number no matter what the original input. Lets look at `sqrt()`. For any number $x$, the nested function `sqrt(sqrt(sqrt(...sqrt(x)...)))` will converge to $1$ as the number of nested layers goes to infinity.


<h6>Definition</h6>

The real number $r$ is a **fixed point** of the function $g$ if $g(r)=r$.

Every equation $f(x)=0$ can be turned into a fixed point problem $g(x) = x$. If we have an equation like $cos(x) - x = 0$ that we can morph into the form $cos(x) = x$, when the output is equivalent to the input ($output = input$), the statement $output - input = 0$ is vacuously true.


Once the equation is written as $g(x)=x$, Fixed-Point Iteration proceeds by starting with an initial guess $x_0$ adn iterating the function $g$.

```python
x_0 = input("Initial Guess: ")

def g(x):
    # some function

x_1 = g(x_0)
x_2 = g(x_1)
x_3 = g(x_4)
# ... and so on
# x_{i+1} = g(x_i)
```

The sequence $x_i$ may or may not converge as the number of steps goes to infinity. If $g$ is continuous and $x_i$ converges to a number $r$, we say that $r$ is a fixed point of $g$.

<h6>Example</h6>
Here's a python snippet that calculates the 10th iteration of $cos(x)=x$.

```python
def fpi(g, x_0, steps):
    x = x_0
    for i in range(steps):
        print(f"x_{i}:", x)
        x = g(x)
    print(f"x_{steps}:", x)

fpi(lambda x: math.cos(x), 100, 10)
```

```
>>> fpi(lambda x: math.cos(x), 100, 10)
x_0: 100
x_1: 0.8623188722876839
x_2: 0.6506783754890694
x_3: 0.795673071780365
x_4: 0.699804126006342
x_5: 0.7649683581026606
x_6: 0.7214042702600874
x_7: 0.7508790338894986
x_8: 0.7310894026923415
x_9: 0.7444474707269703
x_10: 0.7354623894268724
```


### From Equation to Fixed Point Problems

We saw from above that any function $f(x) = 0$ can be turned into the form $g(x) = x$. Sometimes, there are multiple $g$'s we can choose from. Let's take the example below:

$$x^3 + x - 1 = 0$$

We can rewrite it as any of the following:

$$x = 1 - x^3\qquad x = (1 - x)^{1/3} \qquad x = \frac{1+2x^3}{1+3x^2}$$

Below are the three functions in python code, from left to right, and the results of the first 10 fixed point iteration steps for each. The initial guess for all is $x_0 = 0.5$ and the actual root is $r\approx
```python
g_1 = lambda x: (1 - x**3)
g_2 = lambda x: (1 - x)**(1/3)
g_3 = lambda x: (1 + 2*x**3)/(1 + 3*x**2)
```

```
>>> fpi(g_1, .5, 10)
x_0: 0.5
x_1: 0.875
x_2: 0.330078125
x_3: 0.9640374705195427
x_4: 0.10405418832767732
x_5: 0.9988733767808354
x_6: 0.003376063247859995
x_7: 0.999999961520296
x_8: 1.1543910749534092e-07
x_9: 1.0
x_10: 0.0
```

For $g_1$, instead of converging, it tends to alternate between 0 and 1. Neither value is a fixed point since $g(0)=1$ and $g(1)=0$. With the bisection method, we know that if $f$ is continuous and $f(a)f(b) < 0$ on the original interval, then it will converge to the root. This is not guaranteed for FPI.

```
>>> fpi(g_2, .5, 10)
x_0: 0.5
x_1: 0.7937005259840998
x_2: 0.5908801132751771
x_3: 0.7423639321680063
x_4: 0.6363102034816613
x_5: 0.7138008141442069
x_6: 0.6590061456223998
x_7: 0.6986326057302191
x_8: 0.670448496228072
x_9: 0.6907291205891408
x_10: 0.6762589249268274
```

We can see that $g_2$ seems to hone in on a fixed point.

```
>>> fpi(g_3, .5, 10)
x_0: 0.5
x_1: 0.7142857142857143
x_2: 0.6831797235023042
x_3: 0.6823284233045783
x_4: 0.682327803828347
x_5: 0.6823278038280193
x_6: 0.6823278038280194
x_7: 0.6823278038280193
x_8: 0.6823278038280194
x_9: 0.6823278038280193
x_10: 0.6823278038280194
```
We can see that $g_3$ hones in on a fixed point, but at a significantly faster rate than $g_2$. We'll discuss what determines these behaviors in the next section.


### The Behavior of Fixed Point Problems

The behavior of fixed point problems are defined by the derivative of the function at the fixed point. For the function $g(x)$, if the derivative $|g'(x)| < 1$, then we converge to the root. If $|g'(x)| > 1$, then we diverge from the root. 

Let $e_i = |r-x_i|$ as the error at step $i$. A property of Fixed-Point iteration is that as $i$ goes to infinity, we have that $e_{i+1}/e_i = |g'(x)| = S$. Thus:

$$\lim_{i\rightarrow\infty}\frac{e_{i+1}}{e_i}=S\lt 1$$

The method is said to obey **linear convergence** with rate $S$.

Let's quickly analyze the three functions we had in the previous section. The derivative of $g_1$ is $|g_1'(x)| = 3x^2$. When evaluated at the root $r\approx .68232780$ we get around $1.3967=S\gt 1$ thus it diverges.

For the derivative $|g_2'(x)|=-\frac13(1-x)^{-\frac{2}3}$, when evaluated at the root $r$, we get around $0.716=S\lt 1$ and thus it converges.

The derivative of $g_3$ is when evaluated at $r$ gives $0=S \lt\lt 1$. This is the smallest $S$ can get, leading to the fastest convergence rate.

###### Theorem
Assume that $g$ is continuously differentiable, that $g(r)=r$, and that $S=|g'(r)|\lt 1$. Then Fixed-Point Iteration converges linearly with rate $S$ to the fixed point $r$ for initial guesses close to $r$.

According to the theorem, the error relationship $e_{i+1} = S e_i$ holds as convergence is approached.

###### Definition

An iterative method is called **locally convergent** to $r$ if the method converges to $r$ for initial guesses sufficiently close to $r$.

In other words, the method is locally convergent to $r$ if there exists a range $(r - \epsilon, r + \epsilon)$ where $\epsilon \gt 0$ such that all guesses in that range converges to $r$. The error relationships between $e_{i+1}$ and $e_i$ is only guaranteed to hold near $r$. Even if $S\lt 1$, if the initial guess is too far away, we might not get a convergence.


### Stopping Criteria

Unlike the case with bisection, the number of steps reqeuired for FPI to converge within a given tolerance is rarely predictable beforehand, thus we must have a stopping criterion.

For a set tolerance, TOL, we may ask for an absolute error stopping criterion, 

$$|x_{x+1}-x_i| \lt TOL$$

or in the case the solution is not too near zero, the relative error stopping criterion:

$$\frac{|x_{x+1}-x_i|}{|x_{i+1}|} \lt TOL$$

We also tend to set a limit on the maximum number of steps in case the convergence fails.

The Bisection Method is guaranteed to converge linearly. FPI is only locally convergent, and when it does converge it is linearly convergent. Bisection cuts uncertainty by 1/2 for each step. FPI may converge faster or slower than bisection, depending on whether $S$ is smaller or larger than 1/2.



## Limits of Accuracy
***

<h6>Definition</h6>

Assume that $f$ is a function and that $r$ is a root, meaning that it satisfies $f(r)=0$. Assume that $x_a$ is an approximation to $r$. The **forward error** of the approximation $x_a$ is $|r-x_a|$ and the **backward error** is $|f(x_a)|$.

Forwards error is the amount we would need to change the approximate solution $x_a$ to be correct.
Backwards error is the amount we would need to change the function $f$ to make the equation balance with the output approximation $x_a$.

If we plotted the function $f$, the forwards error would be the distance $x_a$ is from $r$ on the x axis. The backwards error would be the distance $f(x_a)$ is from $f(x)$ on the y axis, where $f(x)=0$.


<h6>Definition</h6>

Assume that $r$ is a root of the differentiable function $f$. If $0=f(r)=f'(r)=f''(r)=...=f^{m-1}(r)$ but $f^m(r)\ne 0$, then we say that $f$ has a root of **multiplicity** $m$ at $r$. We say that $f$ has a **multiple root** at $r$ if the multiplicity is greater than one. The root is called **simple** if the multiplicity is one.

An example is $f(x) = x^2$. We have that $f(0)=0$, $f'(0)=0$, and $f''(0) = 2$. Thus, $x^2$ has a root of 0 with multiplicity 2.

Because the graph of the function is relatively flat near a multiple root, a great disparity exists between backwards and forwards errors for nearby approximate solutions. The backwards error, measured in the vertical direction, is often much smaller than the forward error, measured in the horizontal direction.

The backward and forward error is relevant to stopping criteria for equation solvers. Whether forward or backwards error is more appropriate to minimize depends on the circumstances surrounding the problem. For instance, for bisection, both errors are easy to measure. However, for FPI, the forward error would require us to know the true root, which we are trying to find, so the backwards error might be the only error we can observe.

### Sensitivity of Root-Finding

Small floating point errors in the equation translate into large errors in the root. A problem is called **sensitive** if small errors in the input, in this the actual equation being solved, lead to large errors in the output, or solution.

To be clear, we are talking about when we modify the existing equation, not the input into the equation, i.g. modify $3x^2 + 1 \implies 3.001x^2 + 1$ where the input $x$ stays the same. The reason why we care is because with double precision, coefficients like 3 and 1 might be a tiny bit off. It is important to see how much the output is impacted by small floating point arithmetic errors in the calculation.

We can see what causes this magnification of error by establishing a formula predicting how far a root moves when the equation is changed.
Assume that the problem is to find a root $r$ of $f(x)=0$, but that a small change $\epsilon g(x)$ is made to the equation where $\epsilon$ is small. Let $\Delta r$ be the corresponding change in the root, so that

$$f(r+\Delta r)+\epsilon g(r+\Delta r) = 0$$

We can do a bunch of work (expanding via Taylor polynomials, approximating with small $\Delta r$) to show that

$$\Delta r \approx -\frac{\epsilon g(r)}{f'(r)}$$

if $\epsilon \lt\lt f'(r)$.

###### Example
Estimate the largest root of $P(x)=(x-1)(x-2)(x-3)(x-4)(x-5)(x-6)-10^{-6}x^7$.

We can think of $P(x)$ as a "base" polynomial f(x) that has been perturbed. The goal is to understand how this perturbation effects the roots of $P(x)$ by analyzing how similar perturbations would effect the roots of the base polynomial $f(x)$.

Let $f(x)=(x-1)(x-2)(x-3)(x-4)(x-5)(x-6)$ be the base polynomial and the perturbed amount, $\epsilon g(x)=10^{-6} x^7$, where $\epsilon=10^{-6}$ and $g(x)=x^7$. Without the $\epsilon g(x)$ term, the largest root is $r=6$. The question is, how far does the root move when we add the extra term?

The Sensitivity Formula yields

$$\Delta r\approx -\frac{\epsilon 6^7}{5!}=-2332.8\epsilon$$

meaning that equation errors of relative size $\epsilon$ in $f(x)$ are magnified by a factor of over 2000 into the output root.
We estimate that the largest output root of $P(x)$ to be $r+\Delta r=6-2332.8\epsilon=6.0023328$.

### The Error Magnification Factor

The estimate above is good enough to tell us how errors propagate in the root-finding problem. An error in the sixth digit of the input caused an error in the third digit of the output due to the factor of 2332.8. This factor is the of how much the root is perturbed due to the addition of $\epsilon g(x)$.

For a general algorithm that produces an approximation $x_c$, we define its

$$\textnormal{error magnification factor} = \frac{\textnormal{relative forward error}}{\textnormal{relative backward error}}$$

The relative forward error is the relative change in the root due to the perturbation, which is $\frac{\Delta r}{r}$. The relative backwards error is the relative size of the perturbation, which is just $\epsilon$. The formula is

$$\textnormal{error magnification factor} = \frac{|\Delta r/ r|}{|\epsilon g(r)/ g(r)|} = \frac{|g(r)|}{|r f'(r)|}$$

Different perturbations can lead to different error magnification factors. For instance, with the equation $3x^2+1$, the first perturbation $3.001x^2 + 1$ might have a higher magnification factor than $3x^2 + 1.001$.

The significance of the error magnification factor is that it tells us how many of the 16 digits of operation precision are lost. A problem with error magnification factor of 10^{12}, we expect to lose 12 of the 16 and ahve only four correct significant digits left in the root.

### Conditioning

The preceeding error magnification example shows the sensitivity of root finding when the equation itself changes. The **condition number** of a problem is defined to be the maximum error magnification over all input changes (changes of equation, of literal input x, etc). A problem with a high condition number is called **ill-conditioned** and a problem with a condition number near 1 is called **well-conditioned**.



## Newton's Method
***

Newton's Method usually converges much faster than the linearly convergent methods we previously saw. 

To find a root of $f(x)=x$, a starting guess $x_0$ is given, and the tangent line to the function $f$ at $x_0$ is drawn. The intersection point of the tangent line and x-axis is an approximate root. We iterate this step to get better and better approximations.

The tangent line at $x_0$ has slope given by the derivative $f'(x_0)$. We have that one point on the tangent line is $(x_0, f(x_0))$. The point-slope formula for the equation of a line is 

$$y - f(x_0) = f'(x_0)(x-x_0)$$

Looking for the intersection point of the tangent line with the x-axis is the same as substituting $y=0$.

$$f'(x_0)(x-x_0) = 0 - f(x_0) \implies x-x_0 = \frac{f(x_0)}{f'(x_0)}$$
$$x = x_0 + \frac{f(x_0)}{f'(x_0)}$$

Solving for $x$ gives an approximation for the root, which we can $x_1$. We can iteratively repeat this step to get better approximations.

```python
def newton_method(x_0, f, f_derivative, num_iter):
    x_i = x_0
    for i in range(num_iter):
        print(f"x_{i}: {x_i}")
        x_i -= f(x_i) / f_derivative(x_i)
    return x_i
```

Let us try this with the equation $x^3 + x - 1 = 0$. After calculating the derivative, we will have:

$$x_{i+1}=x_i-\frac{x_i^3+x_i-1}{3x_i^2+1}$$

We can calculate the first 5 iterations with the snippet below:

```python
f = lambda x: x**3 + x - 1
f_derivative = lambda x: 3*x**2 + 1

print("x_5:", newton_method(-0.7, f, f_derivative, 7))
```
```
x_0: -0.7
x_1: 0.12712550607287465
x_2: 0.957678119175661
x_3: 0.7348277949945015
x_4: 0.6845917706849266
x_5: 0.6823321742044841
x_6: 0.6823278038443323
x_7: 0.6823278038280193
```

After only six steps, the root is know to eight correct digits. We can see that the number of correct places in $x_i$ approximately doubles on each iteration. This is a characterization of "quadratically convergent" methods.

### Quadratic Convergence 

###### Definition
Let $e_i$ denote the error after step $i$ of an iterative method. The iteration is **quadratically convergent** if 

$$M=\lim_{i\rightarrow\infty}\frac{e_i+1}{e_i^2}\lt\infty$$

###### Theorem 
Let $f$ be twice continuously differentiable and $f(r)=0$. If $f'(r)\ne 0$, then Newton's Method is locally and quadratically convergent to $r$. {{%sidenote%}}Proof is omitted since I myself do not understand it.{{%/sidenote%}} The error $e_i$ at steps $i$ satisfies 

$$\lim_{i\rightarrow \infty}\frac{e_i+1}{e_i^2}=M$$

where

$$M = \frac{f''(r)}{2f'(r)}$$

The error formula for this can be viewed as

$$e_{i+1}\approx Me_i^2$$

The approximation gets better as Newton's Method converges. This error formula should be compared with $e_{i+1} \approx Se_i$ for the linearly convergent methods, where $S = |g'(r)|$ for FPI and $S=1/2$ for bisection.

Although the value of $S$ is critical for linearly convergent methods, the value of $M$ is less critical, because the formula involves the square of the previous error. Once when the error gets significantly below 1, squaring will cause a further decrease. As long as $M$ is not too large, the error will decrease as well.

### Linear Convergence

Newton's Method isn't always guaranteed to converge quadratically.
Recall that we needed to be able to divide by the derivative of $f$.
In cases where we have a root with a multiplicity higher than 1, this derivative will be 0, which breaks the presumption we've been making.
In the case of $f(x)=x^2$, Newton's Method will converge in linear time. This is the general behavior of Newton's Method at multiple roots.

```python
print("x_7:", newton_method(1, lambda x: x**2, lambda x: 2*x, 7))
```

```
x_0: 1
x_1: 0.5
x_2: 0.25
x_3: 0.125
x_4: 0.0625
x_5: 0.03125
x_6: 0.015625
x_5: 0.0078125
```

We can see that the error is decreasing by a factor 2 each time. Thus, $S=1/2$, and we are linearly converging.

If the multiplicity of a root is known in advance, convergence of Newton's Method can be improved with a small modification. We can just multiply $f(x_i)$ by the multiplicity and it converges quadratically again.

$$x_{i+1} = x_i + \frac{mf(x_i)}{f'(x_i)}$$

If we apply this to the example above, it converges perfectly after 1 step. {{%sidenote%}}This is actually the case for any function of the form $f(x)=x^m$, in that it will converge after one step.{{%/sidenote%}}

```python
print("x_1:", newton_method(1, lambda x: 2*x**2, lambda x: 2*x, 1))
```

```
x_0: 1
x_1: 0.0
```

An important thing to note is that Newton's method, just like FPI, is not guaranteed to converge to a root. It is only guaranteed to converge if the initial guess is somewhat close to the root.



## Root-Finding Without Derivatives
***

In some circumstances, we might not be able to calculate the derivative. There are a few methods that converge faster than linear convergence. The secant method is very similar to Newton's Method, but we are using a secant line approximation of the tangent line. There are also variants that we'll discuss below.

### Secant Method and Variants

Instead of using the derivative, we replace it a secant line which passes through the last two guesses. The intersection point of the secant line and the x-axis is the new guess.

An approximation for the derivative at the current guess $x_i$ is the difference quotient:

$$\frac{f(x_i)-f(x_{i-1})}{x_i - x_i{i-1}}$$

Replacing $f'(x_i)$ in Newton's Method with this approximation yields the Secant Method.

```python
def secant_method(x_0, x_1, f, num_iter):
    x_cur, x_last = x_1, x_0
    for i in range(num_iter):
        print(f"x_{i+1}: {x_cur}")
        temp = x_cur
        x_cur -= (f(x_cur)*(x_cur - x_last)) / (f(x_cur) - f(x_last))
        x_last = temp
    return x_cur
```

```python 
f = lambda x: x**3 + x - 1

print("x_7:", secant_method(0, 1, f, 6))
```

```
x_1: 1
x_2: 0.5
x_3: 0.6363636363636364
x_4: 0.6900523560209424
x_5: 0.6820204196481856
x_6: 0.6823257814098928
x_7: 0.6823278043590257
```

Unlike FPI and Newton's Method, two starting guesses are needed initially. 

### Method of False Position

This method can be thought of as the bisection method and the secant method combined. It is similar to the bisection method, where we bracket a root, but instead of using a midpoint approximation, we use a secant approximation instead.

Given an interval $[a,b]$ that brackets a root (assume that $f(a)f(b) \lt 0$), we define the next point as

$$c=a-\frac{f(a)(a-b)}{f(a)-f(b)}=\frac{bf(a)-af(b)}{f(a)-f(b)}$$

Unlike with the normal Secant Method, the new point is guaranteed to lie between the two brackets.

Below is an implementation of the false point method using the same equation we used to originally test our bisection implementation.

```python
def false_point_method(f, a, b, steps):
    f_a, f_b = f(a), f(b)
    if f_a * f_b > 0:
        raise Exception("Both same size")

    for i in range(steps):
        c = (b*f_a - a*f_b) / (f_a - f_b)
        print(f"Guess {i + 1}:", c)
        f_c = f(c)
        if f_c == 0:
            break
        if f_a * f_c < 0:
            b, f_b = c, f_c
        else:
            a, f_a = c, f_c

false_point_method(lambda x: math.cos(x) - x, 0, 1, 10)
```

```
Guess 1: 0.6850733573260451
Guess 2: 0.736298997613654
Guess 3: 0.7389453559657132
Guess 4: 0.7390781308800257
Guess 5: 0.7390847824489231
Guess 6: 0.7390851156443783
Guess 7: 0.7390851323349952
Guess 8: 0.7390851331710708
Guess 9: 0.7390851332129521
Guess 10: 0.73908513321505
```

We can see that this converges significantly faster than our previous bisection implementation. However, this isn't always the case. The Bisection Method guarantees cutting the uncertainty by a half on each step. False Position makes no such promise, and for some examples it converges much more slowly.

We can fix this by checking resorting to use the midpoint if our calculated $c$ does not cut the uncertainty by a half, guaranteeing that it should converge faster or at least as fast as the Bisection Method.

