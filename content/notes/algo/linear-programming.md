+++
title = "Linear Programming"
date = 2023-10-16T09:20:51-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}


## Linear Programming
***

Linear Programming (LP) is a technique used for optimizing a linear objective function subject to a set of linear equality or inequality constraints. In simpler terms, it helps you find the best way to achieve a particular goal, like maximizing profit or minimizing cost, given certain restrictions.


### Canonical Form

The canonical form of a linear programming problem is usually written as follows:

$$
\text{Maximize } c^T x
$$
$$
\text{Subject to } Ax \leq b, \quad x \geq 0
$$

Here,

- $ A $ is an $ m \times n $ matrix of coefficients.
- $ b $ is an $ m \times 1 $ column vector.
- $ c $ is an $ n \times 1 $ column vector.
- $ x $ is an $ n \times 1 $ column vector of variables to be determined.

#### Components Explained

- $ c^T x $ is the objective function we aim to maximize.
- $ Ax \leq b $ represents the set of constraints in inequality form.
- $ x \geq 0 $ specifies that the variables are non-negative.

#### Example Problem

Let's understand this with an example:

$$
\text{Maximize } 3x_1 + 2x_2
$$
$$
\text{Subject to } x_1 + x_2 \leq 10, \quad 0 \leq x_1 \leq 8, \quad 0 \leq x_2 \leq 5
$$

In this example,

- $ m = 3 $ and $ n = 2 $
- $ A = \left[\begin{array}{cc}
1 & 1 \\\
1 & 0 \\\
0 & 1
\end{array}\right] $, $\qquad b = \left[\begin{array}{c}
10 \\\
8 \\\
5
\end{array}\right] $, $\qquad c = \left[\begin{array}{c}
3 \\\
2
\end{array}\right] $

Geometrically speaking, the optimal solution is $ (x_1, x_2) = (8, 2) $ with an optimal objective function value of 28.

### Special Cases in Linear Programming

#### Infeasible Linear Programs

A Linear Program is said to be infeasible when no solution exists that satisfies all constraints. For example, consider maximizing $ x_1 $ subject to $ x_1 \leq -5 $ and $ x_1 \geq 0 $.

#### Unbounded Linear Programs

A Linear Program is said to be unbounded when the objective function can take infinitely large positive values. For example, consider maximizing $ x_1 $ subject to $ x_1 \geq 0 $.

### Alternate Canonical Forms

It's worth noting that there are other ways to express LPs. One such way is:

$$
\text{Maximize } c^T x
$$
$$
\text{Subject to } Ax = b, \quad x \geq 0
$$

You can easily convert between the two forms. For instance, every equality constraint can be rewritten as two inequalities, and vice-versa, by introducing "slack" variables.



## Application to Network Flow Problems
***

### The Maximum Flow Problem

In network flow problems, we can also express issues like maximizing flow in a network using LP. For a given network $ G = (V, E) $, the objective is to maximize the net flow out of the source node, $ s $, while adhering to capacity and conservation constraints.

The objective function can be written as:

$$
\text{Maximize } \left( \sum_{(s, v) \in E} x_{(s, v)} \right) - \left( \sum_{(v, s) \in E} x_{(v, s)} \right)
$$

### Other Network Flow Problems

- **Min-Cost Flow Problem**: Introduces edge-specific costs and aims to find a minimum-cost flow routing.
- **Multicommodity Flow Problem**: Considers multiple source-sink pairs and aims to find the optimal flow for multiple commodities.

Both problems can be easily formulated as LPs.



## Computational Complexity of Linear Programming
***

**The Simplex Algorithm:**

Developed by George Dantzig in the 1940s, the Simplex algorithm is a classical method for solving linear programming problems. While it tends to run quite efficiently in practice, its worst-case time complexity is exponential.
Some variants are known to have "smoothed" polynomial complexity, meaning they perform well under slight random perturbations of the input data.


**Khachiyan's Ellipsoid Algorithm:**

