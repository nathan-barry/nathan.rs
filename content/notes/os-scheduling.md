+++
title = "Scheduling Policies & Boot Sequence"
description = ""
date = 2023-09-15T08:09:21-05:00
tags = ["Operating Systems Notes"]
status = "Work In Progress"
priority = 2
+++

{{< toc >}}



## CPU Scheduling
***

A process serves as a foundational unit of execution within an operating system. Every process has several defining features:

- It possesses a unique address space.
- It acts as an abstraction layer, providing protection.
- Within the operating system, processes are symbolized through Process Control Blocks (PCBs).
- At any given moment, a process can exist in one of these states: New, Ready, Running, Blocked, or Terminated.
  
These processes are created and are managed through a series of system calls. In a computing environment, it's common to encounter multiprogramming, which is essential for timesharing and ensuring fluid interactivity.

Multiprogramming, also known as concurrency, is when a program has a single process actively running on the CPU while one or more processes handle I/O. This improves both system utilization and throughput by allowing overlapping of I/O and CPU tasks.

<!-- ### Process Life Cycle -->

<!-- A process will always be in one of these states: -->
<!-- - **Running**: Actively executing instructions on the CPU. -->
<!-- - **Ready**: Set and prepared to run but is waiting for CPU access. -->
<!-- - **Blocked**: Paused and waiting for an event to happen. -->

<!-- Illustratively, the process lifecycle can be visualized as: -->

<!-- ``` -->
<!--    New → Ready → Running → Blocked → Terminated -->
<!-- ``` -->

<!-- It's essential to recognize that at any given moment, all the processes that the OS manages will be present in one of these state queues. -->

### Scheduling Basics

- **Long-Term Scheduling**:
  - How does the OS decide on the level of multiprogramming, particularly the quantity of jobs that can concurrently reside in primary memory?
  
- **Short-Term Scheduling**:
  - How does (or should) the OS choose a process from the ready queue for execution?

<!-- ## Dive into Short-Term Scheduling -->

The scheduler is responsible for deciding the next process to be executed on the CPU. This is not just a mechanism, but it also embodies a specific policy. A scheduler springs into action when:

- A process shifts from a running state to a blocked state.
- A process is either initiated or terminated.
- An interrupt occurs, either from an I/O device completion or a periodic timer.

Scheduling strategies can be broadly classified based on their interaction with the timer interrupt:

- **Non-preemptive**:
  - Currently executing processes are never preempted.
  - The scheduler becomes active only when a process either blocks or terminates, but not during hardware interrupts.
  
- **Preemptive**:
  - The currently executing process may face preemption.
  - The scheduler springs to action primarily during timer interrupts but can also be activated during system calls and other hardware device interrupts.
  - Modern OSes predominantly employ this scheduling type.


## Scheduling Policies
***

We have some foundational assumptions below. They aren't necessarily true, but are assumptions that computer scientists have used since the origin of scheduling theory and are generally a good enough heuristic.
- Each user has a single process.
- Each process contains only one thread.
- Processes operate independently.

These algorithms were mainly crafted during the 1970s when the assumptions closely mirrored real-world scenarios. The challenge of efficiently adapting these assumptions to today's complex computing environments remains unresolved.

### **First-Come-First-Served (FCFS)**
This is the most simple and obvious scheduling policy you can think of.

- Often referred to as **First-In-First-Out (FIFO)**.
- The scheduler executes jobs based on their arrival sequence.
- Jobs run continuously until they either conclude or block due to I/O operations. {{%sidenote%}}In the earlier iterations of FCFS schedulers, a job would retain control of the CPU, even during its I/O operations.{{%/sidenote%}}


### **Round Robin**
Round robin incorporates a timer for pre-emptive scheduling.
- Every process gets a dedicated time slice (scheduling quantum).
- Post completion of a time slice, the running process is shifted to the end of the queue.

Choosing an optimal time slice is pivotal:
  - **Too large**: Can resemble FCFS if processes rarely face preemption. Increases waiting time.
  - **Too short**: Diminishes throughput due to frequent context switches.
  - **Ideal Balance**: The context switch duration should be approximately 1% of the entire time slice.
  
