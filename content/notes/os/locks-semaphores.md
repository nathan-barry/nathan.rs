+++
title = "Locks & Semaphores"
date = 2023-09-15T12:35:15-05:00
tags = ["Operating Systems Notes"]
priority = 4
+++

{{< toc >}}



## Fundamentals of Concurrency
***

Operating systems facilitate concurrent execution of processes and threads, enabling efficient resource utilization. This introduces the need for management and synchronization of shared resources to prevent conflicts and undesirable behaviors. Two key synchronization primitives are locks and semaphores.

### Processes and Threads Recap 
Let us first review the essentials of processes and threads.

###### Processes:
- **Purpose**: Serve as an abstraction layer that ensures protection.
- **Address Space Definition**: Each process has its own address space.

###### Threads:
- **Basics**: Every process is guaranteed to have at least one kernel thread. Additional threads can be spawned through system calls (resulting in kernel threads) or via libraries, creating user threads.
- **Advantages**: Threads allow for realistic modeling of real-world scenarios and exploit system concurrency.
- **Sharing Mechanism**: Threads within the same process can communicate via global and static data. While they share the heap, each thread retains its distinct stack and unrestricted access to the registers.
- **Concerns**: Race conditions can arise when threads attempt to access shared resources simultaneously without proper synchronization.

###### Dual-Mode Execution:
- Processes and threads have the capability to operate in dual modes.

###### CPU Schedulers:
- Tasked with scheduling both kernel threads and processes. 
- Although each process contains at least one kernel thread, sometimes processes are essentially treated as threads for the sake of simplification.
- A critical role of schedulers is to maintain the illusion of infinite resources.

### Safety and Liveness

Safety and Liveness are two properties defined over a program's execution.

- **Safety**: This ensures that "nothing bad happens."
  - Evident in every finite execution prefix.
  - Examples:
    - An operating system never crashes.
    - A patient never receives incorrect medication.
    - A program doesn't terminate with a wrong result.

- **Liveness**: This guarantees that "something good eventually happens."
  - No part of the execution remains incomplete indefinitely.
  - Examples:
    - An operating system always reboots after a crash.
    - Medications ultimately reach the right patients.
    - Programs conclude their execution.

A single thread can only be in the critical section at any time for a program to be safe.
A thread waiting to enter the critical section will eventually be able to do so for a program to have liveness.

### Mutual Exclusion

Mutual Exclusion ensures that only one thread or process is performing a specific task at a given moment. This principle is often associated with critical sections.
- **Active thread exclusivity**: The active thread prohibits others from executing the task.
- **Examples**:
  - A printer can't print multiple documents simultaneously.
  - Concurrently adding data to a linked list by two threads can corrupt the list.
  - Some computer resources can't handle simultaneous multi-thread access.
  - Shared memory architectures often require data structures to be mutually exclusive.

**When to Apply Mutual Exclusion/Critical Sections:**
- Accessing shared data, even for brief reads.
- Updating shared data.
- Familiarize yourself with shared data; it's pivotal for proper concurrency management.

### Terminology

- **Mutual Exclusion**: Only one thread (or process) undertakes a specific activity at once, usually tied to critical sections.
- **Critical Section**: A code segment where only one thread can execute at a given time.
- **Atomic Operation**: An operation that runs without interruptions.
- **Synchronization**: Using atomic operations to ensure harmonious multi-thread operations.

### Atomic Operations

Atomic operations are uninterruptible; they either complete entirely or not at all. Consider the operation `x=x+1`. It involves:
1. Loading x.
2. Adding 1.
3. Storing x.

For the condition `if(x == 1) x=2`, the steps include:
1. Loading x.
2. Comparison.
3. Storing x (conditionally).

The question arises: which operations truly are atomic or uninterruptible? Some operations are atomic or not depending on the hardware.



## What is a Lock?
***

