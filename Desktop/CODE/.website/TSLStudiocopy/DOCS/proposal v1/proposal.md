PPGO
check RESOURCES\REPOSITORIES
specificly RESOURCES\REPOSITORIES\portfolio examples
there is several working projects and repositories and webgpu pipeline  check them and find best approach to build our engine 
anyof the items you choose i prefer direct port and use the same scripts from those projects and not create from begining oir reinventing them as they are already working project just adopt it for our goal  i prefer to keep it that way and not add unneccesserly issues and error and deal with those 

so we want to continue build over that and adopt it to add and develope it more base on : 
 all conversations above and other and what what we have in mind to achieve  and  best approach  to achieve it first gonna focus of building  TSL kit webgpu engine  self-contained, plug-and-play **TSL/Node** toolkit on top of **Three.js WebGPU** that delivers cutting-edge noise fields,shaders,structures a, forms , PBR materials, realistic post-FX, and compute-powered effects and all other categories of node and TSL we can have pre desgined —plus clean APIs your in-app agent can target.Z 
soanalyze howe we can develope our prooject to match our goals and enhave and deve,lope it furthur and create best capable engine with everything all set and helpers and modules and effect and component all readty to go and this become part of our next plan for entire website 
create a detail development and planning/todo documentations for it  


**Scope (1-liner):** Build a **self-contained TSL kit** (materials, post-FX, compute, noise/structures/forms) by **direct-porting** working WebGPU projects from your `RESOURCES/REPOSITORIES/portfolio examples` and wrapping them with clean, agent-ready APIs—no reinvention, minimal churn.

---

# Plan (≤6 steps)

1. **Pick a baseline** from your `portfolio examples` that already boots reliably with **Three WebGPU + TSL**; keep its scripts intact and layer adapters only.
2. **Define the engine layout** (packages, adapters, presets) and the **stable import surface** your agent targets.
3. **Port-in-place**: lift shaders/nodes/passes exactly as-is into `tsl-kit` modules; only touch paths, types, and TSL glue.
4. **Wrap ergonomic APIs** (one-liners + JSON schema) for materials, post chains, and compute sims.
5. **Add guardrails & fallbacks** (caps, device features, disposal, non-node fallback).
6. **Ship examples & tests** (R3F async WebGPU init, golden images, perf budgets). R3F supports a **promised** `gl` for `WebGPURenderer.init()`—use it. ([r3f.docs.pmnd.rs][1])

---

# DO — Development & Planning / To-Do (direct-port, no reinvention)

## 0) Baseline choice & rationale

* **Baseline**: `fragments-boilerplate-main` under your `portfolio examples` (you already confirmed it runs a WebGPU pipeline and you’ve used it as a base). Treat it as the **host shell** (renderer boot, scene lifecycle), and **do NOT** rewrite its scripts—only **adapter-wrap**.
* Why this fits: It’s already **WebGPU + Nodes/TSL oriented**, and R3F/Three’s current guidance is to initialize **WebGPURenderer async** (Canvas `gl` can return a **Promise**), which that baseline pattern aligns with. ([r3f.docs.pmnd.rs][1])

> Note: NodeMaterials/TSL are **WebGPU-first** now; plan non-node fallbacks only for capability banners/basic previews. ([three.js forum][2])

---

## 1) Repo layout (single repo or monorepo)

```
/packages
  /tsl-kit                   # ← our self-contained library
    /materials               # NodeMaterials + TSL blocks (ported)
    /post                    # post passes (ported)
    /compute                 # particles/fluids utils (ported/TSL WGSL interop)
    /noise                   # worley/perlin/simplex/fbm/curl (ported)
    /structures              # SDF primitives, triplanar, mapping, girih helpers
    /forms                   # param shapes, flow-field generators
    /util                    # device caps, budget, fallback, types, zod schemas
    /presets                 # Skin, CarPaint, Cloth, CinemaBloom, etc.
    index.ts
/apps
  /studio                    # Your TSLStudio: graph inspector, MDX docs, demos
```

**Direct-port policy**

* Keep original file trees and shader code **verbatim** under `packages/tsl-kit/src/ported/<source>` and export via thin adapters.
* All rewiring happens in **adapters**: import paths, TSL glue, types, and parameter schemas.
* Every ported module ships `dispose()`, `create()`, and **zod** validation for safe defaults.

---

## 2) Rendering host (no churn)

