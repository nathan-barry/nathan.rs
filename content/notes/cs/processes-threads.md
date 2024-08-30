+++
title = "Processes, Threads, & Scheduling"
description = "Notes from OS. Covers processes, threads, scheduling, dual mode execution, and boot sequences."
date = 2023-09-14T18:49:27-05:00
tags = ["Computer Science Notes"]
+++

{{< toc >}}



## Processes
---

A process is essentially a program in its execution phase. While a program is a static entity (akin to a blueprint), a process is dynamic and consists of the program combined with its current execution state.

Processes are the basic execution unit within an OS. Processes also need resources for execution: memory (for code & data) and CPU registers.

The process serves two main purposes:
1. **Protection**: It represents an application program executing with limited rights to prevent interference.
2. **Efficiency**: Despite the restrictions, it ensures hardware is used efficiently and allows for secure communication between processes.
  
A process's state encompasses:
- **Address Space**: Contains the program's code, static data, execution stack (with the call chain), and the heap (for dynamic data).
- **Registers & Their Contents**: This includes the heap pointer (HP), the program counter (PC) that points to the next instruction, and the stack pointer (SP).
- **OS Resources**: This could be open files, the process identifier (PID), and the process's current execution status (like ready, running, etc.).


### Life Cycle of a Process

At any given point, a process can be:
- **New**: The OS sets up the process state.
- **Ready**: Awaiting CPU execution.
- **Running**: Actively executing instructions on the CPU.
- **Blocked**: Paused and waiting for an event to complete.
- **Terminated**: The OS is ending the process.

A process can from ready $\rightarrow$ running $\rightarrow$ blocked $\rightarrow$ ready before finally terminating. A running process can also be set to ready if it uses up its time slice (not described here).

### Process Management in the OS

To keep track of processes, the OS employs a **Process Control Block (PCB)**. Here's a glimpse into its functionality:

- **Contents of PCB**: This includes the process identification number, program counter, stack pointer, general-purpose registers, memory management info, the process's owner, a list of open files, and any other data related to the process's execution not stored in its address space.
  
- **Purpose of PCB**: It's a dynamic data structure in the kernel, maintained in memory. It represents the execution state and position of each process when it isn't actively executing. PCBs are initialized when a process is formed and discarded once the process ends.




## Dual Mode Execution
---

A vital question arises: how does the OS maintain the boundaries for processes?

**Dual Mode Execution**:
- **User Mode**: Restricted access.
- **Kernel Mode**: Unrestricted access.
- The mode is determined by a specific bit in the process status register.
  
**Restrictions in User Mode**:
- Direct addressing of I/O is prohibited.
- Manipulation of OS memory using certain instructions is disallowed.
- Mode bits that determine user/kernel modes can't be altered.
- Disabling/enabling of interrupts is not allowed.
- Halting the machine directly is restricted.
   
However, in kernel mode, the OS has the freedom to perform all these operations. Attempting a privileged operation in user mode results in a processor exception, handing control over to the kernel.


### Transitioning Between User and Kernel Mode

Switching from user to kernel mode is often termed as "entering the kernel". This transition can occur due to:

1. **Exceptions**:
   - Issues arising from the user program, like division by zero or an attempt at a privileged instruction. These are synchronous (related to the recently executed instruction).

2. **Interrupts**:
   - External events disrupting the currently running process, like a timer or a hardware device seeking the OS's attention. They are asynchronous (unrelated to the currently executing instruction).
  
3. **System Calls/Traps**:
   - When a user program requests a service from the OS. This appears similar to a function call and is synchronous.

For the User to Kernel Mode Transition, the OS saves the current state of the user program. Hardware identifies the reason for the boundary crossing and selects the relevant entry from the interrupt vector. An appropriate handler is then invoked.
  

#### Saving the State of the Interrupted Process

A special hardware register points to the exception stack. Upon switching, some registers of the interrupted process are pushed onto the exception stack before the handler executes. The handler then pushes the remaining. On returning, the reverse occurs.

There are two cases for switching back. For interrupts, the steps are simply reversed. For exceptions and system calls, the Program Counter (PC) is incremented upon return.

### Dual Mode Execution For Protection

For an efficient protective mechanism, the hardware should inherently support:

1. **Privileged Instructions**:
   - Accessible only in kernel mode.
   - Ensures user mode can't execute potentially harmful instructions.
  
