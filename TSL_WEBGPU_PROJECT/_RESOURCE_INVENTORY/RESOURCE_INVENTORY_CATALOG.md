## 0. Purpose & Scope

This document is a **complete inventory and porting map** for all resources we can draw from under `@.RESOURCES` in order to expand the TSL/WebGPU engine and the `TSL_WEBGPU_PROJECT` (Fragments-based app).

It answers:

- **What do we have?** (examples, repos, portfolio projects, UI libraries)
- **What can we port?** (materials, postFX, particles/compute, fields, utilities, UI)
- **Where should it go?** (target engine module path + sketch path)
- **How hard is it?** (priority/complexity)

Source metadata comes from:

- `TSL_ENGINE/_RESEARCH/Resource_Catalog.md`
- `TSL_ENGINE/_RESOURCE_INVENTORY/_EXTRACTION_NOTES.md`

This file lives at the `_RESOURCE_INVENTORY` level so it’s shared by all projects.

---

## 1. High-Level Resource Families

We group resources into four main families:

- **A. Three.js r181 WebGPU examples**
  - Path: `.RESOURCES/three.js-r181/examples/`
  - ~186 examples covering compute, TSL, postFX, materials, particles, special FX.
- **B. TSL WebGPU example projects**
  - Path: `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`
  - 30+ repos, many full apps focused on TSL/WebGPU.
- **C. Portfolio examples**
  - Path: `.RESOURCES/REPOSITORIES/portfolio examples/`
  - Production sites (e.g. Maxime Heckel’s blog/portfolio, TSL textures).
- **D. UI / Animation libraries**
  - Path: `.RESOURCES/REPOSITORIES/other assets/`
  - React UI component libraries + specialized animation demos.

For each family we map **what is portable** and **where it should land** in our engine and project.

---

## 2. Family A — Three.js r181 WebGPU Examples

**Source root:** `.RESOURCES/three.js-r181/examples/`  
**Inventory type:** Single-file HTML + JS modules, grouped by feature (compute, postFX, materials, etc.).

### 2.1. Compute & Particle Examples

**Examples (partial list, all `webgpu_compute_*.html` / `webgpu_particles*`):**

- `webgpu_compute_particles.html`
- `webgpu_compute_particles_rain.html`
- `webgpu_compute_particles_snow.html`
- `webgpu_compute_texture.html`
- `webgpu_compute_audio.html`
- `webgpu_tsl_compute_attractors_particles.html` **[HIGH PRIORITY]**
- `webgpu_particles.html` (base)
- `webgpu_instance_points.html`
- `webgpu_instance_mesh.html` **[HIGH PRIORITY]**
- `webgpu_instance_uniform.html`
- `webgpu_instance_sprites.html`
- `webgpu_instance_path.html`
- `webgpu_instancing_morph.html`

**Portable concepts:**

- GPU compute pipelines (init + update shaders)
- Particle state buffers and workgroup patterns
- Instancing (points / meshes / sprites)
- Attractor-based particle motion

**Target engine modules:**

- `src/engine/particles/`:
  - `compute/attractorParticles.ts`
  - `compute/rainParticles.ts`
  - `compute/snowParticles.ts`
  - `compute/audioReactiveParticles.ts`
  - `instancing/instancedPointsField.ts`
  - `instancing/instancedMeshField.ts`
- Each implements a typed factory, e.g.:
  - `createAttractorParticles(params): ParticleSystemConfig`

**Target sketches:**

- `src/sketches/engine/particles/attractor_cloud.ts`
- `src/sketches/engine/particles/rain.ts`
- `src/sketches/engine/particles/snow.ts`
- `src/sketches/engine/particles/audio_reactive.ts`
- `src/sketches/engine/particles/instanced_mesh_flow.ts`

**Complexity & priority:**

- **Priority:** High (core to our “particles & compute” subsystem).
- **Complexity:** Medium–High (requires careful mapping from raw WebGPU to TSL + our `ParticleSystemConfig`).

