+++
title = "Gödel Escher Bach, Self-Reference, and Transformers"
description = "A Brief Journey Through Gödel's Incompleteness Theorem, Strange Loops, the Nature of Intelligence, and Transformer Langauge Models."
date = 2023-08-15
tags = ["Writings"]
+++

{{< toc >}}



## Growing Up 
***

When I was in high school, I was absolutely fascinated with AI. I spent all of my time free time investigating different kinds of machine learning model architectures and the rate fields like computer vision and natural language processing were progressing. I don’t know what started the fascination, but what fueled it was Ray Kurzweil, Lex Fridman, Andrew Ng, Nick Bostrom, and all others that produced books, online courses, and ideas on the matter.

I first got started around the time OpenAI’s GPT-2 was released and remember people’s sentiments at the time. {{% sidenote %}}I remember specifically trying to fine-tune GPT-2 on my journal entrees. Having a machine try and model "me" was what first intrigued me.{{% /sidenote %}} Most people thought that something as capable as GPT-4 wasn’t going to happen within the next two decades. And yet, here we are.


In the worlds of artificial intelligence and machine learning, the scope of what is possible continues to expand. State-of-the-art large language models (LLMs) have already demonstrated remarkable capabilities in terms of learning from input and generating relevant output, but they still seem to be missing something to make them truly “alive”



## Gödel Escher Bach and Strange Loops
***

Not too long ago, I was recommended the book "Gödel, Escher, Bach" by Douglas Hofstadter. The book, at its core, is about how intelligent systems arise out of nothing, or in the words of the author,

> "GEB was inspired by my long-held conviction that the "strange loop" notion holds the key to unraveling the mystery that we conscious beings call "being" or "consciousness.""

Below is one of the main subjects of the book:

> "The Godelian strange loop that arises in formal systems in mathematics (i.e., collections of rules for churning out an endless series of mathematical truths solely by mechanical symbol-shunting without any regard to meanings or ideas hidden in the shapes being manipulated) is a loop that allows such a system to "perceive itself", to talk about itself, to become "self-aware", and in a sense it would not be going too far to say that by virtue of having such a loop, a formal system acquires a self."

This Godelian strange loop he is referring to is Godel’s incompleteness theorem, which uses self-referencing meta-mathematical statements to prove that within any consistent formal system that is capable of arithmetic, there will be true statements that cannot be proved within the system. These theorems bring to light the inherent limitations of formal mathematical systems and shook the mathematical world’s understanding of truth and consistency in formal systems.

The proof essentially creates a mathematical statement that refers to itself, similar to the paradoxical statement "This sentence is false." This kind of self-reference leads to a strange loop.

Hofstadter sees this self-referential quality in Gödel's theorems as analogous to the nature of consciousness. A conscious being is able to reflect upon itself, perceive itself, and model its thoughts and thinking processes. This self-awareness can be seen as a form of strange loop, where the mind simultaneously stands above and below itself in a hierarchy, observing and being observed, thinking and being thought about.

For Hofstadter, the strange loops that arise in Gödel's theorems are more than mere mathematical curiosities; they serve as a metaphor or model for understanding how consciousness arises. The self-referential structures in mathematics are seen as echoing the self-referential nature of thought, where the mind can contemplate itself and create an abstract representation of its own processes.

As he said in 1979,

> "It is an inherent property of intelligence that it can jump out of the task which it is performing, and survey what it has done; it is always looking for, and often finding, patterns. Now I said that an intelligence can jump out of its task, but that does not mean that it always will. However, a little prompting will often suffice."



## LLM Agents: Hype and Limitations
***

Large language model agents emerge from complex interactions between it and vector databases that act as a memory store for previous output. This database allows the LLM to incrementally build upon prior knowledge, creating an iterative learning process that aids in generating novel and relevant responses. This, in essence, enables LLMs to "learn" and respond to new information in a contextually appropriate manner. While an intriguing idea, these agents fundamentally lack an integral part of intelligence.

