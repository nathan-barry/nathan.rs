+++
title = "Project Selection, Bipartite Matching, & Hall's Theorem"
date = 2023-10-16T07:09:03-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}


## Project Selection Problem
***

The Project Selection Problem is an optimization problem often encountered in real-world scenarios such as business project management.

Imagine you're at the helm of a company that has a list of `n` projects to potentially undertake. Each project comes with its own set of constraints: an associated profit $ p_i $ (which could even be negative), and possibly some prerequisite projects that must be completed before you can even think about starting a new one.

The objective here is not just to pick projects that are profitable, but to do so while honoring all these prerequisite constraints. Let's delve into how we can represent this problem using directed acyclic graphs (DAGs) and then solve it efficiently using network flow algorithms.

### Representing the Problem: DAGs

To model this scenario, we'll represent the projects and their dependencies as a Directed Acyclic Graph (DAG). In this DAG, each vertex represents a project and a directed edge $ (i, j) $ indicates that project $ j $ is a prerequisite for project $ i $.

#### Feasibility of Project Sets

We say a set of projects $ A $ is "feasible" if every project $ i $ in $ A $ has all of its prerequisites also included in $ A $. The total profit of the set $ A $ is the sum of the profits of its individual projects, mathematically represented as $ \sum_{i \in A} p_i $.

Our objective then becomes finding the maximum-profit feasible set of projects.

### Reduction to Network Flow

Interestingly, the Project Selection Problem can be transformed into a Network Flow problem, which can be efficiently solved. This transformation happens in polynomial time. The idea is to take the original DAG of project selections and add two additional nodes—a source vertex $ s $ and a sink vertex $ t $—along with edges connecting these new nodes to the existing graph.

#### Maximum Flow or Minimum Cut?

Both Maximum Flow and Minimum Cut are two sides of the same coin in network flow theory. Given our problem setup, it would be more natural to look for a Minimum Cut.

In a flow network, a cut divides the set of vertices into two disjoint sets: one containing the source vertex $ s $ and the other containing the sink vertex $ t $. Similarly, in our project selection scenario, we need to partition our projects into two sets: those we will undertake and those we won't.

### High-Level Plan

Here's our game plan for solving the Project Selection Problem:

1. Take the original $ n $-vertex DAG representing the projects and their dependencies.
2. Add a source vertex $ s $ and a sink vertex $ t $, and introduce appropriate edges connecting them to the existing graph.
3. Assign suitable capacities to these new edges.
4. Solve the resulting network flow problem to find a Minimum Cut.
5. Use the Minimum Cut to identify an optimal solution to the original Project Selection Problem.

#### Edges Adjacent to Source $ s $

For each project $ i $ with $ p_i > 0 $, we add an edge $ (s, i) $ to the graph with a capacity equal to $ p_i $. In terms of a cut $ (S, T) $, the set $ S - s $ represents the projects we undertake. The capacity of these edges contributes to the total profit of the positive-profit projects that we do **not** undertake. Minimizing this value aligns with our objective of finding a minimum cut in the flow network.

#### Edges Adjacent to Sink $ t $

For projects $ i $ where $ p_i < 0 $, we introduce edges $ (i, t) $ with capacity $ -p_i $. Again considering a cut $ (S, T) $, these edges contribute to the total cost (expressed as a positive number) of the negative-profit projects that we do undertake. Minimizing this cost is also in line with our minimum-cut objective.

### Enforcing Feasibility Constraints

Now, what about the original edges in the project selection DAG? How do we set their capacities to make sure that any minimum cut $ (S, T) $ corresponds to a feasible set of projects $ S - s $?

#### Modeling Feasibility

For edges $ (i, j) $ inherited from the project selection DAG, we set the capacity to infinity $ \infty $. You don't have to use an actual infinite value; any sufficiently large number that's greater than an upper bound on the maximum flow value will suffice. This way, a cut will have a finite capacity **if and only if** the corresponding set $ S - s $ is feasible. 

### Interpreting Finite-Capacity Cuts

Let's consider a finite-capacity cut $ (S, T) $. By construction, $ S - s $ would be a feasible set of projects. The capacity of this cut is the sum of:

- The total profit of the positive-profit projects **not** in $ S - s $
- The total cost (as a positive number) of the negative-profit projects in $ S - s $

If $ P $ denotes the total profit of all positive-profit projects, the capacity of the cut $ (S, T) $ can also be expressed as $ P $ minus the profit of the projects in $ S - s $. Minimizing the cut capacity, therefore, directly corresponds to maximizing the profit of the set $ S - s $.

By carefully setting the capacities of the edges adjacent to the source and sink, as well as those in the original project selection DAG, we've successfully transformed the Project Selection Problem into a Minimum Cut problem. Solving this Minimum Cut problem gives us an optimal solution to the original Project Selection Problem, fulfilling our objective of maximizing profit while adhering to all constraints.




## Maximum Cardinality Matching in Bipartite Graphs
***

We'll explore how to compute a Maximum Cardinality Matching (MCM) in bipartite graphs by reducing it to a network flow problem. This technique allows us to solve the MCM problem using polynomial-time algorithms designed for network flow.

### Preliminaries

- **Undirected Graph $ G = (V, E) $**: Consists of a set of vertices $ V $ and a set of edges $ E $.
- **Matching**: A subset of edges $ E $ in $ G $ such that each vertex in $ V $ is adjacent to at most one edge in the subset.
- **Maximum Cardinality Matching (MCM)**: A matching with the maximum possible number of edges.

