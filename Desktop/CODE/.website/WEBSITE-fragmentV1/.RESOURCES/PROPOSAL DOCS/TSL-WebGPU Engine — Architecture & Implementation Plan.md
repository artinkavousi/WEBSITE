# TSL/WebGPU Engine — Architecture & Implementation Plan

## 0. High-Level Overview

We build on top of:

- **Foundation:** `phobon/fragments-boilerplate` (Vite, TanStack Router, R3F, Drei, Leva, Zustand, WebGPUScene/WebGPUSketch, TSL utils).  
- **Engine layer:** `src/engine/**` (our TSL-KIT modules).
- **Sketches:** `src/sketches/**` (demos/tests of engine modules).

At a glance:

```mermaid
graph TD
  A[App Shell / Routing\n(TanStack Router)] --> B[WebGPUScene / WebGPUSketch\n(Foundation)]
  B --> C[Engine Layer\nsrc/engine/**]
  C --> D[Sketches\nsrc/sketches/**]
  D --> E[Final Render\n(WebGPU / WebGL)]
```

---

## 1. Layered Architecture

### 1.1. Layer 1 — Foundation App

Stays very close to `fragments-boilerplate`:

- **Responsibilities**
  - App shell: layout, routing, navigation.
  - WebGPUScene / WebGPUSketch components wiring TSL nodes into a `MeshBasicNodeMaterial` or similar.  
  - Existing `src/tsl` utilities.

- **Modifications**
  - Keep them **minimal and documented**.
  - Only patch when needed (e.g. exposing hooks for engine integration).

### 1.2. Layer 2 — Engine Layer (`src/engine`)

New root:

```text
src/
  engine/
    core/
    materials/
    postfx/
    fields/
    particles/
    utils/
    presets/
```

**Goal:** this whole folder should be portable into another app.

### 1.3. Layer 3 — Sketches & Content (`src/sketches`)

- Use the existing sketch routing mechanism.
- Add namespaced sketches for engine demos:

```text
src/sketches/
  engine/
    materials/
    postfx/
    particles/
    fields/
```

Each engine feature has at least one sketch that:

- Demonstrates it clearly.
- Exposes its parameters through Leva or another control UI.

---

## 2. Engine Folder Structure

Suggested initial structure:

```text
src/engine/
  core/
    engineConfig.ts           # Global settings, toggles, quality presets
    engineTypes.ts            # Shared TypeScript types/interfaces
    engineRegistry.ts         # Optional registry for modules/presets
  materials/
    basicLambert.ts
    phiMetal.ts
    subsurfaceApprox.ts
    glassDispersion.ts
  postfx/
    bloomChain.ts
    filmicColorGrading.ts
    grainAndChromaticAberration.ts
  fields/
    noiseFieldCurl.ts
    vectorFieldFromTexture.ts
    sdfPrimitives.ts
    flowFieldStream.ts
  particles/
    attractorParticles.ts
    spriteFieldCloud.ts
    computeBoids.ts
  presets/
    heroSketches.ts
    colorPalettes.ts
    parameterPresets.ts
  utils/
    noise.ts                  # Shared noise / fbm helpers
    color.ts                  # Palette mapping, tonemapping helpers
    math.ts                   # Common math functions
    coords.ts                 # Polar, spherical, domain repetition
```

Each module:

- Exports a **typed factory** (e.g. `createPhiMetalMaterial(options): MaterialNodeConfig`).
- Uses only `three`, `three/tsl`, and `src/engine/utils`.

---

## 3. Core Engine Concepts

### 3.1. TSL Nodes as the “Glue”

Everything in the engine ultimately builds **TSL nodes**:

- `colorNode`, `positionNode`, `normalNode`, `opacityNode`, etc.  
- Sometimes entire **pipelines**:
  - Render: TSL material graph → WebGPURenderer.
  - Compute: TSL `wgslFn` + `.compute()` for GPU tasks.  

Engine modules either:

- Return “drop-in” nodes:
  - `vec3` color or `float` mask node.
- Or return an **object** for more complex cases:

```ts
type MaterialNodeConfig = {
  colorNode: Node;
  roughnessNode?: Node;
  metalnessNode?: Node;
  normalNode?: Node;
  onBeforeCompile?: () => void;
};
```

### 3.2. Materials Subsystem

**Goal:** Curated set of ready-made materials with param control.

Examples:

- **PhiMetal** (stylized metallic, anisotropy-like feel).
- **SubsurfaceApprox** (approximate SSS based on fresnel/curvature tricks).  
- **GlassDispersion** (simple fake dispersion with view-depth dependence).

Internally:

- Built from TSL building blocks (noise, fresnel, normal perturbation).
- Return `MaterialNodeConfig` for plug-in into `MeshStandardNodeMaterial` or similar TSL-compatible materials.  

### 3.3. PostFX Subsystem

Built as **chains** of passes using TSL `pass()` and related helpers:  

- Bloom, glow, glare.
- DOF-style blur.
- Filmic color grading (lift/gamma/gain, curves).
- Grain, chromatic aberration, vignette, pixel sorting-style post.

The engine exports something like:

```ts
type PostFXChain = {
  input: Node;          // scene color
  output: Node;         // final color node
  controls?: PostFXControls; // knobs for Leva
};
```

### 3.4. Fields Subsystem (Noise / SDF / Vector Fields)

Wrapper functions for:

- **Noise fields**: Perlin, simplex, fbm, curl noise.  
- **SDF primitives**: sphere, box, torus, rounded shapes.
- **Flow fields**: vector fields used for particles, distortions, or deformations.

Used by:

- Materials (for patterns, breakup, layer blending).
- Particles (velocity fields).
- Raymarching-style sketches.

### 3.5. Particles & Compute Subsystem

Leveraging WebGPU **compute shaders** via TSL:  

- `instancedArray` buffers for thousands of particles.
- Compute shaders to:
  - Initialize positions.
  - Update velocities/positions each frame.
  - Handle simple interactions (attractors, noise-based forces, bounds).

Each module exposes:

```ts
type ParticleSystemConfig = {
  count: number;
  meshFactory: () => JSX.Element; // R3F component using spriteNodeMaterial or instanced meshes
  updateNode: Node;               // compute/update function
};
```

---

## 4. Integration with WebGPUScene / WebGPUSketch

We integrate via **thin wrappers**, not rewrites.

### 4.1. Engine-aware Sketch Wrapper

Example pattern:

- Create a `createEngineSketch()` helper that:
  - Accepts engine module configs.
  - Returns a TSL `Fn` or a React component that WebGPUSketch can consume.

Pseudo-structure:

```ts
// src/engine/core/createEngineSketch.ts
export function createEngineSketch(config: EngineSketchConfig): Node {
  const { material, postfx, fields } = config;

  // Compose TSL nodes here from engine modules...
  return composedColorNode;
}
```

Then a sketch:

```ts
// src/sketches/engine/materials/phi_metal.ts
import { Fn } from 'three/tsl';
import { createEngineSketch } from '@/engine/core/createEngineSketch';
import { createPhiMetalMaterial } from '@/engine/materials/phiMetal';

const sketch = Fn(() =>
  createEngineSketch({
    material: createPhiMetalMaterial({ /* params */ }),
    postfx: null,
  })
);

export default sketch;
```

This keeps **sketches very small** and pushes complexity into the engine.

---

## 5. Implementation Roadmap

### Phase 0 — Fork & Setup

1. Fork `phobon/fragments-boilerplate`.
2. Run and confirm:
   - `pnpm i`
   - `pnpm dev`
   - Default sketches render correctly.
3. Create `src/engine/**` with basic layout and placeholder `README`.

**Exit criteria:**

- Base app runs.
- Engine folder exists and is imported nowhere yet.

---

### Phase 1 — Engine Skeleton & First Materials

1. Implement **core types** in `engine/core/engineTypes.ts`.
2. Create `engine/utils/{noise,color,math}.ts` — minimal wrappers.
3. Implement **one or two simple materials**:
   - `basicLambert`
   - `phiMetal` (even in a rough first version)
4. Create sketches under `src/sketches/engine/materials/*` that:
   - Show each material on simple geometry.
   - Expose parameters via Leva.

**Exit criteria:**

- At least **2 materials** wired into sketches.
- Code structure feels clean and easy to extend.

---

### Phase 2 — PostFX & Field Utilities

1. Add simple **post-FX chain**:
   - Grain + vignette.
   - Simple bloom.
2. Build **field utilities**:
   - Noise fields with fbm + curl.
   - Basic SDF shapes.
3. Create sketches:
   - `postfx/bloom_and_grain.ts` — demonstrates chain on simple scene.
   - `fields/noise_flow.ts` — visualizes vector field via line strips or color.

**Exit criteria:**

- At least **1 post-FX chain** and **1 field visualizer** sketch.
- PostFX and fields are reusable by materials & particles.

---

### Phase 3 — Particles & Compute Experiments

1. Implement **particle system scaffolding**:
   - `instancedArray` buffers.
   - Compute shader for initialization + per-frame updates.  
2. Create at least **2 particle systems**:
   - Attractor-based particle cloud.
   - Flow-field-driven particles.
3. Sketches:
   - `particles/attractor_cloud.ts`
   - `particles/flowfield_trails.ts`

**Exit criteria:**

- Stable particle systems with clear controls.
- Compute shaders integrated into engine layer.

---

### Phase 4 — Polishing, Docs & Reuse

1. Document engine APIs:
   - Short comments in each module.
   - Top-level `ENGINE_README.md` summarizing modules.
2. Add more hero-level presets in `presets/heroSketches.ts`.
3. (Optional) Extract `src/engine` into a separate package structure.

**Exit criteria:**

- Someone new (or an AI agent) can:
  - Read the docs,
  - Import a module,
  - Build a new sketch without touching internals.

---

## 6. Developer Workflow

### 6.1. Everyday loop

1. Pick a subsystem (materials, postfx, fields, particles).
2. Implement or refine module in `src/engine/**`.
3. Wire it in a `src/sketches/engine/**` file.
4. Add controls via Leva.
5. If stable: add **preset** in `presets/heroSketches.ts`.

### 6.2. Testing & Stability

- Treat each sketch as both:
  - A **visual test**,
  - A **demo**.
- If a module breaks, its sketch will look obviously wrong → easy to spot.

---

## 7. Long-Term Evolution

The architecture is set up so we can later add:

- **Fluid / MPM-ish solvers** built on compute shaders.
- **Raymarching frameworks** using SDF utilities and TSL.  
- **Website integration**:
  - Using the engine in a content-driven site (MDX, Contentlayer, etc.).
- **Agent pipelines**:
  - CI tasks where agents add new modules or refactor existing ones safely.

The key is: we **never** lose sight of the layering:

> Foundation app → Engine layer → Sketches → Final experiences.