> "No one knows where the borderline between non-intelligent behavior and intelligent behavior lies; in fact, to suggest that a sharp borderline exists is probably silly."

A system that doesn't understand its own workings is inherently capped in the complex actions it can take. By not comprehending the intricacies of the system they operate in or that they are comprised of, these LLMs are restricted in their ability to optimize their responses or troubleshoot their processes. An LLM without self-knowledge can only perform tasks to the extent of its pre-defined capabilities. They cannot dynamically adapt to new scenarios that require an internal modification of their operation.

Possibly, in the future when the context width is large enough, making the system a strange loop by loading in the model’s source code in the input might lead to surprising emergent properties. That is the amount of detail the model will have to know to begin making suggestions to its own code.

> "The flexibility of intelligence comes from the enormous number of different rules, and levels of rules… Strange Loops involving rules that change themselves, directly or indirectly, are at the core of intelligence"



## Gödel’s Incompleteness Theorem and Self-Reference
***

Gödel's theorem essentially states that within any consistent mathematical system, there will always be statements that cannot be proven true or false using the rules of that system.

In essence, Gödel's theorem illuminates the limitations of self-contained systems, particularly when those systems are used to analyze or describe themselves. This process of self-reference is a vital component of intelligence, leading us to Hofstadter's fascinating exploration of the theme in GEB.

Hofstadter takes an interdisciplinary approach, drawing from fields like mathematics, art, and music to delve into the theme of self-reference and its potential role in consciousness and intelligence. The titular figures — a mathematician, an artist, and a composer — all incorporate self-reference in their work, showcasing it as a concept that transcends disciplinary boundaries.

According to Hofstadter, self-reference — and recursion, the process by which a function calls itself — can create complex, 'intelligent' systems. If a system continually references and interacts with itself in increasingly complex ways, it can give rise to novel patterns and behaviors. As Hofstadter puts it, “Meaningless symbols acquire meaning despite themselves”.

> “Now sophisticated operating systems carry out similar traffic-handling and level-switching operations with respect to users and their programs. It is virtually certain that there are somewhat parallel things that take place in the brain: handling of many stimuli at the same time; decisions of what should have priority over what and for how long; instantaneous "interrupts" caused by emergencies or other unexpected occurrences; and so on.”

At the base level, individual simple dumb processes interacting at a large scale in the human brain happen to have an emergent property of what we call consciousness. Perhaps this emergent property generalizes to artificial systems. The added ability to self-reference and operate recursively might be a necessary property to be able to reflect upon ones actions to act as an intelligent agent and modify one's behavior or even code to adapt to new circumstances.



## Self-Improving Machines
***

The concept of the technological singularity, as originally coined by John von Neumann and later popularized by Ray Kurzweil, is intrinsically tied to the idea of self-improving intelligent machines.

In "The Singularity is Near", Kurzweil predicts that the singularity will occur around the year 2045, marking a point in time when technological growth becomes uncontrollable and irreversible, resulting in unforeseeable changes to human civilization. Kurzweil’s arguments are built on the basis of Moore's Law and the exponential growth of computing power and technology. He argues that the rate of technological progress is exponential, and as AI begins to surpass human intelligence, it will have the ability to recursively improve its own design, leading to an intelligence explosion.

As remarkable as ChatGPT and similar AI models are, they currently remain tools and are far from true intelligent systems. While the development of AI technologies like ChatGPT represents significant progress in the field of artificial intelligence, the self-improving models remain unpredictable beyond the horizon. While the age of self-improving machines might not be immediately around the corner, the advances in transformer models have had a large impact on the societal perception of the distance we have to go.

What is certain though is that this technology will eventually completely change the fabric of society. Is that a controversial take? No. Phones, social media, computers, electricity, etc, all have changed society. Now to the extent of this coming revolution, only time can tell.

> "Nothing is so painful to the human mind as a great and sudden change." - Mary Shelly, Frankenstein
