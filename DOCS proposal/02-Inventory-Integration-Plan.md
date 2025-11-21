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

# TSL-WebGPU Engine — Implementation Roadmap & Resource Integration Plan

**Version:** 1.0  
**Date:** November 18, 2025  
**Status:** Ready for Implementation

---

## Executive Summary

This document outlines a comprehensive plan to evolve the TSL_ENGINE project from its current foundation (based on `phobon/fragments-boilerplate`) into a fully-featured **modular TSL/WebGPU creative coding engine** as described in the Vision & Guiding Principles and Architecture documents.

The implementation is structured in 4 phases:
1. **Phase 0: Resource Inventory & Preparation**
2. **Phase 1: Engine Core Architecture**
3. **Phase 2: Module Implementation & Porting**
4. **Phase 3: Polish, Documentation & Expansion**

---

## Current State Analysis

### What We Have

**Foundation** (fragments-boilerplate):
- ✅ Vite + TanStack Router working
- ✅ React Three Fiber + Drei + Leva + Zustand stack
- ✅ WebGPURenderer integration with proper async init
- ✅ Sketch routing system (`src/sketches/*` → dynamic routes)
- ✅ Basic TSL utilities:
  - Noise functions (Perlin, Simplex, Curl, FBM)
  - Effects (grain, vignette, LED, pixellation, canvas weave)
  - Post-processing (chromatic aberration, CRT scanlines, dither, halftone)
  - Color utilities (cosine palette, tonemapping)
  - SDF shapes and operations
  - Math utilities (complex numbers, coordinates)
  - Function helpers (bloom, screen aspect UV, repeating patterns)

**Tech Stack**:
```json
{
  "three": "^0.181.0",
  "@react-three/fiber": "9.4.0",
  "@react-three/drei": "10.7.6",
  "leva": "^0.10.1",
  "react": "^19.2.0"
}
```

### What We Need to Build

According to the vision documents, we need to add:

1. **Engine Layer** (`src/engine/`)
   - Core types and configuration
   - Materials system (PBR, SSS-like, metallic, glass)
   - PostFX chains (bloom, DOF, color grading)
   - Fields subsystem (vector fields, flow maps, enhanced SDF)
   - Particles & Compute (GPU-driven particle systems)
   - Presets (one-liner recipes)

2. **Integration Layer**
   - Engine-aware sketch wrapper
   - Material composition system
   - Compute shader scaffolding

3. **Demo/Test Sketches**
   - At least one sketch per engine module under `src/sketches/engine/`

---

## Available Resources Inventory

### A. Three.js R181 Official Examples

**Location:** `.RESOURCES/three.js-r181/examples/`

**Key WebGPU Examples to Port:**
- `webgpu_compute_*` - All compute shader examples
- `webgpu_particles_*` - GPU particle systems
- `webgpu_postprocessing_*` - Post-processing chains
- `webgpu_materials_*` - Advanced materials
- `webgpu_instance_*` - Instanced rendering
- Node editor playground utilities
- TSL function libraries in `three.js-r181/src/nodes/`

**High-Priority Examples:**
1. `webgpu_compute_particles` - Base for our particle system
2. `webgpu_compute_texture` - Compute pipeline patterns
3. `webgpu_instance_mesh` - Efficient instanced rendering
4. `webgpu_postprocessing` - PostFX chain architecture
5. `webgpu_tsl_*` - TSL usage patterns

### B. Portfolio & Reference Implementations

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/`

**1. Maxime Heckel's Blog** (`blog.maximeheckel.com-main`)
   - Production-quality TSL/WebGPU components
   - Advanced shaders and effects
   - Interactive visual essays architecture
   - [191 .tsx, 170 .ts files]

**2. Maxime Heckel's Portfolio** (`portfolio-main`)
   - Real-world WebGPU implementations
   - Material systems and effects
   - [121 .tsx, 97 .ts, 69 .glsl files]

**3. TSL Textures Project** (`tsl-textures-main`)
   - Texture generation patterns
   - Procedural texture utilities
   - [71 .js, 70 .html files with textures]

**4. Fragments Boilerplate (Original)** (`fragments-boilerplate-main`)
   - Reference for base architecture
   - Compare with our current state

### C. TSL/WebGPU Example Projects

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`

