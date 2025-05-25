+++
title = "Running GPT-2 in WebGL: Rediscovering the Lost Art of GPU Shader Programming"
date = 2025-05-24T12:20:47-07:00
tags = ["Machine Learning"]
+++

<br>

Preface: A few weeks back, I implemented GPT-2 using WebGL and shaders ([Github Repo](https://github.com/nathan-barry/gpt2-webgl/tree/main)) which made the front page of Hacker News ([discussion](https://news.ycombinator.com/item?id=43870998)). By popular demand, here is a short write-up over the main ideas behind GPU shader programming.

{{< toc >}}



## The Origins of General Purpose GPU Programming
---

In the early 2000s, NVIDIA introduced programmable shaders with the GeForce 3 (2001) and GeForce FX (2003). Instead of being limited to predetermined transformations and effects of earlier GPUs, developers were now given unprecedented control over the rendering pipeline, enabling much more sophisticated visual effects. These programmable shaders laid the foundation for modern GPU computing.

Researchers soon discovered that certain computations (like linear algebra involving matrices and vectors) could be accelerated by casting them as graphics operations on the GPU.
However, using shader languages like OpenGL’s GLSL for no-graphics tasks was cumbersome. By the mid-2000s, the need for a more straightforward, non-graphics interface to GPUs had become clear, and NVIDIA saw a new opportunity.

Inspired by the demand for **general-purpose GPU (GPGPU)** programming, in November 2006, NVIDIA released **CUDA**, the **Compute Unified Device Architecture**. CUDA is a parallel computing platform and programming model that gives developers direct access to the GPU’s computational power without the intermediary of a graphics API. With CUDA, one could write C/C++ code to execute on the CPU using straightforward extensions for parallel kernels and managing GPU memory explicitly. This meant that developers could now ignore graphics-specific concepts and dramatically lowered the barrier for general-purpose GPU computing. Following CUDA came OpenCL which expanded general purpose computing beyond the NVIDIA ecosystem.



## Graphics API vs Compute API
---

Traditional graphics APIs like OpenGL are centered around a fixed-function pipeline tailored for rendering images. The pipeline consists of stages like vertex processing, rasterization, fragment processing, etc. Each stage can be programmable with shaders, but the overall flow is fixed. 
Using OpenGL for computation required a lot of boilerplate. One had to pack data into texture formats, use off-screen framebuffers to capture the results, and often perform multiple render passes to accomplish multi-stage algorithms. 

In contrast, OpenCL and CUDA expose a direct compute model which lets you treat the GPU as one giant SIMD processor:

- **Kernels, not shaders**: You write a function and then launch thousands of copies to run in parallel (no notion of vertices or fragments).
- **Raw buffers**: Allocate arrays of floats or integers, read/write them directly, and move them back and forth between host and device with explicit copy calls.
- **User-driven pipeline**: You define exactly what happens and when instead of using a predefined fixed sequence of rendering stages.

The result is a far more natural fit for linear algebra, simulations, physics, ML, and any algorithm where you just want to compute independent calculations in bulk.

In OpenGL, the output of your computation would ultimately be pixels in a framebuffer or values in a texture; in OpenCL, the output can be data in any form (float arrays, computed lists of numbers, etc.) which you then transfer back to the CPU or use in further computations. This makes OpenCL more suitable for general algorithms where you just want the numerical results.



## Implementing GPT-2 with shaders
---
Below covers textures, framebuffers, vertex and fragment shaders, and other graphics specific concepts I hijacked to get GPT-2 running on a GPU using shaders.

### Textures & Framebuffers: The Data Bus

In traditional graphics rendering, a **texture** is simply a 2D (or 3D) array of pixel data stored in GPU memory. When you map a texture onto a triangle, the fragment shader “samples” it to look up color values. In our compute‐as‐graphics paradigm, we hijack this same mechanism to store and manipulate numerical data instead of colors:

* **Textures as tensors**:
  Each texture is an array of floating‐point values (we use single‐channel R32F formats), where each pixel encodes one element of a matrix or vector. Just like you’d think of an H×W texture as holding H×W RGB pixels for an image, here it holds H×W scalar values for a weight matrix or activation map.

* **Sampling without filtering**:
  We use functions like `texelFetch` to read texture data by exact integer coordinates, bypassing any interpolation. This gives us deterministic, “random access” reads into our weight and activation arrays, akin to indexing into a CPU array by row and column.

A **Framebuffer Object (FBO)** is a lightweight container that lets us redirect rendering output from the screen into one of our textures:

1. **Attach a texture as the render target**:
   By binding a texture to an FBO, any draw call you make, normally destined for your monitor, writes into that texture instead. The fragment shader’s `out` variable becomes a write port into GPU memory.

2. **Offscreen and ping-pong rendering**:
   Because we can attach different textures in succession, we “ping-pong” between them: one pass writes into **Texture A**, the next pass reads from **Texture A** while writing into **Texture B**, and so on. This avoids ever copying data back to the CPU until the very end.

3. **High‐throughput data bus**:
   All of this happens entirely on the GPU’s VRAM bus. Binding textures and framebuffers is just pointer swapping on the GPU. Once set up, your fragment shader passes stream through millions of cores in parallel, reading, computing, and writing without ever touching system memory.

Together, textures and FBOs form the **data bus** of our shader‐based compute engine: textures hold the raw bits of your neural network (weights, intermediate activations, and outputs), and framebuffers let you chain shader passes seamlessly, keeping everything on the high-speed GPU pipeline until you explicitly pull the final logits back to the CPU.

### Fragment Shaders as Compute Kernels

Fragment shaders are where the magic happens. Instead of using fragment shaders to shade pixels for display, we hijack them as compute kernels; each fragment invocation becomes one “thread” that calculates a single output value. The GPU will launch thousands of these in parallel, giving us massive throughput for neural-network operations.

Below is an example fragment shader for matrix multiplication:

```glsl
// Matrix Multiply (C = A × B)
#version 300 es
precision highp float;

uniform sampler2D u_A;    // Texture holding matrix A (M x K)
uniform sampler2D u_B;    // Texture holding matrix B (K x N)
uniform int        u_K;   // Shared inner dimension
out vec4           outColor;

void main() {
  // Determine the output coordinate (i, j) from the fragment’s pixel position
  ivec2 coord = ivec2(gl_FragCoord.xy);
  float sum = 0.0;

  // Perform the dot–product along the K dimension
  for (int k = 0; k < u_K; ++k) {
    float a = texelFetch(u_A, ivec2(k, coord.y), 0).r;
    float b = texelFetch(u_B, ivec2(coord.x, k), 0).r;
    sum += a * b;
  }

  // Write the result into the single‐channel R component of the output texture
  outColor = vec4(sum, 0.0, 0.0, 1.0);
}
```

Here we have:
- **Per-pixel work item**: Each fragment corresponds to one matrix element (i, j). The GPU runs this loop for every (i, j) in parallel across its shader cores.
- **Exact indexing**: texelFetch reads a single float by its integer coordinate.
- **Write-back**: Assigning to outColor.r writes that computed value directly into the bound FBO’s texture at (i, j).

Here is another fragment shader but for the GELU activation function:

```glsl
// GELU Activation
#version 300 es
precision highp float;
uniform sampler2D u_X;
out vec4 o;

void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  float x = texelFetch(u_X, c, 0).r;
  float t = 0.5 * (1.0 + tanh(0.79788456 * (x + 0.044715 * x*x*x)));
  o = vec4(x * t, 0, 0, 1);
}
```

#### Shared Vertex Shader

Every operation gets its own fragment shader since that's where the math for the operation happens. The vertex shader, on the other hand, is simple and the same for each. All it does is draw two triangles which covers the entire view port. 

```glsl
// Shared Vertex Shader
#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;  // map [-1,+1] to [0,1]
  gl_Position = vec4(a_position, 0, 1);
}
```

- **Full-screen quad**: Two triangles cover the viewport. Every pixel in the fragment stage maps to one tensor element.
- **Reusable**: Because the vertex work is identical for all operations, we compile it once and reuse it across every matrix multiply, activation, and bias-add pass.

With this structure in mind, every “shader pass” is really just:
1. **Vertex shader**: map two triangles to the viewport
2. **Fragment shader**: perform one tiny piece of your transformer math per pixel

### Chaining Passes

Under the hood, every neural‐network operation—whether it’s a matrix multiply, an activation function, or a bias addition—boils down to four simple GPU steps:

1. Bind inputs as textures (weights, activations, or intermediate results).
2. Attach a fresh output texture to an offscreen framebuffer (FBO).
3. Draw a full‐screen quad using the shared vertex shader.
4. Execute the fragment shader, which performs the actual computation per pixel.

All of the WebGL boilerplate lives in our `_runPass` helper, so each pass in the GPT-2 forward loop feels like a single, declarative call:

```typescript
private _runPass(
  name: string,
  inputs: { [u: string]: WebGLTexture },
  ints: { [u: string]: number },
  outTex: WebGLTexture,
  W: number,
  H: number
) {
  // Grab the WebGL2 context and compiled shader program for this pass
  const gl = this.gl;
  const prog = this.programs[name]; // This has our vertex and frag shaders
  gl.useProgram(prog);

  // BOILERPLATE: Bind all input textures as uniforms

  // BOILERPLATE: Bind an FBO and attach our empty texture to it.

  // BOILERPLATE: Set up the full-screen quad geometry

  // Draw into our texture
  gl.viewport(0, 0, W, H);            // Ensure viewport matches texture size
  gl.drawArrays(gl.TRIANGLES, 0, 6);  // Runs our shaders

  // Clean up: Unbind FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
```

#### Forward Pass: Layer by Layer

Because each pass leaves its results in VRAM, we never pay the cost of round-trips back to the CPU until the very end. Here’s each step of the forward pass that we string together:

1. Embedding Upload
    - Combine token and position embeddings on the CPU, upload the sum as a texture on the GPU.
2. 12 Transformer Layers
    - LayerNorm → produces norm1Tex
    - Q, K, V: matMul + bias → three textures
    - Head slicing → split into N smaller “head” textures
    - Attention score + softmax → compute attention map
    - Weighted sum → apply attention to values → result texture
    - Head merge → draw each head block back into one large texture
    - Output projection + bias → APb texture
    - Residual add → combine with norm1Tex → res1
    - Feed-Forward (matMul → bias → GELU → matMul → bias) → fc2b
    - Second residual add → produces next layer’s input texture
3. Final LayerNorm → normFTex
4. LM Head matMul → logitsTex → read back via gl.readPixels

Once logits are back on the CPU, we apply softmax and sample (top-k or top-p) to pick the next token. Then the process starts over again with the new token being appended to the context.

By chaining just four simple GPU steps per operation, we keep the entire GPT-2 pipeline on the GPU until the final logits. This is how programmable shaders let us treat the graphics pipeline as a general-purpose parallel engine.

<br>

Thanks for reading! You can view the code and run the demo locally at the repo [here](https://github.com/nathan-barry/gpt2-webgl/tree/main). Contact me on [X](https://x.com/nathanbarrydev) if you have any suggestions.
