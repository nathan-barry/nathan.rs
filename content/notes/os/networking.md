+++
title = "Networking & Sockets"
description = "Notes from OS. An overview of IP addresses, DNS, Ethernet, OSI model, TCP Flow, Ports, Sockets, and client-server interactions."
date = 2023-09-16T13:56:14-05:00
tags = ["Computer Science Notes"]
+++

{{< toc >}}



## Networks
*** 
At its core, a network is a system of interconnected lines or channels.

From an OS perspective, it perceives the network just like any other device. When we attach a Network Interface Controller (NIC) to the computer's bus, the OS facilitates data transfer between memory and the NIC, using DMA (Direct Memory Access) or memory-mapped I/O. However, ensuring the efficient functioning of this device requires intricate software and metadata management.

### Domain Names to IP Addresses
One of the fundamental tasks in networking is converting user-friendly text (like a website domain) to a machine-understandable number, an IP address.

For instance:
- `skipper.cs.utexas.edu` maps to `128.83.139.82`
- `www.ox.ac.uk` translates to `129.67.242.154`

Back in 1996, the Internet Engineering Task Force (IETF) introduced IPv6 with 128-bit addresses to eventually replace IPv4's 32-bit format. As of 2018:
- Most internet traffic still uses IPv4.
- The usage of IPv6 has seen an increase, with about 22% of users accessing Google services via IPv6, up from 4% in 2015.

Examples:
- IPv4 Address: `128.83.139.82`
- IPv6 Address: `fe80::46a8:42ff:fe44:a726`

### Domain Naming System (DNS)
DNS is pivotal to the Internet's functioning. It maintains a mapping between IP addresses and domain names in a vast, worldwide distributed database. Conceptually, one can visualize the DNS database as a collection of numerous host entries, each defining a mapping between domain names and IP addresses. In mathematical terms, a host entry represents an equivalence class of domain names and IP addresses.

To visualize the hierarchical nature of domain names:
- Root (Unnamed)
  - First-level domain names (e.g., `.net`, `.edu`, `.gov`, `.com`)
    - Second-level domain names (e.g., `utexas`, `berkeley`, `amazon`)
      - Third-level domain names (e.g., `skipper` with IP `128.83.139.132`, `www` with IP `128.83.120.48`)

### Internet Protocols and Routing

Data is sent in the form of "packets" using the Internet Protocol (IP). These packets are routed based on the destination IP address. The IP address space is structured to make this routing feasible even on a global scale. For instance, IP addresses beginning with `128.83.*.*` are directed towards UT.

In simple terms, if a machine wants to send a message, it directs the message to a set of local names. If the recipient isn't part of this local network, the message is sent to a "Gateway." This Gateway serves as the doorway to the broader internet, leading the message to its final destination.

#### The Concept of Internets
When we discuss the internet, it's crucial to understand that there are many interconnected networks. Sometimes, these networks are incompatible. To bridge these, we use specialized computers known as *routers*. When multiple such networks are physically connected, the combined entity is referred to as an "internet."

The most renowned example of an internet is the Global IP Internet. Most modern computers communicate using IP, and when we've discussed data transmission examples earlier, we've primarily focused on this Global IP Internet.




## Ethernet and Network Classifications
***

### Ethernet: The Backbone of Local Area Networks

- **Structure & Function**: At its core, Ethernet consists of multiple hosts interconnected by wires to a central hub. Each of these hosts possesses at least one Ethernet adapter. This hub is responsible for copying each bit from each adapter to every other adapter on that hub.

- **Unique Identification**: Every Ethernet adapter is endowed with a distinct 48-bit MAC address, also known as the Media Access Control address. An example might look something like `00:16:ea:e3:54:e6`.

### Classifying Networks by Their Scope and Reach

1. **System Area Network (SAN)**:
   - **What**: Primarily connects a cluster or an entire machine room.
   - **Characteristics**: Examples include Quadrics and Fibre Channel.
2. **Local Area Network (LAN)**:
   - **What**: Connects nodes or devices within a singular building.
   - **Characteristics**: It's expected to be both fast and reliable. Ethernet is a prime example of LAN.

