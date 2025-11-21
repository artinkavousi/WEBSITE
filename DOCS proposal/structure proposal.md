Initial steps: I'll scan the project structure, peek into key engine/sketch files, then draft a concise upgrade proposal doc (sectioned markdown) describing current issues and a concrete re-org plan. I’ll keep it focused on real, incremental improvements to cohesion and duplication, not big-bang rewrites.

[10 tools called]

I’ve scanned the main engine and sketches folders and can already see duplicated “engine vs sketches vs tsl” layers; next I’ll peek at core engine + routing files to understand how everything wires together, then I’ll draft a focused upgrade proposal doc you can drop into the repo.

[11 tools called]

### TSL Engine – Proposed Upgrades (Structure & Cohesion)

You can drop this into a file like `DOCS/04-Engine-Refactor-Proposal.md` or similar.

---

## 1. Goals

- **Reduce duplication**: One canonical engine implementation, one canonical TSL library, no copy-pasted boilerplates.
- **Clarify layers**: Clean separation between **core engine**, **TSL building blocks**, **sketch content**, and **app shell (React/router/UI)**.
- **Make extension predictable**: Clear patterns for adding new materials, postfx, fields, particles, and sketches without touching 5 different places.
- **Support gradual evolution**: A phased plan that lets you refactor without breaking everything at once.

---

## 2. Current Structure Snapshot

- **Multiple app shells / boilerplates**
  - Root app under `src/` (React + TanStack Router) – this is the “real” app.
  - Legacy/variants under `engine/` and `temp_boilerplate/` with their own `src`, `routes`, `tsl`, etc.
- **Engine core (root `src/engine`)**
  - `core/`: `createEngineSketch.ts`, `engineTypes.ts`, `engineConfig.ts`, `sketchRegistry.ts`, with `engineRegistry.ts` and `resourceIndex.ts` currently empty stubs.
  - Feature modules: `fields/`, `materials/`, `particles/`, `postfx/`, `presets/`, `utils/`.
- **TSL library (root `src/tsl`)**
  - `noise/`, `post_processing/`, `utils/` with reusable building blocks (`simplex_noise_3d`, `cosine_palette`, `screen_aspect_uv`, etc.).
- **Sketch content (root `src/sketches`)**
  - `engine/*` (materials, postfx, particles, fields, presets) – demo sketches that exercise engine modules.
  - `tsl/postfx/*` – sketches that directly use TSL helpers.
  - Base examples like `flare-1.ts`, `nested/dawn-1.ts`.
  - Routing + loading via `routes/sketches.$.tsx` using `import.meta.glob('../sketches/**/*.ts')`.
- **Registry & metadata**
  - `src/engine/core/sketchRegistry.ts` – manual catalog of sketches + gallery sections.
- **Incomplete / placeholder areas**
  - `src/engine/particles/*` (`createAttractorSystem`, `createBoidsSystem`, etc.) mostly placeholders (dummy `Fn(() => vec3(0))`), not yet wired into a full compute pipeline.
  - `src/engine/core/engineRegistry.ts` and `resourceIndex.ts` are empty, suggesting a half-started resource catalog.

---

## 3. Key Problems

- **Duplication of entire app stacks**
  - Three parallel trees (`src/`, `engine/src/`, `temp_boilerplate/src/`) with overlapping components, routes, and TSL modules.
- **Duplication of TSL utilities**
  - TSL helpers exist in multiple places (root `src/tsl`, plus equivalents in `engine/src/tsl` and `temp_boilerplate/src/tsl`).
- **Engine vs Sketch vs TSL boundaries are fuzzy**
  - Some “engine-level” concepts live in sketches; some TSL helpers sneak into “engine” folders; naming is not fully consistent (`basicLambert.ts` vs `basic_lambert.ts`).
- **Manual registries that can drift**
  - `sketchRegistry.ts` is hand-maintained and can easily fall out of sync with actual files under `src/sketches/**`.
