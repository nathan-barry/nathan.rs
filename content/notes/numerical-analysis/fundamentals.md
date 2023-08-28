+++
title = "0. Fundamentals"
description = "This chapter covers calculus and function evaluation, machine arithmetic, and sources of errors."
date = 2023-08-26
notes = ["Numerical Analysis"]
+++

{{< toc >}}

## Evaluating a Polynomial
***
The most fundamental operations of arithmetic are addition and multiplication. These operations are also what are needed to evaluate a polynomial `P(x)` at a particular value `x`. Polynomials are the basic building blocks for many computational techniques.

<p>
What is the best way to evaluate the following polynomial at \( x=\frac{1}{2} \):
</p>

$$P(x) = 2x^4 + 3x^3 - 3x^2 + 5x - 1$$

We have the simple and straightforward method of plugging and chugging:

$$P\bigg(\frac12\bigg) = 2*\frac12*\frac12*\frac12*\frac12 + 3*\frac12*\frac12*\frac12 - 3*\frac12*\frac12 + 5*\frac12 - 1 = \frac54$$

As seen in Python:

```python
def eval_polynomial(coefficients: list[int], x: int) -> int:
    output = 0
    for i, c in enumerate(coefficients):
        # multiplies coefficient by x "degree" times, returns sum
        degree = len(coefficients) - 1 - i
        for _ in range(degree):
            c *= x
        output += c
    return output

# Solves 2x^4 + 3x^3 - 3x^2 + 5x - 1 where x=1/2
print(eval_polynomial([2, 3, -3, 5, -1], 1/2))

# > Out: 1.25
```

<p>
This method requires 10 multiplications and 4 additions (with two actually being subtractions). We can see that effort is being duplicated, which gives the idea of the next method. We can cache each power of \(\frac12\) to compute the next without unnecessarily recomputing the previous power each time. For instance, we can use the calculation \((\frac12)^2 = \frac12*\frac12\) to compute the next: \((\frac12)^3 = \frac12*(\frac12)^2\). We then get:
</p>

$$P\bigg(\frac12\bigg) = 2*\bigg(\frac12\bigg)^4 + 3*\bigg(\frac12\bigg)^3 - 3*\bigg(\frac12\bigg)^2 + 5*\frac12 - 1 = \frac54$$

We go from a total of 14 operations to 11. But is this the best we can do?

### Nested Multiplication

<p>
We can rewrite the polynomial so that it can be evaluated from the inside out. Believe it or not, this is equivalent to our original polynomial and also evaluates to \(\frac54\).
</p>

$$P(x) = -1 + x*(5+x*(-3+x*(3+x*2)))$$

Here the polynomial is written backwards, and the powers of \(x\) are factored out of the rest of the polynomial. This method is called **nested multiplication** or **Horner's method**. It evaluates the polynomial in 4 multiplications and 4 additions for a total of 8 operations.

As shown in code:

```python
def nested_polynomial(coefficients: list[int], x: int) -> int:
    output = 0
    last = coefficients.pop()
    for c in coefficients:
        output = x*(c + output)
    return output + last

# Solves 2x^4 + 3x^3 - 3x^2 + 5x - 1 where x=1/2
print(nested_polynomial([2, 3, -3, 5, -1], 1/2))

# > Out: 1.25
```

The above code has an additional add operation since we add 0 to the first coefficient at the start (makes the code nicer).
Below is code to see how long it takes each function to be called a million times:

```python
import time

# Time eval_polynomial
start_1 = time.time()
for _ in range(1000000):
    eval_polynomial([2, 3, -3, 5, -1], 1/2)
print("eval_polynomial", time.time() - start_1, "seconds")

# Time nested_polynomial
start_2 = time.time()
for _ in range(1000000):
    nested_polynomial([2, 3, -3, 5, -1], 1/2)
print("nested_polynomial", time.time() - start_2, "seconds")

# > Out: eval_polynomial 1.1520037651062012 seconds
# > Out: nested_polynomial 0.25635194778442383 seconds
```

As we can see, it's actually over 4 times faster. This might be because of the speed of memory. I wouldn't think that memory speed would effect such a small calculation, but perhaps that is wrong.