**High-Value Projects:**

1. **three.js-tsl-sandbox-master** [445 files]
   - Comprehensive TSL examples and patterns
   - 124 .js files with TSL implementations
   - **Priority: HIGH** - extensive TSL library

2. **tsl-particles-of-a-thousand-faces-main** [64 files]
   - Advanced particle systems
   - React integration patterns
   - **Priority: HIGH** - particle system reference

3. **webgpu-tsl-linkedparticles-main** [37 files]
   - Particle connection/attraction systems
   - Good for swarm behaviors

4. **webgputest-particlesSDF-main** [24 files]
   - SDF-based particle interactions
   - Compute shader patterns

5. **three-pinata-main** [77 files, 55 .ts]
   - TypeScript-first Three.js utilities
   - Type-safe patterns

6. **Splash-main** [36 files, 18 .wgsl]
   - Pure WGSL implementations
   - Low-level GPU patterns

7. **WaterBall-main** [34 files, 14 .wgsl]
   - Fluid simulation
   - Advanced compute shaders

8. **singularity-master** [83 files, 54 .js]
   - Complex visual effects
   - Production-quality shaders

9. **softbodies-master** [42 files, 22 .js]
   - Physics simulation
   - Deformable bodies

10. **fluidglass-main** [45 files]
    - Glass/fluid materials
    - Refraction effects

11. **flow-master** [27 files]
    - Flow field implementations
    - Vector field patterns

12. **interactwave-main** [40 files]
    - Interactive wave simulations
    - User interaction patterns

**Utility Projects:**
- `raymarching-tsl-main` - Raymarching framework
- `tsl-compute-particles` - Clean compute particle example
- `tsl-particle-waves` - Wave-based particle motion
- `breeze-main` - Atmospheric effects
- `roquefort-main` - Stylized rendering
- `Floaty-main` - Floating/suspension effects
- `codrops-batchedmesh-main` - Efficient batching patterns

**Reference Projects:**
- `ssgi-ssr-painter` - Screen-space effects
- `ssr-gtao-keio` - Advanced lighting
- `test-webgpu-master` - Testing patterns
- `tsl-webgpu-companion` - TSL helpers
- `fragments-boilerplate-vanilla-main` - Vanilla JS version

### D. UI/Interaction Examples

**Location:** `.RESOURCES/REPOSITORIES/other assets/`

**React Components Library** (`react-bits-main`):
- Modern UI patterns [994 files]
- 393 .jsx + 229 .tsx components
- Potential for enhanced control panels

**Animation Libraries:**
- `ElasticGridScroll-main`
- `ImageExpansionTypography-main`
- `KineticTypePageTransition-main`
- `OnScrollTypographyAnimations-main`
- `SlicedTextEffect-main`

---

## Phase 0: Resource Inventory & Preparation

### Objectives
- Catalog and extract all useful code from resource repositories
- Create organized temporary inventory structure
- Research Three.js r181 TSL/WebGPU API changes and capabilities

### Tasks

#### 0.1 Create Inventory Structure

```
TSL_ENGINE/
  _RESOURCE_INVENTORY/           # Temporary staging area
    threejs_examples/            # Extracted Three.js examples
      compute/                   # Compute shader examples
      particles/                 # Particle systems
      postprocessing/            # PostFX examples
      materials/                 # Material examples
      instances/                 # Instancing examples
      core/                      # Core TSL patterns
    portfolio_patterns/          # Patterns from portfolios
      maxime_blog/              # Maxime's blog patterns
      maxime_portfolio/         # Portfolio implementations
      tsl_textures/             # Texture generation
    tsl_projects/               # Full project references
      particles/                # Particle projects
      compute/                  # Compute-heavy projects
      materials/                # Material projects
      effects/                  # Effects projects
      physics/                  # Physics simulations
    ui_components/              # UI/control components
    _EXTRACTION_NOTES.md        # Notes on what was extracted and why
```