In 1979, Leonid Khachiyan introduced the Ellipsoid algorithm, marking the first polynomial-time algorithm for solving linear programming problems. Before this breakthrough, it was an open question whether linear programming could be solved in polynomial time.

**Karmarkar’s Algorithm:**

Introduced in 1984, Karmarkar's algorithm also runs in polynomial time and belongs to a class of algorithms known as "interior point methods." The algorithm offered a more efficient alternative to the simplex and ellipsoid algorithms, especially for certain types of problems.





## Duality in Linear Programming
***

Every linear programming problem has a corresponding dual problem. If the primal problem is in the canonical form:

$$
\text{Maximize } c^T x
$$
$$
\text{Subject to } Ax \leq b, \quad x \geq 0
$$

Then its dual is given by:

$$
\text{Minimize } y^T b
$$
$$
\text{Subject to } A^T y \geq c, \quad y \geq 0
$$

Here, $y$ is an $m \times 1$ column vector of dual variables.

### Primal-Dual Relationship

When discussing a pair of linear programs, the initial linear program is often referred to as the "primal," and its corresponding dual is aptly named the "dual."

In essence, the primal and dual problems offer two different perspectives on the same problem. Every constraint in the primal corresponds to a variable in the dual, and vice versa. Specifically:

- For $ 1 \leq i \leq m $, the primal has a constraint $ \sum_{j=1}^{n} a_{i,j} x_j \leq b_i $, and the dual has a corresponding variable $ y_i $.
- For $ 1 \leq j \leq n $, the primal has a variable $ x_j $, and the dual has a corresponding constraint $ \sum_{i=1}^{m} a_{i,j} y_i \geq c_j $.


### Dual of the Dual in Linear Programming

In linear programming, the dual of the dual brings us back to the original primal problem. This circular relationship can be mathematically represented as follows:

1. Dual: $ \text{Maximize } (-b)^T y $ subject to $ -A^T y \leq (-c) $ and $ y \geq 0 $
2. Dual of the Dual: $ \text{Minimize } (-c)^T x $ subject to $ (-A) x \geq (-b) $ and $ x \geq 0 $

This is mathematically equivalent to the original primal problem:
$$ \text{Maximize } c^T x $$ subject to $ Ax \leq b $ and $ x \geq 0 $$

#### Implications

The cyclical nature of this relationship means that, in the context of a primal-dual pair of linear programs, the labels "primal" and "dual" are interchangeable to some extent.

### Weak Duality Theorem

**Theorem:**

For a primal problem $ \text{Maximize } c^T x $ subject to $ Ax \leq b $ and $ x \geq 0 $, and its dual $ \text{Minimize } y^T b $ subject to $ A^T y \geq c $ and $ y \geq 0 $, the Weak Duality Theorem states:

$$ c^T x \leq y^T b $$

if $ x $ is feasible for the primal and $ y $ is feasible for the dual.

#### Proof Sketch

- $ A^T y \geq c $ implies $ y^T A \geq c^T $.
- Since $ x \geq 0 $, we get $ y^T A x \geq c^T x $.
- With $ A x \leq b $, we have $ y^T A x \leq y^T b $.

#### Consequences of Weak Duality

1. **Optimality:** If $ c^T x = y^T b $ for some feasible $ x $ and $ y $, then both are optimal solutions for their respective problems.
2. **Infeasibility:** If the primal is feasible and unbounded, then the dual is infeasible.
3. **Both Infeasible:** It's possible for both the primal and dual to be infeasible.

### Strong Duality Theorem

**Theorem:**

If either:

1. The primal and dual are feasible, or
2. The primal is feasible and bounded,

then both the primal and dual are feasible and bounded, and their optimal objective function values are equal.

### Combinations of Primal-Dual Pairs

There are essentially three scenarios for any linear program:

1. **Feasible and Bounded:** If the primal is feasible and bounded, the dual is also feasible and bounded.
2. **Feasible and Unbounded:** If the primal is feasible and unbounded, then the dual is infeasible.
3. **Infeasible:** If the primal is infeasible, the dual can either be feasible and unbounded or infeasible.

