TSL + WebGPU — Ultimate Source of Truth (Three.js r181+)
=======================================================

**Target stack:** `three@0.181.0` with `three/webgpu` + `three/tsl`  
**Audience:** Advanced users building WebGPU-first, TSL-driven engines (particles, fluids, post, raymarching, etc.).

This guide merges:

- Your research docs in `.RESOURCES/KNOWLADGE_RESOURCE_RESEARCH`
- The `three.js-r181` source + WebGPU/TSL examples
- The TSL-heavy repos in `.RESOURCES/REPOSITORIES` (TSLwebgpuExamples, fragments-boilerplate, roquefort, etc.)

Use it as the *single* reference to validate your scripts and architectures.

---

0. Versions, Imports & Runtime Model
------------------------------------

### 0.1 Three.js 0.181.0: exports and targets

- `package.json` exports:
  - `"three"` → `./build/three.module.js` (classic, **WebGL by default**)
  - `"three/webgpu"` → `./build/three.webgpu.js`
  - `"three/tsl"` → `./build/three.tsl.js`
  - `"three/addons/*"` → examples JS modules

**Rule:** For WebGPU + TSL, always treat **WebGPU and TSL as first‑class entry points**:

```ts
import * as THREE from 'three/webgpu';
import {
  Fn, float, vec2, vec3, vec4, color,
  uv, positionLocal, positionWorld,
  time, timerDelta, timerGlobal,
  uniform, uniformArray, instanceIndex, instancedArray,
  hash, If, Loop, Break, mix, sin, cos, abs, length, dot,
  pass,
} from 'three/tsl';
```

### 0.2 Import maps vs bundlers

- **Import maps** (as used in `three.js-r181/examples/webgpu_*.html`):

```html
<script type="importmap">
{
  "imports": {
    "three": "../build/three.webgpu.js",
    "three/webgpu": "../build/three.webgpu.js",
    "three/tsl": "../build/three.tsl.js",
    "three/addons/": "./jsm/"
  }
}
</script>
```

- **Bundlers (Vite, Next, etc.)**:
  - Do **not** alias `"three"` to `three/webgpu` unless you truly never need WebGL.
  - Prefer:

    ```ts
    import * as THREE from 'three/webgpu';  // renderer, NodeMaterials, core types
    import * as TSL from 'three/tsl';       // node functions
    ```

### 0.3 Renderer lifecycle

**Canonical pattern (bundler / TS):**

```ts
import * as THREE from 'three/webgpu';
import { Fn, uv, vec3 } from 'three/tsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

await renderer.init();               // IMPORTANT for WebGPU

const material = new THREE.MeshBasicNodeMaterial();
material.colorNode = Fn(() => vec3(uv(), 0.5))();

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

function animate() {
  // renderer.compute(computeNode);   // if you have compute passes
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Rules:**

- Always call `await renderer.init()` (or equivalent async WebGPU init) **exactly once** before first render/compute.
- Use `renderer.setAnimationLoop(fn)` instead of `requestAnimationFrame` where possible.
- For compute workloads: **`renderer.compute(...)` before `renderer.render(...)` or `postProcessing.render()`**.

---

1. TSL Fundamentals
-------------------

TSL (**Three.js Shading Language**) is a JS/TS DSL that compiles to WGSL (WebGPU) and GLSL (WebGL). It is *the* standard way to author shaders in Three.js r180+.

### 1.1 Node types

Core node constructors:

- Scalars: `float(x)`, `int(x)`, `uint(x)`
- Vectors: `vec2(x, y)`, `vec3(x, y, z)`, `vec4(x, y, z, w)`
- Colors: `color('#ff00ff')`, `color(new THREE.Color(...))`
- Uniforms: `uniform(value)`, `uniformArray([...])`
- Built‑ins: `uv()`, `positionLocal`, `positionWorld`, `normalWorld`, `cameraPosition`, `time`, `timerDelta`, `timerGlobal`, `screenSize`, etc.

TSL functions are **pure node graphs**, not executed on the CPU—think of them as shader AST builders.

### 1.2 Functions with `Fn`

```ts
const simpleTint = Fn(([baseColor]) => {
  const st = uv();
  const tint = vec3(st.x, st.y, 1.0);
  return mix(baseColor, tint, st.x);
});