#### 0.2 Extract Three.js Examples

**Priority Files to Extract:**

From `three.js-r181/examples/`:
1. All `jsm/nodes/` utility files
2. `webgpu_compute_*.html` + corresponding `.js`
3. `webgpu_particles_*.html` + `.js`
4. `webgpu_postprocessing_*.html` + `.js`
5. `webgpu_materials_*.html` + `.js`
6. `webgpu_instance_*.html` + `.js`

From `three.js-r181/src/nodes/`:
1. All TSL function implementations
2. Node architecture patterns
3. Material node systems

**Extraction Script Pattern:**
```bash
# Example command structure
# Copy WebGPU compute examples
cp .RESOURCES/three.js-r181/examples/webgpu_compute_* TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/compute/

# Copy node source files
cp -r .RESOURCES/three.js-r181/src/nodes/ TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/core/nodes/
```

#### 0.3 Extract Project Examples

**High Priority:**
1. `three.js-tsl-sandbox-master` → Complete copy for reference
2. `tsl-particles-of-a-thousand-faces-main` → Extract particle modules
3. `webgpu-tsl-linkedparticles-main` → Extract linked particle logic
4. `three-pinata-main` → Extract TypeScript utilities
5. `Splash-main` → Extract WGSL compute patterns
6. `WaterBall-main` → Extract fluid simulation
7. `singularity-master` → Extract visual effects
8. `flow-master` → Extract flow field implementations

**Medium Priority:**
- softbodies-master
- fluidglass-main
- interactwave-main
- raymarching-tsl-main

**Extraction Strategy:**
- Copy entire project folder
- Create `_NOTES.md` in each with:
  - Key files of interest
  - Concepts to port
  - Integration approach

#### 0.4 Research & Documentation

**Three.js r181 Research:**
1. Read TSL documentation in `three.js-r181/docs/`
2. Study node system in `three.js-r181/src/nodes/`
3. Document API changes from earlier versions
4. List new TSL functions/features in r181

**Create Research Documents:**
- `_RESEARCH/TSL_r181_API_Reference.md`
- `_RESEARCH/WebGPU_Compute_Patterns.md`
- `_RESEARCH/Particle_System_Architectures.md`
- `_RESEARCH/Material_Node_Patterns.md`

### Exit Criteria
- ✅ All high-priority examples extracted and organized
- ✅ Extraction notes completed for each resource
- ✅ Research documents created
- ✅ Clear inventory of what's available for Phase 1

---

## Phase 1: Engine Core Architecture

### Objectives
- Create `src/engine/` folder structure
- Implement core types and configuration system
- Build foundation for materials, postfx, fields, particles
- Maintain 100% backward compatibility with existing sketches

### Tasks

#### 1.1 Create Engine Structure

```
src/engine/
  core/
    index.ts                    # Re-export all core modules
    engineTypes.ts              # TypeScript interfaces
    engineConfig.ts             # Global configuration
    engineRegistry.ts           # Module registry (optional)
    createEngineSketch.ts       # Sketch wrapper utility
  
  materials/
    index.ts
    core/
      MaterialNodeConfig.ts     # Base material types
      materialComposition.ts    # Material blending/layering
    library/
      basicLambert.ts          # Simple Lambert material
      phiMetal.ts              # Metallic material
      # More materials in Phase 2
  
  postfx/
    index.ts
    core/
      PostFXChain.ts           # Chain composition types
      PostFXPass.ts            # Individual pass base
    library/
      bloomChain.ts            # Bloom effect
      grainVignette.ts         # Grain + vignette
      # More FX in Phase 2
  
  fields/
    index.ts
    vector/
      flowField.ts             # Flow field generation
      curlField.ts             # Curl noise field
    sdf/
      primitives.ts            # Enhanced SDF shapes
      operations.ts            # SDF operations
  
  particles/
    index.ts
    core/
      ParticleSystemConfig.ts  # Base particle types
      computeScaffolding.ts    # Compute shader helpers
    library/
      attractorParticles.ts    # Attractor system
      flowFieldParticles.ts    # Flow-based particles
      # More systems in Phase 2
  
  presets/
    index.ts
    materials.ts               # Material presets
    postfx.ts                  # PostFX presets
    complete.ts                # Complete scene presets
  
  utils/
    index.ts
    noise.ts                   # Enhanced noise utilities
    color.ts                   # Color manipulation
    math.ts                    # Math helpers
    coords.ts                  # Coordinate transforms
```