- **Unfinished resource index / engine registry**
  - `engineRegistry.ts` and `resourceIndex.ts` exist but aren’t implemented, leaving no single source of truth for engine features (materials, fields, particles, presets).

---

## 4. Target Architecture

### 4.1 Single Canonical App & Engine

- **Choose a single app root**: Treat **root `src/`** as the only live app.
- **Demote others to `legacy/` or `inventory`**:
  - Move `engine/` and `temp_boilerplate/` under a top-level `legacy/` or keep them in `INVENTORY/` as **reference-only**.
  - Make it explicit they’re not part of the runtime build (or remove them once you’re confident).

### 4.2 One TSL Library

- **Canonical TSL home**: Root `src/tsl` becomes the **only** TSL library.
- **Action**:
  - Delete/retire duplicated `tsl` trees under `engine/src` and `temp_boilerplate/src`.
  - Ensure all imports use `@/tsl/...` (like `simplex_noise_3d`, `cosine_palette`, `screen_aspect_uv`, etc.).
- **Structure**:
  - `src/tsl/noise/*` – noise and FBM building blocks.
  - `src/tsl/utils/*` – color, math, sdf, function utilities.
  - `src/tsl/post_processing/*` – raw post-processing TSL nodes (no engine coupling, no React).

### 4.3 Engine Core as a Thin Composition Layer

- **Canonical engine home**: Keep the engine in `src/engine` with clean subdomains:
  - `core/` – types (`engineTypes.ts`), composition (`createEngineSketch.ts`), registry/index.
  - `materials/` – high-level material factories returning `MaterialNodeConfig`.
  - `postfx/` – higher-level `PostFXChain` factories (bloom, depth of field, motion blur, grain/vignette).
  - `fields/` – vector fields like `createCurlNoise` that wrap `src/tsl/noise`.
  - `particles/` – particle systems (`createAttractorSystem`, `createBoidsSystem`, etc.).
  - `presets/` – “hero” compositions combining materials + postfx + fields.
- **Make `engineRegistry.ts` and `resourceIndex.ts` real**:
  - **`resourceIndex.ts`**: export structured maps of engine modules:
    - `materials: { basicLambert, pbrMaterial, phiMetal, sssMaterial }`
    - `postfx: { bloomChain, depthOfField, grainVignette, motionBlur }`
    - `fields: { curlNoise, curlNoiseField, sdfPrimitives }`
    - `particles: { attractorSystem, boidsSystem, flowSystem, swarmSystem }`
    - `presets: { cinematicPortrait, goldenGlow, neonMetropolis }`
  - **`engineRegistry.ts`**: high-level metadata describing feature groups, tags, and maybe default sketch IDs.

### 4.4 Sketches as Pure Content Layer

- **Clear categories under `src/sketches`**:
  - `src/sketches/base/*` – base boilerplate sketches (e.g. `flare-1`, `nested/dawn-1`).
  - `src/sketches/tsl/*` – sketches that only depend on `src/tsl` helpers.
  - `src/sketches/engine/*` – sketches that showcase engine features:
    - `engine/materials/*` – each using `createEngineSketch` + a material.
    - `engine/postfx/*` – postfx demos like `grain_vignette.ts`.
    - `engine/fields/*` – vector/sdf visualizations.
    - `engine/particles/*` – particle visuals, once properly wired.
    - `engine/presets/*` – full scene presets.
- **Keep sketches “thin”**:
  - A sketch should mostly **compose** existing engine/TSL pieces, not implement core logic.
  - Example: `grain_vignette.ts` already does this well: uses `createEngineSketch`, `createBasicLambert`, `createGrainVignette`.
- **Uniform naming**:
  - Align file naming between engine modules and their sketches:
    - Engine: `basicLambert.ts` → Sketch: `engine/materials/basic_lambert.ts` (or both camelCase; just be consistent).
    - Same for `bloomChain` ↔ `engine/postfx/bloom`, `curlNoise` ↔ `engine/fields/curl_noise_flow`, etc.

### 4.5 Sketch & Engine Metadata