// Usage
material.colorNode = simpleTint(color('#4c8dff'));
```

**Guidelines:**

- The argument list to `Fn` is always a single array: `([a, b, c = default]) => { ... }`.
- Return **nodes**, not JS primitives.

### 1.3 Mutable vs immutable (`.toVar`)

By default, nodes are immutable expressions; mutation operations (`assign`, `addAssign`, `mulAssign`, etc.) require `.toVar()`:

```ts
const example = Fn(() => {
  const sum = float(0).toVar();

  Loop({ start: 0, end: 10 }, ({ i }) => {
    sum.addAssign(i); // OK because sum is a var
  });

  return sum;
});
```

**Key rule:** Any value you change over time in `If` or `Loop` must be a `.toVar()` or `.toVar()` clone.

### 1.4 Control flow (`If`, `Loop`, `Break`)

```ts
const branching = Fn(([v]) => {
  const out = float(0).toVar();

  If(v.greaterThan(0.5), () => {
    out.assign(1);
  }).ElseIf(v.greaterThan(0.25), () => {
    out.assign(0.5);
  }).Else(() => {
    out.assign(0);
  });

  return out;
});
```

Loops:

```ts
const loopExample = Fn(() => {
  const sum = float(0).toVar();

  Loop({ start: 0, end: 10 }, ({ i }) => {
    sum.addAssign(i);
  });

  return sum;
});
```

Raymarching-style with `Break()`:

```ts
const raymarch = Fn(() => {
  const pos = vec3(0, 0, -5).toVar();
  const dir = vec3(uv().sub(0.5), 1).normalize();

  Loop({ start: 0, end: 64 }, () => {
    const d = length(pos).sub(1.0);
    If(d.lessThan(0.01), () => {
      Break();
    });
    pos.addAssign(dir.mul(d));
  });

  return pos;
});
```

### 1.5 GLSL / WGSL interop (`glslFn`, `wgslFn`)

For legacy or highly customized code, you can author **native shader** snippets and still plug them into TSL:

```ts
import { glslFn, wgslFn, uv, uniform } from 'three/tsl';

const baseColor = uniform(new THREE.Vector4(1, 1, 1, 1));

const glslColorFn = glslFn(`
  vec4 colorFn(vec4 baseColor, vec2 uv) {
    float red   = (uv.x + 2.3) * 0.3;
    float green = (uv.y + 1.7) / 8.2;
    float blue  = mod(uv.x + uv.y, 10.0);
    return mix(baseColor, vec4(red, green, blue, 1.0), uv.x);
  }
`);

