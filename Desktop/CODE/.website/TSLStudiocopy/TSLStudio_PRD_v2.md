# TSLStudio Product Requirements Document (PRD) v2.0

> **Project**: TSLStudio WebGPU Engine  
> **Version**: 2.0  
> **Date**: November 7, 2025  
> **Status**: Foundation Phase (20% Complete)  
> **Philosophy**: Direct-Port, No Reinvention

---

## 1. Executive Summary

### 1.1 Vision Statement

Build a **self-contained, plug-and-play TSL/WebGPU engine** on Three.js r181+ that delivers production-ready materials, post-processing, compute systems, and effects with clean, agent-addressable APIs—enabling rapid prototyping and deployment of high-performance 3D web experiences.

### 1.2 Mission

Create a comprehensive toolkit with **150+ pre-built modules** by **direct-porting** proven working code from curated example repositories, minimizing risk while maximizing quality and time-to-market.

### 1.3 Core Principles

1. **Direct-Port First** — Use working code as-is; only adapt imports, paths, types
2. **Minimize Risk** — Don't rewrite proven implementations
3. **Three.js r181 Native** — Follow latest patterns and best practices
4. **Agent-Addressable** — Clean TypeScript APIs with JSON schema validation
5. **Production-Ready** — Complete, tested, documented, performant
6. **WebGPU-First** — Assume WebGPU availability; provide minimal fallbacks

### 1.4 Success Metrics

**Technical Targets:**
- ✅ 150+ modules implemented and tested
- ✅ 60 FPS @ 1080p (RTX 2070 class GPU)
- ✅ 30 FPS @ 4K (RTX 3080 class GPU)
- ✅ < 2.5s initial load time
- ✅ < 5ms post-FX chain execution
- ✅ 80%+ test coverage
- ✅ Visual parity with source implementations (ΔE < 2)

**User Metrics:**
- Median time to publish-worthy visual < 5 minutes
- 90%+ tutorial completion rate
- 90%+ cookbook task success rate
- High preset usage and customization rate

---

## 2. Technical Architecture

### 2.1 Technology Stack

#### Core Runtime
- **Three.js**: r181+ (WebGPU + TSL)
- **Runtime**: Modern browsers with WebGPU support (Chrome 113+, Edge 113+)
- **Language**: TypeScript (strict mode)
- **Module System**: ESM

#### Import Structure
```typescript
// Three.js r181+ Import Pattern
import { WebGPURenderer } from 'three/webgpu'
import { color, uv, texture, mix, Fn } from 'three/tsl'
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
```

#### Framework Integration
- **React**: React Three Fiber v9+ (async renderer init)
- **Optional**: Threlte 8+ (Svelte), TresJS (Vue 3)

#### Async WebGPU Initialization Pattern
```tsx
<Canvas
  gl={async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const renderer = new WebGPURenderer({ antialias: true })
    await renderer.init()  // CRITICAL: Prevent "backend not initialized" warnings
    return renderer
  }}
/>
```

### 2.2 Package Architecture