A lock is a synchronization mechanism that ensures **mutual exclusion** to critical sections or shared data.

**Ideal Lock Characteristics:**
1. *Correctness*: Ensures safety, liveness, and bounded wait.
2. *No busy waiting (spinning)*: Threads should block while waiting and be notified when it's their turn (via a wait queue).
3. *Scalable*: Works for more than just two threads.
4. *Symmetry*: Identical behavior regardless of which thread is acting.
5. Any other feature that aids in ensuring consistency and reliability.

### Understanding Locks

- *General Principle*: A lock enables one thread to block another from executing certain operations.
  - Lock before entering a critical section or accessing shared data.
  - Unlock when leaving a critical section or completing data access.

- *Formal Definition*:
  1. *Lock::Acquire*: Wait until the lock is free, then take control.
  2. *Lock::Release*: Release the lock and notify any waiting threads.
  3. Locks can be in two states: *Busy* or *Free*.
  4. *Usage Protocol*: Acquire the lock before accessing shared data and release it afterward.

*Interleaving* represents the combined execution of multiple threads. If any interleaving leads to undesired results, synchronization mechanisms are needed.

###### Key Observations

- **Why Mutual Exclusion?**: Due to the unpredictable nature of thread scheduling.
- On a **uniprocessor**, an operation is atomic if there's no context switch during its execution. Mutual exclusion can be achieved by preventing these switches.
- **Context Switches** arise due to internal events (like system calls) and external events (such as interrupts).

### Thwarting the Scheduler

To maintain control, a thread must manage both internal events (by not yielding, avoiding I/O, and not causing exceptions) and handle external events.

#### Interrupts and Context Switches

The interrupt state is part of the thread's overall state:
- When a thread is blocked, its interrupt state is preserved along with the rest of its context.
- When the thread resumes, its interrupt state gets restored.

#### Using the Disable Interrupt Technique

This method involves instructing the hardware to postpone external events until the thread completes its work in the critical section. However, it's crucial to limit the duration of interrupt disabling.

Disabling interrupts can lead to unintended consequences. Interrupts are essential for handling time-sensitive tasks.
- On a uniprocessor, the OS may use this approach for specific data structures, crucial for systems like **Pintos**.
- On **multiprocessors**, disabling interrupts only impacts the CPU executing the thread. Hence, other CPUs can access the critical section.

Locks play a pivotal role in ensuring system consistency in concurrent execution. They help maintain order and prevent race conditions, ensuring that shared resources are accessed safely. As we delve deeper into operating systems, understanding these mechanisms becomes imperative.



## Implementing Locks
***

Our primary goal is to ensure mutual exclusion, liveness, and other fundamental correctness properties.

**Practical Application:**
1. Check if another thread is executing the critical section (by reading a variable).
2. If no thread is in the section, acquire the lock (by modifying and writing to a variable).
3. If another thread is already in the section, wait.
4. The above operations must be done atomically.

To achieve this, atomic **read-modify-write (RMW)** instructions are essential.

### Atomic Read-Modify-Write Instructions

Atomic RMW instructions are used to:
1. Atomically read a value from memory into a register.
2. Write a new value to that memory location.

On a **multiprocessor** system, other processors' caches must invalidate the value. The memory bus must be locked to prevent concurrent memory access until the operation is complete.

Some common RMW instructions are listed below:

1. **Test&Set**: Commonly supported.
    - Reads memory value.
    - Sets the memory location to "1".
  
2. **Compare&Swap (CAS)**: Used in architectures like the 68000.
    - Compares memory value against a constant.
    - If true, updates the memory location to a new value.
    - Returns the test result.
  
3. **Load Linked/Store Conditional (LL/SC)**: Supported in Alpha, PowerPC, ARM.
    - `LL` retrieves a memory location's value.
    - `SC` updates the value only if no other updates occurred post `LL`.
  
4. **Exchange**: Found in x86.
    - Exchanges values between a register and memory.

