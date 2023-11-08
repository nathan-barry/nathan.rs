+++
title = "NP Completeness & 3-Dimensional Matching"
date = 2023-10-30T07:04:35-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}



## NP-Completeness
***

A language $L$ is said to be NP-complete if it meets two conditions:

1. $L$ belongs to NP, the set of decision problems that can be verified by a non-deterministic polynomial-time algorithm.
2. For every language $L'$ in NP, there exists a polynomial-time reduction $L' \leq_{P} L$.

This means that an NP-complete language is not just a member of NP, but also a "hardest" or "most representative" problem in NP.

### Significance of an NP-Complete Language Belonging to P

#### Scenario 1: $L$ is NP-Complete and Belongs to P
If some language $L$ is both NP-complete and belongs to P (the class of problems that can be solved in polynomial time), then $P = NP$. This would mean every problem that can be verified in polynomial time can also be solved in polynomial time.

**Proof Sketch:**
- Let $L'$ be a language in NP.
- Because $L$ is NP-complete, $L' \leq_{P} L$.
- Since $L$ belongs to P, we deduce that $L'$ also belongs to P.

#### Scenario 2: $L$ is NP-Complete and Does Not Belong to P
If $L$ is NP-complete and does not belong to P, then no NP-complete language can belong to P. In simpler terms, if even the "easiest" NP-complete problem can't be solved in polynomial time, then none can.

**Proof Sketch:**
- Let $L'$ be another NP-complete language.
- Because $L \leq_{P} L'$ and $L$ does not belong to P, $L'$ also does not belong to P.

### Proving Problems as NP-Complete

To prove that a language $L$ is NP-complete, you can use the following theorem:

**Theorem 1:** If $L$ belongs to NP, and there exists an NP-complete language $L'$ such that $L' \leq_{P} L$, then $L$ is NP-complete.

**Proof Sketch:**
1. Assume that $L$ belongs to NP and $L' \leq_{P} L$.
2. Let $L''$ be any language in NP.
3. Since $L'$ is NP-complete, $L'' \leq_{P} L'$.
4. Applying the transitivity of $\leq_{P}$, $L'' \leq_{P} L$.


## Establishing the Existence of an NP-Complete Language
***

Today, there are tens of thousands of known NP-complete languages. Most of these were proven using Theorem 1. However, to kick-start this process, the existence of the "first" NP-complete language must be established. This is a challenging task, given the infinite number of languages in NP.

### The Cook-Levin Theorem
The Cook-Levin theorem was a breakthrough, proving that the SAT (Boolean Satisfiability) problem is NP-complete. This theorem serves as a starting point for proving other problems as NP-complete.

### Examples of NP-Complete Problems

1. **3-SAT:** By the Cook-Levin theorem, SAT is NP-complete. Since 3-SAT is a specific case of SAT and belongs to NP, it is also NP-complete.
  
2. **0-1 ILP (Integer Linear Programming):** If 3-SAT is reducible to 0-1 ILP in polynomial time, and 3-SAT is NP-complete, then 0-1 ILP is also NP-complete.

3. **IS (Independent Set):** If 3-SAT is reducible to IS in polynomial time, and 3-SAT is NP-complete, then IS is also NP-complete.

#### What About co-NP-Completeness?

A language $L$ is said to be co-NP-complete if it belongs to co-NP and $L' \leq_{P} L$ holds for all languages $L'$ in co-NP. Interestingly, if a language $L$ is NP-complete, then its complement is co-NP-complete. For example, UNSAT (the complement of SAT) is co-NP-complete.

#### Conclusion

Understanding NP-Completeness is crucial for understanding the boundaries of what we can compute efficiently. While many questions still remain in this field, the framework for classifying problems provides valuable insights into the world of computational complexity.

Feel free to delve deeper into this subject by referring to recommended texts for proofs and more advanced topics.



## The 3-Dimensional Matching Problem
***

The 3-Dimensional Matching problem involves three sets of "agents"—men, women, and dogs. The goal is to form "families" from these agents, adhering to specific constraints. Below are intricacies of the problem, its optimization and decision versions, and its relationship to other NP-complete problems like 3-SAT.

**Definitions**

- **Vertices**: The problem involves three types of vertices: men, women, and dogs. 
  - Let $ X $ denote the set of men
  - Let $ Y $ denote the set of women
  - Let $ Z $ denote the set of dogs

- **Family**: A family is a unique combination of one man, one woman, and one dog. Mathematically, a family can be represented as an element of $ X \times Y \times Z $, i.e., as a $(\text{man, woman, dog})$ triple.

- **Acceptable Families ($ F $)**: Given a list $ F $ that contains combinations of families that are acceptable.

- **3-Dimensional Matching ($ S $)**: A subset $ S $ of $ F $ such that no agent (man, woman, or dog) is part of more than one family in $ S $.

**Problem Statement**

