# TSLStudio Implementation Plan v2.0

> **Project**: TSLStudio WebGPU Engine  
> **Version**: 2.0  
> **Date**: November 7, 2025  
> **Timeline**: 20 weeks (5 months)  
> **Current Status**: Foundation Phase (Week 1-4, 20% Complete)

---

## Table of Contents

1. [Overview & Timeline](#1-overview--timeline)
2. [Phase 1: Foundation Enhancement](#2-phase-1-foundation-enhancement-weeks-1-4)
3. [Phase 2: Core Systems Expansion](#3-phase-2-core-systems-expansion-weeks-5-8)
4. [Phase 3: Advanced Effects](#4-phase-3-advanced-effects-weeks-9-12)
5. [Phase 4: Geometry & Animation](#5-phase-4-geometry--animation-weeks-13-16)
6. [Phase 5: Polish & Launch](#6-phase-5-polish--launch-weeks-17-20)
7. [Port Mapping Tables](#7-port-mapping-tables)
8. [Dependency Graph](#8-dependency-graph)
9. [Daily Workflow](#9-daily-workflow)
10. [Progress Tracking](#10-progress-tracking)

---

## 1. Overview & Timeline

### 1.1 Project Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      20-Week Development Timeline                        │
├─────────────────────────────────────────────────────────────────────────┤
│  Weeks 1-4   │ Phase 1: Foundation Enhancement                         │
│  Weeks 5-8   │ Phase 2: Core Systems Expansion                         │
│  Weeks 9-12  │ Phase 3: Advanced Effects (SSR, GTAO, SSGI)           │
│  Weeks 13-16 │ Phase 4: Geometry & Animation                           │
│  Weeks 17-20 │ Phase 5: Polish & Launch                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Phase Summary

| Phase | Duration | Focus | Modules Added | Total Modules | % Complete |
|-------|----------|-------|---------------|---------------|------------|
| **Current** | — | — | 30 | 30 | 20% |
| **Phase 1** | Weeks 1-4 | Foundation | +50 | 80 | 53% |
| **Phase 2** | Weeks 5-8 | Core Systems | +40 | 120 | 80% |
| **Phase 3** | Weeks 9-12 | Advanced FX | +20 | 140 | 93% |
| **Phase 4** | Weeks 13-16 | Compute & Anim | +10 | 150 | 100% |
| **Phase 5** | Weeks 17-20 | Polish | +0 | 150 | Launch |

### 1.3 Key Milestones

- ✅ **Week 0**: Planning complete, resources identified
- ⭕ **Week 4**: Foundation phase complete (80 modules)
- ⭕ **Week 8**: Core systems complete (120 modules)
- ⭕ **Week 12**: Advanced effects complete (140 modules)
- ⭕ **Week 16**: All modules complete (150 modules)
- ⭕ **Week 20**: Public launch

---

## 2. Phase 1: Foundation Enhancement (Weeks 1-4)

### 2.1 Phase Overview

**Goal**: Port essential utilities, establish testing infrastructure, create documentation framework

**Deliverables**:
- Enhanced lighting library (10+ functions)
- Complete noise library (12+ functions)
- Extended SDF library (25+ functions)
- Helper functions (10+)
- Testing infrastructure (Vitest, visual regression)
- Documentation framework
- Module templates

**Target**: 80 modules total (53% complete)

### 2.2 Week 1: Lighting & Noise

#### Day 1-2: Lighting Utilities ⭐ HIGH PRIORITY

**Source**: `RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/`

**Modules to Port**:
```
✅ diffuse.ts         (verify existing)
⭕ ambient.ts         (port)
⭕ directional.ts     (port)
⭕ fresnel.ts         (port)
⭕ hemisphere.ts      (port)
```

**Target**: `packages/tsl/utils/lighting/`

**Steps**:
1. Read source files from portfolio-main
2. Copy to target location
3. Update import paths (three/tsl, three/webgpu)
4. Add TypeScript types
5. Add comprehensive JSDoc
6. Add `.setLayout()` metadata
7. Create unit tests
8. Add to index.ts exports
9. Create demo scene
10. Commit with attribution

**Estimated Time**: 2 days (16 hours)

**Acceptance Criteria**:
- [ ] All lighting functions properly typed
- [ ] JSDoc complete with examples
- [ ] Unit tests passing
- [ ] Visual demo working
- [ ] Performance benchmarked

---

#### Day 3-4: Noise Library Completion

**Sources**:
- `portfolio-main/src/utils/webgpu/nodes/noise/`
- `fragments-boilerplate-vanilla-main/src/tsl/noise/`

**Modules to Port/Verify**:
```
✅ simplex_noise_3d.ts    (verify)
✅ simplex_noise_4d.ts    (verify)
✅ curl_noise_3d.ts       (verify)
✅ curl_noise_4d.ts       (verify)
✅ perlin_noise_3d.ts     (verify)
✅ fbm.ts                 (verify)
✅ turbulence.ts          (verify)
⭕ simplex_noise_2d.ts    (port from portfolio)
⭕ classic_noise_3d.ts    (port from portfolio)
⭕ voronoi.ts             (port from portfolio)
```

**Target**: `packages/tsl/noise/`

**Additional Helpers**:
```
⭕ helpers/octaves.ts      (new - noise layering)
⭕ helpers/domainWarp.ts   (new - domain warping)
⭕ helpers/animation.ts    (new - animated noise)
```

**Estimated Time**: 2 days (16 hours)

**Acceptance Criteria**:
- [ ] All noise functions verified
- [ ] Consistent API across types
- [ ] Performance < 1ms typical usage
- [ ] Visual tests with reference images
- [ ] Noise gallery demo complete

---

#### Day 5-6: Testing Infrastructure Setup

**Tasks**:
1. Install Vitest
2. Configure test environment
3. Create test utilities for WebGPU
4. Setup WebGPU test renderer
5. Create example tests for each module type
6. Configure CI/CD pipeline
7. Setup visual regression testing
8. Create performance benchmarks
9. Document testing guidelines

**File Structure**:
```
packages/
├── tsl/__tests__/
│   ├── setup.ts
│   └── utils.ts
├── noise/__tests__/
│   ├── simplex.test.ts
│   └── curl.test.ts
└── utils/lighting/__tests__/
    ├── diffuse.test.ts
    └── fresnel.test.ts
```

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest'
import { fresnelFn } from '../fresnel'
import { vec3, float } from 'three/tsl'

describe('fresnelFn', () => {
  it('should return 0 for parallel vectors', async () => {
    const viewDir = vec3(0, 0, 1)
    const normal = vec3(0, 0, 1)
    const power = float(5.0)
    const result = fresnelFn(viewDir, normal, power)
    // Test implementation
  })
  
  it('should return 1 for perpendicular vectors', async () => {
    const viewDir = vec3(1, 0, 0)
    const normal = vec3(0, 0, 1)
    const power = float(5.0)
    const result = fresnelFn(viewDir, normal, power)
    // Test implementation
  })
})
```

**Estimated Time**: 2 days (16 hours)

**Acceptance Criteria**:
- [ ] Vitest operational
- [ ] Test utilities created
- [ ] Example tests for all module types
- [ ] CI/CD configured
- [ ] Visual regression setup complete
- [ ] Documentation complete

---

#### Day 7-10: Helper Functions & SDF Start

**Helper Functions** (portfolio-main):
```
Source: src/utils/webgpu/nodes/helpers/
Target: packages/tsl/utils/function/

⭕ smooth_min.ts
⭕ smooth_mod.ts
⭕ remap.ts
⭕ rotate_3d_y.ts
⭕ compose.ts
```

**SDF Primitives** (start):
```
Source: portfolio-main SDF examples
Target: packages/tsl/utils/sdf/primitives/

✅ sphere.ts         (verify)
⭕ box.ts            (port)
⭕ torus.ts          (port)
⭕ cylinder.ts       (port)
```

**Estimated Time**: 4 days (32 hours)

**Acceptance Criteria**:
- [ ] 5+ helpers ported
- [ ] 4+ SDF primitives working
- [ ] Unit tests for all
- [ ] Demo scenes created

---

### 2.3 Week 2: SDF Expansion & Documentation

#### Day 11-13: Complete SDF Library

**SDF Primitives** (continue):
```
Target: packages/tsl/utils/sdf/primitives/

⭕ cone.ts
⭕ capsule.ts
⭕ plane.ts
⭕ octahedron.ts
⭕ pyramid.ts
⭕ roundBox.ts
```

**SDF Operations** (enhance existing):
```
Target: packages/tsl/utils/sdf/operations.ts

✅ union              (verify)
✅ subtraction        (verify)
✅ intersection       (verify)
⭕ smoothUnion        (enhance)
⭕ smoothSubtraction  (new)
⭕ smoothIntersection (new)
⭕ displacement       (new)
⭕ twist              (new)
⭕ bend               (new)
```

**SDF Helpers**:
```
Target: packages/tsl/utils/sdf/helpers/

⭕ raymarch.ts       (raymarching helper)
⭕ calcNormal.ts     (normal calculation)
⭕ calcAO.ts         (ambient occlusion)
⭕ softShadow.ts     (soft shadows)
```

**Estimated Time**: 3 days (24 hours)

**Acceptance Criteria**:
- [ ] All SDF primitives working
- [ ] Smooth operations produce good results
- [ ] Raymarch helper integrated
- [ ] Demo scene with complex SDF compositions
- [ ] Performance optimized (60 FPS @ 1080p)

---

#### Day 14-16: Documentation Framework

**Tasks**:
1. Setup documentation generator (TypeDoc)
2. Create JSDoc templates for all module types
3. Create README templates
4. Create example/recipe templates
5. Create tutorial templates
6. Write first 5 tutorials
7. Generate API documentation
8. Create contribution guidelines

**Documentation Structure**:
```
TSLStudio/docs/
├── api/                    (auto-generated)
│   ├── tsl/
│   ├── engine/
│   └── studio/
├── tutorials/              (step-by-step guides)
│   ├── getting-started.md
│   ├── your-first-material.md
│   ├── noise-basics.md
│   ├── sdf-raymarching.md
│   └── post-processing-intro.md
├── examples/               (complete examples)
│   ├── materials/
│   ├── effects/
│   └── compute/
├── recipes/                (quick recipes)
│   ├── materials.md
│   ├── effects.md
│   └── compute.md
└── guides/                 (conceptual guides)
    ├── architecture.md
    ├── performance.md
    └── best-practices.md
```

**Estimated Time**: 3 days (24 hours)

**Acceptance Criteria**:
- [ ] Documentation generator working
- [ ] Templates created
- [ ] First 5 tutorials written
- [ ] API docs generated
- [ ] Contribution guidelines complete

---

#### Day 17-20: Integration & Phase 1 Review

**Integration Tasks**:
```
⭕ Create demo scenes for all new utilities
⭕ Integration testing
⭕ Performance benchmarks
⭕ Visual regression tests
⭕ Code review
⭕ Phase 1 retrospective
```

**Demo Scenes**:
```
⭕ Lighting models showcase
⭕ Noise gallery
⭕ SDF raymarching demo
⭕ Helper functions demo
```

**Estimated Time**: 4 days (32 hours)

**Phase 1 Acceptance**:
- [ ] 50+ utility functions ported
- [ ] Complete noise library (12+ functions)
- [ ] Complete SDF library (25+ functions)
- [ ] Testing infrastructure operational
- [ ] Documentation framework setup
- [ ] 5+ demo scenes working
- [ ] 80%+ test coverage
- [ ] Performance benchmarks passing

---

## 3. Phase 2: Core Systems Expansion (Weeks 5-8)

### 3.1 Phase Overview

**Goal**: Integrate fluid simulation, expand materials, build advanced particles, add post-FX

**Deliverables**:
- Complete fluid simulation system (2D & 3D)
- Material library expansion (20+ new materials)
- Advanced particle systems (morphing, flow fields, collision)
- Post-processing expansion (10+ new effects)

**Target**: 120 modules total (80% complete)

### 3.2 Week 5-6: Fluid Simulation & Advanced Particles

#### Fluid Simulation Port (6-8 days) ⭐ HIGH PRIORITY

**Source**: `RESOURCES/REPOSITORIES/TSLwebgpuExamples/roquefort-main/src/simulation/`

**Priority Order**:
```
1. simulation/operators/
   ⭕ advection.ts         (semi-Lagrangian advection)
   ⭕ divergence.ts         (divergence calculation)
   ⭕ pressure.ts           (pressure solver - Jacobi)
   ⭕ gradientSubtract.ts   (gradient subtraction)
   ⭕ vorticity.ts          (vorticity confinement)
   ⭕ boundary.ts           (boundary conditions)

2. simulation/emitters/
   ⭕ point.ts              (point emitter)
   ⭕ line.ts               (line emitter)
   ⭕ circle.ts             (circle emitter)
   ⭕ custom.ts             (custom emitter)

3. simulation/rendering/
   ⭕ particles.ts          (particle rendering)
   ⭕ splatting.ts          (fluid splatting)
   ⭕ volumetric.ts         (volumetric rendering)
```

**Target Locations**:
- `packages/tsl/compute/simulation/fluid/` (TSL nodes)
- `packages/engine/compute/fluid/` (high-level API)

**Key Features**:
- Complete 2D Navier-Stokes solver
- Vorticity confinement for turbulence
- Multiple emitter types
- Particle-based visualization
- Dye injection system
- Interactive forces (mouse/touch)

**Porting Steps** (per module):
1. Read original JavaScript
2. Convert to TypeScript
3. Adapt to TSL nodes where applicable
4. Create engine wrapper
5. Add type definitions
6. Add comprehensive JSDoc
7. Create unit tests
8. Create integration tests
9. Create demo scene
10. Optimize performance

**Estimated Time**: 6-8 days (48-64 hours)

**Acceptance Criteria**:
- [ ] 2D fluid solver @ 60 FPS (512x512 grid)
- [ ] Multiple emitters functional
- [ ] Visual quality matches roquefort
- [ ] Interactive mouse/touch forces working
- [ ] Demo: interactive fluid painting
- [ ] Demo: smoke simulation
- [ ] Performance profiled and optimized

---

#### Advanced Particles (4-5 days)

**Sources**:
- `portfolio-main/src/app/lab/` (particle examples)
- `three.js-tsl-sandbox/particles-*`

**Priority Order**:
```
1. systems/
   ✅ basic.ts              (enhance existing)
   ⭕ morphing.ts           (from particles-morphing-2)
   ⭕ flowField.ts          (from flow-field)
   ⭕ collision.ts          (from attractor-collisions)
   ⭕ gpgpu.ts              (from fbo-particles)

2. forces/
   ⭕ gravity.ts            (gravitational force)
   ⭕ wind.ts               (wind force)
   ⭕ turbulence.ts         (turbulence force)
   ✅ curl.ts               (curlNoise.ts → integrate)
   ⭕ attractor.ts          (attractor force)

3. emitters/
   ⭕ point.ts              (point emission)
   ⭕ mesh.ts               (mesh surface emission)
   ⭕ volume.ts             (volume emission)
   ⭕ curve.ts              (curve emission)

4. rendering/
   ✅ points.ts             (existing)
   ⭕ sprites.ts            (sprite particles)
   ⭕ trails.ts             (particle trails)
   ⭕ instanced.ts          (instanced particles)
```

**Target**: `packages/engine/compute/particles/`

**Estimated Time**: 4-5 days (32-40 hours)

**Acceptance Criteria**:
- [ ] 500k+ particles @ 60 FPS
- [ ] Morphing system working smoothly
- [ ] Flow field system integrated
- [ ] Collision detection accurate
- [ ] Demo: morphing shapes
- [ ] Demo: flow field art
- [ ] Demo: particle fireworks

---

### 3.3 Week 7-8: Materials & Post-FX

#### Material Library Phase 1 (6-8 days)

**Priority Order**:
```
1. physical/
   ⭕ glass.ts              (transmission + roughness)
   ⭕ metal.ts              (metalness presets)
   ⭕ fabric.ts             (sheen + subsurface)
   ⭕ skin.ts               (SSS approximation)
   ⭕ ceramic.ts            (clearcoat)
   ⭕ water.ts              (from infinite-water)

2. procedural/
   ⭕ hologram.ts           (from tsl-sandbox)
   ⭕ fresnel.ts            (fresnel-driven)
   ✅ iridescent.ts         (enhance existing)
   ✅ triplanar.ts          (enhance existing)
   ⭕ noise.ts              (noise-driven materials)

3. stylized/
   ⭕ toon.ts               (cel shading)
   ⭕ halftone.ts           (from tsl-sandbox)
   ⭕ sketch.ts             (sketch/hand-drawn)
   ⭕ pixelArt.ts           (pixelated look)

4. special/
   ⭕ portal.ts             (from portal-scene)
   ⭕ dissolve.ts           (dissolve effect)
   ⭕ glitch.ts             (glitch effect)
   ⭕ forceField.ts         (force field effect)
```

**Target**: `packages/engine/materials/`

**Material Presets Target**: 50+ presets across all categories

**Estimated Time**: 6-8 days (48-64 hours)

**Acceptance Criteria**:
- [ ] All physical materials photo-realistic
- [ ] Procedural materials animatable
- [ ] Stylized materials art-directable
- [ ] Material showcase demo working
- [ ] Material builder system implemented
- [ ] Preset manager functional

---

#### Post-Processing Expansion (4-6 days)

**Priority Order**:
```
Existing: ✅
├── bloom.ts
├── taa.ts
├── vignette.ts
├── filmgrain.ts
└── chromaticAberration.ts

New/Enhanced: ⭕
├── halftone.ts         (from tsl-sandbox)
├── ascii.ts            (ASCII art effect)
├── crt.ts              (CRT screen effect)
├── glitch.ts           (glitch effect)
├── datamosh.ts         (datamosh effect)
├── edgeDetection.ts    (edge detection)
├── posterize.ts        (posterization)
└── duotone.ts          (duotone effect)
```

**Effect Chain System Enhancement**:
```typescript
// packages/engine/fx/chain.ts

- Enhance existing chain system
- Add preset chains (Cinema, Tech, Retro, Arcade)
- GPU timing per pass
- Quality presets (Low/Med/High/Ultra)
```

**Target**: `packages/tsl/post/effects/`

**Estimated Time**: 4-6 days (32-48 hours)

**Acceptance Criteria**:
- [ ] All effects working in chain
- [ ] Performance optimized (< 5ms total)
- [ ] Preset chains implemented
- [ ] Post-processing showcase demo
- [ ] GPU timing integrated
- [ ] Quality scaling functional

---

### 3.4 Phase 2 Acceptance

**Deliverables Checklist**:
- [ ] Fluid simulation fully functional
- [ ] Advanced particles working
- [ ] 20+ new materials
- [ ] 10+ new post effects
- [ ] Comprehensive demo scenes
- [ ] Performance targets met
- [ ] 70+ modules total
- [ ] Documentation updated

---

## 4. Phase 3: Advanced Effects (Weeks 9-12)

### 4.1 Phase Overview

**Goal**: Implement screen-space effects, advanced blur/DOF, color grading

**Deliverables**:
- SSR, GTAO, SSGI implementations
- Advanced DOF with bokeh
- Color grading system (LUT3D, curves, tonemapping)
- Enhanced framegraph (MRT, history buffers)

**Target**: 140 modules total (93% complete)

### 4.2 Week 9-10: Screen-Space Effects ⭐ CRITICAL

#### SSR/GTAO/SSGI Implementation (8-10 days)

**Sources**:
- `ssr-gtao-keio/src/script.js`
- `ssgi-ssr-painter/src/script.js`
- `three.js-r181/examples/jsm/nodes/display/`

**Priority Order**:
```
Step 1: Framegraph Enhancements (2-3 days)
⭕ Add MRT (Multiple Render Targets) support
⭕ Add history buffer management
⭕ Add G-buffer pass
⭕ Add depth reconstruction
⭕ Add normal reconstruction

Step 2: SSR Implementation (2-3 days)
⭕ Port SSR shader from ssr-gtao-keio
✅ Temporal accumulation (TemporalAccumulationNode)
⭕ Spatial filtering
✅ Quality presets (performance/balanced/high)

Step 3: GTAO Implementation (2-3 days)
⭕ Port GTAO shader
⭕ Multi-bounce AO
⭕ Spatial filtering
✅ Temporal filtering (shared accumulator)

Step 4: SSGI Implementation (2-3 days)
⭕ Port SSGI shader from ssgi-ssr-painter
⭕ Light bleeding
⭕ Indirect lighting
✅ Temporal accumulation (shared accumulator)
```

**Target**: `packages/engine/fx/`

**Key Features**:
- **SSR**: Ray-traced reflections in screen space
- **GTAO**: High-quality ambient occlusion
- **SSGI**: Indirect lighting approximation
- All with temporal accumulation and spatial filtering

**Estimated Time**: 8-10 days (64-80 hours)

**Acceptance Criteria**:
- [ ] SSR working with realistic reflections
- [ ] GTAO producing smooth AO
- [ ] SSGI providing convincing indirect lighting
- [ ] Temporal accumulation stable
- [ ] Spatial filtering smooth
- [ ] Performance acceptable (30+ FPS @ 1080p)
- [ ] Quality presets (Low/Med/High)
- [ ] Demo scene showcasing all effects

---

### 4.3 Week 11-12: DOF & Color Grading

#### Advanced Blur & DOF (3-4 days)

**Status**: ✅ Most functionality already implemented

**Modules**:
```
✅ blur/gaussian.ts         (separable, compute shader)
✅ blur/radial.ts           (radial blur)
✅ blur/directional.ts      (directional blur)
✅ dof/bokeh_circular.ts    (circular bokeh)
✅ dof/bokeh_hexagonal.ts   (hexagonal bokeh)
✅ dof/advanced.ts          (complete DOF system)
```

**Remaining Work**:
- [ ] Polish existing implementations
- [ ] Optimize performance
- [ ] Create comprehensive demos
- [ ] Add camera rack focus example

**Estimated Time**: 3-4 days (24-32 hours)

---

#### Color Grading System (3-4 days)

**Status**: ✅ Most functionality already implemented

**Modules**:
```
✅ colorGrading/lut3d.ts        (3D LUT support)
✅ colorGrading/curves.ts       (curves adjustment)
✅ tonemapping/aces.ts          (ACES tonemap)
✅ tonemapping/filmic.ts        (filmic tonemap)
✅ tonemapping/reinhard.ts      (Reinhard tonemap)
✅ presets/                     (10+ presets)
```

**Remaining Work**:
- [ ] Polish existing implementations
- [ ] Add more presets
- [ ] Create before/after demo
- [ ] Optimize LUT loading

**Estimated Time**: 3-4 days (24-32 hours)

---

### 4.4 Phase 3 Acceptance

**Deliverables Checklist**:
- [ ] SSR, GTAO, SSGI implemented
- [ ] Advanced DOF working
- [ ] Color grading system complete
- [ ] All effects performant
- [ ] Visual quality matches sources
- [ ] 20+ new modules
- [ ] 140 modules total
- [ ] Documentation updated

---

## 5. Phase 4: Geometry & Animation (Weeks 13-16)

### 5.1 Phase Overview

**Goal**: Add geometry modifiers, animation systems, procedural generation

**Deliverables**:
- Geometry modifiers (displacement, twist, bend, taper, wave)
- Animation & morphing systems
- Procedural generation (terrain, ocean, clouds)
- Scene composition tools

**Target**: 150 modules total (100% complete)

### 5.2 Geometry Modifiers (3-4 days)

**Status**: ✅ Core helpers implemented

**Modules**:
```
✅ geometry/modifiers/displacement.ts
✅ geometry/modifiers/twist.ts
✅ geometry/modifiers/bend.ts
✅ geometry/modifiers/taper.ts
✅ geometry/modifiers/wave.ts
✅ geometry/modifiers/ripple.ts

⭕ helpers/applyToMesh.ts      (wrapper for mesh)
⭕ helpers/applyToSDF.ts       (wrapper for SDF)
```

**Target**: `packages/tsl/utils/geometry/`

**Remaining Work**:
- [ ] Create helper wrappers
- [ ] Integration with mesh system
- [ ] Integration with SDF system
- [ ] Demo scenes
- [ ] Performance optimization

**Estimated Time**: 3-4 days (24-32 hours)

---

### 5.3 Animation & Morphing (4-5 days)

**Status**: ✅ Foundation implemented

**Modules**:
```
✅ animation/morphing/position.ts    (position morphing)
✅ animation/morphing/shape.ts       (shape morphing)
✅ animation/easing/                 (easing functions)
✅ animation/manager.ts              (AnimationManager)
✅ animation/procedural/wave.ts      (wave track)

⭕ animation/morphing/texture.ts     (texture morphing)
⭕ animation/procedural/noise.ts     (noise-based)
⭕ animation/procedural/flow.ts      (flow animation)
⭕ animation/procedural/spring.ts    (spring physics)
⭕ animation/interpolation.ts        (interpolation curves)
```

**Target**: `packages/engine/animation/`

**Remaining Work**:
- [ ] Texture morphing
- [ ] Advanced procedural tracks
- [ ] Interpolation system
- [ ] Demo scenes

**Estimated Time**: 4-5 days (32-40 hours)

---

### 5.4 Procedural Generation (5-6 days)

**Status**: ✅ Partial implementation

**Modules**:
```
✅ terrain/heightMap.ts        (height map generation)
✅ terrain/erosion.ts           (erosion smoothing)
✅ terrain/multiOctave.ts       (multi-octave layering)

✅ ocean/surface.ts             (ocean surface waves)
✅ ocean/foam.ts                (foam generation)
✅ ocean/caustics.ts            (caustics effect)

✅ clouds/volumetric.ts         (volumetric clouds)
✅ clouds/raymarched.ts         (raymarched clouds)
✅ clouds/animated.ts           (animated clouds)

⭕ terrain/generator.ts         (complete terrain system)
⭕ other/rocks.ts               (rock formations)
⭕ other/vegetation.ts          (vegetation)
```

**Target**: `packages/engine/procedural/`

**Remaining Work**:
- [ ] Complete terrain generator
- [ ] Rock formations
- [ ] Vegetation system
- [ ] Integration demos
- [ ] Performance optimization

**Estimated Time**: 5-6 days (40-48 hours)

---

### 5.5 Phase 4 Acceptance

**Deliverables Checklist**:
- [ ] Geometry modifiers working
- [ ] Animation systems complete
- [ ] Procedural generation functional
- [ ] All demos polished
- [ ] 10+ new modules
- [ ] 150 modules total
- [ ] Documentation updated

---

## 6. Phase 5: Polish & Launch (Weeks 17-20)

### 6.1 Phase Overview

**Goal**: Complete documentation, build website, optimize, test, launch

**Deliverables**:
- **Documentation**: 100% API coverage, 30+ tutorials, 50+ examples
- **Website**: Canvas-first architecture with all features
- **Showcase**: North-star demos
- **Performance**: All targets met
- **Testing**: 80%+ coverage
- **Launch**: Public release

### 6.2 Complete Documentation (5-6 days)

**Content Goals**:
```
⭕ API Reference (100% coverage)
   - Auto-generated from JSDoc
   - All modules documented
   - Cross-referenced

⭕ Tutorials (30+)
   - Getting Started
   - Materials (10)
   - Post-Processing (8)
   - Compute (7)
   - Advanced (5+)

⭕ Examples (50+)
   - Basic (15)
   - Intermediate (20)
   - Advanced (15+)

⭕ Recipes (100+)
   - Quick solutions
   - Common patterns
   - Best practices

⭕ Guides (10+)
   - Architecture
   - Performance
   - Best Practices
   - Troubleshooting
```

**Estimated Time**: 5-6 days (40-48 hours)

---

### 6.3 Canvas-First Website (8-10 days)

**Route Structure**:
```
packages/studio/routes/
├── __root.tsx              ✅ EXISTS
├── index.tsx               ✅ EXISTS → ENHANCE (home)
├── labs/                   ⭕ NEW
│   ├── index.tsx           (labs landing)
│   ├── materials.tsx       (material lab)
│   ├── post-fx.tsx         (post-FX lab)
│   ├── particles.tsx       (particle lab)
│   ├── fluids.tsx          (fluid lab)
│   └── compute.tsx         (compute lab)
├── gallery/                ⭕ NEW
│   ├── index.tsx           (gallery landing)
│   ├── stills.tsx          (still images)
│   └── animations.tsx      (animated clips)
├── articles/               ⭕ NEW
│   ├── index.tsx           (articles list)
│   └── [slug].tsx          (individual article)
├── playlists/              ⭕ NEW
│   └── [id].tsx            (playlist viewer)
├── about.tsx               ⭕ NEW
└── admin/                  ⭕ NEW (guarded)
    ├── presets.tsx         (preset management)
    └── content.tsx         (content management)
```

**Key Features**:
- **Persistent Canvas**: Scene morphs across routes
- **State Management**: EngineState provider
- **Presets System**: Versioned scene recipes
- **Snapshots**: Full state capture
- **Agent Bridge**: Parameter registry
- **Performance HUD**: Real-time metrics
- **Export/Share**: State bundles, images, videos

**Estimated Time**: 8-10 days (64-80 hours)

---

### 6.4 Showcase Demos (6-8 days)

**North-Star Demos** (from vision documents):
```
⭕ Peacock Alloy
   - Anisotropic metal
   - Thin-film iridescence
   - Moody color grading
   - Cinematic bloom

⭕ Starry Flow
   - Flow-field particle growth
   - Depth of field
   - Rack focus animation

⭕ Ghost Particles
   - Surface particle emission
   - Curl noise lift
   - Seed-based replay

⭕ Tone-Mapping 101
   - Interactive article
   - Live parameter controls
   - Before/after comparison
```

**Category Showcases**:
```
⭕ Material Showcase (20+ materials)
⭕ Post-FX Showcase (15+ effects)
⭕ Particle Showcase (10+ systems)
⭕ Fluid Showcase (5+ demos)
```

**Estimated Time**: 6-8 days (48-64 hours)

---

### 6.5 Performance Optimization (4-5 days)

**CPU Optimization**:
- [ ] Profile all modules (Chrome DevTools)
- [ ] Optimize hot paths
- [ ] Reduce allocations
- [ ] Cache expensive calculations
- [ ] Lazy initialization

**GPU Optimization**:
- [ ] Profile GPU passes (WebGPU profiling)
- [ ] Optimize shader complexity
- [ ] Reduce texture reads
- [ ] Optimize buffer management
- [ ] Implement adaptive quality

**Memory Optimization**:
- [ ] Track GPU allocations
- [ ] Implement disposal patterns
- [ ] Pool buffers/textures
- [ ] Lazy loading
- [ ] Streaming for large assets

**Adaptive Quality System**:
```typescript
class AdaptiveQuality {
  // Auto-scale based on frame time
  - Dynamic resolution scaling
  - LOD system
  - Effect quality presets
  - Graceful degradation
}
```

**Estimated Time**: 4-5 days (32-40 hours)

---

### 6.6 Testing & QA (6-8 days)

**Test Coverage Goals**:
```
⭕ Unit Tests (80%+ coverage)
   - All functions tested
   - Edge cases covered
   - Performance benchmarks

⭕ Integration Tests (100%)
   - Complete pipelines
   - Material → Render path
   - Post-FX chains
   - Compute systems

⭕ Visual Regression Tests (100%)
   - Golden image comparison
   - ΔE < 2 tolerance
   - Cross-platform

⭕ Performance Benchmarks
   - Frame time tracking
   - GPU pass timing
   - Memory usage
   - Automated CI

⭕ Cross-Browser Testing
   - Chrome (primary)
   - Firefox (WebGPU)
   - Edge (WebGPU)
   - Safari (future)
```

**Estimated Time**: 6-8 days (48-64 hours)

---

### 6.7 Phase 5 Acceptance

**Launch Readiness**:
- [ ] All documentation complete
- [ ] Website fully functional
- [ ] All demos working
- [ ] Performance targets met
- [ ] All tests passing
- [ ] Ready for public launch

---

## 7. Port Mapping Tables

### 7.1 Lighting Utilities

| Source File | Target File | Priority | Effort | Status |
|------------|-------------|----------|--------|--------|
| `portfolio-main/...lighting/diffuse.ts` | `packages/tsl/utils/lighting/diffuse.ts` | High | 1h | ✅ Done |
| `portfolio-main/...lighting/ambient.ts` | `packages/tsl/utils/lighting/ambient.ts` | High | 2h | ⭕ Todo |
| `portfolio-main/...lighting/directional.ts` | `packages/tsl/utils/lighting/directional.ts` | High | 2h | ⭕ Todo |
| `portfolio-main/...lighting/fresnel.ts` | `packages/tsl/utils/lighting/fresnel.ts` | High | 3h | ⭕ Todo |
| `portfolio-main/...lighting/hemisphere.ts` | `packages/tsl/utils/lighting/hemisphere.ts` | High | 2h | ⭕ Todo |

### 7.2 Noise Functions

| Source File | Target File | Priority | Effort | Status |
|------------|-------------|----------|--------|--------|
| `fragments-boilerplate/.../simplex_noise_3d.ts` | `packages/tsl/noise/simplex_noise_3d.ts` | Med | 1h | ✅ Done |
| `fragments-boilerplate/.../simplex_noise_4d.ts` | `packages/tsl/noise/simplex_noise_4d.ts` | Med | 1h | ✅ Done |
| `fragments-boilerplate/.../curl_noise_3d.ts` | `packages/tsl/noise/curl_noise_3d.ts` | Med | 1h | ✅ Done |
| `fragments-boilerplate/.../curl_noise_4d.ts` | `packages/tsl/noise/curl_noise_4d.ts` | Med | 1h | ✅ Done |
| `fragments-boilerplate/.../perlin_noise_3d.ts` | `packages/tsl/noise/perlin_noise_3d.ts` | Med | 1h | ✅ Done |
| `fragments-boilerplate/.../fbm.ts` | `packages/tsl/noise/fbm.ts` | Med | 1h | ✅ Done |
| `fragments-boilerplate/.../turbulence.ts` | `packages/tsl/noise/turbulence.ts` | Med | 1h | ✅ Done |
| `portfolio-main/.../simplexNoise2d.ts` | `packages/tsl/noise/simplex_noise_2d.ts` | Med | 2h | ⭕ Todo |
| `portfolio-main/.../classicNoise3d.ts` | `packages/tsl/noise/classic_noise_3d.ts` | Med | 2h | ⭕ Todo |
| `portfolio-main/.../voronoi.ts` | `packages/tsl/noise/voronoi.ts` | Med | 3h | ⭕ Todo |

### 7.3 Fluid Simulation

| Source File | Target File | Priority | Effort | Status |
|------------|-------------|----------|--------|--------|
| `roquefort-main/...advect.js` | `packages/tsl/compute/.../advection.ts` | High | 4h | ⭕ Todo |
| `roquefort-main/...divergence.js` | `packages/tsl/compute/.../divergence.ts` | High | 3h | ⭕ Todo |
| `roquefort-main/...pressure.js` | `packages/tsl/compute/.../pressure.ts` | High | 4h | ⭕ Todo |
| `roquefort-main/...gradient_subtract.js` | `packages/tsl/compute/.../gradientSubtract.ts` | High | 3h | ⭕ Todo |
| `roquefort-main/...vorticity.js` | `packages/tsl/compute/.../vorticity.ts` | High | 4h | ⭕ Todo |
| `roquefort-main/...emitters.js` | `packages/tsl/compute/.../emitters.ts` | Med | 3h | ⭕ Todo |

### 7.4 Screen-Space Effects

| Source File | Target File | Priority | Effort | Status |
|------------|-------------|----------|--------|--------|
| `ssr-gtao-keio/src/script.js` | `packages/engine/fx/ssr.ts` | Critical | 16h | ⭕ Todo |
| `ssr-gtao-keio/src/script.js` | `packages/engine/fx/gtao.ts` | Critical | 12h | ⭕ Todo |
| `ssgi-ssr-painter/src/script.js` | `packages/engine/fx/ssgi.ts` | Critical | 16h | ⭕ Todo |

---

## 8. Dependency Graph

### 8.1 Module Dependencies

```
Lighting Utils ───────┐
                      ├──> Materials ──┐
Noise Functions ──────┘                │
                                       ├──> Complete Scenes
SDF Library ──────────┐                │
                      ├──> Post-FX ────┘
Helper Functions ─────┘

Compute Base ─────────┐
                      ├──> Particles ──┐
Fluid Operators ──────┘                │
                                       ├──> Advanced Demos
Geometry Modifiers ───┐                │
                      ├──> Animation ──┘
Morphing System ──────┘
```

### 8.2 Critical Path

```
Week 1-2:  Foundation (Lighting, Noise, SDF)
    ↓
Week 3-4:  Testing & Docs Setup
    ↓
Week 5-6:  Fluid & Particles
    ↓
Week 7-8:  Materials & Post-FX
    ↓
Week 9-10: Screen-Space FX (CRITICAL)
    ↓
Week 11-12: DOF & Color Grading
    ↓
Week 13-16: Geometry & Animation & Procedural
    ↓
Week 17-20: Polish & Launch
```

---

## 9. Daily Workflow

### 9.1 Module Porting Checklist

**For Each Module**:
```
□ 1. Identify source file and location
□ 2. Create target file with proper path
□ 3. Copy source code verbatim
□ 4. Update imports (three/tsl, three/webgpu)
□ 5. Add TypeScript types
□ 6. Add comprehensive JSDoc
□ 7. Add .setLayout() if TSL function
□ 8. Create unit tests
□ 9. Add to index.ts exports
□ 10. Create demo/example
□ 11. Update documentation
□ 12. Visual/performance test
□ 13. Code review
□ 14. Commit with attribution
```

### 9.2 Daily Stand-up Questions

1. What did I complete yesterday?
2. What am I working on today?
3. Any blockers or risks?
4. Performance/quality concerns?
5. Help needed?

### 9.3 Weekly Review

**Every Friday**:
- Review completed modules
- Update progress tracking
- Check phase milestones
- Identify blockers
- Plan next week
- Update documentation

---

## 10. Progress Tracking

### 10.1 Module Count Progress

```
Current:  ~30 modules (20%)
Phase 1:  +50 = 80 modules (53%)
Phase 2:  +40 = 120 modules (80%)
Phase 3:  +20 = 140 modules (93%)
Phase 4:  +10 = 150 modules (100%)
Phase 5:  +0  = 150 modules (Launch)
```

### 10.2 Category Progress

| Category | Total | Complete | Remaining | % Done |
|----------|-------|----------|-----------|--------|
| Lighting | 10 | 1 | 9 | 10% |
| Noise | 12 | 8 | 4 | 67% |
| SDF | 27 | 3 | 24 | 11% |
| Materials | 25 | 7 | 18 | 28% |
| Post-FX | 30 | 10 | 20 | 33% |
| Particles | 15 | 1 | 14 | 7% |
| Fluid | 8 | 1 | 7 | 13% |
| Screen-Space | 5 | 0 | 5 | 0% |
| Geometry | 10 | 0 | 10 | 0% |
| Animation | 10 | 0 | 10 | 0% |
| Procedural | 8 | 0 | 8 | 0% |
| **TOTAL** | **150** | **31** | **119** | **21%** |

### 10.3 Phase Status

```
Phase 1: ⏳ IN PROGRESS (Weeks 1-4)
  - Start Date: November 7, 2025
  - Target End: December 5, 2025
  - Progress: 20% → 53%
  - Status: On track

Phase 2: ⏸️ PLANNED (Weeks 5-8)
  - Start Date: December 6, 2025
  - Target End: January 2, 2026
  - Progress: 53% → 80%

Phase 3: ⏸️ PLANNED (Weeks 9-12)
  - Start Date: January 3, 2026
  - Target End: January 30, 2026
  - Progress: 80% → 93%

Phase 4: ⏸️ PLANNED (Weeks 13-16)
  - Start Date: January 31, 2026
  - Target End: February 27, 2026
  - Progress: 93% → 100%

Phase 5: ⏸️ PLANNED (Weeks 17-20)
  - Start Date: February 28, 2026
  - Target End: March 27, 2026
  - Progress: Polish & Launch
```

### 10.4 Velocity Tracking

**Target Velocity**: 6 modules/week average

**Current Velocity**: TBD (start Phase 1)

**Projected Completion**:
- At 6 modules/week: 20 weeks ✅ ON TRACK
- At 4 modules/week: 30 weeks ⚠️ RISK
- At 8 modules/week: 15 weeks ⏫ AHEAD

---

## Appendix A: Quick Reference

### Source Repositories

| Repository | Path | Priority | Modules |
|------------|------|----------|---------|
| Portfolio Main | `RESOURCES/.../portfolio-main/` | ⭐⭐⭐⭐⭐ | 40+ |
| Fragments Boilerplate | `RESOURCES/.../fragments-boilerplate-main/` | ⭐⭐⭐⭐⭐ | 30+ |
| Roquefort Fluid | `RESOURCES/.../roquefort-main/` | ⭐⭐⭐⭐ | 8+ |
| SSR/GTAO | `RESOURCES/.../ssr-gtao-keio/` | ⭐⭐⭐⭐⭐ | 3 |
| SSGI | `RESOURCES/.../ssgi-ssr-painter/` | ⭐⭐⭐⭐⭐ | 2 |
| TSL Sandbox | `RESOURCES/.../three.js-tsl-sandbox-master/` | ⭐⭐⭐⭐ | 30+ |
| Three.js r181 | `RESOURCES/three.js-r181/` | ⭐⭐⭐ | Reference |

### Target Packages

| Package | Path | Purpose |
|---------|------|---------|
| TSL Library | `packages/tsl/` | Low-level TSL nodes |
| Engine | `packages/engine/` | High-level systems |
| Studio | `packages/studio/` | React application |

---

**Document Version**: 2.0  
**Last Updated**: November 7, 2025  
**Status**: Active Development — Foundation Phase  
**Next Review**: Weekly during development

---

**Related Documents:**
- `TSLStudio_PRD_v2.md` — Product Requirements Document
- `COMPREHENSIVE_DEVELOPMENT_PLAN_V1.md` — Original comprehensive plan
- `tsl-toolkit-architecture.md` — Technical architecture
- `RESOURCE_INVENTORY.md` — Detailed resource catalog

