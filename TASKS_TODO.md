# TSL-WebGPU Engine — Task Breakdown & TODO List

**Status:** Active Development  
**Last Updated:** November 19, 2025  
**Current Phase:** Phase 0 → Phase 1

---

## 🎯 Immediate Priority Tasks (This Week)

### PHASE 0: Foundation Setup (Day 1-2)

#### ✅ Day 1: Dependency Upgrade & Verification
- [ ] **Upgrade Three.js to r181**
  ```bash
  pnpm add three@^0.181.0
  pnpm add @react-three/fiber@latest @react-three/drei@latest
  ```
- [ ] **Test existing sketches still work**
  - Run `pnpm dev`
  - Check `/sketches/flare-1`
  - Check `/sketches/nested/dawn-1`
  - Verify TSL imports work with r181

- [ ] **Create INVENTORY structure**
  ```bash
  mkdir -p INVENTORY/{threejs_examples,portfolio_patterns,tsl_projects,extracted_modules,docs}
  ```

#### ✅ Day 2: Resource Collection & Documentation
- [ ] **Extract Three.js r181 examples**
  - Copy `examples/webgpu_compute_*.html` → `INVENTORY/threejs_examples/compute/`
  - Copy `examples/webgpu_particles_*.html` → `INVENTORY/threejs_examples/particles/`
  - Copy `examples/webgpu_materials_*.html` → `INVENTORY/threejs_examples/materials/`
  - Copy `examples/webgpu_postprocessing_*.html` → `INVENTORY/threejs_examples/postprocessing/`

- [ ] **Create knowledge base docs**
  - `INVENTORY/docs/THREE_R181_CHANGES.md` - API changes
  - `INVENTORY/docs/TSL_PATTERNS.md` - Common patterns
  - `INVENTORY/docs/COMPUTE_SHADERS.md` - Compute patterns
  - `INVENTORY/docs/RESOURCE_INDEX.md` - Resource catalog

---

### PHASE 1: Engine Core (Week 1)

#### Day 3-4: Core Types & Configuration

- [ ] **Implement `src/engine/core/engineTypes.ts`**
  - [ ] MaterialNodeConfig interface
  - [ ] PostFXPass interface
  - [ ] PostFXChain interface
  - [ ] VectorField interface
  - [ ] SDFPrimitive interface
  - [ ] ParticleSystemConfig interface
  - [ ] EngineSketchConfig interface
  - [ ] Add JSDoc for all types

- [ ] **Implement `src/engine/core/engineConfig.ts`**
  - [ ] EngineConfig interface
  - [ ] defaultEngineConfig constant
  - [ ] getEngineConfig() function
  - [ ] setEngineConfig() function
  - [ ] resetEngineConfig() function
  - [ ] Add JSDoc documentation

- [ ] **Implement `src/engine/core/createEngineSketch.ts`**
  - [ ] createEngineSketch() function
  - [ ] Handle material composition
  - [ ] Handle postfx chain application
  - [ ] Handle background integration
  - [ ] Add JSDoc + usage examples

- [ ] **Test core types**
  - [ ] Create simple test sketch using core types
  - [ ] Verify TypeScript compilation

#### Day 5-6: First Material - Basic Lambert

- [ ] **Implement `src/engine/materials/basicLambert.ts`**
  - [ ] BasicLambertParams interface
  - [ ] createBasicLambert() function
  - [ ] Parameters:
    - [ ] baseColor (vec3)
    - [ ] ambient (float)
    - [ ] diffuseIntensity (float)
    - [ ] lightDirection (vec3)
  - [ ] Simple Lambert lighting calculation
  - [ ] Return MaterialNodeConfig
  - [ ] Add JSDoc documentation

- [ ] **Create demo sketch `src/sketches/engine/materials/basic_lambert.ts`**
  - [ ] Import createBasicLambert
  - [ ] Use createEngineSketch wrapper
  - [ ] Add Leva controls for parameters
  - [ ] Test in browser

#### Day 7: Second Material - Phi Metal

- [ ] **Implement `src/engine/materials/phiMetal.ts`**
  - [ ] PhiMetalParams interface
  - [ ] createPhiMetal() function
  - [ ] Parameters:
    - [ ] baseColor (vec3)
    - [ ] metalness (float)
    - [ ] roughness (float)
    - [ ] animateNoise (boolean)
    - [ ] noiseScale (float)
  - [ ] Fresnel effect
  - [ ] Noise perturbation
  - [ ] Return MaterialNodeConfig
  - [ ] Add JSDoc documentation

- [ ] **Create demo sketch `src/sketches/engine/materials/phi_metal.ts`**
  - [ ] Import createPhiMetal
  - [ ] Use createEngineSketch wrapper
  - [ ] Add Leva controls
  - [ ] Test animated noise