material.colorNode = glslColorFn({ baseColor, uv: uv() });
```

Use this sparingly; prefer pure TSL where possible (easier to maintain and refactor).

---

2. NodeMaterials (PBR, Sprites, Procedural)
-------------------------------------------

### 2.1 NodeMaterial families (WebGPU-ready)

From `three/webgpu`:

- `MeshBasicNodeMaterial`
- `MeshStandardNodeMaterial`
- `MeshPhysicalNodeMaterial`
- `SpriteNodeMaterial`
- `PointsNodeMaterial` (where available in your version)
- Specialized: `WoodNodeMaterial`, etc. (`three/addons/materials/*NodeMaterial.js`)

**Migration rule:**

- `MeshBasicMaterial` → `MeshBasicNodeMaterial`
- `MeshStandardMaterial` → `MeshStandardNodeMaterial`
- `SpriteMaterial` → `SpriteNodeMaterial`

### 2.2 Core material slots

Key properties you will set in code:

- `colorNode: vec3 | vec4`
- `positionNode: vec3` (vertex position override)
- `opacityNode: float`
- `scaleNode: float | vec2` (sprites / particles)
- `emissiveNode: vec3`
- `roughnessNode`, `metalnessNode`, `clearcoatNode`, `iridescenceNode` etc. (PBR)

### 2.3 Examples

**Gradient test card (sanity check):**

```ts
const mat = new THREE.MeshBasicNodeMaterial();
mat.colorNode = Fn(() => vec3(uv(), 0.5))();
```

**Animated vertex displacement (from your earlier guide):**

```ts
const mat = new THREE.MeshStandardNodeMaterial({
  metalness: 0,
  roughness: 0.5,
});

const pos = positionLocal.toVar();
pos.y.addAssign(sin(pos.x.add(time)).mul(0.5));
mat.positionNode = pos;

mat.colorNode = mix(color('blue'), color('white'), pos.y);
```

**Procedural ground grid (pattern from `webgpu_tsl_wood`):**

```ts
const gridMaterial = new THREE.MeshBasicNodeMaterial();

const gridXZ = Fn(([gridSize = float(1.0), dotWidth = float(0.1), lineWidth = float(0.02)]) => {
  const coord = positionWorld.xz.div(gridSize);
  const grid  = fract(coord);

  const fw        = fwidth(coord);
  const smoothing = max(fw.x, fw.y).mul(0.5);

  const squareDist = max(abs(grid.x.sub(0.5)), abs(grid.y.sub(0.5)));
  const dots  = smoothstep(dotWidth.add(smoothing), dotWidth.sub(smoothing), squareDist);

  const lineX = smoothstep(lineWidth.add(smoothing), lineWidth.sub(smoothing), abs(grid.x.sub(0.5)));
  const lineZ = smoothstep(lineWidth.add(smoothing), lineWidth.sub(smoothing), abs(grid.y.sub(0.5)));
  const lines = max(lineX, lineZ);

  return max(dots, lines);
});

const radialGradient = Fn(([radius = float(10.0), falloff = float(1.0)]) => {
  return smoothstep(radius, radius.sub(falloff), length(positionWorld));
});

const gridPattern = gridXZ(1.0, 0.03, 0.005);
const baseColor   = vec4(1, 1, 1, 0);
const gridColor   = vec4(0.5, 0.5, 0.5, 1);

gridMaterial.colorNode = gridPattern.mix(baseColor, gridColor).mul(radialGradient(30.0, 20.0));
gridMaterial.transparent = true;
```

### 2.4 Custom procedural NodeMaterials (WoodNodeMaterial)

`webgpu_tsl_wood.html` shows a complex NodeMaterial `WoodNodeMaterial` with a **parametric API**:

- Parameters: `centerSize`, `largeWarpScale`, `ringThickness`, `barkThickness`, `splotchIntensity`, etc.
- Pattern:
  - Create material: `const material = WoodNodeMaterial.fromPreset(genus, finish);`
  - Override parameters and hook them to GUI / inspector.
  - Assign `transformationMatrix` to control grain placement/orientation.

**Design pattern to copy:** *high-level JS/TS parameters that feed TSL internals*, not direct shader fiddling in each sketch.

---

3. WebGPU Compute & Storage Pipelines
-------------------------------------

This section distills patterns from:

- `three.js-r181/examples/webgpu_tsl_compute_attractors_particles.html`
- `TSLwebgpuExamples/three.js-tsl-particles-system-master`
- Codrops & WawaSensei TSL compute tutorials (particles & text destruction)
- Your fragments boilerplate and docs

### 3.1 Storage buffers with `instancedArray`

**Modern r181 pattern:**

```ts
const count = 1 << 18; // 2^18 particles

const positionBuffer = instancedArray(count, 'vec3');
const velocityBuffer = instancedArray(count, 'vec3');
```

- `instancedArray(count, type)` allocates WebGPU storage buffers for compute & attributes.
- Inside compute kernels, access per-particle state with:
  - `positionBuffer.element(instanceIndex)`
  - `velocityBuffer.element(instanceIndex)`
- In render materials, use `.toAttribute()` to read as per-instance attributes.

### 3.2 Init compute pass

From `webgpu_tsl_compute_attractors_particles`:

```ts
const init = Fn(() => {
  const pos = positionBuffer.element(instanceIndex);
  const vel = velocityBuffer.element(instanceIndex);

  const basePosition = vec3(
    hash(instanceIndex.add(uint(Math.random() * 0xffffff))),
    hash(instanceIndex.add(uint(Math.random() * 0xffffff))),
    hash(instanceIndex.add(uint(Math.random() * 0xffffff))),
  ).sub(0.5).mul(vec3(5, 0.2, 5));

  pos.assign(basePosition);

  const phi   = hash(instanceIndex.add(uint(Math.random() * 0xffffff))).mul(PI).mul(2);
  const theta = hash(instanceIndex.add(uint(Math.random() * 0xffffff))).mul(PI);

  const sphericalToVec3 = Fn(([phi, theta]) => {
    const sinPhiRadius = sin(phi);
    return vec3(
      sinPhiRadius.mul(sin(theta)),
      cos(phi),
      sinPhiRadius.mul(cos(theta)),
    );
  });

  const baseVelocity = sphericalToVec3(phi, theta).mul(0.05);
  vel.assign(baseVelocity);
});

const initCompute = init().compute(count);

function reset() {
  renderer.compute(initCompute);
}

reset(); // once at setup
```

### 3.3 Update compute pass (attractors)

Key ideas:

- Fixed timestep `delta = 1 / 60` for stable/repeatable trajectories.
- Gravity from several attractors, plus swirl (`cross`) around axes.
- Velocity damping & speed clamp.
- Toroidal world bounds with `mod`.

```ts
const attractorsPositions   = uniformArray([... THREE.Vector3 ...]);
const attractorsRotationAxes = uniformArray([... THREE.Vector3 ...]);
const attractorsLength      = uniform(attractorsPositions.array.length, 'uint');

const attractorMass      = uniform(Number(`1e${7}`));
const particleGlobalMass = uniform(Number(`1e${4}`));
const timeScale          = uniform(1);
const spinningStrength   = uniform(2.75);
const maxSpeed           = uniform(8);
const gravityConstant    = 6.67e-11;
const velocityDamping    = uniform(0.1);
const boundHalfExtent    = uniform(8);

const particleMassMultiplier = hash(
  instanceIndex.add(uint(Math.random() * 0xffffff)),
).remap(0.25, 1).toVar();
const particleMass = particleMassMultiplier.mul(particleGlobalMass).toVar();

const update = Fn(() => {
  const delta = float(1 / 60).mul(timeScale).toVar();

  const pos = positionBuffer.element(instanceIndex);
  const vel = velocityBuffer.element(instanceIndex);

  const force = vec3(0).toVar();

  Loop(attractorsLength, ({ i }) => {
    const attractorPos  = attractorsPositions.element(i);
    const attractorAxis = attractorsRotationAxes.element(i);

    const toAttractor = attractorPos.sub(pos);
    const distance    = toAttractor.length();
    const direction   = toAttractor.normalize();

    const gravityStrength = attractorMass.mul(particleMass)
      .mul(gravityConstant)
      .div(distance.pow(2))
      .toVar();

    const gravityForce   = direction.mul(gravityStrength);
    const spinningForce  = attractorAxis.mul(gravityStrength).mul(spinningStrength);
    const spinningVel    = spinningForce.cross(toAttractor);

    force.addAssign(gravityForce);
    force.addAssign(spinningVel);
  });

  vel.addAssign(force.mul(delta));

  const speed = vel.length();
  If(speed.greaterThan(maxSpeed), () => {
    vel.assign(vel.normalize().mul(maxSpeed));
  });

  vel.mulAssign(velocityDamping.oneMinus());

  pos.addAssign(vel.mul(delta));

  const halfHalfExtent = boundHalfExtent.div(2).toVar();
  pos.assign(
    mod(pos.add(halfHalfExtent), boundHalfExtent).sub(halfHalfExtent),
  );
});

const updateCompute = update().compute(count).setName('Update Particles');
```

**Render loop:**

```ts
function animate() {
  controls.update();
  renderer.compute(updateCompute);
  renderer.render(scene, camera);
}
```

### 3.4 Legacy vs modern compute APIs (for migration)

In `three.js-tsl-particles-system-master` (pre‑r180), compute is expressed via:

- `storage(...)` (old TSL node factory)
- `StorageInstancedBufferAttribute`
- `tslFn` instead of `Fn`
- `timerDelta()`, `timerGlobal()`
- Imports from `three/examples/jsm/nodes/Nodes.js`

**Rewrite strategy:**

- Replace `storage(new StorageInstancedBufferAttribute(count, 3), 'vec3', count)` with `instancedArray(count, 'vec3')`.
- Replace `tslFn(() => { ... })` with `Fn(() => { ... })`.
- Keep the same logic (turbulence, floor collisions, emitter patterns) but update imports to `'three/tsl'` and `'three/webgpu'`.

Example mapping (conceptual):

- Old:

```js
import { storage, tslFn, timerDelta, timerGlobal } from 'three/examples/jsm/nodes/Nodes.js';
import StorageInstancedBufferAttribute from 'three/examples/jsm/renderers/common/StorageInstancedBufferAttribute.js';

this.positionBuffer = storage(new StorageInstancedBufferAttribute(this.count, 3), 'vec3', this.count);
const particlesUpdate = tslFn(() => { /* ... */ });
this.particlesUpdateCompute = particlesUpdate().compute(this.count);
renderer.compute(this.particlesUpdateCompute);
```

- New (r181+):

```ts
import { instancedArray, Fn, timerDelta, timerGlobal } from 'three/tsl';

