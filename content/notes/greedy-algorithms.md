+++
title = "Greedy Algorithms"
description = "These are my notes from Greg Plaxton's Algorithms class at UT Austin. Most of the content closely follows the slides covered in lecture."
date = 2023-08-27T15:11:32-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}



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
