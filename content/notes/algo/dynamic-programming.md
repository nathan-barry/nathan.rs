+++
title = "Dynamic Programming"
date = 2023-09-18T16:50:34-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}



## 1D vs. 2D Dynamic Programming Problems
***
Dynamic programming is a technique used to solve problems by breaking them down into smaller subproblems and storing the results of these subproblems to avoid redundant computations. 

The dimensionality of a dynamic programming problem typically refers to the number of variables or parameters that change as we move from one subproblem to another. 

### 1D Dynamic Programming:

- **Definition**: In 1D dynamic programming problems, the state of the problem can be represented using a single variable or parameter. The solutions to these problems are typically stored in a one-dimensional array or list.

- **Example**: The Fibonacci sequence problem is a classic example of a 1D dynamic programming problem. To find the $n^{th}$ Fibonacci number, we only need to know the two previous Fibonacci numbers. The state of the problem is represented by a single variable, $n$, and we store the solutions in a one-dimensional array.

- **Complexity**: The time and space complexity of 1D dynamic programming problems is often $O(n)$, where $n$ is the size of the input or the range of the single variable.

### 2D Dynamic Programming:

- **Definition**: In 2D dynamic programming problems, the state of the problem is represented using two variables or parameters. The solutions to these problems are typically stored in a two-dimensional array or matrix.

- **Example**: The Longest Common Subsequence (LCS) problem is a classic example of a 2D dynamic programming problem. To find the LCS of two sequences, $X$ and $Y$, we need to consider the lengths of the subsequences, $i$ and $j$, as we progress. The state of the problem is represented by two variables, $i$ and $j$, and we store the solutions in a two-dimensional array.

- **Complexity**: The time and space complexity of 2D dynamic programming problems is often $O(m \times n)$, where $m$ and $n$ are the sizes of the two input sequences or the ranges of the two variables.

### Key Differences:

1. **State Representation**: 1D dynamic programming problems have a single changing parameter, while 2D problems have two.

2. **Storage**: Solutions for 1D problems are stored in a one-dimensional structure (like an array), while solutions for 2D problems are stored in a two-dimensional structure (like a matrix).

3. **Subproblem Dependencies**: In 1D problems, the solution to a subproblem often depends on the solutions to its neighboring subproblems. In 2D problems, the solution to a subproblem can depend on multiple other subproblems, often in both dimensions.

4. **Complexity**: While both 1D and 2D dynamic programming problems aim to optimize and reduce complexity, 2D problems inherently have a higher computational complexity due to the additional dimension.

While both 1D and 2D dynamic programming problems leverage the principle of breaking problems down into smaller subproblems, the dimensionality dictates the number of changing parameters, the storage structure, and the complexity of the problem. Understanding the dimensionality is crucial for designing an efficient dynamic programming solution.




## Rod Cutting Problem
***
The rod cutting problem is a classic optimization problem. Imagine you have a rod of length $ n $ and a price list that tells you how much a rod of length $ i $ sells for. The goal is to determine the best way to cut the rod into smaller integer-length pieces to maximize the total selling price.

**Key Concepts:**
1. **Rod Value**: The value of a rod of length $ i $ is the maximum sum of selling prices we can get by cutting the rod into integer-length pieces.
2. **Optimal Cut**: The best way to cut a rod of length $ n $ to achieve the maximum selling price.

### Brute Force Approach

The brute force approach involves trying out all possible ways to cut the rod and then selecting the one that gives the maximum selling price.

*Key Concepts:*
1. **Partitions**: The number of different ways to cut up the rod is called the number of "partitions" of $ n $, denoted as $ p(n) $.
2. **Growth of Partitions**: The number of partitions grows exponentially with $ n $. Specifically, $ p(n) $ grows at least as fast as $ \Omega(2^{\sqrt{n}}) $.
3. **Relation with Number Theory**: It's a known result in number theory that $ \ln p(n) $ is approximately $ C \sqrt{n} $ where $ C = \frac{\pi\sqrt{2}}{3} $.


### Towards an Efficient Algorithm
Instead of trying all possible cuts, we can use previously computed values to determine the best cut for a rod of length $ i $.

**Key Concepts:**
1. **Value of Rod**: Let $ v_i $ denote the value of a rod of length $ i $.
2. **Recursive Relation**: If we decide to cut a piece of length $ j $ from the rod of length $ i $, the value we get is the price of the piece of length $ j $ plus the value of the remaining rod of length $ i-j $. This gives us the relation: $ v_i = v_j + v_{i-j} $.
3. **Computing $ v_i $**: To find the maximum value for a rod of length $ i $, we check all possible $ j $ values (from 1 to $ i $) and select the one that gives the maximum value. This can be done in $ O(i) $ operations.

