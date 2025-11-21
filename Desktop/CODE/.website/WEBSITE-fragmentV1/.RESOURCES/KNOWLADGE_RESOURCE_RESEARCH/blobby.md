# AURORA × MorphoVerse × Blobby — **Ultimate PRD + Plugin SDK (JSM One-File Modules)**

> Final, consolidated, **plugin-first** document that merges AURORA (ultimate spec + WebGPU/TSL blueprint + integration plan), MorphoVerse (ECS+plugin design), ParticlerEngine (hot-swappable modules), and Blobby (airborne lifeform physics/behavior). Primary runtime is **Three.js WebGPU + TSL/Nodes**, authored as **standalone JSM modules (one file per plugin)** with hot-swap and strict host contracts.

---

## 0) Build Flavors

* **Flavor A — WebGPU+TSL-Only (Default):** Fastest path, cleanest authoring (r179+/r180). No fallbacks.
* **Flavor B — Tiered Runtime (Optional):** Pipeline-Picker selects **WebGPU → WebGL2 (SPH/PBF + half-res SSFR/sprites) → CPU reference** for determinism/QA. Same interfaces, swappable kernels.

---

## 1) Tenets & Principles

* **JSM Single-File Plugins:** one feature family per file (e.g., `physics.mlsmpm.mjs`), hot-swappable at runtime, zero cross-plugin imports.
* **Minimal Host Contract:** buffers, uniforms, pass scheduler, event bus; everything else lives in plugins.
* **Hybrid ECS + Node Compute:** computation expressed as ordered passes with clean contracts; TSL first, WGSL hotspot mirrors allowed behind identical interfaces.
* **Reliability:** determinism mode, NaN guards, golden images, perf budgets.

---

## 2) Architecture Overview

**Core engine** = tiny host with: **Kernel Registry**, **Pipeline Picker**, **Quality Manager**, **SoA Buffer helpers**, **Scheduler** (ordered compute passes). Physics loop (typical):
`p2g → gridIntegrate → constitutive → xpbd → collideSDF → g2p → flipBlend → topology` (sub-stepped).

**Project layout** (authoritative references show full stack & directories).

---

## 3) Plugin SDK (One-File JSM)

### 3.1 Manifest (required)

```js
export function pluginFactory(options={}) {
  return {
    id: "physics.mlsmpm",           // unique
    version: "1.0.0",
    kind: "physics",                // physics|topology|surface|material|behavior|field|io|ui|net|qa|tool
    compat: { engine: "^1.0.0", webgpu: true, webgl2: false },
    needs: {
      buffers: [ /* SoA descriptors by name/schema */ ],
      uniforms: ["deltaTime","gravity","cellSize"]
    },
    provides: {
      steps: ["p2g","gridIntegrate","constitutive","collideSDF","g2p"], // or aovs/materials/etc.
      aovs: ["thickness","velocity"]
    },
    hooks: { init, mount, update, unmount, exportState, importState, ui },
  }
}
```

**Why:** mirrors the **Kernel Registry/Variant Contract** and scheduler described in the integration blueprint.

### 3.2 Lifecycle hooks

* `init(host)`: request buffers/uniforms; compile TSL node graphs.
* `mount()`: create & register ordered passes.
* `update(dt)`: lightweight param pushes.
* `unmount()`: cleanup.
* `exportState()`/`importState(s)`: preserve user params/sim state across swaps.

### 3.3 Pass interface

```ts
type ComputePass = { id:string; order:number; bind():void; dispatch():void; dispose():void }
```

Ordered execution guarantees deterministic step order across plugins.

---

## 4) Data Layout & Buffers (SoA)

* **Particles (SoA):** `pos, vel, mass, radius, phase(u32), flags(u32), C(3×3), F(3×3), life, LOD…` (+ density/pressure for SPH).
* **Grid (bricked/hash):** `m, v` and scratch fields for reductions.
* **AOVs:** `thickness`, `normals`, `velocity`, `foam/mist` sprite layers.

---

## 5) Physics Suite (Modules)