2. **Timer Interrupts**:
   - Allows the kernel to periodically retrieve control.
   - Prevents a single process from monopolizing the CPU.
  
3. **Memory Protection**:
   - Accesses outside a process's memory boundary are forbidden in user mode.
   - Ensures data security.

Dual Mode Execution is a core concept in OS protection. It allows the OS to maintain a balance between granting access and ensuring system-wide security and stability.



## Handling Processes
---

### Accessing System Resources: System Calls

When applications need to communicate with the operating system, they make use of system calls. System calls provide the interface between an application and the operating system (often known as the API). They are typically accessed via system-level libraries. A system call is a request by a user-level process to call a function in the kernel. Some examples include `read()`, `write()`, and `exit()`.

Below we show how they work:
  1. A user process triggers a trap instruction.
  2. The hardware notifies the OS, leading it to the system-call handler.
  3. The OS identifies the requested service and parameters, like `open(filename, O_RDONLY)`.
  4. After executing the service, the OS updates a register with the result and returns control to the user program using an RTI instruction.
  5. The user program processes the result and proceeds with its tasks.



#### The Unix Shell

<!-- The Unix Shell is the gateway between the user and the operating system. -->

Upon logging into a Unix system, the OS initializes a shell process for user interaction. Most commands entered into the shell result in the creation of a new process to execute the command. For instance, inputting `calc` results in the OS forking a new process and executing `calc`. Some commands are "built-in", meaning they're directly implemented within the shell codebase.

Some interesting features are that when appending `&` to a command, Unix runs the process alongside your shell. Without it, the shell awaits the completion of the current process before moving onto the next. Input-output redirections, pipes, and numerous other functionalities are part of the Unix shell, which we will delve into later.




### Spawning Processes

A process can spawn other processes. The original is known as the parent, while the new ones are called child processes. In many systems, the parent can allocate resources and permissions to its children. Processes can either run concurrently or one can wait for the other to finish.

  
Unix uses the `fork()` function to create processes. This function duplicates the current process, creating a parent and a child. Both processes start executing right after the `fork()`, but each has its own memory space and variables. An interesting aspect of `fork()` is its return value. It's the child's process ID in the parent, and `0` in the child.

The `exec()` function overlays a new program onto a process. Notably, the Process ID (PID) remains unchanged. This function is necessary for child processes in Unix that wish to run a different program. When `exec()` succeeds, even though it’s the same process, a new program runs.

#### A Practical Example: `fork()` and `exec()`

Let's consider a simple example to understand the interplay between `fork()` and `exec()`:

1. A program starts and decides to create a new process, so it invokes `fork()`.
  
2. The child process, wanting to run a different program, calls `exec()` to overlay itself with the new program.

3. The parent process may continue to execute or wait for the child to finish, depending on the logic.

This combination allows for a high degree of flexibility and concurrency in program execution, playing a pivotal role in how Unix and many other operating systems function.


### Process Control

When diving into operating systems, one of the core concepts to understand is how processes are managed and controlled. Let's take a closer look at this intricate dance between processes.

#### Process Creation with `fork()` and `exec()`

**`fork()`**: The fork system call is used to create a new process. When a process calls `fork()`, an identical process is created. Here's a general idea of how it works:
  
```c
pid_t fork_val = fork();

if (fork_val == FORKERR) {
    printf("Fork failed!\n");
    return EXIT_FAILURE;
} else if (fork_val == 0) {
    // This block is executed by the child process.
    printf("I am the child!\n");
    return EXIT_SUCCESS;
} else {
    // This block is executed by the parent process.
    printf("I’m the parent.");
    int status;
    pid_t fin_pid = wait(&status);
}
```

A key insight here is that `fork()` returns twice: once for the parent and once for the child. The two processes will then have separate memory spaces.

**`exec()`**: While `fork()` creates a duplicate of the current process, `exec()` replaces the current process image with a new process image. Here's a simplified representation:

```c
if (fork() == 0) {
    exec("calc", argc, argv0, argv1, ...);
    printf("Why would I execute?"); // This should not execute
    return EXIT_FAILURE;
}
```

It's important to understand that after a successful call to `exec()`, the subsequent lines in the calling process will not be executed, as the process's memory gets replaced.

### Handling Process Termination

Processes can either terminate normally or be killed:

- **`exit()`**: A process ends its life by calling the exit system call. This:
    - Takes the process's return value as an argument.
    - Closes open resources like files and connections.
    - Deallocates memory and most OS structures.
    - Checks for the parent's state:
        - If the parent is alive, the process enters a "zombie" state, holding onto its exit status.
        - If the parent isn't alive, the process is fully terminated.

    It's essential to note that process termination is crucial for resource reclamation.

- **`kill()`**: This system call can terminate another process. Notably, it's also used for interprocess communication by sending signals to specified processes. If a receiving process doesn't have a handler for a particular signal, a default action is taken. 

#### Waiting on Child Processes with `wait()`

The `wait()` system call allows a parent process to pause until one of its child processes terminates. It serves multiple purposes:

- Enables the parent to get the child's return value.
- Blocks the parent until the child completes.
- Upon a child's `exit()`, the OS allows the parent to resume, returning the exit value.

#### Zombie and Orphan Processes

- **Zombie Processes**: A process that has completed execution but still has an entry in the process table is a zombie process. The OS retains some information about the zombie process so the parent can retrieve the child's exit status.
  
- **Orphan Processes**: When a parent process terminates before its child processes complete, the children become orphan processes. In UNIX systems, the `init` process automatically adopts orphaned processes.

#### Other Process Control Mechanisms

- **Priority Manipulation**: UNIX systems have the `nice()` call, which specifies the base process priority. Over time, as a process consumes CPU, its priority may change.
  
- **Debugging Support**: The `ptrace()` system call lets a process be controlled by another, enabling debugging mechanisms like setting breakpoints and examining registers.

- **Time Management**: Functions like `sleep()` allow processes to be put on a timer queue, essentially setting up alarms.















## CPU Scheduling
---

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

There are two kinds of scheduling:

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
---

We have some foundational assumptions below. They aren't necessarily true, but are assumptions that computer scientists have used since the origin of scheduling theory and are generally a good enough heuristic.
- Each user has a single process.
- Each process contains only one thread.
- Processes operate independently.

These algorithms were mainly crafted during the 1970s when the assumptions closely mirrored real-world scenarios. The challenge of efficiently adapting these assumptions to today's complex computing environments remains unresolved.

### First-Come-First-Served (FCFS)
This is the most simple and obvious scheduling policy you can think of.

- Often referred to as **First-In-First-Out (FIFO)**.
- The scheduler executes jobs based on their arrival sequence.
- Jobs run continuously until they either conclude or block due to I/O operations. {{%sidenote%}}In the earlier iterations of FCFS schedulers, a job would retain control of the CPU, even during its I/O operations.{{%/sidenote%}}


### Round Robin
Round robin incorporates a timer for pre-emptive scheduling.
- Every process gets a dedicated time slice (scheduling quantum).
- Post completion of a time slice, the running process is shifted to the end of the queue.

Choosing an optimal time slice is pivotal:
  - **Too large**: Can resemble FCFS if processes rarely face preemption. Increases waiting time.
  - **Too short**: Diminishes throughput due to frequent context switches.
  - **Ideal Balance**: The context switch duration should be approximately 1% of the entire time slice.
  
Contemporary time-sharing systems typically employ a variation of this policy. Today's standard time slice ranges between 10-100 milliseconds, while a context switch consumes about 0.1 to 1 millisecond.

### Context Switching
A process transition is termed as a context switch, and it encompasses several steps:
- The running process encounters a block or an interruption.
- A mode switch to the kernel is initiated.
- The scheduler is summoned.
- The state of the current process is stored in its PCB.
- The scheduler then selects a new process.
- The new process's state, as per its PCB, is loaded.

Context switching is the primary overhead for any scheduling strategy.

### Shortest Job First (SJF)
- This policy prioritizes the job that has the minimal CPU time remaining until its next I/O request or eventual termination.
- I/O bound tasks are given precedence over CPU bound tasks.
- Works for both preemptive and non-preemptive schedulers.

### Multilevel Feedback Queues
- Consists of multiple queues, each with distinct priorities.
- Each priority level adopts the Round Robin scheduling approach, with the highest priority queue being serviced first.
- Care must be taken as continuous execution of high-priority tasks can result in starvation for lower-priority tasks.
- Time slices for round-robin increment exponentially for lower priority levels.