const positionBuffer = instancedArray(count, 'vec3');
const particlesUpdate = Fn(() => { /* same logic */ });
const particlesUpdateCompute = particlesUpdate().compute(count);
renderer.compute(particlesUpdateCompute);
```

---

4. GPU Particle Systems (Architectures)
--------------------------------------

Patterns distilled from:

- `webgpu_tsl_compute_attractors_particles`
- `three.js-tsl-particles-system-master`
- `tsl-compute-particles`, `tsl-particle-waves`, `tsl-particles-of-a-thousand-faces`
- Your physics/aurora PRD

### 4.1 Generic architecture

1. **Buffers** (storage):
   - `position: vec3`
   - `velocity: vec3`
   - Optional: `life: float`, `phase: uint`, `mass: float`, additional attributes.
2. **Compute passes**:
   - **Init**: seeds positions/lifetimes.
   - **Update**: integrates velocity, applies forces, manages life/reset.
   - Optional: multi-stage (P2G, grid, constraints, G2P, etc. in fluid engines).
3. **Render material**:
   - `SpriteNodeMaterial` or `PointsNodeMaterial`.
   - `positionNode` from storage buffer.
   - `scaleNode`, `colorNode` driven by life, velocity, or user parameters.
4. **Host-side API**:
   - Expose uniforms for emitter controls, turbulence, gravity, damping, sizes, colours.
   - Provide `update(dt)` or integration with app’s tick loop.

### 4.2 Life & fade patterns

From `three.js-tsl-particles-system`:

- `lifeBuffer: float ∈ [0, 1]` per particle.
- Life increments by `delta * decayFrequency`.
- On `life > 1`, spawn new particle with new position & velocity pattern.
- Scale uses smooth fade-in/fade-out:

```ts
const life = lifeBuffer.toAttribute();

