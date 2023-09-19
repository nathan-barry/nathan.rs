+++
title = "Garbage Collection"
description = "These are my notes over Professor Norman's Operating Systems course. Notes closely follow the in class lecture slides."
date = 2023-09-16T12:44:08-05:00
tags = ["Operating Systems Notes"]
priority = 11
+++

{{< toc >}}



## Garbage Identification
***

In theory, garbage refers to any object that the program will never reference in the future. These are termed as "dead objects." The catch here is that neither the compiler nor the runtime system can identify these dead objects conclusively.

In practice, an object is considered garbage if the program cannot access it anymore. These are known as "unreachable objects." The immediate question that follows is, how do we discern which objects are unreachable?

### Challenges in Identifying Garbage

The task of detecting garbage is neither simple nor cost-effective. Some of the challenges include:

- **Performance Efficiency**: The time it takes to identify garbage might be proportional to either the dead objects or the live ones, contingent on the method employed.
  
- **Frequency of Collection**: Running the garbage collection process less often can save on total time but has repercussions. It might necessitate more space and extend the pause times, which refers to the durations the program is halted to carry out the garbage collection. This underscores the classic tradeoff between space and time.

### Reachability via Tracing

Reachability plays a pivotal role in the garbage collection paradigm. To break it down:

- **Tracing**: This method explores the reachability from program "roots." These roots are often the variables and elements that the program first comes into contact with, such as registers, the stack, and static variables. The algorithm:
    1. Marks the objects that can be reached directly from these roots.
    2. Extends this marking to cover a transitive closure over them.
    3. Any object that doesn't get marked in this process is deemed unreachable.

By periodically tracing through program roots and marking accessible objects, we can efficiently identify and reclaim memory spaces that are no longer of use, ensuring that our programs run efficiently and our systems remain responsive.



## Garbage Collection Fundamentals
***

When assessing the efficiency and effectiveness of a garbage collection algorithm, the following factors come into play:

- **Space Efficiency**: How effectively does the algorithm use memory?
- **Efficiency of Allocator**:
    - Time taken to allocate memory.
    - How well it manages the locality of contemporaneously allocated objects.
- **Time to Collect Garbage**: The speed of the algorithm in collecting and freeing up memory. Incremental reclamation, where memory is reclaimed in phases, can be considered as an option.

Below are some core algorithmic components of garbage collection:

1. **Allocation**: This refers to the allocation of memory spaces. There are various strategies used for allocation, including:
   - **Free List**: A list of blocks of free memory. When an allocation request arises, a suitable block is chosen from the free list and handed over.
   - **Bump Allocation**: This is a simple allocation method where the pointer to free memory is incremented every time an allocation occurs.

2. **Identification**: This is all about identifying which objects are garbage, i.e., objects that are no longer required by the program. The commonly used strategies are:
   - **Tracing (Implicit)**: This involves following pointers from the root to mark accessible objects.
   - **Reference Counting (Explicit)**: Here, the program or the programmer keeps a count of how many objects are using a specific pointer.

3. **Reclamation**: Once garbage is identified, the next step is to reclaim the memory. The prevalent strategies are:
   - **Sweep-to-Free**: After marking all accessible objects, the memory areas that remain unmarked are "swept" free.
   - **Compact**: This strategy involves rearranging the memory to bring all the live objects closer, thus freeing up a continuous block of memory.
   - **Evacuate**: This involves copying all live objects to a new memory area, leaving behind a block of entirely free memory.

### Reclamation Approaches

**1. Non-copying Approach**:
   - Relies on free-list allocation and reclamation.
   - It's the only viable method for explicit memory management.
   - **Example**: Mark-Sweep, where the algorithm marks all live objects and then sweeps the memory to free unmarked blocks.

**2. Copying Approach**:
   - Typically uses bump pointer allocation.
   - Undertakes reclamation in bulk.
   - **Examples**: Mark-Compact and Semi-Space. In Mark-Compact, live objects are moved closer together (compacted), while in Semi-Space, they're moved to a fresh memory area.



## Different Garbage Collectors
***

There have been numerous garbage collectors proposed over the years, each with its unique methodology. Here are some notable ones:

- **Mark-Sweep [McCarthy, 1960]**:
  - Utilizes a free list for allocation.
  - Employs tracing to mark live objects.
  - Uses the sweep-to-free method to reclaim memory.
  
- **Mark-Compact [Styger, 1967]**:
  - Relies on bump allocation to allocate memory.
  - Uses tracing for identification.
  - Employs compacting to reclaim memory.

- **Semi-Space [Cheney, 1970]**:
  - Uses bump allocation for memory allocation.
  - Employs tracing for garbage identification.
  - Uses evacuation to reclaim memory.

### Mark-Sweep Garbage Collection

The **Mark-Sweep** method is a classic garbage collection strategy initially proposed by McCarthy in 1960. It operates by marking live objects and sweeping away the unmarked ones to reclaim memory. Let's break down the components of this garbage collection method:

