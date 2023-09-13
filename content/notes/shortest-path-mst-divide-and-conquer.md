+++
title = "Shortest Path, Minimum Spanning Trees, & Divide and Conquer"
description = "These are my notes from Greg Plaxton's Algorithms class at UT Austin. Most of the content closely follows the slides covered in lecture."
date = 2023-09-11T09:45:15-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}



## Preface
***

There are very good videos on youtube that visually show Dijkstra's Algorithm and Kruskal's Algorithm. I recommend watching those to gain an intuitive understanding on how these algorithms work before reading about them in a more theoretical sense.



## The Single Shortest Path Problem
***

Let $G=(V,E)$ be a digraph with a designated source vertex $s$ and where each edge $(u, v)$ in $E$ has an associated weight $w(u,v)$.

We wish to determine a shortest path from $s$ to every vertex that is reachable by $s$. By "shortest", we mean "minimum of edge weights".

<h6>Same Weight Special Case</h6>
If all of the edge weights are the same, then we can use $BFS$ to solve the SSSP problem in $O(|E| + |V|)$ time. The tree edges form a shortest path tree rooted at s.

<h6>Non-negative Edge Weights</h6>
In many applications, the edge weights are restricted to be non-negative. It turns out that the SSSP problem is much simpler to solve when the edge weights are non-negative. We can solve this special case using Dijkstra's algorithm.



## Dijkstra's Algorithm
***

Let $G=(V,E)$ be a digraph with a designated source vertex $s$ and where each edge $(u,v)\in E$ has an associated non-negative weight $w(u,v)$.
For any vertex v, let $d(v)$ denote the shortest path distance from the source $s$ to $v$. Thus $d(s) = 0$.

We will maintain a "label" $l_v$ for each vertex $v\in V$. We initialize $l_s$ to $0$. For any other vertex $v\in V$, we initialize $l_v$ to $w(s,v)$ if $(s,v)$ belongs to $E$, and to $\infty$ otherwise. We maintain a subset $U$ of $V$ that is initialized to $\{s\}$. In each of $|V| - 1$ iterations, we add a vertex to $U$.

We maintain the following key invariants:
- For each vertex $u\in U$, we have $l_u = d(u)$
- For each vertex $v\in V\setminus U$, we have 

$$l_v = \min_{u\in U:(u,v)\in E}d(u) + w(u,v)$$

In other words, we just keep track of then known shortest distance of each vertex (which is the label $l_u=d(u)$). If we've not seen a vertex yet, we just treat it as if its distance is infinity.

Let $u$ be a minimum-label vetex in $V\setminus U$.
Observe that any path from $s$ to a vertex in $V\setminus U$ has cost at least $l_u$. Hence $l_u \le d(u)$. Since $d(u) \le l_u$ by the second key invariant, we conclude that $l_u = d(u)$.

We add $u$ to $U$. The first key invariant is maintained since $l_u = d(u)$. To re-establish the second key invaraint, we update $l_v$ to

$$\min(l_v, d(u)+w(u,v))$$

for each vertex $v\in V\setminus U$ such that $(u,v)\in E$.

This basically just means that for each iteration, we select the vertex in the "unseen" set with the lowest weighted distance from the source. We then iterate through each vertex and then replace the current min distance if the new vertex creates a new, shorter path from the source to that vertex.

### Recovering The Shortest Paths

We use essentially the same approach as in $BFS$. We maintain a "parent" for each vertex $v\in V-s$. Initially, each parent is undefined.

When we add a vertex $u$ to $U$, we might decrease the label of one or more vertices $v$ in $V\setminus U$. For any such vertex v, we update the parent of $v$ to $u$.

Upon termination, every vertex reachable from $s$ has a well defined parent. The set of all edges $(u,v)\in E$ such that $u$ is the parent of $v$ form a shortest path tree rooted at $s$.

### Implementations

###### Elementary Implementation
We can use a heap to maintain the labels of the vertices in $V\setminus U$. We use $O(|V|)$ `Insert` and `Delete-Min` operations
We use $O(|E|)$ `Decrease-Key` operations.