## Dual of the Maximum Flow Linear Program
***

Linear programming (LP) serves as a powerful framework for solving the Maximum Flow problem. The dual of the maximum flow LP provides insights into the minimum capacity cut problem, thereby corroborating the max-flow min-cut theorem.

### Primal Formulation of Maximum Flow

The primal maximum flow LP can be expressed as:

$$ \text{Maximize } \left( \sum_{(s,v) \in E} x_{s,v} \right) - \left( \sum_{(v, s) \in E} x_{v, s} \right) $$
Subject to:
- $ 0 \leq x_e \leq c(e) $ for all $ e \in E $
- $ \sum_{(u,v) \in E} x_{u,v} = \sum_{(v,u) \in E} x_{v,u} $ for all $ v \in V \setminus \{s, t\} $

### Dual Formulation of Maximum Flow

The dual seeks to minimize $ \sum_{e \in E} \alpha_e \cdot c(e) $ subject to a complex set of constraints. These constraints involve dual variables $ \alpha_e $ for each edge and $ \beta_v, \gamma_v $ for each vertex except $ s $ and $ t $.

#### Simplifying the Dual

To simplify, introduce an unrestricted variable $ \delta_v = \gamma_v - \beta_v $ for each $ v \in V \setminus \{s, t\} $, along with $ \delta_s = 1 $ and $ \delta_t = 0 $. This makes the dual constraints:

$$ \alpha_{u,v} + \delta_v - \delta_u \geq 0 $$
$$ \alpha \geq 0, \delta_s = 1, \delta_t = 0 $$

#### Key Claims about the Dual

1. Claim 1: Bound on $ \delta_v $
    - There exists an optimal solution where $ \delta_v \leq 1 $ for all $ v \in V $.

2. Claim 2: Feasibility of $ \delta_v $
    - There exists an optimal solution where $ 0 \leq \delta_v \leq 1 $ for all $ v \in V $.

#### Interpretation and Equivalent Forms

The dual can be reframed to:

$$ \text{Minimize } \sum_{(u,v) \in E} \max(0, \delta_u - \delta_v) \cdot c(e) $$
Subject to:
- $ \delta_v \in \{0, 1\} $ for all $ v \in V $
- $ \delta_s = 1 $ and $ \delta_t = 0 $

### Correspondence to Minimum-Capacity Cut

A feasible $ \delta $ can be viewed as defining a cut $ (S, T) $ where $ S = \{ v \in V | \delta_v = 1 \} $ and $ T = \{ v \in V | \delta_v = 0 \} $. The objective function value becomes the total capacity from $ S $ to $ T $, confirming that the dual problem corresponds to finding the minimum capacity cut.

#### Connection to Max-Flow Min-Cut Theorem

The strong duality theorem in linear programming offers an alternative proof for the max-flow min-cut theorem.



## Complementary Slackness
***

The concept of complementary slackness serves as a cornerstone in the realm of optimization, particularly in linear programming (LP). It sets the conditions for the optimality of feasible solutions in the primal and dual problems.

### Complementary Slackness Theorem

The theorem states:

For feasible solutions $ x $ in the primal and $ y $ in the dual to be optimal, two conditions must hold:
1. For each constraint in the primal problem that is not binding (non-tight), the corresponding dual variable must be zero.
2. For each constraint in the dual problem that is not binding (non-tight), the corresponding primal variable must be zero.

#### "If" Direction: Proving Optimality

Let's assume $ x $ and $ y $ are feasible solutions for the primal and dual that satisfy conditions 1 and 2:

1. Condition 1 implies that $ y^T(b - Ax) = 0 $, and consequently $ y^T Ax = y^T b $.
2. Condition 2 entails that $ (y^T A - c^T) x = 0 $, resulting in $ y^T Ax = c^T x $.