* **`physics.mlsmpm.mjs`** — MLS-MPM + APIC: P2G/APIC, GridIntegrate, Neo-Hookean (λ/μ) with optional plasticity, Collide(SDF), G2P; CFL limit; APIC anti-diffusion; optional vorticity confinement. Provides AOV velocity.
* **`physics.flipBlend.mjs`** — FLIP/PIC blending (α 0.88–0.98) to preserve splash energy.
* **`physics.xpbd.mjs`** — constraints (volume/leash/links) compatible with particle buffers.
* **`physics.sph.pbf.mjs`** — WebGL2-friendly PBF/SPH module; density/pressure forces; tile reductions (MRT+blend) where atomics are missing.
* **`physics.collision.sdf.mjs`** — primitives/SDF containers; adhesion bands for stickiness.

**Dimensionless controls exposed:** **Weber** (split), **Reynolds** (foam), **Ohnesorge** (viscosity), **Bond** (gravity). Tuned from UI and presets.

---

## 6) Topology & Phases (Modules)

* **`topo.splitMerge.mjs`** — split/merge by Weber + curvature with surface continuity; mid-air splitting & magnetic re-merging.
* **`topo.foamMistFilament.mjs`** — foam/mist/filament satellites, lifetimes & LRU budget; droplet shedding/orbit/rejoin.
* **`topo.sparseGrid.mjs`** — hash/brick grids shared by physics & topology.
* **`trails.gpu.mjs`** — GPU trail history for sheen/ribbons.

---

## 7) Rendering & Materials (Modules)

* **`surface.ssfr.mjs`** — **thickness → bilateral → normals → composite** (refraction + SSS + thin-film), HDR tonemapped.
* **`surface.marchingCubes.mjs`** — iso-surface fallback on downsampled bricks (VR-friendly).
* **`surface.metaballSprites.mjs`** — ultra-cheap impostor sprites.
* **`materials.gel.mjs`** — NodeMaterials: **RefractiveGel**, **SSSGel**, **ThinFilmGel** (mood-bound shading knobs).
* **`postfx.core.mjs`** — subtle CA, vignette; quality-managed toggles.
* **`env.hdr.pmrem.mjs`** — HDRI/PMREM helpers (r180 HDR pipeline).

---

## 8) Morphing & Forms (Modules)

* **`morph.sdfSampler.mjs`** — SDF volumes; blend by distance/energy.
* **`morph.meshTargets.mjs`** — morph targets & queues, progression curves.
* **`morph.noiseWarp.mjs` / `morph.blendMap.mjs`** — coherent noise warps & spatial blend maps.

---

## 9) Motion, Fields & Flight

* **`field.vector.mjs`** — gravity/wind envelopes.
* **`field.vortexCurl.mjs`** — curl noise, attractors, spiral/orbit flows.
* **`locomotion.flight.mjs`** — hover PID, gliding/corkscrew maneuvers, energy budgeting.

---

## 10) Behavior, Mood & Gesture

* **`behavior.hfsm.mjs` / `behavior.bt.mjs`** — Calm/Curious/Playful/… states + BT actions.
* **`mood.engine.mjs`** — mood vector → shading & motion modulation (e.g., IOR/thin-film/emission curves).
* **`gesture.tools.mjs`** — push/pull/slice/spin/heat/cool mapped to force/viscosity/tension changes.

---

## 11) Interactivity & I/O

* **`io.input.mouseTouch.mjs`** — pointer tools; wheel→global pressure; multi-touch.
* **`io.audio.fft.mjs`** — WebAudio FFT + Tone.js to modulate physics/morph/shading.
* **`io.midi.osc.mjs`** — external controllers (OSC/MIDI) → Leva/Tweakpane params.
* **`io.xr.adapters.mjs`** — WebXR controllers → InputForce; depth occlusion hooks.

---

## 12) UI/UX & Presets

* **`ui.tweakpane.glass.mjs`** — glassmorphism dashboard tabs: **Physics / Render / Motion / Gesture / Presets**, immediate binding.
* **`ui.analytics.hud.mjs`** — frame times, particle/brick counters, AOV heatmaps.
* **`presets.manager.mjs`** — load/save; ships **Pearl Calm / Play Gel / Mischief Jet / Iridescent Show** with We/Re/viscosity values.

---

## 13) Networking (optional)

* **`net.crdt.yjs.mjs`** — presence + preset sync; authority plugin hook.

---

## 14) QA, Determinism & Testing

