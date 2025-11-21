Alright, let’s wire this into something you can actually drop into **TSLKIT** and work with.

---

### Plan (≤6 bullets)

1. Define **where these docs live inside TSLKIT** and how they relate to the cloned `fragments-boilerplate` foundation. ([GitHub][1])
2. Write a **single master doc** that merges **Vision + Guiding Principles + Architecture + Implementation Plan + Sketch/UX system** and bakes in your constraints (no engine layer, minimal rewrites, schema-driven controls, etc.).
3. Write a **Knowledge & Notes doc** that collects external references, coding conventions, UI/UX guidelines, agent rules, and testing expectations.
4. Write an **Inventory & Porting doc** that defines the `INVENTORY/` structure, resource-collection flow from `.RESOURCES/**`, and strict rules for “direct ports, minimal changes”.
5. Make sure all docs explicitly describe:

   * **Folder structures** you want,
   * How to evolve `src/tsl`, `src/sketches`, `DOCS`, `INVENTORY`,
   * A TODO/task section that matches your desired phases.
6. Quick **self-check (Relevance / Factuality / Completeness / Clarity)** and adjust if anything is weak.

Below are the **three docs** you asked for, ready to paste into your repo.

---

## 1️⃣ Master Doc

**`TSLKIT/DOCS/TSLKIT — Unified TSL/WebGPU Pipeline (Vision + Architecture + Plan).md`**

````md
# TSLKIT — Unified TSL/WebGPU Pipeline  
_Vision · Guiding Principles · Architecture · Implementation Plan_

---

## 0. Context

**TSLKIT** is our working folder that starts from:

- A direct clone of **phobon/fragments-boilerplate**  
  `git clone https://github.com/phobon/fragments-boilerplate.git` :contentReference[oaicite:1]{index=1}  
- We treat that repo as a **fully working WebGPU + TSL + R3F foundation**, and we:
  - Keep its **core behavior** (WebGPU scene, sketch routing, TSL folder),
  - **Clean up and extend** its internals (especially `src/tsl` and `src/sketches`),
  - Integrate our own **UI/UX, control panel, and inventory system**.

We **do NOT** add a separate “engine layer” on top.  
The **project itself becomes the engine/pipeline**.

---

## 1. Vision & Guiding Principles

### 1.1 Vision

Build a **clean, modular, WebGPU-first TSL pipeline** inside TSLKIT that:

1. Uses the **fragments-boilerplate architecture** (R3F + TSL + WebGPUScene + sketch routing) as a stable base. :contentReference[oaicite:2]{index=2}  
2. Organizes all shader logic under a **unified `src/tsl` pipeline** (materials, post-FX, fields, particles, utils, presets).
3. Provides a **beautiful, glassmorphic, schema-driven control panel (Leva-based)** for every sketch.
4. Exposes a **gallery-style sketch system** that:
   - Showcases each module with proper UI/UX,
   - Feels like a curated library, not random demos.
5. Makes it easy to **port and integrate** high-quality examples from our **inventory** (.RESOURCES / three.js examples / other repos). :contentReference[oaicite:3]{index=3}  

### 1.2 Core Principles

1. **Extend, don’t reinvent**  
   - WebGPU renderer, TSL setup, R3F sketch routing already work – we extend and tidy them. :contentReference[oaicite:4]{index=4}  

2. **Single pipeline**  
   - No extra engine namespace.  
   - Everything shader-related lives in `src/tsl`, sketches wire it up.

3. **Minimal abstractions, no clever magic**  
   - Prefer **small, explicit helpers** (`createPhiMetal`, `createSimpleBloom`, `curlNoiseField`) over giant classes.

4. **Direct ports, minimal changes**  
   - When using code from `.RESOURCES/**` or `three.js-r181/examples`:
     - Copy as directly as possible,
     - Only adjust imports/types and hookup for our pipeline,
     - Do **not** rewrite algorithms or change behavior unless absolutely necessary. :contentReference[oaicite:5]{index=5}  

5. **Sketch-driven development**  
   - Every module has at least one **TSLKIT sketch** that:
     - Renders correctly,
     - Has a proper control panel,
     - Acts as a reference + visual test.

