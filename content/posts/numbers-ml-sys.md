+++
title = "Numbers Everyone Should Know (ML Systems Edition)"
date = 2025-11-09T09:41:45-06:00
tags = ["Machine Learning"]
draft = true
+++

> This post takes inspiration from Jeff Dean's ["Numbers Everyone Should Know"](https://brenocon.com/dean_perf.html). Thank you to [Alex Kranias](https://alexkranias.com) for giving me the post idea.



## 1. GPU Generational Landscape (A100 → H100 → B100/B200)

High-level differences across generations:

GPU         | Architecture  | Peak Memory BW    | FP16 Performance  | FP8 Performance   | FP4 Performance | Source
---         | ---           | ---               | ---               | ---               | --- | ---
A100 80GB   | Ampere        | 2.0 TB/s          | 312 TFLOPS        | -                 | - | [NVIDIA A100 Datasheet](https://www.nvidia.com/en-us/data-center/a100/)
H100 SXM5   | Hopper        | 3.0 TB/s          | 1,000 TFLOPS      | 2 PFLOPS          | - | [NVIDIA H100 Datasheet](https://www.nvidia.com/en-us/data-center/h100/)
B100        | Blackwell     | 8.0 TB/s          | 1,750 TFLOPS      | 4.5 PFLOPS        | 9 PFLOPS | [SemiAnalysis](https://semianalysis.com/2024/04/10/nvidia-blackwell-perf-tco-analysis/)
B200        | Blackwell     | 8.0 TB/s          | 2,250 TFLOPS      | 4.5 PFLOPS        | 9 PFLOPS | [SemiAnalysis](https://semianalysis.com/2024/04/10/nvidia-blackwell-perf-tco-analysis/)



## 2. Memory Access Latency (A100 → H100)

Latency order of magnitude (ns = nanoseconds):

Memory Level    | A100          | H100 (SXM)    | Source
---             | ---           | ---           | ---
Register        | ~0.7 ns       | ~0.7 ns       | [NVIDIA Ampere Whitepaper](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf)
Shared Memory   | ~20–25 ns     | ~11–17 ns     | [NVIDIA Ampere Architecture](https://developer.nvidia.com/blog/nvidia-ampere-architecture-in-depth/), [Hopper Architecture](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)
L1 Cache        | ~22–26 ns     | ~16–19 ns     | [NVIDIA Ampere Tuning Guide](https://docs.nvidia.com/cuda/ampere-tuning-guide/index.html), [Hopper Tuning Guide](https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html)
L2 Cache        | ~142–284 ns   | ~86–173 ns    | [NVIDIA Ampere Whitepaper](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf), [Hopper Architecture](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)
HBM             | ~234–259 ns   | ~177–200 ns   | [NVIDIA Ampere Whitepaper](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf), [H100 Datasheet](https://www.nvidia.com/en-us/data-center/h100/)


### GPU Memory Bandwidth (GB/s)

| GPU | Memory Type | Theoretical (GB/s) | Achieved (GB/s) | Source |
|---|---|---|---|---|
| H100 SXM5 | HBM3 | 3,000 | 2,550-2,850 | [NVIDIA H100 Datasheet](https://www.nvidia.com/en-us/data-center/h100/), [NVIDIA Hopper Architecture](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/) |
| H100 PCIe | HBM2e | 2,000 | 1,700-1,900 | [NVIDIA H100 Datasheet](https://www.nvidia.com/en-us/data-center/h100/) |
| A100 80GB | HBM2e | 2,039 | 1,900-1,950 | [NVIDIA A100 Datasheet](https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/a100/pdf/nvidia-a100-datasheet-nvidia-us-2188504-web.pdf), [NVIDIA Ampere Whitepaper](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf) |
| A100 40GB | HBM2 | 1,555 | 1,450-1,500 | [NVIDIA A100 Datasheet](https://www.nvidia.com/en-us/data-center/a100/) |
| B100 | HBM3e | 8,000 | TBD | [CUDO Blackwell](https://www.cudocompute.com/blog/nvidias-blackwell-architecture-breaking-down-the-b100-b200-and-gb200) |
| B200 | HBM3e | 8,000 | TBD | [Civo B200 vs H100](https://www.civo.com/blog/comparing-nvidia-b200-and-h100) |
| DDR5-6400 dual-channel | DDR5 | 102.4 | ~95 | [DDR5 Bandwidth Guide](https://www.servethehome.com/guide-ddr-ddr2-ddr3-ddr4-and-ddr5-bandwidth-by-generation/) |

**Note:** B100/B200 achieve 2.67× higher theoretical bandwidth than H100 SXM5 (8 TB/s vs 3 TB/s). Real-world achieved bandwidth measurements pending.


## 3. GPU Interconnect vs PCIe

Connection                  | Bandwidth (GB/s)  | Latency       | Source
--- | --- | --- | ---
**NVLink 3 (A100)**         | ~600              | ~2–3 µs       | [NVIDIA Ampere Whitepaper](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf)
**NVLink 4 (H100)**         | ~900              | ~2–3 µs       | [NVIDIA Hopper Architecture](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)
**NVLink 5 (B100/B200)**    | ~1,800            | ~2 µs (est.)  | [CUDO Blackwell](https://www.cudocompute.com/blog/nvidias-blackwell-architecture-breaking-down-the-b100-b200-and-gb200)
**PCIe 4.0 x16**            | ~25–28            | ~900 ns–1 µs  | [PCIe 4.0 Specs](https://www.trentonsystems.com/en-us/resource-hub/blog/pcie-gen-4-reference-guide)


### GPU-GPU Interconnect Latency

| Interconnect | Latency | Source |
|---|---|---|
| NVLink 4.0 (H100) | 2-3 μs | [NVIDIA H100 Datasheet](https://www.nvidia.com/en-us/data-center/h100/) |
| NVLink 3.0 (A100) | 2-3 μs | [DGX A100 Review](https://www.microway.com/hpc-tech-tips/dgx-a100-review-throughput-and-hardware-summary/) |
| InfiniBand HDR (200G) | 1-5 μs | [InfiniBand HDR Guide](https://community.fs.com/article/exploring-infiniband-network-hdr-and-significance-of-ib-applications-in-supercomputing.html) |
| GPU Direct RDMA | 2-5 μs | [DGX A100 Review](https://www.microway.com/hpc-tech-tips/dgx-a100-review-throughput-and-hardware-summary/) |

### GPU-GPU Interconnect Bandwidth (GB/s)

| GPU | NVLink Generation | Theoretical (GB/s) | Achieved (GB/s) | Source |
|---|---|---|---|---|
| H100 | NVLink 4.0 bidirectional | 900 | 400-450 (point-to-point) | [NVIDIA Hopper Architecture](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/), [NVLink Evolution](https://www.fibermall.com/blog/nvidia-nvlink-and-nvswitch-evolution.htm) |
| A100 | NVLink 3.0 bidirectional | 600 | 247-262 (point-to-point) | [NVIDIA Ampere Whitepaper](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf), [NCCL Tests GitHub](https://github.com/NVIDIA/nccl-tests/issues/149) |
| B100 | NVLink 5.0 bidirectional | 1,800 | TBD | [CUDO Blackwell](https://www.cudocompute.com/blog/nvidias-blackwell-architecture-breaking-down-the-b100-b200-and-gb200) |
| B200 | NVLink 5.0 bidirectional | 1,800 | TBD | [Civo B200 vs H100](https://www.civo.com/blog/comparing-nvidia-b200-and-h100) |
| InfiniBand HDR (per direction) | - | 25 | 23-24 | [InfiniBand HDR Whitepaper](https://network.nvidia.com/files/doc-2020/wp-introducing-200g-hdr-infiniband-solutions.pdf) |
| InfiniBand NDR (per direction) | - | 50 | 47-49 | [NVIDIA NDR Announcement](https://www.servethehome.com/nvidia-mellanox-ndr-400gbps-infiniband-announced/) |

**Note:** B100/B200 NVLink 5.0 delivers 2× the bandwidth of H100's NVLink 4.0 (1,800 GB/s vs 900 GB/s bidirectional per GPU).

### GPU-GPU Transfer Time (1 GB)

| Connection | Time | Source |
|---|---|---|
| H100 NVLink 4.0 | ~2.2 ms | [NVLink Wikipedia](https://en.wikipedia.org/wiki/NVLink) |
| A100 NVLink 3.0 | 3.3-4.0 ms | [DGX A100 Review](https://www.microway.com/hpc-tech-tips/dgx-a100-review-throughput-and-hardware-summary/) |
| InfiniBand NDR | ~20 ms | [NVIDIA NDR Announcement](https://www.servethehome.com/nvidia-mellanox-ndr-400gbps-infiniband-announced/) |
| InfiniBand HDR | ~40 ms | [InfiniBand HDR Whitepaper](https://network.nvidia.com/files/doc-2020/wp-introducing-200g-hdr-infiniband-solutions.pdf) |



## 4. CPU ↔ GPU Transfer Reality

Moving **1 GB of data CPU → GPU**:

Link            | Pinned Memory Transfer Time   | Source
---             | ---                           | ---
PCIe 4.0 x16    | **~36–40 ms**                 | [NVIDIA CUDA Optimization](https://developer.nvidia.com/blog/how-optimize-data-transfers-cuda-cc/)
PCIe 5.0 x16    | **~17–20 ms**                 | [PCIe 5.0 Guide](https://www.trentonsystems.com/en-us/resource-hub/blog/what-is-pcie-5.0)



## 5. Real Inference Numbers (Latency + Throughput)

Model           | Hardware              | Approx Time/Token     | Source
---             | ---                   | ---                   | ---
Llama 2 70B     | 8×H100 (FP8)          | **~13.3 ms/token**    | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html)
Llama 3.3 70B   | H100 (FP8, TP=2)      | **~0.164 ms/token**   | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html)
Llama 3 8B      | H100 (FP8, optimized) | **~0.037 ms/token**   | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html)

Throughput example:

Model         | Hardware          | Tokens/sec        | Source
--- | --- | --- | --- |
Llama 3 8B    | H100 (FP8)        | **~27,027 tok/s** | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html)
Llama 3.3 70B | H100 (FP8, TP=2)  | **~6,092 tok/s**  | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html)

| Model | Hardware | Batch Size | Time/Token (ms) | Source |
|---|---|---|---|---|
| Llama 2 70B | 8×H100 (FP8) | 1 | 13.3 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |
| Llama 3 8B | H100 (FP8) | Optimized | 0.037 | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html) |
| Llama 3.3 70B | H100 (FP8, TP=2) | Optimized | 0.164 | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html) |
| GPT-J 6B | H100 (FP8) | 1 | 5.4 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |
| GPT-J 6B | H100 (FP8) | 64 | 0.092 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |

## LLM Inference Throughput (tokens/sec)

| Model | Hardware | Throughput | Source |
|---|---|---|---|
| Llama 3 8B | H100 (FP8) | 27,027 | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html) |
| Llama 3.3 70B | H100 (FP8, TP=2) | 6,092 | [TensorRT-LLM Performance](https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html) |
| Llama 3.1 8B | A100 (vLLM) | 2,600 | [vLLM v0.6.0 Blog](https://blog.vllm.ai/2024/09/05/perf-update.html) |
| GPT-J 6B | H100 (FP8, batch 64) | 10,907 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |

## LLM First Token Latency (milliseconds)

| Model | Hardware | Context Length | Latency (ms) | Source |
|---|---|---|---|---|
| Llama 2 70B | 8×H100 (FP8) | 2048 | 100-200 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |
| GPT-J 6B | H100 (FP8, batch 1) | - | 7.1 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |
| GPT-J 6B | H100 (FP8, batch 64) | - | 102 | [TensorRT-LLM H100 vs A100](https://nvidia.github.io/TensorRT-LLM/blogs/H100vsA100.html) |



## 6. Model Load Time (from NVMe)

Loading **100 GB model weights**:

Storage             | Load Time      | Source
--- | --- | ---
PCIe 4.0 NVMe → RAM | **~14–20 sec** | [Samsung PCIe Guide](https://insights.samsung.com/2024/03/07/what-is-pcie-gen-4-for-ssds-and-how-does-it-compare-to-gen-3-and-gen-5/)
PCIe 5.0 NVMe → RAM | **~8–12 sec**  | [Samsung PCIe Guide](https://insights.samsung.com/2024/03/07/what-is-pcie-gen-4-for-ssds-and-how-does-it-compare-to-gen-3-and-gen-5/)


| Source | Time | Source |
|---|---|---|
| PCIe 4.0 NVMe to CPU RAM | 14-20 seconds | [Samsung PCIe Guide](https://insights.samsung.com/2024/03/07/what-is-pcie-gen-4-for-ssds-and-how-does-it-compare-to-gen-3-and-gen-5/) |
| PCIe 5.0 NVMe to CPU RAM | 8-12 seconds | [Samsung PCIe Guide](https://insights.samsung.com/2024/03/07/what-is-pcie-gen-4-for-ssds-and-how-does-it-compare-to-gen-3-and-gen-5/) |
| CPU RAM to GPU HBM (PCIe 4.0) | 2-3 seconds | [NVIDIA CUDA Optimization](https://developer.nvidia.com/blog/how-optimize-data-transfers-cuda-cc/) |
| InfiniBand HDR | ~4 seconds | [InfiniBand HDR Whitepaper](https://network.nvidia.com/files/doc-2020/wp-introducing-200g-hdr-infiniband-solutions.pdf) |
| InfiniBand NDR | ~2 seconds | [NVIDIA NDR Announcement](https://www.servethehome.com/nvidia-mellanox-ndr-400gbps-infiniband-announced/) |
