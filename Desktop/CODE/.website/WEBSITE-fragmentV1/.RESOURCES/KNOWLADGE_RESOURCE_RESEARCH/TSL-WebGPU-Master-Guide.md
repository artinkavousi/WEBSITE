# TSL & WebGPU Master Guide (Three.js r181+)

**Version:** 1.0 (Verified for r181)
**Scope:** WebGPU, TSL (Three.js Shading Language), Compute Shaders, Particles, Post-Processing.

---

## 1. Core Setup & Imports

The ecosystem has shifted. Ensure you are using the correct import paths for `three/webgpu` and `three/tsl`.

### Standard Boilerplate

```typescript
// Core Three.js (WebGPU compatible)
import * as THREE from 'three/webgpu';

// TSL Nodes & Functions
import { 
    Fn, float, vec3, vec4, color, 
    uv, positionLocal, time, 
    uniform, texture, mix, range,
    If, Loop, Break,
    instanceIndex, instancedArray,
    pass
} from 'three/tsl';

// Renderer Setup
const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Standard Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
```

**Crucial Change:** 
- `THREE.MeshBasicMaterial` -> `THREE.MeshBasicNodeMaterial`
- `THREE.MeshStandardMaterial` -> `THREE.MeshStandardNodeMaterial`
- `THREE.SpriteMaterial` -> `THREE.SpriteNodeMaterial`

---

## 2. TSL Syntax & Concepts

TSL allows you to write shaders in JavaScript. It is **type-safe** and **transpiles** to WGSL (WebGPU) or GLSL (WebGL fallback).

### Function Definition (`Fn`)

```typescript
// Define a reusable TSL function
const calculateGlow = Fn(([colorInput, intensity]) => {
    const dist = uv().sub(0.5).length();
    const glow = float(1.0).sub(dist).pow(2.0);
    return colorInput.mul(glow).mul(intensity);
});

// Usage in a material
material.colorNode = calculateGlow(vec3(1, 0, 0), float(2.0));
```

### Variables & Mutability

By default, TSL nodes are immutable expressions. Use `.toVar()` for mutable variables (like `let` in JS).

```typescript
const logicFn = Fn(() => {
    const value = float(0).toVar(); // Initialize mutable variable
    
    // Modify variable
    value.addAssign(0.1);
    value.mulAssign(time);
    
    return value;
});
```

### Control Flow

TSL uses functional control flow wrappers.

**If / Else:**
```typescript
If(value.greaterThan(0.5), () => {
    result.assign(1.0);
}).Else(() => {
    result.assign(0.0);
});
```

**Loops:**
```typescript
Loop({ start: 0, end: 10 }, ({ i }) => {
    // i is a TSL int node
    sum.addAssign(i);
});
```

---

## 3. Node Materials

Node materials allow you to inject TSL logic into specific pipeline stages.

### Common Slots
- `colorNode`: Fragment color (replaces `map` or `color`).
- `positionNode`: Vertex position (for displacement/animation).
- `opacityNode`: Alpha channel.
- `scaleNode`: Particle/Sprite scale.
- `emissiveNode`: Emission color.

### Example: Animated Vertex Displacement

```typescript
const material = new THREE.MeshStandardNodeMaterial();

// Wobbly vertex displacement
const pos = positionLocal.toVar();
pos.y.addAssign(sin(pos.x.add(time)).mul(0.5));
material.positionNode = pos;

// Color based on height
material.colorNode = mix(color('blue'), color('white'), pos.y);
```

---

## 4. WebGPU Particles & Compute Shaders

This is the most powerful feature. You can run simulation logic on the GPU and render millions of particles.

### Architecture
1.  **Storage Buffers**: Use `instancedArray` to store state (position, velocity) per particle.
2.  **Compute Shader**: Updates the state every frame.
3.  **Render Material**: Reads the state to display particles.

### Complete Implementation Pattern

