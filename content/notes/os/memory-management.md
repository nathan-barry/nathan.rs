+++
title = "Memory Management, Paging, & Page Replacement"
description = "An overview of address spaces, relocation, allocation policies, virtual memory, paging, page replacement, the working set, and more."
date = 2023-09-15T17:09:08-05:00
tags = ["Operating Systems Notes"]
+++

{{< toc >}}


## Memory Management Basics
***

Memory management is a cornerstone of operating systems. The primary objective is to maximize the utilization of the system's main memory.

Some important terminology for this section is:

- **Physical Address Space:** 
    - Represents the collection of physical memory addresses that the hardware supports.
    - Ranges from address 0 up to the maximum system address, denoted as `MAXsys`.
    
- **Virtual (or Logical) Address Space:** 
    - Denotes the set of addresses a process can access, essentially from the process's perspective.
    - Spans from address 0 to the maximum address the process can access, represented as `MAXprog`.
    
- **Segment:** 
    - A segment is essentially a contiguous block of physical memory allocated to a process.

### Processes and Abstractions

In an operating system, **processes** are the fundamental abstraction units for ensuring protection.
- Each process is allocated its own **virtual address space**, a contiguous block of addresses ranging from 0 to the maximum value for that specific process. This address space is essentially a logical view of the process's memory.
- However, as our system is grounded in the real world, the logical or virtual address spaces must correspond to **physical address spaces** in the machine's main memory.

When a process is run, techniques called **relocation** are applied. These techniques make sure that the entire process is placed contiguously in physical memory.
- The relocation process necessitates the translation of virtual addresses to physical addresses.
- This step is critical since a process might not always be loaded into the same physical location in memory.

The challenge lies in deciding the right place to allocate a process's address space in the memory. To solve this, various algorithms, commonly known as the "*-fit" algorithms, are used. However, it's noteworthy to mention that these algorithms have faced issues with **external fragmentation**.

### Addressing External Fragmentation

External fragmentation arises when free memory is divided into small chunks, making it impossible to allocate a process that requires a contiguous block of memory. One of the solutions to combat this problem is **compaction**. By moving processes around, compaction ensures that all the free memory is lumped together, thus minimizing fragmentation.

Another technique introduced is **swapping**. Swapping permits more processes to run than the available memory would traditionally allow. When a process is swapped out of the memory, it makes space for other processes. This strategy ensures that the system can run more processes than would fit in memory at a given time.

### Core Goals of Memory Management

1. **Extended Memory Usage**: The system should permit processes to utilize more memory than physically available. This flexibility ensures optimal utilization of resources.
  
2. **Minimize External Fragmentation**: While compaction is a solution, it's also essential to explore other techniques to reduce or eliminate external fragmentation.
  
3. **Memory Allocation & De-allocation**: The system should be able to allocate and de-allocate memory to processes effortlessly. Processes should also have the ability to grow without major hurdles.
  
4. **Memory Sharing**: Processes should have the facility to share memory seamlessly. This feature is crucial for inter-process communication and other shared resource scenarios.
  
5. **Protection**: Protection should be fine-grained, ensuring that one process cannot interfere with the memory of another, unless explicitly permitted.




## Relocation
***
The Operating System, when loading a process, designates a contiguous segment of memory for that process. If the process doesn't fit, the Operating System waits for an existing process to terminate.

The initial (smallest) physical address allocated to the process is known as the `base address`. The largest address the process can access is termed the `limit address`. The `base address` can also be referred to as the `relocation address`.

### Static Relocation
 
The loader is responsible for adjusting the addresses within a process to mirror its actual location in memory. This is achieved by:
- Adding the base address to the address found within the binary.
- Once the process is designated a memory location and begins executing, the Operating System ensures that it remains immobile.

### Dynamic Relocation

Unlike static relocation, dynamic relocation allows for the movement of processes in memory during their execution. This is achieved through hardware assistance.

When operating, the hardware:
1. Adds a relocation register (often termed the "base") to the virtual address to determine the physical address.
2. Compares the resultant address with a limit register. The address must always be lesser than the limit. If it isn't, the processor flags an exception.

#### Pros & Cons of Dynamic Relocation

