# TSL-WebGPU Engine

A modular, TSL-first creative coding engine built on top of Three.js WebGPU and React Three Fiber.

## 🚀 Quick Start

```typescript
import { Fn } from 'three/tsl'
import { createEngineSketch, createPhiMetal } from '@/engine'

// Create a sketch with a metallic material
const sketch = Fn(() =>
  createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.9, 0.7, 0.4],
      metalness: 0.95,
    }),
  })
)

export default sketch
```

Then navigate to `/sketches/your-sketch-name` to see it in action.

## 📁 Project Structure

```
src/
├── engine/                    # Engine modules (portable, reusable)
│   ├── core/                  # Core types, config, utilities
│   │   ├── engineTypes.ts     # TypeScript interfaces
│   │   ├── engineConfig.ts    # Global configuration
│   │   └── createEngineSketch.ts  # Sketch wrapper
│   ├── materials/             # Material library
│   │   └── library/
│   │       ├── basicLambert.ts    # Diffuse material
│   │       └── phiMetal.ts        # Metallic material
│   ├── postfx/                # Post-processing (coming soon)
│   ├── particles/             # Particle systems (coming soon)
│   ├── fields/                # Vector/SDF fields (coming soon)
│   └── presets/               # One-liner presets (coming soon)
├── sketches/                  # Your creative sketches
│   ├── engine/                # Engine demonstration sketches
│   │   └── materials/         # Material demos
│   └── ...                    # Your custom sketches
└── tsl/                       # TSL utilities (from boilerplate)
```

## 🎨 Current Features (Phase 1 Complete)

### ✅ Core System
- **Type-safe engine architecture** with comprehensive TypeScript interfaces
- **Configuration system** with quality presets and runtime settings
- **Engine sketch wrapper** for composing materials, effects, and more

### ✅ Materials
Two production-ready materials:

#### Basic Lambert
Simple diffuse material with Lambert shading.

```typescript
import { createBasicLambert } from '@/engine/materials'

const material = createBasicLambert({
  baseColor: [0.9, 0.5, 0.2],
  ambient: 0.2,
  lightDir: [1, 1, 1],
})
```

**Presets:**
- `lambertPresets.warmOrange()`
- `lambertPresets.coolBlue()`
- `lambertPresets.softWhite()`
- `lambertPresets.earthTone()`
- `lambertPresets.pastelPink()`

#### Phi Metal
Stylized metallic material with procedural noise and Fresnel.

```typescript
import { createPhiMetal } from '@/engine/materials'

const material = createPhiMetal({
  baseColor: [0.9, 0.7, 0.4],
  metalness: 0.95,
  roughness: 0.2,
  animateNoise: true,
})
```

**Presets:**
- `phiMetalPresets.gold()`
- `phiMetalPresets.silver()`
- `phiMetalPresets.copper()`
- `phiMetalPresets.brass()`
- `phiMetalPresets.iron()`
- `phiMetalPresets.titanium()`
- `phiMetalPresets.holographic()`
- `phiMetalPresets.matte()`

### ✅ Demo Sketches
5 demonstration sketches showing material usage:
- `/sketches/engine/materials/basic_lambert`
- `/sketches/engine/materials/phi_metal`
- `/sketches/engine/materials/phi_metal_gold`
- `/sketches/engine/materials/phi_metal_copper`
- `/sketches/engine/materials/lambert_presets`

## 🛠️ Creating Your First Sketch

### Step 1: Create a Sketch File

Create a new file in `src/sketches/` (e.g., `my-cool-effect.ts`):

```typescript
import { Fn } from 'three/tsl'
import { createEngineSketch, phiMetalPresets } from '@/engine'

const sketch = Fn(() =>
  createEngineSketch({
    material: phiMetalPresets.gold(),
  })
)

export default sketch
```

### Step 2: Access Your Sketch

Navigate to: `http://localhost:5173/sketches/my-cool-effect`

That's it! The sketch router automatically picks up your new file.

## 🔧 Configuration

### Global Engine Config

```typescript
import { setEngineConfig, applyQualityPreset } from '@/engine/core'

// Apply a quality preset
applyQualityPreset('high')

// Or customize specific settings
setEngineConfig({
  debug: {
    showStats: true,
  },
  postfx: {
    enabled: true,
    quality: 'ultra',
  },
})
```

### Quality Presets
- `low` - For lower-end devices
- `medium` - Balanced performance
- `high` - High-quality visuals (default)
- `ultra` - Maximum quality

## 📚 API Reference

### Types