```
TSLStudio/
├── packages/
│   ├── engine/                      # High-level systems
│   │   ├── core/
│   │   │   ├── renderer.ts          # WebGPU renderer wrapper (async init)
│   │   │   ├── framegraph.ts        # Post-FX composition & MRT support
│   │   │   ├── assets.ts            # Asset loading & management
│   │   │   ├── inspector.ts         # Debug/profiling tools
│   │   │   └── state.ts             # Engine state management
│   │   ├── materials/               # Material presets & builders
│   │   │   ├── physical/            # Physical materials (glass, metal, fabric, skin)
│   │   │   ├── procedural/          # Procedural materials (hologram, iridescent)
│   │   │   ├── stylized/            # Stylized materials (toon, halftone)
│   │   │   └── special/             # Special FX materials (portal, dissolve, glitch)
│   │   ├── fx/                      # Post-processing effects
│   │   │   ├── bloom.ts             # Dual/Kawase bloom
│   │   │   ├── taa.ts               # Temporal anti-aliasing
│   │   │   ├── dof.ts               # Depth of field (CoC + bokeh)
│   │   │   ├── ssr.ts               # Screen space reflections
│   │   │   ├── gtao.ts              # Ground truth ambient occlusion
│   │   │   ├── ssgi.ts              # Screen space global illumination
│   │   │   ├── motionBlur.ts        # Motion blur (velocity-based)
│   │   │   └── colorGrading.ts      # Color grading (LUT, curves, tonemap)
│   │   ├── compute/                 # GPU compute systems
│   │   │   ├── particles/           # Advanced particle systems
│   │   │   ├── fluid/               # Fluid simulation (2D & 3D)
│   │   │   ├── physics/             # Physics simulation
│   │   │   └── procedural/          # Procedural generation
│   │   └── scenes/                  # Complete scene compositions
│   │
│   ├── tsl/                         # TSL node library
│   │   ├── noise/                   # Noise functions (12+ types)
│   │   ├── materials/               # Material node builders
│   │   ├── post/                    # Post-processing nodes
│   │   ├── compute/                 # Compute shader helpers
│   │   └── utils/                   # General TSL utilities
│   │       ├── lighting/            # Lighting models (10+ functions)
│   │       ├── sdf/                 # SDF primitives & operations (25+ functions)
│   │       ├── color/               # Color utilities
│   │       ├── function/            # Function utilities
│   │       ├── math/                # Math utilities
│   │       └── geometry/            # Geometry modifiers
│   │
│   └── studio/                      # React application
│       ├── components/              # React components
│       ├── routes/                  # Application routes
│       ├── demos/                   # Demo scenes
│       └── utils/                   # UI utilities
```

### 2.3 Module Taxonomy

#### Primary Categories

1. **Noise & Procedural** (12+ modules)
   - Simplex 2D/3D/4D, Perlin 3D, Classic Noise 3D
   - Curl 3D/4D, FBM, Turbulence, Voronoi
   - Domain warping, Octave layering, Animation helpers

2. **Lighting Models** (10+ functions)
   - Diffuse, Ambient, Directional, Hemisphere
   - Fresnel (Schlick + dielectric), Specular, Rim Light
   - Oren-Nayar (rough diffuse), Cook-Torrance (specular)

3. **SDF Library** (25+ functions)
   - **Primitives**: Sphere, Box, RoundBox, Torus, Cylinder, Cone, Capsule, Plane, Octahedron, Pyramid
   - **Operations**: Union, Subtraction, Intersection, SmoothUnion, SmoothSubtraction, SmoothIntersection, Displacement, Twist, Bend
   - **Helpers**: Raymarch, calcNormal, calcAO, softShadow

4. **Material Systems** (50+ presets)
   - **Physical**: Glass, Metal, Fabric, Skin, Ceramic, Water
   - **Procedural**: Hologram, Fresnel, Iridescent, Triplanar, Noise-driven
   - **Stylized**: Toon, Halftone, Sketch, Pixel Art
   - **Special FX**: Portal, Dissolve, Glitch, Force Field

5. **Post-Processing** (30+ effects)
   - **Core**: Tonemap (ACES/Filmic), Bloom, Glare, Vignette, Film Grain
   - **DOF**: Bokeh (circular/hexagonal), CoC gather, Near/far blur
   - **Screen Space**: SSR, GTAO, SSGI, SSAO
   - **Color**: LUT3D, Curves, Lift/Gamma/Gain, Hue/Saturation
   - **Stylized**: Halftone, ASCII, CRT, Glitch, Datamosh, Edge Detection, Posterize, Duotone

6. **Compute Systems** (20+ utilities)
   - **Particles**: Basic, Morphing, Flow Field, Collision, GPGPU (FBO)
   - **Forces**: Gravity, Wind, Turbulence, Curl, Attractors
   - **Emitters**: Point, Mesh Surface, Volume, Curve
   - **Fluid**: 2D/3D Navier-Stokes solver, Vorticity confinement, Multiple emitters
   - **Rendering**: Points, Sprites, Trails, Instanced

