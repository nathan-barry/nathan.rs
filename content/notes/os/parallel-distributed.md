+++
title = "Parallel & Distributed Computing"
description = "These are my notes over Professor Norman's Operating Systems course. Notes closely follow the in class lecture slides."
date = 2023-09-19T08:08:52-05:00
tags = ["Operating Systems Notes"]
priority = 17
+++

{{< toc >}}



## Parallel Computing
***

In the realm of parallel computing, we deal with **tightly-coupled systems**. These systems exhibit characteristics like:

- Shared clock across processors.
- A unified memory, implying a singular physical address space.
- Operation under a single OS.

Common manifestations of parallel computing can be seen in **Multicore systems** and **Symmetric Multi Processor (SMP) systems**. Moreover, it's intriguing to note that SMP systems can further incorporate multicore processors.

Parallel programming isn't just about running things simultaneously. It involves:

1. **Decomposition**: Breaking an algorithm into smaller, manageable parts.
  
2. **Distribution**: Assigning these parts to threads or processes so they can work on them at the same time.

3. **Coordination**: Ensuring these processes communicate and sync up properly. Remember, while they work independently, they're all aiming for a common goal.

So, how exactly have we been leveraging parallel programming? Reflecting on our journey so far this semester might provide some clues.

### Choosing the Right Parallel Programming Model

There are primarily two models of parallel programming:

1. **Shared Memory**:
    - **Communication**: Processes or threads use shared memory locations to communicate. This communication is implicit, fast, and efficient.
      
    - **Synchronization**: Explicit. You use OS services or specialized libraries to ensure proper synchronization.
      
    - **Location**: All cooperating processes or threads should run on the same machine.

2. **Message Passing**:
    - **Communication**: Processes communicate by packaging and transmitting messages over a network. This approach makes the communication explicit.
      
    - **Synchronization**: Implicit and done via message sending/receiving.
      
    - **Location**: Processes can run on the same computer or different computers connected by a network.
      
    - **Tools**: Libraries like MPI help abstract the intricacies of message passing.

### Distinguishing Between Shared Memory and Message Passing Models

*Shared Memory*:
- **Advantages**: Quick communication since everything is in shared memory.
  
- **Challenges**: Requires explicit synchronization. Works best when all processes are on the same machine.
  
- **Use Cases**: Ideal for multi-core or multi-threaded applications on a single machine.

*Message Passing*:
- **Advantages**: Great for distributed systems where processes span multiple machines. Synchronization is inherently built-in.
  
- **Challenges**: Need to format data into messages, which might add overhead.
  
- **Use Cases**: Best for cluster computing or scenarios where the computational load needs to be distributed across machines, e.g., cloud computing.

Both shared memory and message passing have their own set of advantages, and the choice between them depends largely on the architecture and nature of the problem. As our computational problems grow in complexity, mastering these parallel programming techniques becomes increasingly essential. In the end, the goal is to maximize efficiency, reduce latency, and achieve faster results.




## Distributed Computing
***

Distributed systems are best described as **loosely-coupled systems**. They consist of:

- Multiple, physically distinct processors.
- Processors connected by one or multiple communication links, commonly referred to as **nodes**.
  
What distinguishes distributed computing is:

- Each processor maintains its own memory.
- Every processor operates an independent OS.
- Individual clocks govern each processor.

As a consequence, communication in distributed systems tends to be more costly compared to parallel computing. Some prevalent examples of distributed computing implementations include:

- Email and web servers.
- Printers accessed over a network.
- Backup services over networks.
- The World Wide Web.
- Supercomputers, Clusters, and Massively Parallel Machines.

A tangible example would be **Frontera**, which is a TACC Supercomputer, or a cluster composed of 64 dual-processor PCs all connected by a 100Mb/Sec Ethernet switch.

Beyond traditional distributed systems, we have **Grid computing** and **Cloud computing**.

- **Grid computing**: This involves computations spread across multiple locations and can involve heterogeneous architectures. An instance of this would be XSEDE.
  
- **Cloud computing**: While a more recent evolution, cloud computing enables scalable, on-demand computing resources often delivered via the internet.



## Unique Challenges in Distributed Systems
***

