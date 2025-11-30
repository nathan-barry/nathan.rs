+++
title = "Curserve: Minimizing Agentic Coding End-to-End Latency"
date = 2025-11-09T10:17:51-06:00
tags = ["Research", "Programming"]
+++

For [Cal Hacks 2025](https://calhacks.io), a few friends and I built [Curserve](https://devpost.com/software/curserve), a fast and scalable server-side engine for agentic coding, which ended up placing for one of the sponsor prizes. We didn't go to Cal Hacks to try and win, but instead to have a good excuse to work on a potential research idea.

This post documents our original hackathon project, our exploration into actual research, and our investigations about the potential real-world benefits of such a system.



## Curserve - Our Hackathon Project
---
The original idea came from when we came across Cognition's new [agentic search models](https://cognition.ai/blog/swe-grep), which had substantially higher TPS than off-the-shelf models. SWE-grep-mini can generate 2858 tokens per second, 20x the TPS of Claude Haiku 4.5.

In traditional interactive coding agents like Cursor and Claude Code, generally, the code lives on the client. Thus, every time an agent generates a tool call, it must send that request to the client for it to execute it remotely, and then send all the data back before the server can continue generation for this request.

```
Traditional Architecture:
┌─────────┐                    ┌─────────┐
│ Client  │ ◄─────────────────►│  Server │
│(Laptop) │    Network Calls   │  (LLM)  │
└─────────┘                    └─────────┘
     │
     ▼
  Codebase
(Local Files)
```

As specialized models continue to have higher TPS, our hypothesis was that eventually things such as network latency, subprocess overhead, etc, will stop being negligible to throughput and end-to-end latency.

Thus, we decided to make a new serving architecture where the code was co-located on the server where generation was happening to eliminate this network overhead.

```
Our Architecture:    ┌───────────────────────────────────┐
                     │              Server               │
                     │  ┌─────────┐    ┌──────────────┐  │
                     │  │  vLLM   │───►│  Mem Search  │  │
                     │  │ (Qwen)  │    │    Daemon    │  │
┌─────────┐          │  └─────────┘    └──────────────┘  │
│ Client  │ ───────► │                        │          │
└─────────┘   SSH    │                        ▼          │
                     │                   ┌──────────┐    │
                     │                   │ Codebases│    │
                     │                   │(Memory)  │    │
                     │                   └──────────┘    │
                     └───────────────────────────────────┘
```

We also built a background daemon with tools like `ripgrep` built in and performed on in-memory mapped files to avoid spawning a new process each time an agent wanted to call a tool, eliminating subprocess overhead.

As from our [Devpost](https://devpost.com/software/curserve):

> For those familiar with operating systems concepts, making tool calls (aka creating a new grep, ls, find process) is akin to making a syscall. It forces the currently running process to preempt itself, causing a context switch to a new process flushing the TLB.
>
> We perform interprocess communication (IPC) between our (potentially many) qwen-code-ipc clients and our mem_search_service in order to eliminate process creation overhead associated with each shell command an agent may make. We created a custom daemon (background process) to run on a server.
>
> Our service uses a custom library we created, where we developed pseudo-shell commands that operate directly on memory-mapped files. For the purposes of the hackathon, we implemented ripgrep, one of the more time consuming and frequently used shell commands.

We modified Qwen Code (which is a fork of Gemini CLI) to work with our system. Any AI workflow coding tool can be easily modified to work with our system.

Our system actually worked really well. Our daemon provided a **6-45x speedup** for search over the ripgrep baseline, depending on codebase size and sparsity of query occurrences. Our demo consisted of us running our architecture and the traditional architecture side by side, with a noticeable **~4-5x speedup** (eyeballed, not measured) in end-to-end generation for our version.

All this (plus actually placing for something) gave us hope that this might have had legs for a potential research direction.



## Exploration into Research
---
Our hackathon project gave us a demo with compelling results. After thinking about the best direction to continue this idea into actual research, we decided to make two small changes:

1. The subprocess overhead is negligible. We felt like network latency would dominate and thus threw out the tool daemon for simplicity. 
2. Our system should be transparent. Forcing people to SSH into the server changes the user workflow. Instead, we should have a copy of the codebase on both the client and server and stream changes to each other.

This last change gave a few additional benefits as well. Because there is a copy on the client and the server, we can choose to run whitelisted commands such as `ls`, `cat`, `ripgrep`, etc, on the server, while running arbitrary commands on the client. This reduced the vulnerability surface area of our system. We planned on having a [gVisor](https://github.com/google/gvisor) instance run on the server with a container for each user session for security.


But before we seriously got started, we needed to do Back-of-The-Napkin Math™ to make sure the benefits of our system weren't marginal.

### Numbers, Numbers, Numbers

Below is a list of the TPS and Time-Per-Output-Token (TPOT) for a few popular models (including Cognition's new agentic search models):

Model               | TPS   | TPOT
---                 | ---   | ---
GPT-5 Codex         | 43    | 23.3 ms
Claude Sonnet 4.5   | 69    | 14.5 ms
Claude Haiku 4.5    | 142   | 7.0 ms
SWE-grep            | 682   | 1.5 ms
SWE-grep-mini       | 2858  | 0.35 ms

And here is a list of approximate round-trip latency (RTT) between two datacenters based on location:

Scenario                        | RTT
---                             | ---
Intra-region                    | 1–2 ms
Inter-region, same coast        | 10–20 ms
Inter-region, cross-coast       | 60–80 ms
US ↔ Europe (trans-Atlantic)    | 70–120 ms
US ↔ Asia (trans-Pacific)       | 120–200+ ms

The additional latency when including the client varies widely, but we can assume an additional 20-50 ms to the round trip time.

Our demo did so well partially because the server we were renting from [Vast.ai](https://vast.ai) happened to be located in Taiwan, leading to a potentially 250+ ms round-trip for each tool call. In a more realistic setting, a round-trip call might take an order of magnitude less time. This reduces the real-world benefits of our system, but it still might be significant enough.

### Potential Benefits

The networking overhead seems substantial enough to where it could lead to underutilized resources or force rescheduling of requests in a colocated serving setting when serving small models. Our system could help that and reduce end-to-end latency for individual requests. The latter additionally give us more flexibility with scheduling and can perhaps lead to fewer SLO violations.

With disaggregated prefill decode serving (which I believe is more common), the benefits might be minimal because for each tool call, the KVcache will be moved from the decoding server to the prefill server anyway and be scheduled again (according to my understanding).

All in all, there *might* be something here. It would need to be investigated more thoroughly and better understanding of current serving paradigms are needed.



## Conclusion
---

Alex and I have moved on to other research ideas, but this was an exploration of one which might have some legs. The [Parrot paper](https://arxiv.org/abs/2405.19888v1) from Microsoft, which came out earlier this year, explored something similar (in terms of reducing end-to-end latency for individual requests) and found many benefits to be gained from it.

Hackathons are fun! I highly recommend. I had a great experience at Cal Hacks this year. As for the research direction, it is always insightful to explore new ideas.
