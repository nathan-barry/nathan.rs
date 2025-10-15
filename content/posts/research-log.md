+++
title = "Research Log"
date = 2025-10-14T10:54:27-05:00
tags = ["Machine Learning"]
+++
{{< katex >}}{{< /katex >}}

> I will write what I learn every day to this page.

## Day 0: DiLoCo Days
It is October 15th, 2025. For my last year of my master's, I decided to a thesis around distributed low-communication training. Essentially, how can we train large models efficiently across distributed nodes and not be utterly destroyed by network latency and bandwidth?

The main approach currently is Local SGD, where we have $M$ distributed workers (which consist of one or more nodes) that each take $H$ local optimization steps. After each worker finishes their $H$ steps, we take the average of the distance of each worker's ending parameter state from their starting parameter state to get what we call an *outer-gradient* or a *pseudo-gradient*. We update the original weights with the outer-gradient using an outer-optimizer. 

Below is the algorithm in pseudo-code.

``` python
# Require: Initial model 𝜃(0)
# Require: k workers
# Require: Data shards {D1,...,Dk}
# Require: Optimizers InnerOpt and OuterOpt
for outer_step t = 1...T:
    for worker i = 1...k: # In parallel
        𝜃_i(t) = 𝜃(t−1)
        for inner_step h = 1...H:
            x = get_batch(D_i)
            loss = f(x, 𝜃_i(t))
            𝜃_i(t) = InnerOpt(𝜃_i(t), ∇loss) # Inner optimization

    # Averaging outer gradients
    Δ(t) = (1/k) * sum([𝜃(t−1) - 𝜃_i(t) for 𝜃_i(t) in workers.params])
    𝜃(t)  = OuterOpt(𝜃(t-1), Δ(t)) # Outer optimization
```

Some core papers about Local SGD are:
- DiLoCo: Distributed Low-Communication Training of Language Models
- Communication-Efficient Learning of Deep Networks from Decentralized Data

Some relevant papers building upon DiLoCo to improve and scale it are:
- OpenDiLoCo: An Open-Source Framework for Globally Distributed Low-Communication Training
- Overlap Local-SGD: An Algorithmic Approach to Hide Communication Delays in Distributed SGD
- Asynchronous Local-SGD Training for Language Modeling
- HALoS: Hierarchical Asynchronous Local SGD over Slow Networks for Geo-Distributed Large Language Model Training
- Streaming DiLoCo with overlapping communication: Towards a Distributed Free Lunch
- Eager Updates For Overlapped Communication and Computation in DiLoCo
- DiLoCoX: A Low-Communication Large-Scale Training Framework for Decentralized Cluster

### Research Directions

There are many potential research directions I've thought of. The easiest to test and most useful is:

1. Study the impact of heterogeneous workers.

The Async Local SGD paper (referred to as Async DiLoCo by the [author](https://arthurdouillard.com/research/)) tested giving each workers a different number of inner steps to process based on relative processing speed. If worker 1 has $H_1=100$ and worker 2 is half as fast, we give them half as many steps ($H_2=50$) so that they both finish around the same time.

This idea is very simple and makes sense, but it is completely non-trivial on how this impact convergence. The best comparison is, imagine we are doing Distributed Data Parallel training (DDP), but each worker has a different learning rate? In both cases, the magnitudes of the gradient (and pseudo-gradient) we are averaging over are different between each worker. This seems like it fundamentally changes training behavior.

From empirical experiments, it seems like models are generally robust to it, but a rigorous study over this would be useful, especially if we are choosing to dynamically change worker inner steps during training.

2. See if parameter drift is the main explanation of convergence degradation.

Each variant of DiLoCo which tries to mask communication cost suffers some kind of staleness as a result. Each variant is different but parameter drift, the distance from the parameter state of where a gradient was applied to the parameter state where it was originally calculated, might be a good general way to describe staleness.

Each of these variants suffer from a different amount of decreased convergence performance, and I have a hunch that parameter drift might be an important metric correlated with this.

I have more ideas, but these are two good ones I will start investigating.
