+++
title = "Parallel & Distributed Computing"
description = "Notes from OS. An overview of Parallel & Distributed Computing, Two-Phase commit, Leader Election, RPC, NFS, and GFS."
date = 2023-09-19T08:08:52-05:00
tags = ["Computer Science Notes"]
+++

{{< toc >}}



## Parallel Computing
---

In the realm of parallel computing, we deal with **tightly-coupled systems**. These systems exhibit characteristics like:

- Shared clock across processors.
- A unified memory, implying a singular physical address space.
- Operation under a single OS.

Common manifestations of parallel computing can be seen in **Multicore systems** and **Symmetric Multi Processor (SMP) systems**.

Parallel programming isn't just about running things simultaneously. It involves:

1. **Decomposition**: Breaking an algorithm into smaller, manageable parts.
  
2. **Distribution**: Assigning these parts to threads or processes so they can work on them at the same time.

3. **Coordination**: Ensuring these processes communicate and sync up properly. Remember, while they work independently, they're all aiming for a common goal.

### Shared Memory and Message Passing Models

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

Shared Memory:
- **Advantages**: Quick communication since everything is in shared memory.
  
- **Challenges**: Requires explicit synchronization. Works best when all processes are on the same machine.
  
- **Use Cases**: Ideal for multi-core or multi-threaded applications on a single machine.

Message Passing:
- **Advantages**: Great for distributed systems where processes span multiple machines. Synchronization is inherently built-in.
  
- **Challenges**: Need to format data into messages, which might add overhead.
  
- **Use Cases**: Best for cluster computing or scenarios where the computational load needs to be distributed across machines, e.g., cloud computing.



## Distributed Computing
---

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

Beyond traditional distributed systems, we have **Grid computing** and **Cloud computing**.

- **Grid computing**: This involves computations spread across multiple locations and can involve heterogeneous architectures. An instance of this would be XSEDE.
  
- **Cloud computing**: While a more recent evolution, cloud computing enables scalable, on-demand computing resources often delivered via the internet.



## Challenges in Distributed Systems
---

Distributed systems, though robust and scalable, present unique challenges. Two big issues involve the ordering of events and maintaining atomicity across servers. 

### Event Ordering in Distributed Systems

For distributed systems to coordinate requests fairly and effectively, there must be a clear order to events. This becomes especially intricate when dealing with:

- **Stand-alone Systems/Parallel Computing**: Where there's a shared clock and memory.
- **Distributed Systems**: Where there's no global clock and each individual clock can drift due to differing speeds.

In standalone systems, the shared clock aids in determining the order of events. But in distributed systems, this isn't a luxury we possess. So, we rely on time-stamps for determining the order of events.

#### Addressing Event Ordering: Happened-Before Relation

To address this, the **Happened-Before Relation** comes into play:

1. If A and B are events in the same process and A executed before B, then A ® B.
2. If A is a message send event and B is the message's receipt, then A ® B.
3. If A ® B and B ® C, then A ® C.

When we're trying to determine event ordering in distributed systems, a significant realization is that a message must be sent before it can be received. Thus, Send/Receive events can synchronize clocks.

For **total event ordering**, a logical clock is maintained for each process. When an event occurs, the logical clock increments. If Process X sends a message to Process Y, it attaches a timestamp. Upon receiving, Process Y adjusts its clock based on this timestamp.

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
---

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



## Leader Election
---

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



## Remote Procedure Calls (RPC)
---

Remote Procedure Calls, or RPCs, are an essential mechanism for executing services across different systems in a distributed environment. 

1. **Basic Functionality:**
    * **Client-Side Role:** Clients use RPCs to invoke services provided by a remote server.
    * **Server-Side Role:** Servers offer (or "export") specific procedures that clients can invoke or "call."
    * **Communication Simplification:** One of RPC's major strengths is its ability to simplify inter-system communication. It conceals the intricate details of this communication, relegating them to the RPC Mechanism itself.

2. **RPC vs. Message Passing:**
    * It's crucial to understand that RPC is *not* the same as message passing. While both facilitate communication in distributed systems, message passing often demands more overhead and effort at the application layer.

