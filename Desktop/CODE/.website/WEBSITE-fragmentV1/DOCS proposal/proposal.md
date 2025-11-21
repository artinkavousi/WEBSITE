
**Scope & assumptions (1 sentence):**
I’ll write a **single, clean, and optimized master documentation** for your unified TSL/WebGPU pipeline, built by extending a fork of `phobon/fragments-boilerplate` (Vite + R3F + TSL + WebGPU) without adding a separate “engine layer”. ([GitHub][1])

---

### Plan (≤6 conceptual bullets)

1. Define a **Master Doc skeleton**: overview, goals, architecture, folder layout, conventions, workflows, and roadmap.
2. Describe how the **foundation boilerplate** (routes, canvas, WebGPUScene/WebGPUSketch) and **TSL pipeline (`src/tsl`)** fit together. ([GitHub][1])
3. Specify a clean, unified **TSL pipeline structure** (materials, postfx, fields, particles, utils, presets) with examples.
4. Document **developer workflows** (add a new material, post-FX, field, or particle system).
5. Add a short **implementation roadmap** with phases that match how you actually build it out.
6. Run a quick **self-check (Relevance/Factuality/Completeness/Clarity)** and revise if anything is <4/5.

---

## 📄 TSL/WebGPU Pipeline — Master Documentation

> **File suggestion:** `DOCS/TSL-WebGPU-Pipeline.Master.md`

---

### 1. Overview

We are building a **unified TSL/WebGPU pipeline** by extending a **fork of `phobon/fragments-boilerplate`**:

* **Foundation (unchanged at the top):**

  * Vite, TanStack Router, React Three Fiber, Drei, Leva, Maath, Zustand. ([GitHub][1])
  * `src/components/canvas` → WebGPU-ready R3F canvas & scene components. ([GitHub][1])
  * `src/sketches` → each `.ts` file becomes a route (creative coding sketch). ([GitHub][1])
  * `src/tsl` → TSL-based shader utilities.

* **Our evolution (the “++” part):**

  * Keep the app & WebGPU scene setup mostly as-is.
  * **Reorganize and expand** `src/tsl` into a **clean, domain-based pipeline**.
  * Treat `src/sketches` as **thin, readable demos/tests** that import from `src/tsl`.

There is **no extra engine layer**; the repo itself is the engine.

---

### 2. Goals

1. **Single source of truth for shader logic**

   * All reusable GPU logic (materials, FX, fields, particles) lives under **`src/tsl`**.
   * Sketches just compose these pieces.

2. **Clear, predictable structure**

   * Anyone (or any AI agent) can guess where something should live:

     * Materials → `tsl/materials`
     * Post-FX → `tsl/postfx`
     * Noise/fields → `tsl/fields`
     * Particles → `tsl/particles`
     * Shared math/color → `tsl/utils`

3. **Minimal abstractions, maximum clarity**

   * Prefer small, explicit helpers instead of a giant “engine class”.
   * Use **TSL nodes and functions** as the core abstraction, following modern TSL/WebGPU practices. ([blog.maximeheckel.com][2])

4. **Sketch-driven development**

   * Every new feature has a corresponding sketch that:

     * Demonstrates it visually,
     * Serves as a usage example,
     * Acts as a simple regression test.

5. **Easy reuse in other projects**

   * `src/tsl` should be copy-able into another WebGPU/R3F app (or Next/React app using a WebGPUCanvas setup). ([wawasensei.dev][3])

---

### 3. High-Level Architecture

#### 3.1 Big-picture diagram

```mermaid
graph TD
  A[App Shell & Routes\n(src/routes)] --> B[Canvas & Scene\nsrc/components/canvas]
  B --> C[TSL/WebGPU Pipeline\nsrc/tsl/**]
  C --> D[Sketches\nsrc/sketches/**]
  D --> E[Rendered Experience\n(WebGPU / WebGL fallback)]
```

* **App Shell & Routes**

  * TanStack Router pages; mostly standard React app scaffolding. ([GitHub][1])
* **Canvas & Scene**

  * WebGPURenderer integration in an R3F `<Canvas>` or dedicated `WebGPUScene` helper. ([Fragments][4])
