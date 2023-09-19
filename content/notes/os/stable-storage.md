+++
title = "External Device Communication & Stable Storage"
description = "These are my notes over Professor Norman's Operating Systems course. Notes closely follow the in class lecture slides."
date = 2023-09-16T13:09:24-05:00
tags = ["Operating Systems Notes"]
priority = 13
+++

{{< toc >}}



## External Device Communication
***

While CPU and main memory are pivotal, they alone can't make a computer functional. A computer's real power lies in its ability to communicate with the external world.

- **Device Interaction**: Our computers are always buzzing with activity. Be it displaying data on the screen, accepting inputs via the keyboard or mouse, or interacting with the cloud over a network. In fact, even age-old systems like the IBM 7094 had mechanisms to read from and write to external tapes.

- **Exploring External Devices**: Think of everything that's not RAM in your computer. That's right, from your keyboard, mouse, hard drive, to the monitor, network card, microphone, printer, and beyond. These are all external devices, playing a pivotal role in your computer's functioning.

Given the myriad of external devices, how does the OS manage them?

- **Data Handling**: Managing external devices revolves around two main tasks. Firstly, the transfer of data to and from the device. Secondly, handling scenarios when devices aren't ready to accept or send data.

- **Special Mention: Disks**: Disks hold a special place in this ecosystem. Their speeds (or often, the lack of it) make disk management a priority for OS. OS employs disk head scheduling to optimize disk access speeds. With the advent of SSDs, many challenges associated with traditional disks are effectively bypassed.

### Architecture of External Devices

The world inside a CPU is vast. Most of the functionalities we've discussed, like scheduling and memory management, reside on the CPU. However, external devices communicate with the CPU via system buses. Imagine a system bus as a conference call where everyone can hear you.

When we delve deeper into the architecture of an external device, we find:

- A **bus** facilitating communication with the CPU.
- A **device port** with registers:
  - **Status Register**: Read by the CPU to determine the device's state.
  - **Control Register**: Written to by the CPU for I/O requests.
  - **Data Register**: Holds the I/O contents.
  
- A **controller** that interprets the commands and mediates between the bus and the device.
- And, of course, the **device** itself.

This intricate interplay ensures smooth communication between the CPU and external devices, bringing the computer to life.

### The Process of Communication

For the Operating System (OS) to interact with an external device, a series of steps must be undertaken:

1. **Request Initiation**: The OS signals its need to communicate with a device through the system bus.
2. **Data Transfer Preparation**: Information required for the operation is placed in the device's registers, for the controller to interpret and take necessary actions.
3. **Waiting Phase**: Here, the OS waits for the device or its controller to complete the required operation.
4. **Data Reception**: Once the operation completes, the controller puts the result at a location where the OS can access it.

However, communication with external devices isn't always instantaneous. For instance, while a tape drive may need several seconds, asynchronous devices, like keyboards, might necessitate longer durations. It poses a challenge when the waiting time is uncertain, as with the humorous scenario of a user vacationing in Hawaii while the system awaits a keyboard input. This necessitates mechanisms to handle such prolonged waits efficiently.



## Handling Prolonged Waits
***

### Polling

One prevalent technique is **polling**, where the OS keeps checking the status register of the I/O device until it becomes idle.

#### **Advantages of Polling**:

- **Simplicity**: Polling provides a straightforward approach to handle device communication. Such simplicity can accelerate the development process, reduce the likelihood of bugs, and provide elegance in design.
- **Trade-offs**: While polling is efficient in many scenarios, it can sometimes fall short in performance, especially if the checks are very frequent. This leads us to explore other methods that can handle device communication without constant status checks.

#### Busy Waiting vs. Polling

Contrary to some misconceptions, polling doesn't always equate to busy waiting. In busy waiting, the system is in a constant loop, waiting for a certain condition. On the other hand, polling can be efficient, where checks are spaced out, allowing for other operations in the interim.

**Busy Waiting Example**:
```c
int read(){
    Device* device = determine_device();
    device->issue_read();
    while(!device->status_is_ready()){
        // just wait
    }
    return <result of device read>;
}
```

**Polling without Busy Waiting**:
```c
void timer_interrupt(){
    // Check the device once! If not ready, wait until the next interrupt to check again
    for(device in busy_device_list){
        if(device.status_is_ready()){
            device->waiting_thread->read_sema.up();
        }
    }
}

int read(){
    Device* device = determine_device();
    device->issue_read();
    if(!device->status_is_ready()){
        thread_current()->read_sema.down();
    }
    return <result of device read>;
}
```


### Interrupt-Driven I/O

Instead of the CPU incessantly checking the device's status, in interrupt-driven I/O, the device signals the CPU when the I/O operation is done. This involves:

- **Setting Up the System for Interrupts**: Both the external device and the system need to support interrupt mechanisms.
  
