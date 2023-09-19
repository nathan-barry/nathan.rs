+++
title = "RPC, Consistency Models, & NFS and GFS"
description = "These are my notes over Professor Norman's Operating Systems course. Notes closely follow the in class lecture slides."
date = 2023-09-19T09:32:54-05:00
tags = ["Operating Systems Notes"]
priority = 18
+++

{{< toc >}}



## Delving into Remote Procedure Calls (RPC)
***

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



## Understanding Consistency Models in Distributed Systems
***
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
***
- **Network File System (NFS)**: A distributed file system developed by Sun Microsystems in 1984.
- **Prominence**: It stands as one of the most extensively used distributed file systems and is even utilized by UTCS.
- **Functionality**: Files are stored on remote file servers, and clients can access these files transparently, sometimes without even realizing they are not stored locally.

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




## Google File System (GFS) Explained
***
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

**Wrapping it Up: Comparing Distributed & Local Systems**

- **Challenges**: Distributed file systems like GFS present more complications than local systems due to their scale and intricacies in data management.
- **Consistency Guarantees**: Models like that of GFS provide users with assurances on how and when updates become visible.
- **NFS vs. GFS**: 
  - **NFS**: Developed by Sun in 1984, uses Remote Procedure Calls (RPC) and abstraction layers for seamless access. It employs 'mount' to amalgamate multiple file systems into a singular user-visible system.
  - **GFS**: Tailored for gigantic files with specific access tendencies and engineered to handle an immense number of concurrent users.

