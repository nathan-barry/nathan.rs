+++
title = "Quantum Information Science"
description = "WORK IN PROGRESS. These are my notes over Scott Aaronson's QIS class at UT Austin."
date = 2024-09-02T19:38:23-05:00
tags = ["Computer Science Notes"]
draft = true
+++

{{< toc >}}



<br>

## Lecture 1: Course Intro
---

**Quantum Information Science Overview**:
   - It's an interdisciplinary field involving Physics, Computer Science, Mathematics, Engineering, and Philosophy.
   - Aims to clarify the workings of quantum mechanics and explore what is possible within its framework.
   - Helps deepen our understanding of quantum mechanics.

**Foundational Concepts in Quantum Mechanics**:
   - **Probability**:
     - Probabilities (P ∈ [0,1]) represent uncertainty and follow basic axioms (e.g., mutually exclusive, exhaustive possibilities sum to 1).
   - **Monotonicity**:
     - Classical intuition suggests that more paths increase the likelihood of an event (aka - the probabilities are monotone); quantum mechanics violates this principle.

**Key Physical Principles**:
   - **Locality**:
     - Events or states can only influence their immediate surroundings and propagate at finite speeds, as explained by Einstein’s theory of relativity.
   - **Local Realism**:
     - Suggests instantaneous updates in knowledge (like reading a distant friend’s newspaper headline) are due to pre-existing correlations, not faster-than-light communication.

**Church-Turing Thesis**:
   - States any physical process can be simulated by a Turing machine to any desired precision.
   - **Extended Church-Turing Thesis**:
     - Claims such simulations would only require polynomial increases in computational resources (time, space).

**Quantum Mechanics and Classical Principles**:
   - Quantum mechanics maintains the use of probabilities but alters how they are calculated, violating monotonicity.
   - **Locality** is upheld, but **Local Realism** is not—quantum mechanics demonstrates their subtle difference.
   - The original **Church-Turing Thesis** remains valid, even considering quantum mechanics.
   - However, the **Extended Church-Turing Thesis** is challenged by quantum computing, which suggests more than polynomial resource increases.



<br>

## Lecture 2: Probability Theory and QM
---

**The Double-Slit Experiment**:
   - A fundamental experiment that encapsulates quantum mechanics' core ideas.
   - Photons are fired one at a time at a wall with two slits, and their landing spots on a second wall are probabilistic.
   - Unlike classical systems, the probability of a photon landing at a particular spot when both slits are open, $ P_{\text{both}} $, is not simply $ P_{\text{slit 1}} + P_{\text{slit 2}} $. Even locations never hit with both slits open could be hit when only one slit is open.
        - Suggests that quantum probabilities are not "normal dice"; they involve complex numbers (amplitudes) and interference.
   - If information about which slit the photon went through leaks out in any way, the results go back to looking like they obey classical probability.
        - This reversion to classical probabilities, when systems are coupled to their environments, is called **decoherence.**
        - Quantum superposition only happens to particles when they are isolated from their environment.

**Amplitudes and Interference**:
   - Quantum mechanics uses **amplitudes** instead of probabilities to describe systems. Amplitudes can be positive, negative, or complex numbers.
   - The probability of an outcome is given by the **Born Rule**: the squared absolute value of the amplitude.
   $$P=|\alpha|^2=(\text{the real part of } \alpha)^2 + (\text{the imaginary part of } \alpha)^2$$
   - **Interference**: Amplitudes for different paths can add constructively or destructively, leading to probabilities that defy classical expectations.

**The Electron's Behavior and Energy Levels**:
   - Classical models (like electrons orbiting a nucleus) failed because they implied energy loss and collapse into the nucleus.
   - Quantum mechanics resolves this by using amplitudes that can cancel out, leading to discrete energy levels where electrons "sit," forming the basis of chemistry.

**Mathematical Modeling in Quantum Mechanics**:
   - Quantum states are modeled as vectors in linear algebra, and their evolution as vector transformations.
   - Classical probability can also be modeled using vectors and **stochastic matrices** (where entries are non-negative and columns sum to 1).

**Tensor Products and Correlations**:
   - To model combined systems (like two bits or two particles), we use the **tensor product**.
   - Not all vectors can arise from tensor products; some distributions are **correlated** (like with the **Controlled NOT (CNOT) matrix** in quantum computing, which can create correlations).



<br>

## Lecture 3: Basic Rules of QM
---

**Tensor Products**:
   - A way to build larger vectors (quantum states) from smaller ones.
   - Used to model combined quantum systems (e.g., two qubits).

**Quantum States and Ket Notation**:
   - A **quantum state** (or "pure state") is a **unit vector** that describes the state of a quantum system.
   - **Ket notation** (e.g., $ |0\rangle $, $ |1\rangle $) is used to represent quantum states; it is particularly useful for representing sparse vectors.
   - **Dirac Notation**: $ |\psi\rangle $ (ket) for vectors and $ \langle\phi| $ (bra) for dual vectors; the inner product is written as $ \langle\phi|\psi\rangle $.

**Discrete vs. Continuous States**:
   - Quantum mechanics suggests a hybrid picture: while quantum states are continuous, measurement outcomes are discrete.
   - A qubit, the simplest quantum system, has two levels (0 and 1) and is represented by amplitudes for these states.

**Amplitudes and Probabilities**:
   - A qubit's state is defined by a combination of amplitudes (complex numbers), where the squared magnitudes $ |\alpha|^2 $ give the probabilities of measuring different outcomes.
   - The amplitudes can interfere constructively or destructively, leading to different probabilities than in classical systems.

**Bra-Ket Notation**:
   - **Bra ($\langle\phi|$)** is the conjugate transpose of the ket ($|\psi\rangle$).
   - The **inner product** of two states $ |\psi\rangle $ and $ |\phi\rangle $ is $ \langle\phi|\psi\rangle $, a key concept for measuring overlaps between quantum states.

**Unitary Transformations**:
   - **Unitary matrices** represent quantum state changes that preserve norms and inner products.
   - A matrix $ U $ is **unitary** if $ U^\dagger U = I $, where $ U^\dagger $ is the conjugate transpose of $ U $.
   - Unitary matrices are characterized by orthogonal unit basis rows and columns.

**Examples of Unitary Matrices**:
   - **Identity Matrix**: Does nothing to the state.
   - **Pauli Matrices**: Simple unitary operations like flips and rotations (e.g., $ X $ (NOT gate), $ Y $, $ Z $).
   - **Phase Shift Gates**: E.g., a gate that maps $ |1\rangle $ to $ i|1\rangle $.

**Euler’s Equation**:
   - $ e^{i\theta} = \cos(\theta) + i\sin(\theta) $; relates complex exponentials to rotations.

**Quantum State Transformations and Measurement**:
   - **Global Phase**: Overall phase of a quantum state is unobservable (e.g., multiplying the state by a scalar phase factor).
   - **Relative Phase**: Observable and affects interference patterns.
   - **Measurement**: Collapses the quantum state into one of the possible discrete outcomes; no second chances for re-measurement.

**Interference in Quantum Mechanics**:
- Quantum states can interfere **constructively** or **destructively** depending on their relative phases.
- Constructive interference increases the probability of certain outcomes, while destructive interference reduces it.

**Unitary Transformations and Interference**:
- The outcome of a quantum state can depend on its history of transformations.
- Certain states can cancel each other out (destructive interference) or reinforce each other (constructive interference), depending on their amplitudes.

**Orthogonal and Unitary Matrices**:
- An **orthogonal matrix** is a real unitary matrix, preserving length (norm) and angles.
- Any orthogonal matrix can be decomposed into rotations and reflections.
