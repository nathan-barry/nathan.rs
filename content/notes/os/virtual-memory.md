+++
title = "Virtual Memory, Paging, & Address Translation"
description = "These are my notes over Professor Norman's Operating Systems course. Notes closely follow the in class lecture slides."
date = 2023-09-15T21:23:09-05:00
tags = ["Operating Systems Notes"]
priority = 8
+++

{{< toc >}}



## Addressing Memory Management
***

Memory management is a cornerstone of operating systems. The primary objective is to maximize the utilization of the system's main memory.

### Processes and Abstractions

In an operating system, **processes** are the fundamental abstraction units for ensuring protection. Each process is allocated its own **virtual address space**, a contiguous block of addresses ranging from 0 to the maximum value for that specific process. This address space is essentially a logical view of the process's memory. However, as our system is grounded in the real world, the logical or virtual address spaces must correspond to **physical address spaces** in the machine's main memory.

When a process is run, techniques called **relocation** are applied. These techniques make sure that the entire process is placed contiguously in physical memory. The relocation process necessitates the translation of virtual addresses to physical addresses. This step is critical since a process might not always be loaded into the same physical location in memory.

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





## Paging and Virtual Memory
***

One of the central techniques underpinning modern systems is the use of **virtual memory** with **paging**. Here, we break down the fundamental concepts of paging and its role in mapping virtual addresses to physical memory.

### Introduction to Virtual Memory

**Virtual Memory** is a mechanism that allows processes to use a virtual address space, which can be substantially larger than the available physical memory. The significant advantage of this approach is that only specific portions of the virtual address space need to be in the physical memory at any given time. This allocation is facilitated by the process of **paging**.

###### Key points about Virtual Memory:
1. Virtual address space is partitioned into uniform segments.
2. Only certain segments of the virtual address space reside in the physical memory at any moment.
3. The virtual address space is divided automatically into uniform chunks. Whenever required, these chunks are brought into memory. But from where? This leads us to the technique of paging.

### Paging Explained

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

###### Example
In a system with a 16-bit address space and 512-byte page frames, the address location (3, 6) would translate to a physical location 1,542.



### Mapping Virtual Addresses to Physical Memory

Paging facilitates a flexible system where pages from a virtual address space (VAS) map to frames in the physical memory. Key things to note:
1. **Contiguity in VAS**: Pages are contiguous in a Virtual Address Space.
2. **Arbitrary Physical Location**: Pages can be located anywhere in physical memory. Additionally, not all pages from VAS need to be mapped to physical memory at once. Where are the unmapped pages stored? They typically reside in secondary storage like a hard drive.

This process raises an essential question: If pages aren't allocated contiguously in memory, how do we locate data efficiently?

#### Locating Data in a Paged System

The system uses a data structure known as the **Page Table** to keep track of where each page is located in the physical memory. The Page Table maps virtual page numbers to corresponding frame numbers in physical memory. When a process needs to access data, it refers to the page table to locate where its pages are in the physical memory, ensuring efficient data retrieval even when pages are scattered.



## Address Translation
***

One of the many tasks of an operating system is the translation of virtual addresses to physical ones, ensuring that processes can efficiently and securely access their data. Here, we unpack the nuances of address translation in a paged system.

### Address Translation: The Need

When a system employs paging, the data pages aren't allocated contiguously in memory. This disjointed allocation poses a pivotal question: How do we locate a particular piece of data? The answer lies in the intricate mechanism of address translation.

### The Role of the Page Table

A **page table** is the linchpin in the process of translating virtual addresses to physical ones. It maintains a mapping of pages to their corresponding page frames. You can conceptualize the page table as an array of relocation registers, where each register corresponds to a frame. 

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

