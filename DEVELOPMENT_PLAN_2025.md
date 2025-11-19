# TSL-WebGPU Engine — Development Plan 2025
**Version:** 2.0  
**Date:** November 19, 2025  
**Status:** Ready for Implementation

---

## Executive Summary

This document provides a comprehensive development plan to evolve the TSL-WebGPU Engine from its current foundation state into a fully-featured, production-ready creative coding engine. The plan is based on analysis of the current codebase, available resources, and the vision outlined in the proposal documents.

---

## Current State Analysis

### ✅ What's Working

**Foundation Layer:**
- ✅ Vite + TanStack Router + React Three Fiber stack
- ✅ WebGPU renderer integration with proper async init
- ✅ Sketch routing system (`src/sketches/*` → dynamic routes)
- ✅ Working TSL utilities:
  - Noise functions (Perlin, Simplex, Curl, FBM, Turbulence)
  - Post-processing effects (grain, vignette, LCD, pixellation, canvas weave)
  - Color utilities (cosine palette, tonemapping)
  - SDF shapes and operations
  - Math utilities (complex numbers, coordinates)
  - Function helpers (bloom, screen aspect UV, repeating patterns)
  - Lighting utilities
- ✅ Working demo sketches (flare-1, dawn-1)
- ✅ Leva integration for controls
- ✅ Debug panel system

**Tech Stack:**
- Three.js: 0.180.0 (need to upgrade to 0.181.0)
- React: 19.1.1
- @react-three/fiber: 9.3.0
- @react-three/drei: 10.7.4
- Leva: 0.10.0

### ⚠️ What Needs Implementation

**Engine Layer (`src/engine/`):**
- ❌ Core types and configuration (files exist but empty)
- ❌ Materials system (files created but not implemented)
  - basicLambert.ts (empty)
  - pbrMaterial.ts (empty)
  - phiMetal.ts (empty)
  - sssMaterial.ts (empty)
- ❌ PostFX chains (files created but not implemented)
  - bloomChain.ts (empty)
  - depthOfField.ts (empty)
  - grainVignette.ts (empty)
  - motionBlur.ts (empty)
- ❌ Fields subsystem (files created but not implemented)
  - curlNoiseField.ts (empty)
  - sdfPrimitives.ts (empty)
- ❌ Particles & Compute (files created but not implemented)
  - attractorSystem.ts (empty)
  - boidsSystem.ts (empty)
  - computeParticles.ts (empty)
  - flowFieldParticles.ts (empty)
- ❌ Presets (files created but empty)
  - colorPalettes.ts (empty)
  - heroSketches.ts (empty)
  - parameterPresets.ts (empty)
- ❌ Engine utilities (files created but empty)
- ❌ Demo sketches for engine modules (files exist but not working)

**Documentation:**
- ❌ ENGINE_API.md (empty)
- ❌ README.md files (empty)
- ❌ Knowledge base incomplete

### 📦 Available Resources

**High-Value Resources in `.RESOURCES/`:**

1. **Three.js r181 Official Source & Examples**
   - Complete source code with TSL nodes
   - 554 HTML examples (WebGPU, compute, particles, materials)
   - Node editor and playground utilities

2. **Portfolio Examples:**
   - blog.maximeheckel.com (560 files: 191 .tsx, 170 .ts)
   - portfolio-main (447 files: 121 .tsx, 97 .ts, 69 .glsl)
   - tsl-textures-main (451 files with texture generation)

3. **TSL/WebGPU Example Projects (33 repositories):**
   - three.js-tsl-sandbox-master (445 files, 124 .js)
   - tsl-particles-of-a-thousand-faces-main (64 files)
   - Splash-main (36 files, 18 .wgsl)
   - WaterBall-main (34 files, 14 .wgsl)
   - flow-master, fluidglass-main, singularity-master, etc.

---

## Development Phases

### Phase 0: Foundation Upgrade & Resource Setup
**Duration:** 1-2 days  
**Priority:** CRITICAL