#### 1.2 Implement Core Types

**File: `src/engine/core/engineTypes.ts`**

```typescript
import { Node } from 'three/tsl'
import { Material } from 'three'

// Material System Types
export interface MaterialNodeConfig {
  colorNode: Node
  roughnessNode?: Node
  metalnessNode?: Node
  normalNode?: Node
  emissiveNode?: Node
  opacityNode?: Node
  aoNode?: Node
  onBeforeCompile?: (material: Material) => void
  uniforms?: Record<string, any>
}

export interface MaterialParams {
  [key: string]: any
}

// PostFX System Types
export interface PostFXPass {
  name: string
  inputNode: Node
  outputNode: Node
  uniforms?: Record<string, any>
  enabled?: boolean
}

export interface PostFXChain {
  passes: PostFXPass[]
  inputNode: Node
  outputNode: Node
  controls?: Record<string, any>
}

// Field System Types
export interface VectorField {
  sampleAt: (x: Node, y: Node, z?: Node) => Node
  scale?: number
  octaves?: number
}

export interface SDFPrimitive {
  distance: (p: Node) => Node
  params: Record<string, any>
}

// Particle System Types
export interface ParticleSystemConfig {
  count: number
  computeInit?: Node
  computeUpdate?: Node
  renderMaterial: Material
  instanceAttributes?: Record<string, any>
}

// Engine Sketch Types
export interface EngineSketchConfig {
  material?: MaterialNodeConfig
  postfx?: PostFXChain
  fields?: VectorField[]
  particles?: ParticleSystemConfig
  background?: Node
}
```

#### 1.3 Implement Engine Configuration

**File: `src/engine/core/engineConfig.ts`**

```typescript
export interface EngineConfig {
  renderer: {
    preferWebGPU: boolean
    enableCompute: boolean
    antialias: boolean
    powerPreference: 'high-performance' | 'low-power' | 'default'
  }
  particles: {
    maxCount: number
    defaultComputeWorkgroupSize: number
  }
  postfx: {
    enabled: boolean
    quality: 'low' | 'medium' | 'high'
  }
  debug: {
    showStats: boolean
    logPerformance: boolean
  }
}

export const defaultEngineConfig: EngineConfig = {
  renderer: {
    preferWebGPU: true,
    enableCompute: true,
    antialias: true,
    powerPreference: 'high-performance',
  },
  particles: {
    maxCount: 1000000,
    defaultComputeWorkgroupSize: 64,
  },
  postfx: {
    enabled: true,
    quality: 'high',
  },
  debug: {
    showStats: false,
    logPerformance: false,
  },
}

let engineConfig = { ...defaultEngineConfig }

export const getEngineConfig = (): EngineConfig => engineConfig

export const setEngineConfig = (config: Partial<EngineConfig>): void => {
  engineConfig = { ...engineConfig, ...config }
}

export const resetEngineConfig = (): void => {
  engineConfig = { ...defaultEngineConfig }
}
```

#### 1.4 Create Engine Sketch Wrapper

**File: `src/engine/core/createEngineSketch.ts`**

```typescript
import { Fn, Node, vec3 } from 'three/tsl'
import { EngineSketchConfig } from './engineTypes'

/**
 * Creates an engine-aware sketch from a configuration
 * @param config - Engine sketch configuration
 * @returns A TSL Node (typically for colorNode)
 */
export const createEngineSketch = (config: EngineSketchConfig): Node => {
  const { material, postfx, background } = config

  return Fn(() => {
    // Start with background or default
    let finalColor = background || vec3(0)

    // Apply material if provided
    if (material?.colorNode) {
      finalColor = material.colorNode
    }

    // Apply postfx chain if provided
    if (postfx) {
      let processedColor = finalColor
      for (const pass of postfx.passes) {
        if (pass.enabled !== false) {
          // Apply pass (simplified, actual implementation more complex)
          processedColor = pass.outputNode
        }
      }
      finalColor = processedColor
    }

    return finalColor
  })()
}
```

