+++
title = "Filesystems, Layout, Caching, & Recovery"
description = "This is an overview over filesystems, block allocation, directories, UNIX, NTFS, caching, and file recovery."
date = 2023-09-16T13:26:37-05:00
tags = ["Operating Systems Notes"]
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

The operating system always keeps the metadata at a predetermined, easily accessible location. Data embodies the actual content that users are interested in. This comprises sectors of data strategically placed on the disk.


#### Design Properties for an Ideal Filesystem

Understanding typical file patterns helps us delineate what an ideal filesystem might look like:

1. Quick access to smaller files.
2. Efficient access to larger files.
3. Minimize fragmentation to reduce wasted space, covering both internal and external fragmentation.
4. Facilitate files to expand beyond their initial size.
5. Ensure decent speeds for both random and sequential access.




## Data Block Allocation
***

A pivotal decision in file management is how to allocate data blocks to hold a file. 

### Contiguous Allocation

Under this method, files are assigned as a consecutive sequence of blocks. The main advantage here is simplicity. The file header only needs to store the first block's address and the file's size.

When focusing on access in contiguous allocation:

1. Disk Read Requirement: To fetch a specific block, how many disk reads are necessary? Note that one must always be aware of the block number of the relevant file header. 
2. All data fetches from the disk must specify a block number. For instance, one can request "read block 27". However, vague requests like "read the succeeding block" or "read the next file" are not permissible.

#### Contiguous Allocation: The Memory Constraint

A key constraint in this discussion is the available memory for storing data. In our current discussion, we're limiting ourselves to two memory spots. 

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

#### Assessment of Contiguous Allocation

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

The pointer to the last block is to assist in file growth. When a file needs to be expanded, this last-block pointer enables rapid access to the file's end, allowing for a new block to be linked without scanning the entire list.

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

#### Random Access:
For the linked allocation:

1. Read the header block: Retrieve the essential file metadata.
2. Locate the address of the first block: This requires reading the block.
3. Access the first block: Read its contents.
4. From the first block, find the address of the second block: This necessitates reading another block.
5. Access the second block: Read its contents.
6. From the second block, identify the address of the third block: Yet another block read.
7. Read the third block.

#### Assessment of Linked Allocation:

- Sequential Access Speed: Typically efficient.
- Fragmentation: Only internal fragmentation is present, with a maximum of one block.
- File Growth: Growing a file poses no challenges.
- Random Access Speed: Essentially equates to sequential access to the Nth block.
- Corrupted Disk Block: Corruption of a single block obstructs access to subsequent blocks.

Both contiguous and linked allocation have their unique strengths and weaknesses. While contiguous allocation excels in both sequential and random access due to its simple structure, it struggles with file growth and fragmentation. On the other hand, linked allocation offers more flexibility in file growth, but at the cost of slower random access speeds.

### Direct Allocation

In this scheme, the file header directly points to each data block. This has good access time but forces the file to be tiny.


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

While we have managed to access a file's data using its metadata (file header) and can identify file headers via their index in the file header array, our current system lacks the capability for file naming. Not being able to name files presents a direct challenge to making the system user-friendly and efficient.

Directories provide the crucial framework for organizing, accessing, and protecting files within a filesystem.

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
---

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

This process required 6 disk reads to merely open the file, without even fetching any content from it.

### Optimization: The Current Working Directory (cwd)

Problem: Opening files, especially those nested deep within directories, can be quite read-intensive.

Solution: Use the concept of a Current Working Directory (CWD).

- Relative File Specification: Users can specify files relative to the CWD, which can significantly cut down the number of reads for frequently accessed directories.
  
- Caching the CWD: The OS caches data blocks of the CWD either in the disk cache or in the Process Control Block (PCB). This avoids redundant lookups, speeding up file access.

While we've detailed how to:

1. Find the data blocks of a file given its header.
2. Extend a file, if necessary.
3. Retrieve a file header using a human-readable path.

