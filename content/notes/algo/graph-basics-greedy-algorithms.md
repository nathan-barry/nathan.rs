+++
title = "Graph Basics & Greedy Algorithms"
description = "These are my notes from Greg Plaxton's Algorithms class at UT Austin. Most of the content closely follows the slides covered in lecture."
date = 2023-09-06T09:29:35-05:00
tags = ["Algorithms Notes"]
priority = 2
+++

{{< toc >}}



## Exploring an Undirected Graph
***

Assume we are given a graph $G=(V, E)$ in adjacency list format. Let $s$ be a specified source vertex. We would like to systematically visit all of the vertices and edges of the connected component of $G$ that contains $s$.

### Breadth First Search Option

In a $BFS$ from $s$, we first traverse the entire adjacency list of $s$ to identify the set of vertices $S_1$ at distance 1 from $s$. As we identify these vertices, we insert them into a queue (common for $BFS$ problems). We then explore from each of the vertices in $S_1$ to identify the set of vertices $S_2$ at the shortest path distance 2 from $s$. As we identify these vertices, we also insert them into the queue.

While the queue is nonempty, remove the vertex at the head of the queue and explore from it, inserting any newly discovered vertices into the queue.

```python
class Node():
    def __init__(self, neighbors: list[Node]):
        self.neighbors = neighbors

def bfs(source: Node):
    q = deque()
    q.append(source) # Add source to queue
    seen = set([source]) # Add source to seen

    while q:
        node = q.leftpop() # grab first element in queue
        for n in node.neighbors: # iterate through neighbors
            if n not in seen:
                seen.add(n) # add new node to seen
                q.append(n) # add node to back of queue
```

### Depth First Search Option

In $DFS$, when we are exploring the adjacency list of vertex $u$ and we examine the edge $(u, v)$ that leads to an undiscovered vertex $v$, we proceed as follows:
- We suspend exploration from $u$, to be completed later
- We initiate a recursive exploration from $v$
- Once the recursive exploration from $v$ terminates, we resume exploration from $u$.

In contrast with $BFS$, $DFS$ uses a stack. It is commonly implemented using recursion where the call stack is used as the $DFS$ stack.

```python
def dfs(node: Node):
    seen = set()
    for n in node.neighbors:
        if n not in seen:
            seen.add(n)
            dfs(n) # adds onto the call stack, pops when finished
```

Using an iterative approach with an explicit stack:

```python
def dfs(source: Node):
    seen = set([source])
    stack = [source]

    while stack:
        node = stack.pop()
        for n in reversed(node.neighbors):
            if n not in seen:
                seen.add(n)
                stack.append(n)
```

### Properties 
#### Connected Components

If we run either $BFS$ or $DFS$ from a single source vertex $s$, we will only explore the connected components of $s$.

To ensure that we explore the entire graph, we introduce an "outer loop" over all vertices in $V$.
When the outer loop reaches a given vertex $v\in V$, we check whether $v$ has already been visited.
If not, we run $BFS/DFS$ from $v$.

#### Time Complexity of Undirected BFS/DFS

Both algorithms visits each edge twice (once from each endpoint).
Both spend $O(d+1)$ time traversing the adjacency list of a vertex with degree $d$.

The overall time complexity is $O(|E|+|V|)$, which is linear in the size of the adjacency list representation of $G=(V,E)$.
The time complexity for running either algorithm from a single source vertex is $O(|E|)$. In our case we loop through all vertices to ensure we are visiting every connected component.

#### Classification of Edges

When running $BFS/DFS$ on an undirected graph $G=(V,E)$, we classify each edge $e\in E$ as either a "tree" edge or "non-tree" edge. The classification of edge $e$ is preformed the first time we encounter it (recall that we encounter $e$ twice, one from each endpoint).

Suppose $e=(u, v)$ and we first encounter $e$ when exploring the adjacency list of $u$. If $v$ is "discovered" (i.e., encountered for the first time) as a result, then we classify $e$ as a tree edge. Otherwise, $e$ is a non-tree edge.

The reason why they are called tree edges is because we can make a spanning tree from $G$ if we discard the non-tree edges.

