+++
title = "Synchronization Techniques"
description = "Notes from OS. An overview of locks, semaphores, monitors, deadlock, transactions, and more."
date = 2023-09-15T12:35:15-05:00
tags = ["Computer Science Notes"]
+++

{{< toc >}}



## Fundamentals of Concurrency
---

### Safety and Liveness

Safety and Liveness are two properties defined over a program's execution.

- **Safety**: This ensures that "nothing bad happens."
  - Evident in every finite execution prefix.
  - Examples:
    - An operating system never crashes.
    - A program doesn't terminate with a wrong result.

- **Liveness**: This guarantees that "something good eventually happens."
  - No part of the execution remains incomplete indefinitely.
  - Examples:
    - An operating system always reboots after a crash.
    - Programs conclude their execution.

A single thread can only be in the critical section at any time for a program to be safe.
A thread waiting to enter the critical section will eventually be able to do so for a program to have liveness.

### Mutual Exclusion

Mutual Exclusion ensures that only one thread or process is performing a specific task at a given moment. This principle is often associated with critical sections.

**When to Apply Mutual Exclusion/Critical Sections:**
- Accessing shared data, even for brief reads.
- Updating shared data.
- Familiarize yourself with shared data; it's pivotal for proper concurrency management.

#### Terminology

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

Single instructions are atomic. Thus, it depends on the instruction architecture of the machine.




### Disable Interrupts Technique

To maintain control, a thread must manage both internal events (by not yielding, avoiding I/O, and not causing exceptions) and handle external events.

The interrupt state is part of the thread's overall state:
- When a thread is blocked, its interrupt state is preserved along with the rest of its context.
- When the thread resumes, its interrupt state gets restored.

This method involves instructing the hardware to postpone external events until the thread completes its work in the critical section. However, it's crucial to limit the duration of interrupt disabling.

Disabling interrupts can lead to unintended consequences. Interrupts are essential for handling time-sensitive tasks.
- On a uniprocessor, the OS may use this approach for specific data structures, crucial for systems like **Pintos**.
- On **multiprocessors**, disabling interrupts only impacts the CPU executing the thread. Hence, other CPUs can access the critical section.




## Locks
---

A lock is a synchronization mechanism that ensures **mutual exclusion** to critical sections or shared data.

A lock enables one thread to block another from executing certain operations.
  - Lock before entering a critical section or accessing shared data.
  - Unlock when leaving a critical section or completing data access.

*Formal Definition*:
1. *Lock::Acquire*: Wait until the lock is free, then take control.
2. *Lock::Release*: Release the lock and notify any waiting threads.
3. Locks can be in two states: *Busy* or *Free*.
4. *Usage Protocol*: Acquire the lock before accessing shared data and release it afterward.

*Interleaving* represents the combined execution of multiple threads. If any interleaving leads to undesired results, synchronization mechanisms are needed.

- **Why Mutual Exclusion?**: Due to the unpredictable nature of thread scheduling.
- On a **uniprocessor**, an operation is atomic if there's no context switch during its execution. Mutual exclusion can be achieved by preventing these switches.
- **Context Switches** arise due to internal events (like system calls) and external events (such as interrupts).


### Atomic Read-Modify-Write Instructions

Our primary goal is to ensure mutual exclusion, liveness, and other fundamental correctness properties. To achieve this, atomic **read-modify-write (RMW)** instructions are essential.

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

#### Implementing Locks with Test&Set

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





## Semaphores
---

Semaphores provide an efficient solution for synchronization challenges, extending beyond mutual exclusion.

Essentially, semaphores are an extended form of locks with more values it can take on (as opposed to just `0` and `1`) and supported atomic operations which increments/decrements this value (primarily `Down`/`P` and `Up`/`V`). Introduced by Dijkstra in 1965, semaphores have since become an essential tool in the realm of computer science.

### Core Atomic Operations

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

When to Utilize Semaphores:

1. **Mutual Exclusion** - Safeguarding critical sections.
2. **Resource Pool Access Control** - Employ a counted semaphore.
3. **Broad Synchronization** - Enforcing particular scheduling constraints, where threads await specific conditions. Generally, the initial value is 0.



















## Deadlocks
---

