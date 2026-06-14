---
title: "Gradient Descent & Optimizers"
date: 2023-10-10T10:24:32-05:00
tags:
  - "Class Notes"
---

> These are my notes from Qiang Liu's Machine Learning II course at UT Austin, cleaned up and stitched into a single story (with much help from Claude).

Almost everything in machine learning eventually comes down to the same move: you have a loss function that measures how wrong your model is, and you want to make it smaller. The model has parameters $\theta$ — sometimes a handful, sometimes a few hundred billion — and somewhere in that enormous space is a setting that makes the loss small. The whole game is finding it.

You can't solve for it directly; the loss is far too tangled. So instead you do the only thing you can: stand where you are, look at which way is downhill, and take a step. That's gradient descent, and every optimizer in this post is a variation on that one idea — a different opinion about *how big* a step to take, and *in which direction*.



## Gradient Descent

The gradient $\nabla L(\theta)$ points in the direction of steepest *increase* of the loss. So to go downhill, you step the other way:

$$
\theta^{t+1} = \theta^t - \alpha \, \nabla L(\theta^t)
$$

The learning rate $\alpha$ controls how far you move. That single number does a lot of work: too small and training crawls, taking forever to reach the bottom; too large and you overshoot the minimum, bouncing across the valley or even diverging. Picking it well — and adapting it as you go — is the recurring headache that the rest of this post is really about.

It's worth asking *why* stepping against the gradient is guaranteed to help, at least locally. The answer comes from a second-order Taylor expansion of the loss around your current point:

$$
L(\theta_{t+1}) \approx L(\theta_t) - \alpha \, \|\nabla L(\theta_t)\|^2 + \tfrac{1}{2} \alpha^2 \, \nabla L(\theta_t)^\top \nabla^2 L(\theta_t) \, \nabla L(\theta_t)
$$

The middle term is the payoff: it's strictly negative, so a small step *always* decreases the loss. The last term is the catch. It carries the **Hessian** $\nabla^2 L$ — the curvature of the landscape — and scales with $\alpha^2$. When the step is small, that term is negligible and you make steady progress. When the step is too large, the curvature term takes over and can cancel out your gains entirely. This is the whole tension of optimization in one line: progress wants a big step, curvature punishes one.



## Stochastic Gradient Descent

There's a practical problem with the update above. Computing $\nabla L(\theta)$ exactly means summing the gradient over your *entire* dataset before you take a single step. With millions of examples, that's absurd — you'd do an enormous amount of work just to nudge the parameters once.

The stochastic version simply doesn't bother. Instead of the true gradient, it estimates it from one randomly chosen example (or, in practice, a small *mini-batch*):

$$
g_t = \nabla L_i(\theta_t), \qquad \theta_{t+1} = \theta_t - \alpha \, g_t
$$

where $L_i$ is the loss on the $i$-th sample. Each step is now cheap, so you can take thousands of them in the time the full version takes one. The catch is that $g_t$ is only a *noisy* estimate of the real gradient — you're navigating downhill in a fog, taking steps that are roughly right but jittery. Surprisingly, that noise is often a feature, not a bug: the random kicks can bump you out of shallow local minima and saddle points that would trap a smoother method. But the same noise also makes convergence ragged, with the loss oscillating instead of settling cleanly.

To really understand that trade-off, it helps to put a name to it.



## A Bias–Variance View of SGD

Any model's error decomposes into three pieces. The expected squared error splits cleanly into bias, variance, and an irreducible noise floor:

$$
\mathbb{E}\big[(y - \hat{f}(x))^2\big] = \text{Bias}(\hat{f}(x))^2 + \text{Var}(\hat{f}(x)) + \epsilon
$$

**Bias** is how far your model's average prediction sits from the truth; **variance** is how much it swings as the training data changes; and $\epsilon$ is the noise inherent in the data that no model can ever remove.

The same lens applies to SGD's *updates*. Because each step uses a random subset of the data, the gradient estimate is:

- **Unbiased in expectation.** Any single mini-batch gradient might point slightly off, but averaged over all possible mini-batches it equals the true gradient. On average, you're walking in the right direction.
- **High variance.** Different batches pull in different directions, so consecutive steps can disagree sharply. This is the source of both the helpful exploration *and* the annoying oscillation.

The standard fix is a **decaying learning rate**: start with large steps to cover ground quickly, then shrink them over time. As $\alpha$ falls, the updates get more conservative — less likely to overshoot near the end (lower bias) and inherently less jumpy (lower variance). Scheduled well, the decay drives both toward zero and lets the iterates settle into the true minimum instead of forever rattling around it. It's one tool among several — early stopping, regularization, and other learning-rate schedules all play the same balancing role.



## Adaptive Optimizers

Everything so far uses a *single* learning rate for *every* parameter. That's a blunt instrument. In a real model, some parameters see large, frequent gradients while others — say, weights tied to rare features — barely move. One global step size can't be right for both: it's too aggressive for the busy parameters and too timid for the sleepy ones.