7. **Procedural Generation** (10+ modules)
   - **Terrain**: Height map, Erosion, Multi-octave layering
   - **Ocean**: Surface waves, Foam, Caustics
   - **Clouds**: Volumetric, Raymarched, Animated
   - **Other**: Rock formations, Vegetation

8. **Animation & Morphing** (10+ modules)
   - Position morphing, Shape morphing, Texture morphing
   - Procedural animation (noise, wave, flow)
   - Easing functions, Interpolation curves
   - Spring physics, Timeline system

9. **Geometry Modifiers** (6+ functions)
   - Displacement, Twist, Bend, Taper, Wave, Ripple

### 2.4 API Design

#### TypeScript API Surface

**Materials:**
```typescript
import { makeMaterial } from '@tslstudio/engine/materials'

const carPaint = makeMaterial({
  model: 'pbr',
  layers: [
    { type: 'baseColor', hex: '#1b1f73' },
    { type: 'anisotropy', strength: 0.7, direction: [1, 0], roughness: 0.2 },
    { type: 'clearcoat', amount: 0.85, gloss: 0.45 },
    { type: 'sheen', color: '#d8d8ff', intensity: 0.5 },
    { type: 'iridescence', ior: 1.6, thickness: [250, 900] }
  ],
  mapping: { type: 'triplanar', scale: 2.0 }
})
```

**Post-Processing:**
```typescript
import { makePostChain } from '@tslstudio/engine/fx'

const postChain = makePostChain([
  ['tonemap', { curve: 'ACES' }],
  ['bloom', { threshold: 1.0, strength: 0.5, radius: 0.85 }],
  ['glare', { streaks: 4, intensity: 0.25 }],
  ['dof', { aperture: 0.018, focus: 2.8, maxBlur: 7.5 }]
])
```

**Compute (Particles):**
```typescript
import { createParticleSim } from '@tslstudio/engine/compute/particles'

const particles = createParticleSim({
  count: 512 * 512,
  fields: [
    { type: 'curlNoise', amplitude: 0.6, frequency: 0.8 },
    { type: 'gravity', direction: [0, -1, 0], strength: 0.25 }
  ],
  spawn: { rate: 1000, lifetime: [1.5, 3.5] }
})
```

#### Agent-Facing JSON DSL

**Material Schema:**
```json
{
  "kind": "material",
  "model": "pbr",
  "layers": [
    { "type": "baseColor", "hex": "#5a6cff" },
    { "type": "normalMix", "sources": ["flake", "macro"], "weights": [0.6, 0.4] },
    { "type": "clearcoat", "amount": 0.8, "gloss": 0.45 },
    { "type": "sheen", "color": "#d8d8ff", "intensity": 0.5 }
  ],
  "mapping": { "type": "triplanar", "scale": 2.0 },
  "ibl": { "type": "envLUT", "intensity": 1.2 }
}
```

**Post-Processing Schema:**
```json
{
  "kind": "post",
  "passes": [
    ["tonemap", { "curve": "ACES" }],
    ["bloom", { "threshold": 1.0, "strength": 0.45, "radius": 0.85 }],
    ["glare", { "streaks": 4, "intensity": 0.25 }],
    ["film", { "grain": 0.035, "temperature": 0.0 }],
    ["dof", { "aperture": 0.018, "focus": 2.8, "maxBlur": 7.0 }]
  ]
}
```

**Schema Validation:**
- All schemas use **Zod** for runtime validation
- Numeric parameters bounded by device capabilities
- Clear, actionable error messages
- Tree-shakeable validation modules

---

## 3. Resource Inventory

### 3.1 Primary Source Repositories

#### **Priority 1: Portfolio Examples (Maxime Heckel)** ⭐⭐⭐⭐⭐

**Path**: `RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/`

**Why Priority 1:**
- Modern TSL patterns (Three.js r180+)
- Production-tested in real portfolio
- Clean, modular code structure
- Comprehensive WebGPU experiments (30+)
- Excellent TypeScript typing

**Key Assets:**