* **TSL/WebGPU Pipeline (`src/tsl`)**

  * All shader logic, organized by domain.
* **Sketches (`src/sketches`)**

  * Visual demos that wire `src/tsl` modules into scenes.

---

### 4. Folder Layout

> The exact names can be tweaked, but this is the **intended structure**.

```text
src/
  components/
    canvas/
      WebGPUCanvas.tsx
      WebGPUScene.tsx
      WebGPUSketch.ts
  tsl/
    core/
    materials/
    postfx/
    fields/
    particles/
    utils/
    presets/
  sketches/
    materials/
    postfx/
    fields/
    particles/
    misc/
  routes/
    ...
```

#### 4.1 `src/components/canvas`

* Houses **WebGPU-ready R3F canvas**:

  * `WebGPUCanvas` / `WebGPUScene`: creates a `WebGPURenderer` where available, with WebGL fallback if desired. ([wawasensei.dev][3])
  * `WebGPUSketch`: utility to plug a TSL sketch node into the scene.

*We avoid over-abstracting here; it’s just “how to get TSL + WebGPU rendering”.*

#### 4.2 `src/tsl` – the unified pipeline

```text
src/tsl/
  core/
    types.ts
    pipeline.ts       # optional light glue (no heavy engine)
  materials/
    phiMetal.ts
    emissiveStripes.ts
    layeredNoiseSurface.ts
  postfx/
    grainVignette.ts
    simpleBloom.ts
    filmGrade.ts
  fields/
    noiseFields.ts
    sdfPrimitives.ts
    flowFields.ts
  particles/
    basicBuffers.ts
    attractorParticles.ts
    flowParticles.ts
  utils/
    math.ts
    color.ts
    coords.ts
  presets/
    colorPalettes.ts
    materialPresets.ts
    postfxPresets.ts
```

* **`core/`**

  * Shared TS types: `MaterialConfig`, `PostFXConfig`, etc.
  * Optional tiny helpers for combining nodes.

* **`materials/`**

  * TSL “recipes” that output node configs for surfaces.

* **`postfx/`**

  * Node→Node utilities that apply filmic post-processing. ([blog.maximeheckel.com][2])

* **`fields/`**

  * Noise, SDFs, and vector fields to drive deformations and particles.

* **`particles/`**

  * Reusable compute + instancing helpers for GPU particles. ([blog.maximeheckel.com][2])

* **`utils/`**

  * Reusable math/color/coord primitives to avoid duplication.

* **`presets/`**

  * Bundled settings (e.g., “hero looks”) for quick reuse.

#### 4.3 `src/sketches`

* Mirrors the TSL domains for clarity:

```text
src/sketches/
  materials/
    phi_metal_sphere.tsx
    layered_noise_plane.tsx
  postfx/
    bloom_grain_demo.tsx
  fields/
    curl_flow_visualizer.tsx
  particles/
    attractor_cloud.tsx
  misc/
    playground.tsx
```

* Sketches:

  * Import from `src/tsl/**`,
  * Use R3F to set up scene/camera,
  * Wire parameters into Leva or similar controls.

---

### 5. TSL Pipeline Design & Conventions

#### 5.1 Core type patterns

**`src/tsl/core/types.ts`:**

```ts
import { Node } from 'three/tsl';

export type MaterialConfig = {
  colorNode: Node;
  roughnessNode?: Node;
  metalnessNode?: Node;
  normalNode?: Node;
  opacityNode?: Node;
};

export type PostFXFn = (inputColor: Node, params?: any) => Node;
```

Guidelines:

* Use small, explicit types.
* Avoid giant unions or complicated generics unless absolutely necessary.

---

#### 5.2 Materials

**Goal:** Provide **small, composable material helpers** that output node configs.

**Example:**

```ts
// src/tsl/materials/phiMetal.ts
import { Node, vec3 } from 'three/tsl';
import type { MaterialConfig } from '../core/types';

export type PhiMetalParams = {
  baseColor?: Node;
  roughness?: number;
  metalness?: number;
  anisotropy?: number;
};

export function createPhiMetal(params: PhiMetalParams = {}): MaterialConfig {
  const {
    baseColor = vec3(0.8, 0.7, 1.0),
    roughness = 0.2,
    metalness = 1.0,
  } = params;

  // Build TSL nodes (simplified pseudo-logic)
  const colorNode = baseColor;
  const roughnessNode = roughness;
  const metalnessNode = metalness;

  return {
    colorNode,
    roughnessNode,
    metalnessNode,
  };
}
```

