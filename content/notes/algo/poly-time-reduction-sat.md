+++
title = "Polynomial Time Reduction, Satisfiability, & Complexity Classes"
date = 2023-10-23T07:57:52-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}


## Polynomial-Time Reductions in Algorithms
*** 

A computational problem $X$ is said to be **polynomial-time reducible** to another computational problem $Y$, denoted as $X \leq_P Y$, if any instance of $X$ can be solved through two key steps:

1. A polynomial number of standard computation steps.
2. A polynomial number of calls to a "black box" that solves $Y$.

**Note**: The polynomial bound includes the time taken to read the input and write the output for each call to the black box.

For example, the maximum-cardinality bipartite matching problem is polynomial-time reducible to the maximum flow problem. Similarly, the maximum flow problem is polynomial-time reducible to the linear programming problem.

### Significance of Polynomial-Time Reductions

#### Proving Upper Bounds

Polynomial-time reductions help identify problems that can be solved efficiently. If $Y$ is a problem that is polynomial-time solvable and $X \leq_P Y$, then it is guaranteed that $X$ is also polynomial-time solvable.

#### Proving Hardness

Conversely, if $X$ is suspected to be computationally "hard" (i.e., not polynomial-time solvable), and if $X \leq_P Y$, then $Y$ is likely to be hard as well.

#### Potential Pitfalls

Be cautious not to reduce in the wrong direction. Always remember, $X \leq_P Y$ implies that the hardness of $X$ is less than or equal to the hardness of $Y$. Hence, showing $X \leq_P Y$ eliminates the possibility that $X$ is hard and $Y$ is not.

### Polynomial-Time Reductions Transitivity

Reductions can be "chained together". That is, if $X \leq_P Y$ and $Y \leq_P Z$, then $X \leq_P Z$.

Suppose there are constants $c_1, c_2, c_3,$ and $c_4$ such that:

- Any instance of $X$ of size $n$ can be solved using $O(n^{c_1})$ steps plus $O(n^{c_2})$ calls to a black box for $Y$ with instance size $O(n^{c_1})$.
- Any instance of $Y$ of size $n$ can be solved using $O(n^{c_3})$ steps plus $O(n^{c_4})$ calls to a black box for $Z$ with instance size $O(n^{c_3})$.

By chaining these, any instance of $X$ can be solved using $O(n^{c_1 c_3 + c_2})$ steps plus $O(n^{c_1 c_4 + c_2})$ calls to a black box for $Z$ with instance size $O(n^{c_1 c_3})$.

#### Conclusion

Polynomial-time reductions offer a structured way to compare the complexity of computational problems. They allow us to build on known "easy" or "hard" problems to determine the computational difficulty of new problems. This makes them an indispensable tool in the field of algorithms and computational complexity theory.






## Satisfiability of Propositional Formulas (SAT)
***

The **Satisfiability Problem (SAT)** holds a central role in the study of computational complexity theory. Given a propositional formula $ f $, which is composed of logical connectives like AND ($ \land $), OR ($ \lor $), and NOT ($ \lnot $), the SAT problem aims to find whether there exists a truth assignment to the variables in $ f $ that makes $ f $ evaluate to true.

**Definitions**

- **Propositional Formula ($ f $)**: A logical expression made up of variables and connectives.
- **Satisfiable**: A formula $ f $ is considered satisfiable if a truth assignment exists that makes $ f $ true.

### The 3-SAT Problem

The **3-SAT problem** is a specific version of the SAT problem with some additional constraints:

1. The input formula is the conjunction (AND) of multiple "clauses."
2. Each clause is a disjunction (OR) of exactly three "literals."
3. A literal can either be a variable or its negation.
4. Each clause contains three literals associated with distinct variables.

A formula meeting these conditions is said to be in **3-CNF (Conjunctive Normal Form)**.

**Definitions**

- **Clause**: A disjunction (OR) of literals.
- **Literal**: Either a variable or its negation.
- **3-CNF Form**: A special formula format satisfying the conditions of the 3-SAT problem.
  

### Reduction from SAT to 3-SAT

The process of reducing a general SAT problem to a 3-SAT problem can be outlined as follows:

1. Take a given SAT instance $ f $ and construct a parse tree $ T $.
2. Introduce an extra variable for each internal node in $ T $ to create a new formula $ f' $.

#### Conditions