### Bipartite Matching

A bipartite graph $ G = (V, E) $ can be partitioned into two sets $ X $ and $ Y $ such that every edge in $ E $ connects a vertex in $ X $ to a vertex in $ Y $. Remarkably, such a partition can be computed in $ O(|E| + |V|) $ time using Breadth-First Search (BFS) or Depth-First Search (DFS).

#### Creating a Corresponding Flow Network $ G^* $

To reduce the problem to a network flow problem, we construct a corresponding flow network $ G^* = (V^\*, E^\*) $ with integer capacities as follows:

- **Vertices**: $ V^* = V \cup \{s, t\} $, where $ s $ and $ t $ are source and sink vertices, respectively.
- **Edges**: Three sets of edges $ E^\*_1, E^\*_2, $ and $ E^\*_3 $ are created.
  1. $ E^*_1 $ contains a directed edge from $ s $ to each vertex in $ X $.
  2. $ E^*_2 $ contains a directed edge $ (x, y) $ for each undirected edge $ (x, y) $ in $ E $.
  3. $ E^*_3 $ contains a directed edge from each vertex in $ Y $ to $ t $.

- **Capacities**: All edges have a capacity of 1.

#### Existence of 0-1 Maximum Flow $ f $ in $ G^* $

The capacities are integers, so $ G^* $ has an integer maximum flow. Moreover, because capacities are unitary (1), any integer flow in $ G^* $ is a 0-1 flow—meaning the flow through each edge is either 0 or 1.

#### Key Claims

1. **Claim 1: $ v \geq |M| $**
  
    Given a matching $ M $ in $ G $, we can construct a flow $ f' $ in $ G^* $ with a value of $ |M| $. The proof involves tracing the flow along the directed edges corresponding to $ M $. Therefore, the value of the maximum flow $ v $ must be at least as large as $ |M| $.

2. **Claim 2: $ v \leq |M| $**
  
    The maximum flow $ f $ will pass through exactly $ v $ edges in $ E^*_2 $, and these edges correspond to a cardinality-$ v $ matching in $ G $. Thus, $ v $ cannot be larger than $ |M| $.

#### Summary

Claims 1 and 2 together confirm that $ v = |M| $. By calculating $ f $, we can extract a maximum cardinality matching $ M' $ in $ G $. As the size of $ G^* $ is polynomial in the size of $ G $ and $ f $ can be computed in polynomial time, the overall algorithm runs in polynomial time as well.

With this reduction technique, you can effectively find the Maximum Cardinality Matching in a bipartite graph using well-established network flow algorithms, allowing for efficient solutions to a range of real-world problems.


## Hall's Theorem via Network Flow
***

Hall's Theorem is a classic result in combinatorial mathematics, often used to analyze matchings in bipartite graphs. A bipartite graph, denoted as $ G = (V, E) $, can be partitioned into two disjoint sets $ X $ and $ Y $ such that each edge connects a vertex in $ X $ to a vertex in $ Y $. A question that arises is: under what conditions can we find a perfect matching, i.e., a matching that covers every vertex in $ X $?

The maximum number of edges in any matching is bounded above by the size of set $ X $, denoted $ |X| $. This makes intuitive sense: each vertex in $ X $ can be part of at most one matching edge.

### The Hall Condition
For any subset $ X' $ of $ X $, we define $ \Gamma(X') $ as the set of all vertices in $ Y $ that have at least one adjacent vertex in $ X' $.

**Claim 1:**  
If $ G $ has a perfect matching of size $ |X| $, then for every subset $ X' $ of $ X $, $ |\Gamma(X')| \geq |X'| $.

This claim implies that if $ |\Gamma(X')| < |X'| $ for any subset $ X' $, there will be vertices in $ X' $ that remain unmatched in any matching.

### Hall's Theorem
**Theorem:**  
A bipartite graph $ G $ admits a perfect matching of size $ |X| $ if and only if the Hall condition holds: $ |\Gamma(X')| \geq |X'| $ for all subsets $ X' $ of $ X $.

### Proof Using Max-Flow Min-Cut Theorem
To complete the proof of Hall's theorem, we employ the max-flow min-cut theorem. Let's denote the corresponding flow network as $ G^\* = (V^\*, E^\*) $.

**The Key Observation:**  
The size of the Maximum Cardinality Matching (MCM) in $ G $ is equal to the value of the maximum flow in $ G^* $.

We aim to show that if the Hall condition holds, then the maximum flow value in $ G^* $ will be $ |X| $.

**Proof Sketch:**  
1. **Minimum Cut Capacity:** Using max-flow min-cut theorem, we argue that the capacity of the minimum cut in $ G^* $ is $ |X| $.
  
2. **Arbitrary Cut Capacity:** For any arbitrary cut $ (S, T) $ in $ G^* $, we demonstrate that its capacity is at least $ |X| $.

The edges of $ E^\* $ can be partitioned into three layers: $ E^\*_1, E^\*_2, $ and $ E^\*_3 $. For any cut $ (S, T) $, the contributions of these layers to the cut capacity are carefully analyzed. The crucial insight here is that the Hall condition ensures the lower bound on the cut capacity, thereby proving the theorem.

#### Conclusion
Hall's theorem provides a powerful criterion to determine the existence of perfect matchings in bipartite graphs. By connecting it with network flow concepts, specifically the max-flow min-cut theorem, we not only understand its conditions better but also provide a constructive way to find such matchings.