1. **Free Lists Organized by Size (Binning)**:
   - Blocks of memory are organized based on their size. This can be blocks of the same size or individual objects of the same size.
   - Most objects tend to be small, often less than 128 bytes.
   - **Free List Setup**:
     - Different free lists are maintained for different sizes, e.g., 4, 8, 12, 16,..., up to 128 bytes.
     - Each list keeps track of a specific number of free memory chunks.
     - Each of these chunks resides somewhere within the heap.

2. **Allocation**:
   - When an allocation is requested, a pointer to free space is taken off the free list.
   - The first object is then allocated on the heap.
   - Subsequent objects may be allocated on the heap, which are referenced by this initial object.
   - If there's no more memory available of the required size, this triggers the garbage collection process.

3. **Mark Phase**:
   - This phase involves identifying all live objects through a process known as transitive closure marking.

4. **Sweep Phase**:
   - After marking live objects, the next step is to sweep or clear the memory of all unmarked (and thus, unreachable) objects.
   - The memory reclaimed from these objects is added back to the free lists.
   - Sweeping can be done incrementally by dividing the heap into blocks and sweeping one block at a time as needed.

###### Pros:
- **Space Efficiency**: Mark-Sweep is good at optimizing memory use.
- **Incremental Reclamation**: This strategy can reclaim memory incrementally.
- **Fast Collection**: The actual garbage collection process is straightforward and very rapid.

###### Cons:
- **Slow Allocation**: Compared to some other methods, the allocation time in Mark-Sweep can be relatively slow.
- **Poor Locality**: Objects allocated around the same time (contemporaneously) might not be located close to each other in memory, leading to potential performance issues.

### Mark-Compact Garbage Collection

**Mark-Compact** is another prominent garbage collection method, introduced by Styger in 1967. It builds upon the principles of the Mark-Sweep approach but introduces a compaction phase to improve memory utilization. It works as listed below:

1. **Mark Phase**:
   - Like the Mark-Sweep method, the first step involves marking all the live (reachable) objects.

2. **Compaction Phase**:
   - After marking the live objects, Mark-Compact adds an additional step: it copies all the remaining objects in the heap to one end, effectively compacting them. This step aids in alleviating fragmentation and ensures better memory organization.

3. **Allocation**:
   - Unlike Mark-Sweep, which uses a free-list for allocation, Mark-Compact utilizes bump pointer allocation. This means that allocation is often faster and simpler as it can allocate memory in a continuous block without needing to search for an appropriate-sized space.


###### Pros:
- **Fast Allocation with Good Locality**: Objects that are allocated around the same time tend to be placed close to each other in memory. This can lead to performance improvements due to better cache utilization.
- **Space Efficiency**: By compacting memory, Mark-Compact ensures optimal usage of available memory.

###### Cons:
- **Expensive Multi-pass Collection**: The additional compaction step can make the garbage collection process slower as it requires more passes over the memory compared to Mark-Sweep.
- **Performance**: Despite its advantages, the total performance of Mark-Compact might be worse than Mark-Sweep in certain scenarios.

### Semi-Space Garbage Collection

**Semi-Space** garbage collection is a unique method that uses a two-part heap strategy: the “to space” and the “from space”.

1. **Initialization**:
   - Objects are initially allocated in the “to space”.
   
2. **Tracing and Copying**:
   - When “to space” fills up, the trace algorithm starts.
   - The roles reverse: the current “to space” turns into the “from space”, and objects reachable are copied into the other section of the heap.

3. **Mark Phase**:
   - During collection, when an object is first encountered, it's copied over to the “to space” in the other section of the heap.
   - Forwarding pointers are installed to indicate the new location of the object, ensuring any other pointers referencing the old location are updated accordingly.
   - The algorithm then updates all pointers to ensure that the “to space” consists solely of reachable objects.

4. **Clearing the “From Space”**:
   - After moving all reachable objects, the other half of the heap (“from space”) is cleared completely.

5. **Resuming Allocation**:
   - Allocation restarts in the “to space”, using the fast bump pointer allocation.

###### Pros:
- **Fast Allocation**: Thanks to the bump pointer mechanism, object allocation is rapid.
- **Good Locality**: Objects allocated around the same time or those related to each other are kept close in memory. This enhances performance due to improved cache utilization.
- **Simplified Garbage Collection**: All collections are done in a single pass, making the process faster than mark-compact.

###### Cons:
- **Space Inefficiency**: Only half of the heap can be used for allocation at any given time.
- **Massive Memory Cleanup**: Rather than incremental reclamation, the method requires clearing memory all at once.

### Generational Heap Organization
In **Generational Heap Collection**, memory management is optimized based on the observation that different objects have different lifespans.

**How it Works**:
1. The heap is divided into two primary segments: **young** and **old**.
2. New objects are allocated within the **young space**.
3. When the **young space** becomes full:
   - A collection is run, moving live objects to the **old space**.
4. When the **old space** becomes congested:
   - Both the **young** and **old spaces** undergo collection.
   - Live objects are transferred to a fresh "to space".
5. This method can be generalized to multiple generations (m). When a space n (where n is less than m) fills up, spaces ranging from n through n-1 are collected.
