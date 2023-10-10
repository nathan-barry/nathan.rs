+++
title = "Maximum Flow, Ford-Fulkerson, & Edmonds-Karp"
date = 2023-10-10T08:49:47-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}


## Flow Networks
***

A **Flow Network** is a special type of directed graph $ G = (V, E) $ with the following properties:

1. **Source and Sink**: There are two special vertices $ s $ and $ t $ in $ V $, known as the source and the sink, respectively.
  
2. **Edge Capacity**: Every edge $ (u, v) $ in $ E $ has an associated non-negative capacity denoted by $ c(u, v) $.

3. **No Self-loops**: The graph doesn't contain any self-loops.

4. **Bidirectional Edges**: If an edge $ (u, v) $ is in $ E $, then $ (v, u) $ must also belong to $ E $. If it doesn't, we artificially introduce such an edge with $ c(v, u) = 0 $.

### Flows

A **Flow** $ f $ in a given flow network $ G = (V, E) $ is a function that assigns a non-negative value $ f(u, v) $ to each edge $ (u, v) $ in $ E $. This assignment must satisfy the following conditions:

1. **Capacity Constraints**: For each edge $ (u, v) $, the flow must be less than or equal to its capacity: 
$$
0 \leq f(u, v) \leq c(u, v)
$$

2. **Flow Conservation Constraints**: For each vertex $ v $ except $ s $ and $ t $, the sum of incoming flows should be equal to the sum of outgoing flows: 
$$
\sum_{(u, v) \in E} f(u, v) = \sum_{(v, u) \in E} f(v, u)
$$

3. **Subsets of Vertices**: If $ X $ and $ Y $ are subsets of $ V $, the total flow from $ X $ to $ Y $ is given by:
$$
f(X, Y) = \sum_{(u, v) \in E, u \in X, v \in Y} f(u, v)
$$

#### The All-Zeros Flow

In any given flow network $ G = (V, E) $, we can define an **"All-Zeros Flow"** $ f $ that maps each edge $ (u, v) $ in $ E $ to zero. It's easy to verify that this satisfies both capacity and flow conservation constraints, making it a valid flow in $ G $.

### Cuts

A **Cut** in a flow network $ G = (V, E) $ is a partition of $ V $ into an ordered pair of sets $ (S, T) $ such that the source $ s $ is in $ S $ and the sink $ t $ is in $ T $.

#### How Many Cuts Does $ G $ Have?

The number of possible cuts depends on the size of the vertex set $ V $ and its structure. In general, for a network with $ n $ vertices, the number of cuts could be as large as $ 2^{n-2} $, but this varies based on the specific topology of $ G $.

#### The Net Flow Across a Cut

Given a flow $ f $ and a cut $ (S, T) $, the **Net Flow** across the cut is defined as:
$$
f(S, T) - f(T, S)
$$

### Two Lemmas

1. **Lemma 1**: For two similar cuts $ (S, T) $ and $ (S', T') $ where $ S \oplus S' = 1 $, the net flows across these cuts are equal.{{%sidenote%}}The symbol $\oplus$ means symmetric difference, aka the set of items that appear in only one of the sets.{{%/sidenote%}}

2. **Lemma 2**: The net flow across any two distinct cuts $ (S, T) $ and $ (S', T') $ is the same. This can be proven by repeatedly applying Lemma 1.

### The Value of a Flow

In any given flow network $ G = (V, E) $, the **Value of a Flow** $ f $ is defined as the net flow out of the source vertex $ s $. Formally, it's the net flow across the cut $( \{s\}, V - \{s\} )$.

$$
\text{Value}(f) = f(\{s\}, V - \{s\})
$$

By Lemma 2, as discussed earlier, this value is the same across any cut $(S, T)$.


## The Maximum Flow Problem
***

The **Maximum Flow Problem** asks us to find a flow $ f $ in a given flow network $ G $ such that the Value($ f $) is maximized. Such a flow is called a **Maximum Flow** in $ G $.

### The Capacity of a Cut

Given a cut $ (S, T) $ in a flow network $ G = (V, E) $, the **Capacity of the Cut** $ (S, T) $ is defined as:

$$
\text{Capacity}(S, T) = \sum_{(u, v) \in E : u \in S, v \in T} c(u, v)
$$

### The Minimum Cut Problem

The **Minimum Cut Problem** is the problem of finding a cut $ (S, T) $ in a given flow network $ G $ such that the Capacity($ S, T $) is minimized.

- A cut that achieves this minimum capacity is called a **Minimum Cut**.
- As the number of possible cuts is finite, we are guaranteed that a minimum cut will exist.

### Max Flow ≤ Min Cut

Let's consider a flow $ f $ and a cut $ (S, T) $ in a flow network $ G = (V, E) $. The following relationships hold:

1. The net flow across the cut $ f(S, T) - f(T, S) $ is at most $ f(S, T) $.

2. The net flow across the cut is also less than or equal to the capacity of the cut:

$$
f(S, T) \leq \text{Capacity}(S, T)
$$

3. **Lemma 3**: The value of a maximum flow is at most the capacity of a minimum cut.

