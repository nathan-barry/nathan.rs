+++
title = "Amortized Analysis"
date = 2023-09-24T14:51:35-05:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}


## Amortized Analysis: An Introduction
***

Amortized analysis is a powerful tool in the realm of algorithmic analysis. Instead of just focusing on the worst-case scenario of individual operations, it looks at the performance of an algorithm over a sequence of operations. This helps provide a more holistic understanding of how an algorithm will behave, especially when not every operation can be the worst-case scenario.

**Why Use Amortized Analysis?**

Let's say you have a data structure like a dictionary, which supports operations like Insert, Delete, and Find. Typically, we analyze the worst-case cost of each individual operation. But when determining the upper bound of a sequence of these operations, we simply sum up their worst-case costs. This can sometimes be an overestimate because it's highly unlikely that every operation in a sequence is the worst-case.

To get a more accurate estimate, we employ amortized analysis.

### Methods of Amortized Analysis

1. **The Aggregate Method:** This method looks at the average performance over a sequence of operations. Essentially, you calculate the total cost of a series of operations and divide it by the number of operations to determine an average cost per operation.

2. **The Accounting Method:** Also known as the banker's method, this approach involves charging certain operations a bit more than their actual cost so that other operations can be charged less. The goal is to ensure that when you sum up these "banked" costs over a sequence of operations, it covers the actual costs.

3. **The Potential Function Method:** This is a more mathematical approach where a "potential energy" or value is associated with the state of the data structure. The change in potential energy between consecutive operations can give insights into the cost of operations.

### Understanding Amortized Costs

When using amortized analysis, the goal is to assign an "amortized cost" $\hat{c_i}$ to each operation such that for any sequence of $n$ operations:

1. The sum of actual costs $\sum_{i=1}^{n} c_i$ is less than or equal to the sum of the amortized costs $\sum_{i=1}^{n} \hat{c_i}$.
2. Evaluating $\sum_{i=1}^{n} \hat{c_i}$ should be straightforward.
3. Ideally, the sum of amortized costs is a tight bound, meaning $\Theta(\sum_{i=1}^{n} c_i)$.

Amortized analysis offers a more nuanced perspective on algorithmic performance. While worst-case analysis provides invaluable insights, amortized analysis gives us an understanding of the long-term behavior of algorithms, which can be especially useful in real-world applications where the worst-case scenario might be rare. By understanding and applying the different methods of amortized analysis, we can gain a deeper comprehension of algorithm performance over a series of operations.






## Amortized Analysis Methods
***

Below are three methods of amortized analysis: the Aggregate Method, the Accounting Method, and the Potential Function Method.


### 1. Aggregate Method

*Principle:* This method relies on the observation that while some operations might be costly, they are rare. The high cost of these "expensive" operations can be averaged out by many "cheap" operations.

*Key Points:*

- The main goal is to show that for every "expensive" operation, many "cheap" operations must precede or succeed it.
  
- This method allows us to distribute the high cost of an expensive operation across several cheap operations, essentially "averaging" out the cost.

- Often, after the averaging, all operations might have the same amortized cost. When this happens, it becomes straightforward to calculate the total cost by just multiplying the number of operations with the averaged out cost.


### 2. Accounting Method

*Principle:* Think of this method as a bank account. You overcharge for some operations and "store" the surplus in a "bank" (as tokens). When an expensive operation occurs, you use these tokens to "pay" for the extra cost.

*Key Points:*

- You augment the state of your data structure $D$ with "tokens". These tokens are used purely for analysis and do not change the data structure's functionality.

- A "cheap" operation may have an amortized cost that's higher than its actual cost. The difference is stored as tokens.

- Conversely, an "expensive" operation might have an amortized cost less than its real cost. The extra cost is offset by using previously stored tokens.

- If no tokens are present initially, then the sum of actual costs will always be less than or equal to the sum of the amortized costs.


### 3. Potential Function Method

*Principle:* This method associates a "potential energy" with the state of the data structure. The change in this potential energy can give insight into the operation's cost.

*Key Points:*

- For each state $D$ of the data structure, there's a corresponding potential $\Phi(D)$.

- The amortized cost, $\hat{c_i}$, for an operation is defined as its actual cost plus the change in potential: $\hat{c_i} = c_i + \Phi(D_i) - \Phi(D_{i-1})$.