#### 1.5 Implement First Two Materials

**File: `src/engine/materials/library/basicLambert.ts`**

```typescript
import { Fn, color, normalWorld, lightingContext, vec3 } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '@/engine/core/engineTypes'

export interface BasicLambertParams extends MaterialParams {
  baseColor?: [number, number, number]
  ambient?: number
}

export const createBasicLambert = (params: BasicLambertParams = {}): MaterialNodeConfig => {
  const {
    baseColor = [1, 1, 1],
    ambient = 0.1,
  } = params

  const colorNode = Fn(() => {
    const baseCol = color(...baseColor)
    const normal = normalWorld
    
    // Simple lambert lighting
    const lightDir = vec3(1, 1, 1).normalize()
    const ndotl = normal.dot(lightDir).max(0)
    
    return baseCol.mul(ndotl.add(ambient))
  })()

  return {
    colorNode,
  }
}
```

**File: `src/engine/materials/library/phiMetal.ts`**

```typescript
import { Fn, fresnel, normalWorld, positionWorld, vec3, sin, time } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '@/engine/core/engineTypes'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'

export interface PhiMetalParams extends MaterialParams {
  baseColor?: [number, number, number]
  metalness?: number
  roughness?: number
  animateNoise?: boolean
}

export const createPhiMetal = (params: PhiMetalParams = {}): MaterialNodeConfig => {
  const {
    baseColor = [0.8, 0.7, 0.5],
    metalness = 1.0,
    roughness = 0.3,
    animateNoise = true,
  } = params

  const colorNode = Fn(() => {
    const baseCol = vec3(...baseColor)
    const pos = positionWorld
    const normal = normalWorld
    
    // Noise-based perturbation
    const t = animateNoise ? time.mul(0.1) : 0
    const noise = simplexNoise3d(pos.mul(2).add(vec3(0, 0, t)))
    
    // Fresnel effect
    const f = fresnel()
    
    // Combine
    const metallic = baseCol.mul(f).add(noise.mul(0.1))
    
    return metallic
  })()

  return {
    colorNode,
    metalnessNode: Fn(() => metalness)(),
    roughnessNode: Fn(() => roughness)(),
  }
}
```

#### 1.6 Create Demonstration Sketches

**File: `src/sketches/engine/materials/basic_lambert.ts`**

```typescript
import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/library/basicLambert'

const sketch = Fn(() =>
  createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.8, 0.4, 0.2],
      ambient: 0.2,
    }),
  })
)

export default sketch
```

**File: `src/sketches/engine/materials/phi_metal.ts`**

```typescript
import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/library/phiMetal'

const sketch = Fn(() =>
  createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.9, 0.7, 0.4],
      metalness: 0.95,
      roughness: 0.2,
      animateNoise: true,
    }),
  })
)

export default sketch
```

### Exit Criteria
- ✅ Engine folder structure created
- ✅ Core types implemented and documented
- ✅ At least 2 working materials with demo sketches
- ✅ Materials accessible at `/sketches/engine/materials/*`
- ✅ Zero breaking changes to existing sketches

---

## Phase 2: Module Implementation & Porting

### Objectives
- Port and implement additional materials, postfx, particles, fields
- Integrate best patterns from resource inventory
- Create comprehensive demo sketches

### 2.1 Material System Expansion

**Materials to Implement** (in priority order):

1. **subsurfaceApprox** - Approximate SSS using depth/thickness
   - Source: Portfolio examples, three.js materials
   - Key features: Translucency, backlight scattering

2. **glassDispersion** - Glass with chromatic dispersion
   - Source: fluidglass-main, three.js examples
   - Key features: Refraction, dispersion, fresnel

3. **holographic** - Iridescent/holographic effect
   - Source: Portfolio examples, procedural materials
   - Key features: View-dependent color shift, noise