This property forms the basis for the famous Max-Flow Min-Cut Theorem.

### The "Reachable" Vertices of a Flow Network

In a flow network $ G = (V, E) $, a vertex $ v $ is said to be **reachable** if there is a directed path of positive-capacity edges from $ s $ to $ v $.

- The set of all such vertices is denoted as $ \text{reachable}(G) $.
- Algorithms like Breadth-First Search (BFS) or Depth-First Search (DFS) can be used to construct this set in $ O(|E| + |V|) $ time.
- It should be noted that the source $ s $ is always a member of $ \text{reachable}(G) $.



## Augmenting Paths
***

An **Augmenting Path** in a flow network $ G $ is a directed path from the source $ s $ to the sink $ t $ consisting solely of edges with positive capacity. A flow network admits an augmenting path if, and only if, the sink $ t $ is part of the set $ \text{reachable}(G) $. {{%sidenote%}}Important. Understand this.{{%/sidenote%}}

### The Flow Corresponding to an Augmenting Path

Given an augmenting path $ P $ in a flow network $ G = (V, E) $, let $ \Delta $ denote the minimum capacity among all edges in $ P $. For each edge $ (u, v) $ in $ P $, the flow $ f(u, v) $ is set to $ \Delta $, while all other edges in $ E $ have zero flow. This results in a valid flow in $ G $ with $ \text{Value}(f) = \Delta $, and $ \Delta > 0 $.

### The Residual Network with Respect to a Flow

For a given flow $ f $ in $ G = (V, E) $, a new flow network $ G_f $, known as the **Residual Network**, is constructed. $ G $ and $ G_f $ are identical except for their edge capacities. The residual capacity of an edge $ (u, v) $ is defined as:

$$
c_f(u, v) = c(u, v) - f(u, v) + f(v, u)
$$

This ensures $ c_f(u, v) \geq 0 $, given the constraints $ f(u, v) \leq c(u, v) $ and $ f(v, u) \geq 0 $. {{%sidenote%}}Residual capacity can basically be thought of as excess capacity from $G${{%/sidenote%}}

### Sufficient Condition for a Maximum Flow

Given a flow $ f $ and $ S = \text{reachable}(G_f) $, if there is no augmenting path in $ G_f $, then:

- $ f $ is a maximum flow in $ G $,
- $ (S, V \backslash S) $ is a minimum cut, and,
- The value of the maximum flow equals the capacity of the minimum cut.

### The "Cancel" Operation

Given a flow function $ g $ that maps each edge $ (u, v) $ to a non-negative real number, the **Cancel Operation**, denoted $ \text{cancel}(g) $, adjusts the flow value for each edge from $g(u,v)$ to $ g(u, v) - \min(g(u, v), g(v, u)) $. This is useful for eliminating cycles of flow that span just two nodes.

### Canonical Flows

If $ f $ is a flow in $ G $, $ f' = \text{cancel}(f) $ is called the **Canonical Flow**. It's a flow representation that maintains the flow value but minimizes local flow cycles.

### The "Add-and-Cancel" Operation

For any two flow functions $ f $ and $ g $, we can define a new flow function $ f \oplus g = \text{cancel}(f + g) $, where $ f + g $ is simply the pointwise addition of $ f $ and $ g $.

For example, for $u,v\in V$, we get:
$$f(u,v)\oplus g(u,v) = [f(u,v) + g(u,v)] - \min(f(u, v), f(v, u)) - \min(g(u, v), g(v, u)) $$

This operation is generally applied to every pair of verticies $(u, v)$ where $u,v\in V$. This ensures that for every edge in the network, we remove any "back-and-forth" flows leaving us with a net flow for each direction.

###### Lemma 5

Given a flow $ f $ in a flow network $ G = (V, E) $, if $ f' $ is a flow in the residual network $ G_f $, then $ f \oplus f' $ is a valid flow in $ G $ and $ \text{Value}(f \oplus f') = \text{Value}(f) + \text{Value}(f') $.

Let $ f'' $ denote $ f \oplus f' $. It can be shown that $ f'' $ adheres to flow conservation constraints and is non-negative. We proceed to prove that $ f'' $ also satisfies the upper-bound constraints on capacity.

###### Proof of Lemma 5

Consider any edge $ (u, v) $ in $ E $. Since $ f(u, v) + f'(u, v) \leq f(u, v) + c_f(u, v) $, we find:

$$
f''(u, v) \leq c(u, v) + f(v, u) - f(v, u) - f'(v, u) \leq c(u, v)
$$

Thus, Lemma 5 is established.

## Ford-Fulkerson Maximum Flow Algorithm
***

1. Initialize $ f $ as the all-zeros flow.
2. While there is an augmenting path in $ G_f $:
    - Let $ f' $ denote the flow in $ G_f $ corresponding to the augmenting path.
    - Update $ f $ to $ f \oplus f' $.

### Correctness of Ford-Fulkerson

