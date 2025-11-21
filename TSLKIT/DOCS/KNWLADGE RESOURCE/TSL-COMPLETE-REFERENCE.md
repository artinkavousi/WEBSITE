# Three.js TSL & WebGPU — Complete Reference

**Ultimate technical reference combining theory and practice**

Version 1.0 | Three.js r181 | November 2025

---

## Quick Navigation

**Part I: Core Knowledge**
1. [Overview](#part-i-core-knowledge)
2. [Three.js r181 Architecture](#2-threejs-r181-architecture)
3. [TSL (Three.js Shading Language)](#3-tsl-threejs-shading-language)
4. [Node System - Complete Reference](#4-node-system-complete-reference)
5. [WebGPU Renderer](#5-webgpu-renderer)
6. [Compute Shaders & GPGPU](#6-compute-shaders--gpgpu)
7. [Materials & Lighting](#7-materials--lighting)
8. [Post-Processing](#8-post-processing)

**Part II: Practical Recipes**
9. [Ocean & Water Effects](#9-ocean--water-effects)
10. [Hologram & Sci-Fi Effects](#10-hologram--sci-fi-effects)
11. [Particle Systems](#11-particle-systems)
12. [Flow Fields & Curl Noise](#12-flow-fields--curl-noise)
13. [Custom Normals & Displacement](#13-custom-normals--displacement)
14. [Fresnel Effects](#14-fresnel-effects)
15. [Time-Based Animation](#15-time-based-animation)
16. [Compute Shader Patterns](#16-compute-shader-patterns)
17. [Material Customization](#17-material-customization)
18. [Utility Functions](#18-utility-functions)

**Appendices**
- [A: Complete TSL Export List](#appendix-a-complete-tsl-export-list)
- [B: Common Shader Snippets](#appendix-b-common-shader-snippets)
- [C: Performance Tips](#appendix-c-performance-tips)
- [D: Real-World Projects](#appendix-d-real-world-projects)
- [E: API Quick Reference](#appendix-e-api-quick-reference)

---

# PART I: CORE KNOWLEDGE

## 1. Overview

### 1.1 What is Three.js r181?

Three.js r181 is a JavaScript 3D library with:
- **WebGL** and **WebGPU** renderers
- **Node-based shader system** (TSL)
- **Compute shader** support for GPGPU
- **Cross-browser** compatibility
- **Modern PBR materials** and lighting

### 1.2 Package Structure

```javascript
// Import methods
import * as THREE from 'three';                    // Core (WebGL)
import * as THREE from 'three/webgpu';             // WebGPU + Core
import { TSL } from 'three/webgpu';                // TSL namespace
import { Fn, uniform, vec3 } from 'three/tsl';     // TSL functions
import { OrbitControls } from 'three/addons/...';  // Addons
```

### 1.3 Build Files

| File | Purpose |
|------|---------|
| `three.module.js` | Core Three.js (WebGL) |
| `three.webgpu.js` | WebGPU Renderer + Core |
| `three.tsl.js` | TSL functions only |
| `three.webgpu.nodes.js` | WebGPU with nodes (alternative) |
| `three.cjs` | CommonJS build |

---

## 2. Three.js r181 Architecture

### 2.1 Core Components

```
Three.js r181
├── Core (scenes, cameras, geometries, math)
├── Renderers
│   ├── WebGLRenderer (traditional)
│   └── WebGPURenderer (modern, nodes-based)
├── Materials
│   ├── Classic Materials (MeshStandardMaterial, etc.)
│   └── Node Materials (NodeMaterial, SpriteNodeMaterial, etc.)
├── Nodes System (TSL)
│   ├── Core Nodes
│   ├── Accessors
│   ├── Math/Utils
│   ├── Display
│   ├── Lighting
│   └── GPGPU/Compute
└── Addons (controls, loaders, post-processing)
```

### 2.2 Renderer Comparison

| Feature | WebGLRenderer | WebGPURenderer |
|---------|---------------|----------------|
| Browser Support | All modern | Chrome, Edge (limited) |
| Shader System | GLSL strings | TSL (node-based) |
| Compute Shaders | ❌ No | ✅ Yes |
| Performance | Good | Excellent |
| Material Types | Classic | Node-based |
| Future-proof | Stable | Future standard |

---

## 3. TSL (Three.js Shading Language)

### 3.1 What is TSL?

TSL is Three.js's **node-based shading language** that allows you to:
- Write shaders in **JavaScript/TypeScript** instead of GLSL/WGSL
- Create **composable, reusable** shader nodes
- Target **both WebGL and WebGPU** (in many cases)
- Access **compute shaders** for GPGPU tasks

### 3.2 TSL Philosophy

```javascript
// Traditional GLSL
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// TSL equivalent
import { Fn, uv, positionLocal, modelViewProjection } from 'three/tsl';

const customPosition = Fn(() => {
  return modelViewProjection();
})();

material.vertexNode = customPosition;
material.colorNode = uv(); // vUv equivalent
```

### 3.3 Core TSL Concepts

#### **Nodes**
Everything in TSL is a "Node" — an object representing a shader operation:
```javascript
const myColorNode = vec3(1.0, 0.0, 0.0); // red color
const uvNode = uv();                      // UV coordinates
const combinedNode = uvNode.mul(myColorNode); // multiply
```

#### **Functions**
Use `Fn()` to create custom shader functions:
```javascript
import { Fn, vec3, float } from 'three/tsl';

const myFunction = Fn(([inputColor, intensity]) => {
  return inputColor.mul(intensity);
});

const result = myFunction(vec3(1, 0, 0), float(0.5));
```

#### **Uniforms**
Expose values from JavaScript to shaders:
```javascript
import { uniform } from 'three/tsl';

const timeUniform = uniform(0);
const colorUniform = uniform(new THREE.Color(0xff0000));
const vectorUniform = uniform(new THREE.Vector3(0, 1, 0));

// Update from JavaScript
timeUniform.value = elapsedTime;
colorUniform.value.set(0x00ff00);
```

---

## 4. Node System - Complete Reference

### 4.1 Node Categories

The node system in `src/nodes/` contains:
- **Core** — fundamental node types
- **Accessors** — access scene data (position, UV, normals, etc.)
- **Math** — mathematical operations
- **Utils** — utilities (loops, remapping, etc.)
- **Display** — color space, tone mapping, blending
- **Lighting** — lights and shadows
- **GPGPU** — compute shaders
- **Code** — custom code injection

### 4.2 Core Nodes

| Node | Description | Usage |
|------|-------------|-------|
| `UniformNode` | Uniform value | `uniform(value)` |
| `VaryingNode` | Varying between stages | `varying(node)` |
| `AttributeNode` | Geometry attribute | `attribute('position')` |
| `ConstNode` | Constant value | `float(1.0)`, `vec3(1,0,0)` |
| `AssignNode` | Assign value | `myVar.assign(value)` |

### 4.3 Accessors

#### **Position Nodes**
```javascript
import { 
  positionLocal,      // Local space position
  positionWorld,      // World space position
  positionView,       // View space position
  positionGeometry,   // Geometry position
  modelViewPosition,  // Model-view position
} from 'three/tsl';
```

#### **Normal Nodes**
```javascript
import { 
  normalLocal,        // Local space normal
  normalWorld,        // World space normal
  normalView,         // View space normal
  normalGeometry,     // Geometry normal
  normalFlat,         // Flat shading normal
} from 'three/tsl';
```

#### **UV Nodes**
```javascript
import { 
  uv,                 // UV coordinates (uv0)
  uv2,                // Second UV set
  pointUV,            // Point sprite UV
} from 'three/tsl';
```

#### **Camera Accessors**
```javascript
import { 
  cameraPosition,             // World camera position
  cameraViewMatrix,           // View matrix
  cameraProjectionMatrix,     // Projection matrix
  cameraNormalMatrix,         // Normal matrix
  cameraNear,                 // Near plane
  cameraFar,                  // Far plane
} from 'three/tsl';
```

#### **Material Properties**
```javascript
import { 
  materialColor,              // Base color
  materialRoughness,          // Roughness
  materialMetalness,          // Metalness
  materialOpacity,            // Opacity
  materialEmissive,           // Emissive color
  materialNormal,             // Normal map
  materialClearcoat,          // Clearcoat
  materialTransmission,       // Transmission
} from 'three/tsl';
```

#### **Instance/Batch**
```javascript
import { 
  instanceIndex,              // Instance ID
  vertexIndex,                // Vertex index
  drawIndex,                  // Draw index
} from 'three/tsl';
```

### 4.4 Math Nodes

#### **Basic Math**
```javascript
import { 
  add, sub, mul, div,         // Arithmetic
  pow, sqrt, exp, log,        // Power/exponential
  abs, sign, floor, ceil,     // Rounding
  min, max, clamp,            // Min/max
  mix, step, smoothstep,      // Interpolation
  saturate,                   // clamp(0, 1)
} from 'three/tsl';
```

#### **Trigonometry**
```javascript
import { 
  sin, cos, tan,              // Trig functions
  asin, acos, atan, atan2,    // Inverse trig
  radians, degrees,           // Conversion
} from 'three/tsl';
```

#### **Vector Math**
```javascript
import { 
  dot, cross,                 // Vector operations
  length, normalize,          // Length & normalize
  distance, reflect, refract, // Distance & reflection
} from 'three/tsl';
```

### 4.5 Display Nodes

#### **Color Space**
```javascript
import { 
  colorSpaceToWorking,        // To working space
  workingToColorSpace,        // From working space
  convertColorSpace,          // Convert between spaces
} from 'three/tsl';
```

#### **Tone Mapping**
```javascript
import { 
  toneMapping,                // Current tone mapping
  linearToneMapping,
  reinhardToneMapping,
  acesFilmicToneMapping,
  agxToneMapping,
} from 'three/tsl';
```

#### **Viewport/Screen**
```javascript
import { 
  viewportTexture,            // Viewport as texture
  viewportDepthTexture,       // Depth buffer
  viewportUV,                 // Screen UV
  screenSize,                 // Screen dimensions
} from 'three/tsl';
```

### 4.6 GPGPU/Compute Nodes

```javascript
import { 
  compute,                    // Create compute node
  workgroupId,                // Workgroup ID
  localId,                    // Local invocation ID
  globalId,                   // Global invocation ID
  workgroupBarrier,           // Workgroup barrier
  storageBarrier,             // Storage barrier
  atomicAdd,                  // Atomic operations
} from 'three/tsl';
```

---

## 5. WebGPU Renderer

### 5.1 Basic Setup

```javascript
import * as THREE from 'three/webgpu';

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Initialize renderer (required!)
await renderer.init();

function animate() {
  renderer.render(scene, camera);
}
```

### 5.2 Node Materials

```javascript
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { uv, texture, uniform, color } from 'three/tsl';

const material = new MeshStandardNodeMaterial();
material.colorNode = color(0xff0000);
material.roughnessNode = uniform(0.5);
material.metalnessNode = uniform(1.0);
```

---

## 6. Compute Shaders & GPGPU

### 6.1 Compute Basics

```javascript
import { Fn, storage, instanceIndex } from 'three/tsl';

const positions = storage(buffer, 'vec3', count);

const computeUpdate = Fn(() => {
  const position = positions.element(instanceIndex);
  position.y = position.y.add(0.01);
})().compute(count);

renderer.compute(computeUpdate);
```

### 6.2 Particle Systems with Compute

```javascript
import { instancedArray, Fn, If, vec3, hash } from 'three/tsl';

const particleCount = 100000;
const positions = instancedArray(particleCount, 'vec3');
const velocities = instancedArray(particleCount, 'vec3');

const computeInit = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);
  
  position.x = hash(instanceIndex).mul(10).sub(5);
  position.y = hash(instanceIndex.add(1)).mul(10);
  position.z = hash(instanceIndex.add(2)).mul(10).sub(5);
  
  velocity.assign(vec3(0, 0, 0));
})().compute(particleCount);

const computeUpdate = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);
  
  velocity.y = velocity.y.sub(0.01); // Gravity
  position.addAssign(velocity);
  
  If(position.y.lessThan(0), () => {
    position.y = 0;
    velocity.y = velocity.y.negate().mul(0.8);
  });
})().compute(particleCount);

renderer.compute(computeInit); // Once
// Then in animation loop:
renderer.compute(computeUpdate);
```

---

## 7. Materials & Lighting

### 7.1 Node Materials

```javascript
import { MeshStandardNodeMaterial } from 'three/webgpu';

const material = new MeshStandardNodeMaterial();
material.colorNode = color(0xff0000);
material.roughnessNode = uniform(0.5);
material.metalnessNode = uniform(1.0);
material.emissiveNode = color(0xffffff).mul(2);
material.normalNode = normalMap(normalTexture);
material.transparent = true;
material.opacityNode = uniform(0.5);
```

---

## 8. Post-Processing

### 8.1 Post-Processing Setup

```javascript
import { PostProcessing } from 'three/webgpu';
import { pass, gaussianBlur } from 'three/tsl';

const postProcessing = new PostProcessing(renderer);
const scenePass = pass(scene, camera);
const blurPass = gaussianBlur(scenePass, 2.0);
postProcessing.outputNode = blurPass;
```

---

# PART II: PRACTICAL RECIPES

## 9. Ocean & Water Effects

### 9.1 Raging Sea (Complete Wave Simulation)

```javascript
import { 
  MeshStandardNodeMaterial, tslFn, uniform, vec2, vec3, vec4, 
  float, sin, mul, loop, color, positionLocal, timerLocal, 
  modelNormalMatrix, mx_noise_float 
} from 'three/webgpu';

const material = new MeshStandardNodeMaterial({ roughness: 0.15 });

// Uniforms
const colorDepth = uniform(color('#ff0a81'));
const colorSurface = uniform(color('#271442'));
const largeWavesFrequency = uniform(vec2(3, 1));
const largeWavesSpeed = uniform(1.25);
const largeWavesMultiplier = uniform(0.15);
const smallWavesIterations = uniform(4);
const smallWavesFrequency = uniform(2);
const smallWavesSpeed = uniform(0.2);
const smallWavesMultiplier = uniform(0.18);

// Waves elevation function
const wavesElevation = tslFn(([position]) => {
  const time = timerLocal();
  
  // Large waves
  const elevation = mul(
    sin(position.x.mul(largeWavesFrequency.x).add(time.mul(largeWavesSpeed))),
    sin(position.z.mul(largeWavesFrequency.y).add(time.mul(largeWavesSpeed)))
  );
  
  elevation.mulAssign(largeWavesMultiplier);
  
  // Small waves (fractal)
  loop({ start: float(1), end: smallWavesIterations }, ({ i }) => {
    const noiseInput = vec3(
      position.xz.add(1).mul(smallWavesFrequency).mul(i),
      time.mul(smallWavesSpeed)
    );
    const wave = mx_noise_float(noiseInput, 1, 0)
      .mul(smallWavesMultiplier).div(i).abs();
    elevation.subAssign(wave);
  });
  
  return elevation;
});

// Apply elevation
const elevation = wavesElevation(positionLocal);
const position = positionLocal.add(vec3(0, elevation, 0));
material.positionNode = position;

// Compute custom normals
const normalComputeShift = uniform(0.01);
let positionA = positionLocal.add(vec3(normalComputeShift, 0, 0));
let positionB = positionLocal.add(vec3(0, 0, normalComputeShift.negate()));

positionA = positionA.add(vec3(0, wavesElevation(positionA), 0));
positionB = positionB.add(vec3(0, wavesElevation(positionB), 0));

const toA = positionA.sub(position).normalize();
const toB = positionB.sub(position).normalize();
const normal = toA.cross(toB);

material.normalNode = modelNormalMatrix.mul(normal);

// Color
material.colorNode = vec4(colorSurface, 1);
const emissive = elevation.remap(0.2, -0.35).pow(5);
material.emissiveNode = colorDepth.mul(emissive);
```

**Key Techniques:**
- Large sine waves + fractal noise detail
- Custom normal computation from neighboring vertices
- Elevation-based color gradient
- Emissive glow at peaks

---

## 10. Hologram & Sci-Fi Effects

### 10.1 Complete Hologram Shader

```javascript
import {
  MeshBasicNodeMaterial, tslFn, uniform, vec3, vec4, color,
  positionWorld, normalView, timerGlobal, cameraProjectionMatrix,
  cameraViewMatrix, add, sin, hash, mix, varying
} from 'three/tsl';

const material = new MeshBasicNodeMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const colorInside = uniform(color('#ff6088'));
const colorOutside = uniform(color('#4d55ff'));

// Vertex shader with glitch
const glitchStrength = varying(0);

material.vertexNode = tslFn(() => {
  const glitchTime = timerGlobal().sub(positionWorld.y.mul(0.5));
  
  glitchStrength.assign(
    add(
      sin(glitchTime),
      sin(glitchTime.mul(3.45)),
      sin(glitchTime.mul(8.76))
    ).div(3).smoothstep(0.3, 1)
  );
  
  const glitch = vec3(
    hash(positionWorld.xz.abs().mul(9999)).sub(0.5),
    0,
    hash(positionWorld.yx.abs().mul(9999)).sub(0.5),
  );
  
  positionWorld.xyz.addAssign(glitch.mul(glitchStrength.mul(0.5)));
  
  return cameraProjectionMatrix.mul(cameraViewMatrix).mul(positionWorld);
})();

// Fragment shader
material.colorNode = tslFn(() => {
  const stripes = positionWorld.y.sub(timerGlobal(0.02))
    .mul(20).mod(1).pow(3);
  
  const fresnel = normalView.dot(vec3(0, 0, 1)).abs().oneMinus();
  const falloff = fresnel.smoothstep(0.8, 0.2);
  
  const alpha = stripes.mul(fresnel).add(fresnel.mul(1.25)).mul(falloff);
  const finalColor = mix(colorInside, colorOutside, 
    fresnel.add(glitchStrength.mul(0.6)));
  
  return vec4(finalColor, alpha);
})();
```

---

## 11. Particle Systems

### 11.1 Basic Compute Particle System

```javascript
import {
  instancedArray, Fn, If, vec3, hash, uniform, instanceIndex,
  shapeCircle, SpriteNodeMaterial
} from 'three/tsl';

const particleCount = 100000;
const positions = instancedArray(particleCount, 'vec3');
const velocities = instancedArray(particleCount, 'vec3');
const colors = instancedArray(particleCount, 'vec3');

const gravity = uniform(-0.00098);
const bounce = uniform(0.8);
const friction = uniform(0.99);

// Initialize
const computeInit = Fn(() => {
  const position = positions.element(instanceIndex);
  const color = colors.element(instanceIndex);
  
  const amount = Math.sqrt(particleCount);
  const x = instanceIndex.mod(amount);
  const z = instanceIndex.div(amount);
  
  position.x = x.mul(0.2).sub(amount * 0.1);
  position.z = z.mul(0.2).sub(amount * 0.1);
  
  color.x = hash(instanceIndex);
  color.y = hash(instanceIndex.add(2));
})().compute(particleCount);

// Update
const computeUpdate = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);
  
  velocity.addAssign(vec3(0, gravity, 0));
  position.addAssign(velocity);
  velocity.mulAssign(friction);
  
  If(position.y.lessThan(0), () => {
    position.y = 0;
    velocity.y = velocity.y.negate().mul(bounce);
    velocity.x = velocity.x.mul(0.9);
    velocity.z = velocity.z.mul(0.9);
  });
})().compute(particleCount);

// Material
const material = new SpriteNodeMaterial();
material.colorNode = colors.element(instanceIndex);
material.positionNode = positions.toAttribute();
material.opacityNode = shapeCircle();
material.transparent = true;

// Execute
renderer.compute(computeInit);
// Animation loop:
renderer.compute(computeUpdate);
```

---

## 12. Flow Fields & Curl Noise

### 12.1 Flow Field Particles with Cursor

```javascript
import { storage, tslFn, If, timerGlobal, timerDelta, vec3, vec4, 
  float, uint, uniform } from 'three/tsl';
import { curlNoise4d } from './curlNoise4d.js';

const basePositionBuffer = storage(baseAttribute, 'vec3', count);
const positionBuffer = storage(new StorageAttribute(count, 3), 'vec3', count);
const lifeBuffer = storage(new StorageAttribute(count, 1), 'float', count);
const strengthBuffer = storage(new StorageAttribute(count, 1), 'float', count);

const flowFieldPositionFrequency = uniform(0.2);
const flowFieldTimeFrequency = uniform(0.2);
const flowfieldStrength = uniform(2);
const cursorPosition = uniform(vec3());
const cursorRadius = uniform(2);

// Initialize
const init = tslFn(() => {
  const basePosition = basePositionBuffer.element(instanceIndex);
  const position = positionBuffer.element(instanceIndex);
  const life = lifeBuffer.element(instanceIndex);
  const strength = strengthBuffer.element(instanceIndex);
  
  position.assign(basePosition);
  life.assign(instanceIndex.add(uint(Math.random() * 0xffffff)).hash());
  strength.assign(0);
});

// Update
const update = tslFn(() => {
  const time = timerGlobal().mul(flowFieldTimeFrequency);
  const delta = timerDelta();
  
  const basePosition = basePositionBuffer.element(instanceIndex);
  const position = positionBuffer.element(instanceIndex);
  const life = lifeBuffer.element(instanceIndex);
  const strength = strengthBuffer.element(instanceIndex);
  
  // Cursor interaction
  const distanceToCursor = cursorPosition.distance(basePosition);
  const cursorStrength = float(cursorRadius).sub(distanceToCursor)
    .smoothstep(0, 1).mulAssign(delta.mul(5));
  
  strength.assign(strength.add(cursorStrength).sub(delta.mul(0.5)).clamp(0, 1));
  
  // Flow field
  const flowfield = curlNoise4d(
    vec4(position.add(1).mul(flowFieldPositionFrequency), time)
  );
  
  position.addAssign(flowfield.mul(delta).mul(strength).mul(flowfieldStrength));
  
  // Life cycle
  const distanceDecay = basePosition.distance(position).remapClamp(0, 1, 0.2, 1);
  const newLife = life.add(delta.mul(0.6).mul(distanceDecay));
  
  If(newLife.greaterThan(1), () => {
    position.assign(basePosition);
  });
  
  life.assign(newLife.mod(1));
});

const initCompute = init().compute(count);
const updateCompute = update().compute(count);

material.positionNode = positionBuffer.toAttribute();
```

---

## 13. Custom Normals & Displacement

### 13.1 Compute Normals from Height Field

```javascript
const normalComputeShift = uniform(0.01);

const heightFunction = tslFn(([pos]) => {
  return sin(pos.x.mul(10)).mul(0.1);
});

const currentHeight = heightFunction(positionLocal);
const position = positionLocal.add(vec3(0, currentHeight, 0));

let positionA = positionLocal.add(vec3(normalComputeShift, 0, 0));
let positionB = positionLocal.add(vec3(0, 0, normalComputeShift.negate()));

positionA = positionA.add(vec3(0, heightFunction(positionA), 0));
positionB = positionB.add(vec3(0, heightFunction(positionB), 0));

const toA = positionA.sub(position).normalize();
const toB = positionB.sub(position).normalize();
const normal = toA.cross(toB);

material.normalNode = modelNormalMatrix.mul(normal);
```

---

## 14. Fresnel Effects

### 14.1 Standard Fresnel

```javascript
const fresnelNode = tslFn(() => {
  const viewDir = normalize(cameraPosition.sub(positionWorld));
  const fresnel = pow(oneMinus(saturate(dot(normalWorld, viewDir))), 3);
  return fresnel;
})();

material.emissiveNode = color(0x00ffff).mul(fresnelNode);
```

---

## 15. Time-Based Animation

### 15.1 Time Uniforms

```javascript
import { timerGlobal, timerLocal, timerDelta } from 'three/tsl';

const globalTime = timerGlobal();
const localTime = timerLocal();
const delta = timerDelta();

material.colorNode = sin(timerGlobal()).mul(0.5).add(0.5);
```

### 15.2 Oscillators

```javascript
import { oscSine, oscTriangle } from 'three/tsl';

const wave = oscSine(timerGlobal().mul(2)); // 2 Hz
const triWave = oscTriangle(timerGlobal().mul(2));
```

---

## 16. Compute Shader Patterns

### 16.1 Ping-Pong Buffers

```javascript
let bufferA = storage(new StorageBufferAttribute(count, 3), 'vec3', count);
let bufferB = storage(new StorageBufferAttribute(count, 3), 'vec3', count);

const computeStep = tslFn(() => {
  const inputData = bufferA.element(instanceIndex);
  const outputData = bufferB.element(instanceIndex);
  outputData.assign(inputData.add(vec3(0, 0.01, 0)));
})().compute(count);

function animate() {
  renderer.compute(computeStep);
  [bufferA, bufferB] = [bufferB, bufferA]; // Swap
}
```

### 16.2 Barriers & Atomics

```javascript
import { workgroupBarrier, storageBarrier, atomicAdd } from 'three/tsl';

const compute = tslFn(() => {
  const data = storageBuffer.element(instanceIndex);
  data.assign(vec3(1, 0, 0));
  
  storageBarrier(); // Wait for all writes
  
  const neighbor = storageBuffer.element(instanceIndex.add(1));
  
  // Atomic operations
  atomicAdd(counterBuffer.element(0), uint(1));
})().compute(count);
```

---

## 17. Material Customization

### 17.1 Custom Vertex Displacement

```javascript
material.positionNode = tslFn(() => {
  const pos = positionLocal.toVar();
  pos.y = sin(pos.x.mul(10).add(timerGlobal())).mul(0.1);
  return pos;
})();
```

### 17.2 UV Manipulation

```javascript
import { rotateUV, spherizeUV } from 'three/tsl';

const rotatingUV = rotateUV(uv(), timerGlobal());
const scrollingUV = uv().add(vec2(timerGlobal().mul(0.1), 0));

material.colorNode = texture(myTexture, scrollingUV);
```

---

## 18. Utility Functions

### 18.1 Remap Values

```javascript
import { remap, remapClamp } from 'three/tsl';

const remapped = remap(value, 0, 1, -1, 1);
const remappedClamped = remapClamp(value, 0, 1, -1, 1);
```

### 18.2 Hash for Randomness

```javascript
import { hash } from 'three/tsl';

material.colorNode = vec3(
  hash(instanceIndex),
  hash(instanceIndex.add(1)),
  hash(instanceIndex.add(2))
);
```

### 18.3 Distance Fields

```javascript
const circleSDF = tslFn(([p, radius]) => {
  return length(p).sub(radius);
});

const uv = uv().sub(0.5);
const dist = circleSDF(uv, 0.3);
const circle = smoothstep(0.01, 0, dist);
```

---

# APPENDICES

## Appendix A: Complete TSL Export List

All 620+ TSL exports from `src/Three.TSL.js`:

**Constants:**
EPSILON, PI, PI2, TWO_PI, HALF_PI, INFINITY

**Core:**
Fn, Const, Var, If, Loop, Return, Break, Continue, Discard

**Types:**
float, int, uint, bool, vec2, vec3, vec4, mat2, mat3, mat4,
bvec2, bvec3, bvec4, ivec2, ivec3, ivec4, uvec2, uvec3, uvec4

**Accessors:**
positionLocal, positionWorld, positionView, normalLocal, normalWorld,
normalView, uv, tangentLocal, tangentWorld, cameraPosition,
cameraViewMatrix, materialColor, materialRoughness, instanceIndex,
vertexIndex

**Math:**
add, sub, mul, div, pow, sqrt, exp, log, abs, sign, floor, ceil,
sin, cos, tan, asin, acos, atan, atan2, dot, cross, length,
normalize, distance, mix, clamp, saturate, min, max, step, smoothstep

**Display:**
toneMapping, convertColorSpace, saturation, luminance, grayscale,
viewportTexture, viewportUV, screenUV

**Compute:**
compute, instancedArray, storage, storageTexture, workgroupId,
localId, globalId, workgroupBarrier, storageBarrier, atomicAdd

**Utils:**
time, deltaTime, frameId, hash, checker, triNoise3D, rotateUV,
remap, remapClamp, oscSine, oscTriangle

[→ See THREEJS-TSL-WEBGPU-KNOWLEDGE-BASE.md for complete list]

---

## Appendix B: Common Shader Snippets

### B.1 Basic Vertex Displacement

```javascript
material.positionNode = Fn(() => {
  const pos = positionLocal.toVar();
  pos.y = sin(pos.x.mul(10).add(time)).mul(0.1);
  return pos;
})();
```

### B.2 Fresnel Effect

```javascript
const fresnel = tslFn(() => {
  const viewDir = normalize(cameraPosition.sub(positionWorld));
  return pow(oneMinus(saturate(dot(normalWorld, viewDir))), 3);
})();
```

### B.3 UV Scrolling

```javascript
const scrollingUV = uv().add(vec2(time.mul(0.1), 0));
material.colorNode = texture(myTexture, scrollingUV);
```

---

## Appendix C: Performance Tips

1. **Minimize node complexity** — Simpler graphs = faster compilation
2. **Reuse nodes** — Don't recreate identical nodes
3. **Use storage wisely** — Storage buffers are fast but have limits
4. **Batch compute calls** — Group operations when possible
5. **Profile with DevTools** — Use Chrome GPU profiling

---

## Appendix D: Real-World Projects

### Projects Analyzed from `.RESOURCES/`:

**three.js-tsl-sandbox** (25 examples):
- raging-sea, hologram, particles-flow-field
- animated-galaxy, attractors, earth
- procedural-terrain, vfx-tornado, etc.

**Production Sites:**
- blog.maximeheckel.com (Maxime Heckel)
- fragments-boilerplate (phobon)
- tsl-textures library

**Example Repos:**
- breeze-main, flow-master, Splash-main
- WaterBall-main, raymarching-tsl-main
- And 20+ more analyzed

---

## Appendix E: API Quick Reference

### Renderer
```javascript
const renderer = new THREE.WebGPURenderer();
await renderer.init();
renderer.render(scene, camera);
renderer.compute(computeNode);
```

### Materials
```javascript
const material = new MeshStandardNodeMaterial();
material.colorNode = color(0xff0000);
material.roughnessNode = uniform(0.5);
```

### Compute
```javascript
const compute = Fn(() => {
  // Compute logic
})().compute(count);
renderer.compute(compute);
```

### Storage
```javascript
const buffer = new StorageBufferAttribute(count, itemSize);
const storageNode = storage(buffer, 'vec3', count);
```

---

**Document Complete**

For getting started guides and tutorials, see **TSL-GETTING-STARTED.md**

---

**Version:** 1.0  
**Based on:** Three.js r181  
**Generated:** November 2025