---

### 2.2. TSL-Focused Examples

**Examples:**

- `webgpu_tsl_wood.html`
- `webgpu_tsl_vfx_tornado.html`
- `webgpu_tsl_vfx_linkedparticles.html` **[HIGH PRIORITY]**
- `webgpu_tsl_vfx_flames.html`
- `webgpu_tsl_transpiler.html`
- `webgpu_tsl_raging_sea.html`
- `webgpu_tsl_procedural_terrain.html`
- `webgpu_tsl_interoperability.html`
- `webgpu_tsl_halftone.html`
- `webgpu_tsl_galaxy.html` **[HIGH PRIORITY]**
- `webgpu_tsl_editor.html`
- `webgpu_tsl_earth.html`
- `webgpu_tsl_angular_slicing.html`

**Portable concepts:**

- TSL shader graph patterns for:
  - Procedural materials (wood, terrain, sea, halftone).
  - Complex FX (tornado, flames, galaxy).
  - Node graph & transpiler usage patterns.

**Target engine modules:**

- `src/engine/materials/library/`:
  - `woodMaterial.ts`
  - `seaSurfaceMaterial.ts`
  - `terrainMaterial.ts`
  - `halftoneMaterial.ts`
  - `earthAtmosphereMaterial.ts`
- `src/engine/postfx/library/`:
  - `galaxyBackground.ts` (could be material or postFX overlay)
- `src/engine/fields/`:
  - `tornadoField.ts` (flow fields from tornado example)

**Target sketches:**

- `src/sketches/engine/materials/wood.ts`
- `src/sketches/engine/materials/raging_sea.ts`
- `src/sketches/engine/materials/procedural_terrain.ts`
- `src/sketches/engine/materials/halftone_surface.ts`
- `src/sketches/engine/materials/earth.ts`
- `src/sketches/engine/fields/tornado_flow.ts`
- `src/sketches/engine/particles/galaxy.ts`

**Complexity & priority:**

- **Priority:** High for galaxy / tornado / wood / sea / terrain / halftone.
- **Complexity:** Medium (mostly TSL graph translation into single-file engine modules).

---

### 2.3. Post-Processing Examples

**Examples (20+):**

- `webgpu_postprocessing.html`
- `webgpu_postprocessing_bloom.html`
- `webgpu_postprocessing_bloom_emissive.html`
- `webgpu_postprocessing_bloom_selective.html`
- `webgpu_postprocessing_dof.html`
- `webgpu_postprocessing_dof_basic.html`
- `webgpu_postprocessing_ao.html`
- `webgpu_postprocessing_ssao.html`
- `webgpu_postprocessing_ssr.html`
- `webgpu_postprocessing_ssgi.html`
- `webgpu_postprocessing_sss.html`
- `webgpu_postprocessing_ca.html`
- `webgpu_postprocessing_motion_blur.html`
- `webgpu_postprocessing_outline.html`
- `webgpu_postprocessing_lensflare.html`
- `webgpu_postprocessing_3dlut.html`

**Portable concepts:**

- Multi-pass postFX chains:
  - Bloom (basic, emissive, selective).
  - DOF (bokeh, basic).
  - AO / SSAO / SSGI.
  - SSR, SSS, chromatic aberration, motion blur, outline, LUTs, lens flares.

**Target engine modules:**

- `src/engine/postfx/library/`:
  - `bloomChain.ts` (already present, can be expanded to multi-pass).
  - `dofChain.ts`
  - `aoChain.ts`, `ssaoChain.ts`, `ssgiChain.ts`
  - `ssrChain.ts`
  - `sssChain.ts`
  - `motionBlurChain.ts`
  - `outlineChain.ts`
  - `lensflareChain.ts`
  - `lutColorGradingChain.ts`

**Target sketches:**

