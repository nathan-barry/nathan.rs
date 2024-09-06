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

### Elimination = Factorization: A = LU

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

Vector spaces and their subspaces is the next level of understanding.

1. The standard $n$-dimensional space $\mathbb{R}^n$ contains all real column vectors with $n$ elements.

2. If $\mathbf{v}$ and $\mathbf{w}$ are in a vector space $S$, every combination $c\mathbf{v} + d\mathbf{w}$ must also be in $S$.

3. The "vectors" in $S$ can be matrices or functions of $x$. The 1-point space $Z$ consists of $\{x = 0\}$.

4. A subspace of $\mathbb{R}^n$ is a vector space inside $\mathbb{R}^n$. Example: The line $y = 3x$ inside $\mathbb{R}^2$.

5. The column space of $A$ contains all combinations of the columns of $A$: a subspace of $\mathbb{R}^m$.

6. The column space contains all the vectors $A\mathbf{x}$. So $A\mathbf{x} = \mathbf{b}$ is solvable when $\mathbf{b}$ is in $C(A)$.

A real vector space is a set of vectors together with rules for vector addition and for scalar multiplication. Those operations must also produce vectors that are in the space. Some vector spaces other than $\mathbb{R}^n$ are the vector space fo all real 2x2 matrices, the vector space of all real functions $f(x)$, and the vector space $\mathbb{Z}$ that contains only a zero vector.

We can add any vectors in $\mathbb{R}^n$, and we can multiply any vector $\mathbf{v}$ by scalar $c$. These operations are closed under $\mathbb{R}^n$. A subspace containing $\mathbf{v}$ and $\mathbf{w}$ must contain all linear combinations $c\mathbf{v} + d\mathbf{w}$ (and thus must contain the zero vector for $c, d = 0$).

**Definition:** The **column space** consists of **all linear combinations of the columns**. The set of linear combinations are all possible bectors $A\mathbf{x}$. They fill the column space $C(A)$.

To solve $A\mathbf{x}=\mathbf{b}$ is to express $\mathbf{b}$ as a linear combination of the columns. The system $A\mathbf{x}=\mathbf{b}$ is solvable if and only if $\mathbf{b}$ is in the column space of $A$.


<br>

### The Nullspace of A: Solving Ax = 0 and Rx = 0

For an $m\times n$ matrix (as in $m$ rows and $n$ columns):

1. The nullspace $N(A)$ in $\mathbb{R}^n$ contains all solutions $\mathbf{x}$ to $A\mathbf{x} = 0$. This includes $\mathbf{x} = \mathbf{0}$.

2. Elimination (from $A$ to $U$ to $R$) does not change the nullspace: $N(A) = N(U) = N(R)$.

3. The reduced row echelon form $R = \text{rref}(A)$ has all pivots = 1, with zeros above and below each pivot.

4. If column $j$ of $R$ is free (no pivot), there is a "special solution" to $A\mathbf{x} = 0$ with $x_j = 1$ and other free variables adjusted accordingly.

5. Number of pivots = number of nonzero rows in $\text{rref}(A) = \text{rank}(A) = r$. There are $n - r$ free columns.
 
6. The true size of a matrix $A$ is given by its **rank**. The rank is the *dimension* of the *column space* and of the *row space*. $n-r$ is the dimension of the *nullspace*.

7. Every matrix with $m < n$ (more column than rows) has nonzero solutions to $A\mathbf{x} = 0$ in its nullspace.

The solution vectors $\mathbf{x}$ have $n$ elements and are vectors in $\mathbb{R}^n$, thus the nullspace is a subspace of $\mathbb{R}^n$. The column space $C(A)$ is a subspace of $\mathbb{R}^m$ since it is the span of all of the columns in $A$, each with $m$ elements.



All vectors $\mathbf{x}$ in the nullspace must be orthogonal to all row vectors $\mathbf{v}$ in the row space. This is vacuously because the dot product $\mathbf{x}_i \cdot \mathbf{v}_j$ must equal zero for $A\mathbf{x} = 0$. Every free column is a linear combination of earlier pivot columns. The special solutions in the nullspace tells use those combinations. 


If the nullspace $N(A) = \mathbb{Z}$ (and thus $\text{rank}(A) = m$), it means that the columns of $A$ are independent. No linear combination of the columns gives the zero vector (except for the zero combination). All columns have pivots and no columns are free.


<br>

### The Complete Solution to Ax = b

For an $m\times n$ matrix (as in $m$ rows and $n$ columns):

1. Complete solution to $A\mathbf{x} = \mathbf{b}$: $\mathbf{x}$ = (one particular solution $\mathbf{x}_p$) + (any $\mathbf{x}_n$  in the nullspace).

