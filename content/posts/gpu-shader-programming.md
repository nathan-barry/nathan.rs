+++
title = "Learning The Lost Art of GPU Shader Programming"
date = 2025-05-24T12:20:47-07:00
tags = ["Machine Learning"]
+++

{{< toc >}}



## The Origins of General Purpose GPU Programming
---

In 2001-2003, NVIDIA introduced programmable shaders with the GeForce 3 (2001) and GeForce FX (2003) which added programmable vertex and pixel shaders. Instead of being limited to predetermined transformations and effects of earlier GPUs, developers were now given unprecedented control over the rendering pipeline, enabling much more sophisticated visual effects. These programmable shaders laid the foundation for modern GPU computing.
Researchers soon discovered that certain computations (like linear algebra involving matrices and vectors) could be accelerated by casting them as graphics operations on the GPU.
However, using shader languages like OpenGL’s GLSL for no-graphics tasks was cumbersome. By the mid-2000s, the need for a more straightforward, non-graphics interface to GPUs had become clear, and NVIDIA saw a new opportunity.

Inspired by the demand in GPGPU programming, in November 2006, NVIDIA released CUDA, the “Compute Unified Device Architecture”. CUDA is a parallel computing platform and programming model that gives developers direct access to the GPU’s computational power without the intermediary of a graphics API. With CUDA, one could write C/C++ code to execute on the CPU using straightforward extensions for parallel kernels and managing GPU memory explicitly. This meant that developers could now ignore graphics-specific concepts and dramatically lowered the barrier for general-purpose GPU computing. Following CUDA came OpenCL which expanded general purpose computing beyond the NVIDIA ecosystem.

## Graphics API vs Compute API
---

Traditional graphics APIs like OpenGL are centered around a fixed-function pipeline tailored for rendering images. The pipeline consists of stages like vertex processing, rasterization, fragment processing, etc. Each stage can be programmable with shaders, but the overall flow is fixed. 
Using OpenGL for computation required a lot of boilerplate. One had to pack data into texture formats, use off-screen framebuffers to capture the results, and often perform multiple render passes to accomplish multi-stage algorithms. 

In contrast, OpenCL and CUDA exposed a direct compute model. A programmer explicitly launches a kernel (function) to be executed by many parallel threads, without any notion of vertices or fragments.
The GPU is treated like a general parallel processor. The programmer manages buffers in memory and the threads can read/write to these buffers arbitrarily (with some restrictions for safety and performance). The pipeline is defined by the user’s program, not by a fixed sequence of rendering stages.

In OpenGL, the output of your computation would ultimately be pixels in a framebuffer or values in a texture; in OpenCL, the output can be data in any form (float arrays, computed lists of numbers, etc.) which you then transfer back to the CPU or use in further computations. This makes OpenCL more suitable for general algorithms where you just want the numerical results.

## Implementing GPT-2 with shaders
---

A few weeks back I implemented GPT-2 with WebGL ([Github Repo](https://github.com/nathan-barry/gpt2-webgl/tree/main)) which made the front page of Hacker News ([discussion](https://news.ycombinator.com/item?id=43870998)). Almost all of the meat and bones of the project is contained in the file `gpt2_webgl.ts`. Below are the most important bits explained. 

### Textures & Framebuffers: The Data Bus

Framebuffer Objects (FBOs) are the key to GPU-based computation. Instead of rendering to the screen, we attach a texture to an FBO and render to it.

- Textures are our tensors. Textures store the weight matrices, activations, and intermediate results. We use single-channel R32F textures so each pixel holds one float.
- Framebuffers (FBOs) let us attach a texture as the target for rendering. Writing to an `out` variable in a fragment shader actually writes into the bound texture.
- Between passes we “ping-pong” (unbind one FBO, bind another) so the next draw call reads from the previous pass’s texture.

### Fragment Shaders as Compute Kernels

Fragment shaders are where the magic happens. Rather than rendering triangles or textures, we treat each fragment invocation like a “work item” that computes a single scalar. Below is an example fragment shader for matrix multiplication.

```glsl
// Matrix Multiply
#version 300 es
precision highp float;
uniform sampler2D u_A, u_B;
uniform int u_K;
out vec4 outColor;

void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);  // (x=j, y=i) element of C
  float sum = 0.0;
  for(int k = 0; k < u_K; ++k){
    sum += texelFetch(u_A, ivec2(k, c.y), 0).r
         * texelFetch(u_B, ivec2(c.x, k), 0).r;
  }
  outColor = vec4(sum, 0, 0, 1);
}
```

Here we have:
- texelFetch: exact lookup by integer coordinate, no filtering—perfect for reading the weight at row/column.
- Loop over K: each fragment sums over the inner dimension. On the GPU this happens in parallel for every (i,j).
- Writes one element of the result matrix into the bound output texture.

Below is another fragment shader but for the GELU activation function.

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

Every operation gets its own fragment shader since that's where the math happens. The vertex shader, on the other hand, is simple and each operation uses the same.

The vertex shader only draws two triangles covering the entire view port. By drawing a quad that covers the screen, every pixel in our W×H viewport corresponds exactly to one matrix element.

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

With this structure in mind, every “shader pass” is really just:
- Vertex shader: map two triangles to the viewport
- Fragment shader: perform one tiny piece of your transformer math per pixel

### Chaining Passes

When you strip away all the JavaScript plumbing, every matrix-multiply, activation, or bias-add in our GPT-2 implementation reduces to:
1. Binding inputs (as textures)
2. Attach an empty output texture to a framebuffer
3. Draw a full-screen quad with a shared vertex shader
4. Run a specialized fragment shader per operation

All of this is done is done for each operation by calling the `_runPass` function which handles all of the boiler plate for us:

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

We chain each of the operations of the forward pass below. At each step we simply rebind textures and FBOs and draw the quad again. Because the GPU never leaves the loop, data stays on the fast VRAM bus the entire forward pass. 

1. Upload the CPU-computed embeddings as a texture (wte + wpe sum).
2. Loop over layers (12 in total):
    - LayerNorm pass → norm1Tex
    - Q, K, V matMul + bias → three textures
    - Slice heads → N head-sized textures
    - Attention score + softmax → attention map
    - Apply attention → result
    - Merge heads by drawing each head block into a single large texture
    - Project & bias → APb
    - Residual add → res1
    - FFN (matMul → bias → gelu → matMul → bias) → fc2b
    - Residual add → next curTex
3. Final LayerNorm → normFTex
4. LM head matMul → logits texture → read back with gl.readPixels

Once the logits are read back onto the CPU, we softmax them and sample from the probability distribution using either top-k or top-p sampling. Then the process starts over again with the new token being appended to the context.

You can view the code and run the demo locally at the repo [here](https://github.com/nathan-barry/gpt2-webgl/tree/main). Thanks for reading!
