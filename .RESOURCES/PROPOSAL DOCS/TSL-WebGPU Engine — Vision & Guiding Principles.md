# TSL/WebGPU Engine — Vision & Guiding Principles

## 0. TL;DR

We are building a **modular TSL/WebGPU engine** on top of a working, battle-tested base:

- **Foundation:** `phobon/fragments-boilerplate` — a WebGPU + TSL + R3F boilerplate with sketch routing and a TSL utilities layer.  
- **Our layer:** a **TSL-KIT / engine layer** focused on:
  - High-end **materials**, **post-FX**, **particles/physics**, and **field-based systems**.
  - **Hot-swappable, single-file modules** that can be reused in other projects.
  - A **sketch-driven lab** to quickly test, combine, and ship effects.

The goal: a **creative coding engine** that feels as immediate as ShaderToy, as modular as a node-based DCC, and as portable as a small TS library.

---

## 1. Why This Engine Exists

WebGPU + TSL is finally mature enough to build serious, modern 3D experiences in the browser.  
Three.js’ **WebGPURenderer** plus **TSL** gives us:

- Node-based shader graphs with JS/TS ergonomics.  
- Ability to target WebGPU and WebGL from the same TSL graph in many cases.  
- Access to **compute shaders**, enabling GPU-based particles, fields, MPM/SPH-like systems, and heavy GPGPU workloads.  

However:

- **Bootstrapping WebGPU + TSL + R3F** correctly is finicky.
- Advanced **post-FX, materials, and compute setups** are under-documented.  

Our engine exists to solve that:

> **Start from a working WebGPU+TSL foundation, then add a curated, modular engine for advanced rendering, FX, and physics.**

---

## 2. Target Use Cases

### 2.1. Primary use cases

1. **Creative coding + live sketches**
   - Quickly spin up new sketches that plug into shared engine modules.
   - Use sketches as both **experiments** and **unit tests** for engine features.

2. **Portfolio / interactive lab sites**
   - Reuse the same engine in personal websites and labs.
   - Host **demos**, **explanations**, and **visual essays** built on the engine.

3. **R&D for advanced GPU workflows**
   - Prototype **particles, flow fields, raymarching, fluid/solid experiments** using TSL + compute shaders.  

4. **Future: tooling for AI/agents**
   - Provide a clear, stable API so coding agents (Codex, GPT-5, etc.) can:
     - Add new modules,
     - Wire up sketches,
     - Generate parametric experiments without breaking the engine.

### 2.2. Secondary use cases

- Teaching / tutorials about TSL + WebGPU.
- Benchmarking WebGPU vs WebGL approaches.
- Serving as a “reference implementation” of good TSL patterns.

---

## 3. Our Positioning vs `fragments-boilerplate`

**Foundation repo:**  
`fragments-boilerplate` is a companion project for Fragments, a creative coding platform using Three.js, TSL, WebGPU, R3F, and a sketch routing system.  

It already provides:

- Vite + TanStack Router app.
- React Three Fiber + Drei + Leva + Zustand stack.
- Sketch routing via `src/sketches/*`.
- TSL utilities folder (`src/tsl/*`) with noise, FX, helpers.

**Our engine**:

- **Does not replace** this structure.
- **Extends** it with a structured engine layer:

  - `materials` — PBR, SSS-ish, emissive, glass, etc.  
  - `postfx` — filmic chains, glare, DOF-style blur, color grading.
  - `particles/physics` — compute-driven fields, swarm, attractors, etc.  
  - `fields` — vector fields, signed distance fields (SDF), flow maps.
  - `presets` — one-liner recipes for quick art direction.

---

## 4. Vision: What the Engine Should Feel Like

### 4.1. For the developer

- You open the repo, run `pnpm dev`, go to `/sketches`.
- You duplicate a sketch, import 2–3 engine modules, tweak a few parameters → **you get something beautiful in minutes**, not hours.
- Every advanced feature (particles, complex material, raymarch, etc.) is:
  - **One import away.**
  - Documented in a short TS type/interface.
  - Demonstrated in at least one sketch.

### 4.2. For the engine structure

- **No God-classes** or giant “engine.ts”.
- Many **small, single-responsibility modules** that:
  - Take clear, typed params.
  - Return either:
    - A TSL node (e.g. `colorNode`, `positionNode`),
    - A small object: `{ materialNode, uniforms, updateFn }`.

- Everything is **hot-swappable**:
  - Replace a material node with another one.
  - Swap a field function with another.
  - Chain post-FX without rewriting the whole scene.

---

## 5. Guiding Principles

### 5.1. Foundation-first

> **Start from something that renders. Then get fancy.**

- We do not rebuild renderer, sketch routing, or basic TSL utilities.
- We keep `WebGPUScene` and `WebGPUSketch` intact unless there is a strong reason to extend/patch them.

### 5.2. Engine as a library

- Our engine layer is designed as if it could be published as `@tsl-kit/engine`:
  - No tight coupling to routing.
  - No direct imports from UI components (Leva, router, etc.).
  - Only depends on `three`, `three/tsl`, and minimal shared utilities.

### 5.3. Single-file modules

- Each major feature is implemented as a mostly **self-contained file**:
  - `src/engine/materials/phiMetal.ts`
  - `src/engine/postfx/filmicChain.ts`
  - `src/engine/fields/flowFieldCurl.ts`
  - `src/engine/particles/attractorParticles.ts`

- They may import small building blocks (noise, color, SDF) from shared utility modules.

### 5.4. Sketch-driven development

- Any new engine module must:
  1. Live under `src/engine/**`.
  2. Have **at least one** sketch under `src/sketches/engine/**` that uses it.
  3. Be tweakable from a UI (Leva/Tweakpane) so parameters are discoverable.

### 5.5. WebGPU-first but not WebGPU-only

- Primary target: **WebGPU + TSL** (using WebGPURenderer).  
- When feasible, we keep TSL graphs compatible with WebGL fallback.
- We are aware WebGPU is still evolving; breaking changes are expected.  

### 5.6. Agent-friendly

The codebase is written to be friendly for AI tooling:

- Clean, predictable folder structure.
- Minimal magic.
- Docs close to code.
- Small, composable modules that an agent can reason about.

---

## 6. Non-Goals

- We are **not** building:
  - A full game engine.
  - A drag-and-drop UI editor.
  - A generic physics engine competing with Ammo/PhysX.

- We explicitly **do not**:
  - Rewrite Three.js or WebGPURenderer internals.
  - Support legacy browsers prior to WebGPU/WebGL2.

---

## 7. Success Criteria

We know the vision is working if:

1. Spinning up a **new beautiful sketch** is:
   - Clone → import 2–3 engine modules → tweak → done.
2. The engine can be **copied into another repo** with minimal surgery.
3. Adding **new advanced features** (e.g. a new fire shader, subsurface material, or compute-driven effect) feels like:
   - **One module, one sketch, one demo.**
4. The codebase is understandable to both:
   - Human collaborators,
   - AI coding agents.