Using an elementary heap data structure, the algorithm runs in $O(|E| \log |V|)$ time.

If instead we use an array to maintain the labels, we obtain an $O(|V|^2)$ bound, which is an improvement for sufficiently dense graphs.

###### A Faster Implementation

There are more sophisticated heap data structures that support `Insert` and `Delete-Min` in logarithmic time, and `Decrease-Key` in $O(1)$ time. This gives a time bound of $O(|E|+|V|\log|V|)$ for Dijkstra's algorithm.



## The Minimum Spanning Tree Problem
***

We are given a connected, undirected graph $G=(V,E)$ where each edge $e\in E$ has an associated weight $w(e)$ (which can be negative).

A spanning tree $T$ of $G$ is a subgraph $G'=(V,E')$ of $G$ that is a tree.

The weight of a spanning tree $T$ is defined as

$$\sum_{e\in T}w(e)$$

A minimum spanning tree $MST$ of $G$ is a spanning tree of $G$ with minimum weight.

<h6>A Key Observation</h6>

Let $e$ be a minimum-weight edge in $E$.

*Claim 1:* Some $MST$ of $G$ includes $e$.

To prove this claim, we can use an exchange argument.
Let $T$ be a $MST$ of $G$ that does not include $e$.
If we add $e$ to $T$, we get a unique cycle $C$.
For any edge $e'$ on $C$, we have that $T+e-e'$ is a spanning tree of $G$ with weight at most that of $T$, and hence is an $MST$ of $G$.

In other words, if we have a minimum-spanning tree $T$, and add a minimum-weight edge $e$, we get a cycle. We can remove any other edge and will still be able to get to any node from any other node. Thus replacing any old edge while adding the new edge $e$ will have less or equal weight to the previous tree.

We can obtain a $MST $ of $G$ by recursively computing a $MST$ $T'$ of the graph $G'$ obtained by "contracting edge $E$ and returning $T'+e$.

Alternatively, we can get an iterative implementation by repeatedly selecting a minimum-weight edge that does not form a cycle with any subset of the previously selected edges.



## Kruskal's Algorithm
***

Kruskal's algorithm is pretty simple. Basically you just select the lowest weight edges that doesn't give you a cycle until there are none left. Below is the algorithm in words and then it in pseudo code.

Index edges $e_1, ..., e_{|E|}$ in non-decreasing order of weight. Initialize $T$ to $\emptyset$. For $i$ running from 1 to $|E|$, if $T+e_i$ is acyclic, then add e_i to $T$. After, return $T$.

```python
# Pseudo code
def kruskal_algorithm(edges):
    tree = {}
    sorted_edges = sorted(edges) # With respect to weight

    for edge in edges:
        if acyclic(tree + edge):
            tree.add(edge)

    return tree
```

While the concept itself is simple, the proof, which I'll omit since I don't understand it myself, is not.



<h6>Properties of MSTs</h6>

If all of the edge weights are distinct, there is a unique $MST$. It follows that all $MST$s have the same distribution of edge weights.

Kruskal's algorithm (below) can generate any $MST$. When indexing the edges, Kruskal's algorithm can break ties arbitrarily. To produce $MST$ $T$, favor edges in $T$ over edges not in $T$.

The set of $MST$s does not change if we replace each weight $x$ with $f(x)$ for some increasing function $f$. This transformation preservese the relative order of the weights, which is all that Kruskal's Algorithm looks at.


### Union Find

A union-find data structure maintains a collection of disjoint sets, subject to the following operations:
- $\textnormal{Make-set(x)}$ forms a new singleton set $\\{x\\}$. To maintain disjointness, we require that $x$ does not belong to any of the existing sets in the collection.
- $\textnormal{Union(x, y)}$ merges the set containing $x$ with the set containing $y$, where $x$ and $y$ belong do distinct sets.
- $\textnormal{Find-Set(x)}$ returns the "name" of the set containing $x$ ($x$ is required to to belong to some set). We require $\textnormal{Find-Set(x)}=\textnormal{Find-Set(y)}$ if and only if $x$ and $y$ belong to the same set.

