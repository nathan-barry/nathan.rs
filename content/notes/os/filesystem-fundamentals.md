+++
title = "Filesystem Fundamentals"
description = "These are my notes over Professor Norman's Operating Systems course. Notes closely follow the in class lecture slides."
date = 2023-09-16T13:26:37-05:00
tags = ["Operating Systems Notes"]
priority = 14
+++

{{< toc >}}


## Filesystems
***

To manage the vast, slow, and intricately structured persistent storage, we introduced the concept of a filesystem. When evaluating the quality of a filesystem design, three primary criteria emerge:

1. Speed: How swiftly can the design execute operations? How many disk accesses does it demand for common tasks?
2. Usability: Will this design frustrate or overwhelm developers? Does it hide system complexities, or does it demand in-depth system understanding?
3. Reliability: What happens when the system faces issues like sudden power cuts? Can it get corrupted? If so, how feasible and quick is the recovery process?

### Bits, Bytes, Sectors, and Blocks

Previously, we discussed sectors, which are essentially the tiniest chunks of data that a drive can read, typically sizing up to 512 bytes.

Blocks are the smallest units that software typically uses to access the disk. They comprise an integer number of contiguous sectors. In simpler terms:
- Bit: The most basic unit.
- Byte: The smallest chunk addressable by hardware.
- Sector: The tiniest unit a drive can read.
- Block: The smallest unit that software generally interacts with.
- Machine Word: A fixed-sized group of bytes that can be easily processed by the machine.

### File Design and Layout

Files, at their core, consist of two components: Data and Metadata.

Metadata offers crucial insights about the file:
- Where is the file located on the disk?
- Who owns the file?
- What's the size of the file?
- What permissions are associated with it?
- When was it created or last modified?
- Where are the data blocks situated?

The operating system always keeps the metadata at a predetermined, easily accessible location.

On the other hand, Data embodies the actual content that users are interested in. This comprises sectors of data strategically placed on the disk.

For our current exploration, we'll concentrate on the organization of file data on the disk, assuming we're already familiar with the metadata's whereabouts.


### Design Properties for an Ideal Filesystem

Understanding typical file patterns helps us delineate what an ideal filesystem might look like:

1. Quick access to smaller files.
2. Efficient access to larger files.
3. Minimize fragmentation to reduce wasted space, covering both internal and external fragmentation.
4. Facilitate files to expand beyond their initial size.
5. Ensure decent speeds for both random and sequential access.




## Data Block Allocation: The Decision Process
***

A pivotal decision in file management is how to allocate data blocks to hold a file. 

### Contiguous Allocation Approach

Under this method, files are assigned as a consecutive sequence of blocks. The main advantage here is simplicity. The file header only needs to store the first block's address and the file's size.

When focusing on access in contiguous allocation:

1. Disk Read Requirement: To fetch a specific block, how many disk reads are necessary? Note that one must always be aware of the block number of the relevant file header. 
2. All data fetches from the disk must specify a block number. For instance, one can request "read block 27". However, vague requests like "read the succeeding block" or "read the next file" are not permissible.

#### Contiguous Allocation: The Memory Constraint

A key constraint in this discussion is the available memory for storing data. In our current discussion, we're limiting ourselves to two memory spots. Why only two? 

This simplification is a strategic choice. In real-world scenarios, a system could have millions of memory spots, each capable of holding vast amounts of data. Operating in such an environment makes it hard to determine the efficiency of an algorithm due to the sheer number of variables at play. 

By restricting ourselves to just two memory spots, we can clearly visualize how various file layouts impact access speed. While this might not mirror real-world complexities, the principles derived can be extrapolated to more intricate systems.

###### Contiguous Allocation Access: A Step-by-Step

To access a particular block under contiguous allocation:

1. Reading the Header Block: Initiate by reading the block that houses the file header.
2. Locate the First Data Block: Using the header, identify the address of the first data block.
3. Read the First Data Block: Fetch the data from the first block.

#### Access Patterns

Random Access: Contiguous allocation makes random access swift. Say, for example, you're looking to read the third block of a file. You would:

1. Read the header block: This gives you essential metadata.
2. Locate the address of the first data block: Given the contiguous nature of allocation, you can then easily calculate the address of any subsequent block.
3. Fetch the third data block: Simply add three to the first block's address.

The reason why random access is efficient here is due to the contiguous nature of the data storage. If the first block is located at index `N`, the third block will inevitably be at `N+2`.

#### Assessment

- **Simplicity:** The contiguous allocation method is straightforward, which is always a merit in design.
- **Sequential Access Speed:** Excellent.
- **Random Access Speed:** Excellent.
- **File Growth:** One major downside. If you wish to expand a file but another file obstructs its path, reallocation becomes necessary.
- **Fragmentation:** There's a significant amount of external fragmentation.
- **Overcoming Challenges:** The issues with contiguous allocation lead us to explore alternatives, like linked allocation.


### Linked Allocation

In linked allocation, the file is represented as a linked list of blocks. Here's how it's structured:

1. File Header: Contains pointers to the first and last blocks allocated to the file.
2. Block Structure: Every block has data and a pointer pointing to the subsequent block.

At this juncture, you might wonder about the utility of having a pointer to the last block. This pointer isn't for list traversal. Its primary function is to assist in file growth. When a file needs to be expanded, this last-block pointer enables rapid access to the file's end, allowing for a new block to be linked without scanning the entire list.

#### Access Patterns

- Accessing the First Block:

    1. Read the header block: Retrieve crucial metadata.
    2. Locate the address of the first block: From the metadata.
    3. Fetch the first block.

- Sequential Access (e.g., Reading the Second Block after the First):

    1. Read the header block.
    2. Identify the address of the first block.
    3. Fetch the first block.
    4. Using the pointer in the first block, determine the second block's address.
    5. Fetch the second block.

- Random Access (e.g., Directly Reading the Third Block): In linked allocation, random access is a challenge. To read the third block directly, you'd essentially have to traverse through the first two blocks. This is a notable drawback of linked allocation as compared to contiguous allocation.

### Random Access:
For the linked allocation:

1. Read the header block: Retrieve the essential file metadata.
2. Locate the address of the first block: This requires reading the block.
3. Access the first block: Read its contents.
4. From the first block, find the address of the second block: This necessitates reading another block.
5. Access the second block: Read its contents.
6. From the second block, identify the address of the third block: Yet another block read.
7. Read the third block.

### Assessment of Linked Allocation:

- Sequential Access Speed: Typically efficient.
- Fragmentation: Only internal fragmentation is present, with a maximum of one block.
- File Growth: Growing a file poses no challenges.
- Random Access Speed: Essentially equates to sequential access to the Nth block.
- Corrupted Disk Block: Corruption of a single block obstructs access to subsequent blocks.

Both contiguous and linked allocation have their unique strengths and weaknesses. While contiguous allocation excels in both sequential and random access due to its simple structure, it struggles with file growth and fragmentation. On the other hand, linked allocation offers more flexibility in file growth, but at the cost of slower random access speeds.

## Direct Allocation

In this scheme, the file header directly points to each data block.

### Assessment Queries:

- Sequential and Random Access Speeds: How quickly can data be fetched in both scenarios?
- Fragmentation: How does this scheme manage storage fragmentation?
- File Growth: How does the file system handle an increase in file size?
- Support for Varied File Sizes: Can it efficiently handle both small and large files?
- File Metadata and Large Files: What if the metadata occupies the majority of the header space?


### FAT File System

The File Allocation Table (FAT) system originated with MS-DOS in the late 1970s. It has various descendants like FATX and exFAT and is widespread in use, found in optical media, flash drives, and even gaming consoles like Xbox.

#### Advantages:

1. Simplicity: Straightforward design and structure.
2. Universal Compatibility: Supported across all operating systems, largely due to its simplicity.

#### Disadvantages:

- Poor Random Access: Requires sequential traversal of linked blocks.
- Limited Access Control: There's no differentiation between file owner or group ID, making all files readable/writable by any user.
- Size Limitations: With FAT-32, for instance, using 4KB blocks, the file system can't exceed 2TB. Individual files have a cap at 4GB.
- No Transactional Updates Support: This topic will be delved into further later.
- Lack of Features: No support for hard links, and the volume and file size are bounded.


### Variable-Sized File Headers: Why It's Not Ideal

While it might be tempting to employ variable-sized file headers, especially for large files, this approach presents severe drawbacks:

1. Complex Indexing: Fixed-size headers allow for easy indexing arithmetic. Variable-sized headers, on the other hand, complicate direct access.
2. Increased Disk Access: You'd need to traverse from the start for every file header access. So, to access header 27, you'd need a minimum of 27 disk reads.
3. Efficiency Concern: Disk reads are resource-intensive. Having to execute millions of disk accesses to locate the millionth file is far from optimal.

While each file allocation method offers unique advantages, it's crucial to weigh these benefits against the drawbacks to make an informed choice. Linked allocation shines for sequential access but falters with random access. FAT is universal but has its limitations, and direct allocation prompts critical questions about file growth, metadata management, and fragmentation.



## Directories
***

While we have managed to access a file's data using its metadata (file header) and can identify file headers via their index in the file header array, we are yet to achieve a comprehensive system.

Our current system lacks the capability for file naming. Not being able to name files presents a direct challenge to one of our primary goals: making the system user-friendly and efficient.

Directories provide the crucial framework for organizing, accessing, and protecting files within a filesystem. The seamless integration between directories and files ensures a smooth user experience while navigating vast amounts of data.

### What is a Directory?

A directory is essentially a file that holds a mapping from file names to their corresponding inode numbers. Think of this as an address book where you can look up the address (inode number or `inumber`) for any person (file name).

- The Special Reserved Area: Remember the "special reserved area" we discussed? That was a rudimentary example of a directory.
  
- Inumber: This is the identifier for the inode and is often referred to as the `inumber`.

