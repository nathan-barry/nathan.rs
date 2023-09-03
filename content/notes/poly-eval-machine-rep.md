+++
title = "Polynomial Evaluation & Machine Representation"
description = "My notes over Chapter 0 of Timothy Sauer's Numerical Analysis textbook. Some sentences and examples are straight from the book. All Python programs are mine. This chapter covers calculus and function evaluation, machine arithmetic, and sources of errors."
date = 2023-08-26
tags = ["Numerical Analysis"]
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



## Floating Point Representation
***
Floating point numbers are based on the IEEE 754 floating point standard. This standard uses scientific notation to represent real numbers. It consists of three parts: the sign (+ or -), the mantissa (significant bits), and the exponent.

$$\pm1.bbb...\times2^p$$

We have different commonly used levels of precision for floating point number: single and double. Each uses a different number of bits for the exponent and mantissa, allowing for more accuracy.

|precision|sign|exponent|mantissa|total|
|---|---|---|---|---|
|single|1|8|23|32|
|double|1|11|52|64|

As we can see from above, a single precision float can only keep track of the first 24 significant digits. {{%sidenote%}}The IEEE 754 standard automatically sets the integer part to 1, so 1 + 23 (of our decimal digits) gives us 24{{%/sidenote%}} That means that in calculations, anything beyond that won't be accounted for. The digits are either chopped off (truncated) or rounded.

> Although we would hope that small errors made during a long calculation have only a minor effect on the answer, this turns out to be wishful thinking in many cases. Simple algorithms, such as Gaussian eliminations or methods for solving differential equations, can magnify microscopic errors to macroscopic size.


A good example of cascading errors is probability. Probability is typically represented in the range [0, 1] with 0 being impossible and 1 being guaranteed. Multiplying small numbers gives us even smaller numbers, and if we get a number small enough to where the precision can't account for it, it will get rounded to 0.

This is called  an underflow. Any future multiplications with this number will zero everything out, leaving us with a botched calculation.

Likewise, if we get a number too big, we can get an overflow. Most floating point implementations will convert the number into a `+Inf` value. Special values are explained further below.

Another hiccup with floating point representation is that it can't perfectly represent every number. The Rust documentation for `f32` puts it well: 

> Being able to represent this wide range of numbers comes at the cost of precision: floats can only represent some of the real numbers and calculation with floats round to a nearby representable number. For example, `5.0` and `1.0` can be exactly represented as `f32`, but `1.0 / 5.0` results in `0.20000000298023223876953125` since `0.2` cannot be exactly represented as `f32`.


<p>
We lose information from chopping, rounding, and slightly incorrect representations. Let \(x_c\) be a computed version of the actual quantity \(x\). Then we have the following two errors:
</p>

$$\textnormal{absolute} = |x_c - x|\quad\quad\quad\textnormal{relative} = \frac{|x_c - x|}{|x|}$$

For the first week of my Numerical Analysis class, a hilarious Chinese PhD student taught the class since the professor was at a conference. He explained it like this:

> If your paycheck was off by a thousand dollars, that wouldn't matter too much if you were a millionaire. If you are a PhD student however, with a monthly paycheck of $3,000, that is a matter of life and death.

Relative error tends to give us more information because we know how much the value is off relative to the original value. The nominal absolute value alone might mean a lot or very little; we cannot tell without context.



### Machine Representation
Below we have the number 1 represented in double precision:

$$+1.0000000000000000000000000000000000000000000000000000\times2^0$$

<p>
The next floating point number the machine can represent, \(1+2^{-52}\), is:
</p>

$$+1.0000000000000000000000000000000000000000000000000001\times2^0$$

<p>
This \(2^{-52}\) value is known as the machine epsilon, denoted by \(\epsilon_{mach}\). It is the distance btween 1 and the smallest floating point number greater than 1.
</p>

Let us look at the floating point representation of 1 again. The actual machine number form is:

$$0\quad01111111111\quad0000000000000000000000000000000000000000000000000000$$

The first digit is represents the sign, with 0 meaning positive. The next 11 represents the exponent. You might ask, "Isn't the exponent 0 supposed to be 0?" With floating point representations, we subtracts half of the maximum value (called a bias) to allow us to mimic negative exponent values.

<p>
For instance, our exponent covers the range from \([0,2^{11}-1]\). We subtract \(2^{10}\) so that we can treat it as the range \([-2^{10}, 2^{10}-1]\). Because we're subtract \(2^{10}\), our zero representation must be \(2^{10}\).
</p>

The mantissa consists of all 0s because the IEEE 754 format automatically puts a 1 at the front (as it must always be a 1, making it redundant to store it), saving us a bit.

Below is the machine representation of 1 but in hexadecimal instead of binary. Notice how it is 16 bytes.

$$7F\quad F0\quad00\quad00\quad00\quad00\quad00\quad00$$

The IEEE 754 standard includes special values like `+Inf`, `-Inf`, `NaN`, and subnormal numbers (values between 0 and the smallest positive normalized floating-point number), including 0.

These special values use special mantissa and exponential values. For an example, `+Inf` and `-Inf` both have every bit in the exponent set to 1 while the mantissa is zeroed out.

In the other case where the exponent is zeroed out, the left most bit is no longer assumed to be one and we get subnormal floating point numbers.