#### Tasks

**0.1. Dependency Upgrades**
```bash
# Upgrade Three.js to r181
pnpm add three@^0.181.0

# Verify React Three Fiber compatibility
pnpm add @react-three/fiber@latest @react-three/drei@latest

# Test basic rendering after upgrade
pnpm dev
```

**0.2. Create Resource Inventory Structure**
```bash
mkdir -p INVENTORY/{threejs_examples,portfolio_patterns,tsl_projects,extracted_modules}
mkdir -p INVENTORY/docs
```

**0.3. Extract High-Priority Three.js Examples**

Copy critical examples for reference:
- `webgpu_compute_*.html` → Study compute shader patterns
- `webgpu_particles_*.html` → Particle system architectures
- `webgpu_materials_*.html` → Material node patterns
- `jsm/nodes/` utilities → TSL helper functions

**0.4. Update Knowledge Base**

Create/update documentation:
- `INVENTORY/docs/THREE_R181_CHANGES.md` - API changes from r180→r181
- `INVENTORY/docs/TSL_PATTERNS.md` - Common TSL patterns
- `INVENTORY/docs/COMPUTE_SHADERS.md` - Compute shader scaffolding
- `INVENTORY/docs/RESOURCE_INDEX.md` - Catalog of available resources

**Exit Criteria:**
- ✅ Three.js upgraded to r181 and working
- ✅ Resource inventory structure created
- ✅ High-priority examples extracted
- ✅ Knowledge base updated

---

### Phase 1: Engine Core Implementation
**Duration:** 1 week  
**Priority:** HIGH

#### 1.1. Core Types & Configuration

**File: `src/engine/core/engineTypes.ts`**

Implement comprehensive TypeScript types:

```typescript
// Material system types
export interface MaterialNodeConfig {
  colorNode: Node
  roughnessNode?: Node
  metalnessNode?: Node
  normalNode?: Node
  emissiveNode?: Node
  opacityNode?: Node
  aoNode?: Node
  uniforms?: Record<string, any>
}

// PostFX system types
export interface PostFXPass {
  name: string
  process: (input: Node) => Node
  uniforms?: Record<string, any>
  enabled?: boolean
}

export interface PostFXChain {
  passes: PostFXPass[]
  compose: (input: Node) => Node
}

// Field system types
export interface VectorField {
  sampleAt: (p: Node) => Node
  scale?: number
  octaves?: number
}

// Particle system types
export interface ParticleSystemConfig {
  count: number
  computeInit: (index: Node) => Node
  computeUpdate: (position: Node, velocity: Node, index: Node) => { position: Node; velocity: Node }
  renderMaterial: Material
}
```

**File: `src/engine/core/engineConfig.ts`**

Global configuration with presets:

```typescript
export interface EngineConfig {
  renderer: {
    preferWebGPU: boolean
    enableCompute: boolean
    antialias: boolean
    powerPreference: 'high-performance' | 'low-power' | 'default'
  }
  particles: {
    maxCount: number
    defaultWorkgroupSize: number
  }
  postfx: {
    enabled: boolean
    quality: 'low' | 'medium' | 'high'
  }
  debug: {
    showStats: boolean
    logPerformance: boolean
  }
}

export const defaultEngineConfig: EngineConfig = { /* ... */ }
```

**File: `src/engine/core/createEngineSketch.ts`**

Sketch composition utility:

```typescript
export interface EngineSketchConfig {
  material?: MaterialNodeConfig
  postfx?: PostFXChain
  fields?: VectorField[]
  background?: Node
}

export const createEngineSketch = (config: EngineSketchConfig): Node => {
  // Compose material, postfx, fields into final shader
}
```

**Exit Criteria:**
- ✅ All core types defined and documented
- ✅ Engine configuration system working
- ✅ Sketch composition utility functional

#### 1.2. Material System - Foundation

**Implement 4 Core Materials:**