```typescript
const count = 10000;

// 1. Define Storage Buffers
const positionBuffer = instancedArray(count, 'vec3');
const velocityBuffer = instancedArray(count, 'vec3');

// 2. Compute Logic (The Simulation)
const updateParticles = Fn(() => {
    // Access current particle's data
    const pos = positionBuffer.element(instanceIndex);
    const vel = velocityBuffer.element(instanceIndex);
    
    // Physics logic
    vel.y.addAssign(float(-9.8).mul(0.016)); // Gravity
    pos.addAssign(vel);
    
    // Collision / Reset logic
    If(pos.y.lessThan(0), () => {
        pos.y.assign(0);
        vel.y.mulAssign(-0.5); // Bounce
    });
});

// Create the compute node
const computeNode = updateParticles().compute(count);

// 3. Render Material (The Visuals)
const material = new THREE.SpriteNodeMaterial();
material.positionNode = positionBuffer.toAttribute(); // Read from buffer
material.colorNode = vec3(1, 0.5, 0);

// 4. Mesh Setup
const geometry = new THREE.PlaneGeometry(1, 1);
const mesh = new THREE.InstancedMesh(geometry, material, count);
scene.add(mesh);

// 5. Render Loop
function animate() {
    renderer.compute(computeNode); // Run simulation
    renderer.render(scene, camera); // Render scene
}
```

### Advanced: Indirect Drawing
For purely GPU-driven particle counts (e.g., spawning/dying particles), use `IndirectStorageBufferAttribute`.

---

## 5. Post-Processing (Node-Based)

The new `PostProcessing` system is fully node-based and integrated with WebGPU.

```typescript
import { PostProcessing } from 'three/webgpu';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

// Setup
const postProcessing = new PostProcessing(renderer);

// Create a Scene Pass
const scenePass = pass(scene, camera);
const sceneColor = scenePass.getTextureNode('output');

// Add Effects
const bloomEffect = bloom(sceneColor, 0.5, 0.5, 1.0); // source, strength, radius, threshold

// Compose Output
postProcessing.outputNode = sceneColor.add(bloomEffect);

// Render
function animate() {
    postProcessing.render();
}
```

---

## 6. Raymarching & SDFs

TSL is excellent for Raymarching because you can compose SDF functions easily.

```typescript
// 1. Define SDF
const sdSphere = Fn(([p, r]) => length(p).sub(r));

// 2. Raymarch Loop
const raymarch = Fn(() => {
    const rayPos = vec3(0, 0, -5).toVar();
    const dir = normalize(vec3(uv().sub(0.5), 1));
    
    Loop({ start: 0, end: 64 }, () => {
        const d = sdSphere(rayPos, 1.0);
        If(d.lessThan(0.01), () => {
            Break(); // Hit
        });
        rayPos.addAssign(dir.mul(d));
    });
    
    return rayPos; // Return position for lighting
});

material.colorNode = raymarch().z; // Visualize depth
```

---

## 7. Tips & Best Practices

-   **`range()`**: Useful for randomizing particle attributes. `range(min, max)` automatically uses a hash based on instance index.
-   **`hash()`**: Deterministic random based on seed (usually `instanceIndex`).
-   **`timerLocal()` vs `time`**: `timerLocal` allows local time control (e.g., for specific effects), while `time` is global.
-   **Debugging**: Use `renderer.inspector` (if available/installed) or visualize values by outputting them to `colorNode`.
-   **Performance**: 
    -   Keep compute shaders focused.
    -   Use `instancedArray` over individual uniforms for massive data.
    -   Use `IndirectStorageBufferAttribute` to avoid CPU-GPU syncing for draw counts.

## 8. Common Pitfalls (r181)

1.  **Importing from `three` instead of `three/webgpu`**: You must use `three/webgpu` for the renderer and materials in many contexts to ensure node support.
2.  **Mixing Node and Standard Materials**: While possible, try to stick to `*NodeMaterial` when using TSL to avoid compatibility quirks.
3.  **Compute Shader Order**: Always call `renderer.compute()` **before** `renderer.render()`.
4.  **Mutable Variables**: Forgetting `.toVar()` when you intend to modify a value inside a `Loop` or `If` block.

---
*Reference compiled from official Three.js r181 examples and advanced community implementations.*