- **Handling Interrupts**: Once the I/O operation is complete, the device triggers an interrupt on the CPU, akin to a timer interrupt. The CPU then handles it using established protocols, like pushing registers, jumping to the interrupt vector, and indexing by interrupt number.

The obvious advantage here is the elimination of the need for constant checks. But what about reading larger chunks of data? The process would look something like this:
1. Initiate the I/O operation.
2. Wait for an interrupt.
3. Read a small chunk of data (e.g., 4 bytes).
4. Repeat until the entire data is read.

However, for large data sizes, this could result in a barrage of interrupts, causing efficiency concerns.

### Direct Memory Access (DMA)

DMA is a protocol that lets devices write directly into the main memory. This method requires hardware support. Key characteristics include:

- **Address Register and DMA Controller**: Instead of regular data-in/data-out registers, DMA uses an address register and a dedicated DMA controller. The CPU merely communicates the destination address of the transfer to the device.

- **Direct Memory Transfer**: The DMA controller facilitates direct reading/writing from/to the main memory via the system bus. The CPU gets notified only once the entire transfer is complete, not after every small chunk.

- **Performance Concerns**: DMA can lead to contention for the system bus or memory, especially when used extensively. Despite these potential issues, DMA generally offers better performance than frequently interrupting the CPU.

However, introducing DMA does complicate the hardware setup, even if it simplifies the programming side of things. The hardware now requires additional registers and memory on the device and mechanisms to authorize the device's direct writes into the main memory.

To better understand the process, consider reading 4KB of data using DMA:
1. Command a DMA read of 4KB to a specified memory address.
2. Wait.
3. Upon receiving the interrupt, check the status register for errors. If all is well, the data resides at the address given in step 1.

Despite the abstraction, this process transfers much of the complexity to the hardware. While this introduces challenges for hardware designers, it simplifies the task for programmers, making the system faster and more efficient.

### Method Selection

Which method is superior when reading a large file? **DMA**, if the hardware costs can be justified. But for devices like microphones that produce regular data, either **polling or interrupts** could be optimal.

It's crucial to realize there's no one-size-fits-all. Every method comes with its advantages, and its superiority depends on the specific use-case and goal.


## Disk Drive Overview
***


### Anatomy of a Hard Disk Drive (HDD)

- **Sectors**: These are organized in concentric circular tracks. Without repositioning the drive head, data on the same track can be accessed continuously.
  
- **Drive Head**: This component reads data by detecting magnetic fields and writes data by producing magnetic fields. Due to the disk's rotation, it floats on a cushion of air.
  
- **Platter**: Essentially, this is a thin metal disk imbued with magnetic material. It's the magnetic material on its surface that holds the data. Notably, each platter is double-sided, with data storage capabilities on both the top and bottom.
  
- **Cylinder**: Comprising various surfaces with the same track index.
  
- **Comb**: This holds a collection of drive heads.
  
- **Rotation**: HDDs rotate around a spindle, usually ranging between 5,000 and 15,000 revolutions per minute (rpm).

###### Memory vs. Disks:
- **Memory (RAM)**:
  - Small, Fast, Expensive
  - Volatile: Data disappears once power is off.
- **Stable Storage (Disk)**:
  - Large, Slow, Economical
  - Non-volatile: Data persists through power cycles.

In the context of data storage, both memory and disks play pivotal roles, with disks serving as the primary storage for long-term data retention.


###### Why Are Hard Drives Slower?

Unlike RAM, where data transfers are governed by the ultra-fast movement of electrons, hard drives rely on rapidly spinning chunks of metal. Precisely flinging metal anywhere near the speed of light is a significant challenge.

###### Why Outer Disk Parts are Faster

The outer sections of a disk are notably faster than the inner sections. More disk travels past the read head per unit time when it's closer to the edge of the platter.


### How Disk Operations Work

When the CPU wants to read or write to the disk:

- For older disks, **CHS addresses** are used. They specify a cylinder, drive head, and sector.
  
- Almost all disks post-1990s use **LBA (Logical Block Addressing)**. Here, every sector gets a unique number ranging between 0 and MAX_SECTOR.
  
- The disk controller then maneuvers the heads to the correct track and waits for the sector to pass under the drive head before reading or writing.




## Disk Drive Performance
***

### Disk Drive's Major Time Costs

- **Seek Time**: Time taken to move the head to the correct track. It varies:
  - **Maximum**: Time required from the innermost to the outermost track.
  - **Average**: Roughly 1/3 of the maximum. For the math enthusiasts, delve into OSTEP for an explanation (warning: involves integrals).
  - **Minimum**: Moving from one track to the adjacent one.
  
- **Settle Time**: The duration the head needs to stabilize, sometimes included in the seek time.
  