const scaleIn = life.remap(0, fadeIn, 0, 1);
const scaleOut = life.remap(fadeOut.oneMinus(), 1, 1, 0);

const scaleFinal = min(scaleIn, scaleOut)
  .smoothstep(0, 1)
  .mul(size)
  .mul(range(0, 1)); // optional randomization

material.scaleNode = scaleFinal;
```

### 4.3 Emitter + turbulence pattern

Key logic from `ParticlesSystem.js` (rewritten conceptually in r181 style):

- Emitter uniforms:
  - `emitterPosition`, `emitterPreviousPosition`, `emitterVelocity`, `emitterPreviousVelocity`
  - `emitterRadius`, `emitterVelocityStrength`
  - `initialVelocity`, `initialRandomVelocity`
  - `turbulenceStrength`, `turbulenceTimeFrequency`, `turbulencePositionFrequency`
  - `gravity`, `floorY`, `floorDamping`

- Turbulence:

```ts
const turbulenceInput = position.mul(turbulencePositionFrequency).add(12.34);
const turbulence = curlNoise4d(vec4(turbulenceInput, time.mul(turbulenceTimeFrequency)))
  .mul(turbulenceStrength);

velocity.addAssign(turbulence);
velocity.addAssign(gravity.mul(delta));
velocity.mulAssign(velocityDamping.oneMinus());
position.addAssign(velocity.mul(delta));
```

- Floor bounce:

```ts
If(position.y.lessThan(floorY), () => {
  position.y.assign(floorY);
  velocity.y.mulAssign(floorDamping.oneMinus().negate());
});
```

This combination makes for **dense, controllable spray emitters**.

### 4.4 Sparkles & multi-pass visual FX

- Use a `varying` node (or equivalent pattern) to carry extra info (sparkle toggle) into the fragment path:

```ts
const sparkling = varying(0);

material.positionNode = Fn(() => {
  const sparklingTime = instanceIndex.add(uint(Math.random() * 0xffffff)).hash();
  const sparklingLife = life.mul(sparklingFrequency).mod(1);

  sparkling.assign(cond(
    sparklingLife.lessThan(sparklingTime)
      .and(sparklingLife.greaterThan(
        sparklingTime.sub(sparklingDuration.mul(sparklingFrequency)),
      )),
    1, 0,
  ));

  return positionBuffer.toAttribute();
})();
```

- Then in color:

```ts
material.colorNode = Fn(() => {
  const distanceToCenter = uv().sub(0.5).length();

  const alphaSolid = step(solidRatio.div(2), distanceToCenter)
    .oneMinus()
    .mul(solidAlpha);

  const alphaGlow = glowSpread.div(distanceToCenter)
    .sub(glowSpread.mul(2));
  alphaGlow.mulAssign(alphaSolid.oneMinus());

  const alphaFinal = max(alphaGlow, alphaSolid)
    .mul(opacity)
    .mul(sparkling.mul(sparklingAlpha).add(1));

  const finalColor = mix(colorIn, colorOut, life);
  return vec4(finalColor, alphaFinal);
})();
```

This pattern is ideal for **physically-motivated, cinematic particles**.

---

5. Node-Based Post-Processing (WebGPU)
--------------------------------------

Primary reference: `webgpu_postprocessing_bloom.html` and the whole `webgpu_postprocessing_*` family in `three.js-r181/examples`.

### 5.1 Core pipeline

```ts
import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

const renderer       = new THREE.WebGPURenderer({ antialias: true });
const postProcessing = new THREE.PostProcessing(renderer);

const scenePass      = pass(scene, camera);
const sceneColor     = scenePass.getTextureNode('output').toInspector('Color');

const bloomPass = bloom(sceneColor).toInspector('Bloom');

postProcessing.outputNode = sceneColor.add(bloomPass);