---

### PHASE 2: Additional Materials & PostFX (Week 2)

#### Day 8-9: PBR Material

- [ ] **Implement `src/engine/materials/pbrMaterial.ts`**
  - [ ] PBRMaterialParams interface
  - [ ] createPBRMaterial() function
  - [ ] Metallic/roughness workflow
  - [ ] Normal mapping support
  - [ ] IBL integration (optional)
  - [ ] Demo sketch

#### Day 10-11: SSS Material

- [ ] **Implement `src/engine/materials/sssMaterial.ts`**
  - [ ] SSSMaterialParams interface
  - [ ] createSSS Material() function
  - [ ] Translucency effect
  - [ ] Depth-based scattering
  - [ ] Backlight simulation
  - [ ] Demo sketch

#### Day 12-13: Bloom PostFX

- [ ] **Implement `src/engine/postfx/bloomChain.ts`**
  - [ ] BloomParams interface
  - [ ] createBloomChain() function
  - [ ] Threshold extraction pass
  - [ ] Blur passes (horizontal + vertical)
  - [ ] Composite pass
  - [ ] Demo sketch

#### Day 14: Grain + Vignette PostFX

- [ ] **Implement `src/engine/postfx/grainVignette.ts`**
  - [ ] GrainVignetteParams interface
  - [ ] createGrainVignette() function
  - [ ] Use existing grain/vignette utilities
  - [ ] Make chainable
  - [ ] Demo sketch

---

### PHASE 3: Fields & Particles (Week 3-4)

#### Week 3: Field Systems

- [ ] **Implement `src/engine/fields/curlNoiseField.ts`**
  - [ ] CurlFieldParams interface
  - [ ] createCurlField() function
  - [ ] 3D curl noise
  - [ ] Scale and octave controls
  - [ ] Demo sketch

- [ ] **Implement `src/engine/fields/sdfPrimitives.ts`**
  - [ ] SDF shape functions (sphere, box, torus, cylinder)
  - [ ] SDF operations (union, subtract, intersect, smooth blend)
  - [ ] Domain repetition
  - [ ] Demo sketch

#### Week 4: Particle Systems

- [ ] **Implement `src/engine/particles/computeParticles.ts`**
  - [ ] Compute shader scaffolding
  - [ ] Buffer initialization
  - [ ] Storage buffer helpers
  - [ ] Workgroup management

- [ ] **Implement `src/engine/particles/attractorSystem.ts`**
  - [ ] AttractorParams interface
  - [ ] createAttractorSystem() function
  - [ ] Point attractor forces
  - [ ] Particle update compute shader
  - [ ] Demo sketch

- [ ] **Implement `src/engine/particles/flowFieldParticles.ts`**
  - [ ] FlowFieldParams interface
  - [ ] createFlowFieldSystem() function
  - [ ] Follow curl noise field
  - [ ] Life cycle management
  - [ ] Demo sketch

---

## 📋 Module Checklist

### Materials (4 core + 2+ advanced)
- [ ] basicLambert.ts → basic_lambert.ts demo
- [ ] phiMetal.ts → phi_metal.ts demo
- [ ] pbrMaterial.ts → pbr_material.ts demo
- [ ] sssMaterial.ts → sss_material.ts demo
- [ ] (Future) glassDispersion.ts
- [ ] (Future) holographic.ts

### PostFX (4 core + 2+ advanced)
- [ ] bloomChain.ts → bloom.ts demo
- [ ] grainVignette.ts → grain_vignette.ts demo
- [ ] depthOfField.ts → depth_of_field.ts demo
- [ ] motionBlur.ts → motion_blur.ts demo

### Fields (2 core + 1+ advanced)
- [ ] curlNoiseField.ts → curl_noise_flow.ts demo
- [ ] sdfPrimitives.ts → sdf_shapes.ts demo
- [ ] (Future) vectorFieldComposer.ts

### Particles (4 core systems)
- [ ] computeParticles.ts (scaffolding)
- [ ] attractorSystem.ts → attractor_cloud.ts demo
- [ ] flowFieldParticles.ts → flow_field_trails.ts demo
- [ ] boidsSystem.ts → boids_flock.ts demo
- [ ] (Additional) particleSwarm.ts → particle_swarm.ts demo

### Presets (3 categories)
- [ ] colorPalettes.ts (10+ palettes)
- [ ] parameterPresets.ts (material/postfx presets)
- [ ] heroSketches.ts (3+ complete scenes)

