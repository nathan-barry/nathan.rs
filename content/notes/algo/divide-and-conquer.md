+++
title = "Recurrence Relations, Divide & Conquer"
description = ""
date = 2023-09-23T15:05:06-05:00
tags = ["Algorithms Notes"]
priority = 5
+++

{{< toc >}}



## Divide and Conquer
***

A divide-and-conquer algorithm works by dividing the problem into smaller subproblems, solving those subproblems, and then combining those solutions to get the solution to the original problem. A classic example of this is the merge sort algorithm.

The efficiency of divide-and-conquer algorithms can often be described using recurrence relations, which express the time required to solve the problem of size $n$ in terms of the time required to solve similar instances of the problem.

### The Recurrence Relation

The recurrence relation presented:

$$T(n)\le aT(n/b)+n^c$$

can be understood as:

- $T(n)$: The time it takes to solve a problem of size $n$
- $a$: The number of sub problems we divide into.
- $n/b$: The size of each of these subproblems.
- $n^c$: The "overhead" or time taken to split the problem and/or combine the solutions.

### Analysis

To understand the efficiency of a divide-and-conquer algorithm, one often uses a recursion tree. This tree represents the breakdown of the problem:

- The root represents the original problem size, $n$.
- Each level represents a breakdown of the problem into subproblems. The first level has $a$ nodes (subproblems), each of size $n/b$.
- As you move down the tree, the problems get smaller, and the work associated with each level is added together to determine the overall efficiency.

###### Overhead Cost

The total overhead associated with the root is $n^c$. This means that for the problem size $n$, there is some overhead cost to manage, represented by $n^c$.

The total overhead with $a$ children of the root is $a(n/b)^c = (a/b^c)n^c$. When the problem is divided, each of the $a$ sub problems has a size $n/b$. The overhead of each of these problems is $(n/b)^c$ which we multiply by $a$ to get the total overhead.

The total overhead associated with $a^2$ grandchildren of the root is $a^2(n/b^2)c = (a/b^c)^2n^c$. One level deeper in the tree, there are now $a^2$ subproblems, each of size $n/b^2$.

For each level $i$ of the tree, the overhead is given by $(a/b^c)^i n^c$. This a geometric series with ratio $a/b^c$.

###### Leaf Evaluation Cost

The depth of the recursion tree is $log_b n$. The number of nodes grow by a factor of $a$ at each level. Thus the number of leaves is $a^{log_b n}$. Observe that:

$$a^{\log_b n}=(b^{\log_b a})^{\log_b n}=(b^{\log_b n})^{log_b a}=n^{\log_b a}$$

Thus the number of leaves is $n^{\log_b a}$, and the total cost of evaluating the leaves is $O(n^{log_b a})$.

### Solving the Recurrence

When we solve such a recurrence relation, our goal is often to determine its big-) notation, which gives an upper bound on its growth rate. The recurrence falls into one of three cases, depending on the values of $a$, $b$, and $c$:

1. $a \lt b^c$: The work decreases as you move down the tree. This results in the top levels doing the most work. It yields $O(n^c)$.
2. $a=b^c$: Each level of the tree does roughly the same amount of work. It yields $O(n^c\log n)$.
3. $a \gt b^c$: The work increases as you move down the tree. This results in the bottom levels doing the most work. It yields $O(n^{\log_b a})$

### Example: Merge Sort

Merge sort is a divide and conquer algorithm that splits an array in half, recursively sorts both halves, and then merges them together. Its recurrence relation is:

$$T(n) = 2T(n/2)+n$$

Here, we have that:

- $a=2$ (two sub problems)
- $b = 2$ (eah sub problem is half the size of the original)
- $c=1$ (linear time to merge)

This falls into the second case, $a=b^c$, so merge sort has a time complexity of $O(n \log n)$.