- The algorithm starts with $ f $ being a valid flow in $ G $.
- By Lemma 5, the algorithm maintains the invariant that $ f $ is a valid flow in $ G $.
- If the algorithm terminates, it does so with $ f $ being a maximum flow by virtue of Lemma 4.

#### The Special Case of Integer Capacities

**Lemma 6:** If all edge capacities are integers, the Ford-Fulkerson algorithm terminates with an integer maximum flow in a finite number of steps. 

- Proof by induction shows that all flow values and residual capacities are integers at each step.
- Each iteration increases the flow value by at least 1.
- Given that edge capacities are finite, the maximum flow value is also finite.
  
Therefore, Lemma 6 establishes that every instance of the maximum flow problem with integer capacities will yield an integer maximum flow.

### Time Complexity of the Ford-Fulkerson Algorithm

Ford-Fulkerson's performance can vary significantly depending on the capacities involved and the strategy used to select augmenting paths. 

- **Real Capacities**: In cases where edge capacities are real numbers, the algorithm may never terminate. Even worse, it might converge to a suboptimal solution.
  
- **Integer Capacities**: If all edge capacities are integers, the algorithm is guaranteed to terminate. The maximum number of iterations is upper-bounded by the value of the maximum flow in the network. However, this doesn't necessarily mean the algorithm runs in polynomial time.

#### A Bad Example for Ford-Fulkerson

Imagine a simple flow network $ G = (V, E) $ where $ V = \{s, a, b, t\} $. All edges have a capacity of $ K $ except for the edge $ (a, b) $, which has a capacity of 1. The maximum flow value is $ 2K $. If you select the right augmenting paths, the algorithm terminates quickly. But if you always pick a suboptimal path, the algorithm could take $ 2K $ iterations to terminate. Thus, the algorithm's running time could be exponential relative to the size of the input, even for integer capacities.




## The Edmonds-Karp Maximum Flow Algorithm
***

Edmonds-Karp is a variant of Ford-Fulkerson, where **the augmenting path chosen is always the shortest one**. This path can be found using Breadth-First Search (BFS) in linear time. Edmonds-Karp guarantees termination within $ O(|E| \cdot |V|) $ iterations, making its time complexity $ O(|E|^2 \cdot |V|) $. This is strongly polynomial time, independent of the size of edge capacities.

### The Concept of Bottleneck Edges

In any augmenting path $ P $, the edge with the smallest capacity is called the **bottleneck edge**, denoted by $ \Delta $. This edge sets the limit for how much flow can be pushed through the path $ P $.

#### Bottleneck Count for an Edge

During the execution of the Edmonds-Karp algorithm, each edge can act as a bottleneck edge for multiple iterations. The **bottleneck count** of an edge is the number of iterations where the edge acts as a bottleneck.

The core of Edmonds-Karp algorithm analysis involves:

1. **Bounding the Bottleneck Count**: Proving an upper limit $ O(|V|) $ on the bottleneck count for any edge.
2. **Iteration Count**: Concluding that the total number of iterations is $ O(|E| \cdot |V|) $.

### Vertex Distances in Residual Graphs

Recall that the residual graph changes as the algorithm progresses. For each vertex $ v $, the minimum length of a path of positive-capacity edges from the source $ s $ to $ v $ in the residual graph $ G_f $ is denoted by $ d(v, i) $ after $ i $ iterations. If no such path exists, $ d(v, i) = \infty $. It's crucial to note that if $ d(v, i) $ is finite, it must be less than $ |V| - 1 $.

### The Main Technical Lemma

The lemma states that for all vertices $ v $ in $ V $ and all iterations $ i \geq 1 $, the distance $ d(v, i - 1) $ is less than or equal to $ d(v, i) $. If this were not the case and $ d(v, i - 1) > d(v, i) $ at some iteration $ i $, a contradiction would arise for either of the following two cases:

- **Case 1**: If the residual capacity $ c_f(u, v) > 0 $, then $ d(v, i - 1) \leq d(u, i - 1) + 1 \leq k $
- **Case 2**: If $ c_f(u, v) = 0 $, then $ d(v, i - 1) \leq k - 2 $

#### Bounding the Bottleneck Count

Suppose edge $ (u, v) $ is a bottleneck in iteration $ i $. The distance $ d(v, i - 1) $ increases with each iteration and will be at least $ k + 1 $ in subsequent iterations. The main lemma guarantees that $ d(u, i' - 1) \geq k + 2 $, establishing an upper bound on the bottleneck count of any edge $ (u, v) $ to be at most $ \max(1, \frac{|V|}{2}) $.

#### The Max-Flow Min-Cut Theorem

The Max-Flow Min-Cut theorem states that for any flow network $ G $, a maximum flow exists and is equal to the capacity of a minimum cut in $ G $. The Edmonds-Karp algorithm is guaranteed to find this maximum flow in a finite number of steps.

#### Faster Maximum Flow Algorithms

Although Edmonds-Karp is robust, even faster algorithms for finding maximum flows exist:

- **Deterministic Algorithms**: Run in $ O(|E| \cdot |V|) $ time.
- **Randomized Algorithms**: Run in $ O(|E|^{1 + o(1)}) $ time.
