# Resource Extraction Notes

**Date Started:** November 18, 2025  
**Purpose:** Track what has been extracted, why, and how to use it

---

## Extraction Progress

### ✅ Completed
- Resource inventory folder structure created

### 🔄 In Progress
- Three.js r181 examples extraction
- TSL project examples extraction

### ⏳ Pending
- Portfolio patterns extraction
- UI components extraction
- Research documentation

---

## Three.js R181 Examples

### Target Location
`.RESOURCES/three.js-r181/examples/`

### Priority Files

#### HIGH PRIORITY - Compute Shaders
- [ ] `webgpu_compute_particles.html`
- [ ] `webgpu_compute_particles_rain.html`
- [ ] `webgpu_compute_particles_snow.html`
- [ ] `webgpu_compute_texture.html`
- [ ] `webgpu_compute_audio.html`
- [ ] Related `.js` files for above

**Why:** Foundation for our particle system and compute scaffolding

#### HIGH PRIORITY - Particles
- [ ] `webgpu_particles_*` (all variants)
- [ ] `webgpu_instance_points.html`
- [ ] `webgpu_instance_mesh.html`
- [ ] `webgpu_instance_uniform.html`

**Why:** Instanced rendering patterns, GPU-driven particles

#### HIGH PRIORITY - Post Processing
- [ ] `webgpu_postprocessing_*` (all variants)
- [ ] `webgpu_tsl_*` related to post-FX

**Why:** PostFX chain architecture and TSL patterns

#### MEDIUM PRIORITY - Materials
- [ ] `webgpu_materials_*` (all variants)
- [ ] `webgpu_tsl_*` material examples

**Why:** Material node patterns, PBR examples

#### MEDIUM PRIORITY - Node System
- [ ] `jsm/nodes/` folder (selective)
- [ ] Node utility functions
- [ ] Material node builders

**Why:** Understanding Three.js node system internals

### Extraction Commands

```bash
# From project root
cd .RESOURCES/three.js-r181/examples

# Copy compute examples
find . -name "webgpu_compute_*" -exec cp {} ../../../TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/compute/ \;

# Copy particle examples  
find . -name "webgpu_particles_*" -exec cp {} ../../../TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/particles/ \;
find . -name "webgpu_instance_*" -exec cp {} ../../../TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/particles/ \;

# Copy postprocessing examples
find . -name "webgpu_postprocessing_*" -exec cp {} ../../../TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/postprocessing/ \;

# Copy material examples
find . -name "webgpu_materials_*" -exec cp {} ../../../TSL_ENGINE/_RESOURCE_INVENTORY/threejs_examples/materials/ \;
```

---

## TSL WebGPU Example Projects

### Priority 1: three.js-tsl-sandbox-master

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/three.js-tsl-sandbox-master/`  
**Size:** 445 files (124 .js)  
**Status:** 🔄 In Progress

**What to Extract:**
- TSL utility functions
- Shader graph patterns
- Math/noise utilities
- Material compositions

**Key Files:**
- Browse for TSL function libraries
- Material example files
- Compute shader examples

**Notes:**
- Most comprehensive TSL example collection
- Use as primary reference for TSL patterns

---

### Priority 2: tsl-particles-of-a-thousand-faces-main

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particles-of-a-thousand-faces-main/`  
**Size:** 64 files (16 .tsx, 15 .json)  
**Status:** ⏳ Pending

**What to Extract:**
- Particle system architecture
- React/TSL integration patterns
- Instance management
- Parameter control systems

**Key Concepts:**
- GPU-driven particle updates
- Efficient instance attribute handling
- UI control binding

**Integration Plan:**
- Port particle system core
- Adapt React patterns to our R3F setup
- Extract parameter schemas

---

### Priority 3: webgpu-tsl-linkedparticles-main

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/webgpu-tsl-linkedparticles-main/`  
**Size:** 37 files (9 .tsx, 9 .svg)  
**Status:** ⏳ Pending

**What to Extract:**
- Particle linkage/connection logic
- Attractor system
- Line rendering between particles

**Key Features:**
- Neighbor detection
- Dynamic line generation
- Interactive attractors

**Use Cases:**
- Swarm behaviors
- Network visualizations
- Attraction fields

---

### Priority 4: three-pinata-main

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/three-pinata-main/`  
**Size:** 77 files (55 .ts)  
**Status:** ⏳ Pending

**What to Extract:**
- TypeScript utilities
- Type-safe TSL patterns
- Helper functions

**Why:**
- Strong TypeScript typing
- Reusable utility patterns
- Well-structured code

---

### Priority 5: Splash-main

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/Splash-main/`  
**Size:** 36 files (18 .wgsl, 6 .ts)  
**Status:** ⏳ Pending

**What to Extract:**
- Pure WGSL compute shaders
- Low-level GPU patterns
- Fluid simulation base

**Key Features:**
- Direct WGSL examples
- Compute workgroup patterns
- Buffer management

**Complexity:** HIGH - requires WGSL knowledge

---

### Priority 6: WaterBall-main

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/WaterBall-main/`  
**Size:** 34 files (14 .wgsl, 7 .ts)  
**Status:** ⏳ Pending