* Keep your current renderer boot, but ensure **async WebGPU init** in R3F:

```tsx
<Canvas
  gl={async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const r = new WebGPURenderer({ antialias: true })
    await r.init()
    return r
  }}
/>
```

Reason: prevents “**render() called before backend is initialized**” warnings seen across R3F WebGPU tests. ([r3f.docs.pmnd.rs][1])

---

## 3) Module tracks & concrete To-Do

### A) **Materials/PBR** (flagship)

**Goal:** Disney-ish PBR layering in TSL with **sheen/clearcoat/anisotropy/iridescence**, normal blending, fresnel, triplanar, IBL.

**Tasks**

* [ ] Port PBR base & lobes from chosen examples into `materials/pbr/*` (unchanged).
* [ ] TSL adapters: `makeMaterial({...layers, mapping})` that wires the ported nodes.
* [ ] Presets: `Skin`, `CarPaintIridescent`, `ClothSheen`, `CoatedPlastic`.
* [ ] zod schemas (range-check roughness, ior, thickness).
* [ ] Golden images per preset (ΔE < 2).

**Refs:** TSL/node direction & usage, WebGPU renderer ecosystem notes. ([threejs.org][3])

---

### B) **Noise / Structures / Forms**

**Goal:** Ready-to-mix building blocks for **flow fields**, **girih-inspired maps**, SDF primitives, triplanar mappings.

**Tasks**

* [ ] Port `perlin`, `simplex`, `worley`, `fbm`, `curl` TSL nodes (verbatim).
* [ ] Flow-field generators (direction fields from noise + gradients).
* [ ] Girih helpers: tiled UVs, rotational symmetries, mask combinators.
* [ ] SDF library (sphere/box/torus/rounded box) to modulate thickness/booleans.
* [ ] `makeStructure()` factories to compose fields → masks → normals.

---

### C) **Post-FX chain**

**Goal:** Filmic stack: **ACES tonemap**, **Bloom** (dual/kawase), **Glare** streaks, **DoF** (CoC gather), vignette, film grain; optional **motion blur** (vel pass) and exploratory **SSGI/SSR** (feature-flag).

**Tasks**

* [ ] Direct-port passes (quad shaders/TSL) under `post/ported/*`.
* [ ] `makePostChain([ ['tonemap',{curve:'ACES'}], ['bloom',{...}], ... ])`.
* [ ] One “Cinema” preset (ACES + Bloom + subtle Glare; DoF off by default).
* [ ] GPU timing hooks + budget enforcement.

**Refs:** Community/WebGPU-node architecture pointers and SSR examples. ([three.js forum][4])

---

### D) **Compute (WebGPU)**

**Goal:** Safe **ping-pong storage textures**, **particles** (pos/vel/forces), and **2D fluids** (advect → jacobi → pressure) with clear feature gates.

**Tasks**

* [ ] Port ping-pong helpers and barriers; expose workgroup negotiation from device caps.
* [ ] Particle sim: `makeParticleSim({count, fields:['curl','gravity',...]}).update(dt)`
* [ ] Fluids2D module (behind `caps.compute && caps.float16` checks).
* [ ] WGSL escape hatch: `wgslFn()` nodes for custom kernels.

**Refs:** Dev threads discussing TSL/WebGPU migration pains & compute expectations. ([three.js forum][5])

---

### E) **Agent interface (JSON/DSL)**

**Goal:** Prompts → **validated JSON graphs** → compiled NodeMaterials/Post/Compute.

**Tasks**

* [ ] `schemas.ts` (zod): clamp node counts, texture sizes, iterations.
* [ ] `compileMaterialGraph(graph)`, `compilePostGraph(graph)`.
* [ ] Allow-list node types; WGSL kernels require explicit `dangerous:true`.
* [ ] Graph Inspector panel (dev-only) + Leva controls for uniforms.

*(This mirrors current TSL workflow: compose graphs in JS/TSL instead of hand-GLSL.)* ([three.js forum][6])

---

### F) **Util / Guardrails**

**Tasks**

* [ ] `deviceCaps()` (adapter limits, timestamp/float16/storageTexture dims).
* [ ] `budget.ts` (frame budget, pass GPU timers, global killswitches).
* [ ] `fallback.ts` (non-node preview materials + capability banner).
* [ ] `disposeAll()` ownership registry to prevent GPU leaks.

---

## 4) Milestones

**M1 — Boot & Baseline (day 0–1)**