4. **stylizedToon** - Enhanced cel-shading
   - Source: roquefort-main, artistic examples
   - Key features: Stepped shading, outlines, color ramps

5. **emissiveFlare** - Animated emissive material
   - Source: flare-1.ts (existing), enhanced
   - Key features: HDR emission, bloom-ready, animation

6. **matcap** - Matcap/reflection probe material
   - Source: three.js examples
   - Key features: Efficient stylized lighting

**Each Material Requires:**
- TypeScript implementation in `src/engine/materials/library/`
- Parameter interface extending `MaterialParams`
- Demo sketch in `src/sketches/engine/materials/`
- Leva controls for real-time tweaking

### 2.2 PostFX System Implementation

**PostFX Chains to Build:**

1. **Bloom Chain**
   - Source: three.js postprocessing, portfolio examples
   - Passes: Threshold, blur, composite
   - Controls: Threshold, intensity, radius

2. **Color Grading Chain**
   - Source: Filmic pipelines, portfolio examples
   - Passes: Lift/gamma/gain, curves, LUT
   - Controls: Exposure, contrast, saturation, tint

3. **DOF Approximation**
   - Source: three.js examples, bokeh effects
   - Passes: CoC calculation, bokeh blur
   - Controls: Focus distance, aperture, bokeh shape

4. **Glitch/Glare Chain**
   - Source: Artistic examples, CRT effects
   - Passes: Chromatic aberration, scanlines, glare
   - Controls: Distortion, intensity, color shift

**PostFX Architecture:**
- Build on existing `src/tsl/post_processing/` effects
- Create chainable pass system
- Support conditional passes (quality settings)

### 2.3 Particle System Implementation

**Particle Systems to Build:**

1. **Attractor Particles**
   - Source: webgpu-tsl-linkedparticles, tsl-compute-particles
   - Features: Point attractors, orbital motion, trails
   - Compute: Position update, velocity integration

2. **Flow Field Particles**
   - Source: flow-master, particle-waves
   - Features: Curl noise field, flow lines, speed variation
   - Compute: Field sampling, advection

3. **SDF Particles**
   - Source: webgputest-particlesSDF
   - Features: SDF boundary, collision, spawning
   - Compute: SDF sampling, boundary response

4. **Swarm/Boids**
   - Source: three.js examples, softbodies patterns
   - Features: Separation, alignment, cohesion
   - Compute: Neighbor search, force accumulation

**Particle System Requirements:**
- Use `StorageInstancedBufferAttribute` for GPU data
- Implement compute shaders for init + update
- Create reusable compute scaffolding
- Support instanced rendering

### 2.4 Field System Enhancement

**Enhanced Field Utilities:**

1. **Vector Field Composer**
   - Combine multiple noise/flow fields
   - Operations: Add, multiply, cross product
   - Sources: Noise, textures, procedural

2. **Flow Map Integration**
   - Sample from flow map textures
   - Advection helpers
   - Time-varying flow

3. **SDF Field Utilities**
   - Gradient calculation
   - Raymarching framework
   - SDF texture baking

4. **Domain Repetition**
   - Infinite patterns
   - Space folding
   - Kaleidoscope effects

### 2.5 Porting Strategy

**For Each Resource:**

1. **Analyze** - Read code, identify key algorithms
2. **Extract** - Copy relevant functions/patterns
3. **Adapt** - Convert to our TSL/TS patterns
4. **Test** - Create demo sketch
5. **Document** - Add JSDoc, usage examples
6. **Integrate** - Add to engine exports

**Porting Priority Matrix:**

| Resource | Priority | Target Modules | Complexity |
|----------|----------|----------------|------------|
| three.js-tsl-sandbox | HIGH | All | Medium |
| tsl-particles-of-a-thousand-faces | HIGH | Particles | Medium |
| Splash-main | HIGH | Compute core | High |
| WaterBall-main | MEDIUM | Particles/Physics | High |
| singularity-master | MEDIUM | Effects/Materials | Medium |
| flow-master | MEDIUM | Fields | Low |
| webgpu-tsl-linkedparticles | HIGH | Particles | Low |
| three-pinata | MEDIUM | Utils/Types | Low |