The primary goal is to find a subset $ S $ of $ F $ that maximizes the number of families, following the constraints.

### Variants of the Problem

1. The Optimization Version
    - In this version, the objective is to find a maximum-cardinality 3-dimensional matching.
    - Formally, given $ X, Y, Z $, and $ F \subseteq X \times Y \times Z $, the aim is to compute a 3-dimensional matching with the maximum number of families.
2. The Decision Version
    - In this variant, you are given $ X, Y, Z, F \subseteq X \times Y \times Z $, and a positive integer $ k $.
    - The task is to determine whether there exists a 3-dimensional matching with cardinality at least $ k $. This decision version belongs to NP.

### Special Case: Same Cardinality Vertices 

This decision problem focuses on the special case where $ |X| = |Y| = |Z| $ and $ F \subseteq X \times Y \times Z $. The objective is to determine if there exists a "perfect" 3-dimensional matching, i.e., one with cardinality $ |X| $.

It can easily be shown that 3-DM is in NP. Moreover, it can be proven that 3-DM is NP-complete by demonstrating $ 3\text{-SAT} \leq_P 3\text{-DM} $.

#### Transforming 3-SAT to 3-DM

To establish the NP-completeness of 3-DM, we can use a "gadget-based" approach to transform a 3-SAT instance $ f $ into a 3-DM instance $ (X, Y, Z, F) $ in polynomial time.

- **Variable Gadget**: For each variable $ v $ in $ f $, there exists a corresponding fragment in the 3-DM instance that simulates the possibility of setting $ v $ to either true or false.

- **Clause Gadget**: For each clause $ C $ in $ f $, there's a corresponding fragment in the 3-DM instance. This fragment can be matched if and only if the truth assignment associated with the matching of variable gadgets satisfies $ C $.

#### The Key Insight

The 3-DM instance will admit a perfect 3-dimensional matching if and only if the original 3-SAT formula $ f $ is satisfiable.


## The Variable Gadget
***

**Definitions**

- Let $ n $ be the number of variables in $ f $.
- Variables are denoted as $ v_0, v_1, \ldots, v_{n-1} $.
- Let $ m $ be the number of clauses in $ f $.
- Clauses are denoted as $ C_0, C_1, \ldots, C_{m-1} $.

**The Modulo Operator $ \oplus $**

- It's convenient to use the operator $ \oplus $ to refer to addition modulo $ m $.

### Components

- For any variable $ v_j $ in $ f $, where $ 0 \leq j < n $:
  - Let $ X_j $ denote the set of men $ \{ x_{i,j} | 0 \leq i < m \} $
  - Let $ Y_j $ denote the set of women $ \{ y_{i,j} | 0 \leq i < m \} $
  - Let $ Z_j $ denote the set of dogs $ \{ z_{i,j} | 0 \leq i < m \} $
  - Let $ Z^\prime_j $ denote another set of dogs $ \{ z^\prime_{i,j} | 0 \leq i < m \} $
  
### Updating 3-DM Instance