From both equations, we derive that $ c^T x = y^T b $, proving that $ x $ and $ y $ are indeed optimal for their respective problems.

#### "Only If" Direction: From Optimality to Conditions

Assume $ x $ and $ y $ are already optimal solutions for the primal and dual problems. In that case:

1. By strong duality, $ c^T x = y^T Ax = y^T b $.
2. This implies $ y^T (b - Ax) = 0 $, substantiating condition 1 since $ y \geq 0 $ and $ b - Ax \geq 0 $.
3. Similarly, $ (y^T A - c^T) x = 0 $, thus validating condition 2 as $ y^T A - c^T \geq 0 $ and $ x \geq 0 $.

By fulfilling two intuitive yet impactful conditions, one can confidently ascertain the optimality of solutions for both the primal and the dual, offering a potent tool in the toolbox of optimization techniques.






## Maximin and Minimax Strategies
***

Two-player zero-sum games can be modeled effectively through linear programming. 

One classic example of such a game is "rock-paper-scissors." In these games, the key concern for both players is to determine their optimal mixed strategies. In this context, the column player aims for a maximin strategy, while the row player seeks a minimax strategy.

### The Maximin Strategy for the Column Player

The column player's goal is to find a mixed strategy $ x $, where $ x_j $ is the probability of selecting column $ j $, such that the minimum expected payoff is maximized. Formally, the problem can be represented as:

$$
\text{Maximize } \min_{1 \leq i \leq m} \sum_{1 \leq j \leq n} a_{i,j} x_j
$$
subject to 
$$
\sum_{1 \leq j \leq n} x_j = 1, \quad x \geq 0
$$

#### Canonical Form of Maximin Strategy

This problem can be converted into a standard LP form:

$$
\text{Maximize } \alpha'
$$
subject to 
$$
\sum_{1 \leq j \leq n} (-a_{i,j}) x_j + \alpha' \leq 0, \quad \sum_{1 \leq j \leq n} x_j \leq 1, \quad x \geq 0, \quad \alpha' \geq 0
$$

### Dual of the Maximin Strategy: Minimax for the Row Player

The dual problem can be written as:

$$
\text{Minimize } \beta'
$$
subject to
$$
\sum_{1 \leq i \leq m} (-a_{i,j}) y_i + \beta' \geq 0, \quad \sum_{1 \leq i \leq m} y_i \geq 1, \quad y \geq 0, \quad \beta' \geq 0
$$

#### Simplified Form of Minimax Strategy

The dual problem can be simplified further to:

$$
\text{Minimize } \max_{1 \leq j \leq n} \sum_{1 \leq i \leq m} a_{i,j} y_i
$$
subject to
$$
\sum_{1 \leq i \leq m} y_i = 1, \quad y \geq 0
$$

#### Equilibrium Through Maximin and Minimax

The strong duality theory implies that both the optimal objective function values for the maximin and minimax strategies are equal, denoted by $ \lambda $. This yields an equilibrium in the game, making neither player want to deviate from their strategy if the other player commits to theirs.

### Complementary Slackness in Maximin/Minimax Equilibrium

In the context of a two-player zero-sum game, complementary slackness can reveal intriguing insights:

- Let $ C $ be the set of columns with positive probability in the column player's maximin strategy, and $ R $ the set of rows with positive probability in the row player's minimax strategy.
  
- If the column player adheres to a strategy within $ C $ and the row player follows the minimax strategy, the expected transfer will precisely be $ \lambda $.

- Similarly, if the row player sticks to a strategy within $ R $ while the column player opts for the maximin strategy, the expected transfer will also be $ \lambda $.

#### Conclusion

Linear programming provides a powerful framework for finding optimal strategies in two-player zero-sum games. Through the primal-dual relationship between maximin and minimax strategies, we achieve an equilibrium point that neither player has an incentive to deviate from. Complementary slackness conditions further shed light on the properties of this equilibrium, pinpointing the strategies that will result in an expected payoff of $ \lambda $.