1. **Basic Lambert** (`src/engine/materials/basicLambert.ts`)
   - Simple diffuse lighting
   - Ambient + directional light
   - Color + roughness controls
   - Demo: `src/sketches/engine/materials/basic_lambert.ts`

2. **Phi Metal** (`src/engine/materials/phiMetal.ts`)
   - Fresnel-based metallic look
   - Noise perturbation
   - Animated highlights
   - Demo: `src/sketches/engine/materials/phi_metal.ts`

3. **PBR Material** (`src/engine/materials/pbrMaterial.ts`)
   - Metallic/roughness workflow
   - Image-based lighting support
   - Normal mapping
   - Demo: `src/sketches/engine/materials/pbr_material.ts`

4. **SSS Approximation** (`src/engine/materials/sssMaterial.ts`)
   - Translucency effect
   - Depth-based scattering
   - Backlight simulation
   - Demo: `src/sketches/engine/materials/sss_material.ts`

**Reference Sources:**
- Basic lighting: Three.js MeshStandardNodeMaterial patterns
- Phi Metal: Portfolio examples, custom Fresnel implementations
- PBR: Three.js r181 PBR node materials
- SSS: blog.maximeheckel.com subsurface examples

**Each Material Must Have:**
- TypeScript parameter interface
- Leva controls integration
- JSDoc documentation
- Working demo sketch

**Exit Criteria:**
- ✅ 4 materials fully implemented
- ✅ Each material has working demo
- ✅ Leva controls for all parameters
- ✅ Material composition working

#### 1.3. Utility Layer Enhancement

**Consolidate and Enhance Utilities:**

**File: `src/engine/utils/noise.ts`**
- Port existing TSL noise functions
- Add noise composition utilities
- Add domain warping helpers

**File: `src/engine/utils/color.ts`**
- Port existing color utilities
- Add color space conversions
- Add palette generation

**File: `src/engine/utils/math.ts`**
- Port existing math utilities
- Add vector field operations
- Add interpolation functions

**File: `src/engine/utils/coords.ts`**
- Coordinate transformations
- Domain repetition
- Space folding

**Exit Criteria:**
- ✅ All utilities ported and enhanced
- ✅ Comprehensive JSDoc documentation
- ✅ Test cases for critical functions

---

### Phase 2: PostFX & Fields
**Duration:** 1 week  
**Priority:** HIGH

#### 2.1. PostFX System Implementation

**Implement 4 PostFX Chains:**

1. **Bloom Chain** (`src/engine/postfx/bloomChain.ts`)
   - Threshold extraction
   - Gaussian blur (multiple passes)
   - Bloom composite
   - Demo: `src/sketches/engine/postfx/bloom.ts`

2. **Grain + Vignette** (`src/engine/postfx/grainVignette.ts`)
   - Film grain texture
   - Vignette effect
   - Chainable with other effects
   - Demo: `src/sketches/engine/postfx/grain_vignette.ts`

3. **Depth of Field** (`src/engine/postfx/depthOfField.ts`)
   - Circle of confusion calculation
   - Bokeh blur
   - Focus distance control
   - Demo: `src/sketches/engine/postfx/depth_of_field.ts`

4. **Motion Blur** (`src/engine/postfx/motionBlur.ts`)
   - Velocity buffer
   - Directional blur
   - Intensity control
   - Demo: `src/sketches/engine/postfx/motion_blur.ts`

**PostFX Chain Composition:**
- Build chainable pass system
- Support pass enable/disable
- Quality presets (low/medium/high)

**Reference Sources:**
- Three.js r181 postprocessing examples
- Portfolio postFX implementations
- Existing TSL post_processing utilities

**Exit Criteria:**
- ✅ 4 PostFX chains implemented
- ✅ Chain composition working
- ✅ Demo sketches for each effect
- ✅ Performance acceptable (>30fps)

#### 2.2. Field System Implementation

**Implement Field Utilities:**