#### `MaterialNodeConfig`
```typescript
interface MaterialNodeConfig {
  colorNode: Node              // Main color output
  roughnessNode?: Node | number
  metalnessNode?: Node | number
  normalNode?: Node
  emissiveNode?: Node
  opacityNode?: Node
  aoNode?: Node
  onBeforeCompile?: (material: Material) => void
  uniforms?: Record<string, any>
  metadata?: { name?: string, description?: string, author?: string }
}
```

#### `EngineSketchConfig`
```typescript
interface EngineSketchConfig {
  material?: MaterialNodeConfig
  postfx?: PostFXChain       // Coming in Phase 2
  fields?: VectorField[]     // Coming in Phase 2
  particles?: ParticleSystemConfig  // Coming in Phase 2
  background?: Node | [number, number, number]
  metadata?: { name?: string, description?: string, author?: string, tags?: string[] }
}
```

### Functions

#### `createEngineSketch(config: EngineSketchConfig): Node`
Main wrapper for creating engine-powered sketches.

#### `createMaterialSketch(colorNode: Node): Node`
Convenience wrapper for material-only sketches.

#### `createBasicLambert(params?: BasicLambertParams): MaterialNodeConfig`
Create a Lambert diffuse material.

#### `createPhiMetal(params?: PhiMetalParams): MaterialNodeConfig`
Create a stylized metallic material.

## 🎯 Roadmap

### ✅ Phase 1: Core & Materials (COMPLETE)
- Core types and configuration
- Material system
- Two example materials
- Demo sketches

### 🔄 Phase 2: PostFX & Fields (In Progress)
- [ ] Post-processing chain system
- [ ] Bloom effect
- [ ] Color grading
- [ ] DOF approximation
- [ ] Vector field utilities
- [ ] Enhanced SDF operations

### ⏳ Phase 3: Particles & Compute
- [ ] GPU-driven particle systems
- [ ] Attractor particles
- [ ] Flow field particles
- [ ] SDF particles
- [ ] Swarm/boids behavior

### ⏳ Phase 4: Polish & Expansion
- [ ] Preset library
- [ ] Performance optimization
- [ ] Advanced materials (SSS, glass, etc.)
- [ ] Complete documentation
- [ ] More demo sketches

## 📖 Documentation

- **[Vision & Guiding Principles](./PROPOSAL DOCS/TSL-WebGPU Engine — Vision & Guiding Principles.md)** - Project philosophy and goals
- **[Architecture & Implementation Plan](./PROPOSAL DOCS/TSL-WebGPU Engine — Architecture & Implementation Plan.md)** - Technical architecture
- **[Implementation Roadmap](./PROPOSAL DOCS/Implementation Roadmap & Resource Integration Plan.md)** - Detailed implementation plan

## 🤝 Contributing

This engine is designed to be:
- **Modular** - Each module is self-contained
- **Type-safe** - Full TypeScript support
- **Documented** - JSDoc comments everywhere
- **Example-driven** - Every feature has a demo sketch

To add a new material:

1. Create `src/engine/materials/library/yourMaterial.ts`
2. Follow the `MaterialNodeConfig` interface
3. Create a demo sketch in `src/sketches/engine/materials/`
4. Add exports to `src/engine/materials/index.ts`

## 📝 Notes

- **Backward Compatibility**: All existing sketches continue to work - the engine is purely additive
- **Portable**: The `src/engine/` folder can be copied to other projects
- **TSL-First**: Everything is built using Three.js Shading Language (TSL)
- **WebGPU-First**: Primary target is WebGPU, with WebGL compatibility where feasible

## 🔗 Resources

### Available for Reference
- **Three.js r181 Examples**: 186 WebGPU examples in `.RESOURCES/three.js-r181/examples/`
- **TSL Projects**: 30+ example projects in `.RESOURCES/REPOSITORIES/TSLwebgpuExamples/`
- **Portfolio Examples**: Production implementations in `.RESOURCES/REPOSITORIES/portfolio examples/`

See `_RESEARCH/Resource_Catalog.md` for complete resource inventory.

## 🚀 Next Steps

1. **Try the demo sketches** - Navigate to `/sketches/engine/materials/phi_metal`
2. **Create your own material** - Follow the patterns in `basicLambert.ts`
3. **Experiment with presets** - Try different metal types and colors
4. **Wait for Phase 2** - Post-FX and fields coming soon!

---

**Version**: 1.0.0 (Phase 1 Complete)  
**Last Updated**: November 18, 2025  
**License**: MIT (or match project license)