function animate() {
  // update any animations / compute
  postProcessing.render();
}
```

### 5.2 Tuning via inspector / GUI

The bloom node exposes uniforms like `threshold`, `strength`, `radius`:

```ts
const params = { threshold: 0, strength: 1, radius: 0 };

const gui = renderer.inspector.createParameters('Settings');
const bloomFolder = gui.addFolder('bloom');

bloomFolder.add(params, 'threshold', 0.0, 1.0).onChange(v => {
  bloomPass.threshold.value = v;
});

bloomFolder.add(params, 'strength', 0.0, 3.0).onChange(v => {
  bloomPass.strength.value = v;
});

gui.add(params, 'radius', 0.0, 1.0, 0.01).onChange(v => {
  bloomPass.radius.value = v;
});
```

### 5.3 Custom post nodes

Use TSL’s screen/UV helpers to build your own effect:

```ts
import { screenSize, uv, vignetteEffect, grainTextureEffect } from 'three/tsl';

const scenePass   = pass(scene, camera);
const sceneColor  = scenePass.getTextureNode('output');

const postNode = Fn(() => {
  const st = uv().sub(0.5);

  const vignette = vignetteEffect(st, float(0.45), float(1.2)); // from your utils
  const grain    = grainTextureEffect(uv());

  const colorWithVignette = sceneColor.mul(vignette);
  const colorWithGrain    = colorWithVignette.add(grain.mul(0.03));

  return colorWithGrain;
})();