**Lighting Utilities** (`src/utils/webgpu/nodes/lighting/`):
- `diffuse.ts` ✅ (verified existing)
- `ambient.ts` ⭕ (to port)
- `directional.ts` ⭕ (to port)
- `fresnel.ts` ⭕ (to port)
- `hemisphere.ts` ⭕ (to port)

**Noise Functions** (`src/utils/webgpu/nodes/noise/`):
- `simplexNoise2d.ts` ⭕ (to port)
- `simplexNoise3d.ts` ✅ (verify)
- `simplexNoise4d.ts` ✅ (verify)
- `curlNoise3d.ts` ✅ (verify)
- `curlNoise4d.ts` ✅ (verify)
- `classicNoise3d.ts` ⭕ (to port)
- `voronoi.ts` ⭕ (to port)

**Helper Functions** (`src/utils/webgpu/nodes/helpers/`):
- `smooth-min.ts`, `smooth-mod.ts`, `remap.ts`
- `rotate-3d-y.ts`, `compose.ts`

**Lab Experiments** (`src/app/lab/`):
- 30+ complete WebGPU demos including:
  - `fbo-particles/` — GPGPU particles
  - `particles-morphing-2/` — Shape morphing
  - `flow-field/` — Flow field forces
  - `attractor-collisions/` — Physics simulation
  - `particles-twist/` — Curl forces
  - `infinite-water/` — Water simulation
  - `sdf-basic-tsl/` — Raymarching
  - `tsl-custom-node-material/` — Custom materials
  - `refraction-and-dispersion/` — Glass effects

**Estimated Port Time**: 15-20 days  
**Risk Level**: Low (modern, well-tested code)

---

#### **Priority 2: Fragments Boilerplate** ⭐⭐⭐⭐⭐

**Path**: `RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/`

**Why Priority 2:**
- Already partially ported (8 noise, 6 post effects)
- Clean TSL library structure
- Ready-to-use utilities
- Modular, composable design

**Key Assets:**

**Noise Library** (`src/tsl/noise/`):
- ✅ `simplex_noise_3d.ts`, `simplex_noise_4d.ts`
- ✅ `curl_noise_3d.ts`, `curl_noise_4d.ts`
- ✅ `perlin_noise_3d.ts`, `fbm.ts`, `turbulence.ts`

**Post-Processing** (`src/tsl/post_processing/`):
- ✅ 6 effects ready: canvas_weave, grain_texture, lcd, pixellation, speckled_noise, vignette

**Utils** (`src/tsl/utils/`):
- Color: `cosine_palette.ts`, `tonemapping.ts`
- Function: `bloom.ts`, `bloom_edge_pattern.ts`, `domain_index.ts`, etc.
- Math: `complex.ts`, `coordinates.ts`
- SDF: `operations.ts`, `shapes.ts`

**Status**: ~40% ported, verify and enhance  
**Estimated Port Time**: 3-5 days  
**Risk Level**: Very Low (already partially integrated)

---

#### **Priority 3: Roquefort Fluid Simulation** ⭐⭐⭐⭐

**Path**: `RESOURCES/REPOSITORIES/TSLwebgpuExamples/roquefort-main/`

**Why Priority 3:**
- Complete 2D Navier-Stokes fluid solver
- Production-ready, well-optimized
- WebGPU compute shaders
- Clean operator-based architecture

**Key Assets:**

**Simulation Operators** (`src/simulation/`):
- `advect.js` — Semi-Lagrangian advection
- `divergence.js` — Divergence calculation
- `pressure.js` — Pressure solver (Jacobi iterations)
- `gradient_subtract.js` — Gradient subtraction
- `vorticity.js` — Vorticity confinement
- `emitters.js` — Fluid impulse injection

**Rendering** (`src/rendering/`):
- `blur.js` — Gaussian blur
- `lighting.js` — Fluid lighting
- `render.js` — Particle rendering

**Features:**
- 2D fluid simulation at 60 FPS (512x512 grid)
- Vorticity confinement for turbulence
- Interactive mouse/touch forces
- Dye injection system