#### Spanning Trees/Forests

If $G$ is connected, the tree edges associated with any $BFS/DFS$ of $G$ correspond to a spanning tree of $G$. More generally, the tree edges correspond to a collection of spanning trees, one for each connected component of $G$.
Such a collection of spanning trees is called a spanning forest.

Thus, $BFS/DFS$ provide linear-time algorithms for the construction of a spanning forest of a given undirected graph. This also gives us the connected components of a graph.

#### Cycle Detection

We can use $BFS/DFS$ to determine whether a given undirected graph $G=(V,E)$ is acyclic. If the $BFS/DFS$ has any non-tree edges, the graph has a cycle.

#### Recognizing Bipartite Graphs

An undirected graph $G=(V,E)$ is bipartite if the vertex set $V$ can be partitioned into two sets $V'$ and $V"$ such that every edge in $E$ has exactly one endpoint in $V'$ (and hence the other in $V"$).

It can be shown that $G$ is bipartite if and only if $G$ does not contain an odd-length cycle. Alternatively, $G$ is bipartite if and only if it is "2-colorable". A graph $G$ is $k$-colorable if we can assign one of $k$ colors to each vertex so that no edge joins two vertices of the same color. We can use $BFS/DFS$ to determine whether $G$ is 2-colorable in linear time.

#### Single-Source Shortest Paths

Let $G=(V, E)$ be an undirected graph with a specified source vertex $s$. If we run $BFS$ from $s$, we get a spanning tree $T$ of the connected component of $G$ that contains $s$, call it $G'=(V', E')$.

Note that $T$ is also a shortest paths tree rooted at $s$. If the shortest path distance from $s$ to a vertex $v\in V'$ is $i$, then $v$ lies at depth $i$ in $T$. If we record the parent of each vertex $v$ in $V'-s$, we can easily reconstruct a shortest path from $s$ to $v$.

## Exploring a Digraph
***

The procedures for $BFS/DFS$ in undirected graphs generalize in a natural way to digraphs. In the directed case, each edge is encountered exactly once. The concept of a tree edge is same as before (edge that leads to unvisited vertex).

When searching from a source vertex $s$, the tree edges form an **arborescence** (directed out-tree rooted at $s$) that spans all the vertices reachable (via a directed path) from $s$. If we use $BFS$ to search from a source vertex $s$, the resulting arborescence is a directed shortest paths tree rooted at $s$.

### Strongly Connected Components

Let $G=(V, E)$ be a given digraph. We say that vertices $u$ and $v$ belong to the same **strongly connected component** ($SCC$) of $G$ if $v$ is reachable (via a directed path) from $u$ and $u$ is reachable from $v$.

Let the binary relation $R$ denote the set of pairs $(u,v)$ in $V\times V$ such that $u$ and $v$ belong to the same $SCC$. The relation $R$ is reflexive, symmetric, and transitive; hence it is an *equivalence relation.* Thus $R$ partitions $V$ into equivalence classes, each of which corresponds to the vertex set of a $SCC$ of $G$.

The connected component structure of any undirected graph has the property that both endpoints of any edge belong to the same connected component and thus each edge belongs to a particular connected component. The $SCC$ structure of a digraph does not enjoy this property. A directed edge can connect vertices in distinct $SCC$s.


## Directed DFS
***

There are many important applications of $DFS$ in digraphs, some which we'll discuss below.

### DFS Discovery/Finish Times

When running $DFS$ in a graph $G=(V,E)$ (directed or undirected), we define the "discovery time" of a vertex $v\in V$  as the time at which we first encounter $V$. The "finish" time of a vertex $v\in V$ is the time at which we complete the exploration of the adjacency list of $v$.{{%sidenote%}}In applications, we will only care about the relative order of the discovery/finish times, so we don't need to use actual timestamps to represent these times.{{%/sidenote%}}

Given the recursive implementation of $DFS$, it is easy to see that the discovery-finish intervals "nest". A vertex $v$ is a proper descendant of a vertex $u$ in the $DFS$ forest if and only if the discovery-finish interval of $v$ nests inside the discovery-finish interval of $u$.

### DFS Vertex Colors

At any given point in the execution of $DFS$, a vertex is classified as white, gray, or black as follows:
- A vertex that has **not been discovered** yet is white
- A vertex that has **been discovered but not finished** is gray
- A vertex that has **finished** is black

Whenever we explore a directed edge $(u, v)$, vertex $u$ is gray.
- If $v$ is white, then $(u, v)$ is classified as a **tree edge**
- If $v$ is gray, then $(u, v)$ is classified as a **back edge**
- If $v$ is black, then $(u, v)$ is classified as a **cross** or **forward edge**{{%sidenote%}}Cross and forward edges are not relevant to any of the applications shown here.{{%/sidenote%}}

###### The White Path Lemma
Suppose that at some point in the execution of $DFS$ on a given digraph, we discover a white vertex $u$. Let $U$ be the set of all white vertices reachable form $u$ via a directed path of white vertices.

**Lemma:** A vertex $v$ is a descendant of $u$ in the $DFS$ forest if and only if $v\in U$.

For the "if" direction we can use a proof by contradiction. For the "only if" direction, observe that all of the eventual descendants of $u$ in the $DFS$ forest are white just before $u$ becomes gray.

### Directed Cycle Detecting in Digraphs

Recall that an undirected graph $G$ contains a cycle if and only if any $DFS$ of $G$ yields a non-tree edge. There is an analogous result for digraphs: A digraph $G$ contains a directed cycle if and only if any $DFS$ of $G$ yields a back edge.

###### Proving the "If" direction
Suppose a $DFS$ of $G$ yields a back edge $(u, v)$. 
At the point in the execution when edge $(u, v)$ is explored and identified as a back edge, vertices $u$ and $v$ are gray and all of the gray vertices lie on a directed path $P$ from the root $r$ of the current arborescence to $u$.
The suffix $P'$ of $P$ beginning at $v$ forms a directed path from $v$ to $u$. Observe that $P'+(u,v)$ forms a directed cycle in $G$.

###### Proving the "Only If" direction
Suppose that $G$ contains a directed cycle $C$, and let $u$ be the first vertex on $C$ that is discovered in some $DFS$ of $G$. We claim that the edge $(v,u)$ is a back edge, where $v$ denotes the predecessor of $u$ on $C$. By the white path lemma, vertex $v$ will be discovered and finished before vertex $u$ is finished. Thus vertex $u$ is gray when edge $(v, u)$ is explored.

## Directed Acyclic Graphs
***

A digraph is a DAG (**directed acyclic graph**) if and only if it is acyclic (contains no cycles). To determine whether a given digraph $G$ is a DAG, we can run $DFS$ on $G$ and check whether any edge is classified as a back edge. Thus we can determine whether a given digraph is a DAG in linear time.

### Topological Ordering of a DAG

Let $G=(V,E)$ be a given DAG. A topological ordering of $G$ is an indexing of the vertices of $V$ from 1 to $|V|$ such that for every edge $(u,v)\in E$, the index of $u$ is less than the index of $v$. **Every DAG has a topological ordering.**

###### Claim
We can obtain a topological ordering of a given DAG $G=(V,E)$ by running directed $DFS$ and arranging the vertices of $V$ from left to right in the order of decreasing finish time.

Fix the point in the execution of $DFS$ when some edge $(u, v)\in E$ is explored. At this point, vertex $v$ is either black or white since $(u,v)$ cannot be a back edge.
If $v$ is black, then the finish time of $v$ precedes that of $u$, as required.
If $v$ is white, then $v$ is a descendant of $u$ in the $DFS$ forest and once again the finish time of $v$ precedes that of $u$.
 
###### Time Complexity
Notice that a general purpose sorting routine does not need to be invoked in order to sort the vertices by finish time.
Instead, we can simply maintain a list of the finished vertices. When a vertex finishes, we prepend it to the list. Upon termination, the list contains all the vertices in descending order of finish time. Thus we can compute a topological ordering of a given DAG in linear time.


### Identifying all SCCs of a Digraph

Directed $DFS$ provides an elegant two-pass linear time algorithm for computing all of the SCCs of a given digraph $G=(V,E)$.

First, we run $DFS$ on $G$ and arrange the vertices in descending order of finish time.
Next, we form the *reversal* of $G$, i.e., the graph $G'=(V,E')$ where $E'=\\{(v, u) | (u,v)\in E\\}$.
Then we run $DFS$ on $G'$ where the outer loop of the $DFS$ processes the vertices in the order given by the first pass. Each arborescence produced in the second $DFS$ spans an $SCC$ of $G$.


