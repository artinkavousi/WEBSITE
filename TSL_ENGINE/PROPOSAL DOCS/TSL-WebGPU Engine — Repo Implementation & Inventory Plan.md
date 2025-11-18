## 0. Purpose

This document takes the existing **Vision** and **Architecture & Implementation Plan** and turns them into a **concrete, repo‑specific roadmap** for this project:

- Current repo: `TSL_ENGINE` (fork/clone of `phobon/fragments-boilerplate` with WebGPU + TSL + R3F).
- Goal: evolve it into the **TSL/WebGPU Engine** described in the proposal docs, and wire in a rich **inventory of examples and modules** from your `.RESOURCES` sources.

The focus here is:

- How to **modify this repo** (folders, files, conventions).
- How to **ingest external resources** into a reusable **inventory**.
- How to phase implementation so we always have a **running app**.

---

## 1. Current State of This Repo

- **Foundation / App**
  - Vite + TanStack Router app under `TSL_ENGINE/src`.
  - Routing for sketches via `src/routes/sketches.$.tsx` using `import.meta.glob('../sketches/**/*.ts')`.
  - R3F + Drei stack, with a custom `WebGPUScene` component wrapping `WebGPURenderer`.
- **WebGPU / TSL Integration**
  - `WebGPUScene` in `src/components/canvas/webgpu_scene.tsx`:
    - Creates and configures `WebGPURenderer`.
    - Wraps the R3F `<Canvas>`.
  - `WebGPUSketch` in `src/components/canvas/webgpu_sketch.tsx`:
    - Uses `MeshBasicNodeMaterial` from `three/webgpu`.
    - Accepts a TSL `colorNode` and optional `onFrame` callback.
    - Provides a default “full‑screen plane” template.
- **TSL Utilities**
  - `src/tsl/**` already contains:
    - **Effects** (`effects/**`),
    - **Noise** (Perlin, simplex, fbm, curl, turbulence),
    - **Post processing** nodes (grain, halftone, chromatic aberration, etc.),
    - **Utils** for color, lighting, math, SDF shapes & operations.
  - These are the future **building blocks** of `src/engine/**`.
- **Sketches**
  - `src/sketches/**` currently contains a small set of sketches (`flare-1.ts`, `nested/dawn-1.ts`).
  - Sketch routing is already flexible (`../sketches/**/*.ts`), so adding `engine/**` subfolders will work.
- **Engine Layer**
  - There is **no `src/engine` yet**. The architecture doc describes it, but it is not implemented.
- **Inventory Container**
  - A new top‑level folder has been created for temporary resources:
    - `TSL_ENGINE/INVENTORY/`
      - `threejs-r181-examples/`
      - `TSLwebgpuExamples/`
      - `portfolio-examples/`
      - `webgpu-pipelines/`

---

## 2. Target Architecture (Repo‑Specific)

We keep the 3‑layer model from the proposal:

- **Layer 1 – Foundation**: existing `src/**` app (routing, WebGPUScene/WebGPUSketch, layout).
- **Layer 2 – Engine**: new, portable `src/engine/**` TSL‑KIT layer.
- **Layer 3 – Sketches / Content**: `src/sketches/**` + new `src/sketches/engine/**` demos.

### 2.1. Engine Folder Layout in This Repo

Create:

```text
src/engine/
  core/
    engineConfig.ts
    engineTypes.ts
    engineRegistry.ts
    createEngineSketch.ts
  materials/
  postfx/
  fields/
  particles/
  presets/
  utils/
    noise.ts
    color.ts
    math.ts
    coords.ts
```

- **Constraints**
  - Only depend on:
    - `three` & `three/tsl`,
    - Shared helpers from `src/engine/utils`,
    - Possibly a tiny bridge from `src/tsl/**` (no direct UI/router imports).
  - Designed so `src/engine/**` could be copied into another repo.

### 2.2. Sketch Layout Aligned with Engine

Extend `src/sketches/**` to mirror engine subsystems:

```text
src/sketches/
  engine/
    materials/
    postfx/
    fields/
    particles/
```

- Each engine module must have **at least one sketch** under `src/sketches/engine/**`.
- Sketches export a default function returning a **TSL node** compatible with `WebGPUSketch`’s `colorNode` prop.

### 2.3. Inventory Layout in This Repo

The inventory is a **staging area**, not production code:

```text
INVENTORY/
  threejs-r181-examples/     # raw examples copied from three.js r181
  TSLwebgpuExamples/         # dedicated TSL + WebGPU example repos
  portfolio-examples/        # your existing portfolio / lab projects
  webgpu-pipelines/          # complete WebGPU pipelines / small engines
```