1. **Curl Noise Field** (`src/engine/fields/curlNoiseField.ts`)
   - 3D curl noise generation
   - Divergence-free vector fields
   - Scale and octave controls
   - Demo: `src/sketches/engine/fields/curl_noise_flow.ts`

2. **SDF Primitives** (`src/engine/fields/sdfPrimitives.ts`)
   - Basic shapes (sphere, box, torus, cylinder)
   - SDF operations (union, subtract, intersect, smooth blend)
   - Domain repetition
   - Demo: `src/sketches/engine/fields/sdf_shapes.ts`

3. **Vector Field Composition** (new file)
   - Combine multiple fields
   - Field operations (add, multiply, cross)
   - Texture-based flow fields

**Reference Sources:**
- flow-master (vector fields)
- raymarching-tsl-main (SDF operations)
- Existing curl noise implementations

**Exit Criteria:**
- ✅ Field utilities implemented
- ✅ SDF primitives and operations working
- ✅ Demo sketches functional
- ✅ Integration with particle systems

---

### Phase 3: Particle Systems & Compute
**Duration:** 1-2 weeks  
**Priority:** HIGH

#### 3.1. Compute Shader Foundation

**File: `src/engine/particles/computeParticles.ts`**

Build compute shader scaffolding:
- Buffer initialization
- Workgroup management
- Storage buffer attributes
- Compute dispatch helpers

**Reference Sources:**
- Three.js r181 compute examples
- tsl-compute-particles
- Splash-main (WGSL patterns)

#### 3.2. Particle System Implementation

**Implement 4 Particle Systems:**

1. **Attractor System** (`src/engine/particles/attractorSystem.ts`)
   - Point attractor forces
   - Orbital motion
   - Trail rendering
   - Demo: `src/sketches/engine/particles/attractor_cloud.ts`

2. **Flow Field Particles** (`src/engine/particles/flowFieldParticles.ts`)
   - Follow curl noise fields
   - Speed variation
   - Life cycle management
   - Demo: `src/sketches/engine/particles/flow_field_trails.ts`

3. **Boids System** (`src/engine/particles/boidsSystem.ts`)
   - Separation, alignment, cohesion
   - Obstacle avoidance
   - Neighbor search
   - Demo: `src/sketches/engine/particles/boids_flock.ts`

4. **Particle Swarm** (`src/engine/particles/particleSwarm.ts`)
   - Swarm behaviors
   - Dynamic targets
   - Emergent patterns
   - Demo: `src/sketches/engine/particles/particle_swarm.ts`

**Reference Sources:**
- tsl-particles-of-a-thousand-faces (React integration)
- webgpu-tsl-linkedparticles (connected particles)
- webgputest-particlesSDF (SDF interaction)
- Three.js compute examples

**Particle System Requirements:**
- Use StorageInstancedBufferAttribute
- GPU-driven simulation
- Instanced rendering
- 100k+ particles target

**Exit Criteria:**
- ✅ Compute scaffolding working
- ✅ 4 particle systems implemented
- ✅ Demo sketches functional
- ✅ Performance: 60fps with 100k particles

---

### Phase 4: Presets & Hero Sketches
**Duration:** 3-5 days  
**Priority:** MEDIUM

#### 4.1. Preset Library

**File: `src/engine/presets/colorPalettes.ts`**
- 10+ curated color palettes
- Cosine palette generators
- Gradient utilities

**File: `src/engine/presets/parameterPresets.ts`**
- Material presets (chrome, gold, glass, etc.)
- PostFX presets (cinematic, retro, neon, etc.)
- Field presets (flow patterns, SDF shapes)

**File: `src/engine/presets/heroSketches.ts`**
- Complete scene compositions
- One-liner setup
- 5+ production-quality presets

#### 4.2. Hero Sketches

Create 3+ portfolio-ready demos:

1. **Cinematic Portrait** (`src/sketches/engine/presets/cinematic_portrait.ts`)
   - PBR material with SSS
   - Bloom + color grading
   - Dramatic lighting