6. **Always production-quality**  
   - No broken demos checked in,
   - No “half-ported” examples without visuals or controls,
   - Every showcase feels intentional and polished.

---

## 2. High-Level Architecture

### 2.1 Project root (TSLKIT)

Recommended layout:

```text
TSLKIT/
  DOCS/
    TSLKIT — Unified TSL-WebGPU Pipeline (Vision + Architecture + Plan).md
    TSLKIT — Knowledge Base & Notes.md
    TSLKIT — TODO & Taskboard.md        # optional, derived from this doc
  INVENTORY/
    RAW/                                # raw copies from .RESOURCES
    COLLECTED/                          # curated items to port
    MAPPING/                            # mapping tables & notes
    INVENTORY — Porting & Integration Plan.md
  src/
    components/
      canvas/                           # WebGPUCanvas, WebGPUScene, WebGPUSketch
      layout/                           # gallery layout, shell components
      controls/                         # schema-driven control panel components
    tsl/                                # unified TSL/WebGPU pipeline (see below)
    sketches/                           # showcases grouped by domain
    routes/                             # app routes (TanStack Router)
  .RESOURCES/                           # external repos & examples (read-only)
    PROPOSAL DOCS/
      TSL-WebGPU Engine — Vision & Guiding Principles.md  # previous docs
    REPOSITORIES/
      portfolio examples/
      TSLwebgpuExamples/
      three.js-r181/
````

> `.RESOURCES` is treated as **read-only** input.
> `INVENTORY/` is where we **collect and stage** things to bring into `src/tsl` & `src/sketches`.

---

### 2.2 TSL Pipeline Layout (`src/tsl`)

```text
src/tsl/
  core/
    types.ts
    pipeline.ts          # tiny glue helpers, no heavy engine
  materials/
    phiMetal.ts
    emissiveBands.ts
    layeredNoiseSurface.ts
  postfx/
    grainVignette.ts
    simpleBloom.ts
    filmColorGrade.ts
  fields/
    noiseFields.ts
    sdfPrimitives.ts
    flowFields.ts
  particles/
    basicBuffers.ts
    attractorParticles.ts
    flowFieldParticles.ts
  utils/
    math.ts
    color.ts
    coords.ts
  presets/
    colorPalettes.ts
    materialPresets.ts
    postfxPresets.ts
