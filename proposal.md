# TSL-WebGPU Engine – Adoption & Expansion Plan

This plan aligns the active codebase with the guidance in `.RESOURCES/PROPOSAL DOCS` and outlines how to expand the engine with new modules, examples, and features.

## Source Documents
- **Vision & Guiding Principles** – long-term objectives for a modular TSL/WebGPU creative-coding engine.
- **Architecture & Implementation Plan** – desired engine layers, materials, post-processing, and compute foundations.
- **Repo Implementation & Inventory Plan** – expectations for directory layout, staging areas, and resource ingestion.
- **Implementation Roadmap & Resource Integration Plan** – phase breakdown, current-state audit, and high-value external references.

## Current Baseline
- Built atop `fragments-boilerplate` with Vite, TanStack Router, R3F/Drei/Leva/Zustand, and WebGPU renderer.
- Sketch routing under `src/sketches/*` and early TSL utilities (noise, SDFs, color, post-effects) already in place.

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

## Immediate Next Steps
1. Stand up `src/engine/` scaffolding and shared sketch wrapper.
2. Triage `.RESOURCES/` assets into `modules_staging/` with ingestion metadata.
3. Port a minimal `webgpu_compute_particles` sketch using the new wrapper to validate the pipeline.
4. Document module APIs and gallery structure in `src/engine/README.md` (to be added alongside scaffolding).