**Conventions:**

* Function name: `createXxxMaterial` or `createXxx` inside `materials`.
* Parameters grouped in a `XxxParams` type.
* Return type is **always `MaterialConfig`**.

---

#### 5.3 Post-FX

Post-FX helpers are simple **color node transforms**:

```ts
// src/tsl/postfx/grainVignette.ts
import { Node, float } from 'three/tsl';

export type GrainVignetteParams = {
  grainAmount?: number;
  vignetteStrength?: number;
};

export function createGrainVignette(
  inputColor: Node,
  params: GrainVignetteParams = {},
): Node {
  const { grainAmount = 0.15, vignetteStrength = 0.35 } = params;
  // Use TSL noise & position nodes to perturb color
  // (actual implementation omitted here)
  const outputColor = inputColor; // placeholder
  return outputColor;
}
```

**Conventions:**

* `createXxxEffect` or `createXxx` inside `postfx`.
* First argument is always `inputColor: Node`.
* Return a single `Node` (the transformed color).

Chaining post-FX:

```ts
const color1 = createSimpleBloom(baseColor, bloomParams);
const finalColor = createGrainVignette(color1, grainParams);
```

---

#### 5.4 Fields

Fields provide noise and SDF nodes used by materials, post-FX, and particles.

```ts
// src/tsl/fields/noiseFields.ts
import { Node } from 'three/tsl';

export function fbm(position: Node, octaves = 4): Node {
  // build fbm from basis noise nodes
  return position; // placeholder
}

export function curlNoise(position: Node): Node {
  // curl(vec3 noise) node
  return position;
}
```

**Usage:**

* In materials: drive roughness/color patterns.
* In post-FX: distort UVs.
* In particles: derive velocity fields.

---

#### 5.5 Particles (baseline)

Particles combine instancing and compute shaders via TSL. ([blog.maximeheckel.com][2])

We keep a **minimal helper layer**:

```ts
// src/tsl/particles/basicBuffers.ts
import { instancedArray } from 'three/tsl';

export function createPositionBuffer(count: number) {
  return instancedArray(count, 'vec3');
}
```

Then higher-level modules like `attractorParticles.ts` can:

* Create position & velocity buffers,
* Define compute shaders via `wgslFn` or TSL helpers,
* Expose simple configuration.

---

#### 5.6 Utils & Presets

* `utils/math.ts` → remap, smoothstep, saturate, etc.
* `utils/color.ts` → palette lookup, mixing, tonemapping.
* `utils/coords.ts` → polar, spherical, tiling, domain repetition.
* `presets/` → curated config objects:

```ts
// src/tsl/presets/materialPresets.ts
export const phiMetalPresets = {
  default: { roughness: 0.2, metalness: 1.0 },
  soft: { roughness: 0.5, metalness: 0.8 },
};
```

---

### 6. Sketches: How They Use the Pipeline

#### 6.1 Example: Material sketch

```ts
// src/sketches/materials/phi_metal_sphere.tsx
import { Fn } from 'three/tsl';
import { createPhiMetal } from '@/tsl/materials/phiMetal';
import { createGrainVignette } from '@/tsl/postfx/grainVignette';

const sketch = Fn(() => {
  const material = createPhiMetal();
  const colorWithFx = createGrainVignette(material.colorNode);

  return colorWithFx;
});

export default sketch;
```

* All shader logic lives in `src/tsl`.
* Sketch just:

  * Calls helpers,
  * Returns the final color node to WebGPUSketch.

#### 6.2 Example: Field visualizer

```ts
// src/sketches/fields/curl_flow_visualizer.tsx
import { Fn, positionLocal } from 'three/tsl';
import { curlNoise } from '@/tsl/fields/noiseFields';

const sketch = Fn(() => {
  const field = curlNoise(positionLocal);
  // Map field vector → color
  return field; // simplified
});

export default sketch;
```

---