2. Elimination on $[A \; \mathbf{b}]$ leads to $[R \; \mathbf{d}]$. Then $A\mathbf{x} = \mathbf{b}$ is equivalent to $R\mathbf{x} = \mathbf{d}$.

3. $A\mathbf{x} = \mathbf{b}$ and $R\mathbf{x} = \mathbf{d}$ are solvable only when all zero rows of $R$ have zeros in $\mathbf{d}$.

4. When $R\mathbf{x} = \mathbf{d}$ is solvable, one very particular solution $\mathbf{x}_p$ has all free variables equal to zero.


Every matrix $A$ with **full column rank** $(r=n)$ has all these properties:

1. All columns of $A$ are pivot columns.

2. There are no free variables or special solutions

3. The nullspace $N(A)$ contains only the zero vector $\mathbf{x}=0$.

4. If $A\mathbf{x}=\mathbf{b}$ has a solution (it might not), then it has only *one solution*.


Every matrix $A$ with **full row rank** $(r=m)$ has all these properties:

1. All rows have pivots, and $R$ has no zero rows.

2. $A\mathbf{x}=\mathbf{b}$ has a solution for every right side $\mathbf{b}$ 

3. The column space is the whole space $\mathbb{R}^m$.

4. There are $n-r$ special solutions in the nullspace of $A$.


The four cases are:
- $r = m = n$: (A is square and invertible, $A\mathbf{x} = \mathbf{b}$ has 1 solution)
- $r = m < n$: (A is short and wide, $A\mathbf{x} = \mathbf{b}$ has $\infty$ solutions)
- $r = n < m$: (A is tall and thin, $A\mathbf{x} = \mathbf{b}$ has 1 or 0 solutions)
- $r < m, r < n$: (not full rank, $A\mathbf{x} = \mathbf{b}$ 0 or $\infty$ solutions)


<br>

### Independence, Basis and Dimension

A **basis** is a set of independent vectors that span the space. Four essential ideas are:

1. Independent vectors (no extra vectors)
2. Spanning a space (enough vectors to produce the rest)
3. Basis for a space (not to many or too few)
4. Dimension of a space (the number of vectors in every basis)

For an $m\times n$ matrix (as in $m$ rows and $n$ columns):

1. Columns of $A$ are independent if the only solution to $A\mathbf{x} = 0$ is $\mathbf{x} = 0$, aka $N(A)=\mathbb{Z}$.

2. Independent vectors: The only zero combination $c_1 \mathbf{v}_1 + \cdots + c_k \mathbf{v}_k = 0$ has all $c_i = 0$.

3. A matrix with $m < n$ has dependent columns: At least $n - m$ free variables / special solutions in the nullspace.

4. The vectors $\mathbf{v}_1, \ldots, \mathbf{v}_k$ **span** the space $S$ if $S =$ all linear combinations of the $\mathbf{v}$'s.

5. The vectors $\mathbf{v}_1, \ldots, \mathbf{v}_k$ are a **basis** for $S$ if they are independent and they span $S$.

6. The **dimension** of a space $S$ is the number of vectors in every basis for $S$.

7. If $A$ is $4 \times 4$ and invertible, its columns are a **basis** for $\mathbb{R}^4$. The **dimension** of $\mathbb{R}^4$ is 4.

$R$ reveals a **basis** for the three fundamental subspaces:
1. The **column space** of A: choose the pivot columns of A as a basis.
2. The **row space** of A: choose the nonzero rows of R as a basis.
3. The **nullspace** of A: choose the special solutions to Rx = 0 (and Ax = 0).

**Definition**: The **row space** of a matrix is the subspace of $\mathbb{R}^n$ spanned by the rows.

***The row space of $A$ is $C(A^T)$. It is the column space of $A^T$.***


<br>

### The Fundamental Theorem of Linear Algebra 

The rank of a matrix is the number of pivots. The dimension of a subspace is the number of vectors in a basis. The rank of $A$ reveals the dimensions of all four fundamental subspaces.

1. The **row space** is $C(A^T)$, a subspace of $\mathbb{R}^n$.
2. The **column space** is $C(A)$, a subspace of $\mathbb{R}^m$.
3. The **nullspace** is $N(A)$, a subspace of $\mathbb{R}^n$.
4. The **left nullspace** is $N(A^T)$, a subspace of $\mathbb{R}^m$.

The **Fundamental Theorem of Linear Algebra** states:

1. The column space $C(A)$ and the row space $C(A^T)$ both have dimension $r$ (the rank of $A$).

2. The nullspace $N(A)$ has dimension $n - r$. The left nullspace $N(A^T)$ has dimension $m - r$.

3. The column space $C(A)$ and left nullspace $N(A^T)$ are orthogonal compliments in $\mathbb{R}^m$. The row space $C(A^T)$ and nullspace $N(A)$ are orthogonal compliments in $\mathbb{R}^n$.


