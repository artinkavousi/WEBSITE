# WebGPU + TSL resource integration plan

## Baseline architecture
- Sketches are auto-discovered via the dynamic `/sketches/$` route, which imports any `src/sketches/**/*.{ts,tsx}` file, instantiates its default `colorNode`, and renders the optional `Scene` helper within `WebGPUScene`. This allows direct drop-in of additional sketches without touching router code.【F:src/routes/sketches.$.tsx†L1-L65】

## Resource audit and recommended ports

### three.js r181 WebGPU/TSL examples
Prioritize direct lifts that showcase unique node/material graphs and minimal external dependencies.

- **Caustics (node shadows + refraction):** Uses `MeshPhysicalNodeMaterial` with custom `castShadowNode`/`castShadowPositionNode`, a Draco GLTF duck, HDR caustic texture, and GUI-tweakable occlusion/colour. Port this as a reusable caustics material demo plus a shared Draco asset loader.【F:.RESOURCES/three.js-r181/examples/webgpu_caustics.html†L21-L189】
- **Backdrop Water (refraction + depth-aware backdrop):** Implements Worley-noise water plane with `backdropNode`/`backdropAlphaNode`, depth-aware refraction via `viewportDepthTexture`, and animated GLTF character on an ice grid. Good candidate for a "backdrop" material helper and depth-prepass utilities.【F:.RESOURCES/three.js-r181/examples/webgpu_backdrop_water.html†L21-L195】
- **Camera array + logarithmic depth buffer:** The paired `webgpu_camera_array` and `webgpu_camera_logarithmicdepthbuffer` demos exercise array cameras, multi-view rendering, and precision-aware depth handling; porting them supplies a reference for multi-view rendering and log-depth parity.【F:.RESOURCES/three.js-r181/examples/webgpu_camera_array.html†L4-L79】【F:.RESOURCES/three.js-r181/examples/webgpu_camera_logarithmicdepthbuffer.html†L4-L72】
- **Volume caustics/cloud/lighting/perlin:** The clustered volume examples provide volumetric caustics/postprocessing pipelines that can be wrapped into a `volume/` sketch family to extend our volumetric rendering presets.【F:.RESOURCES/three.js-r181/examples/webgpu_volume_caustics.html†L4-L80】

### TSL/WebGPU repositories (TSLwebgpuExamples)
Promote modules with clearly isolated compute/material code for quick reuse.

- **webgpu-tsl-linkedparticles-main:** Compute-shader-driven particle mesh with postprocessing nodes and a documented `LinkedParticles.ts` entrypoint. Port as `tsl/particles/linked.ts` plus a sketch wrapper.【F:.RESOURCES/REPOSITORIES/TSLwebgpuExamples/webgpu-tsl-linkedparticles-main/README.md†L1-L69】
- **tsl-compute-particles / tsl-particle-waves:** CodePen-derived compute particle kernels useful for lightweight GPU particle presets; expose them as configurable node graphs.【F:.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/README.md†L1-L5】【F:.RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/README.md†L1-L5】
- **ssr-gtao-keio / ssgi-ssr-painter:** Screen-space reflection + ambient occlusion experiments suitable for a `post/ssr` module; keep original shader nodes intact to avoid regression.【F:.RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/README.md†L1-L5】【F:.RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/README.md†L1-L6】
- **floaty-main / splash-main / waterball-main / fluidglass-main:** Fluid-like materials and metaball FX that can seed a `materials/fluid` bundle (import shaders directly, adapting only asset paths).【F:.RESOURCES/REPOSITORIES/TSLwebgpuExamples/Floaty-main/README.md†L1-L20】

## Porting approach

1. **Module extraction (no rewrites):** Copy shader/node logic verbatim into `src/tsl/**` modules (e.g., `tsl/particles`, `tsl/post`, `tsl/materials`), only adapting imports to local `three` typings and `WebGPUScene` context.
2. **Sketch wrappers:** For each ported module, add a thin sketch under `src/sketches/...` that wires the module’s exported node/material into `WebGPUSketch` and exposes any UI controls the source demo provided.
3. **Asset normalization:** Mirror external textures/models from the source examples into `public/assets/<demo>/` and adjust loader paths accordingly. Share Draco decoder paths and GLTFLoader setup where needed.
4. **Renderer parity:** Ensure WebGPU renderer flags (antialias, depth formats, inspector hooks) match the source demos; surface toggles via sketch props if a demo depends on specific device features.
5. **Validation:** Compare rendered output against source HTML/CodePen references; when adding new post-process or particle modules, provide small regression-friendly presets in the sketch dropdown.

## Concrete next additions
- **Caustics sketch:** Import `MeshPhysicalNodeMaterial` caustic nodes and duck/glass assets into `src/sketches/webgpu/caustics.tsx`; add GUI controls for occlusion and material colour.
- **Backdrop water sketch:** Wrap Worley-noise water plane and depth-aware refraction into `src/sketches/webgpu/backdrop_water.tsx`, reusing the Michelle GLB animation and ice instancing.
- **Linked particles sketch:** Extract `LinkedParticles.ts` into `src/tsl/particles/linked.ts` and expose a sketch with control knobs for compute particle counts and post-processing toggles.
- **Wave particles preset:** Wrap the CodePen wave kernel into `src/tsl/particles/waves.ts` with a matching sketch to expose resolution/span/amplitude controls and act as a baseline “water sheet” module.
- **Vortex trail ribbons:** Add a vortex ribbon preset that reuses the linked particle layout but biases the force field toward a toroidal swirl with colour cycling and camera-distance fading. Expose it under `src/sketches/tsl/particles/vortex_trails.tsx`.
- **Ripple sheet preset:** Provide a dual-source ripple heightfield driven by TSL compute updates (two orbiting ripple emitters), with amplitude/decay/span controls in `src/sketches/tsl/particles/ripple_sheet.tsx`.
- **SSR/SSGI post stack:** Lift SSR+GTAO and painter variants into `src/tsl/post/ssr.ts` with a shared screen-space configuration interface, plus sketches demonstrating integration with existing scenes.
- **Compute particle presets:** Bundle the CodePen compute kernels (`tsl-compute-particles`, `tsl-particle-waves`) as presets under `src/tsl/particles/presets.ts` for quick scene augmentation.