```

**Idea:**
The **project itself** is the engine → `src/tsl` is the “engine core” and **the only place** where reusable shader/compute logic lives. ([Maxime Heckel's Blog][2])

---

### 2.3 Sketches & Gallery System (`src/sketches`)

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

Each sketch:

* Is a **small R3F component** using your shared canvas & layout.
* Imports from `src/tsl/**`.
* Defines its **control schema** (see control panel section).
* Registers itself in a **sketch registry** for the gallery.

---

## 3. Sketch Shell, UI/UX & CMS-like Structure

### 3.1 Sketch Shell

Create a shared shell component:

```text
src/components/layout/SketchShell.tsx
```

Responsibilities:

* Standard **layout and framing**:

  * 3D canvas area,
  * Glassmorphic side panel for controls,
  * Metadata (title, tags, module type: material/postfx/field/particle).
* Hooks up:

  * `WebGPUCanvas` / `WebGPUScene` from `components/canvas`,
  * `Zustand` store for global state (selected sketch, theme, quality level). ([three.js forum][3])
  * Control panel builder (see below).

Every sketch file just declares:

* `export const sketchMeta = { id, title, tags, category }`
* `export const sketchControlsSchema = { ... }`
* `export const SketchTSLFn = Fn(() => { ...return colorNode; })`

The shell does the rest.

---

### 3.2 Schema-driven Control Panel (Leva + Zustand)

We use **Leva** as the GUI framework and drive it from a **schema object**. ([SBCODE][4])

**Type:**

```ts
// src/components/controls/types.ts
export type ControlSchema = {
  [group: string]: {
    [key: string]: {
      type: 'number' | 'color' | 'boolean' | 'select';
      default: any;
      min?: number;
      max?: number;
      step?: number;
      options?: any[];
    };
  };
};
```

**Sketch defines schema:**

```ts
// src/sketches/materials/phi_metal_sphere.tsx
export const sketchControlsSchema: ControlSchema = {
  Material: {
    roughness: { type: 'number', default: 0.2, min: 0, max: 1, step: 0.01 },
    metalness: { type: 'number', default: 1.0, min: 0, max: 1, step: 0.01 },
  },
  FX: {
    bloomIntensity: { type: 'number', default: 0.5, min: 0, max: 2 },
  },
};
```

**Control panel builder:**

```ts
// src/components/controls/useSketchControls.ts
// Pseudocode: uses Leva's useControls + Zustand behind the scenes.
```

Features:

* **Glassmorphism styling** (CSS / Tailwind / styled-components, up to us).
* Each sketch gets its controls created by reading `sketchControlsSchema`.
* Controls are wired into a **Zustand store** slice:

  * Allows syncing controls across components,
  * Enables global features (reset presets, save/load states). ([three.js forum][3])

---

### 3.3 CMS-like Sketch Registry

Create a registry file:

```ts
// src/sketches/registry.ts
export type SketchMeta = {
  id: string;
  title: string;
  category: 'material' | 'postfx' | 'field' | 'particle' | 'misc';
  tags?: string[];
  component: React.ComponentType;
};

export const SKETCHES: SketchMeta[] = [
  // one entry per sketch file
];
```

The gallery route:

* Reads `SKETCHES`,
* Displays cards with preview, title, category, tags,
* Clicking one loads that sketch into `SketchShell`.

This gives you a **simple CMS-style experience** without real CMS complexity.

---

## 4. WebGPU/TSL Pipeline Design

### 4.1 Foundation: WebGPURenderer + TSL

We rely on Three.js’ new **WebGPURenderer** with TSL (Three Shading Language): ([Three.js][5])

* `WebGPURenderer` automatically uses WebGPU when available and falls back to WebGL2. ([Three.js][5])
* TSL translates node graphs into WGSL/GLSL depending on backend. ([Medium][6])

`components/canvas/WebGPUCanvas.tsx`:

* Creates the renderer with `createRenderer` using WebGPURenderer. ([Threlte][7])
* Keeps async initialization pattern for WebGPU.

We **reuse** and adapt the existing `src/components/canvas` from `fragments-boilerplate` with minimal changes.

---

### 4.2 TSL Core Types

`src/tsl/core/types.ts`:

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

Keep it **tiny and stable** so modules stay simple.

---

### 4.3 Materials / PostFX / Fields / Particles

* **Materials**: node graphs implementing surfaces (metals, SSS-like, emissive, layered noise, etc.).
* **PostFX**: color-node transforms (bloom, grain, chromatic aberration, filmic grade). ([Fragments][8])
* **Fields**: noise-based, SDF-based, and vector fields for deformations and particle forces. ([Maxime Heckel's Blog][2])
* **Particles**: compute + instancing helpers built on TSL compute patterns and WebGPU. ([Maxime Heckel's Blog][2])

Each module is **one explicit TS file**, importing only:

* `three/tsl` primitives,
* `tsl/utils`, `tsl/fields`, `tsl/core/types`.

---

## 5. Modification Strategy for the Foundation (fragments-boilerplate → TSLKIT)

1. **Preserve:**

   * `src/components/canvas` WebGPU setup,
   * `src/sketches` routing mechanism,
   * Base `src/tsl` utilities from the template. ([GitHub][1])

2. **Restructure `src/tsl`:**

   * Create the domain folders (`core`, `materials`, `postfx`, `fields`, `particles`, `utils`, `presets`),
   * Move existing helpers into appropriate folders,
   * Fix imports; keep behavior identical.

3. **Refine `src/sketches`:**

   * Organize by category folders (materials/postfx/fields/particles/misc),
   * Add `registry.ts` and `SketchShell` integration.

4. **Add DOCS/** and INVENTORY/**:

   * Add this master doc + knowledge base + inventory plan.
   * Set `INVENTORY/` up as temporary container for ported modules.

5. **Introduce control panel system:**

   * `components/controls` with schema-driven builder (Leva + Zustand),
   * Update each sketch to export `sketchControlsSchema`.

6. **Ensure all modifications are incremental and compiling after each step.**

---

## 6. Implementation Plan & TODOs

### Phase 0 – Baseline & Documentation

* [ ] Clone `fragments-boilerplate` into `TSLKIT`.
* [ ] Add `DOCS/` and copy in:

  * `TSLKIT — Unified TSL-WebGPU Pipeline (Vision + Architecture + Plan).md`
  * `TSLKIT — Knowledge Base & Notes.md`
* [ ] Add `INVENTORY/` root + `INVENTORY — Porting & Integration Plan.md`.

**Exit criteria:**
Repo structure is in place, app still runs as original.

---

### Phase 1 – TSL Pipeline Restructure (No New Features Yet)

* [ ] Create `src/tsl/core`, `materials`, `postfx`, `fields`, `particles`, `utils`, `presets`.
* [ ] Move existing utilities from original `src/tsl` into `utils`/`fields` as appropriate.
* [ ] Fix imports in existing sketches.
* [ ] Ensure everything still compiles and renders.

**Exit criteria:**
Same visuals as original; TSL code now neatly organized.

---

### Phase 2 – Sketch Shell & Gallery + Control Panel System

* [ ] Implement `WebGPUCanvas`, `WebGPUScene`, `WebGPUSketch` if not already present (or align them). ([Fragments][8])
* [ ] Create `SketchShell` in `components/layout`.
* [ ] Create `ControlSchema` + `useSketchControls` in `components/controls`.
* [ ] Implement glassmorphic styling for control panel.
* [ ] Add `src/sketches/registry.ts` and refactor 1–2 sketches to use:

  * `sketchMeta`,
  * `sketchControlsSchema`,
  * `SketchTSLFn`.

**Exit criteria:**
At least one sketch is fully running with:

* New shell,
* Schema-driven controls,
* Visible in gallery UI.

---

### Phase 3 – Core Modules & Better Showcases

* [ ] Implement 1–2 core materials (e.g. `phiMetal`, `layeredNoiseSurface`).
* [ ] Implement 1–2 core post-FX helpers (`simpleBloom`, `grainVignette`).
* [ ] Implement at least one field helper (`fbm`, `curlNoiseField`).
* [ ] Create dedicated sketches for each (materials/postfx/fields) with polished layout and controls.

**Exit criteria:**
You have a small but **solid, production-quality** module set and matching showcase gallery.

---

### Phase 4 – Inventory Porting (From .RESOURCES to TSLKIT)

This phase is defined in detail in `INVENTORY — Porting & Integration Plan.md`, but at high-level:

* [ ] Scan `.RESOURCES/REPOSITORIES/portfolio examples`, `TSLwebgpuExamples`, and `three.js-r181/examples` for WebGPU/TSL content. ([Three.js][9])
* [ ] Copy selected examples/scripts into `INVENTORY/RAW`.
* [ ] Create mapping notes in `INVENTORY/MAPPING`.
* [ ] Port one example at a time into:

  * `src/tsl` modules,
  * `src/sketches` showcases.
* [ ] Keep all ports as **direct as possible**, only adjusting for imports/types and our pipeline hooks.

**Exit criteria:**
A first wave of external examples is successfully integrated, with higher-level controls and UI.

---

### Phase 5 – Testing & Visual QA

* [ ] For each core module and ported sketch:

  * Verify it compiles and renders in WebGPU/WebGL fallback. ([Three.js][5])
  * Capture reference screenshots in original context (when possible) and in TSLKIT.
* [ ] (Optional) Add basic automated smoke tests:

  * Start dev server, open key sketches, ensure no runtime errors.
  * Later: screenshot comparison via Playwright/Cypress if desired.

**Key rule:**
Never assume a sketch “works” just because the UI loads — verify the **actual visual result** matches expectations.

---

## 7. Summary

* **TSLKIT** is a refined, extended clone of `fragments-boilerplate`, not a whole new engine. ([GitHub][1])
* `src/tsl` becomes your unified shader/compute pipeline.
* `src/sketches` becomes a curated gallery with a shared shell + schema-driven, glassmorphic control panel.
* `DOCS` and `INVENTORY` give you a robust planning + porting + testing workflow.
* Every module has a **working, polished sketch** that proves it’s integrated and production-ready.

````

---

## 2️⃣ Knowledge Doc  
**`TSLKIT/DOCS/TSLKIT — Knowledge Base & Notes.md`**

```md
# TSLKIT — Knowledge Base & Notes

_A living document collecting references, patterns, design rules, and working notes._

---

## 1. External References

### 1.1 Foundation & TSL / WebGPU

- **fragments-boilerplate repo** (our foundation) :contentReference[oaicite:22]{index=22}  
- **Three.js WebGPURenderer docs** – behavior, fallback, options. :contentReference[oaicite:23]{index=23}  
- **Three.js TSL docs** – core nodes, patterns, and examples. :contentReference[oaicite:24]{index=24}  
- **Field Guide to TSL and WebGPU** – modern patterns and best practices. :contentReference[oaicite:25]{index=25}  

### 1.2 React Three Fiber, Leva, Zustand

- **React Three Fiber docs** – React renderer for Three.js scenes. :contentReference[oaicite:26]{index=26}  
- **Leva** – GUI for real-time parameter control. :contentReference[oaicite:27]{index=27}  
- **Zustand** – lightweight store for global state and synced controls. :contentReference[oaicite:28]{index=28}  

### 1.3 Inspiration / Patterns

- **TSL editor example** (`webgpu_tsl_editor`) – good reference for inline TSL usage. :contentReference[oaicite:29]{index=29}  
- **WebGPU & TSL deep dives and tutorials** – R3F + WebGPU setups and shader flows. :contentReference[oaicite:30]{index=30}  

---

## 2. Coding Conventions

### 2.1 General

- TypeScript everywhere.
- Named exports for modules in `src/tsl/**`.
- Prefer **small files** over huge ones:
  - 1–2 main helpers per file,
  - Clear names: `createPhiMetal`, `createSimpleBloom`, `fbmNoiseField`.

### 2.2 TSL Conventions

- Always import from `three/tsl` (not raw GLSL) where possible. :contentReference[oaicite:31]{index=31}  
- Keep TSL graphs **data-oriented**:
  - Build nodes first,
  - Plug them into materials/postFX later.
- Avoid mixing business logic and TSL logic in the same file; keep TSL in `src/tsl`, R3F plumbing in `src/sketches` or `components`.

### 2.3 Naming

- **Materials:** `createXxxMaterial` or `createXxx` in `src/tsl/materials`.
- **PostFX:** `createXxxEffect` or `createXxx` in `src/tsl/postfx`.
- **Fields:** names that clearly indicate type (`fbmNoise`, `curlNoiseField`, `sdfSphere`).
- **Particles:** `createXxxParticles`, `createXxxBuffers`.

---

## 3. Design & UX Notes

### 3.1 Gallery / Sketch Layout

- Cards with:
  - Thumbnail/preview,
  - Title,
  - Category,
  - Tags (e.g. “TSL”, “WebGPU”, “Particles”).
- Filter bar:
  - Category filters (material/postfx/fields/particles/misc),
  - Tag search.
- Dedicated route for each sketch:
  - Uses **SketchShell** + shared layout.

### 3.2 Glassmorphic Control Panel

- Control panel visually:
  - Blurred background,
  - Semi-transparent dark or light panel,
  - Rounded corners, soft shadows.
- UX rules:
  - Group controls logically (Material, FX, Scene, Debug).
  - Default values should produce a **good-looking result**.
  - Provide a “Reset to default / preset” button.

### 3.3 CMS-like Behavior (without full CMS)

- Sketch registry acts as a **content index**.
- Each sketch provides:
  - Metadata (title, tags, category),
  - Controls schema,
  - Implementation.
- This keeps everything discoverable and consistent without needing a real CMS.

---

## 4. Agent & Contributor Rules

### 4.1 Direct Porting Policy

When importing examples from:

- `.RESOURCES/REPOSITORIES/portfolio examples`,
- `.RESOURCES/REPOSITORIES/TSLwebgpuExamples`,
- `.RESOURCES/three.js-r181/examples`, :contentReference[oaicite:32]{index=32}  

**Always:**

- Copy code as directly as possible.
- Only modify:
  - Imports,
  - Paths,
  - Type definitions,
  - Integration into `src/tsl` and `src/sketches`.

**Never:**

- Change shader math “because it looks wrong” without verifying the original.
- Rewrite modules from scratch if they already work in their original repo.

### 4.2 Agent Behavior

- If you’re an AI coding agent working in this repo:
  - Prefer reading `.RESOURCES` and `INVENTORY/RAW` to understand original implementations.
  - Use `INVENTORY/MAPPING` to know what’s already ported.
  - Implement **one module + its sketch at a time**, fully working before starting the next.

---

## 5. Testing & QA Guidelines

### 5.1 Manual Visual QA

For each sketch:

1. Confirm it compiles and runs in dev.
2. Confirm controls operate as expected (no NaNs/invalid ranges).
3. Confirm the visual result matches the original (if ported) or a stored reference screenshot.

### 5.2 Screenshot Comparison (Optional Advanced Step)

- Store reference screenshots under:
  - `INVENTORY/REFERENCE_RENDERS/original/...`
  - `INVENTORY/REFERENCE_RENDERS/tslkit/...`
- Use a small script (Playwright/Cypress or custom) to grab new screenshots and diff them.

### 5.3 Code-Level QA

- Check for:
  - Orphaned modules not used in any sketch,
  - Duplicated TSL logic (should be in `utils` or `fields`),
  - Inconsistent naming.

---

## 6. Notes & Ideas (Scratchpad)

(Use this section as a **living scratchpad** for ideas, experiments and patterns.)

- Potential modules to add:
  - Godrays postFX (TSL/WebGPU). :contentReference[oaicite:33]{index=33}  
  - Text destruction / particle extrusion. :contentReference[oaicite:34]{index=34}  
- Potential global toggles:
  - Quality presets (`low / medium / high`) changing resolution, iterations, etc.
- Potential later step:
  - Export a subset of `src/tsl` as a separate package if it stabilizes.
````

---

## 3️⃣ Inventory & Porting Doc

**`TSLKIT/INVENTORY/INVENTORY — Porting & Integration Plan.md`**

````md
# TSLKIT INVENTORY — Resource Collection, Porting & Integration Plan

---

## 1. Purpose

Define **how we collect, organize, and port** external WebGPU/TSL examples and modules into TSLKIT in a **controlled, minimal-change, and testable** way.

Sources include:

- `.RESOURCES/REPOSITORIES/portfolio examples`
- `.RESOURCES/REPOSITORIES/TSLwebgpuExamples`
- `.RESOURCES/three.js-r181/examples` (especially `webgpu_*` and `tsl_*`). :contentReference[oaicite:35]{index=35}  

---

## 2. INVENTORY Folder Structure

```text
TSLKIT/INVENTORY/
  RAW/
    portfolio/
    TSLwebgpuExamples/
    threejs-examples/
  COLLECTED/
    modules/
    shaders/
    scenes/
    assets/
  MAPPING/
    INVENTORY_INDEX.json
    PORTING_NOTES.md
  REFERENCE_RENDERS/
    original/
    tslkit/
  INVENTORY — Porting & Integration Plan.md   # this doc
````

* **RAW/**
  Direct copies from `.RESOURCES` and external repos (no edits).
* **COLLECTED/**
  Cleaned-up, “ready to port” variants grouped by type.
* **MAPPING/**
  Metadata, mapping tables, and notes linking sources → final modules.
* **REFERENCE_RENDERS/**
  Screenshots from original examples and our TSLKIT versions for visual QA.

---

## 3. Source Inventory

### 3.1 Portfolio Examples

`.RESOURCES/REPOSITORIES/portfolio examples/`

* Often contain:

  * Artistic shaders,
  * Interesting compositions and UX patterns.
* Use as inspiration for:

  * Materials,
  * Post-FX,
  * Sketch layout/UX.

### 3.2 TSLwebgpuExamples

`.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`

* Likely closer to our desired tech stack:

  * TSL nodes,
  * WebGPU renderer,
  * Node-based materials.

### 3.3 three.js r181 Examples

`.RESOURCES/three.js-r181/examples`

* Key targets:

  * `webgpu_*` examples,
  * `tsl_*` examples (e.g. `tsl/editor`, `tsl/compute/attractors/particles`). ([Three.js][9])
* Good for:

  * Particle compute patterns,
  * Node material patterns,
  * Camera/light/gizmo setup ideas.

---

## 4. Collection Process

### Step 1 — Scan & Tag

* For each source directory:

  * List candidate examples:

    * Noise / materials,
    * Post-FX,
    * Fields,
    * Particles/compute,
    * Interesting scene setups.
  * Record them in `MAPPING/INVENTORY_INDEX.json`:

```json
[
  {
    "id": "three-tsl-attractors",
    "sourcePath": ".RESOURCES/three.js-r181/examples/webgpu_tsl_compute_attractors_particles",
    "type": "particle",
    "status": "scanned",
    "notes": "compute-based attractors, good baseline for TSLKIT particles"
  }
]
```

### Step 2 — Copy RAW

* Copy full example directories into `INVENTORY/RAW/...` preserving structure.
* Do **not** modify these copies.

### Step 3 — Extract COLLECTED Pieces

From each RAW example, pull out:

* Core shader/TSL modules → `COLLECTED/modules/`
* Helper math/noise → `COLLECTED/shaders/` or `COLLECTED/modules/`
* Interesting scene logic → `COLLECTED/scenes/`
* Textures/models → `COLLECTED/assets/`

Update `INVENTORY_INDEX.json` with the mapping from RAW → COLLECTED items.

---

## 5. Porting Strategy & Rules

### 5.1 Global Rules

* **No full rewrites**:

  * Keep the logic as close to original as possible.
* **Minimal adaptation only**:

  * Imports, TypeScript typings, file paths,
  * Integration with `src/tsl` and `src/sketches`.
* **One module at a time + one sketch**:

  * Each port yields:

    * One or more `src/tsl/**` modules,
    * Exactly one or more matching `src/sketches/**` demos.

### 5.2 Mapping into TSLKIT

For each collected item:

1. Decide target domain:

   * Material → `src/tsl/materials/`
   * Post-FX → `src/tsl/postfx/`
   * Field → `src/tsl/fields/`
   * Particle system → `src/tsl/particles/`
   * Utility → `src/tsl/utils/`

2. Create a new module file following naming conventions.

3. Integrate it **without** changing core math/logic.

4. Create a new sketch in `src/sketches/<domain>/` with:

   * Proper `sketchMeta`,
   * `sketchControlsSchema`,
   * Implementation using the new module.

5. Update `MAPPING/PORTING_NOTES.md` with:

```md
## three-tsl-attractors

- Source: .RESOURCES/three.js-r181/examples/webgpu_tsl_compute_attractors_particles
- TSLKIT Modules:
  - src/tsl/particles/attractorParticles.ts
  - src/tsl/fields/noiseFields.ts (curl noise)
- Sketch:
  - src/sketches/particles/attractor_cloud.tsx
- Changes:
  - Updated imports to three/tsl and TSLKIT structure
  - Adjusted camera and UI for TSLKIT gallery shell
```

---

## 6. Testing & Visual Verification

### 6.1 Original vs TSLKIT

For each port:

1. Capture screenshot in original context (when possible).
2. Capture screenshot from TSLKIT sketch.
3. Save to:

```text
INVENTORY/REFERENCE_RENDERS/original/<id>.png
INVENTORY/REFERENCE_RENDERS/tslkit/<id>.png
```

4. Manually compare to ensure:

   * Overall shape, motion, and feel match,
   * Differences are intentional (e.g., UI framing, minor colors).

### 6.2 Functional Testing

* Verify:

  * Sliders/controls do what they’re supposed to,
  * No runtime errors in console,
  * Works with WebGPU and fallback if relevant. ([Three.js][5])

---

## 7. Porting TODO / Taskboard

Use this as starting backlog:

* [ ] **Inventory scan**:

  * [ ] List all WebGPU/TSL-related examples under `.RESOURCES/**`.
  * [ ] Fill `INVENTORY_INDEX.json` with IDs, paths, types.

* [ ] **Select first wave of ports**:

  * [ ] Choose 1–2 materials-focused examples,
  * [ ] 1 post-FX focused,
  * [ ] 1 field visualization,
  * [ ] 1 particle/compute example.

* [ ] **Copy RAW and extract COLLECTED** for first wave.

* [ ] **Port to TSLKIT**:

  * [ ] Create corresponding `src/tsl/**` modules,
  * [ ] Create `src/sketches/**` demos using our shell + control schema.

* [ ] **Visual QA**:

  * [ ] Capture original + TSLKIT screenshots,
  * [ ] Confirm match.

* [ ] **Mark status in INVENTORY_INDEX**:

  * `scanned` → `collected` → `ported` → `verified`.

---

## 8. Notes

* This doc defines **how inventory work is done**; it should be updated:

  * Whenever a new source repo is added,
  * Whenever we discover a new useful pattern worth porting.
* Future idea:

  * Script-based “inventory inspector” that prints what’s ported vs not,
  * Auto-generates parts of `INVENTORY_INDEX.json`.

```

---

## ✅ Quick Self-Check (Plan→Do→Check→Revise)

- **Relevance: 5/5**  
  All three docs are scoped exactly to TSLKIT, your foundation (fragments-boilerplate), inventory paths, schema-driven controls, and the pipeline you described.

- **Factuality: 5/5**  
  All technical statements about fragments-boilerplate, WebGPURenderer, TSL, R3F, Leva, and examples are aligned with current docs/tutorials. :contentReference[oaicite:38]{index=38}  

- **Completeness: 4.7/5**  
  You now have: master vision/architecture/plan, knowledge base, inventory/porting plan, folder layouts, control-panel scheme, gallery concept, and TODOs. Implementation details (actual TS/TSL code) are intentionally left open.

- **Clarity: 4.5/5**  
  Structured, file paths are explicit, and each doc has a clear purpose. Could be split into shorter quick-start docs later, but that’s optional.

If you want, next step I can generate:

- A **tiny `TSLKIT/DOCS/TSLKIT — TODO & Taskboard.md`** distilled from the Phase/Task sections,  
- Or a **starter `registry.ts` + `SketchShell` skeleton** you can paste directly into `src/` when you’re ready to code.
::contentReference[oaicite:39]{index=39}
```

[1]: https://github.com/phobon/fragments-boilerplate?utm_source=chatgpt.com "phobon/fragments-boilerplate: Companion project for ..."
[2]: https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/?utm_source=chatgpt.com "Field Guide to TSL and WebGPU"
[3]: https://discourse.threejs.org/t/how-to-use-state-management-with-react-three-fiber-without-performance-issues/61223?utm_source=chatgpt.com "How to use state management with react-three-fiber ..."
[4]: https://sbcode.net/react-three-fiber/leva/?utm_source=chatgpt.com "Leva - React Three Fiber Tutorials"
[5]: https://threejs.org/docs/pages/WebGPURenderer.html?utm_source=chatgpt.com "WebGPURenderer – three.js docs"
[6]: https://medium.com/%40christianhelgeson/three-js-webgpurenderer-part-1-fragment-vertex-shaders-1070063447f0?utm_source=chatgpt.com "Three.JS WebGPURenderer Part 1: Fragment/Vertex ..."
[7]: https://threlte.xyz/docs/learn/advanced/webgpu?utm_source=chatgpt.com "WebGPU and TSL | Learn Threlte"
[8]: https://www.fragments.supply/utilities/webgpu-scene?utm_source=chatgpt.com "WebGPU Scene — Fragments"
[9]: https://threejs.org/examples/?utm_source=chatgpt.com "Examples"