- Summing up all the $\hat{c_i}$ gives us the total cost plus the potential difference over the entire sequence of operations.

- Typically, we set the initial potential $\Phi(D_0)$ to zero and ensure $\Phi(D)$ is non-negative for all states $D$. This ensures the total actual cost will be less than or equal to the sum of the amortized costs.

- An analysis using the accounting method can often be translated to the potential function method. This is because the total number of tokens in the data structure at any point can represent its potential.


Each of these methods offers a different perspective on understanding the long-term behavior of algorithms. By using them effectively, we can gain a comprehensive understanding of how an algorithm will perform across a series of operations, beyond just worst-case scenarios. This insight is crucial for real-world applications where efficiency and predictability are paramount.


## Examples
***

### Analyzing a Stack with MultiPop Operation

Let's present the analysis of the Stack data structure supporting a MultiPop operation using the three amortized analysis methods. This will be broken down for easier understanding and readability.

We're examining a stack with the ability to conduct the typical *Push* and *Pop* operations, with an added *MultiPop* function. The *MultiPop* operation takes a number, $k$, as its argument and removes the top $k$ items from the stack. The actual cost of *Push* and *Pop* is 1, but the actual cost of *MultiPop* is $k$.

#### 1. Aggregate Method:

*Analysis:*

- If we have $x$ *Push* operations, $y$ *Pop* operations, and $z$ *MultiPop* operations, then the total operations are $n = x + y + z$.
  
- Let's say $k$ items are removed by all the *MultiPop* operations. Then, the total cost of all operations will be $x + y + k$.
  
- Given that the number of items pushed, $x$, is always greater than or equal to the sum of items popped and removed ($y + k$), the total cost will be no more than $2x$.
  
- Since $x$ can be at most $n$, the total cost is $2n$.
  
*Conclusion:* With the Aggregate Method, every operation has an amortized cost of 2, making the maximum cost for $n$ operations $2n$.

#### 2. Accounting Method:

*Analysis:*

- We maintain one token for every item on the stack.

- *Push:* Its actual cost is 1, but we leave a token with the item. Thus, its amortized cost is 2 (1 for the operation and 1 for the token).

- *Pop:* Costs 1, but we use the token with the item to pay for it, leading to an amortized cost of 0.

- *MultiPop(k):* Costs $k$, but the $k$ tokens associated with the items removed pay for it, giving an amortized cost of 0.

*Conclusion:* Using the Accounting Method, every operation also has an amortized cost of at most 2. Hence, the maximum cost for $n$ operations is again $2n$.

#### 3. Potential Function Method:

*Analysis:*

- Define the potential of a state, $\Phi(D_i)$, as the number of items on the stack in that state.

- For a *Push* operation, $\hat{c_i} = c_i + \Phi(D_i) - \Phi(D_{i-1}) = 1 + 1 = 2$.

- For a *Pop* operation, $\hat{c_i} = c_i + \Phi(D_i) - \Phi(D_{i-1}) = 1 - 1 = 0$.

- For a *MultiPop(k)*, $\hat{c_i} = c_i + \Phi(D_i) - \Phi(D_{i-1}) = k - k = 0$.

*Conclusion:* With the Potential Function Method, every operation also has an amortized cost of at most 2, leading to a maximum cost of $2n$ for $n$ operations.


#### Overall Conclusion

Across all three methods, it is consistent that the amortized cost for any operation on the stack is at most 2. This means for any sequence of $n$ operations, starting from an empty stack, the worst-case cost will be $2n$. This provides a much tighter and more accurate bound than the naive $O(n^2)$ estimation.



### Analyzing Incrementing a Binary Counter
<hr class="sub">

Let's dive into the analysis of the Binary Counter with its sole operation - increment. The actual cost of an increment is determined by the number of bits flipped. Through amortized analysis, we aim to find a more accurate representation of the average cost over a sequence of operations.

The data structure in question is a binary counter that starts at zero. When incrementing the binary counter, the cost is equivalent to the number of bits that change. The aim is to provide an improved analysis over the simplistic worst-case $O(n \log n)$ estimate.

#### 1. Aggregate Method:

*Analysis:*

- The least significant bit (low-order bit) always flips, so over $n$ increments, it will flip $n$ times.
  