- `src/sketches/engine/postfx/bloom_emissive.ts`
- `src/sketches/engine/postfx/bloom_selective.ts`
- `src/sketches/engine/postfx/dof_standard.ts`
- `src/sketches/engine/postfx/ao_ssao.ts`
- `src/sketches/engine/postfx/ssr.ts`
- `src/sketches/engine/postfx/sss_skin.ts`
- `src/sketches/engine/postfx/motion_blur.ts`
- `src/sketches/engine/postfx/lensflare.ts`
- `src/sketches/engine/postfx/lut_color_grading.ts`

**Complexity & priority:**

- **Priority:** Bloom/DOF/CA/SSAO/SSGI first; others follow.
- **Complexity:** Medium–High (multi-render-target and chain wiring).

---

### 2.4. Material Examples

**Examples (20+):**

- `webgpu_materials.html`
- `webgpu_materials_transmission.html`
- `webgpu_materials_sss.html` **[HIGH PRIORITY]**
- `webgpu_materials_matcap.html`
- `webgpu_materials_toon.html`
- `webgpu_materials_video.html`
- `webgpu_materials_envmaps.html`
- `webgpu_materials_envmaps_bpcem.html`
- `webgpu_materials_displacementmap.html`
- `webgpu_materials_lightmap.html`

**Portable concepts:**

- SSS and transmission materials.
- Matcap & toon shading.
- Environment mapping setups (including BPCEM).
- Displacement and lightmap usage patterns.

**Target engine modules:**

- `src/engine/materials/library/`:
  - `subsurfaceMaterial.ts`
  - `transmissionMaterial.ts`
  - `matcapMaterial.ts`
  - `toonMaterial.ts`
  - `envmapMaterial.ts`, `envmapBPCEMMaterial.ts`
  - `displacementMaterial.ts`
  - `lightmapMaterial.ts`

**Target sketches:**

- `src/sketches/engine/materials/subsurface_skin.ts`
- `src/sketches/engine/materials/transmission_glass.ts`
- `src/sketches/engine/materials/matcap_gallery.ts`
- `src/sketches/engine/materials/toon_characters.ts`
- `src/sketches/engine/materials/envmap_reflections.ts`

**Complexity & priority:**

- **Priority:** SSS, transmission, envmaps first (high visual impact).
- **Complexity:** Medium.

---

### 2.5. Special Effects

**Examples:**

- `webgpu_water.html`
- `webgpu_ocean.html`
- `webgpu_volume_cloud.html`
- `webgpu_volume_caustics.html`
- `webgpu_refraction.html`
- `webgpu_reflection.html`
- `webgpu_mirror.html`
- `webgpu_portal.html`
- `webgpu_lensflares.html`

**Portable concepts:**

- Water and ocean deformation + shading.
- Volumetric clouds and caustics.
- Refraction/reflection, mirrors, portal compositions.

**Target engine modules:**

- `src/engine/materials/library/waterSurface.ts`
- `src/engine/materials/library/oceanVolume.ts`
- `src/engine/postfx/library/causticsChain.ts`
- `src/engine/materials/library/refractionMaterial.ts`
- `src/engine/materials/library/reflectionMirror.ts`
- `src/engine/postfx/library/portalChain.ts`

**Target sketches:**

- `src/sketches/engine/materials/water.ts`
- `src/sketches/engine/materials/ocean.ts`
- `src/sketches/engine/postfx/caustics.ts`
- `src/sketches/engine/materials/refraction_glass.ts`
- `src/sketches/engine/materials/portal_scene.ts`

**Complexity & priority:**

- **Priority:** Medium (hero effects once core subsystems are stable).
- **Complexity:** Medium–High (multiple passes, environment integration).

---

## 3. Family B — TSL WebGPU Example Projects

**Source root:** `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`

We aggregate by project and map to engine subsystems.

### 3.1. three.js-tsl-sandbox-master (**Priority 1**)