3. **Wide Area Network (WAN)**:
   - **What**: Links nodes across broader geographical spaces, be it statewide, nationwide, or even globally.
   - **Characteristics**: WANs tend to be slower and not as reliable compared to LANs. They often utilize high-speed point-to-point phone lines for connectivity.




## Network Processes and Reliability
***

### The OSI Model

The Open Source Interconnection (OSI) 7 Layer Model provides a structured framework to categorize network operations. It offers a common vocabulary, helping network engineers collaborate more effectively. Here's a brief breakdown:

1. **Layer 1**: Physical (Hardware)
2. **Layer 2**: Data-Link (MAC, physical addressing)
3. **Layer 3**: Network (Routing)
4. **Layer 4**: Transport (TCP)
5. **Layer 5**: Session (Interhost communication)
6. **Layer 6**: Presentation (Data representation, encryption)
7. **Layer 7**: Application

#### Understanding Network Layers

- **Layer 2**: Communicates using MAC addresses and frames between hardware devices.
- **Layer 3**: Enables host-to-host communication across various Layer 2 networks using IP addresses and packets.
- **Layer 4**: Facilitates process-to-process communication using ports, segments (in TCP/IP), or datagrams (in UDP). Generally, everything is referred to as packets.

#### Organization of an Internet Application

**Hardware and Software Layers:**
- At the topmost level, there's the **user code**.
- The **kernel code** manages core operations.
- **TCP/IP** handles the communication protocols.
- **Network adapters** manage the physical or wireless connections to networks.
- **Sockets** provide an interface for system calls.
- The **hardware interface** deals with physical interruptions, ensuring smooth data transmission.

#### Layer 4: TCP/IP Protocols

Layer 4 ensures the right data reaches the intended process for communication. 

Two key protocols dominate this layer: TCP/IP and UDP. Both are built atop IP.

- **UDP (User Datagram Protocol)**:
    - It utilizes IP for process-to-process datagram delivery.
    - UDP is inherently unreliable, with datagrams susceptible to several issues such as bit errors, buffering-induced losses, link/node failures, and delivery inconsistencies like delays, reorderings, and duplications.
    - All these challenges are exposed directly to the application.
    - Used in lossy applications, like video streaming.

- **TCP (Transmission Control Protocol)**:
    - Also harnesses IP to establish reliable byte streams from one process to another across connections.
    - The network simulates a reliable connection, masking issues like lost and reordered segments. This ensures applications don’t need to manage such anomalies.
    - TCP handles congestion, flow control, and most internet applications prefer it.

#### TCP: Simulating Reliability

Some TCP features are:
- **Guaranteed Delivery**: Ensures that the data sent will reach its destination.
- **Session-oriented**: A session is established before data transmission begins.
  
**Reliable Data Transfer**:
- A crucial aspect of TCP is the use of acknowledgements (ACKs). 
  - The process involves the sender transmitting a segment and initiating a timer. Upon successful reception, the receiver sends back an ACK. The sender, in turn, resets the timer upon receiving this ACK.
  - Important components in this mechanism include buffers at the sender, receiver, and router ends. Data is acknowledged (ACKed) as it's read from the buffer by the application.
  - To optimize the bandwidth usage, the goal is to have multiple segments in transit simultaneously.

**Efficient Data Arrival**:
- The modern approach is to pipeline the older solution.
- Optimizations include:
    - **Cumulative ACKs**: Acknowledging multiple segments at once.
    - **Immediate Resend on Negative Acknowledgement (nack)**
    - **Delayed ACKs**: In bidirectional communication, the response from the application acts as an implicit ACK.




## TCP/IP: Flow and Congestion Control
***

### TCP Flow Control

TCP Flow Control is designed to manage the rate of data flow between the sender and the receiver. This mechanism ensures that the data sender does not overwhelm the receiver by sending too much data too quickly.

