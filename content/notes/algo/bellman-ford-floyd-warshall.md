+++
title = "The Bellman-Ford & Floyd-Warshall Algorithms"
description = ""
date = 2023-09-23T15:03:43-05:00
tags = ["Algorithms Notes"]
status = "Work In Progress"
priority = 8
+++

{{< toc >}}


## Bellman-Ford Algorithm
***

The Bellman-Ford Algorithm addresses a fundamental question in graph theory: given a graph (or digraph for directed graph) with possibly negative edge weights, how do we find the shortest path from a specific starting vertex to every other vertex? This is referred to as the Single Source Shortest Paths (SSSP) problem.

**Key Concepts:**
1. **Graph and Weights:** We're working with a directed graph, $G$, which is defined by its vertices, $V$, and edges, $E$. Each edge from vertex $u$ to vertex $v$ (represented as (u,v)) carries a weight, $w(u,v)$.
2. **Negative Weights:** Unlike some other shortest path algorithms, Bellman-Ford can handle negative edge weights. However, it's essential that there are no negative-weight cycles in the graph. (A negative-weight cycle would make the concept of a "shortest path" ambiguous, as you could keep looping and reducing the path's total weight.)
3. **Source Vertex:** There's a designated starting point or source vertex, $s$, from which we're trying to determine the shortest paths to all other vertices.

### Algorithm Description
1. **Path Length Limitation:** The maximum number of edges in the shortest path between any two vertices is $|V| - 1$. This is because, in a graph with $n$ vertices, the longest simple path you can have is $n-1$ edges.
2. **Path Definitions:** For any vertex $v$ and any integer $k$ between 1 and $|V|-1$ (inclusive), $Pv,k$ is the set of shortest paths from $s$ to $v$ that have at most $k$ edges. The weight of the shortest path in this set is $d(v,k)$. If there's no such path, $d(v,k)$ is set to infinity.
3. **Path Length Considerations:** If a path $P$ in $Pv,k$ has fewer than $k$ edges, it would also exist in $Pv,k-1$, meaning the path's weight doesn't change. If the path has $k$ edges, then the weight of this path is the sum of the weight of the path up to its second-last vertex plus the weight of the last edge.