- **Make `sketchRegistry.ts` more mechanical**:
  - Option A (minimal): keep manual registry but organize it by domain and drive it from `resourceIndex.ts` (so you reuse module IDs and tags).
  - Option B (future): move metadata into each sketch file (e.g., `export const metadata = { id, title, tags, ... }`) and **generate** the registry via `import.meta.glob`.
- **Align registry IDs with file paths**:
  - Enforce `id` = route path used in `routes/sketches.$.tsx` (`engine/particles/boids_visual` ↔ `src/sketches/engine/particles/boids_visual.ts`).
  - Keep `gallerySections` simple: just group by `category`/tags; no hard-coded lists beyond that.

### 4.6 Particles & Compute Pipeline (Scoped Upgrade)

- **Clarify status**:
  - Mark current particle systems (`createAttractorSystem`, `createBoidsSystem`, etc.) as **experimental** until compute shaders are in place.
- **Short-term organization**:
  - Keep configs + presets there, but don’t expose them as “complete demos” until:
    - There’s a shared particle runtime (compute or CPU fallback).
    - Sketches in `src/sketches/engine/particles/*` actually drive those systems (not just independent TSL visuals).
- **Longer-term**:
  - Introduce a common `ParticleRuntime` abstraction under `src/engine/particles/computeParticles.ts` and make all systems plug into it.

---

## 5. Phased Refactor Plan

### Phase 1 – De-duplicate & Freeze Legacy

- **Consolidate on root `src/` app** as the only runtime.
- **Move or archive**:
  - Move `engine/` and `temp_boilerplate/` into `legacy/` or `INVENTORY/` (or delete if fully obsolete).
- **Single TSL library**:
  - Remove extra `tsl` trees; ensure all imports point to `@/tsl/...`.

### Phase 2 – Clarify Folders & Naming

- **Normalize sketch layout** under `src/sketches`:
  - Ensure folders: `base/`, `tsl/`, `engine/materials`, `engine/postfx`, `engine/fields`, `engine/particles`, `engine/presets`.
- **Align naming**:
  - Make engine file names and sketch file names follow a consistent convention (either snake_case or camelCase, but not mixed arbitrarily).

### Phase 3 – Implement Engine Registry & Resource Index

- **Implement `resourceIndex.ts`**:
  - Export typed maps for engine modules (materials, postfx, fields, particles, presets).
- **Implement `engineRegistry.ts`**:
  - Define feature-level groups and any engine-specific metadata.
- **Refine `sketchRegistry.ts`**:
  - Use IDs that map directly to `src/sketches` paths.
  - Optionally consume some metadata from `resourceIndex.ts` to avoid drift.

### Phase 4 – Particle System Integration (Optional but Valuable)

- **Define `ParticleRuntime`** in `src/engine/particles/computeParticles.ts`.
- **Wire systems**:
  - Make `createAttractorSystem`, `createBoidsSystem`, `flowSystem`, `swarmSystem` plug into this runtime with real `updateNode`/`initNode`.
- **Sync sketches**:
  - Update `src/sketches/engine/particles/*` to showcase these systems, not separate ad-hoc visuals.

---

## 6. “Done” Definition for a Cohesive System

- **One live app**, zero confusion about which `src` is the source of truth.
- **One TSL library**, imported consistently from `@/tsl/...` with no duplicates.
- **Engine clearly layered**:
  - `core/` (types, composition, registry)  
  - `materials/`, `postfx/`, `fields/`, `particles/`, `presets/`, `utils/`
- **Sketches are thin content**, organized by domain, mapped 1:1 to route IDs and registry entries.
- **Registries are small and predictable**, either generated or tightly tied to `resourceIndex.ts`, so adding a new feature/material/postfx/field or sketch is a 2–3 line change, not a hunt across the repo.

If you’d like, next step I can do is actually implement Phase 1 (pick a canonical TSL tree, archive `engine/` and `temp_boilerplate/`, and normalize imports) directly in the codebase.