#### Union Find Implementation of Kruskal's Algorithm

At the outset, we perform a $\textnormal{Make-Set(v)}$  operation for each $v\in V$. Thus our initial sets are the vertex sets of the $|V|$ connected components of the graph $(V, \emptyset)$.

For an edge $e=(u,v)$, we check whether $T+e$ contains a cycle by asking whether $\textnormal{Find-Set}(u)=\textnormal{Find-Set}(v)$. We perform $2|E|$ $\textnormal{Find-Set}$ operations.

When we add an edge $e=(u,v)$ to $T$, we perform a $\textnormal{Union}(u,v)$ operation. we perform $|V|-1$ $\textnormal{Union}$ operations.


<!-- ### A Tree-Based Union-Find Data Structure -->

<!-- We will represent each set as a tree where every non-root $x$ maintains a pointer to its parent p(x). The root has no parent. -->

<!-- It is easy to perform a $\textnormal{Make-Set}$ operation in $O(1)$ time. We can perform a $\textnormal{Find-Set}$ operation on a depth-$k$ node $x$ in $O(k)$ time by traversing parent pointers to the root. -->

<!-- The $\textnormal{Find-Set}$ operation takes as input a pointer to the node $x$, so locating node $x$ is not an issue. -->
<!-- We return the element at the root as the "name" of the set. -->

<!-- We can perform a $\textnormal{Union}$ operation by using two $\textnormal{Find-Set}$ operations to obtain two roots $x$ and $y$, and then setting $p(x)$ to $y$ (or $p(y)$ to $x$). We refer to the latter constant-time step as a $\textnormal{Link}$ operation. -->

<!-- #### Union by Size and Height Heuristics -->

<!-- When we link two roots $x$ and $y$ as part of a $\textnormal{Union}$ operation, we have the choice of making $x$ the parent of $y$ or $y$ the parent of $x$. -->

<!-- Using the "union by size" heuristic, we maintain the size of each tree, and we make the root with the larger weight the root of the unmerged tree (ties are broken arbitrarily). -->

<!-- Using the "union by height" heuristic, we maintain the height of each tree, and we make the root with the larger height the root of the merged tree. With this rule, a tree of height $h$ has size at least $2^h$. Thus, the number of bits needed to represent height is logarithmic in the number of bits needed to represent size. -->

<!-- #### Path Compression Heuristic -->

<!-- In a $\textnormal{Find-Set}$ operation on a node $x$, we traverse the path from $x$ to the root of $y$ of its tree. We refer to this path as the find path. -->

<!-- The "path compression heuristic" re-traverses the find path from $x$ to $y$, and sets the parent of every non-root on this path to $y$. This doubles the cost of the current $\textnormal{Find-Set}$ operation, but can improve the cost of future $\textnormal{Find-Set}$ operations by more than a constant factor. -->

<!-- #### Union by Rank Heuristic -->

<!-- Maintaining heights require extra work when we use the path compression heuristic. Instead, we will maintain a value called the "rank". -->

<!-- The rank of a singleton tree is defined to be zero. Using the "union by rank" heuristic, we make the root with the higher rank the root of the merged tree. -->

<!-- If the two roots have ranks $r$ and $s$ where $r\ge s$, the rank of the merged tree is defined to be $\textnormal{max}(r, s+1)$. -->

<!-- In the absence of path compression, rank is equal to height. Path compression has no impact on rank. -->

## Divide and Conquer
***

A divide-and-conquer algorithm works by dividing the problem into smaller subproblems, solving those subproblems, and then combining those solutions to get the solution to the original problem. A classic example of this is the merge sort algorithm.

The efficiency of divide-and-conquer algorithms can often be described using recurrence relations, which express the time required to solve the problem of size $n$ in terms of the time required to solve similar instances of the problem.

### The Recurrence Relation

The recurrence relation presented:

$$T(n)\le aT(n/b)+n^c$$

can be understood as:

- $T(n)$: The tie it takes to solve a problem of size $n$
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