### A Dynamic Programming Approach
1. **Base Case:** The shortest distance from the source to itself is always zero. So, $d(s,0) = 0$. For all other vertices, the initial distance is set to infinity: $d(v,0) = ∞$ for $v ≠ s$.
2. **Recursive Formula:** For each vertex $v$ and each integer $k$ between 1 and $|V|-1$, the shortest path's weight $d(v,k)$ is the minimum between $d(v,k-1)$ (the previous weight) and the weight of the shortest path that ends with an edge $(u,v)$. Mathematically, this is expressed as:
$$ d(v, k) = \min(d(v, k − 1), \min_{u:(u,v)∈E} (d(u, k − 1) + w(u,v)) $$
3. **Efficiency:** Calculating the values of $d(v,k)$ from the $d(v,k-1)$ values takes $O(|E|)$ operations. Considering we do this for all vertices, the overall time complexity of the algorithm is $O(|E| * |V|)$.

The Bellman-Ford algorithm, utilizing dynamic programming, efficiently solves the SSSP problem, even in graphs with negative edge weights. While it's not the fastest algorithm for all scenarios, its ability to handle negative weights makes it indispensable in certain applications.

**Key Concepts:**
1. **Vertex Labeling:** Every vertex $v$ in our graph $V$ has a "label" $dv$. Initially, the source vertex $s$ has a label $ds$ of 0, and every other vertex is labeled with infinity.
2. **Iterative Label Updating:** We iterate through all vertices $v$, $|V|-1$ times, updating each vertex's label. In every iteration, the label $dv$ is updated to the smaller of its current value and the sum of the label $du$ of any vertex $u$ and the weight $w(u,v)$.
3. **Label Convergence:** After completing all iterations, it's shown that the labels converge to the actual shortest path distances from the source to every other vertex.





## The Floyd-Warshall Algorithm
***

The Floyd-Warshall Algorithm addresses the All-Pairs Shortest Paths (APSP) problem. Instead of determining the shortest path from a single source to all other vertices, the APSP problem seeks the shortest path between every pair of vertices. 

### **Algorithm Description**
1. **Graph & Definitions:** Let's consider a directed graph $G$ with vertices $V$ and edges $E$. For every pair of vertices $i$ and $j$, we use $d_{i,j}$ to represent the weight of the shortest path from $i$ to $j$.
2. **Intermediate Path Sets:** For any integer $k$ (from 0 to $n$), $P(k)_{i,j}$ denotes the set of all paths from vertex $i$ to vertex $j$, where all intermediate vertices are numbered between 1 and $k$. The weight of the shortest path in this set is represented by $d(k)_i,j$.

**Recursive Formula:**
The shortest path weights can be recursively defined as:
- $d(0)_{i,j} = 0$ if $i = j$.
- $d(0)_{i,j} = \infty$ if $i ≠ j$ and edge $(i,j)$ doesn't exist.
- $d(0)_{i,j} = w_i,j$ if $i ≠ j$ and edge $(i,j)$ exists.

- For any $k$ between 1 and $n$, $d(k)_{i,j}$ is the minimum of $d(k-1)_i,j$ and the sum of $d(k-1)_i,k$ and $d(k-1)_k,j$.

### **Algorithmic Complexity:**
1. **Initialization:** Computing all initial shortest path weights, $d(0)_{i,j}$, requires $O(n^2)$ time.
2. **Iterative Updates:** For each value of $k$, we can update the shortest path weights using the recursive formula in $O(n^2)$ time.
3. **Overall Complexity:** The total running time for the Floyd-Warshall algorithm is $O(n^3)$. Initially, it seems to require $O(n^3)$ space to store all the values of $d(k)_{i,j}$ for every $k$. However, because we only need the values from the previous iteration to compute the next set, we can optimize space usage down to $O(n^2)$.

The Floyd-Warshall algorithm efficiently addresses the All-Pairs Shortest Paths problem. It does so using dynamic programming, iterating through all possible intermediate vertices to update shortest path weights. The algorithm is particularly valuable for dense graphs or when we need to know shortest paths between all pairs of vertices.


### Dropping the Superscripts

**Key Insight:** The Floyd-Warshall algorithm, when implemented, can seem heavy due to the management of many variables (with superscripts). But we can optimize this and simplify our code!

#### **Claim 1**: Uniformity of certain distance measures
For any given $i$, $j$, and $k$ (all between 1 and $n$), the distances $d(k)_{i,k}$ and $d(k)_k,j$ remain consistent with the previous iteration. Mathematically:
- $d^k_{i,k} = d^{k-1}_{i,k}$
- $d^k_{k,j} = d^{k-1}_{k,j}$

By maintaining a singular variable $d_{i,j}$ for each $i$ and $j$ (ignoring superscripts), we observe that after $k$ outer-loop iterations, $d_{i,j}$ matches $d^k_{i,j}$.

The proof of this is based on induction. The main idea here is:
1. The values are consistent with the previous iteration's results.
2. If either $i$ or $j$ equals $k$, our previous claim confirms the match.
3. If $k$ is not a part of ${i, j}$, then $d_{i,j}$ is accessed once during the $kth$ iteration, ensuring consistency.

#### Additional Remarks

1. **Negative-Weight Cycle Detection**: The Floyd-Warshall algorithm can easily be adapted to find out if there's a negative-weight cycle in the graph. How? Run an extra iteration and see if any $d_{i,j}$ values change. If they do, it signals the presence of such a cycle.
   
2. **Transitive Closure Calculation**: Floyd-Warshall isn't just for shortest paths! With a minor tweak, we can use it to find the transitive closure of a relation. Instead of using the standard operations ($min$ and $+$), replace them with logical OR ($∨$) and AND ($∧$) operations, and you can get the transitive closure in $O(n^3)$ time.