3. **Abstraction Through RPC:** 
    * RPCs abstract the pattern of sending a message, waiting for a response, and then receiving a reply. This sequence is transformed into what appears to be a simple "procedure call."
    * With the help of a "stub," RPCs can be made to resemble "local" procedure calls. This stub operates behind the scenes, managing the complexities of communication between the client and server.

### Challenges with RPCs

As with any technology, RPCs come with their own set of challenges:

1. **Handling Failures:** 
    * One of the major hurdles in distributed systems is ensuring seamless execution despite potential system failures.
    * An application might become unresponsive or "hang" due to the remote server's malfunction or if the remote server's application crashes.
    * Renowned computer scientist Leslie Lamport humorously defined a distributed system as: "A system where you can't do work because a machine you've never heard of has crashed."

2. **Performance Concerns:**
    * The efficiency of RPCs can vary greatly based on the environment. For instance, the cost of a regular procedure call is usually much less than an RPC within the same machine. This, in turn, is typically faster than an RPC that involves communicating across a network.



## Consistency Models
---
Consistency models govern how data, kept in data stores such as registers, file systems, or databases, behaves when accessed concurrently by multiple entities. The models act as contracts between the data store and its clients, defining the results a client can expect when they access the data.

### Differentiating Coherence, Staleness, and Consistency

- **Coherence:** Concerned with ensuring that a read operation retrieves the latest write for a specific location. For example, if a non-coherent memory returned values like 1, 2, 3, 3, 3, 4, 8, 10, 9, 11, 12, 13, it means that the memory values have not been updated in the expected order. This could be due to reasons like network reordering or switching between different servers.

- **Staleness:** Focuses on the real-time delay between write and read operations at a specific location. For instance, if data says "At 1:00:00, the price is 10.50" and "At 1:00:01, the price is 10.55," but a read operation at 1:00:02 still shows 10.50, there's a staleness in the data. Reasons can include a long polling interval or delays due to network issues.

- **Consistency:** Looks at the order of reads and writes across multiple locations. A non-consistent memory might return results in a jumbled sequence, not respecting the inherent order of data.

### Consistency Semantics

- **Sequential Consistency:** Defined by Lamport in 1979, this is the idea that the outcome of any operation is consistent with some sequential order of operations, as long as individual operations adhere to their local order. Essentially, it ensures data coherence by maintaining a global order that respects local histories.

- **Limitations of Strong Consistency:** 
  - Achieving robust consistency comes with inherent costs. It is postulated that you can have either rapid reads or quick writes under sequential consistency, but not both simultaneously.
  - The CAP theorem, a fundamental principle in distributed systems, posits that only two out of three desired properties (Consistency, Availability, and Partition Tolerance) can be achieved simultaneously.

- **Weakening Sequential Consistency:** 
  - **FIFO Consistency:** As proposed by Lipton and Sandberg in 1988, writes from a single process are visible to others in the order they were made. However, writes from different processes might appear out of order to various entities.
  
  - **Causal Consistency:** Introduced by Hutto and Ahamad in 1990, this model ensures that causally related writes are perceived in the same order by all processes. However, concurrent writes might appear in different sequences across different machines.



## Network File System (NFS)
---
The Network File System is a distributed file system developed by Sun Microsystems in 1984. It stands as one of the most extensively used distributed file systems and is even utilized by UTCS.

Files are stored on remote file servers, and clients can access these files transparently, sometimes without even realizing they are not stored locally.

**Locating Files in NFS**
- **Naming**: NFS uses implicit naming, offering location transparency. This means the file's name doesn't disclose the server on which it's stored. This is different from explicit naming which might look like `<file server: file name>` or `//anslaptop/Users/ans/Desktop`.
- **Finding the Server**: NFS uses the Mount protocol to achieve static, location-transparent mapping. Users can mount remote directories as if they were local and a mount table keeps track of the directory to server mapping.

**Performance in Basic Use-Case**
- **RPC Utilization**: For each file system request (open, seek, read, write, close, etc.), Remote Procedure Calls (RPC) forwards it to the remote server. The server treats each operation as a local request and returns the result.
- **Pros**: The server offers a uniform view of the file system to all distributed clients. But, what does "consistent" really mean in this context?
- **Cons**: Such a system often suffers from performance inefficiencies.