- Inventory code stays **read‑only**; we port useful parts into `src/engine/**` and `src/sketches/**`.
- We never import directly from `INVENTORY` into the app runtime.

---

## 3. Phase 1 – Resource & Knowledge Inventory

Goal: **gather everything** you might want to port, in one place, and understand it.

### 3.1. Copy External Resources into `INVENTORY`

On your local machine:

- **three.js r181 examples**
  - Source: `.RESOURCES/three.js-r181/examples` (your local path).
  - Target: `TSL_ENGINE/INVENTORY/threejs-r181-examples/`.
  - Recommended subsets to copy:
    - `webgpu_*` examples,
    - `webgl_postprocessing_*`,
    - Any TSL‑related or node‑material examples.

- **TSL WebGPU examples**
  - Source: your `TSLwebgpuExamples` repos (e.g. custom demos, playgrounds).
  - Target: `TSL_ENGINE/INVENTORY/TSLwebgpuExamples/`.

- **Portfolio / lab projects**
  - Source: your portfolio repos that already use WebGL/WebGPU/TSL.
  - Target: `TSL_ENGINE/INVENTORY/portfolio-examples/`.

- **WebGPU pipeline repos**
  - Source: any projects where you already have a working WebGPU pipeline (even non‑three.js).
  - Target: `TSL_ENGINE/INVENTORY/webgpu-pipelines/`.

> In this environment we can’t see your `.RESOURCES` folder, so you’ll run the actual copy commands locally. The repo is now prepared with folders to receive them.

### 3.2. Create a Lightweight Inventory Index (Manual or JSON)

For each example you care about:

- Record:
  - **Source**: path in `INVENTORY` (e.g. `threejs-r181-examples/webgpu_tsl_materials/`).
  - **Category**: `material`, `postfx`, `particles`, `fields`, `pipeline`, `utility`.
  - **Notes**: what’s interesting (e.g. “nice curl noise field”, “WGSL compute particles”).
- Store this index as a simple **JSON or TS object** (e.g. `src/engine/core/resourceIndex.ts`) so agents and humans can query it later.

This turns your inventory into a **shopping list** for engine features.

### 3.3. Update Knowledge & Changelogs

While building the inventory:

- Check **three.js r181** release notes and WebGPU/TSL changelogs:
  - Identify TSL/WebGPU APIs used in examples that differ from your current version.
  - Note any **deprecated functions** or renamed imports.
- Collect links and notes (kept close to code, e.g. as comments in `utils` or in that `resourceIndex` file).

Outcome of Phase 1:

- `INVENTORY/**` filled with your external examples.
- A basic **resource index** mapping examples → potential engine modules.
- A rough understanding of **which examples are worth porting first**.

---

## 4. Phase 2 – Core Engine Skeleton in This Repo

Goal: implement the **minimal engine layer** that matches the architecture doc but fits this codebase.

### 4.1. Create Engine Core

Implement:

- `src/engine/core/engineTypes.ts`
  - Shared types:
    - `MaterialNodeConfig`,
    - `PostFXChain`,
    - `FieldNodeConfig`,
    - `ParticleSystemConfig`,
    - `EngineSketchConfig` (combining material/postfx/fields).
- `src/engine/core/engineConfig.ts`
  - Global presets:
    - Quality levels (low/medium/high),
    - Flags (enable/disable WebGPU‑only features).
- `src/engine/core/engineRegistry.ts`
  - Optional registry for:
    - Named materials,
    - PostFX chains,
    - Presets & hero sketches.
- `src/engine/core/createEngineSketch.ts`
  - Composition helper:
    - Accepts `EngineSketchConfig`,
    - Returns a `NodeRepresentation` (color node) that plugs into `WebGPUSketch`.

### 4.2. Wrap Existing TSL Utils into Engine Utils

Create thin wrappers that sit on top of `src/tsl/**`:

- `src/engine/utils/noise.ts`
  - Re‑export/compose `fbm`, `curl_noise_3d`, etc. into **field‑oriented functions**:
    - e.g. `noiseField3D(params): Node`.
- `src/engine/utils/color.ts`
  - Wrap `cosine_palette`, `tonemapping` into helpers:
    - e.g. `createPaletteMapper(options): Node`.
- `src/engine/utils/math.ts`, `coords.ts`
  - Coordinate transforms, domain repetition, etc.

This keeps `src/engine/**` “clean” while reusing existing TSL code.

### 4.3. First Engine Materials

Implement at least **two materials**:

- `src/engine/materials/basicLambert.ts`
- `src/engine/materials/phiMetal.ts`

Each should:

- Use TSL nodes (noise, fresnel, palettes) from `engine/utils`.
- Return `MaterialNodeConfig` with:
  - `colorNode`,
  - Optional `roughnessNode`, `metalnessNode`, etc.

### 4.4. Engine Sketches in This Repo

Add sketches under `src/sketches/engine/materials/`:

- `phi_metal.ts`
- `basic_lambert.ts`

Each sketch:

- Imports an engine material factory.
- Calls `createEngineSketch` with that material.
- Exports a default **TSL function** compatible with `WebGPUSketch`:
  - So `WebGPUSketch colorNode={colorNode()}` continues to work.

Outcome of Phase 2:

- `src/engine/**` exists with core types, utils, and a couple of real materials.
- `src/sketches/engine/materials/**` contains working demos of engine modules.

---

## 5. Phase 3 – PostFX, Fields, and Particles from Inventory

Goal: start pulling **real power features** from your inventory into the engine.

### 5.1. PostFX Chains

From:

- `INVENTORY/threejs-r181-examples` postprocessing demos,
- Any TSL post‑FX in `INVENTORY/TSLwebgpuExamples`,

Create engine modules in `src/engine/postfx/**`:

- e.g. `bloomChain.ts`, `grainVignette.ts`, `filmicColorGrading.ts`.

Each returns a `PostFXChain` using TSL’s postprocessing nodes, composable with materials via `createEngineSketch`.

### 5.2. Fields (Noise / SDF / Vector Fields)

From:

- Noise‑heavy examples in `INVENTORY/**`,
- Existing `src/tsl/noise/**` and `src/tsl/sdf/**`,

Create:

- `src/engine/fields/noiseFieldCurl.ts`
- `src/engine/fields/sdfPrimitives.ts`
- `src/engine/fields/flowFieldStream.ts`

Each exposes **field functions** that can:

- Modulate materials (patterns, breakup).
- Drive particles (velocity fields).
- Be visualized in dedicated `src/sketches/engine/fields/**` sketches.

### 5.3. Particles & Compute

Identify any **compute / particle examples** in:

- `INVENTORY/webgpu-pipelines/`,
- `INVENTORY/TSLwebgpuExamples/`,

Then:

- Implement `src/engine/particles/attractorParticles.ts`, `flowFieldParticles.ts` using TSL compute shaders.
- Add `src/sketches/engine/particles/**` sketches that:
  - Hook into `WebGPUScene` and `WebGPUSketch` or custom R3F components.

Outcome of Phase 3:

- Engine has **postFX**, **fields**, and **particles** modules derived from real, working examples.
- Sketches act as both **demos** and **visual tests**.

---

## 6. Phase 4 – Porting, Presets & Refinement

Goal: finish integrating the best of your inventory and polish the engine for reuse.

### 6.1. Systematic Porting from Inventory

Using your resource index:

- For each high‑value example:
  - Decide target subsystem: `materials`, `postfx`, `fields`, `particles`, or `utils`.
  - Implement a **single‑file engine module**.
  - Create a corresponding `src/sketches/engine/**` sketch.
  - Mark the example as “ported” in the index.

This gives you a clear sense of progress and avoids forgetting useful pieces.

### 6.2. Presets & Hero Sketches

Add:

- `src/engine/presets/heroSketches.ts`
- `src/engine/presets/colorPalettes.ts`

Use them to:

- Bundle combinations of materials + postFX + fields into **one‑liner recipes**.
- Drive **portfolio‑grade** sketches (mirroring your `portfolio-examples` inventory).

### 6.3. Engine Hardening

- Tighten types in `engineTypes.ts`.
- Ensure modules:
  - Take clear, typed params.
  - Are composable and hot‑swappable.
- Optionally prepare `src/engine/**` to be published as a separate package (`@tsl-kit/engine`).

Outcome of Phase 4:

- A **coherent TSL/WebGPU engine** living under `src/engine/**`.
- A **rich library of sketches** under `src/sketches/engine/**`.
- An **organized inventory** (`INVENTORY/**`) that feeds future modules.

---

## 7. Next Concrete Actions in This Repo

1. Populate `TSL_ENGINE/INVENTORY/**` locally from your `.RESOURCES` and example repos.
2. Add a simple **resource index** file (JSON or TS) under `src/engine/core/` listing high‑priority examples to port.
3. Create `src/engine/core/**` and `src/engine/utils/**` skeleton files and wire one or two materials (`basicLambert`, `phiMetal`) into new `src/sketches/engine/materials/**` sketches.
4. Iterate subsystem by subsystem (materials → postFX → fields → particles), always pairing new engine modules with new sketches.

This aligns the real repo with your **vision** and **architecture** while keeping changes incremental, testable, and friendly for both humans and AI agents.