Contemporary time-sharing systems typically employ a variation of this policy. Today's standard time slice ranges between 10-100 milliseconds, while a context switch consumes about 0.1 to 1 millisecond.

### **Context Switching**
A process transition is termed as a context switch, and it encompasses several steps:
- The running process encounters a block or an interruption.
- A mode switch to the kernel is initiated.
- The scheduler is summoned.
- The state of the current process is stored in its PCB.
- The scheduler then selects a new process.
- The new process's state, as per its PCB, is loaded.

Context switching is the primary overhead for any scheduling strategy.

### **Shortest Job First (SJF)**
- This policy prioritizes the job that has the minimal CPU time remaining until its next I/O request or eventual termination.
- I/O bound tasks are given precedence over CPU bound tasks.
- Works for both preemptive and non-preemptive schedulers.

### **Multilevel Feedback Queues**
- Consists of multiple queues, each with distinct priorities.
- Each priority level adopts the Round Robin scheduling approach, with the highest priority queue being serviced first.
- Care must be taken as continuous execution of high-priority tasks can result in starvation for lower-priority tasks.
- Time slices for round-robin increment exponentially for lower priority levels.

### **How Multilevel Feedback Queues Approximate SJF**
Usually, if a process is I/O bound in the past, it's likely to continue to be I/O bound in the future. Thus, by prioritizing jobs that historically consumed minimal CPU time, the scheduler can approximate the SJF policy. This approach is adaptive, reacting dynamically to changes in a job's behavior.

1. Jobs commence in the highest priority queue.
2. If a job's time slice expires, its priority drops one level, but never below the lowest priority.
3. Conversely, if a job's time slice remains unexpired (due to an I/O request-triggered context switch), its priority rises, but never beyond the highest level.
   
**Outcome**: CPU-bound tasks rapidly plummet in priority, while I/O-bound tasks maintain a high priority.

### **Enhancing Fairness**
Although SJF is optimal, it might not always be fair. Fairness is important because it prevents **starvation**, when a process never gets to run. A low priority task might never get to run because there might always be higher priority tasks above it. Some possible fixes include:

- Allocating each queue a fixed fraction of CPU time. This only works if job distribution across queues is even.
- Dynamically adjusting job priorities based on service frequency, ensuring no job suffers from perpetual neglect. This method, although preventing starvation, might compromise average waiting time when the system is inundated.

Improving fairness might inadvertently increase average waiting time but the trade off is worth it in the majority of cases.



## **Boot Sequences**
***

When we turn on our computers, a series of steps take place to load the operating system. This process is known as the boot sequence.

### Initialization of the Boot Program
The CPU initiates the booting process by loading the boot program from the ROM. In most modern PCs, this is the UEFI or the BIOS.

The boot program performs several functions:

  - **Hardware Examination**: It assesses the machine configuration. This includes determining the number of CPUs, the total available memory, the quantity and type of hardware devices, among other parameters.
  
  - **Configuration Structuring**: Post examination, it assembles a configuration structure detailing the hardware specifics.
  
  - **OS Kernel Loading**: Once the configuration structure is prepared, the boot program loads the operating system kernel and hands over the configuration details.

### **Operating System Initialization**
With the OS kernel loaded, the system initializes:

  - **Kernel Data Structures**: Essential kernel-related data structures are initialized to ensure efficient functioning.
  
  - **Hardware Device States**: The system ensures that all hardware devices are set to their initial state.
  
  - **Process Creation**: The system spawns several processes to jumpstart operations. For instance, UNIX systems utilize 'getty', while Windows uses its Windowing system.
  
  - **User Programs and Idle Loop**: After booting the essential processes, the OS either runs user programs (if available) or defaults to the idle loop. During this idle state:
    - The OS takes on system management tasks and performs profiling.
    - The processor goes into a low-power mode, especially in devices like notebooks, to conserve energy.
    - The system remains in this halted state until interrupted by hardware devices.