**Advantages:**
1. **Multiprogramming:** Dynamic relocation supports multiprogramming, allowing multiple processes to co-exist and execute in memory.
2. **Flexibility:** As processes can be moved around, memory allocation is more flexible.
3. **Protection:** Dynamic relocation ensures that each process's memory space is protected from other processes.

**Disadvantages:**
1. **Contiguity:** Processes must be contiguous in memory, which can sometimes be a limitation.
2. **Memory Sharing:** Sharing memory between processes becomes challenging.
3. **Memory Overhead:** The system checks memory access for every instruction, which can be performance-intensive.
4. **Limited Growth:** Processes have limited room to grow within their allocated memory space.

#### Enabling Multiprogramming: Tracking Free Space

To effectively manage memory, the Operating System needs to keep track of:
1. Memory that's available (often termed as "holes").
2. Memory that's currently in use.

Given the dynamic nature of process lifecycle (creation, growth, termination), this state can change rapidly.
The Operating System typically tracks this using a linked list structure called the **free list**.





## Memory Allocation and Placement Policies
***

When a process requests memory, the Operating System must determine where to place that process in memory. The goal of memory allocation policies is to minimize wasted space. There are two primary sources of wasted memory:

- **External Fragmentation:** Unused memory spaces that reside between allocated units.

- **Internal Fragmentation:** Unused memory spaces within an allocated unit. This can be likened to seating three people at a table designed for four.


### First-Fit Memory Allocation

**Definition:** For a request of `n` bytes, the first available block of memory that is greater than or equal to `n` is allocated. In other words, it allocates the first block of memory that it finds.

- **Goal:** Prioritize simplicity in the implementation.
- **Requirements:** 
    - Free block list should be sorted by address.
    - Allocating needs a search for an appropriate block.
    - De-allocating requires checks to possibly merge the freed block with adjacent free blocks.

### Best-Fit Memory Allocation

**Definition:** For a request of `n` bytes, the smallest block of memory that is larger than or equal to `n` is chosen. In other words, we allocate from the smallest block of memory that still fits our number of bytes.

- **Goals:** 
    - Prevent fragmentation of large free blocks.
    - Minimize resulting external fragments.
- **Requirements:** 
    - The free block list should be sorted by size.
    - Allocating needs a search for the best fit.
    - De-allocating requires checks to possibly merge the freed block with adjacent free blocks.

### Worst-Fit Memory Allocation

**Definition:** For a request of `n` bytes, the largest available block of memory that is larger than or equal to `n` is chosen. In other words, we allocate from the largest chunk of memory we find.

- **Goals:** 
    - Prevent accumulation of many tiny memory fragments.
- **Requirements:** 
    - The free block list should be sorted by size.
    - Allocation is generally quick as you select the largest block.
    - De-allocating requires checks to possibly merge the freed block with adjacent free blocks.


Each of the above policies has its own set of advantages and disadvantages. For example, while the first-fit might be fast, it may lead to more external fragmentation over time. Best-fit might reduce fragmentation but can be computationally expensive, and worst-fit might end up wasting more memory in the long run. The choice between them often depends on the specific use case and system requirements.


## Strategies to Eliminate Fragmentation
***

### Compaction

Compaction involves relocating processes so that all the free memory is together in one large block. The programs are adjacent to each other, leaving no spaces in between. This strategy is used to eliminate external fragmentation.

### Swapping

Swapping is a technique where a process is moved from main memory to the disk (swapped out) and then brought back into the main memory (swapped in) for execution at a later time. This method is employed when the system requires more memory resources than are available.

The steps involved in swapping are:
1. **Suspend the Process:** The process which is to be swapped out is first suspended, ensuring it is not currently in execution.
2. **Move Process to Disk:** The address space of the suspended process is transferred to a pre-determined storage area on the disk.
3. **Reallocate Memory:** The memory that was previously occupied by the suspended process is now freed up and can be allocated to other processes.

**Benefits:**
- Swapping can be a useful way to maximize the use of primary memory. By swapping out processes that aren't currently needed and bringing in those that are, the OS can ensure that the most crucial processes get the resources they need.

**Challenges:**
- The act of swapping can be time-consuming, especially if it happens frequently (known as thrashing). The time taken to move data between the main memory and the disk can significantly impact system performance.
























## Paging and Virtual Memory
***

