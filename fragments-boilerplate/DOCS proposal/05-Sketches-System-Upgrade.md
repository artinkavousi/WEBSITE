# Sketches System Upgrade Proposal

## Current System Snapshot
- `src/components/sketch_wrapper/index.tsx` instantiates Leva directly per sketch, wires `WebGPUScene`, and exposes only a flat `controls` dictionary plus a minimal `settings.camera/postfx` block.
- `src/components/canvas/webgpu_scene.tsx` initializes the WebGPU renderer but delegates lights, environments, gizmos, and camera orchestration to each sketch; there is no shared scene rig, helper overlays, or lifecycle hooks.
- `src/components/sketches_dropdown/*` renders a basic toggle overlay without search, tagging, hero previews, or CMS-driven ordering; it relies on `getSketchEntries()` at runtime.
- `src/sketches/registry.ts` auto-imports every file and augments metadata with the static `SKETCH_DESCRIPTIONS` map; there is no structured schema for modules, dependencies, hero assets, tags, or feature flags.
- Individual sketches (e.g., `src/sketches/flare_1.tsx`, `materials/gallery.tsx`) manually wrap `SketchWrapper`, define controls inline, and re-implement repeated environment setup (lights, camera helpers, uniforms, compute runners).

## Gaps & Opportunities
1. **UI/UX discoverability** – The dropdown lacks hierarchy, search, or gallery storytelling; there is no landing grid, hero carousel, or module-specific narrative.
2. **CMS structure** – Metadata is scattered across `Config.meta`, `SKETCH_DESCRIPTIONS`, and folder naming; tags, feature badges, GPU requirements, and media assets are not modeled.
3. **Runtime duplication** – Camera rig, light rigs, gizmos, pointer uniforms, and post-processing chains are re-created manually in sketches; there is no universal bootstrap module.
4. **Control system** – Controls are plain Leva dictionaries, so we cannot auto-generate sections, dependencies, presets, or advanced widgets; there is no schema validation or per-module layout.
5. **Module isolation** – Examples mix view logic, shader code, and configuration, which makes copying a sketch into another project noisy and error prone.
6. **Pipeline visibility** – There is no way to benchmark, lint, or smoke-test sketches; no CLI to scaffold new modules or sync metadata into the CMS/gallery.

## Proposed Architecture & Approach
### 1. Sketch Runtime Core (`@/sketches/runtime`)
- Introduce a `SketchRuntime` module that encapsulates scene bootstrap: WebGPU renderer setup, camera + gizmo presets, default lights/environment, frame clock utilities, and integration points for compute pipelines.
- Provide composable sub-systems (`CameraRig`, `EnvRig`, `GizmoLayer`, `PostFXChain`, `InputUniforms`) with declarative props so each sketch can opt in/out without re-implementing wiring.
- Expose lifecycle hooks (`onInit`, `onFrame`, `onResize`, `onControlsChange`) so sketches stay focused on describing materials/graphs rather than canvas plumbing.

### 2. Schema-Driven Control Deck
- Define a `defineControls()` helper that accepts a typed schema (e.g., Zod or handcrafted DSL) describing fields, groups, conditionals, units, icons, and presets.
- Build a `ControlDeck` builder that translates the schema into Leva panels dynamically (glassmorphism theme, multi-column, collapsible sections, dependency-based enable/disable).
- Persist control states per sketch (URL params or local storage) and support "snapshots" for gallery playback.

Example DSL sketch:
```
export default defineSketch({
  id: 'materials/gallery',
  controls: deck({
    lighting: folder({
      intensity: slider({ min: 0, max: 5, value: 1.5, unit: 'lux' }),
      hdr: select({ options: ['studio', 'sunset'], badges: ['HDR'], affects: ['lights'] })
    }),
    animation: timeline({
      speed: slider({ value: 0.35, scrub: true }),
      easing: select({ options: easePresets })
    })
  })
})
```

### 3. CMS & Gallery Layer
- Replace `SKETCH_DESCRIPTIONS` with a manifest-driven CMS (`sketches/manifest.ts`) powered by `defineSketch()` that produces strongly typed metadata (category, tags, hero media, featured control presets, dependencies, SEO copy).
- Feed the manifest into a new gallery route that supports search, filters, hero spotlight, and module deep links. Cache manifests at build time for faster loads.
- Allow modules to register documentation pointers, GIF/MP4 previews, and "Try It" links to derivative apps.

### 4. Generator & Module Template
- Provide a CLI (`pnpm sketches:new`) that scaffolds a new module using the runtime + manifest schema, wiring default camera rig, control deck, and boilerplate file structure.
- Ensure generated modules stay standalone (single folder) so they can be copied into other projects without touching global infrastructure.

### 5. Smart Example Pipeline
- Implement a `SketchPipeline` orchestrator that can run smoke tests (headless renders), lint control schemas, and verify manifest completeness (thumbnails, SEO copy, feature flags).
- Integrate with CI to render thumbnail spritesheets per release and push them into `/public/gallery`.

### 6. Glass UI & Layout Pass
- Redesign the overlay as a docked panel with search + tagging, add a gallery landing grid, and surface metadata badges (TSL, Compute, Hero, etc.).
- Add responsive layouts (sidebar on desktop, modal on touch) and ensure the control deck + gallery share the same glassmorphism system (tokens, blur, gradients).

## Execution Plan & Todo List
| Phase | Scope | Key Tasks | Output |
| --- | --- | --- | --- |
| 1. Discovery & API Design | Finalize runtime + schema contracts | Audit sketch requirements, lock DSL for controls/environment, document manifest interface | Approved ADR + TypeScript types |
| 2. Runtime Core | Implement `SketchRuntime`, rigs, hooks | Build environment module, gizmo layer, default lights, pointer uniforms, lifecycle hooks | `@/sketches/runtime` package + tests |
| 3. Control Deck | Schema → Leva builder + persistence | Build deck parser, dynamic layout engine, state persistence, preset snapshots | `ControlDeck` component + examples |
| 4. CMS & Gallery | Manifest + new gallery route | Create manifest file, migration script, gallery UI (search/filter/hero), slug routing | `/sketches` gallery + data loaders |
| 5. Example Migration | Port existing sketches to new runtime | Add manifest entries, refactor sketches to use runtime hooks + control schemas, generate thumbnails | All legacy sketches migrated |
| 6. Tooling & Polish | CLI, automation, docs-in-code | Scaffold command, headless render tests, lint rules, storybook/devtools for control deck | Dev tooling + CI hooks |

## Success Metrics
- 100% of sketches run through `SketchRuntime` with zero custom bootstrap code.
- Gallery landing page highlights modules with search/filter, and metadata lives in a single manifest.
- Adding a new control requires only schema changes; the panel auto-renders with correct layout and persistence.
- CI produces preview thumbnails + control snapshots for every sketch.
- Developers can scaffold a new sketch in <60 seconds with consistent structure.

