+++
title = "Neural Networks: RNNs, Seq2Seq, & CNNs"
date = 2023-10-07T14:55:20-05:00
tags = ["Class Notes"]
+++
{{< katex >}}{{< /katex >}}

> These are a few of my notes from Eunsol Choi's NLP class at UT Austin.



## Recurrent Neural Networks (RNNs)
Recurrent Neural Networks (RNNs) are a class of artificial neural networks specifically designed to tackle sequence-based problems. Unlike traditional feedforward neural networks, RNNs possess a memory in the form of a hidden state, enabling them to remember and leverage past information when making decisions. This makes them particularly effective for tasks like language modeling, time-series forecasting, and sentiment analysis.

An RNN takes an input sequence $ X = [x_1, x_2, \ldots, x_T] $ and produces a corresponding output sequence $ Y = [y_1, y_2, \ldots, y_T] $ based on the following recurrent relation:

$$
h_t = \text{activation}(W_{hh} \cdot h_{t-1} + W_{xh} \cdot x_t + b_h)
$$
$$
y_t = W_{hy} \cdot h_t + b_y
$$

Here:
- $ h_t $ is the hidden state at time $ t $
- $ x_t $ is the input at time $ t $
- $ y_t $ is the output at time $ t $
- $ W_{hh}, W_{xh}, W_{hy} $ are weight matrices
- $ b_h, b_y $ are bias vectors
- $ \text{activation} $ is an activation function, commonly $ \text{tanh} $ or $ \text{ReLU} $

The weights $ W_{hh}, W_{xh}, W_{hy} $ and biases $ b_h, b_y $ are shared across all time steps, allowing the model to generalize across sequences of varying lengths.

### The Vanishing Gradient Problem
When training RNNs using backpropagation through time (BPTT), gradients are propagated backwards from the final loss through the entire computational graph. If the activation function is something like $ \text{tanh} $, the gradients can diminish exponentially with each step due to the repeated multiplication of small numbers, leading to vanishing gradients.

The vanishing gradient issue makes it difficult for RNNs to capture long-range dependencies, which is crucial for understanding context in sequences. This is often described as "catastrophic forgetting," where the network fails to remember important historical information.

### Long Short-Term Memory (LSTMs)
LSTMs were introduced to tackle the limitations of traditional RNNs, specifically the vanishing gradient problem. LSTMs maintain a separate memory cell and use various gates to control the flow of information, thereby allowing for more effective learning of long-term dependencies.

The core idea of LSTM is its cell structure, comprising a memory cell and three types of gates: the forget gate, the input gate, and the output gate. These gates collectively decide what information to keep, what to discard, and what to output based on the current input and the previous hidden state.



## Sequence-to-Sequence (Seq2Seq)
The Seq2Seq architecture is primarily made up of two neural networks:

1. **Encoder:** This neural network takes in an input sequence $ x = (x_1, x_2, ..., x_n) $ and transforms it into a high-dimensional, fixed-length vector known as the "context vector". This vector captures the semantic essence of the input sequence.

2. **Decoder:** This network starts with the context vector and produces an output sequence $ y = (y_1, y_2, ..., y_m) $ that can be of a different length from the input. The decoder essentially translates the learned context into a meaningful output sequence.

### Training Objective
In Seq2Seq models, the training objective is usually to maximize the conditional likelihood of the correct output sequence given the input sequence. Mathematically, the objective function is expressed as:

$$
\max ( \sum_{x,y} \sum_{i=1}^n \log P(y_i^\*|x, y_1^\*, \dots, y_{i-1}^*))
$$

Here $P(y_i^\*|x, y_1^\*, \dots, y_{i-1}^\*)$ is the conditional probability of generating the $i$-th token $y_i^\*$ in the output sequence, given the input sequence $x$ and all previously generated tokens $y_1^\*, \dots, y_{i-1}^\*$.

### Inference Strategy
In the inference phase, the decoder produces an output sequence step-by-step. Starting from an initial token (often `<SOS>` for "start of sequence"), the model uses its trained parameters to predict subsequent tokens based on the context vector and all previously predicted tokens. This is often performed using techniques like greedy decoding, beam search, or top-k sampling to enhance output quality.



## The Attention Mechanism
Traditional Seq2Seq models can struggle with long sequences as the encoder has to compress all the information into a single, fixed-length context vector. The attention mechanism helps to alleviate this by allowing the decoder to "focus" on different parts of the input sequence at each decoding step, enabling it to capture long-range dependencies effectively.

### Mathematical Formulation
The attention model computes a set of attention weights, $\alpha_{ij}$, that quantify the importance of each input state $h_j$ when producing the output token at time $i$:

$$
\alpha_{ij} = \frac{\exp(e_{ij})}{\sum_{j'} \exp(e_{ij'})}
$$
$$
e_{ij} = f(\bar{h}_i, h_j)
$$

The function $f$ is often a simple dot product or a small neural network. These attention weights are used to create a weighted sum of the input hidden states, $c_i$:

$$
c_i=\sum_j \alpha_{ij} h_j
$$

The weighted context $c_i$ is then used alongside the hidden state $\bar{h}_i$ to produce the output token for the $i$-th time step. It allows the decoder to pay varying degrees of "attention" to each input token, thereby capturing relevant information more effectively.



## Convolutional Neural Networks (CNNs) for Sequence Modeling
Convolutional Neural Networks (CNNs) are primarily known for their effectiveness in image recognition tasks. However, they have proven useful in capturing temporal hierarchies in sequence data as well. This versatility makes CNNs a strong candidate for tasks like text classification, sentiment analysis, and even machine translation when dealing with sequence data.

A typical CNN for sequence modeling comprises a series of layers, each designed to capture different features from the input sequence:

1. **Convolutional Layers:** These layers apply a number of filters to the input sequence. Each filter slides across the sequence to produce a feature map.

2. **Activation Layers:** Usually a ReLU (Rectified Linear Unit) layer follows each convolutional layer to introduce non-linearity into the system.

3. **Pooling Layers:** These reduce the dimensionality of each feature map and retain the most essential information, thus making the network less sensitive to noise and variation in the input.

4. **Fully Connected Layers:** These come at the end and are used to produce the final output. They integrate the high-level features learned by the preceding layers.

**Strides and N-grams**:
Strides are essentially the steps that the filter takes as it slides across the input sequence. Larger strides result in smaller feature maps and reduce the computational complexity. This can be particularly useful when you want to skip over certain n-grams (subsequences of n items in your sequence), to speed up training or to focus on features that are spaced apart.

### Context Capturing
CNNs have an innate ability to capture local and increasingly global contexts via their hierarchical structure. The initial layers may capture low-level features like edges (or n-grams in sequences), while deeper layers capture more complex structures (or semantic meanings in the case of sequence data).

By stacking convolutional layers and playing with parameters like filter sizes, strides, and the number of filters, you can design CNNs that are well-suited for capturing both short and long-range dependencies in sequences. 

### Efficiency and Computational Advantages
CNNs offer computational efficiency for several reasons:

1. **Shared Weights:** Each filter is applied across the entire input, sharing weights and reducing the total number of parameters.

2. **Parallelization:** CNNs inherently support parallel processing, making it faster to train models.

3. **Reduced Complexity:** The pooling layers substantially reduce the dimensionality of the problem, aiding faster computation.
