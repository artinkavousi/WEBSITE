# TSL Engine – Upgrade & Refactor Proposal

This document outlines the plan to consolidate the codebase, improve system cohesion, and enhance the UI/UX.

---

## 1. Goals

- **Consolidate**: Establish a single source of truth for the app, engine, and TSL library. Remove duplicated boilerplate.
- **Organize**: Clear separation of concerns:
  - **Core**: The engine runtime and composition logic.
  - **TSL**: Reusable shader nodes and math helpers.
  - **Sketches**: Content that uses the engine/TSL.
  - **UI**: The React app shell and gallery.
- **Enhance**: Improve the Gallery UI/UX to better showcase sketches.
- **Standardize**: Unified naming conventions and registry patterns.

---

## 2. Current State Analysis

- **Structure**: 
  - Multiple "app roots" (`src/`, `legacy/engine_app`, `legacy/temp_boilerplate`) causing confusion.
  - Duplicated TSL helpers in `src/tsl`, `src/engine/utils`, etc.
- **Engine**:
  - `src/engine/core` exists but `registry` files are empty/unused.
  - Particles system is partially implemented (`createAttractorSystem` placeholders).
- **UI/UX**:
  - Basic routing and gallery exists.
  - "EnhancedGallery" is present but likely needs polish for a "production-grade" showcase.

---

## 3. Execution Plan

### Phase 1: Consolidation (Immediate)
1. **Archive Legacy**: Move `legacy/engine_app` and `legacy/temp_boilerplate` to a `legacy_archive` or `INVENTORY` folder to stop them from being edited by mistake.
2. **Unify TSL**: 
   - Ensure `src/tsl` is the **only** place for TSL nodes.
   - Remove `src/engine/utils/noise.ts` if it duplicates `src/tsl/noise`.
   - Update all imports to use `@/tsl/...`.
3. **Clean Root**: Ensure `src/` is the only active application root.

### Phase 2: Engine Core Refinement
1. **Implement Registries**:
   - Populate `src/engine/core/resourceIndex.ts` to actually export available materials, effects, and fields.
   - Use this index to auto-populate UI dropdowns (instead of hardcoding).
2. **Standardize Sketches**:
   - Group sketches in `src/sketches/` by category (`materials`, `particles`, `postfx`).
   - Ensure every sketch has a consistent `id` and metadata.

### Phase 3: UI/UX Overhaul
1. **Gallery Upgrade**:
   - Improve `EnhancedGallery.tsx`.
   - Add thumbnails (if possible) or better list visualization.
   - Add filtering/tags based on the Registry.
2. **Visuals**:
   - Update global styles for a more cohesive "Engine" feel (dark mode, technical typography).
   - Improve the "Sketches Dropdown" navigation.

### Phase 4: Particles System
1. **Compute Integration**:
   - Implement the missing compute shader logic in `src/engine/particles`.
   - Create a "hero" particle sketch to demonstrate the system.

---

## 4. Next Steps

I will begin with **Phase 1: Consolidation** and **Phase 3: UI/UX Overhaul** concurrently as they provide the most immediate value.