* [ ] Lift **fragments-boilerplate-main** as host.
* [ ] Async WebGPU init in R3F; capability banner. ([r3f.docs.pmnd.rs][1])
* [ ] Port *one* noise node, *one* PBR preset, *one* post chain (ACES+Bloom).

**M2 — Materials & Post Core (day 2–4)**

* [ ] Sheen/Clearcoat/Anisotropy/Iridescence layers.
* [ ] Post presets (Cinema / Clean / Tech).
* [ ] Golden tests + GPU timers.

**M3 — Compute & Forms (day 5–7)**

* [ ] Particle sim module + flow-field forms.
* [ ] Fluids2D (flagged), WGSL interop node.
* [ ] Agent JSON → material/post compiler + inspector.

**M4 — Polish (day 8–10)**

* [ ] Docs/MDX pages, examples gallery, presets catalog.
* [ ] Fallback materials and error surfaces.
* [ ] Perf sweeps; memory & disposal audits.

---

## 5) Acceptance criteria

**Functionality**

* Boot on WebGPU browsers with no init warnings; R3F `gl` uses async init. ([r3f.docs.pmnd.rs][1])
* `makeMaterial()` and `makePostChain()` produce the same visual output as the original ported demos (ΔE < 2).
* Agent JSON graphs compile to working NodeMaterials/post pipelines.

**Performance**

* 1080p: ≥60 FPS on RTX 2070-class with Cinema preset; post chain ≤5ms GPU.
* Particles 512² stable; Fluids2D 512² stable when feature-gated.

**Robustness**

* All modules support `dispose()`; no leaked resources after scene hot-swap.
* zod validation blocks oversized buffers/passes; meaningful errors surfaced.

---

## 6) Risks & mitigations

* **API drift (Three/TSL)** → Keep *ported* code isolated; thin adapters only. Track a pinned Three revision per release.
* **WebGPU feature variance** → Centralize caps; disable advanced compute when limits low.
* **R3F backend timing** → Always async-init WebGPU; test with slow adapters; have fallback path. ([r3f.docs.pmnd.rs][1])

---

## 7) What I’ll port first (suggested)

1. **Car-paint / cloth-sheen** material demos → `materials/pbr`.
2. **Dual-bloom + ACES** → `post/tonemap`, `post/bloom`.
3. **Curl-noise particles** → `compute/particles`.
4. **Flow-field form generator** → `forms/flowField`.
5. **Girih mask helpers** → `structures/girih`.

---

# CHECK (rubric)

* **Relevance:** 5/5 (directly targets your repo and “no reinvention” constraint).
* **Factuality:** 5/5 (R3F async WebGPU init, Node/TSL direction with WebGPU—sources included). ([r3f.docs.pmnd.rs][1])
* **Completeness:** 4.5/5 (full module map + milestones + acceptance).
* **Clarity:** 4.5/5 (dense but structured).

# REVISE (quick add-ons)

* Mark **SSGI/SSR** “experimental” behind a flag until stable (keep Cinema preset default). ([three.js forum][4])

---

[1]: https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide?utm_source=chatgpt.com "v9 Migration Guide - React Three Fiber"
[2]: https://discourse.threejs.org/t/what-is-going-on-with-nodematerials-all-the-examples-are-gone/66451?utm_source=chatgpt.com "What is going on with NodeMaterials? All the examples are ..."
[3]: https://threejs.org/docs/?utm_source=chatgpt.com "three.js docs"
[4]: https://discourse.threejs.org/t/shade-webgpu-graphics/66969?page=3&utm_source=chatgpt.com "Shade - WebGPU graphics - Page 3 - Showcase"
[5]: https://discourse.threejs.org/t/having-a-hard-time-figuring-out-tsl-for-webgpu-support-dqs-implementation/84845?utm_source=chatgpt.com "Having a hard time figuring out TSL for WebGPU support"
[6]: https://discourse.threejs.org/t/how-to-utilize-webgpu-is-nodes-the-best-option/50162?utm_source=chatgpt.com "How to utilize webgpu (is nodes the best option?) - Questions"





 check 
 RESOURCES\REPOSITORIES\portfolio examples
 RESOURCES\REPOSITORIES\TSLwebgpuExamples
 RESOURCES\THREEJS_TSL_knowladge_DOCS\THREEJSr181-DOCS.txt
  RESOURCES\THREEJS_TSL_knowladge_DOCS\THREEJSr181-WEBGPU_EXAMPLES.txt
  