### 7. Developer Workflows

#### 7.1 Add a new material

1. Create a file in `src/tsl/materials/myMaterial.ts`.
2. Export `MyMaterialParams` and `createMyMaterial(params: MyMaterialParams): MaterialConfig`.
3. Add a sketch in `src/sketches/materials/my_material_demo.tsx`:

   * Import `createMyMaterial`,
   * Plug nodes into WebGPUSketch,
   * Expose params via Leva if needed.
4. Optionally add a preset in `tsl/presets/materialPresets.ts`.

#### 7.2 Add a new post-FX

1. Create `src/tsl/postfx/myEffect.ts` that exports a `PostFXFn`.
2. Use it in an existing or new sketch.
3. If it’s generally useful, add presets.

#### 7.3 Add a new field

1. Implement the field in `src/tsl/fields`.
2. Test with a simple visualizer sketch.
3. Use the same field in materials/particles later.

#### 7.4 Add a new particle system

1. Use `tsl/particles/basicBuffers` to create buffers.
2. Write compute shader(s) via TSL (`wgslFn`) as per best practices. ([blog.maximeheckel.com][2])
3. Provide a simple TS function to instantiate the system.
4. Create a dedicated sketch that:

   * Sets up the particle mesh/instancer,
   * Calls the compute update each frame.

---

### 8. Implementation Roadmap (Phases)

**Phase 0 – Baseline**

* Fork `fragments-boilerplate`.
* Run & verify current sketches/WebGPU pipeline.
* Create the `src/tsl` subfolders (empty) and leave behavior unchanged.

**Phase 1 – Restructure without new features**

* Move existing TSL helpers into the new `src/tsl` structure.
* Fix imports.
* No new logic yet; ensure everything still works.

**Phase 2 – First “clean” modules**

* Add 1–2 materials and 1–2 post-FX helpers using the patterns above.
* Create dedicated demos in `src/sketches/materials` and `src/sketches/postfx`.

**Phase 3 – Fields & Particle baseline**

* Extract noise/SDF into `tsl/fields`.
* Add at least one field visualizer sketch.
* Implement a basic particle system using `tsl/particles`.

**Phase 4 – Presets & polish**

* Add `tsl/presets` with a few hero configurations.
* Normalize naming and add short code comments where needed.
* Document “how to add X” in a short `README` in `src/tsl`.

---

### 9. Success Criteria

* All shader logic is discoverable in **`src/tsl`** with a clear subfolder structure.
* Sketches are small and mostly wiring/usage, not walls of shader code.
* New features follow a repeatable pattern:

  * **Helper in `src/tsl` + Sketch in `src/sketches`**.
* The entire pipeline (especially `src/tsl`) can be dropped into a new WebGPU/R3F project with minimal adaptation.

---

## ✅ CHECK (Self-evaluation)

* **Relevance:** 5/5
  Focuses entirely on your unified TSL/WebGPU pipeline built by extending `fragments-boilerplate`, with no extra “engine layer”.

* **Factuality:** 5/5
  Aligns with the actual tech stack and structure of `fragments-boilerplate` and current TSL/WebGPU practices. ([GitHub][1])

* **Completeness:** 4.5/5
  Covers architecture, folder layout, conventions, workflows, and roadmap; leaves implementation details (actual TSL code) to future work.

* **Clarity:** 4.5/5
  Structured sections, diagrams, and concrete examples; could be shortened for a “quickstart” audience, but that’s a separate doc.

Since all scores are ≥4, no major revision is needed.

If you want, next step I can generate a **super-short `src/tsl/README.md`** version of this doc that acts as a 1-page “how to work with this pipeline” cheat sheet.

[1]: https://github.com/phobon/fragments-boilerplate?utm_source=chatgpt.com "phobon/fragments-boilerplate: Companion project for ..."
[2]: https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/?utm_source=chatgpt.com "Field Guide to TSL and WebGPU"
[3]: https://wawasensei.dev/courses/react-three-fiber/lessons/webgpu-tsl?utm_source=chatgpt.com "WebGPU / TSL"
[4]: https://www.fragments.supply/utilities/webgpu-scene?utm_source=chatgpt.com "WebGPU Scene — Fragments"