**Key Points**:
- The receiver has a buffer for incoming data.
- If this buffer is overwhelmed or "overflows," segments (data packets) will be dropped.
- The sender constantly estimates the available buffer space at the receiver's end.
- This estimation allows the sender to track the volume of data that has been transmitted versus the volume that has been acknowledged as received.
- Crucially, the sender makes sure that the unacknowledged data volume doesn't surpass the estimated free buffer space at the receiver's end.

### TCP Congestion Control

In the realm of TCP, congestion control is pivotal. It governs how data is sent over the network to ensure that the network isn't overburdened, which could lead to dropped packets or significant delays.

The **TCP congestion window** is a dynamic limit set on the number of bytes that can be sent without awaiting an acknowledgement (ACK).
Its primary role is to ensure that the sender doesn't overflow the buffer at the receiver's end.

The window size adjusts according to the network's state; it grows for high-latency networks and reduces for networks with frequent data losses.

#### TCP Congestion Control's Algorithmic Components:
1. **Slow Start**: An initial phase where the congestion window size starts small and grows rapidly to discover the network's capacity.
2. **Reaction to Timeout Events**: If an ACK isn't received within an expected timeframe, the sender assumes there's network congestion and reacts by reducing the congestion window size.
3. **Round Trip Variance Estimation**: Estimating the variability in round-trip times to optimize the retransmission strategy.
4. **Exponential Retransmit Timer Backoff**: When a segment is not acknowledged, the time before it's retransmitted is exponentially increased, thus ensuring the network isn't flooded with retries.
5. **Additive Increase, Multiplicative Decrease (AIMD)**: As the name suggests, the window size is increased gradually until a loss is detected (additive increase). Post-detection, the size is decreased significantly (multiplicative decrease) to quickly adapt to network congestion.

The effectiveness of TCP/IP relies heavily on its congestion control mechanisms. These protocols ensure that data is transmitted efficiently and without overburdening network resources.

#### 1. Additive Increase, Multiplicative Decrease (AIMD)

**Additive Increase**:
- For every round trip time (RTT), the congestion window increases linearly, i.e., by one segment size.

**Multiplicative Decrease**:
- After any loss event, the congestion window size is reduced by half.
- This decrease ensures a quick adaptation to network congestion.
- The congestion window size never goes below one segment size.

#### 2. Slow Start

When a TCP connection initiates:
- The congestion window starts from one segment.
- However, increasing linearly from this point would be too lethargic for optimal data transfer.
- Thus, during the 'slow start' phase, the window size grows exponentially.
- This results in the congestion window doubling after each RTT until a loss event occurs.
  
#### 3. Reaction to Timeout Events

In the case of a timeout:
- The congestion window drops to a single segment size.
- There is an initial slow start mode until the congestion window reaches a predefined threshold.
- After this threshold, the algorithm switches to an additive increase mode.

#### 4. RTT Variance and Retransmit Backoff

The timeout settings for TCP have evolved over time:
- Original TCP protocols set the timeout to twice the estimated RTT.
- This was problematic, especially under high loads, leading to unnecessary retransmissions.
- Modern TCP algorithms adaptively set the timeout to be the sum of the estimated RTT and four times the mean deviation of the RTT.
- The retransmission delay is managed exponentially. This ensures stability and explains why web browsers may stall for specific intervals. 
    - *Tip*: If a page doesn't load within 5 seconds, hitting reload might be a good idea.

#### TCP's Relationship with the Operating System

TCP is deeply embedded within the OS:
- The OS is responsible for tracking unacknowledged data, which involves maintaining copies and timers.
- The receiver reorders out-of-sequence segments.
- The OS keeps all this data in the **Protocol Control Block (PCB)**.
- TCP must acknowledge received segments promptly.


### Costs Involved

Data transfer over the internet, whether it's a simple web page request or streaming a movie, comes with associated costs:

- **Latency**: The time it takes for one byte of data to travel from one place to another. For example, the latency from New York to San Francisco, given the speed of light in fiber, is approximately 15 ms.
- **Throughput**: Refers to the maximum bytes transferred per second, which is essentially the bandwidth. However, having a high bandwidth does not always ensure fast data transfer.
- For optimal performance:
    - In Local Area Networks (LANs), it's crucial to minimize overhead.
    - In Wide Area Networks (WANs), it's essential to maintain a constant flow of data.