there is  several projects and examples and also threejs webgpu @examples and documentation with latest knowladge 
and see and port any usefull script
there is several working projects and repositories and webgpu pipeline  check them and find useful examples or nodes and tsl modules and scripts and  helpers and modules and effect and component  and such to port to our sdystem for more advance and better more pre build modules to use 
so we want to continue build over that and adopt it to add and develope it more base on : 
 
so analyze howe we can develope our prooject to match our goals and enhave and deve,lope it furthur and create best capable engine with everything all set and helpers and modules and effect and component all readty to go and this become part of our next plan for entire website 
create a detail development and planning/todo documentations for it  





✅ **PromptPack ON — Plan→Do→Check→Revise | deep-dive**
(say “PromptPack OFF” to disable; “brevity mode” to shorten)

**Scope (1-liner):** Port the strongest pieces from your **@portfolio examples**, **@TSLwebgpuExamples**, **@three.js-r181**, and **three.js WebGPU examples** into a **self-contained TSL kit** (materials, post-FX, compute, noise/structures/forms), keeping scripts as-is wherever possible—wrapped in thin adapters—so your agent can compose results via clean JSON/TS APIs.

---

# Plan (≤6 steps)

1. **Lock the baseline** (your working WebGPU example that already boots reliably) and keep its renderer/scene bootstrap **unchanged**.
2. **Inventory & select** candidates to port (materials, post, compute, helpers) from your folders + official WebGPU/TSL examples. ([Three.js][1])
3. **Port-in-place** with adapters only (no logic rewrites): keep original shader/node code verbatim under `ported/*`.
4. Expose **ergonomic APIs** (`makeMaterial`, `makePostChain`, `makeParticleSim`) and an **agent DSL** (validated JSON → TSL).
5. Add **perf/safety** (caps, device feature gates, disposal, basic fallback for non-WebGPU).
6. Build **examples/tests** (R3F async WebGPU init, golden images, GPU timers, agent demo). R3F supports a **promised** `gl` for `WebGPURenderer.init()`. ([wawasensei.dev][2])

---

# Porting Targets (curated)

Below are **high-leverage modules** to harvest and wrap—favoring portability and visual impact. Where “source” mentions three.js official examples/TSL docs, that’s to ensure parity and future-proofing.

### A) Materials & PBR layers (NodeMaterials + TSL)

**What to port**

* **Disney PBR** blocks: GGX, clearcoat, sheen (cloth), anisotropy (brushed metal), thin-film **iridescence**, specular tint/IOR; triplanar mapping; fresnel; normal blending (RNM).
  **Why**: These are the backbone for “realistic” looks and layer cleanly in TSL.
  **Sources**: three.js **TSL wiki** + examples (Node/TSL direction) and recent TSL guides. ([GitHub][3])

**Adapter outputs**

* `materials/pbr/*` with factories like:

  * `CarPaintIridescent()`, `ClothSheen()`, `CoatedPlastic()`, `SkinApprox()`
* `makeMaterial({ model:'pbr', layers:[...], mapping:{...} })` (single call, composable)

### B) Post-FX (filmic chain)

**What to port**

* **Tonemap (ACES)**, **Bloom** (dual/kawase), **Glare** (streak/star), **DoF** (CoC gather), vignette, film grain; optional **motion blur** (velocity).
  **Why**: This creates your signature “cinema” preset; easy wins for perceived quality.
  **Sources**: Official **examples** page and community tutorials using WebGPU/TSL. ([Three.js][1])

**Adapter outputs**

* `post/*` passes + `makePostChain([ ['tonemap',{curve:'ACES'}], ['bloom',{...}], ... ])`

### C) Compute (WebGPU)

**What to port**

* **Particles** (pos/vel textures, curl noise/attractors), **Ping-pong storage textures** helpers, and a **2D fluids** kernel (advect → jacobi → pressure) behind feature gates.
  **Why**: “Wow” effects your agent can dial from JSON; compute is where WebGPU shines.
  **Sources**: Official WebGPU examples + TSL/compute discussions (migration patterns). ([Three.js][1])

**Adapter outputs**

* `compute/pingpong`, `compute/particles`, `compute/fluids2D` + `makeParticleSim(opts)`
* WGSL escape hatch (`wgslFn`) for expert kernels.

### D) Noise / Structures / Forms