#### How Multilevel Feedback Queues Approximate SJF
Usually, if a process is I/O bound in the past, it's likely to continue to be I/O bound in the future. Thus, by prioritizing jobs that historically consumed minimal CPU time, the scheduler can approximate the SJF policy. This approach is adaptive, reacting dynamically to changes in a job's behavior.

1. Jobs commence in the highest priority queue.
2. If a job's time slice expires, its priority drops one level, but never below the lowest priority.
3. Conversely, if a job's time slice remains unexpired (due to an I/O request-triggered context switch), its priority rises, but never beyond the highest level.
   
**Outcome**: CPU-bound tasks rapidly plummet in priority, while I/O-bound tasks maintain a high priority.

#### Enhancing Fairness
Although SJF is optimal, it might not always be fair. Fairness is important because it prevents **starvation**, when a process never gets to run. A low priority task might never get to run because there might always be higher priority tasks above it. Some possible fixes include:

- Allocating each queue a fixed fraction of CPU time. This only works if job distribution across queues is even.
- Dynamically adjusting job priorities based on service frequency, ensuring no job suffers from perpetual neglect. This method, although preventing starvation, might compromise average waiting time when the system is inundated.

Improving fairness might inadvertently increase average waiting time but the trade off is worth it in the majority of cases.



## Boot Sequences
---

When we turn on our computers, a series of steps take place to load the operating system. This process is known as the boot sequence.

### Initialization of the Boot Program
The CPU initiates the booting process by loading the boot program from the ROM. In most modern PCs, this is the UEFI or the BIOS.

The boot program performs several functions:

  - **Hardware Examination**: It assesses the machine configuration. This includes determining the number of CPUs, the total available memory, the quantity and type of hardware devices, among other parameters.
  
  - **Configuration Structuring**: Post examination, it assembles a configuration structure detailing the hardware specifics.
  
  - **OS Kernel Loading**: Once the configuration structure is prepared, the boot program loads the operating system kernel and hands over the configuration details.

### Operating System Initialization
With the OS kernel loaded, the system initializes:

  - **Kernel Data Structures**: Essential kernel-related data structures are initialized to ensure efficient functioning.
  
  - **Hardware Device States**: The system ensures that all hardware devices are set to their initial state.
  
  - **Process Creation**: The system spawns several processes to jumpstart operations. For instance, UNIX systems utilize 'getty', while Windows uses its Windowing system.
  
  - **User Programs and Idle Loop**: After booting the essential processes, the OS either runs user programs (if available) or defaults to the idle loop. During this idle state:
    - The OS takes on system management tasks and performs profiling.
    - The processor goes into a low-power mode, especially in devices like notebooks, to conserve energy.
    - The system remains in this halted state until interrupted by hardware devices.










## Threads
---

In computer science, a thread represents an entity that executes a series of instructions. Threads play an important role in enhancing the efficiency of an operating system.

By allowing for concurrent execution and simplifying communication, they provide a streamlined and efficient method for performing multiple tasks simultaneously.

### Threads vs Processes

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

### Why Use Threads?

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



### User vs Kernel-Level Threads

####  User-Level

User-level threads are threads that the Operating System (OS) is unaware of. Thus, the OS only manages the process as a whole, not the individual threads within. A thread library, used by the programmer, is responsible for thread operations (creation, deletion, synchronization, and scheduling).

Some benefits are:
  - Allows user-level code to define the scheduling policy.
  - Threads can yield to others or voluntarily give up the processor.
  - Switching between user-level threads does not require a context switch, which makes it faster.
  
Context Switching for User-Level Threads:
  - Entirely takes place in user space.
  - An active thread might be interrupted either by an external interrupt, a signal, or a voluntary yield.
  - The kernel library saves the thread's state (to TCB), selects a new thread, loads its state, and then the new thread begins its execution.

#### Kernel-Level

Kernel-level threads are threads that the Operating System (OS) is aware of and manages.

  - Each process has at least one kernel-level thread.
  - Threads are managed and scheduled by the kernel.
  - System calls are employed for thread-related operations like creation, destruction, and synchronization.
  
Context Switching for Kernel-Level Threads:
  - Requires a minor context switch since it involves changing values of registers, program counters, and stack counters.
  - Memory management info remains constant, as threads within the same process share an address space.

Some advantages of Kernel-Level Threads are:
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
