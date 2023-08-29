+++
title = "Evaluating a Polynomial, Binary Representation, and Floating Point"
description = "My notes over Chapter 0 of Timothy Sauer's Numerical Analysis textbook. Some sentences and examples are straight from the book. All Python programs are mine. This chapter covers calculus and function evaluation, machine arithmetic, and sources of errors."
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
Below is code to see how long it takes each function to be called a million times: {{%sidenote%}}As we can see, it's actually over 4 times faster. This might have something to do with the speed of memory. I wouldn't think that memory speed would effect such a small calculation, but perhaps that is wrong.{{%/sidenote%}}

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



## Binary Number Representation
***

You might ask, why binary numbers? One of the reasons is for error correction and robustness. 
If the radiation from sunlight happen to change a digit the computer is storing, it is much easier to detect when we are dealing with 1s and 0s since there are only two options.

If computers used decimal or hexadecimal, there would be 10 or 16 possibilities, making error correction and detection magnitudes more difficult. Signal discrimination in a binary system is inherently more simple as the computer only needs to be able to differentiate between a "high" and "low" energy states instead of a range of 10 or 16.


### Converting Decimal to Binary

Let us have the number 53.7. To convert the integer part to binary, just divide 2 and keep track of the remainders until we get 0. The string of remainders from last to first is the binary representation.

```python
def dec_to_bin_int(dec: int) -> int:
    binary = ""
    while dec:
        binary += str(dec % 2)
        dec //= 2
    # return reverse order
    return binary[::-1]

print(dec_to_bin_int(53))
# > Out: 110101
```

As we can tell,

$$(53)_{10} = 2^5+2^4+2^2+1 = 32 + 16 + 4 + 1 = (110101)_2$$

The fractional part can be computed by reversing the preceding steps. Multiply by 2 successively and record the integer parts. We have:


<p class="text-center">\(.7 * 2 = .4 + 1\)<p>
<p class="text-center">\(.4 * 2 = .8 + 0\)<p>
<p class="text-center">\(.8 * 2 = .6 + 1\)<p>
<p class="text-center">\(.6 * 2 = .2 + 1\)<p>
<p class="text-center">\(.2 * 2 = .4 + 0\)<p>
<p class="text-center">\(.4 * 2 = .8 + 0\)<p>

We can see that the process repeats after four steps and will repeat indefinitely. Therefore, we have:

$$(0.7)_{10}=(.0\overline{0110})_2$$

<p>
<i>Note from Nathan:</i> You might be thinking, "Well how do I know whether it repeats or not? I'm sure that \((.00110)_2\) is a legitimate number." We know that something repeats for infinity if we always get a non-zero integer part. If we ever end up with \(.5 * 2 = 0 + 1\), then the number ends.
</p>


### Converting Binary to Decimal

<p>
We already saw how to convert the binary integer part to decimal. You take the sum of all \(2^i\) where i is the index of each 1s bit, ignoring the 0 bits.{{%sidenote%}} Index starts at 0 from least significant position to most significant{{%/sidenote%}} As we saw from before:
</p>

$$(110101)\_2 = 2^5+2^4+2^2+1 = 32 + 16 + 4 + 1 = (53)_{10}$$

<p>
We do something similar with fractions, but with \(2^{-i}\) with index starting at 1 and incrementing per binary digit:
</p>

$$(.1011)\_2 = 2^{-1}+2^{-3}+2^{-4} = \frac12 + \frac18 + \frac1{16} = \bigg(\frac{11}{16}\bigg)_{10}$$

We would be here forever if we did this with an infinitely repeating binary representation. To convert an infinitely repeating binary representation to decimal, we have to think outside the box. You can shift the repeating portion left until you have the repeating segment before and after the decimal. From there, you can subtract the original repeating part from the shifted number.

<p>
Suppose \(x=(.\overline{1011})_2\). We can bit shift it to the left to get \(2^4x=(1011.\overline{1011})_2\). {{%sidenote%}}We have \(2^4x\) since bit shifting to the left doubles it each time, and we shifted 4 times.{{%/sidenote%}} If we subtract \(x\) from \(2^4x\), we end up with \((2^4 - 1)x = (1011)_2\) and thus \(x = (\frac{11}{15})_{10}\).
</p>

