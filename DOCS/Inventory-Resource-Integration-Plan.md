# TSL-WebGPU Engine — Inventory & Resource Integration Plan

**Version:** 1.0  
**Date:** November 21, 2025  
**Status:** Resource Cataloging & Integration Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Resource Inventory](#resource-inventory)
3. [Categorization & Priority](#categorization--priority)
4. [Integration Strategy](#integration-strategy)
5. [Extraction & Organization](#extraction--organization)
6. [Module Porting Guide](#module-porting-guide)
7. [Quality Assurance](#quality-assurance)

---

## Overview

This document catalogs all available resources for the TSL-WebGPU Engine and provides a systematic plan for integrating them into our project.

### Resource Sources

1. **Three.js R181 Official Examples** (186 WebGPU examples)
2. **Portfolio Implementations** (Maxime Heckel, tsl-textures, etc.)
3. **TSL/WebGPU Community Projects** (30+ specialized projects)
4. **UI/Animation Libraries** (React components, effects)

### Integration Principles

- ✅ **Direct implementation** — Port working code as-is
- ✅ **Minimal modification** — Only adapt to our pipeline
- ✅ **Preserve functionality** — Don't "reinvent the wheel"
- ✅ **Maintain quality** — All sources are production-ready
- ✅ **Full validation** — Test every ported module

---

## Resource Inventory

### A. Three.js R181 Official Examples

**Location:** `.RESOURCES/three.js-r181/examples/`

#### WebGPU Examples Catalog (186 files)

##### 1. Compute Shaders
```
Priority: HIGH
Files: 20+ examples
Target: src/engine/compute/

Key Examples:
✅ webgpu_compute_particles.html - GPU particle simulation
✅ webgpu_compute_texture.html - Texture generation via compute
✅ webgpu_compute_audio.html - Audio-driven compute
✅ webgpu_compute_geometry.html - Dynamic geometry
- webgpu_compute_points.html - Point cloud compute
- webgpu_compute_sort_bitonic.html - GPU sorting
- webgpu_compute_water.html - Water simulation
```

##### 2. Particle Systems
```
Priority: HIGH
Files: 15+ examples
Target: src/engine/particles/

Key Examples:
✅ webgpu_particles.html - Basic GPU particles
✅ webgpu_particles_system.html - Particle system framework
- webgpu_particles_rain.html - Rain effect
- webgpu_particles_webgpu.html - Advanced WebGPU particles
- webgpu_instance_points.html - Instanced points
- webgpu_instance_sprites.html - Instanced sprites
```

##### 3. Post-Processing (25+ effects)
```
Priority: HIGH
Files: 30+ examples
Target: src/engine/postfx/

Bloom & Glow:
✅ webgpu_postprocessing_bloom.html - Bloom effect
✅ webgpu_postprocessing_bloom_selective.html - Selective bloom
✅ webgpu_postprocessing_bloom_emissive.html - Emissive bloom
- webgpu_postprocessing_anamorphic.html - Anamorphic flares

Depth of Field:
✅ webgpu_postprocessing_dof.html - DOF standard
✅ webgpu_postprocessing_dof_basic.html - DOF simple

Screen Space Effects:
✅ webgpu_postprocessing_ssr.html - Screen-space reflections
✅ webgpu_postprocessing_ssgi.html - Screen-space global illumination
✅ webgpu_postprocessing_sss.html - Subsurface scattering
✅ webgpu_postprocessing_ssaa.html - SSAA anti-aliasing
- webgpu_postprocessing_ao.html - Ambient occlusion

Motion & Temporal:
✅ webgpu_postprocessing_motion_blur.html - Motion blur
✅ webgpu_postprocessing_traa.html - Temporal anti-aliasing
- webgpu_postprocessing_afterimage.html - Afterimage/trails

Color & Grading:
✅ webgpu_postprocessing_3dlut.html - 3D LUT color grading
- webgpu_postprocessing_transition.html - Scene transitions

Anti-Aliasing:
✅ webgpu_postprocessing_fxaa.html - FXAA
✅ webgpu_postprocessing_smaa.html - SMAA

Stylized:
✅ webgpu_postprocessing_pixel.html - Pixelation
✅ webgpu_postprocessing_sobel.html - Edge detection
✅ webgpu_postprocessing_outline.html - Outline effect
- webgpu_postprocessing_ca.html - Chromatic aberration
- webgpu_postprocessing_masking.html - Masking
- webgpu_postprocessing_lensflare.html - Lens flare
- webgpu_postprocessing_difference.html - Difference blend
```

##### 4. Materials
```
Priority: HIGH
Files: 20+ examples
Target: src/engine/materials/

Physical Materials:
✅ webgpu_materials_transmission.html - Glass/transmission
✅ webgpu_materials_sss.html - Subsurface scattering
✅ webgpu_materials_lightmap.html - Lightmap baking
✅ webgpu_materials_envmaps.html - Environment mapping
✅ webgpu_materials_envmaps_bpcem.html - Advanced envmaps
- webgpu_materials_matcap.html - Matcap materials
- webgpu_materials_toon.html - Toon shading
- webgpu_materials_displacementmap.html - Displacement

Texture & Mapping:
- webgpu_materials_texture_manualmipmap.html - Manual mipmaps
- webgpu_materials_alphahash.html - Alpha hashing
- webgpu_materials_arrays.html - Texture arrays
- webgpu_materials_video.html - Video textures

Advanced:
- webgpu_materials_cubemap_mipmaps.html - Cubemap mipmaps
- webgpu_materials_basic.html - Basic node materials
```

##### 5. TSL Specific Examples
```
Priority: CRITICAL
Files: 15+ examples
Target: src/engine/ (various)

✅ webgpu_tsl_compute_attractors_particles.html - Attractor particles
✅ webgpu_tsl_vfx_flames.html - Fire/flame effects
✅ webgpu_tsl_vfx_tornado.html - Tornado/vortex
✅ webgpu_tsl_vfx_linkedparticles.html - Connected particles
✅ webgpu_tsl_earth.html - Procedural planet
✅ webgpu_tsl_galaxy.html - Galaxy generation
✅ webgpu_tsl_raging_sea.html - Ocean simulation
✅ webgpu_tsl_procedural_terrain.html - Terrain generation
✅ webgpu_tsl_wood.html - Wood material
✅ webgpu_tsl_halftone.html - Halftone effect
✅ webgpu_tsl_angular_slicing.html - Slicing effect
- webgpu_tsl_editor.html - Node editor
- webgpu_tsl_transpiler.html - WGSL transpiler
- webgpu_tsl_interoperability.html - TSL/WGSL interop
```

##### 6. Volume & Advanced Rendering
```
Priority: MEDIUM
Files: 10+ examples
Target: src/engine/fields/ or src/engine/materials/

✅ webgpu_volume_cloud.html - Volumetric clouds
✅ webgpu_volume_perlin.html - Perlin noise volume
- webgpu_volume_caustics.html - Caustics
- webgpu_volume_lighting.html - Volumetric lighting
- webgpu_volume_lighting_rectarea.html - Area light volumes
```

##### 7. Instancing & Performance
```
Priority: HIGH
Files: 10+ examples
Target: src/engine/helpers/

✅ webgpu_instance_mesh.html - Instanced meshes
✅ webgpu_instance_uniform.html - Instanced uniforms
- webgpu_instance_path.html - Path instancing
- webgpu_instance_points.html - Point instancing
- webgpu_instance_sprites.html - Sprite instancing
- webgpu_instancing_morph.html - Morph target instancing
- webgpu_performance.html - Performance patterns
- webgpu_performance_renderbundle.html - Render bundles
```

##### 8. Shadows & Lighting
```
Priority: MEDIUM
Files: 15+ examples
Target: src/engine/helpers/lighting.ts

- webgpu_shadowmap.html - Shadow mapping
- webgpu_shadowmap_vsm.html - VSM shadows
- webgpu_shadowmap_csm.html - Cascaded shadows
- webgpu_shadowmap_progressive.html - Progressive shadows
- webgpu_shadowmap_array.html - Shadow arrays
- webgpu_shadowmap_opacity.html - Transparent shadows
- webgpu_lights_physical.html - Physical lights
- webgpu_lights_rectarealight.html - Area lights
- webgpu_lights_spotlight.html - Spotlights
- webgpu_lights_tiled.html - Tiled lighting
- webgpu_lights_selective.html - Selective lighting
```

##### 9. Advanced Features
```
Priority: MEDIUM
Files: 20+ examples

Reflections & Refraction:
- webgpu_reflection.html - Reflections
- webgpu_reflection_blurred.html - Blurred reflections
- webgpu_reflection_roughness.html - Rough reflections
- webgpu_refraction.html - Refraction

Water & Fluids:
✅ webgpu_water.html - Water simulation
✅ webgpu_ocean.html - Ocean waves

Procedural:
- webgpu_procedural_texture.html - Procedural textures
- webgpu_parallax_uv.html - Parallax mapping
- webgpu_materialx_noise.html - MaterialX noise
```

#### Three.js Node System Source Code

**Location:** `.RESOURCES/three.js-r181/src/nodes/`

```
Priority: CRITICAL (reference only)
Files: 213 .js files
Usage: Study patterns, don't copy directly

Key Directories:
- accessors/ - Attribute and uniform accessors
- code/ - Code generation utilities  
- core/ - Core node system
- display/ - Display transforms
- fog/ - Fog implementations
- functions/ - Built-in functions
- lighting/ - Lighting nodes
- loaders/ - Node material loaders
- materials/ - Material node implementations
- math/ - Math operations
- pmrem/ - Prefiltered mipmap generation
- procedural/ - Procedural generation
- tsl/ - TSL-specific utilities
- utils/ - General utilities
```

### B. Portfolio & Production Examples

#### 1. Maxime Heckel's Blog

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/`

```
Stats: 191 .tsx, 170 .ts files
Priority: CRITICAL
Target: Reference for production patterns

Key Areas:
✅ components/MDX/ - Interactive shader components
✅ core/components/Sandpack/ - Live code playground
✅ lib/webgl/ - WebGL utilities (adapt to WebGPU)
- app/posts/ - Blog post implementations
- public/

Notable Files:
- components/MDX/Widgets/ - Interactive widgets
- Valuable for UI/UX patterns
- Production-quality TypeScript
```

#### 2. Maxime Heckel's Portfolio

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/`

```
Stats: 121 .tsx, 97 .ts, 69 .glsl files
Priority: HIGH
Target: src/engine/materials/, src/sketches/showcase/

Key Areas:
✅ app/lab/ - Experimental sketches
✅ core/shaders/ - 69 GLSL shaders to adapt
✅ core/components/ - Reusable shader components
- core/hooks/ - React hooks for WebGL

GLSL Shaders to Port (69 files):
- Many can be converted to TSL
- Study patterns for adaptation
- Priority: Effects and materials
```

#### 3. TSL Textures Project

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/tsl-textures-main/`

```
Stats: 71 .js, 70 .html files, 202 .png textures
Priority: HIGH
Target: src/engine/fields/noise/, src/engine/materials/procedural/

Key Content:
✅ Procedural texture generation examples
✅ Noise implementations
✅ Pattern generation
- Reference textures for validation
```

#### 4. Fragments Boilerplate (Reference)

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/`

```
Priority: REFERENCE
Usage: Compare with our TSLKIT implementation

Use for:
- Verification of base structure
- Checking if we missed features
- Understanding original intent
```

### C. TSL/WebGPU Community Projects

#### High-Value Complete Projects

##### 1. three.js-tsl-sandbox-master

```
Location: .RESOURCES/REPOSITORIES/TSLwebgpuExamples/
Stats: 445 files, 124 .js TSL implementations
Priority: CRITICAL - Most comprehensive TSL resource

Structure:
examples/
  - Extensive TSL pattern library
  - Production-ready implementations
  - Well-documented code

Target: Study all, port selectively to src/engine/
```

##### 2. tsl-particles-of-a-thousand-faces-main

```
Stats: 64 files, 16 .tsx, 15 .json
Priority: CRITICAL - Advanced particle systems

Key Content:
✅ React + TSL particle integration
✅ Advanced particle behaviors
✅ Performance optimization patterns
- GPU-driven animation

Target: src/engine/particles/systems/
```

##### 3. webgpu-tsl-linkedparticles-main

```
Stats: 37 files, 9 .tsx, 9 .svg
Priority: HIGH - Particle connections

Key Content:
✅ Particle attraction/repulsion
✅ Line rendering between particles
✅ Interactive behaviors

Target: src/engine/particles/systems/linked.ts
```

##### 4. webgputest-particlesSDF-main

```
Stats: 24 files, 10 .ts
Priority: HIGH - SDF particle interactions

Key Content:
✅ SDF-based collision/boundaries
✅ Particle-field interactions
✅ TypeScript patterns

Target: src/engine/particles/systems/sdf-particles.ts
```

##### 5. three-pinata-main

```
Stats: 77 files, 55 .ts
Priority: HIGH - Type-safe utilities

Key Content:
✅ TypeScript-first Three.js utilities
✅ Type-safe wrappers
✅ Helper functions

Target: src/engine/helpers/
```

##### 6. Splash-main

```
Stats: 36 files, 18 .wgsl, 7 .ts
Priority: MEDIUM - Pure WGSL patterns

Key Content:
✅ Raw WGSL compute shaders
✅ Low-level GPU patterns
- Advanced compute techniques

Target: Reference for compute optimization
```

##### 7. WaterBall-main

```
Stats: 34 files, 14 .wgsl, 7 .ts
Priority: HIGH - Fluid simulation

Key Content:
✅ Water sphere simulation
✅ Fluid dynamics compute shaders
✅ Surface tension effects

Target: src/engine/particles/systems/fluid.ts
```

##### 8. singularity-master

```
Stats: 83 files, 54 .js
Priority: HIGH - Complex effects

Key Content:
✅ Black hole / gravitational effects
✅ Advanced particle systems
✅ Production shaders

Target: src/sketches/showcase/
```

##### 9. softbodies-master

```
Stats: 42 files, 22 .js
Priority: MEDIUM - Physics simulation

Key Content:
✅ Soft body dynamics
✅ Deformable meshes
✅ Spring constraints

Target: src/engine/compute/physics/
```

##### 10. fluidglass-main

```
Stats: 45 files, 17 .js
Priority: HIGH - Glass materials

Key Content:
✅ Fluid-like glass effects
✅ Refraction materials
✅ Dispersion simulation

Target: src/engine/materials/physical/glass.ts
```

##### 11. flow-master

```
Stats: 27 files, 13 .js
Priority: HIGH - Flow fields

Key Content:
✅ Vector flow field implementation
✅ Particle flow integration
✅ Field visualization

Target: src/engine/fields/flow/
```

##### 12. interactwave-main

```
Stats: 40 files, 13 .js
Priority: MEDIUM - Interactive waves

Key Content:
✅ User interaction patterns
✅ Wave propagation
✅ Touch/mouse integration

Target: src/engine/compute/wave.ts
```

#### Utility & Reference Projects

```
raymarching-tsl-main
  - Raymarching framework
  - SDF visualization
  - Target: src/engine/fields/sdf/raymarching.ts

tsl-compute-particles
  - Clean compute particle example
  - Minimal implementation
  - Target: Reference for patterns

tsl-particle-waves
  - Wave-based particle motion
  - Sine wave patterns
  - Target: src/engine/particles/systems/waves.ts

breeze-main
  - Atmospheric effects
  - Wind simulation
  - Target: src/engine/helpers/atmospheric.ts

roquefort-main
  - Stylized rendering
  - Artistic materials
  - Target: src/engine/materials/stylized/

Floaty-main
  - Floating/suspension effects
  - Physics-based motion
  - Target: src/engine/particles/behaviors/

codrops-batchedmesh-main
  - Efficient batching patterns
  - Performance optimization
  - Target: src/engine/helpers/batching.ts
```

#### Advanced Rendering Projects

```
ssgi-ssr-painter
  - Screen-space global illumination
  - Screen-space reflections
  - Target: src/engine/postfx/ssgi.ts

ssr-gtao-keio
  - Ground truth ambient occlusion
  - Advanced lighting
  - Target: src/engine/postfx/gtao.ts

test-webgpu-master
  - Testing patterns
  - WebGPU validation
  - Target: tests/ reference
```

### D. UI & Animation Resources

#### React Components

**Location:** `.RESOURCES/REPOSITORIES/other assets/react-bits-main/`

```
Stats: 994 files, 393 .jsx, 229 .tsx
Priority: MEDIUM
Target: src/components/ui/

Useful Components:
- Modern UI patterns
- Interactive controls
- Form components
- Layout systems

Selection Criteria:
- Glassmorphism-compatible styles
- Minimal dependencies
- TypeScript support
```

#### Animation Libraries

```
ElasticGridScroll-main
  - Elastic scroll animations
  - Target: UI gallery scrolling

ImageExpansionTypography-main
  - Text expansion effects
  - Target: UI typography

KineticTypePageTransition-main
  - Page transitions
  - Target: Route transitions

OnScrollTypographyAnimations-main
  - Scroll-triggered animations
  - Target: Gallery animations

SlicedTextEffect-main
  - Text slicing effects
  - Target: UI effects
```

---

## Categorization & Priority

### Priority Matrix

#### Priority 1: CRITICAL (Start Immediately)

**Rationale:** Core functionality, most examples depend on these

```
1. Engine Core Types
   - From: Design patterns
   - Target: src/engine/core/types.ts
   
2. Compute Shader Framework
   - From: three.js webgpu_compute_*
   - Target: src/engine/compute/
   
3. Basic Particle System
   - From: webgpu_compute_particles.html
   - Target: src/engine/particles/
   
4. TSL Node Patterns
   - From: three.js-tsl-sandbox-master
   - Target: All engine modules
```

#### Priority 2: HIGH (Week 1-2)

```
1. Material System
   - transmission, SSS, envmaps
   - From: webgpu_materials_*
   - Target: src/engine/materials/
   
2. PostFX Foundations
   - Bloom, DOF, basic chains
   - From: webgpu_postprocessing_*
   - Target: src/engine/postfx/
   
3. Instancing System
   - From: webgpu_instance_*
   - Target: src/engine/helpers/
   
4. Advanced Particles
   - Attractors, linked, SDF
   - From: tsl-particles-of-a-thousand-faces, webgpu-tsl-linkedparticles
   - Target: src/engine/particles/systems/
```

#### Priority 3: MEDIUM (Week 3-4)

```
1. Advanced PostFX
   - SSR, SSGI, motion blur
   - From: webgpu_postprocessing_*
   - Target: src/engine/postfx/
   
2. Specialized Effects
   - Flames, tornado, fluids
   - From: webgpu_tsl_vfx_*, WaterBall, fluidglass
   - Target: src/engine/particles/systems/
   
3. Field Systems
   - Flow fields, noise fields
   - From: flow-master, tsl-textures
   - Target: src/engine/fields/
   
4. Lighting Helpers
   - From: webgpu_lights_*, webgpu_shadowmap_*
   - Target: src/engine/helpers/lighting.ts
```

#### Priority 4: LOW (Week 5+)

```
1. Advanced Materials
   - Stylized, artistic materials
   - From: roquefort, portfolio shaders
   - Target: src/engine/materials/stylized/
   
2. Physics Simulations
   - Soft bodies, constraints
   - From: softbodies-master
   - Target: src/engine/compute/physics/
   
3. Volume Rendering
   - From: webgpu_volume_*
   - Target: src/engine/materials/volume/
   
4. UI Animations
   - From: animation libraries
   - Target: src/components/ui/
```

---

## Integration Strategy

### Phase 1: Foundation Setup (Days 1-2)

#### Create INVENTORY Structure

```bash
TSLKIT/INVENTORY/
├── three.js-examples/
│   ├── compute/
│   ├── particles/
│   ├── postprocessing/
│   ├── materials/
│   ├── tsl/
│   ├── instancing/
│   ├── lighting/
│   └── advanced/
├── portfolio-examples/
│   ├── maxime-heckel-blog/
│   ├── maxime-heckel-portfolio/
│   ├── tsl-textures/
│   └── fragments-vanilla/
├── tsl-examples/
│   ├── particles/
│   │   ├── tsl-particles-of-a-thousand-faces/
│   │   ├── webgpu-tsl-linkedparticles/
│   │   ├── webgputest-particlesSDF/
│   │   ├── tsl-compute-particles/
│   │   └── tsl-particle-waves/
│   ├── effects/
│   │   ├── WaterBall/
│   │   ├── fluidglass/
│   │   ├── singularity/
│   │   ├── interactwave/
│   │   └── breeze/
│   ├── compute/
│   │   ├── Splash/
│   │   ├── softbodies/
│   │   └── flow/
│   ├── shaders/
│   │   ├── three.js-tsl-sandbox/
│   │   ├── raymarching-tsl/
│   │   └── roquefort/
│   └── utilities/
│       ├── three-pinata/
│       ├── codrops-batchedmesh/
│       └── Floaty/
└── analysis/
    ├── EXTRACTION-LOG.md
    ├── PRIORITY-MAP.md
    ├── PORT-STATUS.md
    └── INTEGRATION-NOTES.md
```

#### Copy Scripts

Create automated copy scripts:

```bash
# copy-inventory.sh

#!/bin/bash

# Three.js examples
echo "Copying three.js WebGPU examples..."
cp ../.RESOURCES/three.js-r181/examples/webgpu_compute_*.{html,js} ./INVENTORY/three.js-examples/compute/
cp ../.RESOURCES/three.js-r181/examples/webgpu_particles*.{html,js} ./INVENTORY/three.js-examples/particles/
cp ../.RESOURCES/three.js-r181/examples/webgpu_postprocessing_*.{html,js} ./INVENTORY/three.js-examples/postprocessing/
cp ../.RESOURCES/three.js-r181/examples/webgpu_materials_*.{html,js} ./INVENTORY/three.js-examples/materials/
cp ../.RESOURCES/three.js-r181/examples/webgpu_tsl_*.{html,js} ./INVENTORY/three.js-examples/tsl/
cp ../.RESOURCES/three.js-r181/examples/webgpu_instance_*.{html,js} ./INVENTORY/three.js-examples/instancing/

# Copy JSM modules
echo "Copying three.js JSM modules..."
cp -r ../.RESOURCES/three.js-r181/examples/jsm/ ./INVENTORY/three.js-examples/jsm/

# Portfolio examples
echo "Copying portfolio examples..."
cp -r ../.RESOURCES/REPOSITORIES/portfolio\ examples/blog.maximeheckel.com-main ./INVENTORY/portfolio-examples/maxime-heckel-blog/
cp -r ../.RESOURCES/REPOSITORIES/portfolio\ examples/portfolio-main ./INVENTORY/portfolio-examples/maxime-heckel-portfolio/
cp -r ../.RESOURCES/REPOSITORIES/portfolio\ examples/tsl-textures-main ./INVENTORY/portfolio-examples/tsl-textures/

# TSL examples - particles
echo "Copying TSL particle examples..."
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particles-of-a-thousand-faces-main ./INVENTORY/tsl-examples/particles/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/webgpu-tsl-linkedparticles-main ./INVENTORY/tsl-examples/particles/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/webgputest-particlesSDF-main ./INVENTORY/tsl-examples/particles/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles ./INVENTORY/tsl-examples/particles/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves ./INVENTORY/tsl-examples/particles/

# TSL examples - effects
echo "Copying TSL effect examples..."
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/WaterBall-main ./INVENTORY/tsl-examples/effects/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/fluidglass-main ./INVENTORY/tsl-examples/effects/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/singularity-master ./INVENTORY/tsl-examples/effects/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/interactwave-main ./INVENTORY/tsl-examples/effects/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/breeze-main ./INVENTORY/tsl-examples/effects/

# TSL examples - compute
echo "Copying TSL compute examples..."
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/Splash-main ./INVENTORY/tsl-examples/compute/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/softbodies-master ./INVENTORY/tsl-examples/compute/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/flow-master ./INVENTORY/tsl-examples/compute/

# TSL examples - shaders
echo "Copying TSL shader examples..."
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/three.js-tsl-sandbox-master ./INVENTORY/tsl-examples/shaders/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/raymarching-tsl-main ./INVENTORY/tsl-examples/shaders/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/roquefort-main ./INVENTORY/tsl-examples/shaders/

# TSL examples - utilities
echo "Copying TSL utility examples..."
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/three-pinata-main ./INVENTORY/tsl-examples/utilities/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/codrops-batchedmesh-main ./INVENTORY/tsl-examples/utilities/
cp -r ../.RESOURCES/REPOSITORIES/TSLwebgpuExamples/Floaty-main ./INVENTORY/tsl-examples/utilities/

echo "✅ All resources copied to INVENTORY/"
```

### Phase 2: Analysis & Documentation (Days 2-3)

#### Create Analysis Documents

**EXTRACTION-LOG.md** — Log of what was copied

```markdown
# Extraction Log

## Date: [Date]

### Three.js Examples
- ✅ Copied 20 compute shader examples
- ✅ Copied 15 particle examples
- ✅ Copied 30 postprocessing examples
- ✅ Copied 20 material examples
- ✅ Copied 15 TSL examples
- ✅ Copied 10 instancing examples

### Portfolio Examples
- ✅ Copied Maxime Heckel blog (191 .tsx, 170 .ts)
- ✅ Copied Maxime Heckel portfolio (121 .tsx, 97 .ts, 69 .glsl)
- ✅ Copied tsl-textures (71 .js, 70 .html)

### TSL Examples
- ✅ Copied 5 particle projects
- ✅ Copied 5 effect projects
- ✅ Copied 3 compute projects
- ✅ Copied 3 shader projects
- ✅ Copied 3 utility projects

## Total Files: ~2000+
## Total Size: ~XXX MB
```

**PRIORITY-MAP.md** — What to port in what order

```markdown
# Priority Port Map

## Week 1: Foundation
- [ ] Engine core types
- [ ] webgpu_compute_particles
- [ ] Basic particle system
- [ ] Instancing helper
- [ ] Basic materials (transmission, SSS)
- [ ] Basic postfx (bloom, DOF)

## Week 2: Expansion
- [ ] Advanced particles (attractors, linked)
- [ ] More materials (envmaps, lightmap)
- [ ] More postfx (SSR, motion blur)
- [ ] Flow fields
- [ ] TSL utilities

## Week 3: Specialized
- [ ] VFX effects (flames, tornado)
- [ ] Fluid simulations
- [ ] Advanced compute shaders
- [ ] Volume rendering

## Week 4: Polish
- [ ] Remaining materials
- [ ] Remaining postfx
- [ ] UI enhancements
- [ ] Performance optimization
```

**PORT-STATUS.md** — Track porting progress

```markdown
# Porting Status Tracker

## Materials (15 total)
- [ ] transmission
- [ ] subsurface scattering
- [ ] envmaps
- [ ] lightmap
- [ ] toon
- [ ] matcap
- ...

## PostFX (25 total)
- [ ] bloom
- [ ] bloom_selective
- [ ] bloom_emissive
- [ ] dof
- [ ] dof_basic
- ...

## Particles (10 systems)
- [ ] compute_particles
- [ ] attractors
- [ ] linked
- [ ] sdf_particles
- ...

## Compute (8 utilities)
- [ ] texture_generation
- [ ] geometry_modification
- [ ] water_simulation
- ...
```

### Phase 3: Direct Implementation (Ongoing)

#### Porting Workflow

For each module to port:

1. **Study Original**
   - Read source code
   - Run original example
   - Understand dependencies

2. **Extract Core Logic**
   - Identify shader code
   - Identify TSL nodes
   - Extract helper functions

3. **Adapt to Engine**
   - Wrap in engine factory pattern
   - Add TypeScript types
   - Follow naming conventions

4. **Create Sketch**
   - Build showcase example
   - Add Leva controls
   - Test functionality

5. **Validate**
   - Visual comparison with original
   - Performance check
   - Browser screenshot test

6. **Document**
   - Add JSDoc comments
   - Update PORT-STATUS.md
   - Note any changes from original

---

## Module Porting Guide

### Example: Porting a Material

#### Step 1: Study Original

**Original:** `webgpu_materials_transmission.html`

```javascript
// Extract key code
const material = new MeshPhysicalNodeMaterial();
material.transmission = 1.0;
material.thickness = 0.5;
material.ior = 1.5;
material.roughness = 0.0;
```

#### Step 2: Create Engine Module

**Target:** `src/engine/materials/physical/transmission.ts`

```typescript
import { Fn, vec3, float } from 'three/tsl';
import { MaterialConfig } from '@/engine/core/types';

export interface TransmissionMaterialParams {
  transmission?: number;
  thickness?: number;
  ior?: number;
  color?: THREE.Color;
  roughness?: number;
}

export function createTransmissionMaterial(
  params: TransmissionMaterialParams = {}
): MaterialConfig {
  const {
    transmission = 1.0,
    thickness = 0.5,
    ior = 1.5,
    color = new THREE.Color(1, 1, 1),
    roughness = 0.0,
  } = params;
  
  // Convert to TSL nodes
  const colorNode = vec3(color.r, color.g, color.b);
  const transmissionNode = float(transmission);
  const thicknessNode = float(thickness);
  const iorNode = float(ior);
  const roughnessNode = float(roughness);
  
  return {
    colorNode,
    transmissionNode,
    thicknessNode,
    iorNode,
    roughnessNode,
  };
}
```

#### Step 3: Create Sketch

**Target:** `src/sketches/materials/physical/transmission-demo.tsx`

```typescript
import { Fn } from 'three/tsl';
import { createTransmissionMaterial } from '@/engine/materials/physical/transmission';
import { useControls } from 'leva';

const sketch = Fn(() => {
  const material = createTransmissionMaterial({
    transmission: 1.0,
    thickness: 0.5,
    ior: 1.5,
  });
  
  return material.colorNode;
});

export default sketch;

// Add Leva controls
export function TransmissionControls() {
  const { transmission, thickness, ior } = useControls({
    transmission: { value: 1.0, min: 0, max: 1, step: 0.01 },
    thickness: { value: 0.5, min: 0, max: 2, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 2.5, step: 0.01 },
  });
  
  return { transmission, thickness, ior };
}
```

#### Step 4: Test & Validate

1. Run sketch locally
2. Take screenshot
3. Compare with original example
4. Check performance
5. Update PORT-STATUS.md

### Example: Porting a PostFX Effect

**Original:** `webgpu_postprocessing_bloom.html`

Follow similar pattern but for PostFX chain...

---

## Quality Assurance

### Testing Checklist for Each Port

- [ ] **Visual Accuracy:** Matches original example
- [ ] **Performance:** Maintains 60fps target
- [ ] **TypeScript:** Full type coverage
- [ ] **Documentation:** JSDoc comments added
- [ ] **Controls:** Leva controls implemented
- [ ] **Sketch:** Showcase example created
- [ ] **Screenshot:** Browser validation passed
- [ ] **Integration:** Works with engine pipeline

### Validation Process

1. **Local Testing**
   ```bash
   pnpm dev
   # Navigate to sketch
   # Test controls
   # Check console for errors
   ```

2. **Screenshot Comparison**
   ```bash
   # Use Browser tools
   # Take screenshot of our implementation
   # Compare with original example screenshot
   ```

3. **Performance Profiling**
   ```bash
   # Open DevTools
   # Record performance
   # Check frame time
   # Monitor memory
   ```

4. **Cross-Browser Testing**
   - Chrome/Edge (WebGPU native)
   - Firefox (WebGPU behind flag)
   - Safari (WebGPU experimental)
   - WebGL fallback test

---

## Success Metrics

### Completion Criteria

- ✅ **All Priority 1 modules** ported and tested (Week 1)
- ✅ **All Priority 2 modules** ported and tested (Week 2)
- ✅ **All Priority 3 modules** ported and tested (Week 4)
- ✅ **Every module has 2+ sketches** (basic + advanced)
- ✅ **Zero console errors** in production
- ✅ **60fps maintained** across all examples
- ✅ **Visual parity** with original examples
- ✅ **Complete documentation** for all modules

### Progress Tracking

Update `PORT-STATUS.md` daily with:
- Modules completed
- Modules in progress
- Modules blocked
- Issues encountered
- Performance notes

---

## Conclusion

This inventory contains a wealth of production-ready code that we will integrate systematically. By following the direct implementation approach and maintaining visual parity with originals, we ensure quality while building comprehensively.

**Remember:** These are all working examples. Our job is to organize, adapt, and integrate — not reinvent.

---

**Next Steps:**
1. Run `copy-inventory.sh` to populate INVENTORY/
2. Create analysis documents
3. Begin Phase 1 porting
4. Update PORT-STATUS.md regularly
5. Validate each module with browser screenshots