Deadlock arises when multiple threads wait for an event that can solely be generated by these very threads. An example is when two threads are each holding a lock that the other needs to acquire. Since neither can acquire the lock nor release their own, the program grinds to a halt. It's important to note: Deadlock is **not** starvation. Starvation can take place without any deadlock and it happens when a thread indefinitely waits for resources that are currently in use by other threads. However, every deadlock implies starvation.

### Necessary Conditions for Deadlock

For a deadlock to occur, all of the following conditions must be simultaneously met:

1. **Mutual Exclusion**: Only a limited number of threads or processes can access a resource at any given time, and these resources are finite.

2. **Hold and Wait**: A thread or process retains at least one resource while awaiting the availability of other resources. These other resources are held by a different thread or process.

3. **No Pre-emption**: Resources are only released voluntarily by a thread or process. Neither other threads or processes, nor the OS, can force its release.

4. **Circular Wait**: This condition is characterized by a cyclic chain of threads or processes where each entity in the set is waiting for the next, culminating in the last one waiting for the first.

### Strategies to Manage Deadlocks

1. **Deadlock Prevention**: This approach ensures that at least one of the four necessary deadlock conditions is never met.
   
2. **Deadlock Avoidance**: Here, algorithms assess resource requests against potential availabilities, ensuring that deadlocks never materialize. This approach inherently breaks one of the four essential deadlock conditions.

3. **Deadlock Detection**: This strategy acknowledges the potential occurrence of deadlocks. It involves routinely checking for deadlock instances and implementing measures to recover from them.

#### Deadlock Prevention via Resource Ordering

A practical method to prevent deadlocks is through resource ordering:

- **Resource Hierarchy**: All resources are arranged in a specific order. In code, this could manifest as lock ordering.
  
- **Sequential Acquisition**: Every piece of code acquires resources following the predefined order.

However, complications can arise. Establishing and maintaining a global order is challenging. Moreover, a global order might require a client to obtain a resource prematurely, leading to inefficient resource utilization.



## Monitors
---

Semaphores were a significant advancement from previous techniques, yet they have shortcomings.
- They behave like shared global variables.
- They serve too many functions:
  - Waiting for a condition should be decoupled from mutual exclusion.
- There's no mechanism to ensure they're used correctly.
- Semaphore-driven code can be hard to understand and develop.

Semaphores are typically used in very low level systems: operating systems, databases, embedded systems, etc. For user code, we turn to a higher level synchronization construct called monitors.

A monitor integrates a lock and possibly multiple condition variables to manage concurrent access to shared data.
It employs the lock to confirm only a single thread is active within the monitor at any time.

This lock also guarantees mutual exclusion for the encapsulated shared data.
Condition variables allow threads to pause and wait for a specific event within critical sections. When a thread sleeps, the lock is concurrently released.

- *Purpose*: Monitors encapsulate shared data.
  - Group associated shared data into logical units, akin to structs or files in C.
- *Privacy*: All data within a monitor is private.
- *Access*: Operations on shared data are defined as functions.
  - These functions represent the critical sections.
- *Mutual Exclusion*: Every monitor is associated with one lock.
  - This lock is acquired prior to executing any function.
- *Thread Synchronization*: Monitors allow threads to synchronize their activities within the critical section, offering guarantees against deadlocks. This is achieved using condition variables.


Implementing Monitor Functions:

1. **Start by acquiring the lock**: This is the first action of every function within a monitor.
2. **Operate on shared data**.
3. If a resource is unavailable, **temporarily release the lock**. Use a condition variable to facilitate this.
4. **Reacquire the lock** when the operation can resume. This too involves a condition variable.
5. Continue to **operate on the shared data**.
6. **Release the lock** at the function's end.

<!-- ### Example Using Semaphores: -->

<!-- The given BoundedBuffer example employs semaphores. Here's the segment you provided: -->

<!-- ```pseudo -->
<!-- Semaphore mutex = 1 --> 
<!-- Semaphore empty = N --> 
<!-- Semaphore full = 0 -->
<!-- int buffer[N] -->

<!-- BoundedBuffer::Producer() { -->
<!--     produce item -->
<!--     empty.down() // get an empty slot -->
<!--     mutex.down()  // access the buffer -->
<!--     add item to buffer -->
<!--     mutex.up()    // release the buffer -->
<!--     full.up()     // indicate a new item in buffer --> 
<!-- } -->
<!-- ``` -->

