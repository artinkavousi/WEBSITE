# Architecture & Development Standards

## 1. The TSL Engine (`src/tsl/`)
The core of our creative pipeline is the `src/tsl` directory. It is organized by **domain**.

### Directory Structure
```text
src/tsl/
├── core/
│   ├── types.ts              # Common interfaces (MaterialParams, etc.)
│   └── common.ts             # Shared constants
├── materials/
│   ├── index.ts              # Exports
│   ├── glass/                # Complex materials can have their own folder
│   │   └── dispersion.ts
│   └── standard/
│       ├── phi_metal.ts      # Single-file material factories
│       └── velvet.ts
├── fields/
│   ├── noise/                # FBM, Curl, Simplex
│   ├── sdf/                  # Signed Distance Functions
│   └── vectors/              # Flow fields, vector operations
├── particles/
│   ├── compute/              # Compute shader kernels
│   └── emitters/             # Particle system factories
├── postfx/
│   ├── chains/               # Pre-configured chains (Cinematic, Retro)
│   └── passes/               # Individual effects (Bloom, Grain)
└── utils/
    ├── math.ts
    ├── color.ts
    └── lighting.ts
```

### Coding Conventions

#### Functional Factories
We use factory functions that return TSL Nodes or Configuration Objects.

**Example (Material):**
```typescript
// src/tsl/materials/standard/phi_metal.ts
import { color, float, Node } from 'three/tsl';

export type PhiMetalParams = {
  baseColor?: Node | string;
  roughness?: Node | number;
};

export const phiMetal = ({ baseColor = color(1,1,1), roughness = 0.5 }: PhiMetalParams) => {
  // Implementation...
  return {
    colorNode: ...,
    roughnessNode: ...,
    metalnessNode: ...
  };
};
```

#### Type Safety
- All parameters must be typed.
- Use `Node` from `three/tsl` for inputs that can be shaders.
- Use specific literal types where appropriate.

---

## 2. The Sketches (`src/sketches/`)
Sketches are visual unit tests and portfolio pieces. They connect the `tsl` engine to the React Three Fiber scene.

### Structure
Sketches mirror the Engine structure for easy navigation.

```text
src/sketches/
├── materials/
│   ├── phi-metal-demo.tsx
│   └── glass-dispersion-demo.tsx
├── particles/
│   └── attractor-system.tsx
└── ...
```

### Sketch Component Pattern
Sketches should be self-contained React components exported as default.

```typescript
import { Canvas } from '@react-three/fiber';
import { WebGPUScene } from '@/components/canvas/webgpu_scene';
import { phiMetal } from '@/tsl/materials/standard/phi_metal';

export default function Sketch() {
  return (
    <WebGPUScene>
      <MeshWithMaterial />
    </WebGPUScene>
  );
}

function MeshWithMaterial() {
  const materialConfig = phiMetal({ ... });
  return (
    <mesh>
      <sphereGeometry />
      <meshPhysicalNodeMaterial {...materialConfig} />
    </mesh>
  );
}
```

---

## 3. App Integration (`src/components/canvas/`)

### `WebGPUScene`
The standard wrapper for all sketches. It handles:
- `WebGPURenderer` initialization.
- Tone mapping and color space settings.
- Performance monitoring.
- Fallback handling (if any).

### `WebGPUSketch`
A helper component for 2D/Screen-space sketches (like Shadertoy).
- Accepts a `colorNode`.
- Renders a full-screen triangle.

---

## 4. Data Flow
1. **Leva Controls** -> **React State**
2. **React State** -> **TSL Factory Params**
3. **TSL Factory** -> **Three.js NodeMaterial**
4. **WebGPURenderer** -> **Screen**

We prioritize **Hot-Swapping**: changing a param in Leva should instantly update the TSL graph without full recompilation if possible (using TSL Uniforms).


