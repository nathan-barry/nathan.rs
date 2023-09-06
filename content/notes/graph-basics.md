+++
title = "Graph Basics"
description = "These are my notes from Greg Plaxton's Algorithms class at UT Austin. Most of the content closely follows the slides covered in lecture."
date = 2023-09-06T09:29:35-05:00
tags = ["Algorithms Notes"]
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

<!-- #### Identifying the SCC of a Given Vertex -->

<!-- Let $G=(V,E)$ be a given digraph, and let $s$ be a specified vertex in $V$. We can determine the $SCC$ of $s$ in linear time. -->

<!-- ADD MORE HERE -->

## Directed DFS
<hr class="sub">

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