**Estimated Port Time**: 6-8 days  
**Risk Level**: Medium (compute shader complexity)

---

#### **Priority 4: SSR/GTAO/SSGI Examples** ⭐⭐⭐⭐⭐

**Paths**:
- `RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/`
- `RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/`

**Why Priority 4:**
- Critical visual quality upgrade
- Screen-space techniques
- High-impact features

**Key Assets:**
- Screen Space Reflections (SSR)
- Ground Truth Ambient Occlusion (GTAO)
- Screen Space Global Illumination (SSGI)
- Temporal accumulation
- Spatial filtering

**Requirements:**
- Framegraph MRT support
- History buffer management
- G-buffer pass
- Depth/normal reconstruction

**Estimated Port Time**: 8-10 days  
**Risk Level**: High (framegraph enhancements required)

---

#### **Priority 5: Three.js TSL Sandbox** ⭐⭐⭐⭐

**Path**: `RESOURCES/REPOSITORIES/TSLwebgpuExamples/three.js-tsl-sandbox-master/`

**Why Priority 5:**
- 30+ complete TSL projects
- Variety of techniques and effects
- Excellent learning resource
- Community-tested patterns

**Key Projects:**
- `particles-flow-field/` — Flow field behaviors
- `particles-morphing/` — Shape morphing
- `post-processing/` — Effect chains
- `procedural-terrain/` — Terrain generation
- `raging-sea/` — Ocean simulation
- `hologram/` — Holographic materials
- `halftone/` — Halftone effects
- `coffee-smoke/` — Smoke simulation
- `fireworks/` — Particle fireworks

**Estimated Port Time**: 10-15 days  
**Risk Level**: Medium (variety of implementations)

---

#### **Priority 6: Three.js r181 Official Examples** ⭐⭐⭐

**Path**: `RESOURCES/three.js-r181/examples/`

**Why Priority 6:**
- Canonical patterns and best practices
- 186+ WebGPU examples (`webgpu_*.html`)
- Official node implementations
- Latest Three.js features

**Key Examples:**
- `webgpu_compute_*` — Compute shaders
- `webgpu_postprocessing_*` — Post-processing
- `webgpu_materials_*` — Materials
- `webgpu_particles*` — Particle systems

**Usage**: Reference for API correctness and best practices

**Estimated Time**: Ongoing reference  
**Risk Level**: None (official source)

---

### 3.2 Module Count & Status

| Category | Available | Ported | Remaining | Priority |
|----------|-----------|--------|-----------|----------|
| **Lighting Models** | 10 | 1 | 9 | 🔴 High |
| **Noise Functions** | 12 | 8 | 4 | 🟡 Medium |
| **SDF Primitives** | 15+ | 1 | 14+ | 🟡 Medium |
| **SDF Operations** | 12 | 2 | 10 | 🟡 Medium |
| **Post Effects** | 30+ | 10 | 20+ | 🔴 High |
| **Materials** | 25+ | 7 | 18+ | 🟡 Medium |
| **Particles** | 15+ | 1 | 14+ | 🔴 High |
| **Fluid Systems** | 8 | 1 | 7 | 🔴 High |
| **Screen Space FX** | 5 | 0 | 5 | 🔴 Critical |
| **Geometry Utils** | 10+ | 0 | 10+ | 🟢 Low |
| **Animation** | 10+ | 0 | 10+ | 🟢 Low |
| **Procedural** | 8+ | 0 | 8+ | 🟢 Low |
| **TOTAL** | **150+** | **~30** | **~120** | — |

**Current Progress**: 20% (30/150 modules)  
**Target**: 100% (150/150 modules)

---

## 4. Three.js r181 Migration Strategy

### 4.1 Key Changes from r170-r180

#### Import Path Changes
```typescript
// Old (r170-r179)
import { NodeMaterial } from 'three/examples/jsm/nodes/NodeMaterial'

// New (r180+)
import { WebGPURenderer } from 'three/webgpu'
import { color, uv, texture } from 'three/tsl'
```

