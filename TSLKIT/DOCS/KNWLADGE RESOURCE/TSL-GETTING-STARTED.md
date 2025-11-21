# Three.js TSL & WebGPU — Getting Started Guide

**Complete guide from installation to production**

Version 1.0 | Three.js r181 | November 2025

---

## 📚 Documentation Overview

This is **Part 1 of 2** of the ultimate TSL & WebGPU knowledge base:

### This Document: **TSL-GETTING-STARTED.md**
- Installation & setup
- Hello World examples  
- Project configuration
- First shaders (TSL + compute)
- Common workflows
- Debugging & troubleshooting
- Migration guides
- Learning paths

### Companion: **[TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md)**
- Complete API documentation
- All 620+ TSL functions
- Node system reference
- Practical shader recipes
- Real-world patterns

---

## Quick Navigation

**Getting Started:**
1. [Installation](#1-installation)
2. [Hello World](#2-hello-world)
3. [Project Setup](#3-project-setup)
4. [First TSL Shader](#4-first-tsl-shader)
5. [First Compute Shader](#5-first-compute-shader)

**Working with TSL:**
6. [Common Workflows](#6-common-workflows)
7. [Debugging](#7-debugging)
8. [Migration from WebGL](#8-migration-from-webgl)

**Next Steps:**
9. [Learning Path](#9-learning-path)
10. [Common Tasks](#10-common-tasks)
11. [Resources](#11-resources)

---

# 1. Installation

## 1.1 Via NPM (Recommended)

```bash
npm install three@latest
```

## 1.2 Via CDN

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.webgpu.js",
    "three/tsl": "https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.tsl.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.181.0/examples/jsm/"
  }
}
</script>
```

## 1.3 Browser Support

WebGPU requires:
- **Chrome/Edge**: 113+ (stable) ✅
- **Firefox**: Behind flag (experimental) ⚠️
- **Safari**: Technology Preview (experimental) ⚠️

Check support:

```javascript
if (navigator.gpu) {
  console.log('WebGPU supported!');
} else {
  console.log('WebGPU not supported, fallback to WebGL');
}
```

---

# 2. Hello World

## 2.1 Minimal WebGPU Scene (30 seconds)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.webgpu.js",
      "three/tsl": "https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.tsl.js"
    }
  }
  </script>
  
  <script type="module">
    import * as THREE from 'three';
    
    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGPURenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Initialize (REQUIRED for WebGPU!)
    await renderer.init();
    
    // Mesh
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardNodeMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    // Animation loop
    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.renderAsync(scene, camera);
    }
    
    renderer.setAnimationLoop(animate);
  </script>
</body>
</html>
```

**Key Points:**
- ✅ Use `WebGPURenderer` not `WebGLRenderer`
- ✅ Call `await renderer.init()` before rendering
- ✅ Use `renderAsync()` not `render()`
- ✅ Use `MeshStandardNodeMaterial` not `MeshStandardMaterial`

## 2.2 Quick Test (Copy & Paste)

Save this as `index.html` and open in Chrome 113+:

```html
<!DOCTYPE html>
<html>
<body style="margin:0">
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.webgpu.js"}}</script>
<script type="module">
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGPURenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
await renderer.init();
const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardNodeMaterial());
scene.add(cube);
scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(5,5,5));
renderer.setAnimationLoop(() => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.renderAsync(scene, camera);
});
</script>
</body>
</html>
```

---

# 3. Project Setup

## 3.1 Vite + TypeScript (Recommended)

```bash
npm create vite@latest my-threejs-app -- --template vanilla-ts
cd my-threejs-app
npm install three
npm run dev
```

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['three']
  },
  server: {
    headers: {
      // Required for SharedArrayBuffer (for some compute features)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "types": ["vite/client"]
  }
}
```

**main.ts:**

```typescript
import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

await renderer.init();

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  controls.update();
  renderer.renderAsync(scene, camera);
}

renderer.setAnimationLoop(animate);

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## 3.2 React (Vanilla Three.js)

R3F WebGPU support is experimental. Use vanilla Three.js:

```tsx
// App.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGPURenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.init().then(() => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshStandardNodeMaterial()
      );
      scene.add(cube);
      
      renderer.setAnimationLoop(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.renderAsync(scene, camera);
      });
    });
    
    return () => renderer.dispose();
  }, []);
  
  return <canvas ref={canvasRef} />;
}
```

## 3.3 Next.js

Same as React, add `'use client'` directive:

```tsx
'use client';

import { useEffect, useRef } from 'react';
// ... same as above
```

---

# 4. First TSL Shader

## 4.1 Simple Color Shader

```javascript
import * as THREE from 'three/webgpu';
import { uv, color, mix } from 'three/tsl';

const material = new THREE.MeshBasicNodeMaterial();

// UV-based gradient
material.colorNode = mix(
  color(0xff0000),  // Red at bottom
  color(0x0000ff),  // Blue at top
  uv().y
);

const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  material
);
scene.add(mesh);
```

## 4.2 Animated Shader

```javascript
import { tslFn, timerGlobal, sin, cos, vec3 } from 'three/tsl';

material.colorNode = tslFn(() => {
  const time = timerGlobal();
  const r = sin(time).mul(0.5).add(0.5);
  const g = cos(time).mul(0.5).add(0.5);
  const b = sin(time.mul(0.5)).mul(0.5).add(0.5);
  return vec3(r, g, b);
})();
```

## 4.3 Texture Sampling

```javascript
import { texture, uv } from 'three/tsl';

const textureLoader = new THREE.TextureLoader();
const myTexture = textureLoader.load('texture.jpg');

material.colorNode = texture(myTexture, uv());
```

## 4.4 Custom Function

```javascript
import { tslFn, positionLocal, sin, vec3 } from 'three/tsl';

// Define reusable function
const waveDisplacement = tslFn(([position, frequency, amplitude]) => {
  return sin(position.x.mul(frequency)).mul(amplitude);
});

// Use in material
material.positionNode = tslFn(() => {
  const pos = positionLocal.toVar();
  const displacement = waveDisplacement(pos, 10, 0.1);
  pos.y = pos.y.add(displacement);
  return pos;
})();
```

---

# 5. First Compute Shader

## 5.1 Simple Particle System

```javascript
import * as THREE from 'three/webgpu';
import {
  SpriteNodeMaterial,
  instancedArray, Fn, vec3, hash, uniform, If,
  instanceIndex, shapeCircle
} from 'three/tsl';

// Setup renderer
const renderer = new THREE.WebGPURenderer();
await renderer.init();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.z = 10;

// Particle count
const count = 10000;

// Storage arrays
const positions = instancedArray(count, 'vec3');
const velocities = instancedArray(count, 'vec3');

// Uniforms
const gravity = uniform(-0.01);

// Initialize particles
const init = Fn(() => {
  const pos = positions.element(instanceIndex);
  const vel = velocities.element(instanceIndex);
  
  // Random position
  pos.x = hash(instanceIndex).mul(10).sub(5);
  pos.y = hash(instanceIndex.add(1)).mul(10);
  pos.z = hash(instanceIndex.add(2)).mul(10).sub(5);
  
  // Zero velocity
  vel.assign(vec3(0, 0, 0));
})().compute(count);

// Update particles
const update = Fn(() => {
  const pos = positions.element(instanceIndex);
  const vel = velocities.element(instanceIndex);
  
  // Apply gravity
  vel.y = vel.y.add(gravity);
  
  // Update position
  pos.addAssign(vel);
  
  // Reset if below ground
  If(pos.y.lessThan(0), () => {
    pos.y = 10;
  });
})().compute(count);

// Material
const material = new SpriteNodeMaterial();
material.positionNode = positions.toAttribute();
material.colorNode = vec3(1, 1, 1);
material.scaleNode = uniform(0.1);
material.opacityNode = shapeCircle();
material.transparent = true;

// Create sprite
const sprite = new THREE.Sprite(material);
sprite.count = count;
sprite.frustumCulled = false;
scene.add(sprite);

// Initialize once
renderer.compute(init);

// Animation loop
function animate() {
  renderer.compute(update);
  renderer.renderAsync(scene, camera);
}

renderer.setAnimationLoop(animate);
```

**Key Concepts:**
- `instancedArray()` — creates GPU storage buffer
- `Fn()` — defines compute function
- `.compute(count)` — runs on GPU
- `renderer.compute()` — executes compute shader
- `.toAttribute()` — converts storage to renderable attribute

---

# 6. Common Workflows

## 6.1 Adding Uniforms

```javascript
import { uniform, color, float } from 'three/tsl';

// Create uniforms
const myColor = uniform(color(0xff0000));
const myNumber = uniform(1.0);
const myVector = uniform(new THREE.Vector3(0, 1, 0));

// Use in shader
material.colorNode = myColor;

// Update from JavaScript
myColor.value.set(0x00ff00);
myNumber.value = 2.0;
myVector.value.set(1, 2, 3);
```

## 6.2 GUI Integration (lil-gui)

```javascript
import GUI from 'lil-gui';
import { uniform, color } from 'three/tsl';

const gui = new GUI();

const myColor = uniform(color(0xff0000));
const myFloat = uniform(1.0);

// Add color picker
gui.addColor(
  { color: myColor.value.getHex() }, 
  'color'
).onChange((value) => {
  myColor.value.set(value);
});

// Add slider
gui.add(myFloat, 'value', 0, 10, 0.01).name('Intensity');
```

## 6.3 Post-Processing

```javascript
import { PostProcessing } from 'three/webgpu';
import { pass, gaussianBlur, toneMapping } from 'three/tsl';

const postProcessing = new PostProcessing(renderer);

const scenePass = pass(scene, camera);
const blurPass = gaussianBlur(scenePass, 2);
const finalPass = toneMapping(blurPass, THREE.ACESFilmicToneMapping);

postProcessing.outputNode = finalPass;

// PostProcessing handles rendering automatically
```

## 6.4 Loading Models with TSL Materials

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshStandardNodeMaterial, texture, uv } from 'three/tsl';

const loader = new GLTFLoader();

loader.load('model.glb', (gltf) => {
  const model = gltf.scene;
  
  // Replace materials with TSL materials
  model.traverse((child) => {
    if (child.isMesh) {
      const tslMaterial = new MeshStandardNodeMaterial();
      
      // Copy properties
      tslMaterial.color.copy(child.material.color);
      
      // Add custom TSL effects
      tslMaterial.colorNode = texture(child.material.map, uv());
      
      child.material = tslMaterial;
    }
  });
  
  scene.add(model);
});
```

---

# 7. Debugging

## 7.1 Inspector

```javascript
import { Inspector } from 'three/addons/inspector/Inspector.js';

const inspector = new Inspector();
renderer.inspector = inspector;

// Access in browser console:
// renderer.inspector.renderLists
```

## 7.2 Debug Node Output

```javascript
import { debug } from 'three/tsl';

// Log node value to console
material.colorNode = debug(myNode, 'MyNode Value');
```

## 7.3 Common Errors & Solutions

### ❌ Error: "Cannot read property 'init' of undefined"
**Solution:** Ensure you're using `WebGPURenderer` from `'three/webgpu'`:
```javascript
import * as THREE from 'three/webgpu';
const renderer = new THREE.WebGPURenderer();
```

### ❌ Error: "WebGPU is not supported"
**Solution:** Check browser support:
```javascript
if (!navigator.gpu) {
  alert('WebGPU not supported. Please use Chrome 113+');
}
```

### ❌ Error: "Node type mismatch"
**Solution:** Ensure node types match:
```javascript
// Wrong
const result = vec3(1, 0, 0).add(float(0.5)); // vec3 + float

// Correct
const result = vec3(1, 0, 0).add(vec3(0.5)); // vec3 + vec3
```

### ❌ Error: "Shader compilation failed"
**Solution:** Enable verbose errors:
```javascript
renderer.debug.checkShaderErrors = true;
```

## 7.4 Performance Monitoring

```javascript
import Stats from 'three/addons/libs/stats.module.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  renderer.renderAsync(scene, camera);
  stats.end();
}
```

## 7.5 Troubleshooting Checklist

- [ ] Browser supports WebGPU (Chrome 113+)
- [ ] Using `three/webgpu` import
- [ ] Called `await renderer.init()`
- [ ] Using `renderAsync()` not `render()`
- [ ] Using Node Materials (`MeshStandardNodeMaterial`)
- [ ] Node types match (vec3 with vec3, float with float)
- [ ] Uniforms updated via `.value` property
- [ ] Compute shaders use `renderer.compute()`
- [ ] Storage converted to attributes with `.toAttribute()`

---

# 8. Migration from WebGL

## 8.1 Renderer Changes

```javascript
// Before (WebGL)
const renderer = new THREE.WebGLRenderer();

// After (WebGPU)
const renderer = new THREE.WebGPURenderer();
await renderer.init(); // Required!
```

## 8.2 Material Changes

```javascript
// Before (WebGL)
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  roughness: 0.5
});

// After (WebGPU)
import { MeshStandardNodeMaterial, color, uniform } from 'three/webgpu';

const material = new MeshStandardNodeMaterial();
material.colorNode = color(0xff0000);
material.roughnessNode = uniform(0.5);
```

## 8.3 Custom Shaders

```javascript
// Before (WebGL) - ShaderMaterial with GLSL
const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
  `
});

// After (WebGPU) - NodeMaterial with TSL
import { MeshBasicNodeMaterial, uv, vec4 } from 'three/webgpu';

const material = new MeshBasicNodeMaterial();
material.colorNode = vec4(uv(), 0, 1);
```

## 8.4 Compute Shaders

```javascript
// Before (WebGL) - No compute shaders, use transform feedback or WebGL2 compute

// After (WebGPU) - Native compute shaders
import { Fn, storage, instanceIndex } from 'three/tsl';

const data = storage(buffer, 'vec3', count);

const compute = Fn(() => {
  const value = data.element(instanceIndex);
  value.assign(vec3(1, 0, 0));
})().compute(count);

renderer.compute(compute);
```

## 8.5 Compatibility Layer

```javascript
// Use forceWebGL for fallback
const renderer = new THREE.WebGPURenderer({ forceWebGL: true });

// Or detect and choose
const renderer = navigator.gpu 
  ? new THREE.WebGPURenderer()
  : new THREE.WebGLRenderer();

if (renderer instanceof THREE.WebGPURenderer) {
  await renderer.init();
}
```

---

# 9. Learning Path

## 9.1 Beginner (Day 1-3)

**Goals:**
- Set up WebGPU environment
- Understand TSL basics
- Create first custom shader

**Steps:**
1. ✅ Complete [Hello World](#2-hello-world)
2. ✅ Try [Simple Color Shader](#41-simple-color-shader)
3. ✅ Add [Animated Shader](#42-animated-shader)
4. ✅ Experiment with uniforms

**Resources:**
- This guide sections 1-4
- [TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md) sections 1-3

## 9.2 Intermediate (Week 1-2)

**Goals:**
- Master node composition
- Build custom materials
- Use texture sampling

**Steps:**
1. ✅ Study node system in [TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md#4-node-system-complete-reference)
2. ✅ Try shader recipes: Fresnel, displacement
3. ✅ Build a custom PBR material
4. ✅ Add post-processing

**Resources:**
- [TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md) sections 9-17
- Official Three.js examples

## 9.3 Advanced (Week 3-4)

**Goals:**
- Master compute shaders
- Build particle systems
- Create flow fields

**Steps:**
1. ✅ Complete [First Compute Shader](#5-first-compute-shader)
2. ✅ Study [TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md#11-particle-systems)
3. ✅ Implement flow field particles
4. ✅ Build multi-pass effects

**Resources:**
- [TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md) sections 6, 11-12, 16
- Real-world examples in Appendix D

---

# 10. Common Tasks

## "I want to..."

### ...create a custom material
→ [Section 4: First TSL Shader](#4-first-tsl-shader)  
→ [TSL-COMPLETE-REFERENCE.md: Material Customization](./TSL-COMPLETE-REFERENCE.md#17-material-customization)

### ...animate something
→ [Section 4.2: Animated Shader](#42-animated-shader)  
→ [TSL-COMPLETE-REFERENCE.md: Time-Based Animation](./TSL-COMPLETE-REFERENCE.md#15-time-based-animation)

### ...make particles
→ [Section 5: First Compute Shader](#5-first-compute-shader)  
→ [TSL-COMPLETE-REFERENCE.md: Particle Systems](./TSL-COMPLETE-REFERENCE.md#11-particle-systems)

### ...use compute shaders
→ [Section 5: First Compute Shader](#5-first-compute-shader)  
→ [TSL-COMPLETE-REFERENCE.md: Compute Patterns](./TSL-COMPLETE-REFERENCE.md#16-compute-shader-patterns)

### ...understand the API
→ [TSL-COMPLETE-REFERENCE.md: Node System](./TSL-COMPLETE-REFERENCE.md#4-node-system-complete-reference)  
→ [TSL-COMPLETE-REFERENCE.md: API Reference](./TSL-COMPLETE-REFERENCE.md#appendix-e-api-quick-reference)

### ...see real examples
→ [TSL-COMPLETE-REFERENCE.md: Ocean/Hologram](./TSL-COMPLETE-REFERENCE.md#9-ocean--water-effects)  
→ [TSL-COMPLETE-REFERENCE.md: Appendix D](./TSL-COMPLETE-REFERENCE.md#appendix-d-real-world-projects)

### ...debug an issue
→ [Section 7: Debugging](#7-debugging)

### ...migrate from WebGL
→ [Section 8: Migration](#8-migration-from-webgl)

---

# 11. Resources

## 11.1 Official Resources

**Three.js:**
- Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Forum: https://discourse.threejs.org/
- Discord: https://discord.gg/56GBJwAnUS

**WebGPU:**
- Spec: https://gpuweb.github.io/gpuweb/
- Chrome Status: https://chromestatus.com/feature/6213121689518080

## 11.2 Tutorials & Blogs

**Recommended:**
- Maxime Heckel's Blog: https://blog.maximeheckel.com/
- Three.js Journey: https://threejs-journey.com/
- WebGPU Fundamentals: https://webgpufundamentals.org/

## 11.3 Example Projects

**Starter Templates:**
- fragments-boilerplate: https://github.com/phobon/fragments-boilerplate
- three.js-tsl-sandbox: Multiple TSL examples

**Production Sites:**
- Maxime Heckel's Portfolio: https://blog.maximeheckel.com/
- Three.js Official Examples: https://threejs.org/examples/#webgpu_compute_particles

## 11.4 Community

- Three.js Forum: Best for questions
- Three.js Discord: Real-time help
- GitHub Issues: Bug reports
- Stack Overflow: `three.js` tag

---

# 12. Cheat Sheet

## Quick Reference

```javascript
// === SETUP ===
import * as THREE from 'three/webgpu';
import { tslFn, uniform, vec3, color, uv, texture } from 'three/tsl';

const renderer = new THREE.WebGPURenderer();
await renderer.init();

// === MATERIALS ===
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = color(0xff0000);
material.roughnessNode = uniform(0.5);

// === CUSTOM SHADER ===
material.positionNode = tslFn(() => {
  const pos = positionLocal.toVar();
  pos.y = sin(pos.x.mul(10)).mul(0.1);
  return pos;
})();

// === COMPUTE ===
const positions = instancedArray(count, 'vec3');

const compute = tslFn(() => {
  const pos = positions.element(instanceIndex);
  pos.y = pos.y.add(0.01);
})().compute(count);

renderer.compute(compute);

// === ANIMATION ===
renderer.setAnimationLoop(() => {
  renderer.renderAsync(scene, camera);
});
```

## Import Guide

```javascript
// Core
import * as THREE from 'three/webgpu';

// TSL Functions
import { 
  Fn, tslFn,                    // Functions
  uniform, varying, attribute,  // Declarations
  vec2, vec3, vec4, float,      // Types
  color, texture, uv,           // Common
  sin, cos, add, mul,           // Math
  timerGlobal, timerLocal,      // Time
  positionLocal, normalWorld,   // Accessors
  instancedArray, storage,      // Compute
  instanceIndex                 // Compute builtins
} from 'three/tsl';

// Addons
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```

---

# 13. Next Steps

## You're Ready! 🚀

**Now that you've completed this guide:**

1. **Build something!** Start with a simple shader and iterate
2. **Explore recipes** in [TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md)
3. **Check examples** in the official Three.js repo
4. **Join the community** on Discord/Forum
5. **Share your work** and get feedback

## Recommended Projects

**Starter Projects:**
- Animated gradient sphere
- Simple particle system
- Ocean waves effect

**Intermediate:**
- Flow field particles
- Post-processing pipeline
- Custom PBR material

**Advanced:**
- Fluid simulation
- Raymarching shader
- Complex compute effects

---

## Documentation Structure

You now have **2 comprehensive documents**:

### 1. **TSL-GETTING-STARTED.md** (This Document)
Installation → Hello World → Your First Shaders → Production

### 2. **[TSL-COMPLETE-REFERENCE.md](./TSL-COMPLETE-REFERENCE.md)**
Complete API → All 620+ Functions → Shader Recipes → Real Examples

---

**Happy coding with Three.js TSL & WebGPU! 🎨🚀**

*For questions: Three.js Forum & Discord*

---

**Document Version:** 1.0  
**Three.js Version:** r181  
**Generated:** November 2025  
**Part of:** TSL & WebGPU Knowledge Base