- **Machine Costs**
  - **Overhead**: This refers to the CPU time required to prepare data for transfer or to process incoming data. This includes time taken for protocol processing.



## Ports and Sockets
***

Clients and servers exchange data by transmitting streams of bytes over connections.

Every process in a system is identified uniquely by a port. A port is a 16-bit number that acts as an identifier for a process.

- **Well-known Port**: Certain ports are designated for specific services. For instance, port 80 is primarily associated with web servers.
    
- **Ephemeral Port**: These are ports automatically assigned by the client's kernel when a connection request is made.
        
Sockets, integral to internet applications today, were first introduced in the early '80s. They came as part of the original Berkeley distribution of UNIX, which included an early version of the Internet protocols.

A socket can be visualized as the endpoint of a connection. Each socket is associated with a unique address, which is a combination of an IP address and a port, often represented as `IPaddress:port`.

### Dissecting an Internet Connection

- **Client and Server Addresses**: In any internet connection, both the client and server have unique addresses that determine the endpoints of communication. An example:
    - Client Host Address: `128.2.194.242`
    - Server Host Address: `208.216.181.15`

    This pairing of client and server addresses is called a *Connection socket pair*.
    - Client socket address: `128.2.194.242:51213`
    - Server socket address: `208.216.181.15:80`

    Notably, `80` is a well-known port associated with web servers, while `51213` represents an ephemeral port that is allocated dynamically by the kernel.

### Understanding Well-known Ports and Service Names

- **Defined Ports**: For seamless operation, certain services are permanently assigned specific ports, known as "well-known ports". Alongside, these ports also have corresponding service names to make identification easier. Here are some examples:
    - Echo server: `:7/echo`
    - SSH servers: `:22/ssh`
    - Email servers: `:25/smtp`
    - Web servers: `:80/http`
    - HTTPS servers: `:443/https`

- **Port-to-Service Mapping**: The relationship between well-known ports and their respective service names can be found in the `/etc/services` file on Linux machines.

### Sockets

From the kernel's perspective, a socket is merely an endpoint of communication. For an application, a socket is a gateway to the network. It's seen as a file descriptor that permits the application to read and write data from and to the network.
    
In Unix and its derivatives, all I/O devices, including networks, are treated as files. Thus, for applications, simply reading from or writing to socket descriptors, clients and servers can communicate.

``` 
Client      Server
clientfd -> serverfd 
```

One key distinction that sets apart regular file I/O from socket I/O is the methodology through which applications "open" the socket descriptors.



## Client-Server Interaction
***

**Server Side**:
1. `getaddrinfo`: Resolve server's own hostname.
2. `socket`: Create a socket descriptor.
3. `bind`: Assign the server's address to the socket.
4. `listen`: Listen for incoming connection requests.
5. `accept`: Accept the connection from a client.

Upon accepting a client's connection request, the server enters into a communication session, exchanging data until either side chooses to end it.

**Client Side**:
1. `getaddrinfo`: Translate the server's hostname to an address.
2. `socket`: Create a socket descriptor.
3. `connect`: Initiate a connection to the server.

After successfully connecting, the client is in the communication session, sending and receiving data.

This interaction continues with data being exchanged in the form of `send()` and `recv()` calls. The session concludes when the connection is closed, typically marked by an end-of-file (EOF) event.

### Distinguishing Between Listening and Connected Descriptors

The server works with two kinds of socket descriptors:

1. **Listening Descriptor**:
    - Acts as the server's "door" for new connection requests.
    - Once created, it's there for the lifetime of the server.

2. **Connected Descriptor**:
    - Represents an active connection between the client and the server.
    - Every time a new client connects, a fresh connected descriptor is minted.
    - This descriptor's life is transient; it lasts just long enough to service the client.

This distinction allows the server to manage multiple client connections at the same time.
