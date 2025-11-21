e# TSL/WebGPU Creative Engine — Master Plan

## 1. Vision
We are transforming the `fragments-boilerplate` into a production-grade **TSL (Three.js Shading Language) & WebGPU Creative Engine**. 

Instead of building a separate "game engine" abstraction, we are building a **modular pipeline of TSL functions** that live directly in the project. This "Glass Engine" approach means the code is the engine: transparent, portable, and hot-swappable.

**Core Philosophy:**
- **Foundation First:** We build upon the working `fragments-boilerplate` (Vite, R3F, TanStack Router).
- **TSL is the Engine:** All graphics logic (materials, particles, post-processing) exists as composable TSL functions in `src/tsl/`.
- **Sketch-Driven:** Every feature is developed and tested via a dedicated sketch in `src/sketches/`.
- **Direct Porting:** We systematically integrate high-quality resources (WebGPU examples, portfolio effects) with minimal modification, preserving their advanced capabilities.

---

## 2. Architecture Overview

### The Stack
- **Runtime:** React 19 + Vite
- **Graphics:** Three.js r181+ (WebGPU Renderer)
- **Scene Graph:** React Three Fiber + Drei
- **State:** Zustand + Leva (Controls)
- **Routing:** TanStack Router

### Directory Structure Strategy
We consolidate all "engine" logic into `src/tsl`. We do not create a separate `src/engine` folder. `src/tsl` **is** the engine.

```text
src/
├── components/
│   └── canvas/         # WebGPU-ready Canvas & Scene wrappers
├── tsl/                # THE ENGINE LAYER
│   ├── core/           # Shared types & config
│   ├── materials/      # Reusable TSL material factories
│   ├── postfx/         # Post-processing chains & effects
│   ├── fields/         # Noise, SDFs, Flow Fields
│   ├── particles/      # Compute-shader particle systems
│   ├── utils/          # Math, Color, lighting helpers
│   └── effects/        # Standalone visual effects (legacy/specific)
├── sketches/           # VISUAL TESTS & DEMOS
│   ├── materials/      # Demos for tsl/materials
│   ├── particles/      # Demos for tsl/particles
│   └── ...
└── routes/             # App routing
```

---

## 3. Roadmap

### Phase 0: Foundation & Inventory (Current)
- [x] Verify `fragments-boilerplate` is running.
- [x] Analyze `src/tsl` current contents (noise, effects, utils).
- [ ] Establish `DOCS/` as the single source of truth.
- [ ] Create `INVENTORY/` directory to stage external resources.

### Phase 1: The TSL Pipeline
**Goal:** Reorganize `src/tsl` into the target structure and implement the Core Types.
- [ ] Refactor `src/tsl` into `materials/`, `fields/`, `postfx/`, etc.
- [ ] Define strict TypeScript interfaces for "Engine Components" (MaterialConfig, PostFXChain).
- [ ] Ensure existing sketches (`flare-1`, `dawn-1`) continue to work.

### Phase 2: Core Systems Implementation
**Goal:** Implement the essential subsystems using "Direct Porting".
- **Materials:** Port PBR, Glass, and Stylized materials from inventory.
- **Fields:** Consolidate Noise and SDFs into a unified Fields API.
- **PostFX:** Create a chainable Post-Processing system (Bloom, Tone Mapping, Grain).

### Phase 3: Advanced Compute & Particles
**Goal:** Unlock the power of WebGPU Compute Shaders.
- **Compute Scaffolding:** Create standard patterns for GPGPU in TSL.
- **Particle Systems:** Port "Attractors", "Flow Fields", and "Boids" examples.
- **Interaction:** Wire mouse/pointer data into TSL nodes.

### Phase 4: Polish & Presets
**Goal:** Make it production-ready and easy to use.
- **Presets:** Create "Hero" configurations (one-line setups for beautiful scenes).
- **Optimization:** Performance profiling and shader optimization.
- **Final Docs:** Complete API reference and Developer Guides.

---

## 4. Implementation Guidelines

### 1. Exact Code Ports
When porting from `INVENTORY/`:
- **Do not rewrite** logic if it works.
- **Do wrap** it in our TSL functional API.
- **Preserve** complexity (don't simplify "hard" math).
- **Fix** bugs or incompatibilities with r181.

### 2. No "Engine Classes"
Avoid object-oriented "Managers" or "Systems". Use functional composition:
- **Bad:** `class MaterialManager { create() { ... } }`
- **Good:** `export const createPhiMaterial = (params) => { ... }`

### 3. WebGPU Only
- Assume WebGPU is available.
- No WebGL fallbacks for "Core" engine features (unless provided by Three.js automatically).
- Focus on Compute Shaders and Node Materials.