- Protection from Tampering: To prevent security breaches or accidental errors, only the operating system has permission to alter directories. This way, the mappings remain secure.

- User-level Access: While users cannot modify directories, they can read them, which aids in navigation and file retrieval.

- Name Spaces: Directories maintain unique name spaces. This means that within one directory, all file names must be distinctive. However, the same name can be reused in another directory.


A fascinating fact about directories is that an `inumber` within a directory can actually point to another directory, not just typical files. To distinguish between the two, the OS designates a special bit in the inode. 

There is always a unique root directory, which acts as the entry point to the entire file system. This root is often identified by `inumber` 0, 1, or 2.

Example: 

Imagine a directory with entries each 16 bytes long:

| i#   | Filename   |
| --- | --- |
| 3226 | .bashrc    |
| 251  | Documents  |
| 7193 | pintos     |
| 2086 | todo.txt   |
| 1793 | Pictures   |

### Traversing the File System

To access a file's data, you need to:
1. Find its `inode` (file header) - which requires the `inumber`.
2. To get the `inumber`, read the directory holding the file.
3. However, since the directory is also a file, you need to find its data blocks too!

It might seem like we're going in circles, but in actuality, the start and end data blocks are distinct — one belongs to the target file, and the other to its containing directory.

But to prevent getting stuck in an endless loop, a fixed point of reference is required.

### Breaking the Infinite Loop

The solution to this seemingly infinite cycle is the root directory. This directory serves as the base or starting point from which all other files can be accessed. In UNIX systems, this root directory is denoted as "/". Typically, in many UNIX systems, the root directory has an `inumber` of 2.






## Understanding UNIX Filesystem Internals

### Tracing the File Open Process

When a user tries to access a file, the OS traverses through the directory structure. Here's how it works for the syscall: 
```c
int config_fd = open("/home/user1/.bashrc", O_RDONLY);
```

1. Reading the Root Inode: Start by reading `inode 2`, which is the root inode.
2. Locating Data in Root: Use the root inode to find the data blocks associated with it.
3. Finding 'home' Directory: The next target in our path is "home", which has `i# = 11`. Read `inode 11` to proceed.
4. Locating Data in 'home': Use `inode 11` to get the data blocks for the "/home" directory.
5. Finding 'user1' Directory: The subsequent target is "user1", identified by `i# = 6`. Access `inode 6` to continue.
6. Locating Data in 'user1': Using `inode 6`, locate the data for the "/home/user1" directory.
7. Target File Identification: The data reveals the inode for the desired `.bashrc` file.

In essence, this process required 6 disk reads to merely open the file, without even fetching any content from it.

### Optimization: The Current Working Directory (cwd)

Problem: Opening files, especially those nested deep within directories, can be quite read-intensive.

Solution: Use the concept of a Current Working Directory (CWD).

- Relative File Specification: Users can specify files relative to the CWD, which can significantly cut down the number of reads for frequently accessed directories.
  
- Caching the CWD: The OS caches data blocks of the CWD either in the disk cache or in the Process Control Block (PCB). This avoids redundant lookups, speeding up file access.

### Role of the Operating System

The OS plays the role of an illusionist. While we've detailed how to:

1. Find the data blocks of a file given its header.
2. Extend a file, if necessary.
3. Retrieve a file header using a human-readable path.

Users shouldn't need to know or perform any of these steps. The OS masks this complexity, presenting users with a straightforward interface.

### Enhancing Usability with the UNIX Filesystem API

Now, understanding the intricacies of file and directory management in UNIX, we can delve deeper into its Filesystem API.

The UNIX Filesystem API provides a set of functions that allow users to interact with files and directories without needing to understand the underpinnings of the filesystem.

While many of these functions may already be familiar, understanding their implementations, given our deep dive into the filesystem, will be enlightening. Before we explore them, however, there's one last piece of the API we need to discuss...

This approach ensures that even as we dive deep into the technicalities, the content remains structured and easy to follow. It's the OS's job to handle these complexities, and our job to present them in an organized manner!


### Filesystem Structures in Memory and On-Disk

The following components are crucial:

- User Memory: This is where processes reside and operate. It has limited direct interaction with the filesystem.
- Per-Process Memory: This memory contains process-specific data, like the file table for each process.
- Global System Memory: A centralized memory zone holding data that is globally accessible to all processes.
- On Disk: The physical storage where the file data and inodes exist.

When a user interacts with the filesystem (like opening a file), they primarily deal with structures in the user memory, accessing the disk indirectly through system calls.

### Recap

1. Computers without persistent storage are frustrating to work with.
2. The unique nature of persistent storage (considering aspects like speed, resilience, and request ordering) steers us towards the creation of file systems.
3. In filesystem design, the main priorities are:
    - Speed: Efficient file access and operations.
    - Reliability: Data integrity and resilience against failures.
    - Usability: User-friendly operations and structure.
4. Filesystem utilization encompasses the filesystem API, in-memory tracking structures, and the data's on-disk architecture. All these elements must be contemplated when formulating a filesystem.
