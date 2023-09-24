+++
title = "Vector Convolutions, Polynomial Multiplication, & Fast Fourier Transforms"
description = ""
date = 2023-09-18T15:00:50-05:00
tags = ["Algorithms Notes"]
priority = 6
+++

{{< toc >}}



## Vector Convolution
***

**Definition:** Convolution is a mathematical operation on two vectors (or functions) that produces a third vector which represents how the shape of one is modified by the other.

1. **Vectors:** Let's say you have two vectors:
   - $ u = (u_0, u_1, ..., u_{m-1}) $ of length $ m $
   - $ v = (v_0, v_1, ..., v_{n-1}) $ of length $ n $

2. **Convolution Operation:** The convolution of $ u $ and $ v $, denoted as $ u * v $, is a new vector of length $ m + n - 1 $. The component at position $ k $ (where $ 0 \leq k < m + n - 1 $) is calculated by:
   $$
   \sum_{(s,t) \in \{0,...,m-1\} \times \{0,...,n-1\} : s+t=k} u_s v_t
   $$

3. **Applications:** Convolution has numerous practical applications, especially in signal processing, image processing, and solving differential equations.

4. **Connection to Polynomial Multiplication:** One of the key applications of convolution is in polynomial multiplication. When you multiply two polynomials, the coefficients of the resulting polynomial can be found using convolution.


### Connection to Polynomial Multiplication

1. **Polynomials:** Consider two polynomials:
   - $ A(x) = \sum_{0 \leq k < n} a_k x^k $
   - $ B(x) = \sum_{0 \leq k < n} b_k x^k $

2. **Product of Polynomials:** The product of $ A(x) $ and $ B(x) $ is another polynomial $ C(x) $ of the form:
   $$
   C(x) = \sum_{0 \leq k < 2n-1} c_k x^k
   $$
   where $ c_k $ is given by:
   $$
   c_k = \sum_{s,t \in \{0,...,n-1\} : s+t=k} a_s b_t
   $$
   This $ c_k $ is essentially the $ k^{th} $ component of the convolution of vectors $ a $ and $ b $.

3. **Implication:** The process of computing the coefficients of $ C(x) $ is equivalent to computing the convolution of vectors $ a $ and $ b $.




## Unique Interpolating Polynomial
***

**Theorem:** Given $ n + 1 $ data points $ (x_0, y_0), (x_1, y_1), ..., (x_n, y_n) $ where the $ x_k $'s are distinct, there exists a unique polynomial $ p(x) $ of degree at most $ n $ such that $ p(x_k) = y_k $ for all $ 0 \leq k \leq n $.

**Existence:** An interpolating polynomial of degree at most $ n $ can be represented as:
   $$
   \sum_{0 \leq s \leq n} \left( \prod_{0 \leq t \leq n, t \neq s} \frac{x - x_t}{x_s - x_t} \right) y_s
   $$
This formula gives the polynomial that passes through the given data points.

**Uniqueness:** Using the fundamental theorem of algebra {{%sidenote%}}
**Fundamental Theorem of Algebra:** Every non-zero, degree-$ n $ polynomial with complex coefficients has, when counted with multiplicity, exactly $ n $ complex roots.
In other words, even if the polynomial doesn't have real roots, it will have complex roots.
{{%/sidenote%}}, we can establish that this polynomial is unique. If there were two different polynomials passing through the same set of points, their difference would have more than $ n $ roots, contradicting the theorem.

### A “Point-Based” Representation of a Polynomial

**Definition:** Instead of representing a polynomial by its coefficients, we can represent it by a set of distinct points through which it passes.

1. **Standard Representation:** The typical way to represent a polynomial $ p(x) $ of degree $ n $ is by specifying its coefficients. For example, $ p(x) = a_0 + a_1x + a_2x^2 + ... + a_nx^n $.

2. **Point-Based Representation:** Instead of coefficients, we can represent $ p(x) $ by specifying $ n + 1 $ distinct points $ (x_0, y_0), (x_1, y_1), ..., (x_n, y_n) $ where $ y_k = p(x_k) $.

3. **Uniqueness:** By the theorem of the unique interpolating polynomial, $ p(x) $ is the only polynomial that passes through these $ n + 1 $ points.

4. **Flexibility:** There are multiple point-based representations for a polynomial since we can choose different sets of $ x_k $'s.


## Polynomial Multiplication: The Meat and Potatoes
***

**Concept:** To multiply two polynomials, we can use their point-based representations.

This is the main point of this post.{{%sidenote%}}**This point is critical.** Everything in this post is about efficiently solving Polynomial Multiplication, which is the same as Vector Convolutions, in $O(n\log n)$ time.{{%/sidenote%}} Vector Convolution is essentially the same thing as Polynomial Multiplication. We saw above a way to do it in $O(n^2)$ time, but we can do it in $O(n \log n)$ time. Everything beyond this section are all components to solving this problem.