## The Activity Selection Problem
*** 

We are given a list of n activities. $n_i$ has start time $s_i$ and finish time $f_i$.
We cannot participate in two activities that overlap and wish to find the largest set of non-overlapping activities (the maximum-cardinality set).

<h6>A Key Observation</h6>

Let $i$ be an activity with minimum finish time. We can prove the claim that some optimal solution includes $i$. To prove this claim, we can choose an "exchange argument".

Suppose $S$ is an optimal solution that does not include $i$. Let $j$ be the first activity in $S$. Then we know that $(S-j)+i$ is an optimal solution that includes $i$.

### Pseudo-Code Implementation

We can re-index the activities in non-decreasing order of finish time. We initialize the set of activities $I$ to $\\{1,\dots,n\\}$ and our optimal solution $S$ to the empty set, $S=\emptyset$. Below is psuedo-code for a greedy implementation.

```python
let I = {1, ..., n} # Sorted earliest finish time to latest 
let S = {}

while I not empty:
    let i = I[0] # Grabs first activity 
    S.append(i) # Add activity to S
    for j in I:
        if i and j overlap:
            I.remove(j) # remove all activities that overlap with i
        else:
            break # can break early due to sorted order

```

A faster implementation:
```python
let I = {2, ..., n} 
let S = {1}
let k = 1 # Last activity

while I not empty:
    let i = I.index(0)
    if i.start_time >= k.finish_time: # If new activity starts after last
        S.append(i)
        k = i
```