<!-- While this example demonstrates the use of semaphores, transitioning to monitors would encapsulate and streamline the process, making the code more readable and maintainable. -->





### Condition Variables

Condition variables are crucial tools within Monitors to help threads efficiently wait for changes to a shared state that's protected by a lock. They function as a queue for waiting threads, and they don't maintain any state themselves.

One of their primary uses is to allow threads to block inside a critical section. They achieve this by simultaneously releasing the lock when the thread is blocked.

**Key Rule**: A thread is required to possess the lock when performing operations with condition variables.

#### Condition Variable Operations

1. `Wait(Lock lock)`:
   - This operation is atomic. It involves releasing the lock, transitioning the thread to the waiting queue, and then suspending the thread.
   - Upon waking, the thread re-acquires the lock before concluding the wait.
   - The thread will always be in a blocked state after this operation.

2. `Signal(Lock lock)`:
   - Its main function is to awaken a waiting thread. If no threads are waiting, this operation simply does nothing.

3. `Broadcast(Lock lock)`:
   - This awakens all waiting threads. If no threads are present in the queue, it remains inactive.

The following pseudocode show the operations within a Monitor (The code assumes Mesa/Hansen semantics).

```c
Lock->Acquire()   // Acquires the lock. When this returns, the thread has the lock.
Lock->Release()   // Releases the lock.

CondVar::Wait(lock) {
    // Move thread to wait queue, suspend thread.
    // Upon signal, the thread wakes up and re-acquires the lock.
    ...
    return
}

CondVar::Signal(lock) {
    // Wake up a thread waiting on the condition variable.
    ...
    return
}

CondVar::Broadcast(lock) {
    // Wake up ALL threads waiting on the condition variable.
    ...
    return
}
```



### Resource Variables & Signal Semantics

Every condition variable should be paired with a **resource variable** that tracks the status of that associated resource.

These are the steps to follow with resource variables:
1. Always verify the resource variable before invoking the `wait` on its associated condition variable. This ensures the resource is unavailable.
2. Once the resource becomes accessible, claim it and decrease the amount being utilized.
3. Prior to signaling completion with a resource, indicate its availability by incrementing the resource variable.

#### Signal Semantics

Upon invoking `signal()`, which thread will execute? If no threads are on standby, the signaling thread continues, effectively causing the signal to be lost. When a thread (or more) is waiting, one must be chosen to execute to maintain mutual exclusion within the monitor.
    
There are two different styles for signaling:

1. **Mesa/Hansen Style**:
    - The signaling thread retains the lock and continues execution.
    - The thread on standby waits for the lock.
    - The signal is merely an indicator that the condition might be met, as shared states could have evolved.
    - This style affects performance but never impacts safety.
    - Implemented in languages like Java and most real operating systems.

2. **Hoare Style**:
    - The signaling thread relinquishes the lock, allowing the waiting thread to acquire it.
    - Signaling occurs atomically with the continuation of the waiting thread.
    - The shared state remains unchanged until the waiting thread resumes.
    - Once the previously waiting thread exits or waits again, the lock is released back to the signaling thread.
    - Typically found in many textbooks (though not OSTEP).

We should write code that works with either style, since we might not know what style the machine we're using uses.

After being awakened, the waiting thread might need to re-wait. Thus we must wrap `CondVar->wait()` with a `while` loop that checks the resource variable.
We also need to signal only after we increment the resource variable. These two things should let our code work with both styles.

### Signal vs. Broadcast
Substituting `broadcast()` for `signal()` is always safe, but it will impact performance.
- **Use `signal()` when**:
    - Only a single waiting thread can progress.
    - Any thread waiting on the condition variable can proceed.
- **Use `broadcast()` when**:
    - Multiple standby threads have the potential to progress.
    - The same condition variable applies to numerous predicates, meaning some waiting threads can move forward, while others cannot.


















## Advanced Synchronization
---

### One Big Lock Approach
- **Advantage:** Simplicity
    - It's comparatively easier to implement correctly, and simplicity in implementation is a significant advantage when it comes to operating systems.
  