**Steps:**
- **Selection:** Choose a set $ S $ of at least $ 2n - 1 $ distinct values.
- **Evaluation:** Evaluate polynomials $ A(x) $ and $ B(x) $ at all values in $ S $ to get their point-based representations.
- **Multiplication:** For each $ x $ in $ S $, compute $ C(x) = A(x) \times B(x) $ to get a point-based representation of $ C(x) $.
- **Recovery:** Obtain the coefficients of $ C(x) $ using polynomial interpolation.



## Polynomial Evaluation: A Tool
***

**Goal:** Efficiently evaluate a polynomial at multiple points and interpolate to find its coefficients.

- **Horner’s Rule:** A method to evaluate a polynomial at a single point using $ \Theta(n) $ operations.

- **Efficiency Question:** Do we need $ \Theta(n^2) $ operations to evaluate the polynomial at $ 2n - 1 $ points? The answer is no; we can be more efficient.

- **Complex Numbers:** To achieve this efficiency, we'll delve into some properties of complex numbers.

Now what I'm about to say is critical. The reason why we care about polynomial evaluation is because we can evaluate $2n-1$ points. This number comes from the number of terms in polynomial $C(x)$, which is the product of $A(x)$ and $B(x)$ which we are just acting like they both have $n$ terms (and thus require $n$ points to evaluate each).

Polynomial multiplication normally takes $O(n^2)$ time. We can evaluate at $2n-1$ points to get a Point Set representation of the polynomials $A(x)$ and $B(x)$ in $O(n\log n)$ time and can then get $C(x)$ in linear time.

Below all explains how to evaluate $2n-1$ points in $O(n\log n)$ time.

### Euler’s Formula

**Theorem:** For any real number $ \theta $, 
$$ e^{i\theta} = \cos \theta + i \sin \theta $$

1. **Implication:** The complex number $ e^{i\theta} $ lies on the unit circle in the complex plane. Its position is determined by an angle $ \theta $ (measured counterclockwise) from the positive real axis.

2. **Maclaurin Series:** Euler's formula can be derived using the Maclaurin series for $ e^x $, $ \cos x $, and $ \sin x $:
   - $ e^x = \sum_{k \geq 0} \frac{1}{k!} x^k $
   - $ \cos x = \sum_{k \geq 0} \frac{(-1)^k}{(2k)!} x^{2k} $
   - $ \sin x = \sum_{k \geq 0} \frac{(-1)^k}{(2k + 1)!} x^{2k+1} $

### Complex Roots of Unity

**Definition:** The complex roots of unity are the solutions to the equation $x^N = 1$, where $N$ is a positive integer.

1. **Roots Representation:** For any positive integer $N$, let $\omega_N$ be defined as $ e^{2\pi ik/N} $. The set $S_N$ contains $N$ complex numbers defined as $\\{ \omega_N^k | 0 \leq k < N \\}$.

2. **Position on Complex Plane:** Any integer power $k$ of $\omega_N$ lies on the unit circle in the complex plane. Its position is determined by an angle $2\pi k/N$ from the positive real axis.

3. **Roots of Polynomial:** Every element in $S_N$ is a root of the polynomial $x^N - 1$. By the fundamental theorem of algebra, the set of all complex roots of $x^N - 1$ is precisely $S_N$.


**Lemma 1:** For any integer $k$ that isn't a multiple of $N$, $\omega_N^k$ is a root of the polynomial $\sum_{0 \leq s < N} x^s$.

**Proof:** We know that $x^N - 1 = (x - 1) \sum_{0 \leq s < N} x^s$.{{%sidenote%}}We know this since $x^N-1$ is a geometric series.{{%/sidenote%}} Since $\omega_N^k$ is a root of $x^N - 1$ and not a root of $x - 1$, it must be a root of the polynomial $\sum_{0 \leq s < N} x^s$.

### Fast Polynomial Evaluation

**Goal:** Efficiently evaluate a polynomial at multiple points.

1. **Polynomial Representation:** Let $A(x) = \sum_{0 \leq k < n} a_k x^k$, where $n$ is a power of 2.

2. **Divide and Conquer Approach:** We can split $A(x)$ into even and odd parts:
   - $A_{even}(x) = a_0 + a_2x + a_4x^2 + ... + a_{n-2}x^{(n/2)-1}$
   - $A_{odd}(x) = a_1 + a_3x + a_5x^2 + ... + a_{n-1}x^{(n/2)-1}$

3. **Relationship:** $A(x) = A_{even}(x^2) + xA_{odd}(x^2)$.

4. **Observation:** The set $\\{x^2 | x \in S_{2n}\\}$ is equal to $S_n$.

5. **Recursive Algorithm:** Using the above relationship and observation, we can recursively evaluate $A(x)$ at every element of $S_{2n}$.

6. **Efficiency:** The algorithm's efficiency is similar to Mergesort, resulting in an $O(n \log n)$ time complexity.



## Polynomial Interpolation: A Tool
***

**Definition:** Polynomial interpolation is the process of determining a polynomial that fits a given set of points.

1. **Goal:** We want to find the coefficients of a polynomial $ C(x) = \sum_{0 \leq s < 2n} c_s x^s $ given its values at each element of $ S_{2n} $.

