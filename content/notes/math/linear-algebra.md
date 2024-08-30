+++
title = "Linear Algebra"
description = "These are my notes over my review of Linear Algebra, going through Gilbert Strang's Introduction To Linear Algebra."
date = 2024-08-30T11:10:18-05:00
tags = ["Math Notes"]
+++

{{< toc >}}



## Introduction to Vectors
---

The core of linear algebra is vector addition and scalar multiplication. Combining these two operations gives us a set of linear combinations.

$$
c\mathbf{v} + d\mathbf{w} = 
c\begin{bmatrix} 
1 \\\
2 
\end{bmatrix} + 
d\begin{bmatrix} 
3 \\\
4 
\end{bmatrix} = 
\begin{bmatrix} 
c + 3d \\\
2c + 4d 
\end{bmatrix}.
$$

The vector $c\mathbf{v}$ lie along a line. If vector $\mathbf{w}$ is not on that line, the set of linear combinations $c\mathbf{v} + d\mathbf{w}$ fill the entire two-dimensional plane, because there is a linear combination that reaches every point.


<br>

### Vectors and Linear Combinations

1. $3\mathbf{v} + 5\mathbf{w}$ is an example linear combination $c\mathbf{v} + d\mathbf{w}$ of the vectors $\mathbf{v}$ and $\mathbf{w}$.

2. For $\mathbf{v} = \begin{bmatrix} 1 \\\ 1 \end{bmatrix}$ and $\mathbf{w} = \begin{bmatrix} 2 \\\ 3 \end{bmatrix}$, that combination is:

$$
3 \begin{bmatrix} 1 \\\ 1 \end{bmatrix} + 5 \begin{bmatrix} 2 \\\ 3 \end{bmatrix} = \begin{bmatrix} 3 + 10 \\\ 3 + 15 \end{bmatrix} = \begin{bmatrix} 13 \\\ 18 \end{bmatrix}.
$$

3. The vector $\begin{bmatrix} 2 \\\ 3 \end{bmatrix}$ goes across to $x = 2$ and up to $y = 3$ in the $xy$ plane.

4. The set of linear combinations $c \begin{bmatrix} 1 \\\ 1 \end{bmatrix} + d \begin{bmatrix} 2 \\\ 3 \end{bmatrix}$ fill the whole $xy$ plane. They produce every vector $\begin{bmatrix} x \\\ y \end{bmatrix}$.

5. The set of linear combinations $c \begin{bmatrix} 1 \\\ 1 \\\ 1 \end{bmatrix} + d \begin{bmatrix} 2 \\\ 3 \\\ 4 \end{bmatrix}$ fill a plane in $xyz$ space.

6. The set of equations, $c + 2d = 1$, $c + 3d = 0$, and $c + 4d = 0$, has no solution because its right side, $\begin{bmatrix} 1 \\\ 0 \\\ 0 \end{bmatrix}$, is not on that plane.


<br>

### Lengths and Dot Products

1. The **dot product** of $\mathbf{v} = \begin{bmatrix} 1 \\\ 2 \end{bmatrix}$ and $\mathbf{w} = \begin{bmatrix} 4 \\\ 5 \end{bmatrix}$ is:

$$
\mathbf{v} \cdot \mathbf{w} = (1)(4) + (2)(5) = 4 + 10 = 14.
$$

2. Two vectors $\mathbf{v}$ and $\mathbf{w}$ are perpendicular if their dot product $\mathbf{v}\cdot\mathbf{v}=0$.


3. The **length** $\||\mathbf{v}\||$ of a vector is  $\||\mathbf{v}\||=\sqrt{\mathbf{v} \cdot \mathbf{v}}$.

4. A **unit vector** $\mathbf{u}$ is a vector who's length equals one. A vector divided by it's length, $\mathbf{u} = \frac{\mathbf{v}}{\||\mathbf{v}\||}$, always has length $||\mathbf{u}||=1$ and thus is a unit vector with the same direction as $\mathbf{v}$.

5. The angle $\theta$ between $\mathbf{v}$ and $\mathbf{w}$ has $\cos \theta = \frac{\mathbf{v} \cdot \mathbf{w}}{\||\mathbf{v}\||\cdot \||\mathbf{w}\||}$. 

6. All angles have $|\cos \theta| \leq 1$. So, for all vectors $\mathbf{v}$ and $\mathbf{w}$:

$$
\|\mathbf{v} \cdot \mathbf{w}\| \leq \||\mathbf{v}\|| \cdot \||\mathbf{w}\||.
$$


<br>

### Matrices

1. $A = \begin{bmatrix} 1 & 2 \\\ 4 & 5 \\\ 6 & 7 \end{bmatrix}$ is a 3 by 2 matrix: $m = 3$ rows and $n = 2$ columns.

2. We have that $A \mathbf{x} = \begin{bmatrix} 1 & 2 \\\ 4 & 5 \\\ 6 & 7 \end{bmatrix} \begin{bmatrix} x_1 \\\ x_2 \end{bmatrix}$ is the set of linear combinations of the columns of $A$:

$$
A\mathbf{x} = x_1 \begin{bmatrix} 1 \\\ 4 \\\ 6 \end{bmatrix} + x_2 \begin{bmatrix} 2 \\\ 5 \\\ 7 \end{bmatrix}
$$

3. The 3 components of $A \mathbf{x}$ are dot products of the 3 rows of $A$ with the vector $\mathbf{x}$. Row by row:

$$
A\mathbf{x} = \begin{bmatrix} 1 & 2 \\\ 4 & 5 \\\ 6 & 7 \end{bmatrix} \begin{bmatrix} x_1 \\\ x_2 \end{bmatrix} = \begin{bmatrix} 1 \cdot x_1 + 2 \cdot x_2 \\\ 4 \cdot x_1 + 5 \cdot x_2 \\\ 6 \cdot x_1 + 7 \cdot x_2 \end{bmatrix}
$$


4. Equations in matrix form $A\mathbf{x} = \mathbf{b}$:

    $$
    \begin{bmatrix} 1 & 2 \\\ 4 & 5 \\\ 6 & 7 \end{bmatrix} \begin{bmatrix} x_1 \\\ x_2 \end{bmatrix} = \begin{bmatrix} b_1 \\\ b_2 \\\ b_3 \end{bmatrix}
    $$

    replaces:

    $$
    \begin{cases}
    1x_1 + 2x_2 = b_1 \\\
    4x_1 + 5x_2 = b_2 \\\
    6x_1 + 7x_2 = b_3
    \end{cases}
    $$

5. The solution to $A\mathbf{x} = \mathbf{b}$ can be written as $\mathbf{x} = A^{-1} \mathbf{b}$, if the inverse $A^{-1}$ exists. But not all matrices $A$ allow $A^{-1}$ to exist.

The output $\mathbf{b}$ is a linear combination of the columns in $A$ with elements in $\mathbf{x}$ acting as the coefficients. The matrix $A$ is called the "difference matrix" because $\mathbf{b}$  contains the differences of the input vector $\mathbf{x}$.



<br>

## Solving Linear Equations
---

For solving linear equations, we think of $\mathbf{b}$ as known and we look for $\mathbf{x}$.

1. The **column picture** of $A\mathbf{x} = \mathbf{b}$: A linear combination of $n$ columns of $A$ produces the vector $\mathbf{b}$.

2. This is a vector equation:

    $$
    A \mathbf{x} = x_1 \mathbf{a}_1 + \cdots + x_n \mathbf{a}_n = \mathbf{b},
    $$

    where the columns of $A$ are $\mathbf{a}_1, \mathbf{a}_2, \ldots, \mathbf{a}_n$.

3. When $\mathbf{b} = \mathbf{0}$, a linear combination $A\mathbf{x}$ of the columns of $A$ is zero. One possibility is the trivial solution $\mathbf{x} = (0, \ldots, 0)$.

4. The **row picture** of $A\mathbf{x} = \mathbf{b}$: $m$ equations from $m$ rows give $m$ planes in $n$-dimensional space meeting at $\mathbf{x}$.

5. A dot product gives the equation of each plane:

$$
\text{(row 1)} \cdot \mathbf{x} = b_1, \ldots, \text{(row m)} \cdot \mathbf{x} = b_m.
$$

6. When $\mathbf{b} = \mathbf{0}$, all the planes given by $(\text{row}_i) \cdot \mathbf{x} = 0$ pass through the origin, the center point $\mathbf{x} = (0, 0, \ldots, 0)$.

For the row picture, we want to find the point where each equation from each row meets. These points are the solution $\mathbf{x}$.