### Exit Criteria
- ✅ At least 6 materials implemented
- ✅ 3+ postfx chains working
- ✅ 4+ particle systems functional
- ✅ Enhanced field utilities
- ✅ Each module has demo sketch
- ✅ All modules have Leva controls

---

## Phase 3: Polish, Documentation & Expansion

### Objectives
- Create comprehensive documentation
- Build preset library
- Optimize performance
- Expand with advanced features

### 3.1 Documentation

**Documents to Create:**

1. **ENGINE_README.md**
   - Overview of engine architecture
   - Quick start guide
   - Module catalog

2. **API_REFERENCE.md**
   - Complete API documentation
   - Type definitions
   - Code examples

3. **PORTING_GUIDE.md**
   - How to add new modules
   - Coding standards
   - Testing procedures

4. **SKETCHES_GUIDE.md**
   - How to create sketches
   - Best practices
   - Common patterns

5. **Per-Module Documentation**
   - JSDoc comments in all files
   - Usage examples in comments
   - Parameter explanations

### 3.2 Preset System

**Hero Presets** (`src/engine/presets/`):

```typescript
// Complete scene presets
export const presets = {
  // Materials
  materials: {
    chrome: createPhiMetal({ metalness: 1, roughness: 0.1 }),
    frostedGlass: createGlass({ roughness: 0.3, dispersion: 0.01 }),
    warmMetal: createPhiMetal({ baseColor: [0.9, 0.6, 0.3] }),
    // ... more material presets
  },
  
  // PostFX
  postfx: {
    cinematic: createPostFXChain([bloomPass, colorGradePass, grainPass]),
    retro: createPostFXChain([crtPass, vignettePass]),
    // ... more FX presets
  },
  
  // Complete scenes
  scenes: {
    particleNebula: {
      particles: attractorParticles({ count: 100000 }),
      postfx: presets.postfx.cinematic,
      background: starfield(),
    },
    // ... more scene presets
  },
}
```

### 3.3 Performance Optimization

**Optimization Tasks:**

1. **Compute Shader Optimization**
   - Workgroup size tuning
   - Memory access patterns
   - Reduce branching

2. **Material Optimization**
   - Shader complexity analysis
   - Uniform batching
   - Texture atlas usage

3. **Particle Optimization**
   - LOD for particle count
   - Frustum culling
   - Occlusion culling (future)

4. **PostFX Optimization**
   - Resolution scaling
   - Pass merging where possible
   - Quality presets

### 3.4 Advanced Features (Future)

**Roadmap for Beyond Phase 3:**

1. **Fluid Simulation**
   - Port WaterBall patterns
   - MPM/SPH-based fluids
   - Interactive fluid

2. **Raymarching Framework**
   - Full SDF raymarcher
   - Volumetric effects
   - Raymarch materials

3. **Advanced Physics**
   - Soft body simulation
   - Cloth simulation
   - Rigid body integration

4. **Agent Integration**
   - AI-friendly API
   - Code generation templates
   - Automated testing

### Exit Criteria
- ✅ All documentation complete
- ✅ Preset library with 10+ presets
- ✅ Performance profiling done
- ✅ Optimization opportunities identified
- ✅ Advanced features roadmap defined

---

## Migration & Compatibility Strategy

### Backward Compatibility

**Guarantee:**
- All existing sketches continue to work
- No breaking changes to base components
- TSL utilities remain in `src/tsl/` unchanged

**Integration Approach:**
- Engine modules are **additive only**
- Base sketch system untouched
- Opt-in engine usage via imports

### Gradual Migration Path

**For Existing Sketches:**

1. **Keep as-is** - They work fine
2. **Add engine modules** - Import specific features
3. **Full migration** - Use `createEngineSketch` wrapper

**Example Migration:**

