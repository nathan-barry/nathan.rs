+++
title = "Processes & Dual Mode Execution"
date = 2023-09-14T18:49:27-05:00
tags = ["Operating Systems Notes"]
+++

{{< toc >}}



## Processes
***

A process is essentially a program in its execution phase. While a program is a static entity (akin to a blueprint), a process is dynamic and consists of the program combined with its current execution state.

Processes are the basic execution unit within an OS. Processes also need resources for execution: memory (for code & data) and CPU registers.

The process serves two main purposes:
1. **Protection**: It represents an application program executing with limited rights to prevent interference.
2. **Efficiency**: Despite the restrictions, it ensures hardware is used efficiently and allows for secure communication between processes.
  
A process's state encompasses:
- **Address Space**: Contains the program's code, static data, execution stack (with the call chain), and the heap (for dynamic data).
- **Registers & Their Contents**: This includes the heap pointer (HP), the program counter (PC) that points to the next instruction, and the stack pointer (SP).
- **OS Resources**: This could be open files, the process identifier (PID), and the process's current execution status (like ready, running, etc.).


### **Life Cycle of a Process**

At any given point, a process can be:
- **New**: The OS sets up the process state.
- **Ready**: Awaiting CPU execution.
- **Running**: Actively executing instructions on the CPU.
- **Blocked**: Paused and waiting for an event to complete.
- **Terminated**: The OS is ending the process.

A process can from ready $\rightarrow$ running $\rightarrow$ blocked $\rightarrow$ ready before finally terminating. A running process can also be set to ready if it uses up its time slice (not described here).

### **Process Management in the OS**

To keep track of processes, the OS employs a **Process Control Block (PCB)**. Here's a glimpse into its functionality:

- **Contents of PCB**: This includes the process identification number, program counter, stack pointer, general-purpose registers, memory management info, the process's owner, a list of open files, and any other data related to the process's execution not stored in its address space.
  
- **Purpose of PCB**: It's a dynamic data structure in the kernel, maintained in memory. It represents the execution state and position of each process when it isn't actively executing. PCBs are initialized when a process is formed and discarded once the process ends.




## Dual Mode Execution
***

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


### **Transitioning Between User and Kernel Mode**

Switching from user to kernel mode is often termed as "entering the kernel". This transition can occur due to:

1. **Exceptions**:
   - Issues arising from the user program, like division by zero or an attempt at a privileged instruction. These are synchronous (related to the recently executed instruction).

2. **Interrupts**:
   - External events disrupting the currently running process, like a timer or a hardware device seeking the OS's attention. They are asynchronous (unrelated to the currently executing instruction).
  
3. **System Calls/Traps**:
   - When a user program requests a service from the OS. This appears similar to a function call and is synchronous.

For the User to Kernel Mode Transition, the OS saves the current state of the user program. Hardware identifies the reason for the boundary crossing and selects the relevant entry from the interrupt vector. An appropriate handler is then invoked.
  

#### **Saving the State of the Interrupted Process**

A special hardware register points to the exception stack. Upon switching, some registers of the interrupted process are pushed onto the exception stack before the handler executes. The handler then pushes the remaining. On returning, the reverse occurs.

There are two cases for switching back. For interrupts, the steps are simply reversed. For exceptions and system calls, the Program Counter (PC) is incremented upon return.

### **Dual Mode Execution For Protection**

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



## Accessing System Resources
***

### System Calls

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




## Spawning Processes
***

A process can spawn other processes. The original is known as the parent, while the new ones are called child processes. In many systems, the parent can allocate resources and permissions to its children. Processes can either run concurrently or one can wait for the other to finish.

  
Unix uses the `fork()` function to create processes. This function duplicates the current process, creating a parent and a child. Both processes start executing right after the `fork()`, but each has its own memory space and variables. An interesting aspect of `fork()` is its return value. It's the child's process ID in the parent, and `0` in the child.

The `exec()` function overlays a new program onto a process. Notably, the Process ID (PID) remains unchanged. This function is necessary for child processes in Unix that wish to run a different program. When `exec()` succeeds, even though it’s the same process, a new program runs.

### A Practical Example: `fork()` and `exec()`

Let's consider a simple example to understand the interplay between `fork()` and `exec()`:

1. A program starts and decides to create a new process, so it invokes `fork()`.
  
2. The child process, wanting to run a different program, calls `exec()` to overlay itself with the new program.

3. The parent process may continue to execute or wait for the child to finish, depending on the logic.

This combination allows for a high degree of flexibility and concurrency in program execution, playing a pivotal role in how Unix and many other operating systems function.


## Process Control
***

When diving into operating systems, one of the core concepts to understand is how processes are managed and controlled. Let's take a closer look at this intricate dance between processes.

### Process Creation with `fork()` and `exec()`

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

## Handling Process Termination
***

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

### Waiting on Child Processes with `wait()`

The `wait()` system call allows a parent process to pause until one of its child processes terminates. It serves multiple purposes:

- Enables the parent to get the child's return value.
- Blocks the parent until the child completes.
- Upon a child's `exit()`, the OS allows the parent to resume, returning the exit value.

### Zombie and Orphan Processes

- **Zombie Processes**: A process that has completed execution but still has an entry in the process table is a zombie process. The OS retains some information about the zombie process so the parent can retrieve the child's exit status.
  
- **Orphan Processes**: When a parent process terminates before its child processes complete, the children become orphan processes. In UNIX systems, the `init` process automatically adopts orphaned processes.

### Other Process Control Mechanisms

- **Priority Manipulation**: UNIX systems have the `nice()` call, which specifies the base process priority. Over time, as a process consumes CPU, its priority may change.
  
- **Debugging Support**: The `ptrace()` system call lets a process be controlled by another, enabling debugging mechanisms like setting breakpoints and examining registers.

- **Time Management**: Functions like `sleep()` allow processes to be put on a timer queue, essentially setting up alarms.
