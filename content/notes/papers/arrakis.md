+++
title = "Arrakis: The Operating System is the Control Plane"
description = "Authors: Simon Peter, Jialin Li, Irene Zhang, Dan R. K. Ports, Doug Woos, Arvind Krishnamurthy, Thomas Anderson, Timothy Roscoe"
date = 2024-09-22T11:51:02-05:00
tags = ["Papers Notes"]
draft = true
+++

{{< toc >}}



<br>

## Abstract
---
- **Key Idea**: Arrakis leverages modern hardware trends to redesign network server operating systems by splitting the kernel’s role.
- **Traditional OS**: Typically, the kernel mediates all access to hardware to enforce security and isolation.
- **Arrakis Approach**: Applications gain direct access to virtualized I/O devices, bypassing the kernel for most operations, while the kernel manages security and isolation through a control plane.
- **Performance**: Arrakis demonstrates significant performance improvements, with 2–5× lower latency and 9× higher throughput for a NoSQL store compared to a well-tuned Linux system.


<br>

## Introduction
---
- **Overhead in OS abstractions**: Operating systems add overhead in I/O operations, particularly in modern client-server computing, where high-speed networks and low-latency memory have raised efficiency expectations.

- **Server inefficiencies**: Server applications often perform simple tasks but must repeatedly traverse the OS kernel, leading to significant overhead in processing tasks like delivering interrupts, packet handling, and file system management.

- **Arrakis goals**: This paper explores removing the kernel from the I/O data path while maintaining traditional OS-level security. The aim is to show that high performance does not need to compromise security.

- **Prototype and results**: The authors implemented their model on the Barrelfish OS and achieved substantial performance improvements. For instance, Redis achieved 2× better read latency, 5× better write latency, and 9× better write throughput compared to Linux.

**Key contributions**:
  - Proposing a division of responsibilities between hardware, the OS kernel, and user-space applications for I/O operations.
  - Implementing a prototype of this model and testing on modern hardware.
  - Demonstrating significant performance gains across several network services, including Redis, without requiring major changes to the application interface.


<br>

## Background
---
This section discusses current I/O overheads and how Arrakis, by leveraging modern hardware technologies, removes OS mediation to improve performance while maintaining security and isolation.

### Networking Stack Overheads:
- **UDP Echo Server Example**: Demonstrates the four main sources of OS overhead in packet processing:
  1. **Network stack costs**: Hardware, IP, and UDP layer processing.
  2. **Scheduler overhead**: Waking and context-switching processes.
  3. **Kernel crossings**: Switching between kernel and user space.
  4. **Packet data copying**: Moving data between kernel and user buffers.
- **Arrakis Optimization**: Removes scheduling and kernel crossing overhead, reduces contention, and streamlines the network stack by delivering packets directly to user space.

### Storage Stack Overheads:
- **Write + fsync Experiment**: Measures CPU overhead in OS storage stacks using small write operations followed by `fsync` on a RAM disk.
- **Main sources of overhead**: Data copying, access control checks, block and inode allocation, VFS layer, metadata updates, and journaling.
- **Hardware impact**: Modern flash-backed DRAM and PCIe-attached flash significantly reduce write latency, highlighting OS overhead (up to 5× for `btrfs`).

### Application Overheads:
- **Redis Example**: Shows that I/O stack overhead dominates operation latencies in datacenter applications.
  - **Linux**: 76% of read latency and 90% of write latency comes from socket and I/O operations.
  - **Arrakis**: Reduces socket latency by 68% and I/O latency by 82%. Better cache behavior and kernel-crossing avoidance also reduce application-level overheads.

### Hardware I/O Virtualization:
- **SR-IOV (Single-Root I/O Virtualization)**: Enables high-speed I/O for multiple virtual machines by creating "virtual functions" that are directly mapped to different VMs with hardware protection.
- **Arrakis Use**: SR-IOV, IOMMU, and adapters allow direct application-level access to I/O devices, generalizing the idea of U-Net to modern storage and networking hardware.
- **RDMA (Remote Direct Memory Access)**: Provides user-level networking for parallel applications but isn't suitable for client-server models due to trust and memory isolation issues.


<br>

## Design and Implementation
---
Key Design Goals:
1. **Minimize Kernel Involvement**: Most I/O operations occur directly between hardware and applications, avoiding kernel mediation while maintaining security and isolation.
2. **Transparency for Developers**: Performance improvements are possible without modifying applications that use the POSIX API, though more gains are achievable if developers adjust the application code.
3. **Appropriate Abstractions**: Arrakis introduces flexible OS and hardware abstractions that scale well on multicore systems and support various I/O patterns and application needs.