**Virtual Memory** is a mechanism that allows processes to use a virtual address space, which can be substantially larger than the available physical memory. The significant advantage of this approach is that only specific portions of the virtual address space need to be in the physical memory at any given time. This allocation is facilitated by the process of **paging**.

Key points about virtual memory are:
1. Virtual address space is partitioned into uniform segments.
2. Only certain segments of the virtual address space reside in the physical memory at any moment.
3. The virtual address space is divided automatically into uniform chunks. Whenever required, these chunks are brought into memory. But from where? This leads us to the technique of paging.

### Paging Basics

Paging is the method of segmenting a process's virtual address space into fixed-sized units called **pages**. In parallel, the physical memory is viewed as a series of uniform chunks known as **page frames** or simply **frames**.

###### Key Steps in Paging:
1. **Segmentation**: The virtual address space of a process is divided into fixed-sized pages.
2. **Physical Memory View**: The physical memory is seen as a series of equal-sized page frames.
3. **Storing Pages**: These pages are stored in frames within the memory. Deciding the precise moment for this is determined by system policies.
4. **Managing Pages**: The system must periodically review pages in memory, deciding if it's time for their removal, checking if they're still in use, assessing if they've been written to, etc.

### Page Frames and Addressing

Physical memory is uniformly divided into **page frames**. The size of a system's page is the same as its frame size, ensuring consistency. 

An address in memory consists of two parts:
- **f** — the frame number, where the system can have a maximum of "fmax" frames.
- **o** — the frame offset, representing the specific byte within that frame. Given that there can be $o_{max}$ bytes within a frame, the physical address can be represented as: 
$$ \text{Physical address} = o_{\text{max}} \times f + o $$

**Example:**
In a system with a 16-bit address space and 512-byte page frames, the address location (3, 6) would translate to a physical location 1,542.



### Mapping Virtual Addresses to Physical Memory

Paging facilitates a flexible system where pages from a virtual address space (VAS) map to frames in the physical memory. Key things to note:
1. **Contiguity in VAS**: Pages are contiguous in a Virtual Address Space.
2. **Arbitrary Physical Location**: Pages can be located anywhere in physical memory. Additionally, not all pages from VAS need to be mapped to physical memory at once. The unmapped pages are typically stored in secondary storage like a hard drive.



## Address Translation
***

One of the many tasks of an operating system is the translation of virtual addresses to physical ones, ensuring that processes can efficiently and securely access their data.

When a system employs paging, the data pages aren't allocated contiguously in memory. To locate a particular piece of data we use address translation.

### Page Tables

A **page table** maintains a mapping of pages to their corresponding page frames. You can conceptualize the page table as an array of relocation registers, where each register corresponds to a frame. 

- **Mapping Invisibility**: Processes aren't aware of this mapping. From their perspective, they are accessing continuous memory addresses in their virtual address space.
- **Protection Mechanisms**: The page table not only ensures the right mapping but also guarantees protection. This is achieved using mechanisms similar to those employed in dynamic relocation.

### Virtual Address Translation

The virtual address is usually split into two parts: 
1. **Page number (p)**: This part points to an entry in the page table.
2. **Offset (o)**: This signifies a specific location or byte within the page.

When a process wants to access a memory location, it presents a virtual address. The OS then consults the page table, using the page number to find the corresponding frame number. With the frame number and the offset in hand, the OS can access the exact physical memory location.

Additionally, every **Page Table Entry (PTE)** has specific flags to maintain the page's status:
- **Dirty Bit**: Indicates if the page has been modified.
- **Resident Bit**: Shows if the page is currently in memory.
- **Clock/Reference Bit**: Used in certain page replacement algorithms to determine which pages to swap out of memory.

Each process possesses its own page table, which is an integral component of the process's state.

### Advantages of Paging

Paging addresses several challenges and goals in memory management:

1. **External Fragmentation**: It significantly reduces or even eliminates the issue.
2. **Extended Memory Usage**: Processes can use memory exceeding the physically available amount.
3. **Dynamic Allocation**: Allocating and de-allocating memory to/from processes becomes more straightforward.
4. **Process Growth**: Processes can grow with ease.
5. **Memory Sharing**: With paging, processes can easily share memory. This shared memory needn't be contiguous. It can exist at different parts in the virtual address space for different processes but maps to the same physical address.












## Improving Performance in Time
***

The translation from virtual to physical memory involves a series of steps:

