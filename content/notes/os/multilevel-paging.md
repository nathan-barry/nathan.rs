+++
title = "Multi-level Paging"
date = 2023-09-16T11:55:20-05:00
tags = ["Operating Systems Notes"]
priority = 9
+++

{{< toc >}}



## Improving Performance in Time
***

In systems with memory management, a fundamental task is the translation of virtual addresses to physical addresses, aka **address translation**.

### Virtual to Physical Address Translation

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

#### Performance Implications

One of the challenges with virtual memory referencing is that it necessitates two memory references:
1. An access to retrieve the page table entry.
2. Another access to fetch the data.

#### System Architecture Overview

* **System Bus:** This acts as the connector between the CPU, Disk Controller, and Memory Controller, regulating data flow among them.

* **Disk Controller:** This is the interface between the system and the disks, forming an abstraction layer over the disk hardware.

* **Memory Controller:** Links to the memory, presenting an abstraction over the memory hardware.

* **TLB/MMU:** The Translation Lookaside Buffer (TLB) and Memory Management Unit (MMU) act as intermediaries between the System Bus and Processor regarding physical addresses. The processor gives the TLB/MMU virtual addresses which they then convert into physical addresses. This information is passed on through the System Bus. Essentially, the TLB functions as a cache for these translations.

## Translation Lookaside Buffers (TLBs)
***

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

By leveraging multi-level paging, systems can smartly manage large page tables. While it introduces multiple steps to retrieve the necessary frame details, the benefits in space optimization and the support of TLBs make it a crucial aspect of modern memory management.



## Inverted Page Tables
***

Modern computing systems need mechanisms that efficiently manage memory, especially as we venture into larger address spaces like 64-bit systems. Traditional multi-level page tables, while effective for 32-bit address spaces, can become burdensome for 64-bit systems, potentially requiring up to five levels.

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