* **`qa.cpu.reference.mjs`** — tiny-N CPU mirrors for each kernel; same interfaces/step order.
* **`qa.golden.images.mjs`** — Playwright-WebGPU headless, silhouette RMS < 1 px.
* **`qa.telemetry.mjs`** — mass/momentum invariants, histograms, privacy-respecting opt-in.

---

## 15) Security, Privacy, Accessibility

CSP + cross-origin isolation when needed; plugin sandbox via Worker; GDPR toggle; WCAG 2.2 & ARIA for timeline/events; RTL/i18n (en/fa/es); haptics fallback.

---

## 16) Acceptance Criteria (Ultimate)

* **Perf:** WebGPU/TSL default ≥ **60 FPS** on RTX 3070 with **≥50k core + 10k satellites** (“Play Gel”).
* **Visuals:** SSFR silhouette RMS < 1 px; refraction/SSS/thin-film stable; HDR tonemap correct.
* **Physics:** mass drift ≤ 0.5%/10 s; FLIP α stable; determinism mode passes golden images.
* **UX:** gesture latency < 1 frame; preset switch < 150 ms; pane responsive.

---

## 17) Packaging & Distribution

* **Output per plugin:** `dist/<name>.mjs` (ESM single file) + optional `dist/<name>.umd.js` + `d.ts`.
* **Imports:** `await engine.use((await import('…/physics.mlsmpm.mjs')).mlsmpm())`
* **Build pins (WebGPU TSL-only app):** `three@^0.180.0`, `tweakpane@^4`; COOP/COEP headers for WebGPU.

---

## 18) Repository Skeleton (Mono, plugins are standalone too)

```
/aurora
  /src/core      # engine.core.mjs, kernel-registry, pipeline-picker, quality
  /src/plugins   # each plugin is one file: physics.mlsmpm.mjs, surface.ssfr.mjs, …
  /env           # HDRI/LUTs
  index.html     # canvas + glass UI container
  vite.config.ts # COOP/COEP
  package.json   # three r180, tweakpane
```

(Aligned to the WebGPU+TSL blueprint scaffolding.)

---

## 19) Delivery Plan (Polished)

### Stage 1 — **Core + Particles + PBR Points**

Engine core, buffers, scheduler, **physics.mlsmpm** (P2G→G2P path), **ui.tweakpane.glass**, **materials.gel** (PBR points/instanced spheres), QA telemetry. (Targets: 25–50k).

### Stage 2 — **SSFR + Topology + FLIP + Presets**

`surface.ssfr`, `physics.flipBlend`, topology (split/merge + foam/mist/filaments), trails, presets, determinism CPU mirrors, golden images, acceptance battery.

---

## 20) Risks & Mitigations

* **P2G atomics contention** → brick binning / two-phase reductions; profile hotspots.
* **SSFR overdraw** → half-res first; early-out depth; tile culling.
* **Driver variance** → conservative TSL patterns; Opt WGSL variants behind same interface.

---

## 21) Presets (Starter)

**Pearl Calm / Play Gel / Mischief Jet / Iridescent Show** with We/Re/viscosity tuned and mood tags; used by presets manager.

---

## 22) Example Usage (concise)

```js
import { createEngine } from './engine.core.mjs'
import { mlsmpm }       from './plugins/physics.mlsmpm.mjs'
import { ssfrSurface }  from './plugins/surface.ssfr.mjs'
import { glassPane }    from './plugins/ui.tweakpane.glass.mjs'

const engine = createEngine(canvas)
await engine.use(mlsmpm({ flipAlpha: 0.94 }))
await engine.use(ssfrSurface({ quality:'auto' }))
await engine.use(glassPane())
engine.tickLoop()
```

**Hot swap**: `engine.swap('physics', (await import('./plugins/physics.sph.pbf.mjs')).sphPbf())` (state export/import preserved).

---

### ✅ Ultimate Version Locked

This PRD + SDK is now **finalized** for a plugin-first build: every feature is mapped to a **single-file JSM module** with strict contracts, hot-swap, and Tiered or WebGPU-only flavors. If you want, I can immediately output:

1. `engine.core.mjs` (host + scheduler + buffers + registry + quality), and
2. `physics.mlsmpm.mjs` (ordered passes, real TSL compute skeletons)

so you can run a 10–25k particle demo right away.