Users shouldn't need to know or perform any of these steps. The OS masks this complexity, presenting users with a straightforward interface.

### Enhancing Usability with the UNIX Filesystem API

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











## Filesystem Recap
***

To understand the workings of a filesystem, let's delve into its individual components:

1. **Syscall API**: This is the set of system call interfaces that allow user programs to interact with the operating system, facilitating operations on files and directories.
  
2. **File and Data Layout**: This is about the organization of files and data on the disk. It defines how data is stored, accessed, and retrieved.

3. **Directories and Organization**: Instead of having users remember intricate inode numbers (inumbers) for every file, we introduced directories. Directories associate file names with their respective inumbers. For instance:
   - `.bashrc` ➔ 27
   - `Documents` ➔ 30
   - `Pictures` ➔ 3392
   - `.ssh` ➔ 7
   
   Users navigate and access files using paths, a series of directory names. For example, `/Documents/Assignment1.txt`. The starting point, `/`, denotes the root directory. Navigating from the root might require multiple disk lookups. To enhance efficiency, a concept called the current working directory was established. This way, users don't always have to start from the root; they can work within their current directory.

### Disk Access Model

When we initiate operations on our disk, it's not as straightforward as merely asking the disk to "read the next file." Instead, we employ a structured approach:

- We always begin with the inode number (i#) of the root directory, typically designated as 2.
  
- The CPU is capable of storing data equivalent to two blocks in memory. For any additional data, a request has to be sent to the disk.

- Any such request needs to be precise. It should be in the form of a block number. For instance, "read block 27" is a valid request. Ambiguous requests like "read next block" or "read next file" are not entertained.



## Foundational Filesystems
***

- **File Allocation Table (FAT)**: A prominent example of filesystems is FAT, which employs linked allocation with links in the header. This mechanism allocates the first available free block to a file. Although the FAT system is straightforward, it lacks several advanced features.

- **Berkeley Fast Filesystem (FFS)**: Designed for efficiency, FFS employs multilevel indexing. This system facilitates swift access to smaller files using direct allocation and supports large files via indirect blocks. Modern descendants of FFS, often referred to as "UFS2," still dominate many BSD systems today.

### Modern Developments: NTFS Insights

Today, we'll explore NTFS - the New Technology File System, the default filesystem for Windows.

- **History & Relevance**: Introduced by Microsoft in July 1993, NTFS remains the primary filesystem for all Windows devices. Anyone who has operated a Windows PC has interacted with an NTFS filesystem.

- **Innovations in NTFS**: 

  - **Extents**: These track a range of consecutive blocks rather than individual blocks. For instance, instead of marking blocks like 192, 193, 194, 657, 658, 659 individually, it can be represented as two extents: (192,3) and (657, 3).

  - **Flexible Trees**: In NTFS, files are illustrated through variable-depth trees. A massive file with few extents will have a shallow depth. The Master File Table (MFT) maintains the trees' roots, akin to the inode table. These entries are known as records. Each record houses a sequence of variable-sized attribute records.

#### NTFS File Categories

1. **Normal Files**
  
2. **Tiny Files**

3. **Files with Abundant Metadata**: These are files that have so much metadata that there isn't sufficient space for data pointers.

4. **Varying Sizes**: From small to really, really large files, NTFS can handle them all. For extremely vast files, even the attribute list might be external!

5. **Special Files**: NTFS houses most metadata in regular files with specific numbers such as:
   - 5 for the root directory
   - 6 for free space management
   - 8 for the list of flawed blocks

   Other key files include:
   - **$Secure (file 9)**: Manages access controls for each file. It's essential to note that this isn't directly stored in the file record. Each file is indexed by a fixed-length key found in the Standard Info field of the file record.
   - **$MFT (file 0)**: Contains the Master File Table. The MFT is dynamic, starting small and expanding as needed. NTFS smartly reserves a segment of the volume for MFT expansion to counter fragmentation.

NTFS combines traditional and innovative structures:

- **Traditional Structures**:
  - A unified array for file headers, named file records.
  - Predetermined, global file records for crucial files.
  - File records house pointers leading to data blocks.

- **Novelties**:
  - For tiny files, NTFS can store file data directly within a record, which avoids unnecessary disk access.
  - For extensive file records that exceed their limits, they can overflow to other MFT entries. This setup circumvents file size limitations due to file record size constraints.
  - Uses extents to store data block information related to a file more compactly.



## Filesystem Layout
***
There's essential data intrinsic to every filesystem:

- The filesystem type (Is it FFS? FAT32?)
- The total number of blocks.
- Block size.
  
Moreover, we must manage elements like file headers, free space, etc. All this data is stored in what's known as a **superblock**. Each filesystem possesses at least one superblock, and it's feasible to have numerous filesystems on a singular physical disk using partitions.

### Filesystem's Physical Layout

Within a partition (or filesystem), the superblock retains details like the starting point of inode arrays, block dimensions, and free disk space management techniques.

**Partitions** have multiple utilities:

- They can segregate a disk into multiple filesystems.
- Every partition can effectively function as an independent filesystem but within the same disk.
- The **Partition Table** (a component of the GPT Header) indicates the locations of different partitions.
  
Uses of partitions encompass:
- Housing multiple OSs on a single physical disk (useful for dual-booting systems).
- Creating a swap partition for pages that are removed from the primary memory.
- Designating physical disk regions for optimizing seek latency.


**Filesystem Layout: A Quick Summary**

1. The **superblock** holds crucial details about the filesystem:
   - Filesystem type.
   - Block size.
   - Starting points of other essential segments, such as the inode array.

2. Bitmaps, separate for inodes and file data, help in tracking free blocks.

3. **Inode arrays** are vital as they store key file metadata.

4. There could be backup superblocks distributed across the disk, furthering reliability.

5. Consequently, parts of the disk are not available for storing file data, in part because many contemporary filesystems set aside around 10% of data blocks for optimizing file locality.

## Reliability and Consistency
***

*Consistency as a Measure of Reliability*:

- **Consistency** is pivotal: It ensures that the data aligns with itself.
- Although this might seem a basic requirement, maintaining it is fundamental for a filesystem.
- The overarching goal is to ensure the filesystem's "correctness" post any failure.

**How Inconsistencies Might Arise**:

- When appending data to a file, several changes to the filesystem may occur, like:
   1. Addition of a new data block.
   2. Update to the inode.
   3. Update to the data bitmap.

- However, if only one of these writes succeeds, it could lead to complications:
  1. **Data Block Write Success**:
     - The new data block has been written.
     - But, the bitmap indicates the block isn't in use.
     - The inode doesn't direct to this new block.
     - Result: The data block's purpose is nullified. 

  2. **Inode Write Success**:
     - The inode has a pointer, but it might just point to irrelevant data.
     - The data bitmap suggests the block is free, contradicting the inode.
     - Result: FILESYSTEM INCONSISTENCY. Reconciliation is needed.

  3. **Data Bitmap Write Success**:
     - The data block is labeled as allocated, yet contains only irrelevant data.
     - The data bitmap denotes the block as in use, but there's no inode pointing to it.
     - Result: FILESYSTEM INCONSISTENCY. Determining which file utilizes the data block becomes a challenge.

**Challenges in Handling Write Failures**:

- If two writes are successful, inconsistencies can still arise:
  - Inode and bitmap updates are successful but reading the new block only returns irrelevant data.
  - Inode and data block updates succeed, but the data bitmap doesn't mark the block as used.
  - Both the data bitmap and data block succeed, but no inode points to the data block.

In essence, no matter the write sequence, failures can induce inconsistencies.



## Caching
***

Disk caching drastically improves our interaction speed with the filesystem. Modern operating systems utilize caching extensively. However, RAM's volatile nature poses a question: What happens during a power outage, especially if there's unsaved data in memory?

### Disk Writing
- Should a user be informed of a successful write if it's only cached in RAM?
   - **Write-through caching**: Ensures the data is immediately written to the disk, retaining a cached copy for future reads. While it upholds consistency, it's slow due to waiting for the disk's confirmation.
   - **Write-back caching**: Delays writing to the disk, storing the changed copy in-memory. It offers superior performance, but there's a risk of losing modified data during crashes.

#### A Deep Dive into Cache Writing
- **Write-through** vs. **Write-back**:
  - Write-through ensures immediate data writing to the disk. It's more consistent but slower.
  - Write-back defers disk writing, relying on the in-memory copy for subsequent read requests. It's faster but prone to inconsistencies during system crashes.
  
- This distinction is also relevant for CPU caches. The speed gap between CPU cache and RAM is approximately 100x, whereas it's around 20,000x between RAM and disk.

- **Crux of the Matter**: No write operation sequence can guarantee a consistent filesystem, a dilemma compounded by caching. While write-through caching preserves data consistency, it's slow. Write-back caching, being faster, raises the chances of data loss.

### Caching’s Impact on Consistency
- Even without factoring in disk caching, inconsistencies can emerge. Write-back caching can make things even more complex.
- Let's consider an example:
   - With **write-through caching**, updating the inode, data block, and data bitmap requires three separate disk writes, taking about 30-40ms. During this window, power failures can result in inconsistencies.
   - With **write-back caching**, after the initial write, the subsequent two are held in cache. If there's a power outage before the cache flushes, inconsistencies can arise, especially since the write-back delay is typically much longer than 30ms.

**Traditional UNIX Approach to Consistency: `fsck`**
- Historically, up to the early 2000s, UNIX systems employed `fsck` to tackle consistency concerns.



## UNIX Filesystem
***

**Handling User Data in UNIX**
- UNIX opts for **write-back caching** when dealing with user data.
- A cache flush (or writeback) is mandated at fixed intervals, e.g., every 30 seconds. This means that during these intervals, there's a risk of data loss due to a crash.
- Users can also initiate a `sync` command (via the `fsync` syscall) compelling the OS to write all cached data to the disk. 
- However, this does not guarantee the order of block writes to the disk. This means the filesystem can appear to reorder these writes. As a result, user applications seeking internal consistency need to implement additional measures to achieve that.

**Handling Metadata in UNIX**
- For better consistency, UNIX employs **write-through caching** for metadata.
- When multiple metadata updates are necessary, they are executed in a well-defined, universal order.
- This method might seem familiar as it's reminiscent of another synchronization technique discussed in this course. The technique in question involves predetermined global orders.
- If the system crashes, one must:
  - Run the `fsck` tool, which stands for filesystem check. This tool scans partitions for inconsistencies and rectifies incomplete operations if detected.

**An Example: Creating a File**
Considering a system with direct allocation, the following operations are essential when creating a file:
1. Write to the inode bitmap.
2. Update the data bitmap.
3. Write to the inode for the new file.
4. Write to the data block.
5. Update the inode.
6. Update the inode bitmap.
7. Update the data bitmap.
8. Update the directory.

### Post-Crash Scenario: The Role of `fsck`
Consider the operations in file creation:
1. Write to the data block.
2. Update the inode.
3. Update the inode bitmap.
4. Update the data bitmap.
5. Update the directory.

Ponder upon this: What if a crash occurred before the first operation or between the first and second operations?

**The Challenges with `fsck`**
- `fsck` isn't based on a highly principled approach. There's always the lingering worry about overlooked edge cases that might disrupt everything.
- Ensuring its accuracy is a challenge, as minor errors can lead to severe repercussions.
- Leveraging write-through caching for metadata can degrade performance.
- The recovery process is tedious. At the very least, a comprehensive scan is needed for:
  1. The inode bitmap.
  2. The data block bitmap.
  3. Every inode.
  4. Every directory.
  
Further, the recovery task might intensify if any inconsistencies arise.


## Transactions & Journaling
***

Transactions are a way to group actions, ensuring that:

- **Atomicity**: The bundled operations either fully execute or they don't execute at all.
- **Serializability**: Transactions seem to occur sequentially.
- **Durability**: Once a transaction is finalized, its effects are permanent.

In the transactional process, actions are tentatively applied. If all goes well, we "commit" these actions, making them permanent. If a fault occurs midway, we "rollback" and undo the changes.

### Handling Rollbacks

Directly undoing disk writes (rollback) is tricky. A prime example being anyone who wished they could revert to a previous version of a project.

The solution? Use a **transaction log**:

1. **Write-Ahead Logging**: Log each intended operation without immediately executing it.
2. **Commit**: Indicate that the transaction is complete and its effects are now permanent.
3. **Delayed Execution**: At a later time, maybe during a cache flush or an `fsync()` call, execute the logged changes.

### Transparency in Transactions

After committing, even though the new data hasn't been written to disk, it's still considered as the "official" data. This raises the question: How can the system provide access to this data?

The operating system plays a bit of an illusionist role here. A straightforward approach is for the OS to update its disk cache to mirror what the disk would look like post-transaction. If any process tries to access the modified pages between the logging of the COMMIT and the actual disk update, the OS reroutes the request to the in-memory cache.

### Recovery and Partial Transactions

Recovering from incomplete transactions is somewhat similar to the `fsck` process:

1. **Fully Completed Transaction**: If the transaction was concluded and all disk blocks were altered, no further action is needed.
2. **Committed but Unapplied**: If the transaction was committed but the disk blocks weren't updated, replay the transaction to make sure the data aligns.
3. **Aborted Transactions**: If a transaction was aborted and the changes weren't made visible, you can disregard it as if it never occurred.

Thus, transactions and journaling collectively ensure that data remains consistent, even in scenarios with unexpected failures. By logging operations and deferring actual changes, the system can maintain atomicity and durability, while also allowing recovery when things go awry.

### Journaling Filesystems: A Comprehensive Look

From the 1990s onwards, **journaling filesystems** became a foundational element in filesystem design. They work on a simple principle: all metadata changes that might cause inconsistencies are first written to a **transaction log** (commonly known as the journal) before being eventually persisted to the relevant disk blocks.

Benefits:
- **Eliminates exhaustive scans**: There's no need to run a whole-filesystem `fsck` on a failure. Just checking the journal suffices.
  
Transactions can be:
1. **Finished**: No actions needed.
2. **Uncommitted**: It's as if this transaction never occurred.
3. **Committed but Incomplete**: The system replays incomplete operations to finalize the transaction.

#### Enhancements and Challenges

1. **Performance**: Writing blocks sequentially can be slow. A faster method might be to issue all writes simultaneously. But, this has its complications. The disk can schedule writes in a non-sequential manner.
  
   Solution: Ensure all data reaches the disk before writing `Commit` by using a `sync` command.

2. **Metadata Duplication**: Journaling means metadata is written twice: once in the journal and once in its intended location on the disk.

#### Journaling in Context

Compared to traditional methods, journaling offers a better balance of performance and reliability. `fsck`, while reliable, has several drawbacks. It employs write-through caching and in case of failures, necessitates scanning the entire partition, leading to slow recoveries. 

Journaling, on the other hand, logs all metadata changes as transactions in the journal. If there's a failure, only the journal needs scanning. This provides fast recovery, although metadata still needs to be written twice.


Disks can fail unexpectedly, risking data loss. A fundamental concern is consistency: the disk's metadata should self-align. The in-memory disk cache, while essential for performance, exacerbates consistency issues.

Traditional methods like `fsck` entail updates in a specified order using write-through caching. After a failure, a complete partition scan is initiated to identify inconsistencies. This method is sluggish in writing, slower in recovery, and prone to errors.

In contrast, journaling uses transactions to record metadata changes, speeding up recovery and enhancing reliability, albeit with the trade-off of writing metadata twice.