With this implementation, we start with the first activity in our solutions because we know that it can be in any optimal solution. We will then iterate through each activity (from earliest finish time to latest) and add any that don't overlap with the last activity we added. 


## Scheduling to Minimize Maximum Lateness
***

In this version of the problem, instead of maximizing the number of activities we can fit, where each activity is given a set start and finish time, we have a set of activities with deadlines.

We wish to (non-preemptively) schedule all n tasks on a single resource in such a way that the maximum "lateness" of any task is minimized.

Each task $i\in I$ has a has a positive integer deadline $d_i$ and a positive integer execution requirement $e_i$. Lateness is defined as $max(0, t_i-d_i)$ where $t_i$ is the time when the task terminated.

We can restrict out attention to gap-free schedules and thus are optimizing over $n!$ schedules.

<h6>Key Lemma</h6>

Suppose $S$ is a schedule in which task $j$ is executed immediately after task $i$ and $d_j\le d_i$. Let $l_i, l_i$ denote the lateness of task $i, j\in S$ .

Let $S'$ be the schedule that is the same as $S$ except that the order of execution of tasks $i$ and $j$ are swapped. Let $l_i', l_j'$ represent the lateness of tasks $i,j\in S'$.

Lemma: $l_j \ge max(l_i', l_j')$.

In plane English, given two tasks, executing the one with a later deadline will give a lateness that is greater or equal to the max lateness of executing the tasks in the other order. Because in this example we only care about reducing maximum lateness (not overall lateness), it shows that there is no reason to not execute tasks with the earliest deadlines, implying that this leads to an optimal schedule.

```python
I = {1, ..., n} # Sorted from earliest deadline to latest

# That's it. This is an optimal schedule.
```

Of course, sorting in of itself takes $O(n\log(n))$ depending on what algorithm you use, but there is nothing more to the algorithm than that.

### Proof of the Key Lemma

Since $d_j \le d_i$ and the termination time of task $j$ in $S$ is equal to the termination of task $i$ in $S'$, we have $l_j \ge l_i'$. In other words, $i$ will be less late than $j$ because, since $i$ and $j$ both end at the same time and because $j$'s deadline is before $i$'s, more time will have passed, thus making $j$ more late.

