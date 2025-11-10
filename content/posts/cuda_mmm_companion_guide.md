+++
title = "How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Companion Guide"
date = 2025-11-10T06:12:44-06:00
tags = ["Programming"]
draft = true
+++
{{< katex >}}{{< /katex >}}

[Simon Boehm]() made this excellent introductory [post](https://siboehm.com/articles/22/CUDA-MMM) about CUDA optimization, going from a basic matmul implementation to a highly optimized one. As great as the post is, as someone who was completely new to CUDA, some parts left me scratching my head. This post serves as a companion guide, going into more detail over some of the more conceptual and foundational parts.


## Kernel 0: Preliminaries

### CPU implemenation

### Most Naive implementation

- Draw it my way

When I first come across naive implementations, normally they look like this:

```c
__global__ void sgemm_naive(int M, int N, int K, float alpha, const float *A,
                            const float *B, float beta, float *C) {
  // compute position in C that this thread is responsible for
  const uint col = blockIdx.x * blockDim.x + threadIdx.x;
  const uint row = blockIdx.y * blockDim.y + threadIdx.y;

  // `if` condition is necessary for when M or N aren't multiples of 32.
  if (row < M && col < N) {
    float tmp = 0.0;
    for (int i = 0; i < K; ++i) {
      tmp += A[row * K + i] * B[i * N + col];
    }
    // C = α*(A@B)+β*C
    C[row * N + col] = alpha * tmp + beta * C[row * N + col];
  }
}
```

We can see that this matches this image below:

- IMAGE HERE

### Thread Space vs Memory Space

### Thread ID

## Kernel 1: Naive Implementation


A keen eye would spot that Simon's implementation is actually slightly different. After renaming the x and y variables to `col` and `row`, it looks like this:

```c
__global__ void sgemm_naive(int M, int N, int K, float alpha, const float *A,
                            const float *B, float beta, float *C) {
  // compute position in C that this thread is responsible for
  const uint col = blockIdx.x * blockDim.x + threadIdx.x;
  const uint row = blockIdx.y * blockDim.y + threadIdx.y;

  // `if` condition is necessary for when M or N aren't multiples of 32.
  if (col < M && row < N) {
    float tmp = 0.0;
    for (int i = 0; i < K; ++i) {
      tmp += A[col * K + i] * B[i * N + row];
    }
    // C = α*(A@B)+β*C
    C[col * N + row] = alpha * tmp + beta * C[col * N + row];
  }
}
```

We can see that all the appearences of `col` and `row` have been swapped! And additionally:

```c
// create as many blocks as necessary to map all of C
dim3 gridDim(CEIL_DIV(M, 32), CEIL_DIV(N, 32), 1);
// 32 * 32 = 1024 thread per block
dim3 blockDim(32, 32, 1);
```

Here, we can see that the first item in gridDim is the ceiling of `M`, the number of rows of $C$, and the second item is the ceiling of `N`, the number of columns of $C$.

Thus, `blockDim.x` is actually over the range of $C$'s rows and `blockDim.y` is going over the range of $C$'s columns.

What does this actually mean? 

This is where I would like to come up with what I call "thread space" and "memory space".

### Thread Space vs Memory Space

- Write how one just needs to map to the other, they don't need to look the same at all. Here the threadspace is the transposed version of the memory space.

### Memory Access Pattern of the Naive Kernel

- Why switch row and column? What how does each impact memory accesses? What is up with this "tensor space" and "memory space" discrepancy?


## Kernel 2: Global Memory Coalescing

- Show animation

- Why'd he flatten the block?

## Kernel 3: Shared Memory Cache-Blocking

- Show animation on how this is better than the last one, memory reuse
- Emphasize that the logic works because A, B, and C are being updated to point at the new block location
- Emphasize that the kernel is from a per thread perspective, so each thread has their own tmp that they are accumulating in a register
- Elaborate on occupancy, min(reg_count, warp_count, SMEM_cap)
- Super interesting that that we have much more reg space than shared memory space, and the way to optimize kernel 3 is by having each thread compute more than 1 element to use more reg space instead of SMEM. But how does it use less SMEM?
    - Actually, we are limited by register memory, we need to be more efficient with our reg space.
    - Actually, I think that although our reg space limits us to using 1 block per SM, it is the memory access to SMEM which is killing us.


## Kernel 4: 1D Blocktiling for Calculating Multiple Results per Thread

- Why does it go from 2*32*32*4B=8KB SMEM to BM*BK + BN*BK = 64*8 + 64*8 = 1024 floats, for a total of 4KB per block
- For arithmetic intensity, how far can you push it? Why not 16 results per thread?

## Kernel 5: Increasing Arithmetic Intensity via 2D Blocktiling

## Kernel 6: Vectorize SMEM and GMEM Accesses

## Kernel 9: Autotuning

## Kernel 11: WIP

## Side Notes
Simon's blog post is called,

"How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog".

My original name for this post was the tongue in cheek,

"How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog: a Worklog"
