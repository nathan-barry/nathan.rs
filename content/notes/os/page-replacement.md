+++
title = "Page Replacement & The Working Set Model"
date = 2023-09-16T12:13:55-05:00
tags = ["Operating Systems Notes"]
+++

{{< toc >}}



## **Clock Algorithm**
***

Understanding the intricate workings of an operating system is crucial. One such essential aspect is how the OS manages memory, particularly the page replacement strategies it employs when there's a page fault.

The Clock page replacement algorithm serves as an approximation of the Least Recently Used (LRU) algorithm.

1. **Process & Address Space**:
   - A **process** is the main unit of abstraction in an OS, ensuring protection and isolation.
   - Every process defines an **address space**. However, the address space we generally speak of is virtual or logical.
   - These virtual address spaces get mapped to physical memory spaces. It's noteworthy that for any given process, the virtual addresses range from 0 up to the maximum size allotted for that process.

2. **The Illusion of Infinite Memory - Paging**:
   - The OS uses the concept of **paging** to give the semblance of unlimited memory.
   - To achieve this, **page tables** come into play. They assist in translating addresses and locating data.
   - The **Translation Lookaside Buffer (TLB)** enhances the time performance, ensuring quicker address translation.
   - Meanwhile, multi-level page tables boost spatial efficiency.

3. **Clock Algorithm**:
   - At its core, the Clock algorithm maintains a circular list of pages present in memory.
   - This list is maneuvered by a **clock hand**, which invariably points to the oldest page.
   - The hand's primary objective is to sweep through the pages, identifying one with a reference bit of 0. Pages with a reference bit set to 0 haven't been accessed in a complete revolution of the clock and thus can be replaced.
   - Each page within this metaphorical clock face maintains three bits:
     1. **Resident bit**: Indicates if the page is currently in memory.
     2. **Reference bit**: Signals if the page was recently accessed. 
     3. **Frame number**: Specifies the frame where the page resides.

### Clock Algorithm Pseudocode:

```python
def clock_replacement():
    while (victim_page != found):
        if (current_page.reference_bit == 0):
            replace_current_page()
        else:
            reset_reference_bit()
        advance_clock_pointer()
```

This algorithm can be visualized with pages arranged in a circle, representing the clock's face, with the clock hand moving over them. The circular list is, in essence, a representation of all resident pages from the page table. 



## Enhanced Clock Page Replacement Algorithm
***

Page replacement algorithms aim to decide which memory pages to swap out, write to disk when a page of memory needs to be allocated. The **Enhanced Clock Page Replacement** algorithm, often referred to as the **Second Chance Algorithm**, offers an improvement over the basic clock algorithm by using more information about each page, specifically the reference and modify bits.

### Determining Which Page To Replace
- Pages not written are cheaper to replace because they don't need to be written back to disk.
- The algorithm checks both the **reference bit** and the **modify bit** to make this decision. Based on these bits, pages fall into one of four classes:
  - **(0,0)**: Neither recently used nor modified. Ideal candidate for replacement.
  - **(0,1)**: Not recently used but was modified. Requires write-back but might not be needed soon.
  - **(1,0)**: Recently used but not modified. Might be needed again soon.
  - **(1,1)**: Both recently used and modified.
  
### Second Chance Behavior

1. The OS may need to cycle up to three times to locate a (0,0) class page.
2. If a (0,0) page is located, it's replaced.
3. Upon encountering a (0,1) page:
   - **Option 1**: Start an I/O operation to write that page, lock it in memory until I/O completes, reset the modified bit, and continue the search simultaneously with the I/O.
   - **Option 2**: Clear the dirty bit and move on, making a mental note that the page is dirty. Only write the page if it's evicted later on.
4. Pages with set reference bits have them cleared.
5. If the first pass doesn't find a (0,0) page, the status of (0,1) or (1,0) pages might change in the second pass.



## Temporal and Spatial Locality
***

Programs often display two types of locality:

1. **Temporal Locality**: If a specific memory location was accessed recently, it's likely to be accessed again soon.
2. **Spatial Locality**: When a memory location is accessed, nearby memory locations are likely to be accessed shortly after.

About 90% of a program's execution is sequential. Iterative constructs, like loops, usually involve a small set of instructions that get repeatedly executed.

For large data structures, the primary computational cost is often sequential processing on individual elements.

## The Working Set Model
***

The **working set** of a process refers to the set of pages that the process is actively using. Informally, it’s the pages the process needs right now. More formally, it encompasses all pages that a process has referenced in the past $T$ seconds. The concept is based on the assumption that if a page was referenced recently, it's likely to be accessed again soon.

**Key Points**:

- Only the pages in the working set are kept in memory. This might mean pages are removed even if no page fault occurs.
  
- The number of frames a process uses can change over time, allowing dynamic adjustments based on actual needs.
  
- This approach can support "pre-paging", where anticipated future pages are loaded into memory in advance.

**Implementation**: The system tracks the last $T$ references. The pages accessed during these $T$ memory accesses comprise the working set. Here, $T$ is termed the "window size". Memory status is tracked by the "age" of each page. When a page turns 5 ticks old, it's evicted.


### Optimizing the Window Size

By dynamically adjusting the pages in memory based on actual access patterns, this method can significantly reduce the number of page faults and enhance overall system performance. However, it's crucial to choose an appropriate window size $T$ for optimal performance.

- **Large \( T \)**: When \( T \) is too big, more pages are kept in memory than immediately necessary, leading to inefficient memory utilization.

- **Small \( T \)**: When \( T \) is too small, it might not capture the actual working set of a process, resulting in frequent page faults.

As a guideline, consider the cost of a page fault. If a page fault takes 10ms, equivalent to 2 million instructions, \( T \) should be set much larger than 2 million to prevent frequent page faults.

### Thrashing

**Thrashing** refers to the situation where memory is frequently over-committed, resulting in constant page evictions even though they are still actively needed. This leads to a severe drop in performance due to frequent page faults. To prevent thrashing in a multiprogrammed system:

1. Ensure a reasonable amount of physical memory.
2. Carefully choose the value of \( T \) based on system workloads.
3. Implement page replacement algorithms that can predict and preemptively handle potential thrashing scenarios.



## Load Control
***

**Load Control** pertains to the management of the number of processes that can concurrently reside in memory.

- The **Working Set Model** offers an implicit form of load control by permitting a process to run only if its working set can be accommodated in the memory.
  
- However, the allocation of frames to processes is not constant, leading to potential discrepancies.

- If the cumulative number of pages required exceeds the available frames, processes are moved (or swapped) to disk, freeing up memory space.

**The Suspended State**: When a process is entirely evicted from memory, it's transferred to a swap area on the disk, introducing a new phase in the process life cycle termed as **suspended**.
  
- This suspended state isn't exclusive to load control but was also observed in relocation scenarios where entire processes were swapped out.
- A process can enter the suspended state from other states, usually when they are blocked or ready. Conversely, a process can transition from being suspended back to a ready state.

**Process Selection for Swapping**: The criteria for selecting which process to swap out when reducing the multiprogramming level can be based on:
  - Lowest priority
  - Smallest size
  - Largest size
  - Oldest age
  - Frequency of page faults (Faulting process)



## Choosing Page Sizes
***

The decision regarding the size of a page is pivotal and influences system performance. Over time, page sizes have been seeing a gradual increase.

- **Benefits of Small Pages**:
  - Efficient memory utilization.
  - Facilitates a higher degree of multiprogramming.

- **Benefits of Large Pages**:
  - Diminished page tables.
  - Lesser I/O time.
  - Reduced occurrences of page faults.

- The trend towards larger page sizes can be attributed to:
  - Affordability of memory: With small pages, page tables might become enormous, and the concern of internal fragmentation diminishes.
  - Disparity in speed: CPUs are advancing at a pace surpassing that of disks. Therefore, page faults, which cause a substantial slowdown, are becoming more consequential.
