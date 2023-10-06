+++
title = "Transactions & Advanced Synchronization"
date = 2023-09-15T15:18:51-05:00
tags = ["Operating Systems Notes"]
priority = 6
+++

{{< toc >}}


## Advanced Synchronization
***

### One Big Lock Approach
- **Advantage:** Simplicity
    - It's comparatively easier to implement correctly, and simplicity in implementation is a significant advantage when it comes to operating systems.
  
- **Disadvantage:** Performance Limitations
    - Using a single lock for synchronization can negate the benefits of multi-threading within the secured code segment.
    - Performance benefits offered by multicore architectures are also lost for that portion of the code.


### Multi-Object Synchronization
Imagine a scenario: Transferring $100 from account A to account B.
- You'd perform two main operations: 
    - A->subtract(100)
    - B->add(100)
    
- **Challenge:** How can we ensure atomicity?
    - While individual operations like subtracting or adding might be atomic, the sequence of these operations isn't.



### Fine-Grained Locking

- **Definition:** Fine-grained locking refers to using multiple locks for different parts or sections of data, rather than a single monolithic lock.

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

To understand the importance of synchronization, consider two threads (Thread 1 and Thread 2) executing concurrently. Without proper synchronization, the execution of their operations might interleave in a manner that leads to undesirable outcomes.

###### Example:

Without synchronization:
- *Thread 1* and *Thread 2* both read and modify a shared variable X.
- Due to concurrent operations, the changes by both threads might overlap, making them non-serializable.

With global lock implementation:
- We ensure that each thread accesses the shared variable in a synchronized manner, achieving serializable operations.

**Key Code Snippet:**

```cpp
void increment() { 
    lock.acquire(); 
    int tmp = X; 
    tmp = tmp + 1; 
    X = tmp; 
    lock.release();
}
```

**Conclusion:** Proper synchronization in operating systems ensures ordered and predictable outcomes even in a concurrent execution environment. The choice between one big lock and fine-grained locking depends on the specific requirements and challenges of the system at hand.




## Transactions
***

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


### Potential Issues with Concurrent Transactions

Consider two threads, A and B. If they execute in the following sequence, problems might arise:
1. Thread A locks resources, reads and modifies variables (e.g., x and y), logs the changes, and then unlocks.
2. Before Thread A commits, Thread B grabs the lock.
3. Thread B reads the uncommitted modifications of Thread A, makes its own changes, logs them, unlocks resources, and commits.
4. The system crashes before Thread A can commit.

This scenario highlights the complexities of ensuring durability in concurrent systems and the importance of transaction management techniques like write-ahead logging.