### Architecture Overview:
- Arrakis targets I/O hardware that supports virtualization, with physical devices exposing multiple virtual instances to applications.
- **Control Plane**: Manages device instances and enforces protection while allowing the creation of virtual NICs (VNICs) or virtual storage interface controllers (VSICs).
- **Data Plane**: Allows applications to handle I/O directly via a user-level I/O stack, eliminating unnecessary kernel interactions.

### Hardware Model:
- Arrakis leverages virtualized network and storage devices (VNICs, VSICs) to allow direct application control over I/O operations.
- **Transmit/Receive Filters**: These are used to enforce security and direct network packets to the right application without kernel intervention.

### VSIC Emulation:
- Prototype implementations were created for virtual storage controllers due to hardware limitations, enabling Arrakis to run on systems without direct hardware support.

### Control Plane Interface:
- Applications can interact with resources (VICs, filters, VSAs) through a control plane interface, allowing dynamic management and resource allocation.

### File Name Lookup:
- File naming is separated from its implementation, allowing applications to manage their storage while providing access through the kernel’s virtual file system.

### Network Data Plane Interface:
- Applications send and receive packets directly via the data plane, using queues managed in user space, with options for zero-copy I/O for high performance.

### Storage Data Plane Interface:
- The storage API supports asynchronous read, write, and flush operations. Additionally, a library of persistent data structures, *Caladan*, was developed to optimize low-latency storage operations.

### Implementation:
- Arrakis was built on the Barrelfish OS, with added support for SR-IOV, Intel IOMMU, and POSIX APIs. It includes a custom network stack (*Extaris*) and a storage API layer for user-level access.

### Limitations and Future Work:
- The current implementation has some hardware limitations, including limited filtering in NICs and lack of SR-IOV support for storage controllers. Future work involves addressing these limitations and improving performance further.


<br> 

## Evaluation
---
The section evaluates Arrakis' performance by comparing it to Linux and focuses on answering:
1. What causes performance overhead in Arrakis compared to Linux?
2. Can Arrakis improve latency and throughput for cloud applications and scale across multiple CPU cores?
3. Can Arrakis maintain user-level execution benefits while providing high-performance network I/O?
4. What performance improvements are possible by deviating from the POSIX interface?

### Server-side Packet Processing:
- **UDP Echo Benchmark**: Arrakis/P reduces server-side overhead by 57% compared to Linux, and Arrakis/N further reduces it by 89%.
- **Throughput**: Arrakis/P achieves 2.3×, and Arrakis/N 3.9× the throughput of Linux in packet processing.

### Memcached Key-Value Store:
- **Scalability**: Arrakis/P improves throughput by 1.7× over Linux on a single core and achieves near-line-rate performance on 4 cores. Linux shows bottlenecks after 2 cores.
- **Performance Gains**: Arrakis avoids cache misses and socket lock contention, allowing better control of packet queues and core assignment.

### Arrakis Native Interface Case Study:
- **Memcached Modification**: Modifying Memcached to use Arrakis/N improves throughput by 9% for receive-side optimizations and another 10% for send-side optimizations.

### Redis NoSQL Store:
- **Write Performance**: Arrakis reduces write latency by 63% and improves write throughput by 9× compared to Linux.
- **Simulated Faster Storage**: With state-of-the-art storage hardware, Redis write throughput improves by an additional 1.6×, nearing Linux read performance.

### HTTP Load Balancer:
- **Haproxy Benchmark**: Arrakis outperforms Linux by 2.2× (without SEPOLL) and 2× (with SEPOLL) in handling concurrent HTTP requests.
- **Connection Overhead**: Arrakis reduces overhead by using filters, lowering the number of system calls for connection setup/teardown.

### IP-layer Middlebox:
- **IP-based Load Balancer**: Arrakis shows 2.6× the throughput of Linux, as it benefits from hardware filtering to manage packet steering across cores, while Linux faces scalability issues with raw IP sockets.

### Performance Isolation:
- **Rate Limiting**: Arrakis demonstrates the ability to enforce QoS limits (e.g., rate-limiting one memcached instance), similar to Linux, without compromising overall network performance.