### Dynamic Programming Solution
Dynamic programming is a method for solving problems by breaking them down into simpler subproblems. It is particularly useful for optimization problems like the rod cutting problem.

**Key Concepts:**
1. **Recursive Formula**: 
   - $ v_i = 0 $ if $ i = 0 $
   - $ v_i = \max_{1 \leq j \leq i} (v_j + v_{i-j}) $ if $ i > 0 $
2. **Computing All Values**: We can compute all values from $ v_0 $ to $ v_n $ in $ O(n^2) $ operations.
3. **Tracing the Solution**: Once we have the table of $ v_i $ values, we can trace back to find the actual cuts that give the optimal solution. This can be done in $ O(n^2) $ operations.
4. **Optimizing the Trace**: If we also store an "optimal j-value" for each $ i $ while computing the $ v_i $ values, we can recover the optimal solution in just $ O(n) $ operations.

Below is pseudo code for this algorithm:

```python
def rodCutting(prices, n):
    # prices is an array where prices[i] is the price of a rod of length i+1
    # n is the length of the rod

    # Initialize an array to store the maximum values
    values = [0; n+1] # array of size n+1 initialized to 0

    # Compute the maximum value for each rod length
    for i from 1 to n:
        max_val = -infinity
        for j from 1 to i:
            max_val = max(max_val, prices[j-1] + values[i-j])
        values[i] = max_val

    # Trace the solution to find the cuts
    cuts = []
    while n > 0:
        for j from 1 to n:
            if values[n] == prices[j-1] + values[n-j]:
                cuts.append(j)
                n = n - j
                break

    return values[n], cuts

```

This pseudo code first calculates the maximum value for each rod length using dynamic programming. It then traces back through the computed values to determine the actual cuts that give the optimal solution. The function returns the maximum value for a rod of length `n` and a list of the cuts.



## Matrix Chain Multiplication Problem
***
Matrix Chain Multiplication is an optimization problem that deals with determining the most efficient way to multiply a given sequence of matrices. The order in which matrices are multiplied can significantly affect the number of scalar multiplications needed.

**Key Concepts:**
1. **Matrix Multiplication Cost**: If you multiply an $ r \times s $ matrix $ A $ with an $ s \times t $ matrix $ B $, the cost is $ rst $.
2. **Matrix Sequence**: We're given a sequence of matrices $ A_1, A_2, \dots, A_n $ where $ A_i $ is a $ p_{i-1} \times p_i $ matrix.
3. **Goal**: Find the best way to parenthesize the product $ A_1 \cdot A_2 \cdot \dots \cdot A_n $ to minimize the total multiplication cost.


### Brute Force Approach
The brute force approach involves trying out all possible ways to parenthesize the matrix product and then selecting the one with the minimum cost.

**Key Concepts:**
1. **Exponential Parenthesizations**: There are exponentially many ways to parenthesize $ n $ matrices.
2. **Catalan Numbers**: The number of ways to parenthesize $ n $ matrices is $ C_{n-1} $, where $ C_k $ is the $ k^{th} $ Catalan number.
3. **Catalan Number Formula**: 
   - $ C_k = \frac{1}{k+1} \binom{2k}{k} $
   - $ C_k $ grows approximately as $ \frac{4^k}{\sqrt{\pi k^{3/2}}} $.

### Towards an Efficient Algorithm
Instead of trying all possible parenthesizations, we can use a recursive approach to determine the best way to multiply a subsequence of matrices.

**Key Concepts:**
1. **Optimal Cost**: Let $ a_{i,j} $ be the cost of the best way to multiply matrices $ A_i, A_{i+1}, \dots, A_j $.
2. **Last Multiplication**: In any optimal solution for multiplying $ A_i $ through $ A_j $, there's a last multiplication that splits the sequence into two subsequences: $ A_i $ through $ A_k $ and $ A_{k+1} $ through $ A_j $.
3. **Recursive Relation**: The cost of this multiplication is $ a_{i,k} + a_{k+1,j} + p_{i-1}p_k p_j $. To find $ a_{i,j} $, we check all possible $ k $ values (from $ i $ to $ j-1 $) and select the one that gives the minimum cost.


### Dynamic Programming Solution
Dynamic programming is a method for solving problems by breaking them down into simpler subproblems. It is particularly useful for optimization problems like the matrix chain multiplication problem.

**Key Concepts:**
1. **Recursive Formula**: 
   - $ a_{i,j} = 0 $ if $ i = j $
   - $ a_{i,j} = \min_{i \leq k < j} (a_{i,k} + a_{k+1,j} + p_{i-1}p_k p_j) $ if $ i < j $