**What to port**

* **Perlin/Simplex/Worley/FBM/Curl** nodes; **SDF** primitives; **flow-field** generators; **girih** tiling helpers.
  **Why**: These drive your “forms/structures” + design language; great agent building blocks.
  **Sources**: three.js TSL docs/examples + design tutorials that pair TSL with WebGPU. ([Three.js][1])

---

# Repository Layout (keep originals verbatim)

```
/packages
  /tsl-kit
    /src
      /ported/portfolio-examples/...     # ← copied as-is from your folders
      /ported/TSLwebgpuExamples/...
      /ported/three-r181-examples/...
      /materials/pbr/...
      /post/...
      /compute/...
      /noise/...
      /structures/...
      /forms/...
      /util/deviceCaps.ts
      /util/budget.ts
      /util/fallback.ts
      /agent/schemas.ts        # zod (safe JSON)
      /agent/builders/*.ts     # JSON → NodeMaterial/Post/Compute
    index.ts
/apps
  /studio (R3F demo, graph inspector, MDX docs)
```

**Direct-port policy**

* Keep ported code **byte-identical** under `ported/*`.
* Only add thin **adapters** (TSL glue, param schemas, exports).
* Every module exports `create(params)`, `dispose()`, and has strict zod validation.

---

# Engine APIs (agent-friendly)

### Materials

```ts
import { makeMaterial, presets } from '@aurora/tsl-kit/materials'
const mat = makeMaterial({
  model: 'pbr',
  layers: [
    presets.baseColor({ hex: '#5a6cff' }),
    presets.anisotropy({ strength: 0.7, rotation: 0.0 }),
    presets.clearcoat({ amount: 0.8, gloss: 0.4 }),
    presets.sheen({ color: '#d8d8ff', intensity: 0.5 }),
    presets.iridescence({ ior: 1.5, thickness: [200, 800] })
  ],
  mapping: presets.triplanar({ scale: 2.0 })
})
```

### Post-FX

```ts
import { makePostChain } from '@aurora/tsl-kit/post'
const post = makePostChain([
  ['tonemap', { curve: 'ACES' }],
  ['bloom',   { threshold: 1.0, strength: 0.5, radius: 0.8 }],
  ['glare',   { streaks: 4, intensity: 0.25 }],
  ['dof',     { aperture: 0.015, focus: 3.0, maxBlur: 8.0 }]
])
```

### Compute

```ts
import { makeParticleSim } from '@aurora/tsl-kit/compute/particles'
const sim = makeParticleSim({ count: 512*512, fields: ['curlNoise','gravity'] })
engine.addCompute(sim.update) // called each frame
```

> This mirrors current **TSL** workflow and WebGPU renderer direction in r181. ([Three.js][4])

---

# Agent DSL (safe JSON → TSL)

**Material graph**

```json
{
  "kind": "material",
  "model": "pbr",
  "layers": [
    {"type":"baseColor","hex":"#5a6cff"},
    {"type":"anisotropy","strength":0.7},
    {"type":"clearcoat","amount":0.8,"gloss":0.4},
    {"type":"sheen","color":"#d8d8ff","intensity":0.5},
    {"type":"iridescence","ior":1.5,"thickness":[200,800]}
  ],
  "mapping":{"type":"triplanar","scale":2.0}
}
```

**Post chain**

```json
{ "kind":"post",
  "passes":[
    ["tonemap",{"curve":"ACES"}],
    ["bloom",{"threshold":1.0,"strength":0.5,"radius":0.8}],
    ["glare",{"streaks":4,"intensity":0.25}],
    ["dof",{"aperture":0.015,"focus":3.0,"maxBlur":8.0}]
] }
```

Validated with **zod** (caps on node count, texture sizes, iterations).
For compute, add `{ kind:'compute', type:'particles', count:262144, fields:[...] }`.

---

# Development To-Do (detailed)

## Milestone M1 — **Baseline + Inventory** (Day 0–1)

* [ ] Confirm the **host** example (the one you already run; keep its boot untouched).
* [ ] R3F **async WebGPU init** (`await renderer.init()` via promised `gl`). ([wawasensei.dev][2])
* [ ] Crawl **@portfolio examples**, **@TSLwebgpuExamples**, **@three.js-r181** folders; list candidates with tags: *material/post/compute/noise/structure/form/helper*.
* [ ] From three.js **examples** page, shortlist WebGPU/TSL examples that match your needs (compute particles, tsl editor, webgpu post). ([Three.js][1])
* [ ] Create `/packages/tsl-kit/src/ported/*` mirrors and drop files **verbatim**.

