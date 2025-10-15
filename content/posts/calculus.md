+++
title = "Basic Calculus"
date = 2023-01-06T11:19:22-06:00
tags = ["Class Notes"]
+++
{{< katex >}}{{< /katex >}}

> A small review over Calculus 1, 2, and 3, based on the textbook, Calculus: Early Transcendentals (Eight Edition).



## Differentiation Rules
---

### Product Rule

If $f$ and $g$ are both differentiable, then

$$\frac{d}{dx}[f(x)g(x)]=f(x)g^\prime(x)+g(x)f^\prime(x)$$


### Quotient Rule

If $f$ and $g$ are differentiable, then

$$\frac{d}{dx}\bigg[\frac{f(x)}{g(x)}\bigg]=\frac{g(x)f^\prime(x)-f(x)g^\prime(x)}{[g(x)]^2}$$



## Integration
--- 

### The Substitution Rule

If an integral has both an $x$ value and the derivative of that $x$ value, you can use u-substitution.
$$\int x x^\prime dx = \int u du$$

**Example 1**
$$\int \sin(x) \cos(x) dx \qquad u=\sin(x)\qquad du=\cos(x) dx$$ $$=\int u du$$
$$=\frac{1}{2}u^2+C$$
$$=\frac{1}{2}\sin^2(x)+C$$

**Example 2**
$$\int x^3 \cos(x^4 + 2) dx \qquad u=x^4+2 \qquad du=3x^3 dx \Rightarrow \frac{1}{3}du = x^3 dx$$ $$=\frac{1}{3}\int \cos(u) du$$
$$=\frac{1}{3}\sin(u)+C$$
$$=\frac{1}{3}\sin(x^4 + 2)+C$$

### Definite Integrals

If $g^\prime$ is continuous on $[ a, b ]$ and $f$ is continuous on the range of $u = g(x)$, then

$$\int_a^b f(g(x)) g^\prime(x) dx = \int_{g(a)}^{g(b)}f(u) du$$
$$=F(u) \Big|_{g(a)}^{g(b)}$$
$$=F(g(b))-F(g(a))$$

**Example 1**

$$\int_0^4 \sqrt{2x+1} dx\qquad u=2x+1\qquad du=2 dx \Rightarrow \frac{1}{2}du=dx$$ 
$$=\frac{1}{2}\int_1^9 \sqrt{u} du$$
$$=\frac{1}{2}\cdot \frac{2}{3}u^{\frac{3}{2}} \Big|_1^9$$
$$=\frac{1}{3}\cdot (9^{\frac{3}{2}}-1^{\frac{3}{2}})$$
$$=\frac{26}{3}$$

### Integration by Parts

If you see an integral where you can derive one part and integrate another, then

$$\int f(x) g^\prime(x) dx = f(x) g(x) - \int g(x)f^\prime(x) dx$$

Let $u = f(x)$ and $v = g(x)$. Then the differentials are $du = f^\prime(x) dx$ and $dv=g^\prime(x) dx$, so, by the substitution rule, the formula for integration by parts becomes
$$\int u dv  = u v - \int v du$$

**Example 1**

$$\int x \sin(x) dx$$
$$u=x \qquad dv=\sin(x) dx \qquad du=dx \qquad v=-\cos(x)$$
$$=-x \cos(x)+\int \cos(x) dx$$
$$=-x \cos(x)+\sin(x)+C$$

### Improper Integrals

Improper integrals are integrals that either have an infinite discontinuity in $[a,b]$ or where the interval is infinite

#### Type 1 (Infinite Range)

If $\int_a^t f(x)dx$ exists for every number $t\geq a$ (provided the limit exists), then:

$$\int_a^\infty f(x) dx = \lim_{t\rightarrow\infty}\int_a^t f(x)dx$$

If $\int_t^b f(x)dx$ exists for every number $t\leq a$ (provided the limit exists), then:

$$\int_{-\infty}^b f(x) dx = \lim_{t\rightarrow-\infty}\int_t^b f(x)dx$$

The above improper integrals are called *convergent* if the corresponding limit exists and *divergent* if the limit does not exist. If both of the above improper integrals are convergent, then we define:

$$\int_{-\infty}^\infty f(x) dx = \int_{-\infty}^a f(x)dx + \int_a^\infty f(x)dx$$

where $a$ can be any number.

#### Type 2 (Discontinuity)

If $f$ is continuous on $[a,b)$ and discontinuous at $b$ (provided the limit exists), then:

$$\int_a^b f(x) dx = \lim_{t\rightarrow b^-}\int_a^t f(x)dx$$

If $f$ is continuous on $(a,b]$ and discontinuous at $a$ (provided the limit exists), then:

$$\int_a^b f(x) dx = \lim_{t\rightarrow a^+}\int_t^b f(x)dx$$

Similarly, the above improper integrals are called *convergent* if the corresponding limit exists and *divergent* if the limit does not exist. If both of the above improper integrals are convergent, then we define:

$$\int_a^b f(x) dx = \int_a^c f(x)dx + \int_c^b f(x)dx$$



## Trigonometric Integrals
---

### Strategy for Evaluating $\int \sin^mx \cos^nx dx$

1. If the power of cosine is odd, save one cosine factor and use $\\cos^2 = 1 - \\sin^2x$ to express the remaining factors in terms of sine:

$$\int \sin^mx \cos^{2k+1}x dx$$
$$\int \sin^mx (\cos^2x)^k \cos x dx$$
$$\int \sin^mx (1 - \sin^2x)^k \cos x dx$$

- Then substitute $u=\sin x$

2.  If the power of sine is odd, save one sine factor and use $\sin^2x=1-\cos^2x$ to express the remaining factors in terms of cosine:

$$\int \sin^{2k+1}x \cos^nx dx$$
$$\int (\sin^2x)^k \cos^nx \sin x dx$$
$$\int (1 - \cos^2x)^k \cos^nx \sin x dx$$

- Then substitute $u=\\cos x$
- If both powers of sine and cosine are odd, either (1) or (2) can be used

3. If the powers aof both sine and cosine are even, use the half-angle identities

$$\sin^2x = \frac12(1 - \cos 2x) \qquad \cos^2x = \frac12(1 + \cos 2x)$$

- It is sometimes helpful to use the identity:

$$\sin x \cos x = \frac12 \sin2x$$

