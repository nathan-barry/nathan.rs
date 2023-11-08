+++
title = "Turing Machines & Church-Turing Thesis"
date = 2023-11-07T11:10:16-06:00
tags = ["Algorithms Notes"]
+++

{{< toc >}}



## Turing Machines
***

Turing machines are theoretical constructs in computer science that represent the foundational concept of computation. It consists of a tape divided into cells, each of which may contain a symbol. This tape can be of infinite length, and the symbols are drawn from a finite alphabet. The machine has a head that reads and writes symbols on the tape and moves either to the left or right at each step. It operates based on a set of rules defined by a state table, which dictates what action the machine should take, depending on the current state and the symbol it reads.

### Categories of Turing Machine Executions

When a Turing machine *M* is executed with a given input string *w*, several things can occur:

1. **Proper Termination with Output**: The machine stops after a finite number of steps and yields an output string or bit. This is the typical scenario we expect if *M* solves a decision problem, producing either a 1 (yes) or a 0 (no).

2. **Improper Termination**: The machine may also halt improperly, such as moving the read-write head off the left end of the tape.

3. **Infinite Execution**: Sometimes, a Turing machine might not terminate at all, entering what is called an "infinite loop."


### Turing-Computable Functions

A Turing machine *M* is said to compute a function $ f $ mapping strings from $\Sigma^\*$ to $\Sigma^\*$, where $\Sigma$ is the set of all non-blank symbols available to *M*. In practical terms, if you give *M* any string *w* from $\Sigma^\*$, and *M* halts with the output $ f(w) $, then *M* is a computational representation of the function $ f $.

#### Turing-Decidability

A language *L* is considered decidable by a Turing machine *M* if:

- For any input string *w* in *L*, *M* terminates properly and outputs 1.
- For any input string *w* not in *L*, *M* terminates properly and outputs 0.

Decidability is a crucial concept in computational theory, as it assures that the machine will always reach a definitive conclusion for membership of any string in *L*.

#### Turing-Acceptability

A language *L* is Turing-acceptable if a machine *M* satisfies the following:

- If *w* is in *L*, *M* halts on input *w*.
- If *w* is not in *L*, *M* does not halt on input *w*.

It's important to note that while all decidable languages are acceptable, not all acceptable languages are decidable.



## Church-Turing Thesis
***

The Church-Turing thesis is a philosophical assertion that frames our understanding of computational theory. It suggests that any function which can be "effectively" or "feasibly" computed can also be computed by a Turing machine. Let's break down this fundamental idea.

1. **Turing Machine vs. Sequential RAM Model**: A Turing machine is capable of simulating any algorithm that runs on the more practical Random Access Machine (RAM) model, which is closer to how real-world computers operate. The simulation is surprisingly efficient—only polynomially slower than the RAM algorithm itself.

2. **Beyond Determinism**: When considering models that utilize randomness (probabilistic algorithms) or even quantum mechanics (quantum computation), Turing machines can still simulate these models. However, the simulation might come with a significant cost—an exponential slowdown. Whether this exponential increase in computation time is a fundamental requirement remains an open question in theoretical computer science.

### Complexity-Theoretic Church-Turing Thesis

The Complexity-Theoretic Church-Turing Thesis takes the original thesis one step further:

1. **Feasible Computation**: This enhanced thesis suggests that not only can a Turing machine compute any computable function, but it can also simulate any "feasible" (practically computable) model within a reasonable amount of time—specifically, with only a polynomial slowdown.

2. **Classical vs. Non-Classical Computation**: For classical computation (excluding quantum effects), this thesis appears to hold true. The landscape becomes much more complex when considering probabilistic and quantum models. It is still an open problem whether these non-deterministic models can be efficiently simulated by Turing machines.

3. **Randomized and Quantum Classes**: To explore this topic further, one might study complexity classes such as BPP (bounded-error probabilistic polynomial time), which deals with randomized algorithms, and BQP (bounded-error quantum polynomial time), which concerns quantum algorithms. These classes capture the essence of problems that can be efficiently solved using randomness and quantum effects, respectively.



## Turing Machines as Strings
***

Turning Machines can be represented by a string of 1s and 0s.

- **Binary Encodings**: Every Turing machine can be encoded as a finite binary string. Hence, the set of all Turing machines is a subset of $ \\{0, 1\\}^* $, the set of all binary strings.

- **Countable Collection**: Since the binary strings form a countably infinite set, and Turing machines are encoded as such strings, it follows that the collection of all Turing machines is also countably infinite.

### The Existence of More Languages than Turing Machines

While every Turing machine can be uniquely encoded as a binary string and thus the set of all Turing machines is countably infinite, languages correspond to all possible subsets of strings which can be formed, leading to the powerset of an infinite set. 

The powerset of a countably infinite set is uncountably infinite, which can be shown via Cantor's diagonal argument. This demonstrates that there are indeed more languages than there are Turing machines, resulting in the existence of undecidable languages.

#### Countability: A Measure of Infinity

- **Countably Infinite Sets**: A set is countably infinite if its elements can be listed in an endless sequence where each element can be matched with a unique nonnegative integer from the set $ \mathbb{N} $.

- **Countable vs. Uncountable**: If an infinite set cannot be arranged in such a sequence, meaning it cannot be paired one-to-one with the set of nonnegative integers, it is uncountable.

#### Decidable vs. Undecidable: The Implications

- **Decidable Languages**: Since a Turing machine can decide at most one language and the number of Turing machines is countably infinite, the number of decidable languages is also countably infinite.

- **A Sea of Undecidables**: Given that the number of languages is uncountably infinite, it follows that an uncountable number of languages must be undecidable—far beyond the reach of any Turing machine.



## Universal Turing Machines
***

Turing machines can be uniquely represented as strings over some alphabet $ \Sigma $, typically chosen to be {0, 1} for binary encoding:

1. **Encoding**: Any given Turing machine *M* can be encoded as a string $ \alpha $ over $ \Sigma $. The Turing machine corresponding to $ \alpha $ is denoted by $ TM_\alpha $. If $ \alpha $ is a valid encoding of a Turing machine, $ TM_\alpha $ is just *M* itself. If $ \alpha $ is not valid, we default $ TM_\alpha $ to a predefined behavior, such as moving the read-write head left.

2. **Universality**: A Universal Turing Machine (UTM) is capable of simulating any other Turing machine. Given a pair $ (\alpha, w) $, where $ \alpha $ is the encoding of a Turing machine and $ w $ is an input string, the UTM simulates $ TM_\alpha $ running with input $ w $. Constructing a UTM is possible because any algorithm, including the UTM's simulation algorithm, can be encoded and run on a Turing machine.