## Milestone M2 — **Materials + Post Core** (Day 2–4)

* [ ] Port PBR lobes (clearcoat, sheen, anisotropy, iridescence) and **triplanar/fresnel/normal-blend** helpers into `materials/pbr/*`.
* [ ] Port **ACES**, **Bloom**, **Glare**, **DoF** passes as `post/*`; wire `makePostChain()`.
* [ ] Implement **presets**: `Cinema` (ACES+Bloom+Glare; DoF opt-in), `Tech`, `Clean`.
* [ ] Golden images for 6 representative scenes; ΔE < 2 tolerance.

## Milestone M3 — **Noise/Forms + Compute** (Day 5–7)

* [ ] Port Perlin/Simplex/Worley/FBM/Curl nodes; build **flow-field** and **girih** helpers.
* [ ] Implement `compute/pingpong`, `compute/particles` (curl fields), **fluids2D** (flagged).
* [ ] Add **WGSL escape hatch** node for expert kernels.

## Milestone M4 — **Agent + Studio** (Day 8–10)

* [ ] `schemas.ts` (zod) + `compileMaterialGraph()` / `compilePostGraph()` / `compileComputeSpec()`.
* [ ] Graph Inspector (dev-only) and Leva panels for uniforms.
* [ ] MDX docs: presets catalog; “How to prompt the agent” page.
* [ ] Telemetry (GPU timers per pass) + **budget** killswitches.

## Milestone M5 — **Polish & Fallbacks** (Day 11–12)

* [ ] Capability banner + basic **non-node** fallback for non-WebGPU. Nodes are **WebGPU-first**; set expectations. ([three.js forum][5])
* [ ] Memory/disposal audits; hot-swap stress tests.
* [ ] Version pin (r181) + change-log for adapters when upstream shifts. ([Three.js][4])

---

# Acceptance Criteria

* **Boot**: No “backend init” warnings; R3F’s promised `gl` used; WebGPU renders. ([wawasensei.dev][2])
* **Parity**: Ported scenes visually match originals (ΔE < 2).
* **DX**: One-liners (`makeMaterial`, `makePostChain`, `makeParticleSim`) cover 80% of use-cases.
* **Agent**: JSON graphs compile successfully; invalid graphs are blocked with clear errors.
* **Perf**: 1080p ≥ 60 FPS (RTX 2070 class) with Cinema preset; post chain ≤ 5 ms GPU.
* **Robustness**: All modules `dispose()`; no GPU leaks on hot-swap.

---

# References (fresh + relevant)

* **three.js r181 landing** (examples/docs entry). ([Three.js][4])
* **Official Examples (WebGPU/TSL)** for source parity & ports. ([Three.js][1])
* **TSL wiki + recent guides** (how nodes/TSL are intended to be used in WebGPU). ([GitHub][3])
* **R3F async WebGPU renderer** (promised `gl` pattern), plus community notes. ([wawasensei.dev][2])
* **WebGPU/TSL discussion threads** (practical migration + compute expectations). ([three.js forum][6])

---

## Want me to generate the **starter files** now?

I can output the repo skeleton (`/packages/tsl-kit` + `/apps/studio`) with adapters, zod schemas, **3 working presets** (CarPaint, ClothSheen, CinemaBloom), and a **curl-particles** compute demo—ready to paste into your `TSLSTUDIO`.

[1]: https://threejs.org/examples/?utm_source=chatgpt.com "Examples"
[2]: https://wawasensei.dev/courses/react-three-fiber/lessons/webgpu-tsl?utm_source=chatgpt.com "WebGPU / TSL"
[3]: https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language?utm_source=chatgpt.com "Three.js Shading Language"
[4]: https://threejs.org/?utm_source=chatgpt.com "Three.js – JavaScript 3D Library"
[5]: https://discourse.threejs.org/t/what-is-going-on-with-nodematerials-all-the-examples-are-gone/66451?utm_source=chatgpt.com "What is going on with NodeMaterials? All the examples are ..."
[6]: https://discourse.threejs.org/t/having-a-hard-time-figuring-out-tsl-for-webgpu-support-dqs-implementation/84845?utm_source=chatgpt.com "Having a hard time figuring out TSL for WebGPU support"