Arrakis consistently outperforms Linux in terms of throughput and latency for cloud applications, scales better across multiple cores, and offers additional performance gains when applications use its native interface. Arrakis retains security and isolation benefits while eliminating significant OS overhead, especially in networking and storage operations.


<br> 

## Discussion
---

This section explores how Arrakis' model can be extended for virtualized environments and interprocessor interrupts, further reducing OS mediation and improving performance.

### Arrakis as a Virtualized Guest:
- **Virtualized Environments**: Arrakis can be extended to work in virtualized environments, with minimal changes needed for it to function as a host, which is its original design intention.
- **Control Plane in VMM**: For guest environments, moving the control plane to the virtual machine monitor (VMM) is suggested. Guest applications can then allocate virtual interface cards (VICs) directly from the VMM.
- **Pre-allocated VICs**: A simple solution is pre-allocating a set number of VICs in the VMM for each guest, avoiding the need for a special interface between guest applications and the VMM.
- **Hardware Limits**: The same hardware limitations (such as the number of virtual adapters) apply in a virtualized environment, but the current limit (typically 64 virtual adapters) is well-aligned with available processing resources.

### Virtualized Interprocessor Interrupts:
- **Current Limitations**: Parallel applications typically assume shared memory is efficient, while interprocessor signaling is inefficient, requiring kernel mediation on both sides.
- **Kernel Bypass**: With Arrakis' kernel bypass model, a remote cache miss and a remote event delivery can be similar in cost at a physical level, reducing the need for kernel involvement in signaling between threads.
- **Interrupt Routing**: Modern hardware allows the OS to control device interrupt routing. Arrakis proposes adding access control to safely deliver interrupts within an application without kernel mediation, trapping to the kernel only when signaling between different applications.


<br> 

## Related Work
---
- **Previous Systems**:
  - **SPIN, Exokernel, Nemesis**: These systems reduced shared kernel components to allow customized OS management but still mediated I/O through the kernel. Arrakis extends this by showing that application customization can coexist with very high performance.
  - **U-Net, VIA, Infiniband**: These hardware standards aimed to eliminate OS involvement in network I/O, focusing primarily on parallel applications. Arrakis generalizes this to support broader client-server and peer-to-peer communication.

- **Inspiration for Arrakis**:
  - **Dune**: Provided user-level control over virtual memory using nested paging.
  - **Exitless IPIs**: Demonstrated demultiplexing hardware interrupts between virtual machines without virtual machine monitor mediation.

- **Networking Systems**:
  - **Netmap**: Achieves high throughput network I/O using DMA from user space but still requires system calls for permission checks.
  - **IX**: Implements per-application network stacks with system calls for batched I/O. Arrakis eliminates this by handling I/O at user level.
  - **mTCP**: Uses Intel’s DPDK for scalable user-level TCP, similar to Arrakis' approach.
  - **OpenOnload**: A hybrid user/kernel-level network stack with binary compatibility to Linux applications, but it still keeps significant socket state in the kernel.

- **Storage Systems**:
  - **DFS and PMFS**: File systems designed for low-latency persistent memory but still operate at the kernel level. Arrakis bypasses the kernel for direct, fast device access.
  - **Moneta-D**: Allows user-level I/O to SSDs but still requires OS communication for permission checks. Arrakis avoids this by giving applications complete control over virtual storage areas (VSAs).
  - **Aerie**: Proposes a system where processes communicate with a trusted user-space file system service. Arrakis offers more flexibility, integrating storage tightly with applications, enabling more advanced abstractions like persistent data structures.


<br> 

## Conclusion
---
- **Main Contribution**: Arrakis is an operating system designed to remove the kernel from the I/O data path, enabling direct application access to hardware for I/O operations without compromising process isolation or security.
- **Key Difference**: Traditional operating systems mediate all I/O to enforce isolation and resource limits. In contrast, Arrakis delegates most I/O tasks to a user-level library, while the kernel is limited to the control plane, configuring hardware to prevent application misbehavior.
- **Implementation**: Arrakis was implemented on commercially available network and storage hardware, demonstrating its practicality.
- **Performance Gains**: Arrakis shows significant performance improvements, achieving 2–5× faster read and write latency and 9× higher write throughput for server workloads (e.g., Redis) compared to a well-tuned Linux system.
- **Conclusion**: Arrakis demonstrates that high performance and strong protection are not mutually exclusive, making it a viable approach for modern I/O-intensive applications.