### Strategy for Evaluating $\int \tan^mx \sec^nx dx$

1. If the power of secant is even, save a factor of $\sec^2x$ and use $\sec^2x=1+\tan^2x$ to express the remaining factors in terms of $\tan x$:

$$\int \tan^mx \sec^{2k}x dx$$
$$\int \tan^mx (\sec^2x)^{k-1} \sec^2x dx$$
$$\int \tan^mx (1 + \tan^2x)^{k-1} \sec^2x dx$$

- Then substitute $u=\tan x$

2. If the power of tangent is odd, save a factor of $\sec x \tan x$ and use $\tan^2x=\sec^2x-1$ to express the remaining factors in terms of $\sec x$:

$$\int \tan^{2k+1}x \sec^n x dx$$
$$\int (\tan^2x)^k \sec^{n-1} x \sec x \tan x dx$$
$$\int (\sec^2x - 1)^k \sec^{n-1} x \sec x \tan x dx$$

- Then substitute $u=\sec x$

### Additional Identities

To evaluate the integrals $\int \sin mx \cos nx dx$, $\int \sin mx \sin nx dx$, or $\int \cos mx \cos nx dx$, use the identities below:

$$\sin A \cos B =  \frac12[\sin(A-B) + \sin(A+B)]$$
$$\sin A \sin B =  \frac12[\cos(A-B) - \cos(A+B)]$$
$$\cos A \cos B =  \frac12[\cos(A-B) + \cos(A+B)]$$

### Trigonometric Substitution

You use trigonometric substitution when you find either of the following below in an Integration problem:

Expression | Subsitution | Identity
--- | --- | ---
$\sqrt{a^2 - x^2}$ | $x=a\sin\theta \quad -\frac\pi2\leq\theta\leq\frac\pi2$ | $1-\sin^2\theta = \cos^2\theta$
$\sqrt{a^2 + x^2}$ | $x=a\tan\theta \quad -\frac\pi2\leq\theta\leq\frac\pi2$ | $1-\tan^2\theta = \sec^2\theta$
$\sqrt{x^2 - a^2}$ | $x=a\sec\theta \quad 0\leq\theta\le\frac\pi2$ or $\pi\leq\theta\le\frac{3\pi}2$| $\sec^2\theta-1 = \tan^2\theta$

After you integrate, you must convert $\theta$ back to an x:
- You can do this by drawing out the triangle and making the length of each side, $a$, $x$, and the square root of them.
- The original trig function you used in the substitution will let you know what leg is what


**Example**

$$\int\frac{\sqrt{9-x^2}}{x^2}dx$$

- This is a scenario $\sqrt{a^2-x^2}$ where $a=3$
	- $x=3\\sin\theta\qquad\implies\quad\frac{x}{3}=\\sin\theta\qquad\implies\quad\\sin^{-1}(\frac{x}{3})=\theta$
	- $dx=3\\cos\theta d\theta$

$$\sqrt{9-x^2}=\sqrt{9-9\\sin^2\theta}=\sqrt{9(1-\\sin^2\theta)}=\sqrt{9\\cos^2\theta}=3\\cos\theta$$

- Since $\frac{x}{3}=\\sin\theta$, we can draw the triangle to see what leg is what

- Substituting the values in:

$$\int\frac{\sqrt{9-x^2}}{x^2}dx\quad=\quad\int\frac{3\\cos\theta}{9\\sin^2\theta} 3\\cos\theta d\theta$$
$$=\quad\int\frac{\\cos^2\theta}{\\sin^2\theta}d\theta$$
$$=\quad\int\\cot^2\theta d\theta$$
$$=\quad\int(\csc^2\theta-1) d\theta$$
$$=\quad-\\cot\theta-\theta+C$$
$$=\quad\frac{\sqrt{9-x^2}}{x}-\\sin^{-1}\Big(\frac{x}{3}\Big)+C$$



## Infinite Sequences and Series
---

### Sequences

A *sequence* can be thought as a list of numbers written in a definite order:

$$a_1, a_2, a_3, a_4, \dots, a_n, \dots$$

The sequence $a_1, a_2, a_3, \dots$ can be denoted by

$${a_n} \quad or \quad {\\{a_n\\}}_{n=1}^\infty$$

If the limit $\lim_{n\rightarrow\infty}a_n$ exists for the sequence $\{a_n\}$, we write

$$\lim_{n\rightarrow\infty}a_n=L \quad \text{or} \quad a_n\rightarrow L \text{ as } n\rightarrow\infty$$

and say that the sequence *converges* (or is *convergent*). Otherwise, we say the sequence *diverges* (or is *divergent*).

A property is that you can add, subtract, multiply, and divide them like below:

$$\lim_{n\rightarrow\infty}(a_n + b_n) = \lim_{n\rightarrow\infty}a_n + \lim_{n\rightarrow\infty}b_n$$

If a sequence either only increases or decreases, we call it *monotonic*.

### Series

An *infinite series* (or just a *series*) is the sum of the terms in an infinite sequence ${\\{a_n\\}}_{n=1}^\infty$ which is an expression of the form:

$$a_1+a_2+a_3+\dots+a_n+\dots$$

It is also denoted by:

$$\sum_{n=1}^\infty a_n \quad or \quad \sum a_n$$

To determine whether or not a general series has a sum, we consider the *Partial Sums Of A Series* (adding up the first $n^{th}$ terms and seeing if it converges). 

$$s_n = a_1+a_2+a_3+\dots+a_n = \sum_{i=1}^n a_i$$

If the sequence $a_n$ is convergent and $\lim_{n\rightarrow\infty} s_n = s$ exists (as a finite number), then the series $\sum a_n$ is called convergent and we write:

$$\sum_{n=1}^\infty a_n = s$$

The number $s$ is called the sum of the series. If the sequence $a_n$ is divergent, then the series is called divergent.

Thus the sum of a series is the limit of the sequence of partial sums as $n$ goes to infinity. Notice that

$$\sum_{n=1}^\infty a_n = \lim_{n\rightarrow\infty}\sum_{i=1}^{n} a_i$$

### Test for Divergence

If the limit $L$ of a series does not exist and $L \neq 0$, aka:

$$\lim_{n\rightarrow\infty} a_n \quad \text{does not exist}\quad or \quad\lim_{n\rightarrow\infty}\neq0$$ then the series $\sum_{n=1}^\infty a_n$ is divergent.