- **Size:** 445 files (124 `.js`)
- **Role:** Comprehensive TSL sandbox; reference for graph patterns, noise, materials, FX.

**Portable elements:**

- TSL utility functions (noise, color, SDF, coordinates).
- Material graphs and layered FX.
- Example-specific postFX chains.

**Target engine modules:**

- `src/engine/utils/`:
  - `noise.ts` (enrich using sandbox utilities)
  - `color.ts` (palettes, tonemapping)
  - `math.ts`, `coords.ts`
- `src/engine/materials/library/`:
  - A collection of stylized and PBR materials derived from sandbox scenes.
- `src/engine/postfx/library/`:
  - FX chains like glitch, trails, stylized grading.

**Target sketches:**

- `src/sketches/engine/materials/*` referencing sandbox-derived materials.
- `src/sketches/engine/postfx/*` for sandbox FX.

---

### 3.2. tsl-particles-of-a-thousand-faces-main (**Priority 1 — Particles**)

- **Size:** 64 files (16 `.tsx`)
- **Role:** Advanced GPU particle system with React integration.

**Portable elements:**

- Particle buffer/data layout patterns.
- Update pipelines (compute-based or node-based).
- Parameter schema for rich controls.

**Target engine modules:**

- `src/engine/particles/`:
  - `systems/facesParticles.ts` (or similar).
- `src/engine/particles/core`:
  - Additional helpers based on extracted patterns.

**Target sketches:**

- `src/sketches/engine/particles/faces.ts`
- `src/sketches/engine/particles/faces_gallery.ts`

---

### 3.3. webgpu-tsl-linkedparticles-main (**Priority 1 — Flow & Links**)

- **Size:** 37 files (9 `.tsx`)
- **Role:** Linked particle system with attractors and visual connections.

**Portable elements:**

- Neighbor/connection logic.
- Attractor/repeller management.
- Line rendering between particles.

**Target engine modules:**

- `src/engine/particles/linked/linkedParticles.ts`
- `src/engine/fields/flow/linkedField.ts` (if field logic is reusable).

**Target sketches:**

- `src/sketches/engine/particles/linked_particles.ts`
- `src/sketches/engine/particles/network_viz.ts`

---

### 3.4. three-pinata-main (**Priority 2 — TS Utilities**)

- **Size:** 77 files (55 `.ts`)
- **Role:** Strongly typed Three.js/TS patterns.

**Portable elements:**

- Types and utilities for camera, scenes, common operations.
- Type-safe patterns for TSL usage.

**Target engine modules:**

- `src/engine/utils/`:
  - Type-safe wrappers, typed parameter objects.

---

### 3.5. Splash-main & WaterBall-main (**Priority 2–3 — Fluids & WGSL**)

**Splash-main**

- **Size:** 36 files (18 `.wgsl`)
- **Role:** Pure WGSL fluid compute.

**WaterBall-main**

- **Size:** 34 files (14 `.wgsl`)
- **Role:** Particle-based fluid dynamics.

**Portable elements:**

- WGSL compute shaders and buffer layouts.
- Fluid simulation kernels.

**Target engine modules:**

- `src/engine/particles/compute/fluidSplash.ts`
- `src/engine/particles/compute/waterBall.ts`

**Target sketches:**

- `src/sketches/engine/particles/fluid_splash.ts`
- `src/sketches/engine/particles/fluid_ball.ts`

**Complexity:** High (late-phase work).

---

### 3.6. singularity-master / flow-master / fluidglass-main (**Priority 3 — Advanced FX**)

**singularity-master**

- Visual FX, animation patterns.
- Target: `src/engine/postfx/library/*`, `src/engine/materials/library/*`.

**flow-master**

- Flow field + advection patterns.
- Target: `src/engine/fields/flow/*`, `src/engine/particles/flow/*`.

**fluidglass-main**