- Add $ X_j $ to $ X $, $ Y_j $ to $ Y $, and both $ Z_j $ and $ Z'_j $ to $ Z $.
- Define $ F_j $ as $ \{(x_{i,j}, y_{i,j}, z_{i,j}) | 0 \leq i < m\} $
- Define $ F^\prime_j $ as $ \{(x_{i \oplus 1,j}, y_{i,j}, z'_{i,j}) | 0 \leq i < m\} $
- Add $ F_j $ and $ F^\prime_j $ to $ F $.

#### Constraints

- No other triples involving a man in $ X_j $ or a woman in $ Y_j $ will be added to $ F $.

### A Key Observation

#### Matching Rules

- To match all of the agents in $ X_j \cup Y_j $, one must either:
  - Select all triples in $ F_j $ and none in $ F'_j $, or 
  - Select all triples in $ F'_j $ and none in $ F_j $.

#### Interpretation

- Selecting all triples in $ F_j $ corresponds to setting the truth value of variable $ v_j $ to true.
- Selecting all triples in $ F'_j $ corresponds to setting the truth value of variable $ v_j $ to false.

#### Conclusion

The Variable Gadget serves as an elegant tool for transforming a 3-SAT instance into a 3-DM instance. This process provides a constructive way to demonstrate that 3-DM is NP-complete, building upon its already established place in NP. The key observation about matching rules allows us to make direct correlations between the 3-SAT and 3-DM problems.


## The Clause Gadget
***

Having discussed the Variable Gadget and its implications, we now turn our attention to the Clause Gadget and the steps to ensure that all agents can be matched in the 3-DM instance. These elements are crucial for transforming a 3-SAT problem into a 3-DM problem, thereby proving the latter's NP-completeness.

### Components

- For each clause $ C_i $ in $ f $, $ 0 \leq i < m $:
  - Add man $ x_i $ to $ X $ and woman $ y_i $ to $ Y $.
  
### Updating 3-DM Instance

- For each literal $ l $ in $ C_i $:
  - If $ l $ is a non-negated variable $ v_j $, then add the triple $ (x_i, y_i, z'_{i,j}) $ to $ F $.
  - If $ l $ is a negated variable $ \lnot v_j $, then add the triple $ (x_i, y_i, z_{i,j}) $ to $ F $.

### Extending a Matching to the Clause Gadgets

- Assume that for each Variable Gadget $ j $, we've chosen either $ F_j $ or $ F'_j $ for our matching.
- This gives us a truth assignment $ \sigma $ for the variables in $ f $.

#### Rules

- If $ \sigma $ satisfies a literal of the form $ v_j $ in $ C_i $, then extend the matching by adding $ (x_i, y_i, z'_{i,j}) $ to $ F $.
- If $ \sigma $ satisfies a literal of the form $ \lnot v_j $ in $ C_i $, then extend the matching by adding $ (x_i, y_i, z_{i,j}) $ to $ F $.

#### The Unmatched Dogs Problem

- After the transformation, we might have some unmatched dogs in $ Z $.
- Specifically, $ |X| = |Y| = mn + m $ but $ |Z| = 2mn $.

#### The Unmatched Count

- The number of unmatched dogs would be $ 2mn - m(n + 1) = m(n - 1) $.

#### Matching the Unmatched Dogs

- To solve this, we introduce "dummy" men and women.
  
#### Augmentation

- For each integer $ k $ such that $ 0 \leq k < m(n - 1) $:
  - Add dummy man $ x'_k $ to $ X $.
  - Add dummy woman $ y'_k $ to $ Y $.
  - Add $ |Z| = 2mn $ triples $ (x'_k, y'_k, z) $ for all $ z $ in $ Z $ to $ F $.

#### Conclusion

By carefully constructing the Clause Gadget and introducing dummy agents, we ensure a complete 3-Dimensional Matching, contingent on the satisfiability of the original 3-SAT problem $ f $. This proves that the 3-DM problem is NP-complete and enhances our understanding of problem transformations within computational complexity theory.

This rounded construction approach ensures that if $ f $ is satisfiable, we can find a matching that includes all agents, even the dummy ones.


## Proof of Correctness for 3-DM and 3-SAT Transformation
***

The transformation of a 3-SAT problem $ f $ into a 3-Dimensional Matching (3-DM) instance $ I $ is the focal point of this study. The primary question that needs addressing is the proof of correctness: Can we establish that $ I $ admits a perfect 3-dimensional matching if and only if $ f $ is satisfiable? This proof comprises two parts, dealing with the "if" and "only if" directions.

### Proof of Correctness: "If" Direction

#### Assumptions and Steps

1. **Initial Assumption**: Assume that $ f $ is satisfiable. Let $ \sigma $ be a truth assignment that satisfies $ f $.
  
2. **Guided Selection**: Use $ \sigma $ to choose between $ F_j $ and $ F'_j $ for matching agents in $ X_j \cup Y_j $, for all $ 0 \leq j < n $.
  
3. **Clause Satisfiability**: For each clause $ C_i $ in $ f $, $ 0 \leq i < m $, pick any satisfied literal and guide the selection of a triple for matching $ x_i $ and $ y_i $.
  
4. **Matching Unmatched Agents**: The remaining unmatched agents are the dummy men and women and $ m(n - 1) $ dogs. These can easily be matched using an additional $ m(n - 1) $ triples.
  
5. **Conclusion**: Thus, $ I $ admits a perfect 3-dimensional matching.

### Proof of Correctness: "Only If" Direction

#### Assumptions and Steps

1. **Initial Assumption**: Assume that $ I $ admits a perfect matching $ M $.
  
2. **Constructing $ \sigma $**: Create the corresponding truth assignment $ \sigma $ for each variable $ v_j $, $ 0 \leq j < n $, based on the presence of either $ F_j $ or $ F'_j $ in $ M $.
  
3. **Variable Setting**: If $ F_j $ is in $ M $, set $ v_j $ to true; if $ F'_j $ is in $ M $, set $ v_j $ to false.
  
4. **Clause Satisfaction**: For each $ i $, $ 0 \leq i < m $, $ M $ contains one of the triples for man $ x_i $ and woman $ y_i $. This implies that the corresponding literal in $ C_i $ is satisfied by $ \sigma $.
  
5. **Conclusion**: Thus, $ f $ is satisfiable under the truth assignment $ \sigma $.

#### Conclusion 

The "If" and "Only If" directions collectively prove the bidirectional relationship between the satisfiability of $ f $ and the existence of a perfect 3-dimensional matching in $ I $. This proves that the 3-DM problem is NP-complete by reduction from 3-SAT, thereby enhancing our understanding of computational complexity theory.
