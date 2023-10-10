+++
title = "Generative & Discriminative Models"
date = 2023-10-07T14:36:35-05:00
tags = ["NLP Notes"]
+++

{{< toc >}}


## Generative Models vs. Discriminative Models
***

When it comes to classification, models are broadly categorized into Generative Models and Discriminative Models.

### Generative Models

In generative models, we aim to model the joint distribution of the data $ p(x, y) $. These models often assume a particular functional form for both $ P(x|y) $ and $ P(y) $. To classify a new data point, we maximize:

$$
\text{argmax}_{y \in C} \left[ p(y) \times p(x|y) \right]
$$

Prominent examples of generative models include Naive Bayes and Bayesian Networks.

### Discriminative Models

Discriminative models, on the other hand, focus on modeling the conditional probability $ p(y|x) $. They directly compute:

$$
\text{argmax}_{y \in C} p(y|x)
$$

These models excel at prediction but do not model the distribution of $ x $ explicitly. Logistic Regression, Perceptrons, and most neural networks fall under this category.

## Models
***
Classification is one of the most fundamental problems in machine learning. It's all about assigning a predefined label to a new, unseen data point based on the learning from the training data. In this section, we'll explore four prominent types of classifiers:


| Models             | How Parameters are Learned | Characteristics of Parameters     | Training Process                  |
|--------------------|----------------------------|----------------------------------|----------------------------------|
| Naive Bayes        | From data statistics       | Probabilistic                    | One pass through data            |
| Log Linear Models  | From Gradient Descent      | Linear, probabilistic, discriminative | SGD (Batched)        |
| Perceptron         | From reaction to mistakes  | Discriminative                   | Iterate until max validation accuracy  |
| Neural Networks    | From Gradient Descent, Backpropagation | Probabilistic, discriminative | SGD (Batched)  |

In the following sections contain more in depth details on each model.


### Naive Bayes Classifier

The Naive Bayes Classifier is a type of generative model that makes a strong assumption: all features (words in text classification, for example) are conditionally independent given the class label. The learning objective is often formulated using Maximum Likelihood Estimation (MLE):

$$
p(x, y) = p(y) \prod_{i=1}^{|x|} p(w_i|y)
$$

To classify a new instance, the inference step involves:

$$
argmax_{y \in C} \left[ q(y) \prod_{i=1}^{|x|} q(w_i|y) \right]
$$



### Log-Linear Classifier (Maximum Entropy Models)

#### Binary Classification
For binary classification, a Log-Linear model utilizes a feature vector $ \phi(x) $ and the sigmoid function to compute probabilities:

$$
P(y|x, w) = \frac{1}{1+e^{-(w \cdot \phi(x))}}
$$

The predicted label is:

$$
y^* = \text{argmax}_{y \in \{0, 1\}} p(y|x, w)
$$

#### Multi-Class Classification
In a multi-class setting, the model employs a softmax function and a feature vector $ \phi(x, y) $:

$$
P(y=1|x, w) = \frac{e^{w \cdot \phi(x, y)}}{\sum_{y'} e^{w \cdot \phi(x, y')}}
$$

The predicted label is:

$$
y^* = \text{argmax}_{y \in C} \left[ w \cdot \phi(x) \right]
$$

### Perceptron Algorithm

The Perceptron algorithm is one of the simplest types of artificial neural networks and a form of binary classifier. The algorithm starts with a weight vector initialized to zero and iteratively updates it using individual training examples.

#### Decision Rule
The Perceptron employs the following decision rule:

$$
y^* = \text{sign}(w \cdot \phi(x^i))
$$

- **If Correct** $ (y^* = y^i) $: No update is made to the weight vector.
- **If Incorrect**: The weight vector is updated as follows:
  - If the true label is positive: $ w \leftarrow w + \phi(x^i) $
  - If the true label is negative: $ w \leftarrow w - \phi(x^i) $

The Perceptron can be seen as a simplified version of logistic regression with updates being made in the following manner:

- $ w \leftarrow w + x(1 - P(y=1|x)) $
- $ w \leftarrow w - xP(y=1|x) $

### Neural Networks

A neural network is a collection of interconnected neurons. A single neuron is essentially a computational unit that performs the following operations:

$$
\sigma\left(\sum_i w_i x_i + b\right)
$$

Here, $ \sigma $ is a nonlinear activation function, $ w_i $ are the weights, $ x_i $ are the inputs, and $ b $ is the bias.

#### Backpropagation and Computational Graphs

Backpropagation is used for efficient computation of gradients in neural networks. This algorithm essentially utilizes a computational graph to compute gradients in linear time.

*Note: For further details on partial derivatives and their application in backpropagation, a separate section will be created.*

## Objective / Loss Functions
***

Regardless of the type of classifier, one common goal is to minimize the discrepancy between the predicted and true distributions. This is often done through minimizing the Cross-Entropy Loss:

$$
H(p, q) = - E_p(\log q)
$$

In mathematical terms, the Cross-Entropy Loss between the true label $ y^i $ and the predicted label $ y^* $ for a given instance $ x^i $ is:

$$
H(p(y^i|x^i), p(y^*|x^i)) = - \log p(y^i|x^i)
$$

The objective is to find parameters that minimize this loss function over the entire dataset.

This concludes our exploration of classification models. Understanding the differences between generative and discriminative models, as well as the specifics of popular classifiers, provides a strong foundation for tackling a wide array of machine learning problems.

### Learning via Gradient Descent

Gradient descent is an optimization algorithm commonly used in machine learning to minimize the loss function. In the context of classification, the objective function $ L(w) $ can be formulated as:

$$
L(w) = \log \prod_{i=1}^N p(y^i | x^i; w) = \sum_{i=1}^N \log(p(y^i | x^i; w))
$$

The optimal weight $ w^* $ that maximizes this function is:

$$
w^* = \text{argmax}_w L(w)
$$

### Learning Rate ($ \eta $)

The learning rate $ \eta $ controls how large the updates to the model parameters will be during the training process.

- **Too Small**: The model will converge slowly.
- **Too Large**: The model may overshoot the optimal value and potentially diverge.