- The size of $ f' $ is polynomial (linear) to the size of $ f $.
- $ f $ is satisfiable if and only if $ f' $ is satisfiable.
- $ f' $ is also composed of various clauses, each in one of specific formats involving variables $ a, b, c $.

#### Completing the Reduction

To complete the reduction, each clause in $ f' $ can be rewritten as a logically equivalent 3-CNF formula. The resultant 3-CNF formula $ f'' $ is satisfiable if and only if $ f $ is satisfiable.

#### Example: Rewriting $ a \leftrightarrow b \land c $ in 3-CNF Form

A clause like $ a \leftrightarrow b \land c $ can be rewritten into 3-CNF form by generating a truth table for $ \lnot g $, where $ g = a \leftrightarrow b \land c $. Following the principles of De Morgan's Law, $ g $ can then be represented in 3-CNF form.



## Decision Version of Linear Programming
***

**Problem Statement:** Given:

- An $ m \times n $ matrix $ A $
- An $ m \times 1 $ column vector $ b $
- An $ n \times 1 $ column vector $ c $
- A bound $ \lambda $

Is there an $ n \times 1 $ column vector $ x $ such that:

$$
c^{\top}x \geq \lambda, \quad Ax \leq b, \quad x \geq 0
$$

Here, $ c^{\top}x $ denotes the objective function. Since standard linear programming can be solved in polynomial time, this decision problem belongs to the complexity class P.

### Integer Linear Programming (ILP)

In **Integer Linear Programming (ILP)**, the problem statement remains the same as that in standard Linear Programming, with the additional constraint that all entries in $ A, b, c, $ and $ x $ are integers.

#### Complexity

Counterintuitively, ILP is actually harder to solve than Linear Programming. There is no known polynomial-time algorithm to solve ILP, and it is unlikely that one exists.

### 0-1 Integer Linear Programming (0-1 ILP)

The decision version of ILP can be further restricted to **0-1 ILP**, where all elements in the solution vector $ x $ can only be either 0 or 1.

#### Relation to Knapsack Problem

It's worth noting that the Knapsack Problem can easily be framed as a 0-1 ILP. Just like ILP, no polynomial-time algorithm is known to solve the Knapsack Problem.

#### Complexity Reduction: 3-SAT $\leq_P$ 0-1 ILP

The 3-SAT problem can be reduced to 0-1 ILP in polynomial time. Given an instance $ f $ of 3-SAT, one can construct a 0-1 ILP instance $ I $ such that $ f $ is in 3-SAT if and only if $ I $ is in 0-1 ILP.


## Maximum Independent Set Problem
***

Given an undirected graph $ G = (V, E) $, an **independent set** is a subset $ U $ of $ V $ such that no two vertices in $ U $ are adjacent (i.e., connected by an edge in $ E $). The Maximum Independent Set Problem aims to find a maximum-cardinality independent set in $ G $.

### Decision Version: IS (Independent Set)

In the decision version, you're given an undirected graph $ G $ and an integer bound $ k $. The goal is to determine whether $ G $ has an independent set of size at least $ k $.

#### Complexity Reduction: 3-SAT $\leq_P$ IS

The 3-SAT problem can be polynomially reduced to the Maximum Independent Set problem. Given an instance $ f $ of 3-SAT, we can construct an instance $ (G, k) $ of IS such that $ f $ belongs to 3-SAT if and only if $ (G, k) $ belongs to IS.


### The Transformation Process

Understanding the transformation between 3-SAT and the Maximum Independent Set problem (IS) helps us grasp how these seemingly different problems are interrelated. Below is an elucidation of this transformation, which verifies the complexity relation 3-SAT $\leq_P$ IS.

#### Constructing the Graph $ G $

1. **Vertices**: For a 3-SAT instance $ f $ with $ m $ clauses, create $ 3m $ vertices in graph $ G $.
2. **Triangles**: Partition the vertices into $ m $ triangles, each corresponding to a clause in $ f $.
3. **Edges**: Inside each triangle, connect all vertices to form a complete subgraph.

#### Additional Edges
Besides the edges forming the triangles, add edges between vertices $ u $ and $ v $ from different triangles if and only if the literal associated with $ u $ is the negation of the literal associated with $ v $.

#### Setting $ k $

Set $ k = m $, the number of clauses in $ f $.

### Correctness of the Transformation

The transformation is valid if it's a bijection between solutions of the 3-SAT problem and the Maximum Independent Set problem.

#### "If" Direction: $ (G, k) \to f $

If $ (G, k) $ belongs to IS, then $ f $ belongs to 3-SAT.