The optimizers below each try to fix this, either by giving every parameter its own adaptive step size, by smoothing the direction of travel, or by doing both at once.

### Momentum

Momentum borrows an idea from physics. Instead of stepping in the direction of the current gradient alone, you accumulate a running **velocity** — an exponentially decaying average of past gradients — and move along that:

$$
v_t = \beta \, v_{t-1} + (1 - \beta) \, g_t, \qquad \theta_{t+1} = \theta_t - \alpha \, v_t
$$

The coefficient $\beta$ (usually around $0.9$) sets how much of the past you carry forward. The effect is exactly the intuition of a heavy ball rolling downhill: consistent gradients reinforce each other and pick up speed, while noisy back-and-forth gradients cancel out. That inertia smooths the path, dampens oscillation, and helps the ball coast through small bumps and saddle points it would otherwise get stuck on.

### AdaGrad

AdaGrad attacks the other half of the problem — the per-parameter step size. The idea: track how much each parameter has been updated, and slow down the ones that have already moved a lot. It does this by accumulating the squared gradients over time and dividing by their root:

$$
g_t = \nabla L(\theta_t), \qquad G_t = G_{t-1} + g_t \odot g_t, \qquad \theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{G_t} + \epsilon} \odot g_t
$$

Here $\odot$ is element-wise multiplication, $G_t$ is the running sum of squared gradients for each parameter, and $\epsilon$ is a tiny constant (around $10^{-8}$) that just keeps you from dividing by zero. Parameters with large historical gradients get a shrinking effective learning rate; rarely-updated parameters keep a large one. This makes AdaGrad especially good with sparse data.

But there's a fatal flaw baked into that sum: $G_t$ only ever *grows*. The denominator climbs without bound, so the effective learning rate decays monotonically toward zero — and eventually the model stops learning entirely, whether or not it has actually converged.

### RMSProp

RMSProp is the one-line fix for AdaGrad's vanishing learning rate. Instead of summing squared gradients forever, it keeps an **exponentially decaying average** of them:

$$
v_t = \beta \, v_{t-1} + (1 - \beta) \, (g_t \odot g_t), \qquad \theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{v_t} + \epsilon} \, g_t
$$

The decay factor $\beta$ (commonly $0.9$) means old gradients fade out instead of accumulating. So $v_t$ tracks the *recent* magnitude of the gradient rather than its entire history. The denominator can now go down as well as up, so the learning rate adapts to the current part of the landscape instead of grinding inexorably to a halt. That makes RMSProp far better suited to the non-convex, ever-shifting loss surfaces of deep learning.

### Adam

Adam — *Adaptive Moment Estimation* — is the synthesis, and the default optimizer for most of deep learning. It simply runs Momentum and RMSProp at the same time: a decaying average of the gradient (the first moment, the *direction*) and a decaying average of the squared gradient (the second moment, the *scale*):

$$
m_t = \beta_1 \, m_{t-1} + (1 - \beta_1) \, g_t, \qquad v_t = \beta_2 \, v_{t-1} + (1 - \beta_2) \, (g_t \odot g_t)
$$
$$
\theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{v_t} + \epsilon} \, m_t
$$

You step in the smoothed direction $m_t$ (momentum's contribution), scaled per-parameter by the recent gradient magnitude $v_t$ (RMSProp's contribution). The two decay rates $\beta_1$ and $\beta_2$ are both close to 1. In practice Adam also applies a small *bias correction* to $m_t$ and $v_t$, since both start at zero and are skewed toward it early in training.

The result is an optimizer that needs little memory, is invariant to rescaling the gradients, copes gracefully with noisy and sparse gradients, and — best of all — works well across a huge range of problems with almost no hyperparameter tuning. That last property is why it became the thing everyone reaches for first.



## Does Any of This Actually Converge?

The optimizers above are practical recipes, but it's natural to ask when they're *guaranteed* to reach the minimum, and how fast. For general non-convex losses the honest answer is "no guarantees" — but under a surprisingly mild condition, you can prove a strong one.

That condition is the **Polyak–Łojasiewicz (PL) inequality**. A differentiable function $L$ satisfies it if there's a constant $\mu \gt  0$ such that, everywhere:

$$
\|\nabla L(x)\|^2 \geq 2\mu \, \big(L(x) - L(x^*)\big)
$$

where $x^*$ is the minimizer. Read it plainly: the inequality says the gradient is never allowed to go flat unless you're already near the bottom. Whenever your loss is far above optimal, the gradient *must* be large enough to do something about it — so gradient descent can never stall on a plateau short of the minimum. Crucially, this doesn't require the function to be convex; it just rules out the pathological flat regions. That's enough to guarantee gradient descent converges to the optimum at a **linear rate**, which is why the PL condition shows up so often in convergence proofs for first-order methods.

So the picture closes neatly. The Taylor expansion from the very beginning told us a small step always helps locally; the PL inequality tells us that *if the landscape is well-behaved*, those local steps add up to global convergence. Everything in between — momentum, the adaptive learning rates, the noise of SGD — is engineering to make that descent faster, steadier, and cheap enough to run on real data.