- Every 2nd, 4th, 6th, etc., increments will flip the second-least significant bit. Over $n$ operations, it will flip at most $n/2$ times.
  
- Similarly, every 4th, 8th, 12th, etc., increments will flip the third least significant bit. It will flip at most $n/4$ times over $n$ operations.
  
- Continuing this pattern, the total bit flips can be represented as: $n(1 + \frac{1}{2} + \frac{1}{4} + ...)$ which sums up to $≤ 2n$.

*Conclusion:* With the Aggregate Method, the amortized cost of each increment operation is 2. Thus, for $n$ operations, the total cost is $2n$.

#### 2. Accounting Method:

*Analysis:*

- A token is associated with each '1' bit in the binary counter. Initially, the counter is at zero, so there are no tokens.
  
- When we increment, and there are $k$ trailing 1s in the current state $D_{i-1}$, the real cost is $k+1$, since we flip all the trailing 1s to 0 and the 0 immediately preceding them to 1.
  
- The amortized cost, considering the token accounting, remains 2 for each operation, because we account for the 1s flipped and introduce a new token for the newly created 1.
  
*Conclusion:* Using the Accounting Method, each increment operation has an amortized cost of 2. Therefore, the total cost for $n$ operations remains $2n$.

#### 3. Potential Function Method:

*Analysis:*

- The potential function, $\Phi(D)$, is defined as the number of 1 bits in the binary counter at state $D$.
  
- This approach is a translation of our Accounting Method. The tokens associated with 1s in the accounting method are now seen as potential energy stored in the 1 bits of the binary counter.
  
*Conclusion:* The Potential Function Method reaffirms our previous analyses, showing that each increment operation has an amortized cost of 2. Consequently, the total cost for $n$ operations is $2n$.


#### Overall Conclusion

Regardless of the method used, amortized analysis consistently shows that the cost for incrementing a binary counter is 2 per increment. Hence, for a sequence of $n$ increments, the cost is $2n$, offering a tighter bound than the initial $O(n \log n)$ estimation.



### Understanding Dynamic Table Operations
<hr class="sub">

The Dynamic Table is a concept used for automatic resizing of an array or list data structure to accommodate growing elements efficiently. The idea is to reduce the frequency of resizing and copying over elements, which is an expensive operation. Let's delve into the amortized analysis of the Insert operation on such a dynamic table.

In our Dynamic Table, an 'Insert' operation appends an element to its end. If the table is full during an insertion, it is resized to double its current capacity, requiring copying of the existing elements.

#### Potential Function Method:

This method helps determine the 'hidden' cost or potential associated with each operation, ensuring that enough potential is stored up to cover the expensive operations.

*Analysis:*

1. Let $ f(D) $ represent the number of elements in table $ D $, and $ g(D) $ represent its capacity. Every insert increases $ f(D) $ by 1.

2. We aim to define a potential function, $ \Phi(D) $, of the form: $ a \cdot f(D) + b \cdot g(D) $, where $ a $ and $ b $ are constants.

#### Case of a “Cheap” Insertion (No Resizing):

For these insertions, the capacity remains the same:

$$ \Phi(D_i) - \Phi(D_{i-1}) = a $$

The amortized cost for this operation is $ a + 1 $.

#### Case of an “Expensive” Insertion (Resizing Required):

For such insertions, the table's capacity doubles:

$$ \Phi(D_i) - \Phi(D_{i-1}) = a + b \cdot g(D_{i-1}) $$

To offset the cost of moving elements during resizing, we set $ b $ to -1. Thus, the amortized cost for this operation also becomes $ a + 1 $.

#### Amortized Cost for First Insertion:

The very first insertion when the table is empty and gets resized to a capacity of 1:

$$ \text{Amortized cost} = 1 + (a - 1) = a $$

#### Selecting Values for $ a $ and $ b $:

1. Since our table is always at least half-full (because we resize only when it's completely full), ensuring the potential function is non-negative requires setting $ a $ to 2.
2. As previously deduced, we set $ b $ to -1 to offset the cost of moving elements during resizing.

With these values, the amortized cost of each insertion is $ 2 + 1 = 3 $.

#### Conclusion:

Through the potential function method of amortized analysis, we ascertain that the amortized cost for each insertion operation on our Dynamic Table is 3. This means that even though some operations might be expensive due to resizing, when averaged out over a series of operations, the cost per operation remains constant at 3. For $ n $ insertions, the total actual cost won't exceed $ 3n $.



### Managing Deletions in a Dynamic Table
<hr class="sub">

In addition to the 'Insert' operation, our Dynamic Table needs to support the 'Delete' operation that targets the last entry. To ensure the table doesn’t get too sparse, the table maintains a consistent "load factor" that doesn't dip below 1/4.

**Understanding Deletions:**

1. **Deletion causing shrinkage:** When removing an item would reduce the table's fill to below 1/4th, the table's capacity is halved and the contents are copied over. Special cases include:
   - For initial capacities of 1, 2, or 4, the table is emptied (capacity is set to 0) with a cost of 1.
   - For capacities 2k (where k > 2), the new capacity is 2k-1 with a cost of 2k-2.

2. **Deletion without shrinkage:** If deleting doesn't cause the table's fill to drop below 1/4th, the last item is simply removed with a cost of 1.

#### Designing the Potential Function:

For a table where the fill $ f(D) $ is at least half of its capacity $ g(D) $, the potential function should behave similarly to the 'Insert' only scenario.

However, for a fill $ f(D) $ between 1/4 and 1/2 of the capacity, the potential function must:
   - Increase gradually up to $ g(D)/4 $ as the table empties.
   - Drop close to zero when the table's capacity gets halved.

#### The Potential Function $ \Phi(D) $:

1. When $ f(D) $ is greater than or equal to $ g(D)/2 $, the potential function mirrors the insertion-only scenario.
2. Otherwise, it's defined as $ \Phi(D) = g(D)/2 - f(D) $.

This function ensures a constant upper bound on the amortized cost per operation, making the total cost for a series of n operations O(n).

#### Final Thoughts on Potential Function Arguments:

Potential function arguments have proven valuable for estimating the total costs across operations. Beyond just evaluating costs, potential functions can also analyze the output quality of an algorithm. While our focus here was on the Dynamic Table, such concepts have broader applications, shedding light on algorithm behaviors and ensuring effective computational strategies.



## Prediction from Expert Advice
***

In decision-making, expert advice is invaluable. Yet, when presented with conflicting suggestions, how can we ensure our choices aren't vastly inferior to the best expert's advice? Here, we discuss the concept of "regret minimization" and present an algorithm, the Weighted Majority Algorithm, which aims to align our decisions closely with the best-performing expert over time.


**The Majority Algorithm:** A simple approach where decisions are based on the consensus majority of expert opinions. But, what if a significant majority is consistently wrong? This approach would fail in such cases. The solution? Assign weights to each expert based on their past accuracy.

### Weighted Majority Algorithm:

- **Initialization:** Begin with a weight $ w_i(1) $ of 1 for each expert $ i $ (where $ 1 \leq i \leq n $).

- **Weight Adjustments:** On any given day $ t $:
  - If expert $ i $ is correct: $ w_i(t+1) = w_i(t) $
  - If expert $ i $ is incorrect: $ w_i(t+1) = (1 - \epsilon)w_i(t) $
    - Here, $ w_i(t) $ denotes the weight of the expert on day $ t $, while $ k $ stands for the number of errors the expert made before day $ t $.

- **Decision-making:** On day $ t $, use the weighted majority of expert predictions to decide on a 'yes' or 'no'.


### Analyzing the Weighted Majority Algorithm:

- **Potential Function:** Define $ \Phi(t) $ as the sum of weights on day $ t $.

- **Lemma:** If an error is made on day $ t $:
  $ \Phi(t+1) \leq (1 - \epsilon/2)\Phi(t) $
  - This accounts for the fact that a significant portion of the weighted experts could be wrong.

- **Theorem:** 
  The number of mistakes we make, denoted as $ r $, in the first $ T $ days is bounded by:
  $ r \leq 2s(1 + \epsilon) + (2/\epsilon) \ln n $
  - Where $ s $ is the least number of errors made by any expert during the same period.


By adjusting the weight assigned to each expert based on their performance, the algorithm aims to bring our decisions closer to those of the most reliable expert. This offers a more reliable and efficient mechanism for decision-making when confronted with multiple expert opinions. 