postProcessing.outputNode = postNode;
```

**Rule:** any complex effect should be authored as a TSL node that **owns its own internal passes** (blur, MRT, etc.) when feasible.

---

6. Procedural Utilities (Noise, SDF, Color, FX)
-----------------------------------------------

Source references:

- `fragments-boilerplate-main/src/tsl/**`
- `tsl-textures` repo (boytchev)
- `TSLFX` (verekia)

### 6.1 Noise

Common signatures (from your docs and fragments boilerplate):

- `simplexNoise3d(v: vec3): float`
- `simplexNoise4d(v: vec4): float`
- `perlinNoise3d(P: vec3): float`
- `curlNoise3d(input: vec3): vec3`
- `curlNoise4d(input: vec4): vec3`
- `fbm(p: vec3, octaves?, frequency?, amplitude?, lacunarity?, gain?): float`
- `ridgedFbm(...)`
- `domainWarpedFbm(..., warpStrength?)`

Example (`fbm` from fragments boilerplate):

```ts
export const fbm = Fn(([p, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5]) => {
  const value           = float(0.0).toVar();
  const currentAmp      = float(amplitude).toVar();
  const currentFreq     = float(frequency).toVar();
  const maxValue        = float(0.0).toVar();

  Loop({ start: 0.0, end: octaves, type: 'float' }, () => {
    const noiseValue = simplexNoise3d(p.mul(currentFreq));
    value.addAssign(noiseValue.mul(currentAmp));
    maxValue.addAssign(currentAmp);
    currentFreq.mulAssign(lacunarity);
    currentAmp.mulAssign(gain);
  });

  return value.div(maxValue);
});
```

### 6.2 SDF primitives and combinators

- `sdSphere(p: vec3, r: float): float`
- `sdBox3d(p: vec3, b: vec3): float`
- `sdHexagon(p: vec2, r: float): float`
- `sdDiamond(uv: vec2, r: float): float`
- `sdRing(uv: vec2, s: float): float`
- `smin(a, b, k)`, `smax(a, b, k)` – smooth union/intersection wrappers.

**Example:**

```ts
const sdSphere = Fn(([p, r]) => length(p).sub(r));

const sceneSdf = Fn(([p]) => {
  const d1 = sdSphere(p, 1.0);
  const d2 = sdBox3d(p.sub(vec3(1.5, 0, 0)), vec3(0.5));
  return smin(d1, d2, 0.2);
});
```

### 6.3 Color tools

- `cosinePalette(t, a, b, c, d, e?)`
- Tonemapping:
  - `acesTonemap(color)`
  - `reinhardTonemap(color)`
  - `uncharted2Tonemap(color)`
  - `cinematicTonemap(color)`

**Palette example:**

```ts
const palette = Fn(([t]) =>
  cosinePalette(
    t,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 1.0, 1.0),
    vec3(0.263, 0.416, 0.557),
  ),
);

material.colorNode = palette(time.mul(0.1).fract());
```

### 6.4 Screen-space FX (from fragments boilerplate)

- `screenAspectUV(screenSize, range?)`
- `grainTextureEffect(uv)`
- `vignetteEffect(uv, smoothing?, exponent?)`
- `lcdEffect(props)`
- `pixellationEffect(uv, size?)`

**LCD effect (conceptual):**

```ts
material.colorNode = Fn(() => {
  const st   = uv();
  const mask = lcdEffect({
    resolution: screenSize,
    scalar: float(10),
    zoom: float(2.1),
    exponent: float(1.8),
    edge: float(0.2),
  });

  const baseCol = sceneColor; // from pass, or computed internally
  return baseCol.mul(mask);
})();
```

---

7. Ecosystem Repos & How to Learn From Them
-------------------------------------------

### 7.1 `three.js-r181` examples

Key WebGPU + TSL examples by category (all under `examples/webgpu_*`):

- **TSL materials & procedural shading**
  - `webgpu_tsl_wood.html` — procedural wood (WoodNodeMaterial)
  - `webgpu_tsl_vfx_tornado.html` — volumetric/particle VFX
  - `webgpu_tsl_vfx_flames.html` — flames
  - `webgpu_tsl_vfx_linkedparticles.html` — linked particle VFX
  - `webgpu_tsl_raging_sea.html` — ocean surface
  - `webgpu_tsl_procedural_terrain.html` — terrain + noise
  - `webgpu_tsl_galaxy.html` — galaxy/space dust
  - `webgpu_tsl_earth.html` — planet shading
  - `webgpu_tsl_halftone.html` — stylized halftone
  - `webgpu_tsl_editor.html`, `webgpu_tsl_transpiler.html` — editor & GLSL→TSL pipeline

- **Compute & storage**
  - `webgpu_tsl_compute_attractors_particles.html` — **canonical TSL compute + instancedArray** example.
  - `webgpu_storage_buffer.html` — raw storage buffer usage.
  - `webgpu_struct_drawindirect.html` — indirect draws driven by GPU-side data.

- **Postprocessing**
  - `webgpu_postprocessing.html` — basic pipeline
  - `webgpu_postprocessing_bloom.html` / `_bloom_emissive` / `_bloom_selective`
  - `webgpu_postprocessing_dof.html` / `_dof_basic`
  - `webgpu_postprocessing_ssr`, `_ssgi`, `_ao`, `_traa`, etc.

- **Materials & env**
  - `webgpu_materials*` (basic, matcap, SSS, transmission, toon, etc.)
  - `webgpu_pmrem_*` — reflection & environment setups.

- **Instancing & performance**
  - `webgpu_instance_*` — instances for meshes/points/sprites
  - `webgpu_mesh_batch.html` — BatchedMesh
  - `webgpu_performance*` — performance harnesses.

Use these as **ground truth** for:

- Correct imports and renderer usage
- How TSL is wired into NodeMaterials
- How compute and postprocessing integrate with WebGPU.

### 7.2 `TSLwebgpuExamples` folder

Contains a curated set of high-end WebGPU/TSL demos. Relevant highlights:

- `three.js-tsl-particles-system-master`
  - Early Node-based particle engine with init/update compute passes, emitter controls, turbulence, and sophisticated sprite shading (sparkle, glow, solid core, life).
  - Main lessons:
    - Splitting buffers (`position`, `velocity`, `life`) for clarity.
    - Using `timerDelta` / `timerGlobal` for time control.
    - Constructing *host-side* APIs around emitter parameters.

- `tsl-compute-particles`, `tsl-particle-waves`, `tsl-particles-of-a-thousand-faces-main`
  - Demonstrate GPGPU particles with TSL and sometimes React.
  - Patterns for:
    - Feeding textures or models into particle distributions.
    - Using multiple compute kernels (for behavior, constraints, etc.).

- `fluidglass-main`, `flow-master`, `Splash-main`, `WaterBall-main`
  - Various WebGPU/TSL-friendly fluid and MLS‑MPM demos.
  - Useful for:
    - Multi-pass compute scheduling (P2G → grid → constraints → G2P).
    - Buffer layout design (SoA structure across passes).
    - How to keep host/kernel interfaces narrow and composable.

- `three.js-tsl-sandbox-master`, `tsl-webgpu-companion`
  - Sandbox and companion code for quick experiments and building reusable TSL modules.

### 7.3 `portfolio examples`

- `fragments-boilerplate-main`
  - **Authoritative pattern** for structuring TSL utilities:

    ```
    src/tsl/
      noise/
      post_processing/
      utils/color/
      utils/math/
      utils/sdf/
      utils/function/
      lighting.ts
      particles/...
    ```

  - Use this as a **reference architecture** for your own `src/tsl` folder.

- `tsl-textures-main` (boytchev)
  - Complete TSL texture library:
    - Procedural masks, patterns, materials using TSL.
    - Examples show how to combine textures with NodeMaterials at scale.

- `blog.maximeheckel.com-main`
  - Blog examples use modern Three.js, R3F and advanced visuals, often WebGL today but conceptually aligned with TSL & WebGPU.
  - His blog posts on TSL/WebGPU are essential reading for mental models and best practices.

### 7.4 External libs

- **TSL Textures (`tsl-textures`)**
  - Ready-to-use TSL texture nodes that drop into NodeMaterials or post chains.
  - Use them instead of re-authoring generic patterns (brick, marble, noise).

- **TSLFX (`tslfx`)**
  - Toolkit of VFX primitives + SDF shapes in TSL.
  - Great base for shockwaves, impacts, and complex layered VFX.

- **TSL editors**
  - `bhushan6/tsl-editor` and `bandinopla/three.js-visual-node-editor`
  - Visual node editors that export TSL code.
  - Good for prototyping materials graphically before hand-tuning in code.

---

8. Anti-Patterns & Pitfalls Checklist
-------------------------------------

Use this to debug and validate any script.

### 8.1 Imports & versions

- [ ] ❌ Import from `'three'` and use `WebGLRenderer` in WebGPU-first TSL code.
- [ ] ❌ Import TSL bits from `three/examples/jsm/nodes/Nodes.js` in new projects.
- [ ] ✅ Use `three/webgpu` and `three/tsl` as primary modules.

### 8.2 NodeMaterials and shaders

- [ ] ❌ Mix `MeshStandardMaterial` with TSL nodes on `.colorNode` (won’t work).
- [ ] ✅ Use `MeshStandardNodeMaterial` / `MeshBasicNodeMaterial` / `SpriteNodeMaterial`.
- [ ] ❌ Mutate node expressions without `.toVar()`.
- [ ] ✅ Call `.toVar()` on any node you mutate (accumulators, temporaries, etc.).

### 8.3 Compute

- [ ] ❌ Use GPUComputationRenderer / WebGL-only tricks in WebGPU projects.
- [ ] ✅ Use `instancedArray`, `Fn().compute(count)`, and `renderer.compute(...)`.
- [ ] ❌ Call `renderer.render(...)` before compute.
- [ ] ✅ Always: `renderer.compute(computeNode); renderer.render(...)` (or `postProcessing.render()`).
- [ ] ✅ Keep compute kernels focused and small; split into multiple passes where needed.

### 8.4 Storage & attributes

- [ ] ❌ Use JS arrays or plain vertex attributes to store dynamic large states.
- [ ] ✅ Use `instancedArray` for per-particle / per-instance state.
- [ ] ✅ Read with `.element(instanceIndex)` in compute and `.toAttribute()` in materials.

### 8.5 Postprocessing

- [ ] ❌ Use `EffectComposer`/pmndrs-postprocessing expecting it to be WebGPU-ready.
- [ ] ✅ Use `THREE.PostProcessing` + `pass(scene, camera)` + TSL post nodes for WebGPU.

### 8.6 Mixing old & new TSL

- Migrating from `Nodes.js`:
  - [ ] Replace `storage(...) + StorageInstancedBufferAttribute` with `instancedArray`.
  - [ ] Replace `tslFn` with `Fn`.
  - [ ] Update imports from `three/examples/jsm/nodes/Nodes.js` to `three/tsl`.

---

9. How to Use This Guide to Validate a Script
---------------------------------------------

Given any of your TS/JS WebGPU scripts:

1. **Check imports**
   - Ensure `three/webgpu` + `three/tsl` are used.
   - No `Nodes.js` in new code (only allowed in legacy examples).

2. **Check materials**
   - Confirm NodeMaterials (`Mesh*NodeMaterial`, `SpriteNodeMaterial`) are used for anything with TSL attached.

3. **Check compute**
   - Ensure `instancedArray` (or equivalent storage nodes) are used.
   - Confirm `.element(instanceIndex)` accesses.
   - Confirm `renderer.compute()` is called before render.

4. **Check nodes**
   - Verify `.toVar()` on all mutated nodes.
   - Ensure all math/logic uses TSL nodes, not `Math.*` or bare JS.

5. **Check postprocessing**
   - If WebGPU post FX is used, ensure `PostProcessing` + `pass(...)` + TSL nodes, not WebGL-only libraries.

6. **Compare to examples**
   - Locate the closest official example (e.g., `webgpu_tsl_compute_attractors_particles`, `webgpu_postprocessing_bloom`).
   - Align your imports, renderer lifecycle, and node wiring to match those patterns.

When in doubt, treat the **Three.js r181 WebGPU examples** plus this guide as the ground truth. Any deviation should be justified by a clear need, not by accident.

---

This document is intended to be your **single living source of truth** for WebGPU + TSL in this project. As new patterns or libraries become important, extend this guide rather than creating parallel docs.