Distributed systems, though robust and scalable, present unique challenges. Two particularly intricate issues involve the ordering of events and maintaining atomicity across servers. 

### Event Ordering in Distributed Systems

For distributed systems to coordinate requests fairly and effectively, there must be a clear order to events. This becomes especially intricate when dealing with:

- **Stand-alone Systems/Parallel Computing**: Where there's a shared clock and memory.
- **Distributed Systems**: Where there's no global clock and each individual clock can drift due to differing speeds.

The primary question that arises is: *How can we order events that execute on physically separate systems?* 

In standalone systems, the shared clock aids in determining order. But in distributed systems, this isn't a luxury we possess. So, we rely on time-stamps for determining the order of events. This then raises another question: What does "time" even mean in a distributed context?

#### Addressing Event Ordering: Happened-Before Relation

To address this, the **Happened-Before Relation** comes into play:

1. If A and B are events in the same process and A executed before B, then A ® B.
2. If A is a message send event and B is the message's receipt, then A ® B.
3. If A ® B and B ® C, then A ® C.

To further explain:

- When we're trying to determine event ordering in distributed systems, a significant realization is that a message must be sent before it can be received. Thus, Send/Receive events can synchronize clocks.
- For **total event ordering**, a logical clock is maintained for each process. When an event occurs, the logical clock increments. If Process X sends a message to Process Y, it attaches a timestamp. Upon receiving, Process Y adjusts its clock based on this timestamp.

### Atomicity in Distributed Systems

Atomicity ensures operations are all-or-nothing, meaning every operation within a system completes successfully or none do. In distributed systems, achieving atomicity can be challenging, especially when updates need to be made across multiple servers. 

For instance, consider these examples:

1. Atomically moving a file from Server A to Server B.
2. Atomically transferring $100 from one bank to another.

However, issues arise:

- Messages exchanged can be lost.
- Systems might crash.

The key question becomes: *Can we leverage messages and retries over an unreliable network to synchronize two machine's actions?*



### Distributed Consensus and The Generals’ Paradox

A classic problem that illustrates the challenges of distributed consensus is **The Generals’ Paradox**:

- Two generals separated by mountains can only communicate via messengers.
- These messengers could be lost or intercepted.
- The generals aim to coordinate their attack, knowing that if they attack at different times, they'd lose. But if they attack simultaneously, they'd win.

The core challenge is ensuring that both generals are confident in the coordination. This problem underscores the inherent difficulty of achieving absolute consensus in distributed systems, especially when communication can be unreliable.

#### Distributed Consensus with Link Failures

In situations where communication links might fail, achieving consensus is impossible. This understanding derives from an iterative elimination of message exchanges, showing that even if we have a theoretical solution, the absence of certain messages makes it impractical. As a result, timeouts become popular in distributed algorithms. Success becomes probable but is not guaranteed within a bounded time frame.




## Two-Phase Commit
***

In the realm of distributed computing, achieving atomicity across multiple machines is no simple feat. The Two-Phase Commit (2PC) protocol offers a structured way to coordinate such transactions under favorable conditions. Here's an overview of how this protocol works and its implications.

**Distributed Transactions** are scenarios where two or more machines agree to perform an action atomically. It's worth noting:

- They don't necessarily need to act simultaneously.
- The Two-Phase Commit protocol facilitates this coordination.
- Each machine involved uses a log to monitor whether the transaction was committed.

### Phase 1: Coordination Request

In this initial phase:

1. The **Coordinator** sends a REQUEST to all participants involved in the transaction.
   * For example: 
     * `C → S1: "delete foo from /"`
     * `C → S2: "add foo to /quux"`

2. Participants, upon receiving this request:
   * Execute the transaction locally. This could mean merely logging the transaction.
   * Log their decision as either `VOTE_COMMIT` or `VOTE_ABORT`.
   * Relay their decision back to the coordinator.

### Phase 2: Commit or Abort

Based on the responses from the participants, the coordinator makes a choice:

1. **If any participant votes to abort** or if there's a timeout, the coordinator:
   * Logs `GLOBAL_ABORT`.
   * Notifies all participants to abort the transaction.

