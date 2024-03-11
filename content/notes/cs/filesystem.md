+++
title = "Filesystems, Transactions, & Journaling"
description = "Notes from OS. An overview over filesystems, block allocation, directories, caching, and file recovery."
date = 2023-09-16T13:26:37-05:00
tags = ["Computer Science Notes"]
+++
{{< toc >}}


## Filesystems Basics
***

### Bits, Bytes, Sectors, and Blocks

Previously, we discussed sectors, which are essentially the tiniest chunks of data that a drive can read, typically sizing up to 512 bytes.

Blocks are the smallest units that software typically uses to access the disk. They comprise an integer number of contiguous sectors. In simpler terms:
- Bit: The most basic unit.
- Byte: The smallest chunk addressable by hardware.
- Sector: The tiniest unit a drive can read.
- Block: The smallest unit that software generally interacts with.
- Machine Word: A fixed-sized group of bytes that can be easily processed by the machine.

### File Design and Layout

Files consist of two components: Data and Metadata. Metadata offers crucial insights about the file:
- Where is the file located on the disk?
- Who owns the file?
- What's the size of the file?
- What permissions are associated with it?
- When was it created or last modified?
- Where are the data blocks situated?

The operating system keeps the metadata at a predetermined, easily accessible location. Data is actual content that users are interested in. This comprises sectors of data placed on the disk.


#### Design Properties for an Ideal Filesystem

1. Quick access to smaller files.
2. Efficient access to larger files.
3. Minimize fragmentation to reduce wasted space, covering both internal and external fragmentation.
4. Facilitate files to expand beyond their initial size.
5. Ensure decent speeds for both random and sequential access.

### Superblocks

There's essential data intrinsic to every filesystem:

- The filesystem type (Is it FFS? FAT32?)
- The total number of blocks.
- Block size.
  
There are also elements like file headers, free space, etc we must manage. All this data is stored in what's known as a **superblock**. Each filesystem possesses at least one superblock, and it's feasible to have numerous filesystems on a singular physical disk using partitions. There could be backup superblocks distributed across the disk, furthering reliability.

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





## Data Block Allocation
***

An important decision in file management is how to allocate data blocks to hold a file. 

### Contiguous Allocation

Under this method, files are assigned as a consecutive sequence of blocks. The main advantage here is simplicity. The file header only needs to store the first block's address and the file's size.

When focusing on access in contiguous allocation:

1. Disk Read Requirement: To fetch a specific block, how many disk reads are necessary? Note that one must always be aware of the block number of the relevant file header. 
2. All data fetches from the disk must specify a block number. For instance, one can request "read block 27". However, vague requests like "read the succeeding block" or "read the next file" are not permissible.

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

- Simplicity: The contiguous allocation method is straightforward, which is always a merit in design.
- Sequential Access Speed: Excellent.
- Random Access Speed: Excellent.
- File Growth: One major downside. If you wish to expand a file but another file obstructs its path, reallocation becomes necessary.
- Fragmentation: There's a significant amount of external fragmentation.


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





## Directories
***

A directory is essentially a file that holds a mapping from file names to their corresponding inode numbers. Think of this as an address book where you can look up the address (inode number or `inumber`) for any person (file name).

- Inumber: This is the identifier for the inode and is often referred to as the `inumber`.

- Protection from Tampering: Only the operating system has permission to alter directories for securities and safety.

- User-level Access: While users cannot modify directories, they can read them, which aids in navigation and file retrieval.

- Name Spaces: Directories maintain unique name spaces. This means that within one directory, all file names must be distinctive.


An `inumber` within a directory can point to another directory, not just typical files. To distinguish between the two, the OS designates a special bit in the inode. 

There is always a unique root directory, which acts as the entry point to the entire file system. This root is often identified by `inumber` 0, 1, or 2.

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

### The Current Working Directory (cwd)

Problem: Opening files, especially those nested deep within directories, can be quite read-intensive.

Solution: Use the concept of a Current Working Directory (CWD).

- Relative File Specification: Users can specify files relative to the CWD, which can significantly cut down the number of reads for frequently accessed directories.
  
- Caching the CWD: The OS caches data blocks of the CWD either in the disk cache or in the Process Control Block (PCB). This avoids redundant lookups, speeding up file access.

While we've detailed how to:

1. Find the data blocks of a file given its header.
2. Extend a file, if necessary.
3. Retrieve a file header using a human-readable path.

Users shouldn't need to know or perform any of these steps. The OS masks this complexity, presenting users with a straightforward interface.






## Caching
***

Disk caching drastically improves our interaction speed with the filesystem. Modern operating systems utilize caching extensively.

- **Write-through caching**: Ensures memory is immediately written to the disk, retaining a cached copy for future reads. While it upholds consistency, it's slow due to waiting for the disk's confirmation.
- **Write-back caching**: Delays writing to the disk, storing the changed copy in-memory. It offers superior performance, but there's a risk of losing modified data during crashes.

### UNIX Filesystem Caching

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



## Transactions & Journaling
***

Transactions are a way to group actions, ensuring that:

- **Atomicity**: The bundled operations either fully execute or they don't execute at all.
- **Serializability**: Transactions seem to occur sequentially.
- **Durability**: Once a transaction is finalized, its effects are permanent.

In the transactional process, actions are tentatively applied. If all goes well, we "commit" these actions, making them permanent. If a fault occurs midway, we "rollback" and undo the changes.

### Handling Rollbacks

Directly undoing disk writes (rollback) is tricky. The solution is to use a **transaction log**:

1. **Write-Ahead Logging**: Log each intended operation without immediately executing it.
2. **Commit**: Indicate that the transaction is complete and its effects are now permanent.
3. **Delayed Execution**: At a later time, maybe during a cache flush or an `fsync()` call, execute the logged changes.

### Transparency in Transactions

After committing, even though the new data hasn't been written to disk, it's still considered as the "official" data. This raises the question: How can the system provide access to this data?

A straightforward approach is for the OS to update its disk cache to mirror what the disk would look like post-transaction. If any process tries to access the modified pages between the logging of the COMMIT and the actual disk update, the OS reroutes the request to the in-memory cache.

### Recovery and Partial Transactions

Recovering from incomplete transactions is somewhat similar to the `fsck` process:

1. **Fully Completed Transaction**: If the transaction was concluded and all disk blocks were altered, no further action is needed.
2. **Committed but Unapplied**: If the transaction was committed but the disk blocks weren't updated, replay the transaction to make sure the data aligns.
3. **Aborted Transactions**: If a transaction was aborted and the changes weren't made visible, you can disregard it as if it never occurred.

Thus, transactions and journaling collectively ensure that data remains consistent, even in scenarios with unexpected failures. By logging operations and deferring actual changes, the system can maintain atomicity and durability, while also allowing recovery when things go awry.

### Journaling Filesystems

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