#### TSL Function Signatures
- Most TSL functions now in `three/tsl` package
- `Fn()` helper for creating custom TSL functions
- Improved type inference and IDE support

#### WebGPU Renderer Initialization
```typescript
// MUST await init() before first render
const renderer = new WebGPURenderer()
await renderer.init()  // Critical!
```

#### NodeMaterials
- Now WebGPU-first (WebGL node support removed in r172)
- Use `MeshPhysicalNodeMaterial`, `MeshBasicNodeMaterial`, etc.
- TSL nodes compile to WGSL automatically

### 4.2 Compatibility Checklist

**For Each Ported Module:**
- [ ] Update import paths (`three/webgpu`, `three/tsl`)
- [ ] Replace deprecated TSL functions
- [ ] Use `Fn()` for custom functions
- [ ] Add `.setLayout()` metadata for node introspection
- [ ] Test with WebGPURenderer
- [ ] Verify async init pattern in R3F
- [ ] Add TypeScript types
- [ ] Update JSDoc with r181 patterns

### 4.3 New Features to Leverage

**Three.js r181 Additions:**
- Improved TSL type inference
- Better compute shader support
- Enhanced post-processing framework
- New node utilities
- Performance improvements

---

## 5. Quality Standards

### 5.1 Code Quality

**TypeScript:**
- ✅ Strict mode enabled (`"strict": true`)
- ✅ Explicit types for all exports
- ✅ No `any` types (use `unknown` if necessary)
- ✅ Proper type imports (`import type { ... }`)

**Documentation:**
- ✅ JSDoc for all exports
- ✅ Parameter descriptions with types
- ✅ Return value descriptions
- ✅ Usage examples
- ✅ Links to related functions
- ✅ Source attribution

**Example:**
```typescript
/**
 * Fresnel effect calculation using Schlick approximation
 * 
 * @param viewDir - View direction (normalized vec3)
 * @param normal - Surface normal (normalized vec3)
 * @param power - Fresnel power/exponent (float, typically 5.0)
 * @returns Fresnel value (float, range 0-1)
 * 
 * @example
 * ```typescript
 * import { fresnelFn } from '@tslstudio/tsl/utils/lighting'
 * import { viewDirection, normalWorld, float } from 'three/tsl'
 * 
 * const fresnel = fresnelFn(viewDirection, normalWorld, float(5.0))
 * material.emissiveNode = fresnel.mul(color('#ff6b6b'))
 * ```
 * 
 * @see https://en.wikipedia.org/wiki/Fresnel_equations
 * 
 * Ported from: portfolio-main/src/utils/webgpu/nodes/lighting/fresnel.ts
 * Original author: Maxime Heckel
 * License: MIT
 */
export const fresnelFn = Fn<[
  ShaderNodeObject<Node>,
  ShaderNodeObject<Node>,
  ShaderNodeObject<Node>
]>(([viewDir, normal, power]) => {
  const ndotv = max(0, dot(viewDir, normal))
  return pow(sub(1, ndotv), power)
}).setLayout({
  name: 'fresnel',
  type: 'float',
  inputs: [
    { name: 'viewDir', type: 'vec3' },
    { name: 'normal', type: 'vec3' },
    { name: 'power', type: 'float' }
  ]
})
```

### 5.2 Testing Standards

**Unit Tests:**
- ✅ Every function/module tested
- ✅ Edge cases covered
- ✅ Performance benchmarks
- ✅ 80%+ code coverage

**Integration Tests:**
- ✅ Complete pipelines tested
- ✅ Material → Render path
- ✅ Post-FX chains
- ✅ Compute systems

**Visual Regression Tests:**
- ✅ Golden image comparison
- ✅ ΔE < 2 tolerance
- ✅ Cross-platform consistency

**Performance Benchmarks:**
- ✅ Frame time tracking
- ✅ GPU pass timing
- ✅ Memory usage monitoring
- ✅ Automated CI runs

### 5.3 Performance Targets

