# Project Roadmap: TSL-WebGPU Engine

## Phase 0: Resource Inventory & Preparation
- **Catalog resources** from `.RESOURCES/three.js-r181/examples/`, `.RESOURCES/REPOSITORIES/*`, and `.RESOURCES/TSLwebgpuExamples/` into `modules_staging/` with origin notes and priority tags (engine parity, demo value, or learning reference).
- **Extract TSL/WebGPU helpers** (noise, materials, compute patterns) from `three.js-r181/src/nodes/` and `three.js-r181/examples/webgpu_*` for later porting.
- **Define ingestion checklist**: license check, feature notes, porting difficulty, and candidate sketches each resource can support.

## Phase 1: Engine Core Architecture
- **Create `src/engine/`** with clear boundaries for materials, fields, particles/compute, presets, and post-processing chains.
- **Engine-aware sketch wrapper** to standardize lifecycle, camera/controls, resizing, and debug overlays across examples.
- **Config & types** for renderer, capabilities detection, and feature flags (e.g., compute availability, texture formats).
- **PostFX graph** abstraction for bloom/DOF/color grading, with slots for WebGPU-compatible passes.

## Phase 2: Modules & Feature Implementation
- **Materials system**: PBR-like, glass/metallic variants, SSS-inspired shading, and easy composition of TSL nodes.
- **Fields subsystem**: vector/flow fields, enhanced SDF operators, and field visualizers.
- **Particles & compute**: GPU-driven particle buffers, attractor behaviors, and texture/SSBO update patterns.
- **Presets**: curated one-liners that bundle materials, lighting, and post-processing into reusable recipes.
- **Integration layer**: helpers for combining materials + compute + postFX within sketches, including parameter schemas for Leva panels.

## Phase 3: Sketch Gallery & Testing
- **Example coverage**: at least one sketch per module under `src/sketches/engine/*`; seed with ports of `webgpu_compute_particles`, `webgpu_postprocessing`, and `webgpu_materials_*` to validate systems end-to-end.
- **Showcase gallery**: routed collection with thumbnails, metadata (dependencies, controls), and performance notes.
- **Testing harness**: automated lint/type checks plus lightweight visual regression captures for critical sketches.

## Phase 4: Polish & Expansion
- **Documentation**: developer guide for engine architecture, ingestion checklist, and module APIs; user-facing gallery notes.
- **UI/interaction upgrades**: leverage components from `react-bits-main` for richer control panels and layouts.
- **Further ports**: prioritize `three.js-tsl-sandbox-master`, `tsl-particles-of-a-thousand-faces-main`, and compute-heavy examples like `webgpu_compute_texture` and `webgpu_instance_mesh` for performance validation.
- **Performance/QA**: benchmark WebGPU initialization, memory usage of particle buffers, and postFX costs; provide fallbacks when compute is unavailable.

## **Phase 1: Resource Inventory & Aggregation**
*Goal: Centralize assets, scripts, and references for integration.*

1.  **Inventory Collection**
    *   Create a temporary `_inventory` or `modules_staging` folder within the project.
    *   Gather and copy relevant assets, scripts, and modules from the local `.RESOURCES` directory, specifically targeting:
        *   `.RESOURCES\REPOSITORIES`
        *   `.RESOURCES\three.js-r181\examples` (WebGPU and TSL nodes)
        *   `TSLwebgpuExamples`
        *   Portfolio examples.
2.  **Knowledge Update**
    *   Review changelogs and documentation for Three.js r181 and WebGPU to ensure all technical information is up-to-date.
    *   Identify useful nodes, helpers, effects, and components from the collected examples for porting.

## **Phase 2: Core Implementation & Showcase**
*Goal: Build the working core system and demonstrate capabilities.*

1.  **Core Development**
    *   Execute the modification plan to transform `fragments-boilerplate` into the custom TSL-WebGPU Engine.
    *   Implement all "Todo" tasks related to core system functionality.
    *   Ensure the system is fully working and ready for use.
2.  **Showcase System**
    *   Develop an advanced Content System and Showcase Gallery.
    *   Create "Sketches" (examples) for each module to visually represent their functionality.
3.  **Testing**
    *   Perform full system testing to verify module correctness and stability.

## **Phase 3: Expansion (formerly Phase 4)**
*Goal: Extend the system with advanced features.*

1.  **Porting & Expansion**
    *   Implement additional items and advanced modules from the collected resources.
    *   Expand the system capabilities based on the "Inventory & Integration Plan".