### Implementing Locks with Test&Set

With any lock implementation, there is the acquisition process and the release process.

###### Acquisition Process
- If the lock is free (`value==0`), `test&set` returns `0`, and the lock is acquired.
- If the lock is busy (`value==1`), `test&set` returns `1`, and the process waits.

###### Release Process
- The lock's value is set to `0`.

There are some problems with this current lock implementation:

1. **Busy Waiting (Spinning)**: Consumes CPU resources.
2. **Priority Inversion**: A lower-priority thread holds a lock needed by a higher-priority thread, blocking the higher-priority thread.
3. However, the waiting thread can immediately acquire the lock once it's free, ensuring low latency.

Solutions

- Test&Set with Modified Busy Waiting
    - In this version, the CPU voluntarily yields during busy waiting, and the thread sleeps briefly before trying again.

- Test&Set with Minimal Busy Waiting
    - Here, busy waiting is used only to check the lock's status (using `guard`) rather than the entire critical section. If the lock is in use, the thread is added to a wait queue.

### Beyond Mutual Exclusion

While locks guarantee mutual exclusion, more functionality is often required:
- Sometimes threads must wait for other threads to perform certain actions.
- There might be scenarios where multiple resources are available.

In such cases, additional synchronization constructs, like semaphores or condition variables, become necessary. These tools allow threads to coordinate more complex operations and share multiple resources safely.



## What is a Semaphores?
***

Semaphores provide an efficient solution for synchronization challenges, extending beyond mutual exclusion.

Essentially, semaphores are an extended form of locks with more values it can take on (as opposed to just `0` and `1`) and supported atomic operations which increments/decrements this value (primarily `Down`/`P` and `Up`/`V`). Introduced by Dijkstra in 1965, semaphores have since become an essential tool in the realm of computer science.

### Core Atomic Operations of Semaphores

1. `Down()`:
    - Decreases the semaphore's value.
    - The calling thread gains the resource when Down() finishes executing.
    - Can block the calling thread and place it on a wait queue if the resource isn't available.

2. `Up()`:
    - Adds to the semaphore's value.
    - This operation is non-blocking.
    - Awakens a thread from the wait queue, if any are present.

Below is an psuedo code implementation of these two operations.

```c
int value = val; // Initial value denotes available resources

Semaphore::Down() {
    if(value == 0) {
        // add t to wait queue;
        t->block();
    }
    value = value - 1;
}

Semaphore::Up() {
    value = value + 1;
    if(t on wait queue) {
        //remove t from wait queue;
        wakeup(t);
    }
}
```

### Categorizing Semaphores

Semaphores are generally places into two different categories:

1. **Binary Semaphores**:
    - Operates similarly to a lock.
    - Ensures exclusive resource access.
    - Possesses two states: 0 (busy) or 1 (free), starting at 1.
  
2. **Counted Semaphores**:
    - Represents resources available in bulk.
    - The initial count equals the number of available resources.
    - Can be used for broader synchronization goals.

The only distinguishing factor between these semaphores is their initial value.

Utilizing a binary semaphore:

```c++
S->Down(); // Wait for the semaphore
<critical section>
S->Up();   // Release the semaphore
```

If a process triggers `S->Down()` and the semaphore is unoccupied, the process proceeds. If not, the OS places it on the semaphore's wait queue.

Counted semaphores mirror resources available in quantity. The initial count signifies the resource amount. Threads can proceed as long as sufficient instances remain.

### When to Utilize Semaphores

1. **Mutual Exclusion** - Safeguarding critical sections.
2. **Resource Pool Access Control** - Employ a counted semaphore.
3. **Broad Synchronization** - Enforcing particular scheduling constraints, where threads await specific conditions. Generally, the initial value is 0.

By understanding and leveraging semaphores, developers can address a range of synchronization issues, from basic mutual exclusion to more advanced coordination tasks.