2. **Golden Glow** (`src/sketches/engine/presets/golden_glow.ts`)
   - Metallic material
   - Particle sparkles
   - Warm color palette

3. **Neon Metropolis** (`src/sketches/engine/presets/neon_metropolis.ts`)
   - Emissive materials
   - Flow field particles
   - Cyberpunk aesthetic

**Exit Criteria:**
- ✅ Preset library complete
- ✅ 3+ hero sketches production-ready
- ✅ One-liner preset usage working
- ✅ Visual quality matches reference portfolios

---

### Phase 5: Documentation & Polish
**Duration:** 3-5 days  
**Priority:** MEDIUM

#### 5.1. Core Documentation

**Create/Complete:**

1. **ENGINE_README.md**
   - Architecture overview
   - Quick start guide
   - Module catalog
   - API reference links

2. **ENGINE_API.md**
   - Complete API documentation
   - Type definitions
   - Code examples for each module

3. **INTEGRATION_GUIDE.md**
   - How to use engine in sketches
   - Migration from base sketches
   - Best practices

4. **PORTING_GUIDE.md**
   - How to add new materials
   - How to add new particle systems
   - Coding standards

5. **KNOWLEDGE_BASE.md**
   - TSL patterns and tips
   - Performance optimization
   - Troubleshooting

#### 5.2. Code Quality

**Tasks:**
- JSDoc all public APIs
- Add inline documentation
- Create usage examples in comments
- Type safety: eliminate `any` types where possible
- ESLint: fix all warnings

#### 5.3. Testing & Validation

**Manual Testing:**
- Test all demo sketches
- Verify Leva controls
- Check performance (60fps target)
- Cross-browser testing (Chrome, Edge)

**Performance Profiling:**
- Identify bottlenecks
- Optimize shader complexity
- Optimize compute dispatches

**Exit Criteria:**
- ✅ All documentation complete
- ✅ All code documented with JSDoc
- ✅ All demos working smoothly
- ✅ Performance targets met

---

### Phase 6: Advanced Features (Future)
**Duration:** Ongoing  
**Priority:** LOW (post-launch)

#### 6.1. Advanced Materials

**Additional Materials to Port:**
- Glass with chromatic dispersion (fluidglass-main)
- Holographic/iridescent materials
- Stylized toon shading
- Volumetric materials
- Water/ocean materials
- Advanced SSS with depth maps

#### 6.2. Advanced Particle Systems

**Additional Systems:**
- Fluid simulation (WaterBall-main, Splash-main)
- Soft body physics (softbodies-master)
- Cloth simulation
- SPH (Smoothed Particle Hydrodynamics)
- Linked/connected particles

#### 6.3. Advanced Effects

**Additional Features:**
- Raymarching framework
- Volumetric rendering
- Screen-space reflections
- Ambient occlusion
- Global illumination approximations

#### 6.4. UI/Interaction Enhancements

**Gallery & Showcase:**
- Enhanced preset gallery (use existing PresetGallery.tsx)
- Category filtering
- Search functionality
- Favorite/bookmark system

**Enhanced Controls:**
- Custom Leva themes
- Preset save/load
- Parameter animation
- Timeline controls

---

## Resource Integration Strategy

### High-Priority Resources to Study

**Phase 1 (Materials):**
- `portfolio-main/` - Material implementations
- `blog.maximeheckel.com/` - Advanced shaders
- Three.js r181 material nodes

**Phase 2 (PostFX & Fields):**
- Three.js r181 postprocessing examples
- `flow-master/` - Vector fields
- `raymarching-tsl-main/` - SDF operations

**Phase 3 (Particles):**
- `three.js-tsl-sandbox-master/` - Comprehensive patterns
- `tsl-particles-of-a-thousand-faces/` - Particle architectures
- `Splash-main/` - WGSL compute patterns
- `webgpu-tsl-linkedparticles/` - Connected particles