2. **If all participants vote to commit**, the coordinator:
   * Logs `GLOBAL_COMMIT`.
   * Instructs all participants to commit the transaction.

Participants then log the received decision, be it `GLOBAL_COMMIT` or `GLOBAL_ABORT`.

### Robustness of Two-Phase Commit

The 2PC protocol can be formally proved to work under the mentioned conditions. Consider the scenarios:

1. **Participant crashes during request phase** before logging: Upon recovery, this participant doesn't act. The coordinator will note the timeout, abort the transaction, and perhaps attempt again.

2. **Coordinator crashes during the second phase**: When it restarts:
   * If there's no `GLOBAL_*` in the log, it sends `GLOBAL_ABORT` to participants and might retry.
   * If `GLOBAL_ABORT` is present in the log, it sends `GLOBAL_ABORT` to the participants.
   * If `GLOBAL_COMMIT` is logged, it dispatches `GLOBAL_COMMIT` to the participants.

### Limitations and Solutions

Despite its utility, 2PC is not without flaws:

- **Indefinite Blocking**: If the coordinator crashes during Phase 2 and remains down, participants might be blocked indefinitely, potentially holding onto resources like locks.

A workaround involves participants reaching out to others when a timeout occurs. If any participant:

- Has received `GLOBAL_ABORT`, then the transaction should be aborted.
- Sent `VOTE_ABORT`, then the transaction should be aborted.
- If all voted to commit but none have received a `GLOBAL_*` decision, we cannot definitively commit since the coordinator might've logged `GLOBAL_ABORT`.


The Two-Phase Commit protocol, despite its challenges, serves as a foundational approach for distributed transactions. With a message complexity of 3(N-1), it stands as a testament to the intricacies of coordinating multiple nodes. For those seeking to employ 2PC:

- Recognize situations where indefinite blocking can occur.
- Assess whether such risks are acceptable.
- If 2PC falls short, delve into advanced distributed coordination methods or consider specialized courses in distributed computing for deeper insights.

By grasping the nuances of protocols like 2PC, one can better navigate the complexities of distributed systems, ensuring robust and synchronized operations across multiple nodes.




## Leader Election in Distributed Systems
***

In distributed systems, where multiple machines or processes collaborate to achieve a goal, deciding which machine leads the charge can be crucial. This is especially true when a previously appointed leader fails or when the system starts up without an initial leader. One common solution to this problem is the use of leader election algorithms.

In many distributed algorithms, a **coordinator** or leader is essential to drive the protocol, make decisions, or manage resources. If the coordinator suddenly crashes or there's no designated leader at the system's startup, we elect a leader.


### The Bully Algorithm

One popular election algorithm for leader election is the **Bully Algorithm**. Let's delve deeper:

#### Assumptions:

1. Each process is assigned a unique identifier or number.
2. Using these process numbers won't lead to unfairness.

#### Basic Concept:

- If a leader is silent for an unusually long time, it's assumed to have crashed.
- The next leader should ideally be the process with the highest identifier still in operation.
- Processes that consider themselves eligible for leadership broadcast their intent.
- During this "campaign," processes close to the top rank check for the crash of the claiming process (evidenced by silence).
- If a process doesn't hear from higher-ranked competitors after a specific interval, it assumes leadership.
- Should a previously higher-ranked process come back online, it can reclaim its leadership, maintaining the invariant that the highest-ranked process always leads.

#### Algorithm Details:

1. Process $ P_i $ broadcasts its aspiration to become the leader and then waits for $ T $ seconds before announcing its victory.
2. If $ P_i $ receives a message from a process $ P_j $ such that $ j > i $ within the waiting time, $ P_i $ postpones its claim for another $ U $ seconds. Typically, $ U $ is about $ 2T $ or $ T + $ the broadcast time.
3. If only processes $ P_j $ with $ j < i $ respond within $ T $ seconds, $ P_i $ then declares itself as the new leader.
4. If $ P_i $ gets a leadership claim from a process $ P_j $ where $ j < i $, $ P_i $ restarts its election process, essentially "bullying" its way.
5. On the other hand, if $ P_i $ hears from a higher-ranked $ P_j $ claiming leadership, $ P_i $ acknowledges this.

