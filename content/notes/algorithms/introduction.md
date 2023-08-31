+++
title = "What is an Algorithm?"
description = "An introduction to algorithms and how to describe them."
date = 2023-08-27T15:11:32-05:00
tags = ["Algorithms"]
status = "Work In Progress"
+++

{{< toc >}}



## What is an Algorithm?
***

> An algorithm is an explicit, precise, unambiguous, mechanically-executable sequence of elementary instructions, usually intended to accomplish a specific purpose

An interesting note is that the author considers that any algorithm must be completely unambiguous. He gave an example of <cite>"Martin's algorithm"[^1]</cite> which happened to be:


[^1]: Steve Martin, "You Can Be A Millionaire", Saturday Night Live, January 21 1978.

```python
def be_a_millionaire_and_never_pay_taxes():
    get_a_million_dollars():
    if tax_man_asks_for_money:
        print("I forgot")
```

The example above is too vague to be an algorithm because `get_a_million_dollars()` doesn't specify how to do complete that task.



## Describing Algorithms
***
> A complete description of any algorithm has four components:
- **What:** A precise specification of the problem that the algorithm solves.
- **How:** A precise description of the algorithm itself.
- **Why:** A proof that the algorithm solves the problem it is supposed to solve.
- **How Fast:** An analysis of the running time of the algorithm.

One should write as if their target audience is themselves 6 months ago. Our primary jobs is to teach others how and why our algorithms work. Our secondary goal is to produce correct and efficient executable code.

### Specifying the Problem
We must restate the problem in terms of formal, abstract, mathematical objects (numbers, arrays, trees, etc) that we can reason about formally. We must also determine if the problem carries any hidden assumptions, like whether the input or output should always be non-negative number. 

Usually we need to refine out specifications as we develop an algorithm. Sometimes, our algorithm might actually solve a more general problem than we were originally asked to solve.

> The specification should include just enough detail that someone else could use our algorithm as a black box, without knowing how or why the algorithm works. In particular, we must describe the type and meaning of each input parameter, and exactly how the eventual output depends on the input parameters.



<br>