For the column picture, we want to figure out the coefficients of the column vectors which equals $\mathbf{b}$. These coefficients are the solution $\mathbf{x}$.


<br>

### The Idea of Elimination

1. For $m = n = 3$, there are three equations $A\mathbf{x} = \mathbf{b}$ and three unknowns $x_1, x_2, x_3$.

2. The first two equations are:

$$
a_{11}x_1 + a_{12}x_2 + a_{13}x_3 = b_1 \quad \text{and} \quad a_{21}x_1 + a_{22}x_2 + a_{23}x_3 = b_2
$$

3. Multiply the first equation by $\frac{a_{21}}{a_{11}}$ and subtract it from the second equation to eliminate $x_1$.

4. The corner entry $a_{11}$ is the first "pivot," and the ratio $\frac{a_{21}}{a_{11}}$ is the first "multiplier."

5. Eliminate $x_1$ from every remaining equation $i$ by subtracting $\frac{a_{i1}}{a_{11}}$ times the first equation.

6. Now, the last $n - 1$ equations contain $n - 1$ unknowns $x_2, \ldots, x_n$. Repeat the process to eliminate $x_2$.

7. Elimination breaks down if a zero appears in the pivot position. Exchanging two equations (rows) may save it. If not, $A\mathbf{x} = \mathbf{b}$ has either no solution or infinitely many.

A linear system $A\mathbf{x} = \mathbf{b}$ becomes upper triangular $U\mathbf{x} = \mathbf{c}$ after elimination.
The upper triangular system $U\mathbf{x} = \mathbf{c}$ is solved by back substitution (starting at the bottom).


<br>

### Elimination Using Matrices

1. The first step multiplies the equations $A\mathbf{x} = \mathbf{b}$ by a matrix $E_{21}$ to produce $E_{21}A\mathbf{x} = E_{21}\mathbf{b}$.

2. The matrix $E_{21}A$ has a zero in row 2, column 1 because $x_1$ is eliminated from equation 2.

