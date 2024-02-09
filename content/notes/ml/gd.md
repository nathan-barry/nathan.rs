+++
title = "Gradient Descent & Optimizers"
description = "My notes over Machine Learning 2. Title covers all."
date = 2023-10-10T10:24:32-05:00
tags = ["Machine Learning Notes"]
+++

{{< toc >}}



## Gradient Descent
***

Gradient Descent is a fundamental, first-order iterative optimization algorithm designed for minimizing a function. The primary objective of Gradient Descent is to find the minimum value of a function by iteratively moving towards the minimum of the gradient.

**Update Rule:** The parameters $ \theta $ are updated as follows in each iteration:

$$
\theta^{t+1} = \theta^t - \alpha \nabla L(\theta^t)
$$

where:
- $ \alpha $ represents the learning rate, a hyperparameter that determines the step size at each iteration while moving towards a minimum of the loss function.
- $ \nabla L(\theta^t) $ denotes the gradient of the loss function $ L $ with respect to the parameters $ \theta $ at iteration $ t $.



## Adagrad (Adaptive Gradient)
***

Adagrad is an optimization algorithm that adaptively adjusts the learning rates during the training process, which can be especially helpful when dealing with sparse data. The algorithm modifies the general learning rate at each time step $ t $ for every parameter based on the historical gradients that have been computed for that parameter.

**Update Rule:** The update mechanism for Adagrad is as follows:

$$
    g_{t} = \nabla L(\theta^t),
    \qquad G_{t} = G_{t-1} + g_{t} \odot g_{t},
    \qquad\theta^{t+1} = \theta^{t} - \frac{\alpha}{\sqrt{G_{t} + \epsilon}} \odot g_{t}
$$

where:
- $ g_{t} $ is the gradient of the loss function $ L $ with respect to the parameters $ \theta $ at time step $ t $.
- $ G_{t} $ accumulates the squares of the past gradients (element-wise). Each element on the diagonal of matrix $ G_{t} $ represents the sum of the squares of the past gradients w.r.t. each parameter.
- $ \epsilon $ is a smoothing term added to prevent division by zero, typically set to a small value, like $1 \times 10^{-8}$.



## RMSProp
***

RMSprop adjusts the learning rate during training, allowing for the individual adaptation of each parameter’s learning rate during the optimization process. The algorithm works as follows:

**Update Rule:** The gradients, exponentially decaying average, and parameter updates are computed using the following equations:

$$
    g_{t} = \nabla L(\theta_t),
    \qquad v_{t} = \beta v_{t-1} + (1 - \beta) (g_{t}\odot g_{t}),
    \qquad \theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{v_{t} + \epsilon}} g_{t}
$$

where:
- $ v_{t} $: exponentially decaying average of squared gradients.
- $ \beta $: decay factor (commonly set to $0.9$).
- $ \epsilon $: smoothing term to avoid division by zero.

### Comparison with Adagrad
RMSprop can be seen as a modification of Adagrad. Below is a quick comparison between the two algorithms:

1. Adagrad:
    - Compute gradient: $ g_t = \nabla L(\theta_t) $.
    - Square gradient element-wise: $ g_t \odot g_t $.
    - Accumulate squared gradients: $ G_t = G_{t-1} + g_t \odot g_t $.
    - Update rule: $ \theta^{t+1} = \theta^{t} - \frac{\alpha}{\sqrt{G_{t} + \epsilon}} \odot g_{t} $.

2. RMSprop:
    - Compute gradient: $ g_t = \nabla L(\theta_t) $.
    - Square gradient element-wise: $ g_t \odot g_t $.
    - Compute weighted average with decay factor: $ v_{t} = \beta v_{t-1} + (1 - \beta) (g_{t}\odot g_{t})$.
    - Update rule: $ \theta_{\text{new}} = \theta_{\text{old}} - \frac{\alpha}{\sqrt{v_{t} + \epsilon}} g_{t} $.

**Insights:**
- In RMSprop, $ v_t $ acts like a moving average of squared gradients, with the contribution of older gradients decaying exponentially.
- This approach makes the algorithm sensitive to recent gradients while still considering past information, thereby addressing limitations seen in Adagrad, such as rapid decrease in learning rate.
- As a result, RMSprop is often more suitable for non-convex optimization problems and deep learning applications.



## Momentum
***

