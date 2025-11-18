# TSL-WebGPU Engine Resource Catalog

**Date:** November 18, 2025  
**Purpose:** Complete catalog of available resources for reference during implementation

---

## Three.js R181 WebGPU Examples (186 files)

**Location:** `.RESOURCES/three.js-r181/examples/`

### Compute Shaders
- `webgpu_compute_*.html` - Various compute examples
- `webgpu_tsl_compute_attractors_particles.html` - Particle attractors **[HIGH PRIORITY]**

### TSL Examples
- `webgpu_tsl_wood.html` - Procedural wood texture
- `webgpu_tsl_vfx_tornado.html` - Tornado VFX
- `webgpu_tsl_vfx_linkedparticles.html` - Linked particles **[HIGH PRIORITY]**
- `webgpu_tsl_vfx_flames.html` - Flame effect
- `webgpu_tsl_transpiler.html` - TSL transpiler
- `webgpu_tsl_raging_sea.html` - Ocean simulation
- `webgpu_tsl_procedural_terrain.html` - Terrain generation
- `webgpu_tsl_interoperability.html` - TSL integration patterns
- `webgpu_tsl_halftone.html` - Halftone effect
- `webgpu_tsl_galaxy.html` - Galaxy particle system **[HIGH PRIORITY]**
- `webgpu_tsl_editor.html` - Node editor
- `webgpu_tsl_earth.html` - Earth rendering
- `webgpu_tsl_angular_slicing.html` - Slicing technique

### Post-Processing (20+ examples)
- `webgpu_postprocessing.html` - Base postprocessing
- `webgpu_postprocessing_bloom.html` - Bloom **[HIGH PRIORITY]**
- `webgpu_postprocessing_bloom_emissive.html` - Emissive bloom
- `webgpu_postprocessing_bloom_selective.html` - Selective bloom
- `webgpu_postprocessing_dof.html` - Depth of field **[HIGH PRIORITY]**
- `webgpu_postprocessing_dof_basic.html` - Basic DOF
- `webgpu_postprocessing_ao.html` - Ambient occlusion
- `webgpu_postprocessing_ssao.html` - Screen-space AO
- `webgpu_postprocessing_ssr.html` - Screen-space reflections
- `webgpu_postprocessing_ssgi.html` - Screen-space GI
- `webgpu_postprocessing_sss.html` - Subsurface scattering
- `webgpu_postprocessing_ca.html` - Chromatic aberration
- `webgpu_postprocessing_motion_blur.html` - Motion blur
- `webgpu_postprocessing_outline.html` - Outline effect
- `webgpu_postprocessing_lensflare.html` - Lens flare
- `webgpu_postprocessing_3dlut.html` - 3D LUT color grading

### Particles & Instancing
- `webgpu_particles.html` - Base particles **[HIGH PRIORITY]**
- `webgpu_instance_points.html` - Instanced points
- `webgpu_instance_mesh.html` - Instanced meshes **[HIGH PRIORITY]**
- `webgpu_instance_uniform.html` - Uniform instances
- `webgpu_instance_sprites.html` - Instanced sprites
- `webgpu_instance_path.html` - Path instancing
- `webgpu_instancing_morph.html` - Morphing instances

### Materials (20+ examples)
- `webgpu_materials.html` - Base materials
- `webgpu_materials_transmission.html` - Transmission
- `webgpu_materials_sss.html` - Subsurface scattering **[HIGH PRIORITY]**
- `webgpu_materials_matcap.html` - Matcap
- `webgpu_materials_toon.html` - Toon shading
- `webgpu_materials_video.html` - Video materials
- `webgpu_materials_envmaps.html` - Environment maps
- `webgpu_materials_envmaps_bpcem.html` - BPCEM
- `webgpu_materials_displacementmap.html` - Displacement
- `webgpu_materials_lightmap.html` - Lightmaps

### Special Effects
- `webgpu_water.html` - Water simulation
- `webgpu_ocean.html` - Ocean
- `webgpu_volume_cloud.html` - Volumetric clouds
- `webgpu_volume_caustics.html` - Caustics
- `webgpu_refraction.html` - Refraction
- `webgpu_reflection.html` - Reflections
- `webgpu_mirror.html` - Mirrors
- `webgpu_portal.html` - Portal effect
- `webgpu_lensflares.html` - Lens flares

---