1. **Independent Set $ U $**: Assume that $ U $ is an independent set in $ G $ of size $ k $ (or $ m $).
2. **One Vertex per Triangle**: $ U $ includes exactly one vertex from each of the $ m $ triangles.
3. **Literal Set $ S $**: Let $ S $ be the set of literals corresponding to vertices in $ U $.
4. **No Conflicting Literals**: By the construction of $ G $, $ S $ contains no pair of literals $ \ell $ and $ \lnot \ell $.
5. **Satisfying Truth Assignment**: There exists a truth assignment that makes all literals in $ S $ true, thereby satisfying $ f $.

#### "Only If" Direction: $ f \to (G, k) $

If $ f $ belongs to 3-SAT, then $ (G, k) $ belongs to IS.

1. **Satisfying Assignment $ \sigma $**: Assume $ \sigma $ is a truth assignment that satisfies $ f $.
2. **Choosing Vertices**: For each clause $ C_i $, pick a literal that is satisfied by $ \sigma $, and let $ u_i $ be its corresponding vertex in $ G $.
3. **Independent Set $ U $**: $ U = \{ u_i \mid 1 \leq i \leq m \} $, and $ |U| = m = k $.
4. **U is Independent**: No two vertices in $ U $ are adjacent, making it an independent set in $ G $.

By showing these two directions, we confirm that the transformation is correct, reinforcing the complexity relationship 3-SAT $\leq_P$ IS.



## Turing Machine Model of Computation
***

Complexity theory deals with the categorization of computational problems based on the amount of computational resources they require. Central to this theory are Turing machines and the famous P vs NP question. Below are some important concepts.

1. Defining Complexity Classes
    - The Turing machine model is often used as a baseline for defining complexity classes such as P (Polynomial time). 
2. Turing Machine Capabilities
    - It's generally accepted that any practical (implementable) model of computation can be simulated by a Turing machine, usually with polynomial slowdown.

3. Quantum vs Classical Turing Machines
    - Quantum Turing machines are thought to be exceptional in that they can potentially perform certain computations exponentially faster than classical Turing machines.

### Nondeterministic Turing Machines (NTMs)

Nondeterministic Turing machines serve as an abstract model for sequential computation. It's widely believed that no practical computer can efficiently simulate an NTM—that is, not with just a polynomial slowdown.

#### Role in Defining NP
Traditionally, the class NP is characterized as the set of languages "accepted" by polynomial-time nondeterministic Turing machines. We'll discuss a more modern definition based on polynomial-time verification later.

## Some Complexity Classes
***

### The Class NP

A language $ L $ is in NP if there exists a polynomial-time algorithm $ A(x, y) $ and a constant $ c $ such that:
- If $ x $ belongs to $ L $, then there exists a string $ y $ with $ |y| = O(|x|^c) $ for which $ A(x, y) $ outputs 1.
- If $ x $ does not belong to $ L $, then $ A(x, y) $ outputs 0 for all $ y $.

#### Verifiers and Certificates
In this context, $ A $ is often called the "verifier", and $ y $ is considered a "certificate" or "proof" attesting to whether $ x $ belongs to $ L $ or not.

#### The P vs NP Question

The fundamental question in complexity theory is whether P equals NP. That is, are all problems that can be verified in polynomial time also solvable in polynomial time?

**Containment and Separation**

It's evident that $ P \subseteq NP $ since every problem that can be solved in polynomial time can also be verified in polynomial time. However, whether there exist problems in $ NP $ but not in $ P $ remains an unsolved question.

**Significance**

Solving the P vs NP question would have far-reaching implications, affecting fields from cryptography to optimization, and is thus considered the central problem in complexity theory.

By exploring these foundations, complexity theory aims to deepen our understanding of computational tractability and the inherent difficulty of computational problems.


### The Class UNSAT

The language "UNSAT" is considered the complement of "SAT" (Satisfiability). A string $ x $ belongs to UNSAT if and only if $ x $ does not belong to SAT.

The asymmetric nature of NP's definition complicates designing a polynomial-time verifier for UNSAT. As a result, it's commonly believed that no such verifier exists for UNSAT.

### The Class co-NP
The class "co-NP" includes all languages $ L $ such that their complement belongs to NP. UNSAT is an example of a language that belongs to co-NP.

**Relationship with NP and P**

Both NP and co-NP may be subsets of P, though this is considered unlikely. Note that P naturally belongs to both NP  and co-NP .