It makes sense since if the limit of $a_n$ doesn't converge to 0, then you will be adding an infinite amount of positive numbers which will of course sum to infinity (meaning that the series will diverge). Note: Rule does not work in reverse. If the limit does exist and is equal to 0, you cannot conclude that it is convergent.


**Example**

Show that the series $\sum_{n=1}^\infty\frac{n^2}{5n^2+4}$ diverges.

$$\lim_{n\rightarrow\infty}a_n=\lim_{n\rightarrow\infty}\frac{n^2}{5n^2+4}=\lim_{n\rightarrow\infty}\frac{1}{5+\frac{4}{n^2}}=\frac15\neq0$$

### The Integral Test

Suppose $f$ is a continuous, positive, decreasing function on $[1, \infty)$ and let $a_n = f(n)$. Then the series $\sum_{n=1}^\infty a_n$ is convergent if and only if the improper integral $\int_1^\infty f(x) dx$ is convergent. In other words:

1. If $\int_1^\infty f(x) dx$ is convergent, then $\sum_{n=1}^\infty a_n$ is convergent.
2. If $\int_1^\infty f(x) dx$ is divergent, then $\sum_{n=1}^\infty a_n$ is divergent.

For the integral test to apply to a series, it must satisfy four special conditions (The four conditions generalizes for $[K, \infty)$ for some $K\ge1$).

1. Function $f$ is *continuous* on $[1, \infty)$
2. Function $f$ is *positive*, aka $f(x)\ge 0$ on $[1,\infty)$
3. $f(n) = a_n$ for all $n\ge 1$
4. Function $f$ is *decreasing* on $[1, \infty)$       

#### Process