2. **Remark:** In the context of fast polynomial multiplication, we know that $ c_{2n-1} = 0 $ because $ C(x) $ has a degree of at most $ 2n - 2 $.

3. **New Polynomial:** Let $ D(x) $ be the polynomial defined as $ D(x) = \sum_{0 \leq s < 2n} C(\omega_s^{2n})x^s $.

**Lemma 2:** For any integer $ k $ such that $ 1 \leq k \leq 2n $, $ D(\omega_k^{2n}) = 2nc_{2n-k} $.{{%sidenote%}}Basically, evaluating a polynomial $D(x)$ at the roots of unity (where the coefficients of $D(x)$ are the output of $C(x)$ at the roots of unity which is already calculated from the point-based representation) we get a coefficient of $C(x)$ back.{{%/sidenote%}}

#### Proof of Lemma 2

1. **Starting Point:** For any $ k $ in the range $ 1 \leq k \leq 2n $, we can express $ D(\omega_k^{2n}) $ as:
$$ D(\omega_k^{2n}) = \sum_{0 \leq s < 2n} C(\omega_s^{2n})\omega_k^s{2n} $$

2. **Expanding $ C(x) $:** We can expand $ C(x) $ in terms of its coefficients:
$$ D(\omega_k^{2n}) = \sum_{0 \leq s < 2n} \left( \sum_{0 \leq t < 2n} c_t \omega_t^s{2n} \right) \omega_k^s{2n} $$

3. **Rearranging the Sum:** By changing the order of summation:
$$ D(\omega_k^{2n}) = \sum_{0 \leq t < 2n} c_t \sum_{0 \leq s < 2n} (\omega_{k+t}^{2n})^s $$

**Case Analysis:** For the inner sum, there are two cases:
- When $ t = 2n - k $, each term in the inner sum is 1, making the inner sum equal to $ 2n $.
- If $ t $ is in the set $ \{0, ..., 2n - 1\} \setminus \{2n - k\} $, then $ k + t $ isn't a multiple of $ 2n $. By Lemma 1, $ \omega_{k+t}^{2n} $ is a root of the polynomial $ \sum_{0 \leq s < 2n} x^s $. This makes the inner sum zero.

### Fast Polynomial Interpolation

1. **Evaluation:** As previously discussed, we can evaluate $ D(x) $ for every element of $ S_{2n} $ in $ O(n \log n) $ time.

2. **Using Lemma 2:** Since $ \omega_{2n}^{2n} = \omega_0^{2n} = 1 $, we can find $ D(\omega_k^{2n}) $ for all $ k $ in the range $ 1 \leq k \leq 2n $. Using Lemma 2, these $ 2n $ values allow us to determine all coefficients of $ C(x) $ in $ O(n) $ time.

Alright, let's provide a detailed and intuitive summary of the concepts presented:



## Fast Polynomial Multiplication: Summary
***

**Objective:** Multiply two polynomials $ A(x) $ and $ B(x) $ efficiently.

1. **Polynomials:** Let $ A(x) $ and $ B(x) $ be two polynomials with degrees less than $ n $. For simplicity, assume $ n $ is a power of 2.

2. **Resultant Polynomial:** The product $ C(x) = A(x) \cdot B(x) $.

3. **Efficiency:** The coefficients of $ C(x) $ can be computed in $ O(n \log n) $ time.

4. **Key Ingredient:** An efficient subroutine that evaluates $ A(x) $ and $ B(x) $ at all $ x $ in $ S_{2n} $ in $ O(n \log n) $ time.

5. **Additional Computations:** In $ O(n) $ time, we can compute $ C(x) $ at all $ x $ in $ S_{2n} $.

6. **Recovery:** The polynomial evaluation subroutine can be reused to retrieve the coefficients of $ C(x) $ in $ O(n \log n) $ time.

### The Discrete Fourier Transform (DFT)

**Definition:** The DFT transforms a sequence of complex numbers into another sequence of complex numbers, providing frequency domain representation.

1. **Transformation:** The DFT maps a vector $ a = (a_0, ..., a_{N-1}) $ of complex numbers to the vector $ (A(\omega_0^N), ..., A(\omega_{N-1}^N)) $, where $ A(x) = \sum_{0 \leq k < N} a_k x^k $.

2. **Efficiency:** For $ N $ being a power of 2, the DFT of such a vector can be computed in $ O(N \log N) $ time using a recursive approach.

3. **Fast Fourier Transform (FFT):** This efficient algorithm for computing the DFT is known as the FFT.

4. **Generalization:** While our focus has been on cases where $ N $ is a power of 2, the FFT can be generalized to handle any $ N $ efficiently.

**In Layman's Terms:** Imagine you have two large numbers, and you want to multiply them. Instead of multiplying them directly, you transform these numbers into a different representation (like changing a song into its frequency components). In this new representation, multiplication becomes easier. After multiplying, you transform the result back to get your answer. This is the essence of the FFT when applied to polynomial multiplication.