## TSL WebGPU Example Projects

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`

### Priority 1: Comprehensive Libraries

#### three.js-tsl-sandbox-master
- **Size:** 445 files (124 .js)
- **Description:** Most comprehensive TSL example collection
- **Key Features:** TSL utilities, shader graphs, material compositions
- **Use Cases:** Reference for all TSL patterns
- **Status:** Available for analysis

#### tsl-particles-of-a-thousand-faces-main
- **Size:** 64 files (16 .tsx)
- **Description:** Advanced particle system with React integration
- **Key Features:** GPU-driven updates, instance management
- **Use Cases:** Particle system architecture
- **Status:** Available for porting

#### webgpu-tsl-linkedparticles-main
- **Size:** 37 files (9 .tsx)
- **Description:** Linked particle system with attractors
- **Key Features:** Neighbor detection, dynamic connections
- **Use Cases:** Swarm behaviors, network viz
- **Status:** Available for porting

### Priority 2: Specialized Systems

#### three-pinata-main
- **Size:** 77 files (55 .ts)
- **Description:** TypeScript-first Three.js utilities
- **Key Features:** Strong typing, reusable patterns
- **Use Cases:** Type-safe TSL patterns
- **Status:** Available for extraction

#### Splash-main
- **Size:** 36 files (18 .wgsl)
- **Description:** Pure WGSL compute shaders
- **Key Features:** Low-level GPU patterns, fluid base
- **Use Cases:** Advanced compute patterns
- **Status:** Available for advanced phase

#### WaterBall-main
- **Size:** 34 files (14 .wgsl)
- **Description:** Particle-based fluid simulation
- **Key Features:** Fluid dynamics, rendering techniques
- **Use Cases:** Fluid effects
- **Status:** Available for Phase 3

### Priority 3: Effects & Materials

#### singularity-master
- **Size:** 83 files (54 .js)
- **Description:** Production visual effects
- **Key Features:** Shader techniques, animations
- **Use Cases:** Post-FX, material effects
- **Status:** Available for extraction

#### flow-master
- **Size:** 27 files (13 .js)
- **Description:** Flow field implementations
- **Key Features:** Vector fields, particle advection
- **Use Cases:** Flow-based effects
- **Status:** Available for porting

#### fluidglass-main
- **Size:** 45 files (17 .js)
- **Description:** Glass and fluid materials
- **Key Features:** Refraction, dispersion
- **Use Cases:** Material system
- **Status:** Available for materials phase

### Other Valuable Projects

- **softbodies-master** (42 files) - Soft body physics
- **interactwave-main** (40 files) - Interactive waves
- **raymarching-tsl-main** (19 files) - Raymarching framework
- **roquefort-main** (26 files) - Stylized rendering
- **breeze-main** (35 files) - Atmospheric effects
- **Floaty-main** (26 files) - Floating effects
- **codrops-batchedmesh-main** (25 files) - Batching patterns
- **test-webgpu-master** (23 files) - Testing patterns
- **tsl-compute-particles** (5 files) - Clean compute example
- **tsl-particle-waves** (5 files) - Wave particles
- **tsl-webgpu-companion** (4 files) - TSL helpers

---

## Portfolio Examples

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/`

### Maxime Heckel's Blog
- **Path:** `blog.maximeheckel.com-main/`
- **Size:** 560 files (191 .tsx, 170 .ts)
- **Description:** Production TSL/WebGPU components and interactive demos
- **Key Areas:**
  - Educational shader implementations
  - Component architecture patterns
  - Performance optimization examples
  - Blog post visualization code

### Maxime Heckel's Portfolio
- **Path:** `portfolio-main/`
- **Size:** 447 files (121 .tsx, 97 .ts, 69 .glsl)
- **Description:** Portfolio website with advanced WebGPU effects
- **Key Areas:**
  - Hero effects and animations
  - Material showcase
  - Page transition effects
  - Portfolio presentation patterns

### TSL Textures Project
- **Path:** `tsl-textures-main/`
- **Size:** 451 files (202 .png, 71 .js)
- **Description:** Procedural texture generation library
- **Key Areas:**
  - Texture generation patterns
  - Noise-based textures
  - Pattern generators
  - Texture utilities

### Original Fragments Boilerplate
- **Path:** `fragments-boilerplate-main/`
- **Size:** 62 files (39 .ts, 13 .tsx)
- **Description:** Reference implementation of our base
- **Use:** Compare with our modifications

---

## UI Component Libraries

**Location:** `.RESOURCES/REPOSITORIES/other assets/`

### react-bits-main
- **Size:** 994 files (393 .jsx, 229 .tsx)
- **Description:** Modern React UI component library
- **Potential Use:** Enhanced control panels, UI patterns

### Animation Libraries (Zipped)
- `ElasticGridScroll-main.zip`
- `ImageExpansionTypography-main.zip`
- `KineticTypePageTransition-main.zip`
- `OnScrollTypographyAnimations-main.zip`
- `SlicedTextEffect-main.zip`

---

## Direct Access Paths

### For Implementation Reference

When implementing specific features, refer to:

**Compute Shaders:**
```
.RESOURCES/three.js-r181/examples/webgpu_tsl_compute_attractors_particles.html
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/Splash-main/
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/
```

**Particle Systems:**
```
.RESOURCES/three.js-r181/examples/webgpu_particles.html
.RESOURCES/three.js-r181/examples/webgpu_tsl_galaxy.html
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particles-of-a-thousand-faces-main/
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/webgpu-tsl-linkedparticles-main/
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/three.js-tsl-particles-system-master/
```

**Post-Processing:**
```
.RESOURCES/three.js-r181/examples/webgpu_postprocessing_bloom.html
.RESOURCES/three.js-r181/examples/webgpu_postprocessing_dof.html
.RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/
```

**Materials:**
```
.RESOURCES/three.js-r181/examples/webgpu_materials_sss.html
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/fluidglass-main/
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/singularity-master/
```

**Flow Fields:**
```
.RESOURCES/REPOSITORIES/TSLwebgpuExamples/flow-master/
.RESOURCES/three.js-r181/examples/webgpu_tsl_vfx_tornado.html
```

---

## Usage During Implementation

### Step 1: Research Phase
- Open relevant examples in browser
- Study code patterns
- Document key algorithms

### Step 2: Extraction Phase
- Copy specific functions/patterns
- Create notes on adaptation needed
- List dependencies

### Step 3: Integration Phase
- Port to TypeScript
- Adapt to our TSL patterns
- Create demo sketch

### Step 4: Documentation Phase
- Add JSDoc comments
- Create usage examples
- Update catalog

---

## Notes

- All resources are **available in place** - no need to copy initially
- Reference directly from `.RESOURCES/` during development
- Copy specific files only when actively working on them
- Keep extraction notes in `_RESOURCE_INVENTORY/` as we port

**Total Available Resources:**
- 186 Three.js WebGPU examples
- 30+ TSL/WebGPU project repositories
- 3 production portfolio implementations
- 1000+ UI component examples

**Next Action:** Begin Phase 1 - Create engine structure and start implementing core systems