**What to Extract:**
- Fluid dynamics compute shaders
- Particle-based fluid
- Rendering techniques

**Target Phase:** Phase 3 (Advanced)

---

### Priority 7: singularity-master

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/singularity-master/`  
**Size:** 83 files (54 .js)  
**Status:** ⏳ Pending

**What to Extract:**
- Visual effect implementations
- Shader techniques
- Animation patterns

**Use Cases:**
- Post-processing effects
- Material effects
- Transition effects

---

### Priority 8: flow-master

**Location:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/flow-master/`  
**Size:** 27 files (13 .js)  
**Status:** ⏳ Pending

**What to Extract:**
- Flow field generation
- Vector field utilities
- Particle advection

**Complexity:** LOW - straightforward implementation

---

### Other Projects (Medium Priority)

#### softbodies-master
- Soft body physics
- Deformable meshes
- Phase 3 target

#### fluidglass-main
- Glass/fluid materials
- Refraction effects
- Material system enhancement

#### interactwave-main
- Interactive wave simulation
- User interaction patterns
- Demo inspiration

#### raymarching-tsl-main
- Raymarching framework
- SDF utilities
- Phase 3 feature

---

## Portfolio Examples

### Maxime Heckel's Blog

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/`  
**Size:** 560 files (191 .tsx, 170 .ts)  
**Status:** ⏳ Pending

**What to Extract:**
- Production TSL components
- Interactive demos
- Educational patterns
- Blog post shader implementations

**Key Areas:**
- Component architecture
- TSL best practices
- Performance patterns

---

### Maxime Heckel's Portfolio

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/`  
**Size:** 447 files (121 .tsx, 97 .ts, 69 .glsl)  
**Status:** ⏳ Pending

**What to Extract:**
- Portfolio presentation patterns
- Hero effects
- Page transitions
- Material showcase

---

### TSL Textures Project

**Location:** `.RESOURCES/REPOSITORIES/portfolio examples/tsl-textures-main/`  
**Size:** 451 files (202 .png, 71 .js)  
**Status:** ⏳ Pending

**What to Extract:**
- Procedural texture generation
- Texture utilities
- Pattern generators

---

## Extraction Strategy by Phase

### Phase 0 (This Week)
1. ✅ Create folder structure
2. 🔄 Extract three.js compute examples
3. 🔄 Extract three.js particle examples
4. 🔄 Copy three.js-tsl-sandbox (complete)
5. 🔄 Copy tsl-particles-of-a-thousand-faces
6. 🔄 Copy webgpu-tsl-linkedparticles
7. ⏳ Create initial research notes

### Phase 1 (Next 2 Weeks)
- Analyze extracted compute examples
- Study particle system architectures
- Extract patterns from three-pinata
- Begin portfolio analysis

### Phase 2 (Weeks 3-6)
- Extract remaining TSL projects as needed
- Port specific features from Splash/WaterBall
- Analyze flow-master patterns
- Extract UI components from react-bits

### Phase 3 (Weeks 7-8)
- Extract advanced examples (fluid, physics)
- Portfolio showcase patterns
- Animation libraries

---

## Research Notes Location

All research documentation goes in `TSL_ENGINE/_RESEARCH/`:

- `TSL_r181_API_Reference.md` - Three.js r181 TSL API
- `WebGPU_Compute_Patterns.md` - Compute shader patterns
- `Particle_System_Architectures.md` - Particle system designs
- `Material_Node_Patterns.md` - Material composition patterns
- `PostFX_Chain_Architecture.md` - PostFX design patterns

---

## Integration Checklist

When extracting/porting any resource:

- [ ] Copy files to appropriate inventory folder
- [ ] Create `_NOTES.md` in that folder describing:
  - What was extracted
  - Why it's useful
  - Key files to study
  - Integration approach
- [ ] Document any dependencies
- [ ] Note any version requirements
- [ ] List potential use cases
- [ ] Add to this extraction notes file

---

## Notes & Lessons Learned

### 2025-11-18
- Folder structure created successfully
- Ready to begin three.js examples extraction
- Need to survey three.js examples folder first to get complete file list

---

## Next Actions

1. **Survey three.js examples folder**
   ```bash
   cd .RESOURCES/three.js-r181/examples
   ls webgpu_* > ../../../TSL_ENGINE/_RESEARCH/threejs_webgpu_examples_list.txt
   ```

2. **Copy high-priority TSL projects**
   ```bash
   cp -r .RESOURCES/REPOSITORIES/TSLwebgpuExamples/three.js-tsl-sandbox-master TSL_ENGINE/_RESOURCE_INVENTORY/tsl_projects/
   cp -r .RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particles-of-a-thousand-faces-main TSL_ENGINE/_RESOURCE_INVENTORY/tsl_projects/particles/
   cp -r .RESOURCES/REPOSITORIES/TSLwebgpuExamples/webgpu-tsl-linkedparticles-main TSL_ENGINE/_RESOURCE_INVENTORY/tsl_projects/particles/
   ```

3. **Create research document templates**

4. **Begin analysis of extracted code**