Momentum is inspired by physical momentum: it helps the optimizer to navigate along the relevant directions and dampens oscillations in the learning process. Momentum works by accumulating an exponential decay of past gradients and continues to move in that direction.

**Update Rule:** The update mechanism for parameters using Momentum is expressed as follows:

$$
    g_{t} = \nabla L(\theta_t),
    \qquad v_t = \beta v_{t-1} + (1-\beta)g_t,
    \qquad \theta_{t+1} = \theta_t - \alpha v_t
$$

where:
- $ v_t $ represents the velocity at time step $ t $, which is a linear combination of the gradient at the current step and the velocity at the previous step.
- $ g_t $ is the gradient of the loss function with respect to the parameters $ \theta $ at the time step $ t $.
- $ \beta $ is the momentum coefficient that determines the contribution of the previous velocity to the current one. It’s a hyperparameter typically set between $0$ and $1$, often initialized to $0.9$.
- $ \alpha $ is the learning rate.

**Insights:**
- The Momentum method introduces a velocity vector that combines the current gradient with the previous velocity, acting as a smoothing mechanism for the optimization path.
- The momentum term $ \beta v_{t-1} $ effectively adds inertia to the parameter updates, helping the optimizer to overcome local minima and saddle points.
- It provides a form of implicit regularization, helping the model to generalize better.
- Adjusting the coefficient $ \beta $ allows for controlling the amount of smoothing, with larger values leading to smoother updates.



## Adam (Adaptive Moment Estimation)
***

Adam is known for combining the best properties of the algorithms Momentum and RMSprop. It uses both moving averages of the parameters (momentum) and the squared gradients (RMSprop) to adaptively adjust learning rates for each parameter, making it well-suited for problems with noisy or sparse gradients.

**Update Rule:** The update mechanism for Adam is as follows:
$$
    m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t, \qquad
    v_t = \beta_2 v_{t-1} + (1 - \beta_2) (g_t\odot g_t), \qquad
$$
$$
    \theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{v_t} + \epsilon} m_t.
$$
where:
- $ m_t $ and $ v_t $ are moving averages of the gradient and the element-wise squared gradient respectively.
- $ \beta_1 $ and $ \beta_2 $ are exponential decay rates for the moving averages (typically close to 1).
- $ \alpha $ is the learning rate.
- $ \epsilon $ is a small constant added to prevent division by zero (smoothing term).

**Insights:**
- Adam is effective in practice and requires little memory.
- It works well with problems that have large datasets or parameters.
- The algorithm is invariant to diagonal rescaling of the gradients.
- Adam usually requires little tuning of hyperparameters and the learning rate.



## Stochastic Gradient Descent (SGD)
***

Unlike GD that computes the gradient using the entire dataset, SGD approximates the gradient using a single or a few randomly selected samples, hence the name 'stochastic'. This approach makes SGD faster and able to handle large-scale datasets efficiently.

**Update Rule:** The update mechanism for parameters using SGD is straightforward:
$$
    g_t = \nabla L_i(\theta_t), \quad \text{where } L_i \text{ is the loss for the i-th sample}, \qquad
    \theta_{t+1} = \theta_t - \alpha g_t,
$$
where:
- $ g_t $ represents the gradient of the loss function with respect to the parameters $ \theta $ for the selected sample at time step $ t $.
- $ \alpha $ is the learning rate, a hyperparameter that determines the step size at each iteration.

**Insights:**
- Since SGD uses a subset of the dataset to compute the gradient, it's computationally more efficient than batch GD, especially for large datasets.
- The stochastic nature of the algorithm can help escape local minima and saddle points but also introduces noise in the convergence process, leading to oscillations in the loss function.
- To mitigate the oscillations, variants like Mini-batch SGD (which uses a small random subset of data, rather than a single sample) or SGD with momentum (which smoothens the gradient updates) are often used in practice.




## Bias-Variance Decomposition of Stochastic Gradient Descent
***

Understanding the bias-variance trade-off is critical for comprehending the behavior of SGD. The error of a machine learning model can be decomposed into bias, variance, and irreducible error.

### Bias-Variance Decomposition
The expected mean squared error of a model can be expressed as the sum of the bias squared, variance, and irreducible error:
$$
\mathbb{E}[(y - \hat{f}(x))^2] = \text{Bias}(\hat{f}(x))^2 + \text{Var}(\hat{f}(x)) + \epsilon,
$$