```typescript
// Original sketch
const sketch = Fn(() => {
  const _uv = uv()
  const noise = simplexNoise3d(_uv.xy.toVar())
  return vec3(noise)
})

// Migrated to engine
const sketch = Fn(() => 
  createEngineSketch({
    material: createPhiMetal(),
    postfx: presets.postfx.cinematic,
  })
)
```

---

## Implementation Timeline

### Estimated Duration: 6-8 weeks

**Phase 0: Resource Inventory** (1 week)
- Days 1-2: Extract Three.js examples
- Days 3-4: Extract TSL projects
- Days 5-6: Research and documentation
- Day 7: Organize and review

**Phase 1: Engine Core** (2 weeks)
- Days 1-3: Folder structure + core types
- Days 4-7: First materials + material system
- Days 8-10: PostFX foundation
- Days 11-14: Demo sketches + polish

**Phase 2: Module Implementation** (3-4 weeks)
- Week 1: Material expansion (4 new materials)
- Week 2: PostFX chains (3 chains)
- Week 3: Particle systems (4 systems)
- Week 4: Field utilities + integration

**Phase 3: Polish & Documentation** (1-2 weeks)
- Days 1-4: Documentation writing
- Days 5-7: Preset library
- Days 8-10: Performance optimization
- Days 11-14: Testing and refinement

---

## Success Metrics

### Technical Metrics
- ✅ 100% backward compatibility maintained
- ✅ Engine modules can be copy-pasted to other projects
- ✅ Each module has 90%+ JSDoc coverage
- ✅ Performance: 60fps @ 1080p for all demos
- ✅ Zero breaking changes to fragments-boilerplate base

### User Experience Metrics
- ✅ New sketch creation time: < 5 minutes
- ✅ Material customization: < 10 lines of code
- ✅ Preset usage: 1-liner to apply
- ✅ Learning curve: Familiar if you know TSL basics

### Code Quality Metrics
- ✅ TypeScript strict mode enabled
- ✅ No `any` types (except where necessary)
- ✅ ESLint clean
- ✅ Leva controls for all parameters

---

## Risk Assessment & Mitigation

### Risk 1: Three.js API Changes
**Impact:** High  
**Probability:** Medium  
**Mitigation:** 
- Pin three.js version to 0.181.0
- Document version dependencies
- Create upgrade guide when needed

### Risk 2: Performance Issues
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- Early performance profiling
- Quality presets for different hardware
- LOD systems for heavy features

### Risk 3: Scope Creep
**Impact:** Medium  
**Probability:** High  
**Mitigation:**
- Strict phase boundaries
- MVP first, enhancements later
- Regular scope reviews

### Risk 4: Resource Porting Complexity
**Impact:** Medium  
**Probability:** Medium  
**Mitigation:**
- Start with simplest examples
- Incremental porting approach
- Skip overly complex patterns

---

## Next Steps

### Immediate Actions (Next 24 hours)

1. **Create folder structure**
   ```bash
   mkdir -p TSL_ENGINE/_RESOURCE_INVENTORY/{threejs_examples,portfolio_patterns,tsl_projects,ui_components}
   mkdir -p TSL_ENGINE/_RESEARCH
   ```

2. **Begin extraction**
   - Start with three.js compute examples
   - Extract 3-5 highest priority TSL projects

3. **Create research notes**
   - Document Three.js r181 TSL API
   - List available compute patterns

### First Week Goals

- Complete Phase 0 (Resource Inventory)
- Begin Phase 1 (Engine core structure)
- Have 2 materials working with demos

---

## Conclusion

This roadmap provides a clear, achievable path to transform TSL_ENGINE into a comprehensive, modular TSL/WebGPU creative coding engine while maintaining the solid foundation of fragments-boilerplate.

By following the phased approach:
1. We gather and organize all resources first
2. We build a clean, extensible architecture
3. We port and implement features systematically
4. We polish and document everything

The result will be:
- A production-ready TSL/WebGPU engine
- Extensive library of reusable modules
- Beautiful demo sketches showcasing capabilities
- A platform for future creative coding work

**Let's build something amazing.** 🚀

---

**Document Version:** 1.0  
**Last Updated:** November 18, 2025  
**Status:** Ready for Implementation