***$A$ has the same row space and nullspace as $R$.*** Elimination changes rows but doesn't affect the row space or special solutions. 

***$A$ does NOT have the same column space and left nullspace as $R$.*** If the last row in $R$ are all 0s but not the case in $A$, the space has fundamentally changed.


#### Why are the dimension of the row space and column space the same?

I thought about this for a long time. Take the matrix $A$ and its reduced form below:

$$
A =
\begin{bmatrix}
1 & 3 & 4 & 5 \\\
2 & 6 & 5 & 7 \\\
3 & 9 & 6 & 9 \\\
4 & 12 & 7 & 11
\end{bmatrix}
\qquad\text{rref}(A) = 
\begin{bmatrix}
1 & 3 & 0 & 1 \\\
0 & 0 & 1 & 1 \\\
0 & 0 & 0 & 0 \\\
0 & 0 & 0 & 0
\end{bmatrix}
$$

This matrix has a rank of 2 because it only has 2 pivots. The bottom two rows are zeroed out (which means they are a linear combination of above rows) and we have 2 free variables (and thus two linearly dependent columns).

Looking at this picture, it is still not obviously evident why there must be a match between zeroed out rows and the number of columns that are linearly dependent. One can see that, by the nature of the algorithm, for there to be an empty row, there must be a free variable, but just seeing that wasn't satisfactory.

We can see that columns 2 and 4 are free variables. This means that those variables essentially don't matter, because we can always find a solution where they are zeroed out. Imagine we discard them and create a new matrix $A^\prime$ without those columns:

$$
A^\prime =
\begin{bmatrix}
1 & 4 \\\
2 & 5 \\\
3 & 6 \\\
4 & 7 
\end{bmatrix}
\qquad\text{rref}(A^\prime) = 
\begin{bmatrix}
1 & 0 \\\
0 & 1 \\\
0 & 0 \\\
0 & 0
\end{bmatrix}
$$

If we transpose it, it becomes obvious that the bottom rows (the rightmost columns in the transposed version) must be linearly dependent:

$$
(A')^T =
\begin{bmatrix}
1 & 2 & 3 & 4 \\\
4 & 5 & 6 & 7
\end{bmatrix}
\qquad(\text{rref}(A'))^T = 
\begin{bmatrix}
1 & 0 & 0 & 0 \\\
0 & 1 & 0 & 0
\end{bmatrix}
$$

Each transposed row lives in $\mathbb{R}^2$. The first two transposed rows make up the standard basis of $\mathbb{R}^2$, thus they span the entire space. Any transposed row that comes after must be linearly dependent, thus the bottom two rows in the original $A$ must be linearly dependent if there are two columns that are linearly dependent.

Any time there is a linearly dependent column, we can remove it and find that a row must be linearly dependent this way. This thought is how I first felt I intuitively understood the Fundamental Theorem of Linear Algebra.



<br>

## Orthogonality
---

Two vectors are orthogonal when their dot product is zero: $\mathbf{v} \cdot \mathbf{w} = \mathbf{v}^T \mathbf{w} = 0$.

1. If two vectors $\mathbf{v}$ and $\mathbf{w}$ are orthogonal, then $\||\mathbf{v}\||^2 + \||\mathbf{w}\||^2 = \||\mathbf{v} + \mathbf{w}\||^2 = \||\mathbf{v} - \mathbf{w}\||^2$.

2. Subspaces $V$ and $W$ are orthogonal when $\mathbf{v}^T \mathbf{w} = 0$ for every $\mathbf{v} \in V$ and every $\mathbf{w} \in W$.

3. The row space of $A$ is orthogonal to the nullspace $N(A)$. The column space is orthogonal to $N(A^T)$.

4. One pair of dimensions adds to $r + (n - r) = n$. The other pair has $r + (m - r) = m$.

5. Row space and nullspace are orthogonal complements: Every $\mathbf{x}$ in $\mathbb{R}^n$ splits into $\mathbf{x} _{\text{row}} + \mathbf{x} _{\text{null}}$.

6. Suppose a space $S$ has dimension $d$. Then every basis for $S$ consists of $d$ vectors.

7. If $d$ vectors in $S$ are independent, they span $S$. If $d$ vectors span $S$, they are independent.

**Definition:** The orthogonal complement of a subspace $V$ contains **every** vector that is perpendicular to $V$. This orthogonal subspace is denoted by $V^\perp$.


<br>

### Projections

Projections is projecting one vector $\mathbf{b}$ onto another line $\mathbf{a}$ or subspace $S$ to get vector $\mathbf{p}$.

1. The projection of a vector $\mathbf{b}$ onto the line through $\mathbf{a}$ is the closest point $\mathbf{p} = \mathbf{a} \left(\frac{\mathbf{a}^T \mathbf{b}}{\mathbf{a}^T \mathbf{a}}\right)$.

2. The error $\mathbf{e} = \mathbf{b} - \mathbf{p}$ is perpendicular to $\mathbf{a}$: Right triangle $\mathbf{b}\mathbf{p}\mathbf{e}$ has $\||\mathbf{p}\||^2 + \||\mathbf{e}\||^2 = \||\mathbf{b}\||^2$.

3. The projection of $\mathbf{b}$ onto a subspace $S$ is the closest vector $\mathbf{p}$ in $S$. The error $\mathbf{b} - \mathbf{p}$ is orthogonal to $S$.

4. The projection of $\mathbf{b}$ onto the column space of $A$ is the vector $\mathbf{p} = A(A^T A)^{-1}A^T \mathbf{b}$.

5. The projection matrix onto $C(A)$ is $P = A(A^T A)^{-1}A^T$. It has $\mathbf{p} = P\mathbf{b}$ and $P^2 = P = P^T$.

The left nullspace is important in projections. Our subspace is the column space of $A$. The error vector $\mathbf{e}=\mathbf{b}-P\mathbf{b}$ is perpendicular to that column space. Therefore, $\mathbf{e}=\mathbf{b}-P\mathbf{b}$ is in the nullspace of $A^T$. That means $A^T(\mathbf{b}-P\mathbf{b})=0$.

$A^T A$ is invertible (and symmetric) only if $A$ has independent columns (and thus is square).


<br>

### Least Squares Approximations

It often happens that $A\mathbf{x}=\mathbf{b}$ has no solution. The usual reason is too many equations; $A$ has more rows than columns. There are more equations than unknowns ($m$ is greater than $n$) and the $n$ columns span a small part of $m$-dimensional space, where $\mathbf{b}$ is outside the column space of $A$.

We cannot always get the error $\mathbf{e}=\mathbf{b}-A\mathbf{x}$ down to zero. When the error is zero, $\mathbf{x}$ is an exact solution to $A\mathbf{x}=\mathbf{b}$. When the error is as small as possible, $\mathbf{\hat x}$ is a **least squares solution**.

1. When $A\mathbf{x}=\mathbf{b}$ has no solution, multiply by $A^T$ and solve $A^T A \mathbf{\hat x} = A^T \mathbf{b}$.

2. This gives the projection $\mathbf{p} = A\mathbf{\hat x}$ of $\mathbf{b}$ onto the column space of $A$. $\mathbf{\hat x}$ is the ***least-squares solution***: $\|| \mathbf{b} - A\mathbf{\hat x} \||^2 = \text{minimum}$.

Setting partial derivatives of $E = \|| A\mathbf{x} - \mathbf{b} \||^2$ to zero ($\nabla E = 0$) also produces $A^T A\mathbf{\hat x} = A^T \mathbf{b}$.

To fit points $(t_1, b_1), \ldots, (t_m, b_m)$ by a straight line, $A$ has columns $(1, \ldots, 1)$ and $(t_1, \ldots, t_m)$. In that case, $A^T A$ is the $2 \times 2$ matrix
$$
A^T A = \begin{bmatrix}
m & \sum t_i \\\
\sum t_i & \sum t_i^2
\end{bmatrix}
$$
and $A^T \mathbf{b}$ is the vector
$$
A^T \mathbf{b} = 
\begin{bmatrix}
\sum b_i \\\
\sum t_i b_i
\end{bmatrix}
$$
where the solution $\mathbf{\hat x} = \begin{bmatrix} x_1 \\\ x_2 \end{bmatrix}$ gives you the line $x_1 + x_2t$.


<br>

### Orthonormal Bases and Gram-Schmidt

Gram-Schmidt chooses combinations of the original basis vectors of $A$ to produce orthonormal basis vectors which will be the columns of a new matrix $Q$.

1. The columns $\mathbf{q}_1, \ldots, \mathbf{q}_n$ are orthonormal if $\mathbf{q}_i^T \mathbf{q}_j = 
\begin{cases} 
1 & \text{if } i = j, \\\
0 & \text{if } i \neq j. 
\end{cases}$
Then $Q^T Q = I$.

2. If $Q$ is also square, then $QQ^T = I$ and $Q^T = Q^{-1}$. $Q$ is an "orthogonal matrix."

3. The least squares solution to $Q\mathbf{x} = \mathbf{b}$ is $\mathbf{x} = Q^T \mathbf{b}$. The projection of $\mathbf{b}$: $\mathbf{p} = QQ^T\mathbf{b} = P\mathbf{b}$.

4. The **Gram-Schmidt** process takes independent $\mathbf{a}_i$ to orthonormal $\mathbf{q}_i$.

5. Start with $\mathbf{q}_1 = \frac{\mathbf{a}_1}{\||\mathbf{a}_1\||}$. Then $\mathbf{q}_i$ is

    $$\frac{\mathbf{a}_i - \text{projection } \mathbf{p}_i} {\||\mathbf{a}_i - \mathbf{p}_i\||}$$

    where projection $\mathbf{p}_i = (\mathbf{a}_i^T \mathbf{q}_1) \mathbf{q}_1 + \cdots + (\mathbf{a} _i^T \mathbf{q} _{i-1}) \mathbf{q} _{i-1}$.

6. Each $\mathbf{a}_i$ will be a combination of $\mathbf{q}_1$ to $\mathbf{q}_i$. Then $A = QR$: orthogonal $Q$ and triangular $R$.

One important property of an orthogonal matrix $Q$ is that it leaves lengths unchanged. $||Q\mathbf{x}|| = ||\mathbf{x}||$ for any vector $\mathbf{x}$. Numbers can never grow too large when lengths of vectors are fixed, so computers use orthonormal matrices as much as possible.

Another is that if the basis vectors are orthonormal, then $A^T A$ simplifies to $Q^T Q = I$.



<br>

## Determinants
---

The determinant of a square matrix is a single number. It contains a great amount of information about the matrix. It is zero when the matrix has no inverse.

1. The determinant of $A = \begin{bmatrix} a & b \\\ c & d \end{bmatrix}$ is $ad - bc$. A singular matrix (non-invertible) $A = \begin{bmatrix} a & xa \\\ c & xc \end{bmatrix}$ has $\det(A) = 0$.

2. Row exchange reverses sign: $P A = \begin{bmatrix} 0 & 1 \\\ 1 & 0 \end{bmatrix} \begin{bmatrix} a & b \\\ c & d \end{bmatrix} = \begin{bmatrix} c & d \\\ a & b \end{bmatrix}$ has $\det(PA) = bc - ad = -\det(A)$.

3. The determinant of $\begin{bmatrix} xa+yA & xb+yB \\\ c & d \end{bmatrix}$ is $x(ad - bc) + y(Ad - Bc)$. Det is linear in row 1 by itself.

4. Elimination $EA = \begin{bmatrix} a & b \\\ 0 & d - \frac{cb}{a} \end{bmatrix}$, $\det(EA)$ = $a(d - \frac{cb}{a})$ = product of pivots = $\det(A)$. 

- If $A$ is $n$ by $n$, then 1, 2, 3, 4 remain true:
   - $\det = 0$ when $A$ is singular.
   - $\det$ reverses sign when rows are exchanged.
   - $\det$ is linear in row 1 by itself.
   - $\det$ = product of the pivots. $\det(BA) = (\det B)(\det A)$ and $\det(A^T) = \det(A)$.

One can reason that from these properties:
- Subtracting a row from another leaves the determinant unchanged.
- If a $A$ is triangular, then the determinant is the product of the diagonal entries.

When $A$ is invertible, the determinant of $A^{-1}$ is $\frac1{\det(A)}$. For a $2\times2$ matrix:

$$ A = \begin{bmatrix} a & b \\\ c & d \end{bmatrix} \quad\text{has inverse}\quad
A^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\\ -c & a \end{bmatrix}
$$


When the determinant is 0, we are asked to divide by zero and we can't--then $A$ has no inverse.

The determinant of an $n$ by $n$ matrix can be found in three ways:
1. Multiply the n pivots *(The pivot formula)*
2. Add up n! terms *(The "big" formula)*
3. Combine $n$ smaller determinants *(The cofactor formula)*

Applications for determinants are:
1. Determinants give $A^{-1}$ and $A^{-1}\mathbf{b}$ *(Cramer's Rule)*
2. When edges of a box are the rows of $A$, the volume is $|\det A|$
3. For $n$ special numbers $\lambda$, called **eigenvalues**, the determinant of $A - \lambda I$ is zero.


<br>

### Permutations and Cofactors

A computer finds the determinants from the pivots. The two other ways are the "big formula" which uses all $n!$ permutations, and the "cofactor formula" using determinants of size $n-1$.

1. For a $2 \times 2$ matrix, $\det(A) = ad - bc$ has $2!$ terms with $\pm$ signs. For an $n \times n$ matrix, $\det(A)$ adds $n!$ terms with $\pm$ signs.

2. For $n = 3$, $\det(A)$ adds $3! = 6$ terms. Two terms are $+a_{12}a_{23}a_{31}$ and $-a_{13}a_{22}a_{31}$. Rows 1, 2, 3 and columns 1, 2, 3 appear once in each term.

3. The minus sign came because the column order $3, 2, 1$ needs one exchange to recover $1, 2, 3$.

4. The six terms include for example $+a_{11}a_{22}a_{33} - a_{11}a_{23}a_{32} = a_{11}(a_{22}a_{33} - a_{23}a_{32}) = a_{11} (\text{cofactor } C_{11})$.

5. Always $\det(A) = a_{11}C_{11} + a_{12}C_{12} + \cdots + a_{1n} C_{1n}$. Cofactors are determinants of size $n - 1$.


<br>

### Cramer's Rule, Inverses, and Volumes 

To solve an $n\times n$ system, Cramer's rule evaluates $n+1$ determinants (of $A$ and modified $A$s).

1. $A^{-1}$ equals $\frac{C^T}{\det(A)}$. Then $(A^{-1}) _{ij} = \frac{\text{cofactor } C _{ji}}{\det(A)}$.

2. **Cramer's Rule** computes $\mathbf{x} = A^{-1}\mathbf{b}$ from $x_j = \frac{\det(\text{A with column } j \text{ changed to } \mathbf{b})}{\det(A)}$.

The determinant gives us the volume:

1. The area of a parallelogram is $|ad - bc|$ if the four corners are $(0, 0)$, $(a, b)$, $(c, d)$, and $(a+c, b+d)$.

2. The volume of a box is $|\det(A)|$ if the rows of $A$ (or the columns of $A$) give the sides of the box. 

The cross product of $\mathbf{u}=(u_1, u_2, u_3)$ and $\mathbf{v}=(v_1, v_2, v_3)$ is a vector:

$$\mathbf{u}\times\mathbf{v}=\det \begin{bmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\\ u_1 & u_2 & u_3 \\\ v_1 & v_2 & v_3 \end{bmatrix} = (u_2 v_3 - u_3 v_2)\mathbf{i} + (u_3 v_1 - u_1 v_3)\mathbf{j} + (u_1 v_2 - u_2 v_1)\mathbf{k}$$

This vector $\mathbf{u}\times\mathbf{v}$ is perpendicular to $\mathbf{u}$ and $\mathbf{v}$. The cross product $\mathbf{v} \times \mathbf{u}$ is $-(\mathbf{u} \times \mathbf{v})$.

When $\mathbf{u}$ and $\mathbf{v}$ are parallel (including if they're equal), the cross product is zero. When they are perpendicular, the dot product is zero. One involves $\sin\theta$ and the other involves $\cos\theta$. 

$$
||\mathbf{u} \times \mathbf{v}\|| = \||\mathbf{u}\||\ \||\mathbf{v}\||\ ||\sin \theta||
\quad\text{and}\quad
||\mathbf{u} \cdot \mathbf{v}|| = ||\mathbf{u}\||\ ||\mathbf{v}||\ ||\cos \theta||.
$$

The cross product points in the direction of your thumb when your fingers curl from $\mathbf{u}$ to $\mathbf{v}$. The cross product $\mathbf{u} \times \mathbf{v}$ equals the area of the parallelogram with sides $\mathbf{u}$ and $\mathbf{v}$.



<br>

## Eigenvalues and Eigenvectors
---

All the content before was about solving $A\mathbf{x} = \mathbf{b}$: balance and quilibrium and steady state. Now we're talking about change. Time enters the picture--continuous time in a differential equation $\frac{du}{dt} = A\mathbf{u}$ or time steps in a difference equation $\mathbf{u_{k+1}} = A\mathbf{u_k}$. These equations are NOT solved by elimination.

We can simplify our lives by finding a solution vector $\mathbf{u}(t)$ that stays in the same direction of a fixed vector $\mathbf{x}$. Then we only need to find the number (changing with time) that multiplies $\mathbf{x}$. 

***We want "eigenvectors" $\mathbf{x}$ that don't change direction when you multiply by $A$.*** Multiply an eigenvector by $A$, and the vector $A\mathbf{x}$ is a scalar $\lambda$ times the original $\mathbf{x}$.

An example is if you need to apply a transformation matrix $A$ a total of $n$ times. You can calculate it directly using the **eigenvalues** instead of calculating $A^n$.

1. An eigenvector $\mathbf{x}$ lies along the same line as $A\mathbf{x}$, hence: $A\mathbf{x} = \lambda \mathbf{x}$. The eigenvalue is $\lambda$.

2. If $A\mathbf{x} = \lambda \mathbf{x}$, then $A^2 \mathbf{x} = \lambda^2 \mathbf{x}$, $A^{-1} \mathbf{x} = \lambda^{-1} \mathbf{x}$, and $(A + cI)\mathbf{x} = (\lambda + c)\mathbf{x}$.

3. If $A\mathbf{x} = \lambda \mathbf{x}$, then $(A - \lambda I)\mathbf{x} = 0$
    - $A - \lambda I$ is singular (non-invertible)
    - $\det(A - \lambda I) = 0$
    - There are $n$ eigenvalues.

4. Check $\lambda$'s by $\det(A) = (\lambda_1)(\lambda_2) \cdots (\lambda_n)$ and diagonal sum $a_{11} + a_{22} + \cdots + a_{nn} = \sum \lambda_i$ (aka the trace).

5. Projections have $\lambda = 1$ and $0$. Reflections have $\lambda = 1$ and $-1$. Rotations have $\lambda = e^{i\theta}$ and $e^{-i\theta}$ (complex eigenvalues).

Since $\det(A - \lambda I) = 0$, ***The eigenvectors make up the nullspace of*** $A - \lambda I$. The determinate gives us the **characteristic polynomial** of degree $n$. Finding the $n$ roots of this polynomial gives us $n$ eigenvalues of $A$.

For each eigenvalue $\lambda$, solve $(A - \lambda I)\mathbf{x} = 0$ to find the corresponding eigenvector $\mathbf{x}$. This is just finding the special solutions per each free variable (usually one) after row reducing it. Since the eigenvector is in the null space of $A-\lambda I$, the dot product of each row with each eigenvector is zero.

Exchanging rows or adding/subtracting one from another generally changes the eigenvalues. ***Elimination does not preserve the $\lambda$'s***. The product of eigenvalues is the determinant of $A$ while the sum is the sum of the diagonals of $A$ (called a trace). For a 2 by 2 matrix, we can calculate the eigenvalues just from knowing the trace and determinant.


<br>

### Diagonalizing a Matrix

1. The columns of $AX = X\Lambda$ are $A\mathbf{x}_k = \lambda_k \mathbf{x}_k$. The eigenvalue matrix $\Lambda$ is diagonal.

2. $n$ independent eigenvectors in $X$ diagonalize $A$: $$A = X \Lambda X^{-1} \quad\text{and}\quad \Lambda = X^{-1}AX$$

3. The eigenvector matrix $X$ also diagonalizes all powers $A^k$: $$A^k = X \Lambda^k X^{-1}$$

4. Solve $u_{k+1} = A u_k$ by $u_k = A^k u_0 = X \Lambda^k X^{-1} u_0 = c_1 (\lambda_1)^k \mathbf{x}_1 + \cdots + c_n (\lambda_n)^k \mathbf{x}_n$.

5. No equal eigenvalues $\implies X$ is invertible and $A$ can be diagonalized.

    Equal eigenvalues $\implies A$ might have too few independent eigenvectors. Then $X^{-1}$ fails.

6. Every matrix $C = B^{-1}AB$ has the same eigenvalues as $A$. These $C$'s are "similar" to $A$.


<br>

### Systems of Differential Equations

Eigenvalues and eigen vectors and $A=X\Lambda X^{-1}$ are perfect for matrix powers $A^k$. They are also perfect for differential equations $\frac{d\mathbf{u}}{dt}=A\mathbf{u}$. **We can convert constant-coefficient differential equations into linear algebra.**

In linear algebra, the ordinary differential equations $\frac{du}{dt} = u$ and $\frac{du}{dt} = \lambda u$ are solved by exponentials:

$$
\frac{du}{dt} = u \text{ produces } u(t) = Ce^t, \quad \frac{du}{dt} = \lambda u \text{ produces } u(t) = Ce^{\lambda t}.
$$

This is a 1 by 1 problem. Linear algebra moves to n by n.

1. If $A\mathbf{x} = \lambda \mathbf{x}$, then $\mathbf{u}(t) = e^{\lambda t} \mathbf{x}$ will solve $\frac{d\mathbf{u}}{dt} = A\mathbf{u}$. Each $\lambda$ and $\mathbf{x}$ give a solution $e^{\lambda t} \mathbf{x}$.

2. If $A = X \Lambda X^{-1}$, then: $$\mathbf{u}(t) = e^{At}\mathbf{u}(0) = X e^{\Lambda t} X^{-1} \mathbf{u}(0) = c_1 e^{\lambda_1 t} \mathbf{x}_1 + \cdots + c_n e^{\lambda_n t} \mathbf{x}_n$$

3. $A$ is stable and $\mathbf{u}(t) \to 0$ and $e^{At} \to 0$ when all eigenvalues of $A$ have real parts $< 0$.

4. Matrix exponential $e^{At} = I + At + \cdots + \frac{(At)^n}{n!} + \cdots = X e^{\Lambda t} X^{-1}$ if $A$ is diagonalizable.

5. Second-order equation $\frac{d^2 \mathbf{u}}{dt^2} + B \frac{d\mathbf{u}}{dt} + C\mathbf{u} = 0$ is equivalent to a first-order system: $$\begin{bmatrix} \mathbf{u} \\\ \mathbf{u^\prime}\end{bmatrix}^\prime = \begin{bmatrix} 0 & I \\\ -C & -B \end{bmatrix} \begin{bmatrix} \mathbf{u} \\\ \mathbf{u}^\prime \end{bmatrix}$$


<br>

### Symmetric Matrices

Symmetric matrices are one of the most important kind of matrices.

1. A symmetric matrix $S$ has $n$ real eigenvalues $\lambda_i$ and $n$ orthonormal eigenvectors $\mathbf{q}_1, \ldots, \mathbf{q}_n$.

2. Every real symmetric matrix $S$ can be diagonalized: $S = Q \Lambda Q^{-1} = Q \Lambda Q^T$, where $Q$ is an orthogonal matrix.

3. The number of positive eigenvalues of $S$ equals the number of positive pivots.

4. Antisymmetric matrices $A = -A^T$ have imaginary eigenvalues $\lambda$ and orthonormal (complex) eigenvectors $\mathbf{q}$.


<br>

### Positive Definite Matrices

Symmetric matrices that have positive (or non-negative) eigenvalues are special.

1. Symmetric $S$: all eigenvalues $> 0$ $\Leftrightarrow$ all pivots $> 0$ $\Leftrightarrow$ all upper left determinants $> 0$.

2. The matrix $S$ is then **positive definite**. The energy test is $\mathbf{x}^T S \mathbf{x} > 0$ for all vectors $\mathbf{x} \neq 0$.

3. One more test for positive definiteness: $S = A^T A$ with independent columns in $A$.

4. **Positive semidefinite** $S$ allows $\lambda = 0$, pivot = 0, determinant = 0, and energy $\mathbf{x}^T S \mathbf{x} \geq 0$.

5. The equation $\mathbf{x}^T S \mathbf{x} = 1$ gives an ellipse in $\mathbb{R}^n$ when $S$ is symmetric positive definite.



<br>

## The Singular Value Decomposition (SVD)
---

The **Singular Value Decomposition (SVD)** is a fundamental matrix factorization that provides deep insights into the structure of a matrix. It is a versatile tool in numerical linear algebra with a wide range of applications in data science, machine learning, and applied mathematics.

The **Singular Value Decomposition** (SVD) of an $m \times n$ matrix $A$ is a factorization of the form:
$$
A = U \Sigma V^T,
$$
where:
- $U$ is an $m \times m$ **orthogonal** (or **unitary**) matrix whose columns are the **left singular vectors** of $A.$
- $\Sigma$ is an $m \times n$ **diagonal matrix** with non-negative real numbers on the diagonal, called the **singular values** of $A.$
- $V$ is an $n \times n$ **orthogonal** (or **unitary**) matrix whose columns are the **right singular vectors** of $A.$

**Properties of SVD**:
- The **singular values** $\sigma_i$ in $\Sigma$ are the **square roots** of the **eigenvalues** of $A^TA$ (or $AA^T$).
- $U$ and $V$ have orthonormal columns, so $U^TU = I_m$ and $V^TV = I_n$.
- The **rank** of $A$ is the number of **non-zero singular values** $\sigma_i$.
- $A^TA = V \Sigma^T \Sigma V^T$ and $AA^T = U \Sigma \Sigma^T U^T$.

**Geometric Interpretation**:
   - The SVD represents a matrix $A$ as a composition of three transformations:
     1. **Rotation** or **reflection** by $V^T$.
     2. **Scaling** along the coordinate axes by the singular values in $\Sigma$.
     3. **Another rotation** or **reflection** by $U$.
   - This allows SVD to capture both the **direction** (via $U$ and $V$) and **magnitude** (via $\Sigma$) of the transformation represented by $A$.

**Applications of SVD**:
   - **Principal Component Analysis (PCA)**: SVD is used to perform PCA, where the right singular vectors (columns of $V$) represent the **principal components**.
   - **Low-Rank Approximations**: SVD can be used to approximate $A$ by keeping only the largest $k$ singular values and their corresponding singular vectors:
   $$
   A \approx U_k \Sigma_k V_k^T,
   $$
   where $U_k$, $\Sigma_k$, and $V_k$ are matrices truncated to the first $k$ components.
   - **Pseudo-Inverse Calculation**: For a matrix $A$, its **Moore-Penrose pseudo-inverse** $A^+$ is given by:
   $$
   A^+ = V \Sigma^+ U^T,
   $$
   where $\Sigma^+$ is obtained by taking the reciprocal of each non-zero singular value in $\Sigma$ and transposing.
   - **Data Compression and Noise Reduction**: SVD is used in image compression, denoising, and dimensionality reduction.

The SVD of a matrix is computed using **numerical algorithms** (like the Golub-Kahan algorithm). It is more computationally intensive than methods like QR decomposition but provides more detailed information.

Relationship to Eigenvalues and Eigenvectors: If $A$ is a **square symmetric matrix** ($A = A^T$), the **singular values** are the **absolute values** of its **eigenvalues**, and the **left** and **right singular vectors** are the **eigenvectors** of $A$.