**Rendering Performance:**
- 60 FPS @ 1080p (RTX 2070 class)
- 30 FPS @ 4K (RTX 3080 class)
- 30 FPS @ 720p (Integrated GPU)
- < 16.7ms frame time
- < 5ms post-FX chain

**Load Performance:**
- < 2.5s initial interactive load
- < 500ms TAA restabilization
- < 100ms material hot-swap

**Compute Performance:**
- 500k+ particles @ 60 FPS
- 512² fluid grid @ 60 FPS
- 1024² fluid grid @ 30 FPS (feature-gated)

**Memory Targets:**
- < 500MB GPU memory (1080p, all features)
- < 1GB GPU memory (4K, all features)
- No memory leaks (stable over 30+ minutes)

---

## 6. Risk Assessment

### 6.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Three.js/TSL API drift** | High | Medium | Pin versions, isolate ports, thin adapters |
| **GPU memory pressure** | High | Medium | Quality presets, monitoring, adaptive scaling |
| **Performance variance** | Medium | High | Adaptive res/LOD, budgets, fallbacks |
| **Complexity creep** | High | Medium | Freeze v1 scope, small API surface, ADRs |
| **Porting bugs** | Medium | Medium | Visual tests, parity checks, attribution |
| **Browser compatibility** | Medium | Low | WebGPU detection, graceful degradation |
| **Compute shader limits** | Medium | Medium | Device caps detection, feature gating |

### 6.2 Project Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Scope creep** | High | High | Strict phase acceptance criteria |
| **Timeline slippage** | Medium | Medium | Weekly reviews, blockers escalation |
| **Resource constraints** | Medium | Low | Prioritize critical modules first |
| **Documentation lag** | Low | Medium | Doc templates, parallel writing |

### 6.3 Mitigation Strategies

**API Drift Prevention:**
- Keep ported code isolated in `ported/*` folders
- Use thin adapter layers for integration
- Track pinned Three.js revision per release
- Monitor Three.js changelog for breaking changes

**Performance Assurance:**
- Centralize device caps detection
- Implement quality presets (Low/Med/High/Ultra)
- Use adaptive resolution scaling
- Monitor frame budgets with GPU timers

**Quality Gates:**
- No merge without tests
- Visual regression on every module
- Performance benchmarks in CI
- Code review required

---

## 7. Validation & Acceptance

### 7.1 Phase Acceptance Criteria

**Phase 1 (Weeks 1-4): Foundation** ✅
- [ ] 50+ utility functions ported
- [ ] Complete noise library (12+ functions)
- [ ] Complete SDF library (25+ functions)
- [ ] Testing infrastructure operational
- [ ] Documentation framework setup
- [ ] 5+ demo scenes working

**Phase 2 (Weeks 5-8): Core Systems**
- [ ] Fluid simulation fully functional
- [ ] Advanced particles working
- [ ] 20+ new materials
- [ ] 10+ new post effects
- [ ] Comprehensive demo scenes
- [ ] Performance targets met

**Phase 3 (Weeks 9-12): Advanced Effects**
- [ ] SSR, GTAO, SSGI implemented
- [ ] Advanced DOF with bokeh
- [ ] Color grading system complete
- [ ] All effects performant
- [ ] Visual quality matches sources

**Phase 4 (Weeks 13-16): Geometry & Animation**
- [ ] Geometry modifiers working
- [ ] Animation systems complete
- [ ] Procedural generation functional
- [ ] All demos polished

**Phase 5 (Weeks 17-20): Launch**
- [ ] All documentation complete
- [ ] Website fully functional
- [ ] All tests passing (80%+ coverage)
- [ ] Performance optimized
- [ ] Public launch ready

### 7.2 Module Acceptance Checklist

For each ported module:
- [ ] Source file identified and reviewed
- [ ] Code ported with correct imports
- [ ] TypeScript types added
- [ ] JSDoc documentation complete
- [ ] `.setLayout()` added (if TSL function)
- [ ] Unit tests written
- [ ] Integration tests passing
- [ ] Visual/functional parity verified
- [ ] Performance acceptable
- [ ] Demo/example created
- [ ] Exported from index.ts
- [ ] Attribution added to JSDoc