- **Rotation Time**: The waiting time for the sector to be underneath the drive head. Modern disks rotate between 5,000-15,000 RPM, translating to 4ms-12ms for a full rotation. An average estimate is around half of that (2-6ms).
  
- **Transfer Time**: The time to shift bytes from the disk to the controller. It has two main components:
  - **Surface Transfer Time**: The time needed to move adjacent sectors once the first sector is read. It's less for the outer tracks.
  - **Host Transfer Time**: The time to relocate data between the disk controller and the host memory.
  
The total **Disk I/O time** is the sum of the seek, rotation, and transfer times. It's essential to remember that these timings can vary based on the disk's data position and its current operation.

In the context of HDDs, the way data is read matters significantly. Given that sequential disk accesses are faster than random ones, it leads to a question: Can this property be harnessed to accelerate disk access?

In a multiprogramming environment with moderate activity, several I/O requests can queue up. The disk now possesses the flexibility to prioritize its I/O operations, which could be exploited through **disk head scheduling** to maximize throughput.

### Scheduling Algorithms

We have the following scheduling algorithms:

- FIFO Scheduling:
    - FIFO (First-In-First-Out) is just reading each request in the order they come in.
- SSTF Scheduling (Shortest Seek Time First):
    - Instead of naively following FIFO, we can optimize by addressing the closest request to the read head each time.
- SCAN (or Elevator) Scheduling:
    - Envision an elevator: it moves in one direction, servicing all requests until it reaches the top or bottom. Then, it reverses direction. This principle is applied in SCAN scheduling.
- C-SCAN (or C-LOOK) Scheduling:
    - Instead of reversing direction, C-SCAN moves the head towards the spindle until the end. It then instantaneously resets to the outer edge, optimizing performance.

### Disk Performance Enhancements

- **Partitions**: Logical divisions on a disk that can simulate having multiple disks. It can optimize access as the search is confined within a smaller section.
  
- **Short-stroking**: Primarily for extreme performance needs, such as database servers. It confines the partitions to the outermost 1/3 of the disk, exploiting faster access times.




## Solid State Drives (SSD)
***

Unlike HDDs, SSDs have no moving parts. This grants them:
- Superior random-access performance.
- Reduced power consumption.
- Enhanced resistance to physical shock.

SSDs primarily employ NAND flash technology.


### Characteristics of NAND Flash

A key trait of NAND Flash: while data can be set, it can't be individually unset. For unsetting, all cells must be cleared simultaneously, making in-place data overwriting nearly impossible.

For instance, if you attempt to set a value at position 4 and then try to unset a value at position 1, the latter operation isn't permitted. The entire block must be cleared.


#### Operations in NAND Flash

- **Pages**: They're to SSDs what sectors are to HDDs. Minimum unit for read/write operations is one page.
- **Timings**:
  - Reading a page: few microseconds (μs)
  - Writing a page: few microseconds (μs)
  - Erasing a block: several milliseconds (ms)

###### How we handle page and block operations:
- Erase operations are slower. Optimize by avoiding them whenever possible.
- Mark pages as unusable instead of erasing them. Later, group and erase multiple unusable pages together.

###### Performance Metrics:
- Writing and then erasing 128 pages sequentially: approximately 385ms or 3.005 ms per page.
- Writing 128 pages sequentially and then performing a single erase: approximately 9.4ms or 0.08 ms per page.

By spreading out erase costs over multiple writes, we achieve a significant 37.5x speed boost.

#### Remapping
We can have the illusion of being able to individually unset data by remapping:
- Have a dedicated section of the SSD for storing remappings.
- When writing a page, actually write it elsewhere and store this new location in the remapping section.
- Execute full erasures when pages are overwritten and no longer in use.

#### Ensuring Flash Durability

NAND Flash has its limitations:
- Data reliability decreases after multiple erasures.
- Data can fade after prolonged periods without power.
- Frequent reads of nearby cells degrade reliability.

To counteract these:
- Use error correcting codes.
- Mark blocks as faulty once they no longer erase effectively.
- Distribute writes and erases across different physical pages (wear-leveling).
- Overprovisioning: SSDs have more space than advertised, which helps manage defective pages and assists in wear-leveling.

### SSDs vs. HDDs: A Quick Comparison

| **Metric**                     | **HDDs** | **SSDs**  |
|-----------------------------|---------|---------|
| Capacity/Cost                | Excellent | Good    |
| Sequential IO/Cost           | Good     | Good    |
| Random IO/Cost               | Poor     | Good    |
| Power Consumption            | Fair     | Good    |
| Physical Size                | Fair     | Excellent|
| Resistance to Physical Damage| Poor     | Good    |

SSDs offer well-rounded performance, making them a staple in personal electronics. However, the higher capacity-to-cost ratio of HDDs ensures their dominance in servers and large data storage solutions.