1. The program provides the CPU with a virtual address for translation.
2. The Memory Management Unit (MMU) breaks down the virtual address into its page number and offset.
3. The offset remains unchanged in both virtual and physical memory, so it's passed along directly.
4. The page number gets converted into a frame number. To determine this:
   - The MMU checks the page table to ascertain if the page is present in physical memory.
   - The page number becomes the index in the page table, similar to array indexing.
   - If the page is in memory, its frame number is used.
   - If the page isn't in memory but is on the disk, the page is transferred from the disk to physical memory. The frame number is then noted.
5. Finally, the offset is appended to the frame number, producing the full physical address.

**Performance Implications:**

One of the challenges with virtual memory referencing is that it necessitates two memory references:
1. An access to retrieve the page table entry.
2. Another access to fetch the data.

### System Architecture Overview

* **System Bus:** This acts as the connector between the CPU, Disk Controller, and Memory Controller, regulating data flow among them.

* **Disk Controller:** This is the interface between the system and the disks, forming an abstraction layer over the disk hardware.

* **Memory Controller:** Links to the memory, presenting an abstraction over the memory hardware.

* **TLB/MMU:** The Translation Lookaside Buffer (TLB) and Memory Management Unit (MMU) act as intermediaries between the System Bus and Processor regarding physical addresses. The processor gives the TLB/MMU virtual addresses which they then convert into physical addresses. This information is passed on through the System Bus. Essentially, the TLB functions as a cache for these translations.

### Translation Lookaside Buffers (TLBs)

The TLB serves as an intermediary in translating a page number to a frame number. TLBs cache recently accessed page-to-frame translations. When a TLB hit occurs, the physical page number is obtained in a single cycle.


1. **Role of TLB**: The TLB caches recent frame/page pairings. This cache mechanism allows for a quicker retrieval of frame numbers without needing to always consult the more extensive page table.

2. **High Hit Ratio**: TLBs usually have a high hit ratio because they exploit the principle of locality. That is, if a specific memory location is accessed, it's likely to be accessed again in the near future.

3. **TLB Operation**:
   - On a TLB hit, the translation can be completed in just 1 cycle.
   - The system sends the page number concurrently to both the TLB and the page table. If the TLB has the relevant translation (a hit), the system stops querying the page table and proceeds with the frame number from the TLB. On a TLB miss, the system fetches the frame number from the page table, updates the TLB with this translation, and then continues with the operation.





## Multi-Level Paging
***

Multi-level paging offers an efficient approach to handle massive page tables. By introducing levels of indirection, it optimizes space and aids in efficiently locating the required frame information.

**Introduction to Multi-Level Paging:**
- This method introduces added layers of indirection to the page table. The page number is divided into 'k' parts.
- A tree structure of page tables is established.
- Although the TLB is still utilized in this system, it isn't always visually represented.
- The specific architecture decides the number of page table levels.

**Breaking Down Multi-Level Paging:**
- **First-Level Page Table:** Directly indexes the primary pages.
- **Second-Level & Third-Level Page Tables:** These provide further subdivisions to efficiently manage and index memory, reducing the overhead and size of the main page table.

One of the major benefits of this structure is space efficiency. Only the necessary page table levels need space allocation. For instance, if there's information for just one page table entry, space would be allocated for one entry each in the first, second, and third-level page tables. Note, however, there will always be one first-level page table.



## Inverted Page Tables
***

Traditional multi-level page tables, while effective for 32-bit address spaces, can become burdensome for 64-bit systems, potentially requiring up to five levels.

Instead of growing page tables proportionally with the Virtual Address Space (VAS), we can structure them relative to the Physical Address Space. This results in the creation of the **Inverted Page Table**.

**Key Features**:

1. **One Entry per Frame**: Unlike traditional tables which have an entry for each virtual page, inverted tables have one entry for each physical frame.
2. **Information per Entry**: Each entry in this table will provide details about:
    - **Residence Bit**: Indicates whether the frame is occupied.
    - **Occupier**: Specifies the page number occupying the frame.
    - **Protection Bits**: Used to manage read, write, and execute permissions.

### Challenges with Inverted Page Tables

1. **Locating Physical Page**: With CPU generating virtual addresses, how can we quickly identify its corresponding physical page in this structure? Scanning the entire table every time is inefficient.
2. **Limited TLB Size**: Using the TLB for caching frequently used pages is a solution, but the TLB has size constraints. What if there's a miss in the TLB?