**Sun's NFS Performance Enhancement**
- **Caching**: NFS caches data blocks, file headers, and other elements on both the client and server side. These caches usually reside in memory, but a client-side disk can also be used.
- **Cache Update Policy**: There are two main policies - write-back and write-through.
- **Benefits**: Common operations like read, write, and stat can be done locally, leading to reduced network load and improved client performance.

**NFS Issues**
- **Consistency Challenge**: When multiple clients access the same file, issues arise. If all are reading, it's not a problem. But, if one or more clients modify the file, the situation gets complex.
    - **Client-Initiated Weak Consistency Protocol**: Clients periodically check with the server if the file has been modified. Changes on a client notify the server, typically using a delayed write-back policy.
    - **Server-Initiated Consistency Protocol**: Another approach is for the server to initiate the consistency protocol.
- **Handling Failures**: If a server crashes, can the client wait and resume operations? Issues include the loss of data in server memory, lost client states, and retried messages. Client crashes can result in data loss in the client cache.

**NFS Protocol Features**
- **Statelessness**: NFS operates without storing any state info about clients or their open files, except as performance hints.
- **Idempotent Operations**: Requests can be repeated without causing any unwanted effects.
- **Server Failures**: These are almost invisible to clients. They either wait for server recovery or crash after a certain waiting period.

**NFS Summary**
- **Key Features**: 
  - Location-transparent naming
  - Caching on both client and server sides
  - Stateless design
  - Client-initiated weak consistency
- **Strengths**: NFS is straightforward and boasts high portability.
- **Weaknesses**: It doesn't offer strong consistency.



## Google File System (GFS)
---
**Design Considerations for GFS**

- **File Size**: Unlike traditional file systems, GFS handles massive files. Multi-gigabyte files are ordinary and the system can manage billions of objects.
- **File Modifications**: The majority of changes in GFS are appends. Random writes are virtually absent, and many files follow a write-once, read-sequentially pattern.
- **Types of Reads**: There are mainly two:
  - **Large Streaming Reads**: Sequential reads of vast chunks of data.
  - **Small Random Reads**: Reading smaller amounts of data randomly, but typically moving forward.

- **File Storage & Failures**: 
  - GFS files are kept across a cluster ranging from 10,000 to 100,000 servers.
  - Component failures are common given the massive scale, running on basic Linux machines. This requires a robust system for monitoring, error detection, fault tolerance, and automated recovery.
  - For GFS, maintaining high bandwidth consistently is more vital than achieving low latency.

**GFS's Main Design Goal: Scalability**

- **Distribution**: Partitioning data and computations across many machines.
- **Replication**: Keeping multiple copies of data on different machines to enhance accessibility and fault-tolerance.
- **Caching**: Letting client processes fetch data from local copies to speed up access times.

**Architectural Overview of GFS**

- **Cluster Configuration**: 
  - **Master Node**: There's one master per GFS cluster. It's in charge of metadata, managing access control, and unfortunately, is a single point of failure.
  - **Chunk Servers**: Each master node can have several chunk servers. They handle direct reading/writing operations and are accessed by numerous clients.
- **File Structure**: 
  - Files are split into fixed-sized chunks.
  - These chunks undergo 3-way replication and are stored on the chunk servers.
  - Every chunk is assigned a 64-bit unique ID and is 64 MB in size, significantly larger than standard file system blocks.

**Consistency Model in GFS**

- **Types of Updates**: GFS primarily has two:
  - **Writes**: At an offset specified by the application.
  - **Record Appends**: At an offset determined by GFS.
- **Consistency Approach**: 
  - GFS offers a relaxed consistency model where concurrent modifications ensure consistency but don't guarantee order or atomicity. 
  - Record appends are atomically committed at least once, ensuring integrity even during simultaneous updates.
  - To maintain consistency across replicas, updates are applied in a uniform sequence. Chunk version numbers aid in identifying outdated replicas.
  - Although a client might occasionally access outdated data, this staleness is restricted by cache entry timeouts.