3. $E_{21}$ is the identity matrix (diagonal of 1's) minus the multiplier $\frac{a_{21}}{a_{11}}$ in row 2, column 1.

4. Matrix-matrix multiplication is $n$ matrix-vector multiplications: $EA = [E\mathbf{a}_1 \; \ldots \; E\mathbf{a}_n]$.

5. We also multiply $E\mathbf{b}$. So $E$ is multiplying the augmented matrix $[A \; \mathbf{b}] = [\mathbf{a}_1 \; \ldots \; \mathbf{a}_n \; \mathbf{b}].$

6. Elimination multiplies $A\mathbf{x} = \mathbf{b}$ by $E_{21}, E_{31}, \ldots, E_{n1}$, then $E_{32}, E_{42}, \ldots, E_{n2}$, and onward.

7. We use a permutation matrix $P_{ij}$ if there is a zero in the pivot position. To find $P_{ij}$, exchange rows $i$ and $j$ of the identity matrix $I$.

The matrices $E_{ij}$ are "elimination matrices". They execute the elimination steps. They can combine into one matrix $E$ that takes all the steps at once.


<br>

### Rules for Matrix Operations

1. Matrices $A$ with $n$ columns multiply matrices $B$ with $n$ rows: $A_{m \times n} \, B_{n \times p} = C_{m \times p}$.

2. Each entry in $AB = C$ is a dot product: $C_{ij} = (\text{row } i \text{ of } A) \cdot (\text{column } j \text{ of } B)$.

3. Multiplication is associative: $(AB)C = A(BC)$.

4. Multiplication is not commutative: $AB \neq BA$ (generally).

5. Distributive law from the left and right:

$$A(B + C) = AB + AC  \quad \text{and} \quad   (A + B)C = AC + BC$$

6. Matrices can be multiplied by blocks: $A = [A_1 \; A_2]$ times $B = \begin{bmatrix} B_1 \\\ B_2 \end{bmatrix}$ is $A_1B_1 + A_2B_2$.


<br>

### Inverse Matrices

1. If the square matrix $A$ has an inverse, then both $A^{-1}A = I$ and $AA^{-1} = I$.

2. The algorithm to test invertibility is elimination: $A$ must have $n$ (nonzero) pivots.

3. The algebraic test for invertibility is the determinant of $A$: $\det(A) \neq 0$.

4. The equation that tests for invertibility is $A\mathbf{x} = 0$: $\mathbf{x} = 0$ must be the only solution.

5. If $A$ and $B$ (of the same size) are invertible, then so is $AB$: $(AB)^{-1} = B^{-1}A^{-1}$.

6. $AA^{-1} = I$ represents $n$ equations for $n$ columns of $A^{-1}$. Gauss-Jordan elimination reduces $[A \; I]$ to $[I \; A^{-1}]$.


<br>

### Elimination = Factorization: $\mathbf{A = LU}$

1. Each elimination step $E_{ij}$ is inverted by $L_{ij}$. Off the main diagonal, change $-e_{ij}$ to $+e_{ij}$.

2. The whole forward elimination process (with no row exchanges) is inverted by $L$:

$$
L = (L_{21}L_{31}\cdots L_{n1})(L_{32} \cdots L_{n2})(L_{43}\cdots L_{n3})\cdots (L_{nn-1}).
$$

3. That product matrix $L$ is still lower triangular. Every multiplier $e_{ij}$ is in row $i$, column $j$.

4. The original matrix $A$ is recovered from $U$ by $A = LU$.

5. Elimination on $A\mathbf{x} = \mathbf{b}$ reaches $U\mathbf{x} = \mathbf{c}$. Then back-substitution solves $U\mathbf{x} = \mathbf{c}$.

6. Solving a triangular system takes $n^2/2$ multiply-subtract operations. Elimination to find $U$ takes $n^3/3$ operations.

While doing Gaussian elimination to solve $A\mathbf{x} = \mathbf{b}$, we find $U\mathbf{x} = \mathbf{c}$, where $U=EA$ and $\mathbf{c}=E\mathbf{b}$. $E$ is the elimination matrix we get from the calculation.

We already have $E$ and the inverse $E^{-1}=L$ has the property that it is easy to calculate by changing the sign of each non-diagonal entree of $E$. If we multiply both sides of $EA\mathbf{x} = E\mathbf{b}$ with $L$, we get the following:

$$LEA\mathbf{x} = LE\mathbf{b} \\\ LU\mathbf{x} = \mathbf{b} \\\ L\mathbf{c} = \mathbf{b}$$

Thus, for future inputs of $A\mathbf{x} = \mathbf{b}$, since we know $L$, we can solve via forward elimination on $L\mathbf{c} = \mathbf{b}$ and then backwards substitution on $U\mathbf{x} = \mathbf{c}$, which is quadratic in time instead of cubic.

Note: We also have $A=LDU$ where the diagonal of $U$ has been set to 1 and factored out into it's own diagonal matrix $D$.


<br>

### Transposes and Permutations

1. The transposes of $A\mathbf{x}$, $AB$, and $A^{-1}$ are $\mathbf{x}^T A^T$, $B^T A^T$, and $(A^T)^{-1}$, respectively.

2. The dot product (inner product) is $\mathbf{x} \cdot \mathbf{y} = \mathbf{x}^T \mathbf{y}$. This is a $(1 \times n)(n \times 1) =$ scalar value.  
   The outer product is $\mathbf{x} \mathbf{y}^T = (n \times 1)(1 \times n) = n \times n$ matrix.

3. The idea behind $A^T$ is that $A\mathbf{x} \cdot \mathbf{y}=\mathbf{x} \cdot A^T\mathbf{y}$ because $(A\mathbf{x})^T\mathbf{y} = \mathbf{x}^T A^T \mathbf{y} = \mathbf{x}^T (A^T \mathbf{y})$.

4. A symmetric matrix has $S^T = S$ (and the product $A^T A$ is always symmetric).

5. An orthogonal matrix has $Q^T = Q^{-1}$. The columns of $Q$ are orthogonal unit vectors.

6. A permutation matrix $P$ has the same rows as the identity matrix $I$ (in any order). There are $n!$ different orders.

7. Then $P\mathbf{x}$ puts the components $x_1, x_2, \ldots, x_n$ in that new order. And $P^T = P^{-1}$.

The inverse of a symmetric matrix is also symmetric. A symmetric matrix's $LDU$ factorization is also symmetric: $S=LDL^T$.

If $A$ is invertible then a permutation $P$ will reorder its rows for $PA=LU$.



<br>

## Vector Spaces
---




<br>

## Orthogonality
---




<br>

## Determinants
---




<br>

## Eigenvalues and Eigenvectors
---




<br>

## The Singular Value Decomposition (SVD)
---