2. **Computing All Values**: We can compute all values in $ O(n^3) $ operations.
3. **Tracing the Solution**: Once we have the table of $ a_{i,j} $ values, we can trace back to find the actual parenthesization that gives the optimal solution. This can be done in $ O(n^2) $ operations.
4. **Optimizing the Trace**: If we also store the "optimal $ k $-value" for each $ (i, j) $ pair while computing the $ a_{i,j} $ values, we can recover the optimal solution in just $ O(n) $ operations.



## Longest Common Subsequence (LCS)
***
The LCS problem is about finding the longest sequence that two sequences have in common. This "common sequence" doesn't have to be consecutive elements, but the order of elements should be maintained.

**Key Concepts:**
1. **Subsequence**: A subsequence of a sequence $ Z $ is obtained by removing zero or more elements from $ Z $ without changing the order of the remaining elements.
2. **Given Sequences**: We have two sequences, $ X = x_1, x_2, \dots, x_m $ and $ Y = y_1, y_2, \dots, y_n $.
3. **Goal**: Find the longest sequence that is a subsequence of both $ X $ and $ Y $.


### Brute Force Approach
The brute force approach would involve generating all subsequences of $ X $ and checking if they are also subsequences of $ Y $, then selecting the longest one.

**Key Concepts:**
1. **Exponential Complexity**: There are $ 2^m $ possible subsequences of $ X $ and $ 2^n $ possible subsequences of $ Y $. Checking all combinations would require an exponential number of operations.


### Towards an Efficient Algorithm
Instead of trying all possible subsequences, we can use a recursive approach to determine the LCS of subsequences of $ X $ and $ Y $.

**Key Concepts:**
1. **LCS Length**: Let $ a_{i,j} $ be the length of the LCS of the first $ i $ elements of $ X $ and the first $ j $ elements of $ Y $.
2. **Base Case**: If $ i = 0 $ or $ j = 0 $, then one of the sequences is empty, so the LCS length is 0.
3. **Matching Elements**: If $ x_i = y_j $, then the LCS of $ X_i $ and $ Y_j $ includes this common element, and its length is $ 1 + $ LCS of $ X_{i-1} $ and $ Y_{j-1} $.
4. **Non-matching Elements**: If $ x_i \neq y_j $, then the LCS of $ X_i $ and $ Y_j $ is the longer of the LCS of $ X_{i-1} $ and $ Y_j $ or the LCS of $ X_i $ and $ Y_{j-1} $.


### Dynamic Programming Solution
Dynamic programming is a method for solving problems by breaking them down into simpler subproblems. It is particularly useful for optimization problems like the LCS problem.

**Key Concepts:**
1. **Recursive Formula**: 
   - $ a_{i,j} = 0 $ if $ i = 0 $ or $ j = 0 $
   - $ a_{i,j} = a_{i-1,j-1} + 1 $ if $ x_i = y_j $
   - $ a_{i,j} = \max(a_{i-1,j}, a_{i,j-1}) $ otherwise
2. **Computing All Values**: We can compute all $ a_{i,j} $ values in $ O(mn) $ operations.
3. **Tracing the Solution**: Once we have the table of $ a_{i,j} $ values, we can trace back to find the actual LCS. This can be done in $ O(m + n) $ operations.

Below is pseudo code for this algorithm:

```python
def LCS(X, Y):
    # X and Y are the input sequences
    # m and n are their respective lengths
    m = len(X)
    n = len(Y)

    # Initialize a 2D array to store the LCS lengths
    a = [[0; m+1]; n+1] # 2D array of size (m+1) x (n+1) initialized to 0

    # Compute the LCS lengths
    for i from 1 to m:
        for j from 1 to n:
            if X[i-1] == Y[j-1]:
                a[i][j] = a[i-1][j-1] + 1
            else:
                a[i][j] = max(a[i-1][j], a[i][j-1])

    return a

def constructLCS(a, X, Y, i, j):
    # a is the table of LCS lengths
    # X and Y are the input sequences
    # i and j are the current positions in X and Y
    if i == 0 or j == 0:
        return ""
    if X[i-1] == Y[j-1]:
        return constructLCS(a, X, Y, i-1, j-1) + X[i-1]
    if a[i-1][j] > a[i][j-1]:
        return constructLCS(a, X, Y, i-1, j)
    return constructLCS(a, X, Y, i, j-1)

```

The `LCS` function calculates the lengths of the longest common subsequences for all prefixes of `X` and `Y`. The `constructLCS` function constructs the actual LCS by tracing back through the computed lengths. To get the LCS for the entire sequences `X` and `Y`, you would call `constructLCS(a, X, Y, m, n)`.