- **Disadvantage:** Performance Limitations
    - Using a single lock for synchronization can negate the benefits of multi-threading within the secured code segment.
    - Performance benefits offered by multicore architectures are also lost for that portion of the code.


### Fine-Grained Locking

Fine-grained locking refers to using multiple locks for different parts or sections of data, rather than a single monolithic lock.

- **Advantages:**
    - **Performance Enhancement:** Fine-grained locking is especially beneficial in kernel operations, which impact every application.
    
- **Complexities:**
    - Implementing fine-grained locking might require acquiring multiple locks, increasing complexity.
    - Higher chances of encountering issues such as deadlocks.

*Note:* The term "fine-grained" here indicates that locks are applied at a detailed level, as opposed to "coarse-grained" where one lock controls access to a large section of data.



### Conservative Two-Phase Locking

A protocol that ensures concurrency control:
1. **Lock Acquisition:**
    - A thread should acquire all necessary locks before performing any operations.
    - If unable to acquire all locks, the thread must release any locks it has acquired and retry.
   
2. **Operation and Lock Release:**
    - Once locks are secured, the thread can make the required changes.
    - Commit the changes and release the locks.
    - Until a thread releases its lock, other threads (e.g., B) cannot view its changes (from A).

- **Benefits:**
    - Offers serializability: Ensures that concurrent transaction yields results consistent with some order of serial execution.
    - Effectively prevents deadlock situations.



### Schedules & Interleavings

Consider two threads (Thread 1 and Thread 2) executing concurrently. Without proper synchronization, the execution of their operations might interleave in a manner that leads to undesirable outcomes.

Without synchronization:
- *Thread 1* and *Thread 2* both read and modify a shared variable X.
- Due to concurrent operations, the changes by both threads might overlap, making them non-serializable.

With global lock implementation:
- We ensure that each thread accesses the shared variable in a synchronized manner, achieving serializable operations.

```cpp
void increment() { 
    lock.acquire(); 
    int tmp = X; 
    tmp = tmp + 1; 
    X = tmp; 
    lock.release();
}
```




## Transactions
---

Transactions are powerful constructs that group actions together with several core properties:
- **Atomicity:** All actions within a transaction either complete successfully, or none of them do.
- **Serializability:** Transactions give the illusion of executing one after another, even if they might be running concurrently.
- **Durability:** Once a transaction completes, its effects are permanent.

Note: While critical sections in operating systems offer atomicity and serializability, they lack the durability property.

### Achieving Durability

**Primary Objective:** Ensure all updates in a transaction are written to disk, or none are. 

**Steps Involved:**
1. **Writing Changes:** Save the transaction's changes to the disk.
2. **Certification:** Confirm that all updates from a transaction have been successfully written. If not all changes are saved, the partial updates should be reversed.

**Formal Approach:**
- **Commit:** This signals the successful end of a transaction, meaning all its operations are finalized on the disk.
- **Rollback:** In the event of a failure during a transaction, a rollback undoes the operations performed up to that point. 
    - Operations within a transaction are executed tentatively.
    - If the operations reach the commit stage, they're confirmed.
    - Otherwise, they're rolled back as if the transaction never took place.

**Real-World Approach:**
- Directly reversing changes on a disk (rolling back) is challenging. Instead:
    1. Maintain a *write-ahead log* on the disk for all changes made during the transaction.
    2. Once every change is logged, the transaction gets committed (indicated by appending “Commit” to the log).
    3. If a system crash occurs before the commit, the log is disregarded.
    4. The actual changes (write-behind) are transferred to their intended locations in the filesystem at a later time.

### The Write-Ahead Log (WAL)

**WAL Mechanism:** All updates during a transaction are first written to this special log on the disk before they're committed to their final destination.
- Changes recorded should be idempotent, meaning they don't rely on themselves for computation.

**Example Workflow in the Transaction Log:**
1. Begin a new transaction.
2. Update the variables (e.g., x and y).
3. Commit the changes.

If everything works as expected, the transaction log could look like:

```
begin transaction
x=3
y=5
Commit
begin transaction
x=6
y=10
Commit
```

If there's a system crash before a transaction commits, the partial transaction should be rolled back to ensure that the database remains in a consistent state. This means that the `x` and `y` values would revert to whatever they were before the transaction began.