- Glass + fluid materials (refraction, dispersion).
- Target: `src/engine/materials/library/fluidGlass.ts`, `refractionDispersion.ts`.

---

## 4. Family C — Portfolio Examples

**Source root:** `.RESOURCES/REPOSITORIES/portfolio examples/`

### 4.1. blog.maximeheckel.com-main

- **Size:** 560 files (191 `.tsx`, 170 `.ts`)
- **Role:** Production-grade TSL/WebGPU demos in a content site.

**Portable elements:**

- Individual shader demos → engine materials or postFX.
- UI patterns for interactive explorations.

**Target engine modules:**

- `src/engine/materials/library/maxime/*`
- `src/engine/postfx/library/maxime/*`

**Target sketches:**

- `src/sketches/engine/maxime/*` referencing extracted demos.

---

### 4.2. portfolio-main

- **Size:** 447 files (121 `.tsx`, 97 `.ts`, 69 `.glsl`)
- **Portables:**
  - Hero section FX, transitions, reveal animations.

**Target engine modules:**

- `src/engine/postfx/library/heroTransitions.ts`
- `src/engine/materials/library/heroMaterials.ts`

**Target sketches:**

- `src/sketches/engine/portfolio/hero_scene.ts`

---

### 4.3. tsl-textures-main

- **Size:** 451 files (202 `.png`, 71 `.js`)
- **Role:** Procedural textures library.

**Portable elements:**

- Texture generation functions → TSL textures & patterns.

**Target engine modules:**

- `src/engine/utils/textures.ts`
- `src/engine/materials/library/textureDrivenMaterials.ts`

**Target sketches:**

- `src/sketches/engine/materials/texture_gallery.ts`

---

## 5. Family D — UI & Animation Libraries

**Source root:** `.RESOURCES/REPOSITORIES/other assets/`

### 5.1. react-bits-main

- **Size:** 994 files (393 `.jsx`, 229 `.tsx`)
- **Role:** UI components & patterns.

**Portable elements:**

- UI shells for:
  - Parameter panels.
  - Layout components.
  - Animation triggers.

**Target modules (outside engine core):**

- `src/components/ui/engine_controls/*`
- `src/components/ui/layout/*`

---

### 5.2. Animation demo zips

- `ElasticGridScroll-main.zip`
- `ImageExpansionTypography-main.zip`
- `KineticTypePageTransition-main.zip`
- `OnScrollTypographyAnimations-main.zip`
- `SlicedTextEffect-main.zip`

**Portable elements:**

- Scroll- and motion-based animations that can sync with engine sketches.

**Target modules:**

- `src/components/ui/scroll_animations/*`
- Potential future integration with engine presets (e.g. scroll-driven sketch selection).

---

## 6. Summary: Porting Coverage & Gaps

**Already implemented in `TSL_WEBGPU_PROJECT/fragments-boilerplate`:**

- Materials:
  - `basicLambert`, `phiMetal` (+ presets).
- PostFX:
  - `bloomChain`, `grainVignetteChain`, `chromaticAberrationChain` (+ presets).
- Fields:
  - `curlNoiseField`, enhanced SDF primitives.
- Sketches:
  - Engine demos for all of the above under `src/sketches/engine/**`.

**Ready-to-port next (from this inventory):**

- Three.js r181:
  - Galaxy & tornado fields/particles.
  - SSS and advanced materials.
  - DOF, SSAO/SSGI, SSR.
- TSL projects:
  - three.js-tsl-sandbox material/postFX modules.
  - `tsl-particles-of-a-thousand-faces` & linked particles systems.
- Portfolio:
  - 1–2 flagship hero effects or shaders.

Once specific examples are copied into `_RESOURCE_INVENTORY/**`, we can:

1. Point to the exact source path in this catalog.
2. Implement the corresponding `src/engine/**` module following the target paths above.
3. Create or extend `src/sketches/engine/**` demos.
4. Mark the item as “ported” in this catalog (with a link to the engine module).


