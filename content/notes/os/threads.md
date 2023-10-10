+++
title = "Threads: Types & Characteristics"
date = 2023-09-15T08:55:38-05:00
tags = ["Operating Systems Notes"]
+++

{{< toc >}}



## Introduction to Threads
***

In computer science, a thread represents an entity that executes a series of instructions. Threads play an important role in enhancing the efficiency of an operating system.

By allowing for concurrent execution and simplifying communication, they provide a streamlined and efficient method for performing multiple tasks simultaneously.

### Threads and Processes

To understand threads, we first need to understand processes. A process is an abstraction employed by the operating system for resource management and ensuring protection. A few key points:

- It defines an address space, which is essentially a range of addresses the program might touch.
- Every process has a single thread of control, ensuring a singular sequential stream of execution.
- This introduces an interesting question: What if we separate the thread of control from the process?

Below are some threads basics and their relation to processes:

- Every thread is bound to a specific process.
- A single process can have multiple threads, but it must have at least one.
- Threads essentially virtualize the processor, making it seem as though many actions are happening concurrently when, in reality, they might be taking turns rapidly.

Similar to processes, threads also traverse a set of the same states: New, Ready, Running, Blocking, and Terminated.

#### Threads and Memory Addressing
- A process sets an address space. However, **all threads within the same process share this address space.**
- Thus, any data of the process, especially global data, can be accessed by all its threads.
- Notably, while each thread maintains its own stack, **they all share the heap**. A potential problem arises here since any thread can modify another thread's stack, typically seen as a bug.
- **Each active thread has the exclusive use of CPU registers.** If a thread is preempted, its register values are preserved as part of its state, allowing the succeeding thread to utilize the registers.

#### Threads & Processes Data Structures
  - *Process Control Block (PCB):*
    - This holds data specific to a process like the owner, PID, heap pointer, priority, active thread, and pointers to thread information.
  - *Thread Control Block (TCB):* 
    - This holds data unique to a thread, such as the stack pointer, PC, thread state (running, etc.), register values, and a pointer back to its PCB.

## Why Use Threads?
***
There are a few reasons on why to use threads. One reason is for **Structural Representation.** We often think linearly, but many tasks in the real world happen concurrently. Threads allow us to better align our software with this reality.

We also get a **Performance Boost.** While one thread waits (for example, for some I/O operation), another can continue processing. Moreover, in systems with multiple processors, different threads can run on different processors simultaneously.

There are many **Applications** in which threads are useful. Below are two examples:
- *Web Servers:*
    - A web server can significantly improve its performance by utilizing multiple threads. Rather than handling requests one by one, it can process multiple requests concurrently, slashing overall wait times.
   
- *Concurrency in Arrays:*
    - Consider the code snippet where arrays are being processed sequentially. With threads, multiple array elements could potentially be processed at once, showcasing the power of concurrent execution.

Below shows some of the efficiency advantages one gets from threads.

- *Lightweight Creation:*
     - Threads are lighter and quicker to create than processes. Starting up a thread consumes fewer resources than booting up a whole new process.
  
- *Facilitated Communication:*
    - While threads within the same process share memory space (address space), each process maintains its own separate memory space.
    - Thread-to-thread communication is usually more straightforward compared to inter-process communication since threads share memory.
  
- *Efficient Context Switching:*
    - Switching between threads within the same process is faster because they share the same address space.
    - Thus threads have less overhead than processes, which often makes them more efficient in scenarios requiring rapid task switching.

In summary, threads provide a more granular and lightweight approach to concurrent execution compared to processes. By understanding threads, developers can create more efficient and responsive applications.


### Understanding Thread Creation

When using threads in programming, a programmer often has to define the functionality of a thread and then create an instance of it. Here's a glimpse of it:

```c
void thread_function(int arg0, int arg1, ...) {
    // Thread's functionality goes here...
}

main() {
    // --snip--
    tid = thread_create(thread_function, arg0, arg1, ...);
    // --snip--
}
```

Upon calling `thread_create()`, two significant events occur:

- The original thread continues its execution in the `main` function.
- The new thread starts executing from the `thread_function()`.

This simultaneous execution of both threads is what we refer to as "concurrency."



## Thread Types and Characteristics
***

###  User-Level Threads

User-level threads are threads that the Operating System (OS) is unaware of. Thus, the OS only manages the process as a whole, not the individual threads within. A thread library, used by the programmer, is responsible for thread operations (creation, deletion, synchronization, and scheduling).

Some benefits are:
  - Allows user-level code to define the scheduling policy.
  - Threads can yield to others or voluntarily give up the processor.
  - Switching between user-level threads does not require a context switch, which makes it faster.
  
Context Switching for User-Level Threads:
  - Entirely takes place in user space.
  - An active thread might be interrupted either by an external interrupt, a signal, or a voluntary yield.
  - The kernel library saves the thread's state (to TCB), selects a new thread, loads its state, and then the new thread begins its execution.

### Kernel-Level Threads

Kernel-level threads are threads that the Operating System (OS) is aware of and manages.

  - Each process has at least one kernel-level thread.
  - Threads are managed and scheduled by the kernel.
  - System calls are employed for thread-related operations like creation, destruction, and synchronization.
  
Context Switching for Kernel-Level Threads:
  - Requires a minor context switch since it involves changing values of registers, program counters, and stack counters.
  - Memory management info remains constant, as threads within the same process share an address space.

#### Advantages of Kernel-Level Threads:
  - *Parallelism:* Kernel-level threads can run concurrently on different processors or cores, maximizing hardware use.
  - *I/O Operations:* If one thread blocks due to I/O, the OS can choose another thread from the same process to execute.
  - *Non-blocking Calls:* Although beneficial theoretically, these can be complex to implement.

### Independent vs. Cooperating Threads

- Independent Threads:
  - Do not share any state with other threads.
  - Characteristics: Easy to implement, deterministic, reproducible, and unaffected by scheduling order.
  
- Cooperating Threads:
  - Share state with other threads.
  - Characteristics: Introduce concurrency, but they are non-deterministic and non-reproducible.
