# TSLKIT — Complete Documentation
_Unified TSL/WebGPU Pipeline · Architecture · Integration · Knowledge Base_

---

## Table of Contents

1. [Context & Foundation](#1-context--foundation)
2. [Vision & Guiding Principles](#2-vision--guiding-principles)
3. [Architecture Overview](#3-architecture-overview)
4. [Sketch System & UI/UX](#4-sketch-system--uiux)
5. [WebGPU/TSL Pipeline Design](#5-webgputsl-pipeline-design)
6. [External Resources & Integration Strategy](#6-external-resources--integration-strategy)
7. [Inventory & Porting Workflow](#7-inventory--porting-workflow)
8. [Implementation Plan](#8-implementation-plan)
9. [Coding Conventions & Best Practices](#9-coding-conventions--best-practices)
10. [Testing & Quality Assurance](#10-testing--quality-assurance)

---

## 1. Context & Foundation

### 1.1 Project Base

**TSLKIT** is built upon a direct clone of **phobon/fragments-boilerplate**:

```bash
git clone https://github.com/phobon/fragments-boilerplate.git
```

This repository provides a **fully working WebGPU + TSL + R3F foundation** that includes:
- WebGPU renderer with fallback support
- TSL (Three Shading Language) integration
- React Three Fiber scene management
- Sketch routing system

### 1.2 Core Philosophy

**The project itself is the engine.**

We do **NOT** add a separate "engine layer" on top. Instead:
- Keep core behavior intact (WebGPU scene, sketch routing, TSL folder)
- Clean up and extend internals (`src/tsl` and `src/sketches`)
- Integrate custom UI/UX, control panel, and inventory system
- The pipeline lives directly in `src/tsl` as the "engine core"

---

## 2. Vision & Guiding Principles

### 2.1 Vision Statement

Build a **clean, modular, WebGPU-first TSL pipeline** that:

1. Uses fragments-boilerplate architecture (R3F + TSL + WebGPUScene + sketch routing) as stable base
2. Organizes all shader logic under unified `src/tsl` pipeline (materials, post-FX, fields, particles, utils, presets)
3. Provides beautiful, glassmorphic, schema-driven control panel (Leva-based) for every sketch
4. Exposes gallery-style sketch system that showcases each module with proper UI/UX
5. Makes it easy to port and integrate high-quality examples from inventory (.RESOURCES / three.js examples / other repos)

### 2.2 Core Principles

#### 1. Extend, Don't Reinvent
- WebGPU renderer, TSL setup, R3F sketch routing already work
- We extend and tidy them, not replace them

#### 2. Single Pipeline
- No extra engine namespace
- Everything shader-related lives in `src/tsl`
- Sketches wire it up

#### 3. Minimal Abstractions, No Clever Magic
- Prefer small, explicit helpers (`createPhiMetal`, `createSimpleBloom`, `curlNoiseField`)
- Over giant classes or complex abstractions

#### 4. Direct Ports, Minimal Changes
When using code from `.RESOURCES/**` or `three.js-r181/examples`:
- Copy as directly as possible
- Only adjust imports/types and hookup for our pipeline
- Do **not** rewrite algorithms or change behavior unless absolutely necessary

#### 5. Sketch-Driven Development
Every module has at least one **TSLKIT sketch** that:
- Renders correctly
- Has a proper control panel
- Acts as a reference + visual test

#### 6. Always Production-Quality
- No broken demos checked in
- No "half-ported" examples without visuals or controls
- Every showcase feels intentional and polished

---

## 3. Architecture Overview

### 3.1 Project Structure

```text
TSLKIT/
  DOCS/
    TSLKIT-Complete-Documentation.md          # this file
  
  INVENTORY/
    RAW/                                      # raw copies from .RESOURCES
      portfolio/
      TSLwebgpuExamples/
      threejs-examples/
      tutorials/
      sandboxes/
      textures/
    COLLECTED/                                # curated items to port
      modules/
      shaders/
      scenes/
      assets/
    MAPPING/                                  # mapping tables & notes
      INVENTORY_INDEX.json
      PORTING_NOTES.md
    REFERENCE_RENDERS/                        # visual QA screenshots
      original/
      tslkit/
  
  src/
    components/
      canvas/                                 # WebGPUCanvas, WebGPUScene, WebGPUSketch
      layout/                                 # SketchShell, gallery layout
      controls/                               # schema-driven control panel
    
    tsl/                                      # unified TSL/WebGPU pipeline
      core/
        types.ts
        pipeline.ts                           # minimal glue helpers
      materials/
        phiMetal.ts
        emissiveBands.ts
        layeredNoiseSurface.ts
        procedural/                           # procedural textures
      postfx/
        grainVignette.ts
        simpleBloom.ts
        filmColorGrade.ts
        rgbShift.ts
        pixelate.ts
      fields/
        noiseFields.ts
        sdfPrimitives.ts
        flowFields.ts
        textSDFField.ts
      particles/
        basicBuffers.ts
        attractorParticles.ts
        flowFieldParticles.ts
        textDestructionParticles.ts
      utils/
        math.ts
        color.ts
        coords.ts
      presets/
        colorPalettes.ts
        materialPresets.ts
        postfxPresets.ts
    
    sketches/                                 # showcases grouped by domain
      materials/
        phi_metal_sphere.tsx
        layered_noise_plane.tsx
      postfx/
        bloom_grain_demo.tsx
      fields/
        curl_flow_visualizer.tsx
      particles/
        attractor_cloud.tsx
        text_destruction.tsx
      misc/
        playground.tsx
      registry.ts                             # sketch registry & metadata
    
    routes/                                   # TanStack Router routes
  
  .RESOURCES/                                 # external repos & examples (read-only)
    PROPOSAL DOCS/
    REPOSITORIES/
      portfolio examples/
      TSLwebgpuExamples/
      three.js-r181/
```

### 3.2 Data Flow

```
.RESOURCES (read-only)
    ↓
INVENTORY/RAW (direct copies)
    ↓
INVENTORY/COLLECTED (extracted modules)
    ↓
src/tsl/** (integrated modules)
    ↓
src/sketches/** (showcase demos)
    ↓
Gallery UI (visual presentation)
```

---

## 4. Sketch System & UI/UX

### 4.1 Sketch Shell

**Location:** `src/components/layout/SketchShell.tsx`

**Responsibilities:**
- Standard layout and framing:
  - 3D canvas area
  - Glassmorphic side panel for controls
  - Metadata display (title, tags, module type)
- Integration points:
  - `WebGPUCanvas` / `WebGPUScene` from `components/canvas`
  - Zustand store for global state (selected sketch, theme, quality level)
  - Control panel builder

**Sketch Structure:**

```typescript
// Every sketch exports:
export const sketchMeta = {
  id: 'phi-metal-sphere',
  title: 'Phi Metal Sphere',
  category: 'material',
  tags: ['TSL', 'WebGPU', 'Metal', 'PBR']
};

export const sketchControlsSchema: ControlSchema = {
  // ... control definitions
};

export const SketchTSLFn = Fn(() => {
  // ... TSL implementation
  return colorNode;
});
```

### 4.2 Schema-Driven Control Panel

**Framework:** Leva + Zustand

**Type Definition:**

```typescript
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

**Example Usage:**

```typescript
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

**Features:**
- Glassmorphism styling (CSS / Tailwind / styled-components)
- Auto-generated controls from schema
- Zustand integration for state synchronization
- Global features: reset presets, save/load states

### 4.3 CMS-like Sketch Registry

**Location:** `src/sketches/registry.ts`

```typescript
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

**Gallery Features:**
- Card-based display with preview, title, category, tags
- Filter bar for categories and tag search
- Dedicated route for each sketch using SketchShell
- Simple CMS-style experience without real CMS complexity

### 4.4 UI/UX Design Guidelines

**Gallery Layout:**
- Thumbnail/preview cards
- Title and metadata
- Category badges
- Tag pills
- Filter and search capabilities

**Glassmorphic Control Panel:**
- Visual style:
  - Blurred background
  - Semi-transparent dark or light panel
  - Rounded corners, soft shadows
- UX rules:
  - Logical grouping (Material, FX, Scene, Debug)
  - Default values produce good-looking results
  - "Reset to default / preset" button
  - Responsive layout

---

## 5. WebGPU/TSL Pipeline Design

### 5.1 Foundation: WebGPURenderer + TSL

**Technology Stack:**
- Three.js **WebGPURenderer** with automatic fallback to WebGL2
- TSL (Three Shading Language) translates node graphs to WGSL/GLSL
- React Three Fiber for scene composition

**Canvas Setup:**

`components/canvas/WebGPUCanvas.tsx`:
- Creates renderer with WebGPURenderer
- Async initialization pattern for WebGPU
- Reuses and adapts existing structure from fragments-boilerplate

### 5.2 TSL Core Types

**Location:** `src/tsl/core/types.ts`

```typescript
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

**Design Goal:** Keep types tiny and stable so modules stay simple.

### 5.3 Module Categories

#### Materials (`src/tsl/materials/`)
- Node graphs implementing surfaces
- Examples: metals, SSS-like, emissive, layered noise
- Procedural textures in `materials/procedural/`

#### PostFX (`src/tsl/postfx/`)
- Color-node transforms
- Examples: bloom, grain, chromatic aberration, filmic grade, RGB shift, pixelation

#### Fields (`src/tsl/fields/`)
- Noise-based, SDF-based, and vector fields
- For deformations and particle forces
- Examples: FBM noise, curl noise, SDF primitives, text SDF

#### Particles (`src/tsl/particles/`)
- Compute + instancing helpers
- Built on TSL compute patterns and WebGPU
- Examples: basic buffers, attractor particles, flow field particles, text destruction

#### Utils (`src/tsl/utils/`)
- Reusable math, color, and coordinate utilities
- Keep DRY across all modules

#### Presets (`src/tsl/presets/`)
- High-level preset collections
- Color palettes, material presets, post-FX chains

### 5.4 Module Design Pattern

**Each module:**
- Is one explicit TS file
- Imports only:
  - `three/tsl` primitives
  - `tsl/utils`, `tsl/fields`, `tsl/core/types`
- Exports small, focused helpers
- No heavy classes or complex state management

---

## 6. External Resources & Integration Strategy

### 6.1 Overview

**Philosophy:** Treat external repos as **donor projects**. There aren't many drop-in TSL packages yet—most action lives in core three.js, official WebGPU/TSL examples, and community templates/sandboxes.

**Process:** Mirror into `.RESOURCES/` and `INVENTORY/RAW`, then extract focused modules into `src/tsl/**` and matching sketches into `src/sketches/**`.

### 6.2 Core / "Must-Use" TSL + WebGPU Sources

#### 1. Three.js TSL Wiki & Docs (Core API)
- **Purpose:** Canonical reference for TSL
- **Usage:** Standard library and reference truth
- **Integration:** Follow idioms when designing helpers and composing node graphs

#### 2. Three.js WebGPU + TSL Examples
- **Location:** `webgpu_*` and `tsl_*` examples
- **Content:**
  - `tslFn`, `storageTexture`, node materials
  - Postprocessing chains with WebGPURenderer
  - Compute shaders and particle patterns
- **Porting Strategy:**
  1. Mirror into `INVENTORY/RAW/threejs-examples/`
  2. Extract reusable bits into `COLLECTED/modules/`
  3. Map to `src/tsl/materials`, `postfx`, `fields`, `particles`

#### 3. Threejs_TSL_Tutorials (cmhhelgeson)
- **Content:** Step-by-step TSL + WebGPURenderer tutorials
- **Mining targets:**
  - Reusable noise/lighting patterns → `src/tsl/fields` or `utils`
  - Simple materials → `src/tsl/materials`
  - Basic compute patterns → `src/tsl/particles`

### 6.3 Starter Templates & Sandboxes (Donor Projects)

#### 1. brunosimon/three.js-tsl-template
- Minimalist TSL starter
- Reference for minimal WebGPU + TSL scene setup
- Guide for keeping entrypoints lean and TSL code modular

#### 2. brunosimon/three.js-tsl-sandbox
- TSL experiment collection
- Many mini projects: deformations, lighting, stylized materials
- **Strategy:**
  1. Pick a mini project
  2. Identify core node graph(s)
  3. Create `src/tsl/effects/` or `src/tsl/materials/` modules
  4. Add matching `src/sketches/` demo

#### 3. React Three Fiber WebGPU Starters
- Example: `r3f-webgpu-starter`
- Integration of `three/webgpu` + R3F + postprocessing
- **Architectural reference for:**
  - React host layer + WebGPU renderer separation
  - Post-FX pipeline structure with R3F + WebGPURenderer
  - Control and state wiring patterns

### 6.4 TSL-Ready Modules We Can Mine Directly

#### 1. boytchev/tsl-textures
- **Content:** Procedural TSL textures (noise, marble, planet, etc.)
- **Ideal for:**
  - `src/tsl/materials/procedural/*`
  - `src/tsl/fields` (displacement or masks)
  - `src/tsl/presets/materialPresets.ts`
- **Porting Rule:** Keep node graphs as-is, only adapt imports and TypeScript typings

#### 2. Codrops Interactive Text Destruction
- **Content:** Text exploding into particles using WebGPU + TSL
- **Design modules:**
  - `src/tsl/particles/textDestructionParticles.ts`
  - `src/tsl/fields/textSDFField.ts`
  - Hero sketch: `src/sketches/particles/text_destruction.tsx`
- **Showcase:** TSL compute + SDF + noise patterns

#### 3. WebGPU Post-Processing Demos with TSL
- Community repos with bloom, RGB shift, pixelation stacks
- **Integration plan:**
  1. Extract each pass: `Bloom.ts`, `RgbShift.ts`, `Pixelate.ts`
  2. Standardize interface: `(colorNode, params) => colorNode`
  3. Chain via simple helper in `tsl/core/pipeline.ts`

### 6.5 Deep-Dive Guides & Design References

#### 1. Three.js Shading Language Wiki + Forum
- Explains TSL as JS EDSL that emits GLSL/WGSL
- Shows canonical idioms
- **Usage:** Follow when naming helpers and composing node graphs

#### 2. Field Guide to TSL and WebGPU (Maxime Heckel)
- Long-form guide: compute, postfx, reusable utilities
- **Design north star for:**
  - `src/tsl/utils` and `fields` structure
  - Keeping TSL code renderer-agnostic

#### 3. TSL & WebGPU Tutorials
- Sources: SBCODE, Helgeson, R3F WebGPU courses
- **Topics:**
  - TSL compilation for WebGPU vs WebGL
  - Multi-backend scene architecture
- **Use for:**
  - WebGPURenderer setup refinement
  - Fallback behavior
  - Compute patterns

#### 4. Community Discussions
- Bruno Simon, three.js discourse
- **Sanity checks:**
  - Are we over-abstracting?
  - Is this pattern aligned with TSL direction?

### 6.6 Resource-to-TSLKIT Mapping

**Consistent flow through INVENTORY workflow:**

1. **Mirror**
   - Add external repos under `.RESOURCES/REPOSITORIES/`
   - Copy relevant folders into `INVENTORY/RAW/` (unchanged)

2. **Collect**
   - Extract reusable parts into `INVENTORY/COLLECTED/modules/`, `shaders/`, `scenes/`, `assets/`
   - Document in `INVENTORY/MAPPING/INVENTORY_INDEX.json`

3. **Port**
   - Create `src/tsl/**` module with minimal changes
   - Create `src/sketches/**` demo with shell + control schema
   - Add note in `INVENTORY/MAPPING/PORTING_NOTES.md`

4. **Verify**
   - Compare original vs TSLKIT visual output using `REFERENCE_RENDERS/`
   - Mark as "ported" only when:
     - Compiles cleanly
     - Renders correctly
     - Has proper control panel and metadata

---

## 7. Inventory & Porting Workflow

### 7.1 Purpose

Define **how we collect, organize, and port** external WebGPU/TSL examples and modules into TSLKIT in a **controlled, minimal-change, and testable** way.

### 7.2 Source Categories

#### Portfolio Examples
- Location: `.RESOURCES/REPOSITORIES/portfolio examples/`
- Content: Artistic shaders, interesting compositions, UX patterns
- Use for: Materials, Post-FX, sketch layout/UX inspiration

#### TSLwebgpuExamples
- Location: `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`
- Content: TSL nodes, WebGPU renderer, node-based materials
- Closer to desired tech stack

#### three.js r181 Examples
- Location: `.RESOURCES/three.js-r181/examples`
- Key targets: `webgpu_*` and `tsl_*` examples
- Good for: Particle compute patterns, node material patterns, scene setup ideas

#### External Repos/Libs Mirrored into INVENTORY
Beyond local `.RESOURCES/REPOSITORIES`:
- Three.js TSL + WebGPU examples → `INVENTORY/RAW/threejs-examples/`
- TSL tutorials & sandboxes → `INVENTORY/RAW/tutorials/`, `sandboxes/`
- Procedural texture packs → `INVENTORY/RAW/textures/`

### 7.3 Collection Process

#### Step 1: Scan & Tag
For each source directory:
1. List candidate examples (noise/materials, post-FX, fields, particles/compute, scene setups)
2. Record in `MAPPING/INVENTORY_INDEX.json`:

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

#### Step 2: Copy RAW
- Copy full example directories into `INVENTORY/RAW/...` preserving structure
- Do **not** modify these copies (read-only reference)

#### Step 3: Extract COLLECTED Pieces
From each RAW example, pull out:
- Core shader/TSL modules → `COLLECTED/modules/`
- Helper math/noise → `COLLECTED/shaders/` or `COLLECTED/modules/`
- Interesting scene logic → `COLLECTED/scenes/`
- Textures/models → `COLLECTED/assets/`

Update `INVENTORY_INDEX.json` with RAW → COLLECTED mapping.

### 7.4 Porting Strategy & Rules

#### Global Rules

1. **No full rewrites**
   - Keep logic as close to original as possible

2. **Minimal adaptation only**
   - Imports, TypeScript typings, file paths
   - Integration with `src/tsl` and `src/sketches`

3. **One module at a time + one sketch**
   - Each port yields:
     - One or more `src/tsl/**` modules
     - Exactly one or more matching `src/sketches/**` demos

#### Mapping Process

For each collected item:

1. **Decide target domain:**
   - Material → `src/tsl/materials/`
   - Post-FX → `src/tsl/postfx/`
   - Field → `src/tsl/fields/`
   - Particle system → `src/tsl/particles/`
   - Utility → `src/tsl/utils/`

2. **Create module file** following naming conventions

3. **Integrate without changing core math/logic**

4. **Create sketch** in `src/sketches/<domain>/` with:
   - Proper `sketchMeta`
   - `sketchControlsSchema`
   - Implementation using new module

5. **Update porting notes** in `MAPPING/PORTING_NOTES.md`:

```markdown
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

### 7.5 Status Tracking

Track each item through stages in `INVENTORY_INDEX.json`:
- `scanned` → item identified and catalogued
- `collected` → extracted into COLLECTED/
- `ported` → integrated into src/ with sketch
- `verified` → visual QA passed

---

## 8. Implementation Plan

### Phase 0: Baseline & Documentation

**Tasks:**
- [ ] Clone `fragments-boilerplate` into `TSLKIT`
- [ ] Add `DOCS/` with this complete documentation
- [ ] Add `INVENTORY/` root structure
- [ ] Verify app still runs as original

**Exit Criteria:** Repo structure in place, app still runs as original.

---

### Phase 1: TSL Pipeline Restructure

**Tasks:**
- [ ] Create `src/tsl/` subfolders: `core`, `materials`, `postfx`, `fields`, `particles`, `utils`, `presets`
- [ ] Move existing utilities into appropriate folders
- [ ] Fix imports in existing sketches
- [ ] Ensure everything compiles and renders

**Exit Criteria:** Same visuals as original; TSL code neatly organized.

---

### Phase 2: Sketch Shell & Gallery + Control Panel System

**Tasks:**
- [ ] Implement/align `WebGPUCanvas`, `WebGPUScene`, `WebGPUSketch`
- [ ] Create `SketchShell` in `components/layout`
- [ ] Create `ControlSchema` + `useSketchControls` in `components/controls`
- [ ] Implement glassmorphic styling for control panel
- [ ] Add `src/sketches/registry.ts`
- [ ] Refactor 1–2 sketches to use new system

**Exit Criteria:** At least one sketch fully running with:
- New shell
- Schema-driven controls
- Visible in gallery UI

---

### Phase 3: Core Modules & Better Showcases

**Tasks:**
- [ ] Implement 1–2 core materials (e.g., `phiMetal`, `layeredNoiseSurface`)
- [ ] Implement 1–2 core post-FX helpers (e.g., `simpleBloom`, `grainVignette`)
- [ ] Implement at least one field helper (e.g., `fbm`, `curlNoiseField`)
- [ ] Create dedicated sketches for each with polished layout and controls

**Exit Criteria:** Small but solid, production-quality module set with matching showcase gallery.

---

### Phase 4: Inventory Porting

**Tasks:**
- [ ] Scan `.RESOURCES/` for WebGPU/TSL content
- [ ] Copy selected examples into `INVENTORY/RAW`
- [ ] Create mapping notes in `INVENTORY/MAPPING`
- [ ] Port one example at a time:
  - Into `src/tsl` modules
  - Into `src/sketches` showcases
- [ ] Keep ports as direct as possible

**Exit Criteria:** First wave of external examples successfully integrated with controls and UI.

---

### Phase 5: Testing & Visual QA

**Tasks:**
- [ ] For each core module and ported sketch:
  - Verify compilation and rendering (WebGPU/WebGL fallback)
  - Capture reference screenshots (original and TSLKIT)
- [ ] (Optional) Add automated smoke tests:
  - Start dev server
  - Open key sketches
  - Ensure no runtime errors
  - Later: screenshot comparison via Playwright/Cypress

**Key Rule:** Never assume a sketch "works" just because UI loads—verify actual visual result matches expectations.

---

## 9. Coding Conventions & Best Practices

### 9.1 General Conventions

**Language & Exports:**
- TypeScript everywhere
- Named exports for modules in `src/tsl/**`
- Prefer small files over huge ones (1–2 main helpers per file)

**Naming:**
- Clear, descriptive names: `createPhiMetal`, `createSimpleBloom`, `fbmNoiseField`

### 9.2 TSL Conventions

**Imports:**
- Always import from `three/tsl` (not raw GLSL) where possible

**Graph Structure:**
- Keep TSL graphs data-oriented
- Build nodes first, plug into materials/postFX later

**Separation of Concerns:**
- Avoid mixing business logic and TSL logic in same file
- TSL in `src/tsl`, R3F plumbing in `src/sketches` or `components`

### 9.3 Naming Conventions by Domain

**Materials:**
- `createXxxMaterial` or `createXxx` in `src/tsl/materials`

**PostFX:**
- `createXxxEffect` or `createXxx` in `src/tsl/postfx`

**Fields:**
- Names clearly indicate type: `fbmNoise`, `curlNoiseField`, `sdfSphere`

**Particles:**
- `createXxxParticles`, `createXxxBuffers`

### 9.4 Direct Porting Policy

**When importing examples from external sources:**

**Always:**
- Copy code as directly as possible
- Only modify:
  - Imports
  - Paths
  - Type definitions
  - Integration into `src/tsl` and `src/sketches`

**Never:**
- Change shader math "because it looks wrong" without verifying original
- Rewrite modules from scratch if they already work in original repo

### 9.5 Modification Strategy for Foundation

Starting from fragments-boilerplate:

1. **Preserve:**
   - `src/components/canvas` WebGPU setup
   - `src/sketches` routing mechanism
   - Base `src/tsl` utilities from template

2. **Restructure `src/tsl`:**
   - Create domain folders
   - Move existing helpers into appropriate folders
   - Fix imports; keep behavior identical

3. **Refine `src/sketches`:**
   - Organize by category folders
   - Add `registry.ts` and `SketchShell` integration

4. **Add DOCS/ and INVENTORY/:**
   - Documentation structure
   - Temporary container for ported modules

5. **Introduce control panel system:**
   - `components/controls` with schema-driven builder
   - Update each sketch to export `sketchControlsSchema`

6. **Ensure incremental compilation:**
   - All modifications compile after each step

---

## 10. Testing & Quality Assurance

### 10.1 Manual Visual QA

**For each sketch:**

1. Confirm compilation and dev runtime
2. Confirm controls operate as expected (no NaNs/invalid ranges)
3. Confirm visual result matches original (if ported) or stored reference

### 10.2 Screenshot Comparison Workflow

#### Original vs TSLKIT

For each port:

1. Capture screenshot in original context (when possible)
2. Capture screenshot from TSLKIT sketch
3. Save to:
   ```
   INVENTORY/REFERENCE_RENDERS/original/<id>.png
   INVENTORY/REFERENCE_RENDERS/tslkit/<id>.png
   ```
4. Manually compare:
   - Overall shape, motion, and feel match
   - Differences are intentional (UI framing, minor colors)

#### Storage Structure

```
INVENTORY/REFERENCE_RENDERS/
  original/
    phi-metal-sphere.png
    attractor-cloud.png
  tslkit/
    phi-metal-sphere.png
    attractor-cloud.png
```

### 10.3 Functional Testing

**Verify:**
- Sliders/controls operate correctly
- No runtime errors in console
- Works with WebGPU and WebGL fallback
- Performance is acceptable

### 10.4 Code-Level QA

**Check for:**
- Orphaned modules not used in any sketch
- Duplicated TSL logic (should be in `utils` or `fields`)
- Inconsistent naming
- Missing TypeScript types
- Unnecessary abstractions

### 10.5 Advanced Testing (Optional)

**Automated Testing:**
- Small script with Playwright/Cypress
- Grab screenshots and diff them
- Smoke tests: start dev server, open key sketches, check for errors

### 10.6 QA Checklist Per Module

- [ ] Module compiles without errors
- [ ] Module has at least one working sketch
- [ ] Sketch has proper metadata and controls
- [ ] Visual output matches reference
- [ ] No console errors or warnings
- [ ] Controls have sensible defaults and ranges
- [ ] Code follows naming conventions
- [ ] Documentation/comments where needed
- [ ] No duplicated code
- [ ] Properly integrated into registry

---

## Appendix A: Quick Reference

### Key Files & Their Purposes

| File/Folder | Purpose |
|-------------|---------|
| `src/tsl/core/types.ts` | Core type definitions for TSL pipeline |
| `src/tsl/core/pipeline.ts` | Minimal glue helpers |
| `src/components/layout/SketchShell.tsx` | Shared sketch shell component |
| `src/components/controls/useSketchControls.ts` | Control panel builder |
| `src/sketches/registry.ts` | CMS-like sketch registry |
| `INVENTORY/MAPPING/INVENTORY_INDEX.json` | Master inventory tracking |
| `INVENTORY/MAPPING/PORTING_NOTES.md` | Detailed porting documentation |
| `INVENTORY/REFERENCE_RENDERS/` | Visual QA screenshots |

### Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### Key Concepts

- **TSL**: Three Shading Language - JS EDSL that emits GLSL/WGSL
- **WebGPU**: Modern GPU API with WebGL2 fallback
- **Schema-driven controls**: Auto-generated UI from schema definitions
- **Direct ports**: Copy original code with minimal changes
- **Sketch-driven development**: Every module needs a working demo

---

## Appendix B: External Resources

### Official Documentation
- [Three.js TSL Wiki](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)
- [Three.js WebGPURenderer Docs](https://threejs.org/docs/pages/WebGPURenderer.html)
- [Three.js WebGPU Examples](https://threejs.org/examples/?q=webgpu)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Leva Documentation](https://github.com/pmndrs/leva)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Learning Resources
- [Field Guide to TSL and WebGPU - Maxime Heckel](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/)
- [React Three Fiber with Leva - SBCODE](https://sbcode.net/react-three-fiber/leva/)
- [Fragments WebGPU Scene Utilities](https://www.fragments.supply/utilities/webgpu-scene)
- [WebGPU and TSL - Threlte](https://threlte.xyz/docs/learn/advanced/webgpu)

### Community Resources
- [fragments-boilerplate GitHub](https://github.com/phobon/fragments-boilerplate)
- [Bruno Simon TSL Template](https://github.com/brunosimon/three.js-tsl-template)
- [Bruno Simon TSL Sandbox](https://github.com/brunosimon/three.js-tsl-sandbox)
- [TSL Textures - boytchev](https://github.com/boytchev/tsl-textures)
- [Three.js TSL Tutorials - cmhhelgeson](https://github.com/cmhhelgeson/Threejs_TSL_Tutorials)
- [Three.js Discourse](https://discourse.threejs.org/)

---

## Document Maintenance

**Version:** 1.0  
**Last Updated:** 2025-11-21  
**Status:** Living Document

This documentation should be updated when:
- New source repositories are added
- New useful patterns worth porting are discovered
- Architecture or workflow changes
- New phases or modules are added
- Best practices evolve

---

**End of Documentation**