where:
- $\hat{f}(x)$ represents the model's prediction.
- Bias measures the difference between the expected prediction and the true values.
- Variance quantifies the model's sensitivity to specific sets of sampled training data.
- $\epsilon$ is the irreducible error due to noise in the data.

### SGD Bias-Variance
- **Bias:** SGD introduces bias in parameter updates by approximating gradients with subsets of data. While individual updates may be biased, SGD is unbiased in expectation as the expected value of updates equals the true gradient over different samples.
- **Variance:** SGD exhibits high variance due to using different data subsets for updates. This variance can aid in escaping local minima but may also impede convergence.

### Decaying Learning Rate
Utilizing a decaying learning rate (decreasing it over time) is a common practice to mitigate the variance in SGD while ensuring convergence. As the learning rate decays:

- **Reduced Bias:** The decaying learning rate causes updates to become more conservative, reducing the risk of overshooting and thereby decreasing bias towards the optimization process end.
- **Lower Variance:** Smaller updates inherently possess lower variance, making the optimization process more stable and reliable as it progresses.
- Ultimately, a properly scheduled decay in the learning rate brings both bias and variance closer to zero, promoting convergence to the true minimum of the loss function.

#### Balancing Bias and Variance
Decaying the learning rate is one of several techniques used to balance bias and variance effectively. Others include early stopping, regularization methods, and learning rate scheduling, each helping to ensure good generalization without overfitting.



## Polyak-Lojasiewicz (PL) Inequality
***

The Polyak-Lojasiewicz (PL) inequality is a crucial concept in the analysis of optimization algorithms, providing valuable insights into their convergence properties. This inequality characterizes the geometry of the objective functions and establishes conditions under which optimization algorithms converge to the unique solution at a linear rate.

**PL Inequality Definition:** Given a differentiable function $ f: \mathbb{R}^d \rightarrow \mathbb{R} $, the function satisfies the PL inequality if there exists a constant $ \mu > 0 $ such that for all $ x \in \mathbb{R}^d $:

$$
\|\nabla L(x)\|_2 \geq 2\mu (L(x) - L(x^*))
$$

Where:
- $ \mu $ is the PL constant.
- $ x^* $ is the optimal value that minimizes the loss.

**Significance of PL Inequality:**
- **Convergence Insights:** The PL inequality provides guarantees on the convergence rates of optimization algorithms, ensuring that they converge linearly to the minimizer under specific conditions.
- **Geometry Characterization:** It characterizes the geometry of the objective function's landscape, providing a measure of its "smoothness" or "conditioning".
- **Algorithm Analysis:** It is extensively used in the analysis and design of optimization algorithms, especially for proving convergence rates of first-order methods.



## Taylor Approximations in Optimization
***

Taylor approximations provide a powerful tool for understanding and approximating the behavior of functions in the vicinity of specific points. In the context of optimization, they offer valuable insights into the landscape of the loss function, facilitating the design and analysis of optimization algorithms.

### Second-Order Taylor Approximation
For a twice-differentiable loss function $ L: \mathbb{R}^d \rightarrow \mathbb{R} $, the second-order Taylor approximation around a point $ \theta_t $ is given by:

$$
L(\theta_{t+1}) \approx L(\theta_t) - \epsilon \|\nabla L(\theta_t)\|^2 + \frac{1}{2} \epsilon^2 \nabla L(\theta_t)^T \nabla^2 L(\theta_t) \nabla L(\theta_t)
$$

Where:
- $ \epsilon $ is a small scalar value representing a step size.
- $ \nabla L(\theta_t) $ is the gradient of $ L $ at $ \theta_t $.
- $ \nabla^2 L(\theta_t) $ is the Hessian matrix (matrix of second-order partial derivatives) of $ L $ at $ \theta_t $.

#### Interpretation and Use
- **Function Approximation:** The Taylor approximation offers a local approximation of the function around $ \theta_t $, which is especially useful for analyzing or optimizing functions that are complex or not easily solvable.
- **Algorithm Analysis:** In optimization, Taylor approximations are often used to analyze the convergence and stability of algorithms, providing insights into how parameter updates affect the loss function.
- **Insights into Loss Landscape:** The second-order term in the approximation helps to capture the curvature of the loss function, providing important information about the geometry of the loss landscape.