### Hashed Inverted Table

To address these challenges, we can utilize a Hash Table mechanism:

1. **Hash Function**: Assign each page \(i\) to slot \(f(i)\), where \(f\) is a predetermined hash function. Collisions, which are instances where multiple entries map to the same slot, can be managed using techniques like linked lists or rehashing.
2. **Lookup Process**:
    - Compute \(f(i)\) using the page number as input.
    - This value will be the index for the page entries table.
    - Retrieve the relevant page entry.



## Page Replacement Algorithms
***

When there's a page fault and the physical memory is full, the operating system needs to decide which page to remove (or "replace") to make space for the new page. The goal of page replacement algorithms is to make this decision in a manner that maximizes performance. Typically, good performance means minimizing the frequency of page faults.

The goals of page replacement algorithms are listed below:
1. Reduce the frequency of page faults.
2. Efficient execution (i.e., make decisions quickly).
3. Ideally, make decisions that most closely align with program's actual future needs.

### Temporal and Spatial Locality

Programs often display two types of locality:

1. **Temporal Locality**: If a specific memory location was accessed recently, it's likely to be accessed again soon.
2. **Spatial Locality**: When a memory location is accessed, nearby memory locations are likely to be accessed shortly after.

About 90% of a program's execution is sequential. Iterative constructs, like loops, usually involve a small set of instructions that get repeatedly executed.

For large data structures, the primary computational cost is often sequential processing on individual elements.

### Optimal Page Replacement

This algorithm is often referred to as the clairvoyant page replacement because it "looks into the future" to make its decision.

**Main Idea**:
- Replace the page that won't be needed for the longest time in the future. 

**Properties**:
- It's provably optimal, meaning it results in the fewest number of page faults.
- It's impractical in real-world settings because it requires knowing the future sequence of page requests, which is impossible.

In real-world systems, the optimal page replacement strategy is used as a benchmark. Practical systems use other strategies like LRU (Least Recently Used), FIFO (First-In-First-Out), etc., and their performance is often compared against the optimal strategy to gauge how well they're doing.

### Least Recently Used (LRU)

The LRU algorithm replaces the page that hasn't been used for the longest period of time. It is based on the principle that if a page hasn't been used recently, it's less likely to be used in the near future.

**Characteristics**:
- Assumes that pages used recently will be used again soon.
- Useful when recent past usage of pages is a good predictor of the future.

In practice, the true LRU algorithm can be expensive to implement in hardware. However, there are various approximation algorithms that try to mimic LRU's behavior without actually keeping track of the exact order of all pages.

### Clock Algorithm

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

#### Clock Algorithm Pseudocode:

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



### Enhanced Clock Page Replacement Algorithm

Page replacement algorithms aim to decide which memory pages to swap out, write to disk when a page of memory needs to be allocated. The **Enhanced Clock Page Replacement** algorithm, often referred to as the **Second Chance Algorithm**, offers an improvement over the basic clock algorithm by using more information about each page, specifically the reference and modify bits.

#### Determining Which Page To Replace
- Pages not written are cheaper to replace because they don't need to be written back to disk.
- The algorithm checks both the **reference bit** and the **modify bit** to make this decision. Based on these bits, pages fall into one of four classes:
  - **(0,0)**: Neither recently used nor modified. Ideal candidate for replacement.
  - **(0,1)**: Not recently used but was modified. Requires write-back but might not be needed soon.
  - **(1,0)**: Recently used but not modified. Might be needed again soon.
  - **(1,1)**: Both recently used and modified.
  
#### Second Chance Behavior

1. The OS may need to cycle up to three times to locate a (0,0) class page.
2. If a (0,0) page is located, it's replaced.
3. Upon encountering a (0,1) page:
   - **Option 1**: Start an I/O operation to write that page, lock it in memory until I/O completes, reset the modified bit, and continue the search simultaneously with the I/O.
   - **Option 2**: Clear the dirty bit and move on, making a mental note that the page is dirty. Only write the page if it's evicted later on.
4. Pages with set reference bits have them cleared.
5. If the first pass doesn't find a (0,0) page, the status of (0,1) or (1,0) pages might change in the second pass.




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