### Utilities (4 core modules)
- [ ] engine/utils/noise.ts
- [ ] engine/utils/color.ts
- [ ] engine/utils/math.ts
- [ ] engine/utils/coords.ts

---

## 📚 Documentation Checklist

### Core Documentation
- [ ] src/engine/README.md - Engine overview
- [ ] src/engine/ENGINE_API.md - Complete API reference
- [ ] DOCS/INTEGRATION_GUIDE.md - How to use engine
- [ ] DOCS/PORTING_GUIDE.md - How to add modules
- [ ] DOCS/03-Knowledge-Base.md - TSL patterns & tips

### Module Documentation
- [ ] JSDoc for all public APIs
- [ ] Usage examples in comments
- [ ] Parameter explanations
- [ ] Type definitions documented

### Resource Documentation
- [ ] INVENTORY/docs/THREE_R181_CHANGES.md
- [ ] INVENTORY/docs/TSL_PATTERNS.md
- [ ] INVENTORY/docs/COMPUTE_SHADERS.md
- [ ] INVENTORY/docs/RESOURCE_INDEX.md

---

## 🎨 Demo Sketches Status

### Engine Materials
- [ ] `/sketches/engine/materials/basic_lambert.ts`
- [ ] `/sketches/engine/materials/phi_metal.ts`
- [ ] `/sketches/engine/materials/pbr_material.ts`
- [ ] `/sketches/engine/materials/sss_material.ts`

### Engine PostFX
- [ ] `/sketches/engine/postfx/bloom.ts`
- [ ] `/sketches/engine/postfx/grain_vignette.ts`
- [ ] `/sketches/engine/postfx/depth_of_field.ts`
- [ ] `/sketches/engine/postfx/motion_blur.ts`

### Engine Fields
- [ ] `/sketches/engine/fields/curl_noise_flow.ts`
- [ ] `/sketches/engine/fields/sdf_shapes.ts`

### Engine Particles
- [ ] `/sketches/engine/particles/attractor_cloud.ts`
- [ ] `/sketches/engine/particles/flow_field_trails.ts`
- [ ] `/sketches/engine/particles/boids_flock.ts`
- [ ] `/sketches/engine/particles/particle_swarm.ts`

### Engine Presets
- [ ] `/sketches/engine/presets/cinematic_portrait.ts`
- [ ] `/sketches/engine/presets/golden_glow.ts`
- [ ] `/sketches/engine/presets/neon_metropolis.ts`

---

## 🔍 Testing Checklist

### Functional Testing
- [ ] All materials render correctly
- [ ] All PostFX effects work
- [ ] All particle systems simulate
- [ ] Leva controls update in real-time
- [ ] Presets load correctly

### Performance Testing
- [ ] Materials: 60fps @ 1080p
- [ ] PostFX: <5ms per effect
- [ ] Particles: 60fps with 100k particles
- [ ] Memory: No leaks after 5min runtime

### Browser Testing
- [ ] Chrome (primary)
- [ ] Edge (secondary)
- [ ] WebGPU detection works
- [ ] Graceful fallback if no WebGPU

---

## 📊 Progress Tracking

### Overall Progress
- Phase 0: [ ] 0% (Not started)
- Phase 1: [ ] 0% (Not started)
- Phase 2: [ ] 0% (Not started)
- Phase 3: [ ] 0% (Not started)
- Phase 4: [ ] 0% (Not started)
- Phase 5: [ ] 0% (Not started)

### Module Completion
- Materials: 0/4 core (0%)
- PostFX: 0/4 core (0%)
- Fields: 0/2 core (0%)
- Particles: 0/4 core (0%)
- Presets: 0/3 categories (0%)
- Utils: 0/4 modules (0%)

---

## 🚀 Quick Start Commands

### Development
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm serve

# Lint code
pnpm lint
```

### Testing
```bash
# Test specific sketch
# Navigate to: http://localhost:5173/sketches/engine/materials/basic_lambert

# Check all sketches work
# Navigate to: http://localhost:5173/
# Click through sketch dropdown
```

---

## 📝 Notes & Reminders

### Important Patterns
- All materials must return `MaterialNodeConfig`
- All PostFX must be chainable
- All demos must have Leva controls
- All code must have JSDoc
- Use existing TSL utilities where possible

### Resources to Reference
- Three.js r181 source: `.RESOURCES/three.js-r181/`
- Portfolio examples: `.RESOURCES/REPOSITORIES/portfolio examples/`
- TSL projects: `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`

### Performance Targets
- Target: 60fps @ 1080p
- Materials: <10ms render time
- PostFX: <5ms per effect
- Particles: 100k @ 60fps
- Memory: <500MB

---

**Last Updated:** November 19, 2025  
**Next Update:** After Phase 0 completion