### 7.3 Launch Readiness Checklist

**Code Quality:**
- [ ] 150+ modules implemented
- [ ] TypeScript strict mode (100%)
- [ ] No console errors/warnings
- [ ] Linting passing (100%)

**Documentation:**
- [ ] API reference complete (100%)
- [ ] 30+ tutorials
- [ ] 50+ examples
- [ ] 100+ recipes
- [ ] 10+ guides

**Performance:**
- [ ] All targets met
- [ ] Optimizations complete
- [ ] Memory leaks fixed
- [ ] Adaptive quality working

**Testing:**
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests (100%)
- [ ] Visual tests (100%)
- [ ] Performance benchmarks passing
- [ ] Cross-browser tested

**Website:**
- [ ] All routes functional
- [ ] Canvas-first architecture
- [ ] All demos working
- [ ] Agent bridge operational
- [ ] Export/share working

**Content:**
- [ ] North-star demos complete
- [ ] Showcase gallery complete
- [ ] 50+ material presets
- [ ] Video demos created

---

## 8. Success Criteria Summary

### 8.1 Quantitative Metrics

**Module Completeness:**
- ✅ 150+ modules implemented
- ✅ 50+ material presets
- ✅ 30+ post-processing effects
- ✅ 20+ compute utilities

**Performance:**
- ✅ 60 FPS @ 1080p
- ✅ 30 FPS @ 4K
- ✅ < 2.5s load time
- ✅ < 5ms post-FX

**Quality:**
- ✅ 80%+ test coverage
- ✅ ΔE < 2 visual parity
- ✅ 100% graceful fallbacks
- ✅ < 0.1% error rate

**Documentation:**
- ✅ 100% API coverage
- ✅ 30+ tutorials
- ✅ 50+ examples
- ✅ 100+ recipes

### 8.2 Qualitative Metrics

**Developer Experience:**
- One-line presets produce predictable looks
- Clear error messages
- Excellent IDE support
- Fast iteration cycles

**User Experience:**
- Median time to quality visual < 5 minutes
- High preset usage and customization
- 90%+ tutorial completion
- Positive community feedback

**Production Readiness:**
- Used in real projects
- Stable APIs
- Good performance on target hardware
- Comprehensive documentation

---

## Appendix A: Glossary

**TSL** — Three.js Shading Language; node-based shader authoring  
**WebGPU** — Modern graphics API successor to WebGL  
**NodeMaterial** — Three.js material using TSL node graph  
**WGSL** — WebGPU Shading Language  
**SDF** — Signed Distance Function  
**PBR** — Physically Based Rendering  
**GTAO** — Ground Truth Ambient Occlusion  
**SSR** — Screen Space Reflections  
**SSGI** — Screen Space Global Illumination  
**DOF** — Depth of Field  
**CoC** — Circle of Confusion  
**TAA** — Temporal Anti-Aliasing  
**ACES** — Academy Color Encoding System  
**LUT** — Look-Up Table  
**MRT** — Multiple Render Targets  
**FBO** — Frame Buffer Object  
**GPGPU** — General-Purpose GPU computing

---

## Appendix B: References

**Three.js Documentation:**
- https://threejs.org/docs/
- https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
- https://github.com/mrdoob/three.js/wiki/Migration-Guide

**Community Resources:**
- https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
- https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide
- https://discourse.threejs.org/

**WebGPU Resources:**
- https://www.w3.org/TR/webgpu/
- https://gpuweb.github.io/gpuweb/

---

**Document Version**: 2.0  
**Last Updated**: November 7, 2025  
**Status**: Active Development — Foundation Phase  
**Next Review**: Weekly during development

---

**Related Documents:**
- `TSLStudio_Implementation_Plan_v2.md` — Detailed implementation plan
- `COMPREHENSIVE_DEVELOPMENT_PLAN_V1.md` — Original comprehensive plan
- `tsl-toolkit-architecture.md` — Technical architecture
- `RESOURCE_INVENTORY.md` — Detailed resource catalog