- Figure out if the series $\sum_{n=1}^{\infty}a_n$ satisfies the 4 conditions
    - $f(x)$ is positive and continuous on $[1, \infty)$ and $f(n) = a_n$ for all $n\ge 1$. (The first 3)
	- $f^\prime(x)= \cdots <0$  for all $x\ge1$. (find $f^\prime(x)$ and see whether it's always positive or negative)
	- Since $f^\prime(x)<0$ on $[1, \infty)$, $f(x)$ is decreasing on $[1, \infty)$.
- Treat the series like a continuous function
- Find the improper definite integral $\int_1^\infty f(x) dx$ (where $f(x)$ is just $a_n$)
- Conclude whether the series converges or diverges based on whether the function converges or diverges

### Sum of a Series Approximation

To find an approximation to the sum $s$ of a series, take the limit of the partial sums as $n$ goes to infinity.

$$s = \lim_{n\rightarrow\infty}s_n = \sum_{n=1}^\infty a_n = a_1+a_2+a_3+\dots$$

The Remainder $R_n$ is the level of error in the series approximation. In short:

$$R_n = s - s_n = a_{n+1}+a_{n+1}+a_{n+3}+\dots$$

We use the remainder to estimate how good $s$ is as an approximation of the total sum of a series.

If $R_n=s-s_n$, then:

$$\int_{n+1}^\infty f(x)dx \le R_n \le \int_{n}^\infty f(x)dx$$

**Example**

Approximate $\sum \frac{1}{n^3}$ by using the sum of the first 10 terms, then estimate the level of error

The approximation of the series:
$$\sum_{n=1}^{10}\frac1{n^3}\approx s_{10}=\frac1{1^3}+\frac1{2^3}+\frac1{3^3}+\dots+\frac1{10^3}\approx1.1975$$

The level of error:

$$R_n=\int_n^\infty \frac{1}{x^3}dx=\lim_{t\rightarrow\infty} [-\frac{1}{2x^2}]_n^t$$

$$=\lim_{t\rightarrow\infty}(-\frac{1}{2t^2}+\frac{1}{2n^2})=\frac1{2n^2}$$

$$R_{10}\le\int_{10}^\infty \frac{1}{x^3}dx=\frac1{2(10)^2}=\frac1{200}=0.005$$

Therefore the size of the error is at most 0.005.

#### Calculating Accuracy Within a Given Range

Let the calculation be accurate within 0.0005.

$$R_n \le \int_{n}^\infty f(x) dx < 0.0005$$

Integrate the improper integral and solve for n.

**Example (continued)**

$$R_n \le \int_{n}^\infty \frac1{x^3}dx = \frac1{2n^2} < 0.0005$$

$$n^2>\frac1{0.001}=1000$$

$$n>\sqrt{1000}\approx31.6$$

Thus we need 32 terms to ensure accuracy to within 0.0005.

### The Direct Comparison Test

With the comparison tests, we compare a given series with a series that is known to be convergent or divergent to determine whether the given series is or not.

Suppose that $\sum a_n$ and $\sum b_n$ are series with positive terms.

1. If $\sum b_n$ is *convergent* and $a_n \le b_n$ (series $\sum b_n$ *dominates* series $\sum a_n$) for all $n$, then $\sum a_n$ is also *convergent.*

2. If $\sum b_n$ is *divergent* and $a_n \ge b_n$ (series $\sum a_n$ *dominates* series $\sum b_n$) for all $n$, then $\sum a_n$ is also *divergent.*

In short, if a series is smaller than a convergent series, it also converges. If a series is larger than a divergent series, it also diverges.


**Example**

Here we have the given series $\sum_{n=1}^\infty \frac1{2^n+1}$. This series is similar to the geometric series $\sum_{n=1}^\infty \frac1{2^n}$ with a common ratio of $\frac12$. Since we know that the former will always be less than the latter (since the denominator will always be bigger) and that the latter converges, we know that the former converges by the Direct Comparison Test.

$$\sum_{n=1}^\infty \frac1{2^n+1} \le \sum_{n=1}^\infty \frac1{2^n}$$

### The Limit Comparison Test

Suppose that $\sum a_n$ and $\sum b_n$ are series with positive terms. If

$$\lim_{n\rightarrow\infty}\frac{a_n}{b_n}=c \qquad c\neq0$$

then there $c$ is a finite number and $c>0$, then *either both series converge or both diverge.*


**Example**

Here we have the given series $\sum_{n=1}^\infty \frac1{2^n+1}$. This series is similar to the geometric series $\sum_{n=1}^\infty \frac1{2^n}$ with a common ratio of $\frac12$. 
$$a_n=\sum_{n=1}^\infty \frac1{2^n+1}\qquad b_n=\sum_{n=1}^\infty \frac1{2^n}$$

Using the Limit Comparison Test, we get

$$\lim_{n\rightarrow\infty} \frac{a_n}{b_n}=\lim_{n\rightarrow\infty} \frac{\frac{1}{2^n-1}}{\frac1{2^n}}=\lim_{n\rightarrow\infty} \frac{2^n}{2^n-1}=\lim_{n\rightarrow\infty}\frac{1}{1-\frac1{2^n}}=1>0$$

Since this limit exists (and $\neq 0$) and $\sum \frac1{2^n}$ is a convergent geometric series, the series $\sum_{n=1}^\infty \frac1{2^n+1}$ converges by the Limit Comparison Test.

### Alternating Series

An *alternating series* is a series whose terms flip from positive to negative each term.

$$a_1-a_2+a_3-a_4+a_5-a_6+\dots$$

$$1-\frac12+\frac13-\frac14+\frac15-\frac16+\dots=\sum_{n=1}^\infty (-1)^{n-1}\frac1n$$

### The Alternating Series Test

An alternating series is convergent if it satisfies

1. $\quad b_{n+1} \le b_n \quad$ for all $n$
2. $\quad \lim_{n\rightarrow\infty}b_n=0$

**Example**

Take the alternating harmonic series

$$1-\frac12+\frac13-\frac14+\dots=\sum_{n=1}^\infty(-1)^{n-1}\frac1n\qquad b_n=\frac1n$$

The series satisfies the two conditions

$$b_{n+1}\le b_n\qquad \Rightarrow\qquad \frac1{n+1}<\frac1n$$
$$\lim_{n\rightarrow\infty}b_n=0\qquad \Rightarrow\qquad \lim_{n\rightarrow\infty}\frac1n=0$$

Therefore, the series is convergent by the Alternating Series Test.

### Level of Error for Alternating Series

If $s=\sum (-1)^{n-1}b_n$ where $b_n > 0$ is the sum of an alternating series that is convergent by the alternating series test, then the level of error for the alternating series is:

$$|R_n|=|s-s_n| \le b_{n+1}$$

where $s$ is the sum of the series and $s_n$ is the partial sums of a series of the first $n^{th}$ terms.

In a normal series, the partial sums will always increase as $n$ goes to infinity (it will always converge from one direction). In alternate series, it converges from both sides.

$|s-s_n|$ will decrease as $n\rightarrow\infty$ since you are adding and *subtracting* smaller and smaller numbers. The *subtraction* is why $|s-s_n|$ will always be less than or equal to  $b_{n+1}$.

### Absolute Convergence

- A series $\sum a_n$ is called *absolutely convergent* if the series of absolute values $\sum |a_n|$ is convergent.

- A series $\sum a_n$ is called *conditionally convergent* if it is convergent but not absolutely convergent.

- If a series $\sum a_n$ is absolutely convergent, then it is convergent.

### The Ratio Test

The series $\sum_{n=1}^\infty a_n$ has absolute convergence (and therefore is convergent) if:

$$\lim_{n\rightarrow\infty}\Big|\frac{a_{n+1}}{a_n}\Big|=L<1$$

The series $\sum_{n=1}^\infty a_n$ is divergent if:

$$\lim_{n\rightarrow\infty}\Big|\frac{a_{n+1}}{a_n}\Big|=L>1$$

The ratio test is inconclusive (no conclusion can be drawn about the convergence or divergence) if:

$$\lim_{n\rightarrow\infty}\Big|\frac{a_{n+1}}{a_n}\Big|=L=1$$

**Example**

$$\sum_{n=1}^\infty a_n=\sum_{n=1}^\infty(-1)^n\frac{n^3}{3^n}$$

Does the given series $\sum a_n$ converge or diverge?

$$|a_n|=\frac{n^3}{3^n} \qquad |a_{n+1}|=\frac{(n+1)^3}{3^{n+1}}$$

$$\lim_{n\rightarrow\infty}\Bigg|\frac{a_{n+1}}{a_n}\Bigg|=\lim_{n\rightarrow\infty}\frac{(n+1)^3}{3^{n+1}}\cdot\frac{3^n}{n^3}=\lim_{n\rightarrow\infty}\frac13\frac{(n+1)^3}{n^3}=\lim_{n\rightarrow\infty}\frac13\Bigg(\frac{n+1}{n}\Bigg)^2=\frac13(1)^2=\frac13$$

Justification: Since $\lim_{n\rightarrow\infty}|\frac{a_{n+1}}{a_n}|=\frac13$ and $\frac13<1$, the series $\sum_{n=1}^\infty(-1)^n\frac{n^3}{3^n}$ is absolutely convergent by the Ratio Test.

### The Root Test

The series $\sum_{n=1}^\infty a_n$ has absolute convergence (and therefore is convergent) if:

$$\lim_{n\rightarrow\infty}\sqrt[n]{|a_n|}=L<1$$

The series $\sum_{n=1}^\infty a_n$ is divergent if

$$\lim_{n\rightarrow\infty}\sqrt[n]{|a_n|}=L>1$$

The root test is inconclusive (no conclusion can be drawn about the convergence or divergence) if:

$$\lim_{n\rightarrow\infty}\sqrt[n]{|a_n|}=L=1$$

**Example**

$$\sum_{n=1}^\infty a_n=\sum_{n=1}^\infty\frac3{[ln(n)]^n}$$

Does the given series $\sum a_n$ converge or diverge?

$$|a_n|=\Bigg|\frac3{[ln(n)]^n}\Bigg|$$

$$\lim_{n\rightarrow\infty}\sqrt[n]{|a_n|}=\lim_{n\rightarrow\infty}\frac{\sqrt[n]{3}}{ln(n)}=0=L<1$$

Justification: Since $\lim_{n\rightarrow\infty}\frac{\sqrt[n]{3}}{ln(n)}=0$ and $0<1$, the series $\sum_{n=1}^\infty\frac3{[ln(n)]^n}$ is Absolutely Convergent by the Root Test.



## Common Series
---

These series are good for the Direct Comparison Test and the Limit Comparison Test since we know whether they converge or diverge.

### Harmonic Series

A Harmonic Series takes the form of:

$$\sum_{n=1}^\infty\frac1n$$

and is always *divergent.*

### Geometric Series

A Geometric Series takes the form of:

$$\sum_{n=1}^{\infty}a\cdot r^{n-1}$$

is convergent if $|r|<1$ and divergent if $|r|\ge1$.  $r$ is known as the *Common Ratio*.

When $|r|<1$:

$$s=\sum_{n=1}^{\infty}a\cdot r^{n-1}=\frac{a}{1-r}$$

### P-Series

The P-Series is any series of the form:

$$\sum_{n=1}^\infty\frac{1}{n^p}dx$$

and is *convergent* when $p>1$ and *divergent* when $p\le1$.



## Power Series
---

A power series is a series of the form $$\sum_{n=0}^\infty c_nx^n=c_0+c_1x+c_2x^2+c_3x^3+\cdots$$ where $x$ is a variable and the $c_n$'s are constants called the coefficients of the series.

A power series may converge for some values of $x$ and diverge for other values of $x$.

A series of the form:

$$\sum_{n=0}^\infty c_n(x-a)^n=c_0+c_1(x-a)+c_2(x-a)^2+\cdots$$

is called a power series centered at $a$.

You can use the Ratio Test or the Root Test to determine whether a power series is convergent or divergent.


**Example**

Let $a_n=\frac{(x-3)^n}{n}$, then:

$$\lim_{n\rightarrow\infty}\Bigg|\frac{a_n+1}{a_n}\Bigg|=\lim_{n\rightarrow\infty}\Bigg|\frac{(x-3)^{n+1}}{n+1}\cdot\frac{n}{(x-3)^{n}}\Bigg|=\lim_{n\rightarrow\infty}\frac{1}{1+\frac1n}|x-3|=|x-3|$$

By the Ratio Test, the series is absolutely convergent, when $|x-3|<1$ and divergent when $|x-3|>1$. Solving for $x$, we get

$$|x-3|<1 \quad \Rightarrow \quad -1<x-3<1 \quad \Rightarrow \quad 2<x<4$$

In this case, the *Radius of Convergence* is $1$ and the *Interval of Convergence* is $(2, 4)$.

### Power Series Representations

We can represent certain types of functions as Power Series. This is sometimes useful for functions that are normally hard to integrate, but which can be represented as a series with terms that are easy to integrate.

We can perform *term-by-term differentiation and integration* of a power series representation of a function to get the integral or derivative of that function.

#### Properties

- If the power series $\sum c_n(x-a)^n$ has a *Radius of Convergence* $R > 0$, then the function $f$ defined by

  $$f(x)=c_0+c_1(x-a)+c_2(x-a)^2+\dots=\sum_{n=0}^\infty c_n(x-a)^n$$

  is differentiable (and therefore continuous) and has an *Interval of Convergence* of $(a-R,  a+R)$.  

- The integral or derivative of the function can be represented by a sum of the *term-by-term integration or differentiation* of a series:

$$(i)\quad f^\prime(x)=c_1+2c_2(x-a)+3c_3(x-a)^2+\cdots$$
$$=\sum_{n=0}^\infty \frac{d}{dx}\Big[c_n(x-a)^n\Big]=\sum_{n=1}^\infty n c_n(x-a)^n$$

$$(ii)\quad \int f(x) dx=C+c_0(x-a)+\frac12 c_1(x-a)^2+\frac13 c_3(x-a)^3+\cdots$$
$$=\sum_{n=0}^\infty \int c_n(x-a)^{n} dx=C+\sum_{n=0}^\infty \frac1{n+1} c_n(x-a)^{n+1}$$



## Taylor Series
---
Taylor Series is a general way to find a power series representations.

If $f$ has a power series representation at $a$, that is, if:

$$f(x)=\sum_{n=0}^\infty c_n(x-a)^n\qquad |x-a|<R$$

then its coefficients are given by the formula:

$$c_n = \frac{f^{(n)}(a)}{n!}$$

If $f$ has a power series at expansion $a$, then it is in the form:

$$f(x)=\sum_{n=0}^\infty \frac{f^{(n)}(a)}{n!}(x-a)^n$$

$$=f(a)+\frac{f^\prime(a)}{1!}(x-a)+\frac{f^{\prime\prime}(a)}{2!}(x-a)^2+\frac{f^{(3)}(a)}{3!}(x-a)^3+\dots$$

It must be that $|x-a|<R$. If this is the case, then the series will converge to the actual function. If not, then it diverges from it, making it useless.

### Maclaurin Series

A Maclaurin Series is a Taylor Series that is centered at 0 (aka $a = 0$).

$$f(x)=\sum_{n=0}^\infty \frac{f^{(n)}(0)}{n!}x^n$$

$$=f(0)+\frac{f^\prime(0)}{1!}x+\frac{f^{\prime\prime}(0)}{2!}x^2+\frac{f^{(3)}(0)}{3!}x^3+\dots$$

**Example**

Find the Maclaurin series of the function $f(x) = e^x$.

If $f(x) = e^x$, then $f^{(n)}(x) = e^x$, so $f^{(n)}(0)=e^0=1$ for all $n$. Therefore, the Taylor series for $f$ at 0 is

$$\sum_{n=0}^\infty \frac{f^{(n)}(0)}{n!}x^n=\sum_{n=0}^\infty \frac{x^n}{n!} = 1+\frac{x}{1!}+\frac{x^2}{2!}+\frac{x^3}{3!}+...$$

### Taylor Polynomials

A Taylor Polynomial is the sum of the first $n^{th}$ terms in a Taylor Series

$$T_n(x)=\sum_{i=0}^n\frac{f^{(i)}(a)}{i!}(x-a)^n$$

$$=f(a)+\frac{f^\prime(a)}{1!}(x-a)+\frac{f^{\prime\prime}(a)}{2!}(x-a)^2+\dots+\frac{f^{(n)}(a)}{n!}(x-a)^n$$

$T_n$ is a polynomial of degree $n$ called the nth-degree Taylor polynomial of $f$ at $a$.

Taylor Polynomials are a sum of a series approximation and thus has a remainder $R_n$ which is the level of error in the series approximation.

If $f(x) = T_n(x) + R_n(x)$, where $T_n$ is the nth-degree Taylor polynomial of $f$ at $a$ and 

$$\lim_{n\rightarrow\infty}R_n(x) = 0$$

for $|x-a|<R$ ($R$ is the Radius of Convergence, also sometimes denoted as $d$), then $f$ is equal to the sum of its Taylor Series on the interval $|x-a|<R$.

### Taylor's Inequality

If $|f^{(n+1)}(x)| \le M$ for $|x-a| \le d$, then the remainder $R_n(x)$ of a Taylor Polynomial satisfies the inequality:

$$|R_n(x)| \le \frac{M}{(n+1)!}|x-a|^{n+1} \qquad for\quad |x-a|\le d$$



## Parametric Equations
---

Suppose $x$ and $y$ are both given as functions of a third variable $t$ (called a *parameter*) by the equations (called *parametric equations*) below

$$x=f(t)\qquad y=g(t)$$

Each value of $t$ determines a point ($x$, $y$), which we can plot in a coordinate plane. As $t$ varies, the point $(x, y) = (f(t), g(t))$ varies and traces out a curve $C$, which we call *Parametric Curves*.

In many applications of parametric curves, $t$ denotes time and $(x, y) = (f(t), g(t))$ means the position of a particle at time $t$.

You can plot it on a Cartesian Plane by plugging in a $t$ into the parametric equations and then plotting the coordinates that were generated.

Sometimes the curve with parametric equations have a bound:

$$x=f(t)\qquad y=g(t)\qquad a\le t\le b$$

which means it has an *initial point* $(f(a), g(a))$ and *terminal point* $(f(b), g(b))$.

### Eliminating the Parameter

There are two methods for eliminating the parameter $t$. The most obvious method is solve for $t$ in one parametric equation and then plug it in to the other.

$$x=1+t \qquad y=\frac t2$$
$$t=x-1 \qquad \Rightarrow\qquad y=\frac {x-1}2$$

The other method requires finding a special relation between the two equations like shown below:

$$x=\cos(t)\qquad y=\sin(t)$$ 
$$\cos^2(t) + \sin^2(t) = 1\quad\implies\quad x^2 +y^2=1$$

### Tangents and Arc Lengths of Parametric Curves

If $f$ and $g$ are differentiable functions and we want to find the tangent line at a point on the Parametric Equations $x=f(t)$, $y=g(t)$.

$$\frac{dy}{dx}=\frac{\frac{dy}{dt}}{\frac{dx}{dt}}\quad \text{if} \quad \frac{dx}{dt}\neq0$$

The equation of the Arc Length under a parametric curve with the Parametric Equations $x=f(t)$ and $y=g(t)$, where $\alpha \le t \le \beta$ and $f^\prime$ and $g^\prime$ are continuous on \[$\alpha, \beta$\] and $C$ is traversed exactly once, then the length of $C$ is:

$$L=\int_\alpha^\beta\sqrt{\Big(\frac{dx}{dt}\Big)^2+\Big(\frac{dy}{dt}\Big)^2}dt$$



## Polar Coordinates
---

Polar coordinates are another way to plot points on a Cartesian Plane (instead of using Cartesian coordinates we usually see).

We call the origin (labeled $O$) the *pole*. The ray drawn horizontally to the right is called the *polar axis*. The point $P(r, \theta)$ is called the *polar coordinates* of $P$.

Each point can be represented in multiple ways. For example:

$$P(1, 0) = P(-1, \pi) = P(1, 2\pi) = P(-1, 3\pi),\quad etc$$

All that changes is how many times you circle around the origin.

### Polar to Cartesian 

To find the Cartesian coordinates of a point when the polar coordinates are known:

$$x=r \cos \theta\qquad y=r \sin \theta$$

To find the polar coordinates of a point when the Cartesian coordinates are known:
$$r^2=x^2+y^2\qquad \tan \theta=\frac{y}x$$

### Tangents of Polar Curves

To find a tangent line to a Polar Curve $r=f(\theta)$, we regard $\theta$ as a parameter and write its parametric equations as:

$$x=r \cos \theta=f(\theta) \cos \theta \qquad y=r \sin \theta =f(\theta) \sin \theta$$

The slope of the tangent line is:

$$\frac{dy}{dx}=\frac{\frac{dy}{d\theta}}{\frac{dx}{d\theta}}=\frac{\frac{dr}{d\theta} \sin \theta+r \cos \theta}{\frac{dr}{d\theta} \cos \theta-r \sin \theta}$$

We locate *horizontal tangents* by finding where $\frac{dy}{d\theta}=0$ and find *vertical tangents* at points where $\frac{dx}{d\theta}=0$. If they're both 0, undefined behavior happens.

### Area under Polar Curves

The area under a polar curve can be represented as:

$$A=\int_a^b\frac12[ f(\theta) ]^2 d\theta$$

which is often written as:

$$A=\int_a^b\frac12 r^2 d\theta$$

#### Finding The Intersections Between Two Curves

- To find the intersections, set $r_1$ and $r_2$ equal to each other and solve for $\theta$.

- You also should check the pole by setting both $r_1$ and $r_2$ to 0 and solving for $\theta$. You should get two valid angles for both if they're both on the curve.


#### Finding The Area Between Two Curves

- To find the area under curve $r_1$ and above curve $r_2$, you find where they intersect and then denote the intersecting angles as $\alpha$ and $\beta$.

- Plug in everything to this equation and solve

$$A=\int_\alpha^\beta \frac12(r_1^2-r_2^2) d\theta$$

### Arc Length of Polar Curves

The length of a polar curve $r=f(\theta)$ where $\alpha \le \theta\le \beta$ is:

$$L = \int_\alpha^\beta\sqrt{r^2+\Big(\frac{dr}{d\theta}\Big)^2}d\theta$$



## Differential Equations
---

A *differential equation* is an equation that contains an unknown function and one or more of its derivatives. The *order* of a differential equation is the order of the highest derivative that occurs in the equation.

Usually in equations, the independent variable is called $t$ and represents time, but in general the independent variable can be anything. For the differential equation below, it is understood that y is an known function of x.

$$y^\prime=xy$$

Function $f$ is called a solution of a differential equation if the equation is satisfied when $y=f(x)$ and its derivatives are substituted into the equation. Thus $f$ is a solution of the equation above if

$$f^\prime(x)=xf(x)$$

for all values of x in some interval.

When we are asked to *solve* a differential equation, we are expected to find all possible solutions of the equation. For instance, let us look at the new differential equation $y^\prime=x^3$. We know that the solution the differential equation is given by $y=\frac{x^4}4+C$ where C is an arbitrary constant. This is known as the *general solution.*

In general, solving a differential equation is not an easy matter as there is no systematic technique that allows us to solve all differential equations.

### Steps for solving

1. Derive y to the proper order
2. Get the differential equation and what you just solved to be equal to each other

**Example**

Show that every member of the family of functions below is a solution of the differential equation $y^\prime=\frac12(y^2-1)$:

$$y=\frac{1+ce^t}{1-ce^t}$$

Using the Quotient Rule:

$$y^\prime=\frac{(1-ce^t)(ce^t)-(1+ce^t)(-ce^t)}{(1-ce^t)^2}$$
$$=\frac{ce^t-c^2e^{2t}+ce^t+c^2e^{2t}}{(1-ce^t)^2}$$
$$=\frac{2ce^t}{(1-ce^t)^2}$$

The right hand side of the differential equation becomes

$$y^\prime=\frac12(y^2-1)=\frac12\bigg[\bigg(\frac{1+ce^t}{1-ce^t}\bigg)^2-1\bigg]$$
$$=\frac12\bigg[\frac{(1+ce^t)^2}{(1-ce^t)^2}-1\bigg]$$
$$=\frac12\bigg[\frac{(1+ce^t)^2-(1-ce^t)^2}{(1-ce^t)^2}\bigg]$$
$$=\frac12\bigg[\frac{4ce^2}{(1-ce^t)^2}\bigg]$$
$$=\frac{2ce^2}{(1-ce^t)^2}$$

Therefore, for every value of c, the given function is a solution of the differential equation

### Initial Value Problem

When applying differential equations, we are usually not interested in finding the general solution as we are in finding a solution that satisfies some additional requirement, also known as a *Particular Solution.* 

In many physics problems, we are interested in finding a solution of the form $y(t_0)=y_0$. This is called an *Initial Condition*, and the problem of finding a solution of a differential equation is called an *Initial Value Problem*.

**Example**

Find a solution of the differential equation $y^\prime = \frac12(y^2-1)$ that satisfies the initial condition y(0) = 2.

Substituting the values of $t=0$ and $y=2$ into the formula

$$y=\frac{1+ce^t}{1-ce^t}$$

$$2=\frac{1+ce^0}{1-ce^0}=\frac{1+c}{1-c}$$

If we solve for c, we get $2-2c=1+c$, which gives us $c=\frac13$. So the solution to the initial value problem is

$$2=\frac{1+\frac{1}{3}e^t}{1-\frac{1}{3}e^t}=\frac{3+e^t}{3-e^t}$$

### Direction Fields

Suppose we are asked to sketch the graph of the solution of the Initial Value Problem:

$$y^\prime=x+y\qquad y(0)=1$$

The problem is that we don't know a formula for the solution. The equation $y^\prime=x+y$ tells us that the slope at any point ($x, y$) on the graph (called the *solution curve*) is equal to the sum of the x and y coordinates at the point.

We can draw the slope of each point to get a *direction field* (also known as a slope field) and then draw the curve from that.

You can figure out the slope field of an equation by plugging numbers into the derivative and then plotting the slope on a graph.

### Euler's Method

The basic idea behind a direction field can be used to find numerical approximations to solutions of a differential equation.

$$y^\prime=x+y\qquad y(0)=1$$

The differential equation tells us that $y^\prime(0)=0+1=1$, so the solution curve has slope 1 at the point $(0, 1)$.
As a first approximation to the solution, we could use the linear approximation $f(x)=x+1$. In other words, we could use the tangent line at $(0, 1)$ as a rough approximation to the solution curve.

Euler's idea was to update the curve each step (some amount on the x-axis) to approximate the solution curve.

#### Formula

Approximate values for the solution of the initial value problem $y^\prime=F(x, y)$ where $y(x_0)=y_0$ with step size $h$ at $x_n=x_{n-1}+h$ are

$$y_n=y_{n-1}+h F(x_{n-1}, y_{n-1})$$

where $F(x, y)$ is the slope of a solution curve at points $(x, y)$.

**Example**

Use Euler's method with step size 0.1 to construct a table of approximate values for the solution of the initial-value problem

$$y^\prime=x+y\qquad y(0)=1$$

We are given that $h=0.1$, $x_0=0$, $y_0=1$, and $F(x, y)=x+y$. So we have

$$y_1=y_0+h F(x_0, y_0)=1+(0.1)(1)=1.1$$
$$y_2=y_1+h F(x_1, y_1)=1.1+(0.1)(0.1+1.1)=1.22$$
$$y_3=y_2+h F(x_2, y_2)=1.22+(0.1)(0.2+1.22)=1.362$$

You can get more accurate values by decreasing the step size.

### Separable Equations

A *separable equation* is a first-order differential equation in which the expression for $\frac{dy}{dx}$ can be factored as a function of $x$ times a function of $y$. In other words, it can be written in the form:

$$\frac{dy}{dx}=g(x)f(y)$$

The name separable comes from the fact that the expression on the right side can be separated into a function of $x$ and a function of $y$. Equivalently, if $f(y)\neq0$, we could write

$$\frac{dy}{dx}=\frac{g(x)}{h(y)}$$

where $h(y)=\frac1{f(y)}$. To solve this equation, we rewrite it in the differential form

$$h(y) dy=g(x) dx$$

We can integrate both sides

$$\int h(y) dy=\int g(x) dx$$


**Example**

Solve the differential equation $\frac{dy}{dx}=\frac{x^2}{y^2}$ and find the solution that satisfies the Initial Condition $y(0)=2$.

$$y^2 dy=x^2 dx$$
$$\int y^2 dy=\int x^2 dx$$
$$\frac13y^3=\frac13x^3+C$$

If we solve for y, we get

$$y=\sqrt[3]{x^3+3C}$$

By plugging in $y(0)=2$, we get

$$y(0)=\sqrt[3]{0^3+3C}=2$$

$$\sqrt[3]{3C}=2$$

$$3C=8$$
$$C=\frac83$$

Thus the solution to the initial value problem is

$$y=\sqrt[3]{x^3+8}$$

### Logistic Model

The logistic model is usually used for population growth:

$$\frac{dP}{dt}=kP(1-\frac{P}{m})$$

Where:
- $m$ is the carrying capacity
- $P$ is the population at time $t$
- $P_0=P(0)$ = Initial Population


The Initial Value Problem solution of the logistic model is:

$$P=\frac{m}{1+Ae^{-kt}}\qquad A=\frac{m-P_0}{P_0}$$

### Linear Equations

A first order *linear* differential equation is one that can be put into the form:

$$\frac{dy}{dx}+P(x)y=Q(x)$$

where $P$ and $Q$ are continuous functions on a given interval.

An example of a linear equation is $xy^\prime+y=2x$ because, for $x\neq0$, it (notice that this is not a separable equation because it is impossible to factor the expression for $y^\prime$ as a function of $x$ times a function of $y$) can be written in the form

$$y^\prime+\frac1xy=2$$


We notice, by the product rule, that

$$y^\prime+\frac1xy=2 \implies xy^\prime+y=2x \implies xy^\prime+(1)y=(xy)^\prime$$
$$\therefore (xy)^\prime=2x$$

By integrating both sides we get

$$xy=x^2+C$$
$$y=x+\frac{C}x$$

Every first order linear differential equation can be solved in a similar fashion by multiplying both sides of by a suitable function $I(x)$ called an *Integrating Factor*.

- To solve the linear differential equation $y^\prime + P(x)y = Q(x)$, multiply the integrating factor and integrate both sides.
- The integrating factor always comes in the form:

$$I(x)=e^{\int P(x)dx}$$

**Example**

$$\frac{dy}{dx}+3x^2y=6x^2$$
$$P(x)=3x^2\qquad Q(x)=6x^2$$
$$\therefore I(x)=e^{\int3x^2dx}=e^{x^3}$$

$$e^{x^3}\frac{dy}{dx}+3x^2e^{x^3}y=6x^2e^{x^3}$$
$$(e^{x^3}y)^\prime=6x^2e^{x^3}$$
Integrating both sides we get

$$e^{x^3}y=\int6x^2e^{x^3}dx=2e^{x^3}+C$$
$$y=2+Ce^{-x^3}$$



## Partial Derivatives
---

If $f$ is a function of two variables, its partial derivatives are the functions $f_x$ and $f_y$ defined by:

$$f_x = lim_{h\rightarrow0} \frac{f(x+h, y)-f(x,y)}{h}$$
$$f_y = lim_{h\rightarrow0} \frac{f(x, y+h)-f(x,y)}{h}$$

Below are several differnt notations for partial derivatives. If $z=f(x,y)$, we write:

$$f_x(x,y)=f_x=\frac{\partial f}{\partial x}=\frac{\partial}{\partial x}f(x,y)=\frac{\partial z}{\partial x}=f_1=D_1 f=D_x f$$
$$f_y(x,y)=f_y=\frac{\partial f}{\partial y}=\frac{\partial}{\partial y}f(x,y)=\frac{\partial z}{\partial y}=f_2=D_2 f=D_y f$$

To compute a partial derivative with respect to x, treat all other variables as constants and differentiate as usual.

### Higher Derivatives

If $f$ is a function of two variables, the its partial derivatives $f_x$ and $f_y$ are also functions of two variables, so we can differentiate them again to get second order partial derivatives. Below is the notation where the first partial was with respect to x:

$$f_{xx}=f_{11}=\frac{\partial }{\partial x} \frac{\partial f}{\partial x}=\frac{\partial^2 f}{\partial x^2}=\frac{\partial^2 z}{\partial x^2}$$
$$f_{xy}=f_{12}=\frac{\partial }{\partial y} \frac{\partial f}{\partial x}=\frac{\partial^2 f}{\partial y\partial x}=\frac{\partial^2 z}{\partial y\partial x}$$



## Appendix
---

### Common Integrations

$$\int x^n dx = \frac{x^{n+1}}{n+1} \quad (n \neq -1)$$
$$\int \frac1x dx = \ln|x|$$
$$\int e^x dx = e^x$$
$$\int b^x dx = \frac{b^x}{\ln b}$$

### Trigonometric Integrations
$$\int \sin x dx = -\cos x$$
$$\int \cos x dx = \sin x$$
$$\int \sec^2 x dx = \tan x$$
$$\int \csc^2 x dx = -\cot x$$
$$\int \sec x \tan x dx = \sec x$$
$$\int \csc x \cot x dx = -\csc x$$
$$\int \sec x dx = \ln |\sec x + \tan x|$$
$$\int \csc x dx = \ln |\csc x - \cot x|$$
$$\int \tan x dx = \ln |\sec x|$$
$$\int \cot x dx = \ln |\sin x|$$
$$\int \sinh x dx = \cosh x$$
$$\int \cosh x dx = \sinh x$$

### Important Limits
These are important limits to know and are good for the Ratio Test and the Root Test.

$$\lim_{n\rightarrow\infty}\frac{n+1}n=1$$
$$\lim_{n\rightarrow\infty}\frac{n}{n+1}=1$$
$$\lim_{n\rightarrow\infty}\Big(1+\frac1n\Big)^n=e$$

In the following, $k$ is a positive constant.

$$\lim_{n\rightarrow\infty}\sqrt[n]k=1$$
$$\lim_{n\rightarrow\infty}\sqrt[n]n=1$$
$$\lim_{n\rightarrow\infty}\sqrt[n]{n^k}=1$$

### Important Maclaurin Series and their Radii of Convergence
$$\frac1{1-x}=\sum_{n=0}^\infty x^n=1+x+x^2+x^3+... \qquad R=1$$
$$e^x=\sum_{n=0}^\infty \frac{x^n}{n!}=1+\frac{x}{1!}+\frac{x^2}{2!}+\frac{x^3}{3!}+... \qquad R=\infty$$
$$\sin x=\sum_{n=0}^\infty (-1)^n\frac{x^{2n+1}}{(2n+1)!}=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\frac{x^7}{7!}+... \qquad R=\infty$$
$$\cos x=\sum_{n=0}^\infty (-1)^n\frac{x^{2n}}{(2n)!}=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\frac{x^6}{6!}+... \qquad R=\infty$$
$$\tan^{-1} x=\sum_{n=0}^\infty (-1)^n\frac{x^{2n}}{(2n)}=x-\frac{x^3}{3}+\frac{x^5}{5}-\frac{x^7}{7}+... \qquad R=\infty$$
$$ln(1+x)=\sum_{n=1}^\infty (-1)^{n-1}\frac{x^{n}}n=x-\frac{x^2}{2}+\frac{x^3}{3}-\frac{x^4}{4}+... \qquad R=\infty$$
