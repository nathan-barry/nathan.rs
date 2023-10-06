+++
title = "Filesystem Layout, Caching, & Recovery"
date = 2023-09-16T13:43:34-05:00
tags = ["Operating Systems Notes"]
priority = 15
+++

{{< toc >}}



## Filesystem Intro
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