Since task $j$ terminates earlier in $S'$ than in $S$, we have $l_j \ge l_j'$. This is just simply saying that $j$ will be less late in the second one because it finishes earlier.

From these two remarks, we conclude that $l_j \ge max(l_i', l_j')$.


## The Fractional Knapsack Problem 
***

In the knapsack problem, we are given a positive integer knapsack capacity $W$ and $n$ items indexed from 1 to $n$. Item $i$ has a positive integer value $v_i$ and a weight $w_i$. We wish to identify a maximum-value set of items with weight at most $W$.

This problem can be framed as a burglar going house to house figuring out what is the maximum amount he can steal from a set of houses. Sadly, he cannot carry 42 flat screen TVs in his back pack, so he must choose what is the optimal amount of things to take that he can carry.

No polynomial-time algorithm is known for this problem. In the fractional knapsack problem we are allowed to take a fractional amount of any item.


<h6>Key Observation</h6>

Let $i$ be an item with maximum "value density" (highest unit value per unit weight), $v_i/w_i$ . We claim that some optimal solution includes a $z=min(1, W/w_i)$ fraction of the item $i$. To prove this claim, we can use an exchange argument.

Let $S$ be an optimal solution that includes a fraction $z' \lt z$ of item $i$ and let the weight of $S$ be at least $z\cdot w_i$. Modify $S$ by removing (fractional) items with lesser value density than $i$ with total weight $(z-z')w_i$, and replacing them with  $z-z'$ units of item $i$. We find that $S$ remains optimal.

In other words, if you have a bag full of the most value dense stuff and lesser value dense stuff, replacing the lesser value dense stuff with the more value dense gives you a higher overall value.

### Python Code Implementation

Re-index the items in non-increasing order of value density.{{% sidenote %}}In the code and pseudo-code, we indexed it in non-decreasing order for efficiency with the pop operation.{{% /sidenote %}}

 Take as much as possible of item 1, then as much as possible of item 2, etc, until the knapsack is full or there are no items.

Pseudo-Code:
```python
I = {1, ..., n} # Sorted from least dense to most dense
res = []

while len(I) != 0 and capacity > 0:
    item = I.pop()
    res.append(item)
    capacity -= item.amount

if capacity < 0:
    res[-1].amount += capacity # take less of last item if over
```

This algorithm is simple enough that the psuedo-code is close to identical to Python code.{{%sidenote%}}For the sake of simplicity, this implementation modifies the passed in array and the last item in the knapsack instead of making copies.{{%/sidenote%}}

```python
class Item():
    def __init__(self, val: int, weight: int, amount: int):
        self.val = val
        self.weight = weight
        self.amount = amount


def knapsack_normal(items: list[Item], capacity: int) -> list[Item]:
    items.sorted(key=lambda item: item.val/item.weight) # Sort in-place
    res = []
    while items and capacity > 0:
        item = items.pop()
        res.append(item)
        capacity -= item.amount

    if capacity < 0:
        res[-1].amount += capacity # take less of last item if over
    return res
```

This algorithm uses $O(n\log(n))$ operations due to the sorting (re-indexing) step.

### A Faster Implementation

Let $\pi$ denote the permutation of the set $\\{1, ..., n \\}$ of item indices that arranges the items in non-increasing order of value density (ties are broken using the item indices). Thus, $\pi(1)$ is the item with the highest value density and $\pi(n)$ is the item with the minimum value density.

Suppose we could find item $\pi(k)$ where $k$ is the maximum index such that the sum of the weights of items $\pi(1), ..., \pi(k)$ is less than the knapsack capacity $W$.

Given this item, we could compute an optimal solution in $O(n)$ additional time. In the special case where all of the item weights are equal to 1, this corresponds to an instance of the "selection problem". This knapsack problem is an example of a weighted selection problem.

In a selection problem, we are given an unsorted collection of $n$ keys, and a desired rank $k$, and we are asked to compute the key of rank $k$ item (i.e., the $k$th key in sorted order).

For example, the problem of computing the median is a special case of the selection problem. Linear-time comparison based algorithms are known for both normal and weighted selection problems.