**Phase 4 (Advanced):**
- `WaterBall-main/` - Fluid simulation
- `singularity-master/` - Complex effects
- `fluidglass-main/` - Advanced materials

### Extraction Process

For each resource:
1. **Study** - Understand the implementation
2. **Extract** - Copy relevant code to INVENTORY
3. **Adapt** - Convert to project patterns (TSL, TypeScript)
4. **Test** - Create demo sketch
5. **Document** - Add JSDoc and usage notes
6. **Integrate** - Add to engine exports

---

## Success Metrics

### Technical Metrics
- [ ] 100% backward compatibility with existing sketches
- [ ] Zero TypeScript errors
- [ ] Engine modules are framework-agnostic (can be extracted)
- [ ] 60fps @ 1080p for all demos
- [ ] <16ms frame time for standard quality
- [ ] 100k+ particles at 60fps

### Developer Experience Metrics
- [ ] New sketch creation: <5 minutes
- [ ] Material customization: <10 lines of code
- [ ] Preset usage: 1-liner
- [ ] Clear TypeScript types for all APIs
- [ ] Every feature has working demo
- [ ] JSDoc coverage: 90%+

### Portfolio Quality Metrics
- [ ] 5+ hero-level visual experiences
- [ ] Smooth 60fps on target hardware
- [ ] Aesthetic quality matches reference portfolios
- [ ] Mobile WebGPU compatibility where supported

---

## Risk Mitigation

### Technical Risks

**Risk: Three.js r181 API changes**
- Mitigation: Pin version, test thoroughly, document breaking changes

**Risk: WebGPU browser compatibility**
- Mitigation: Focus on Chrome/Edge, document fallbacks, graceful degradation

**Risk: Performance issues**
- Mitigation: Early profiling, quality presets, LOD systems

**Risk: Compute shader complexity**
- Mitigation: Start simple, iterate, reference Three.js examples

### Development Risks

**Risk: Scope creep**
- Mitigation: Strict phase boundaries, MVP first, defer "nice-to-have"

**Risk: Resource integration complexity**
- Mitigation: Start with simplest examples, incremental porting

**Risk: Time estimation**
- Mitigation: Break tasks into smaller chunks, track progress daily

---

## Timeline Estimate

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 0** | 1-2 days | Three.js r181, resource inventory |
| **Phase 1** | 1 week | Core types + 4 materials |
| **Phase 2** | 1 week | 4 PostFX chains + 2 field systems |
| **Phase 3** | 1-2 weeks | 4 particle systems + compute |
| **Phase 4** | 3-5 days | Presets + 3 hero sketches |
| **Phase 5** | 3-5 days | Documentation + polish |
| **Total** | **4-5 weeks** | Production-ready engine |

---

## Next Steps (Immediate Actions)

### Day 1: Foundation
1. Upgrade Three.js to r181
2. Create INVENTORY structure
3. Extract critical Three.js examples
4. Test existing sketches still work

### Day 2: Core Implementation Start
1. Implement `engineTypes.ts`
2. Implement `engineConfig.ts`
3. Implement `createEngineSketch.ts`
4. Start first material (basicLambert)

### Week 1 Goal
- Core types complete
- 2+ materials working
- Demo sketches functional
- Leva controls integrated

---

## Conclusion

This development plan provides a clear, actionable roadmap to transform the TSL-WebGPU Engine from its current foundation state into a comprehensive, production-ready creative coding engine.

**Key Principles:**
- Build on solid foundation (don't break existing work)
- Implement systematically (one module at a time)
- Test continuously (every feature has demo)
- Document thoroughly (JSDoc everything)
- Optimize incrementally (profile and improve)

**Expected Outcome:**
- Production-ready TSL/WebGPU engine
- Extensive library of reusable modules
- Beautiful demo sketches
- Comprehensive documentation
- Platform for future creative work

**Let's build it systematically, one phase at a time.** 🚀

---

**Document Version:** 2.0  
**Last Updated:** November 19, 2025  
**Next Review:** After Phase 0 completion

