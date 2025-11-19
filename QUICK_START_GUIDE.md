# Quick Start Guide — Engine Implementation

**Goal:** Get from current state to working engine core in 1 week  
**Audience:** Developers ready to implement  
**Last Updated:** November 19, 2025

---

## 🎯 Week 1 Mission: Core + 2 Materials

By end of week 1, you will have:
- ✅ Three.js r181 working
- ✅ Core engine types implemented
- ✅ 2 working materials with demos
- ✅ Foundation for all future modules

---

## Day 1: Upgrade & Setup (2-3 hours)

### Step 1: Upgrade Three.js (30 min)

```bash
# Navigate to project
cd tsl_webgpu_engine

# Upgrade Three.js and related packages
pnpm add three@^0.181.0
pnpm add @react-three/fiber@latest
pnpm add @react-three/drei@latest

# Install/verify all dependencies
pnpm install
```

### Step 2: Test Existing Sketches (15 min)

```bash
# Start dev server
pnpm dev

# Test in browser:
# http://localhost:5173/sketches/flare-1
# http://localhost:5173/sketches/nested/dawn-1

# Both should work without errors
# Check browser console for errors
```

### Step 3: Create INVENTORY Structure (10 min)

```bash
# Create resource inventory directories
mkdir -p INVENTORY/threejs_examples/{compute,particles,materials,postprocessing}
mkdir -p INVENTORY/portfolio_patterns
mkdir -p INVENTORY/tsl_projects
mkdir -p INVENTORY/extracted_modules
mkdir -p INVENTORY/docs
```

### Step 4: Extract Key Three.js Examples (1-2 hours)

```bash
# Copy compute shader examples
cp .RESOURCES/three.js-r181/examples/webgpu_compute*.html INVENTORY/threejs_examples/compute/
cp .RESOURCES/three.js-r181/examples/webgpu_compute*.js INVENTORY/threejs_examples/compute/

# Copy particle examples
cp .RESOURCES/three.js-r181/examples/webgpu_particles*.html INVENTORY/threejs_examples/particles/
cp .RESOURCES/three.js-r181/examples/webgpu_particles*.js INVENTORY/threejs_examples/particles/

# Copy material examples
cp .RESOURCES/three.js-r181/examples/webgpu_materials*.html INVENTORY/threejs_examples/materials/
cp .RESOURCES/three.js-r181/examples/webgpu_materials*.js INVENTORY/threejs_examples/materials/

# Copy postprocessing examples
cp .RESOURCES/three.js-r181/examples/webgpu_postprocessing*.html INVENTORY/threejs_examples/postprocessing/
cp .RESOURCES/three.js-r181/examples/webgpu_postprocessing*.js INVENTORY/threejs_examples/postprocessing/
```

✅ **Day 1 Complete Check:**
- Three.js r181 installed
- Existing sketches still work
- INVENTORY structure created
- Key examples extracted

---

## Day 2: Core Types (3-4 hours)

### Step 1: Implement Engine Types (2 hours)

Open `src/engine/core/engineTypes.ts` and implement:

```typescript
import { Node, Material } from 'three/tsl'

// ===== MATERIAL SYSTEM =====

export interface MaterialNodeConfig {
  colorNode: Node
  roughnessNode?: Node
  metalnessNode?: Node
  normalNode?: Node
  emissiveNode?: Node
  opacityNode?: Node
  aoNode?: Node
  uniforms?: Record<string, any>
}

export interface MaterialParams {
  [key: string]: any
}

// ===== POSTFX SYSTEM =====

export interface PostFXPass {
  name: string
  process: (input: Node) => Node
  uniforms?: Record<string, any>
  enabled?: boolean
}

export interface PostFXChain {
  passes: PostFXPass[]
  compose: (input: Node) => Node
}

// ===== FIELD SYSTEM =====

export interface VectorField {
  sampleAt: (p: Node) => Node
  scale?: number
  octaves?: number
}

export interface SDFPrimitive {
  distance: (p: Node) => Node
  params: Record<string, any>
}

// ===== PARTICLE SYSTEM =====

export interface ParticleSystemConfig {
  count: number
  computeInit: (index: Node) => Node
  computeUpdate: (position: Node, velocity: Node, index: Node) => {
    position: Node
    velocity: Node
  }
  renderMaterial: Material
  instanceAttributes?: Record<string, any>
}

// ===== ENGINE SKETCH =====

export interface EngineSketchConfig {
  material?: MaterialNodeConfig
  postfx?: PostFXChain
  fields?: VectorField[]
  particles?: ParticleSystemConfig
  background?: Node
}
```

### Step 2: Implement Engine Config (1 hour)

Open `src/engine/core/engineConfig.ts`:

```typescript
export interface EngineConfig {
  renderer: {
    preferWebGPU: boolean
    enableCompute: boolean
    antialias: boolean
    powerPreference: 'high-performance' | 'low-power' | 'default'
  }
  particles: {
    maxCount: number
    defaultWorkgroupSize: number
  }
  postfx: {
    enabled: boolean
    quality: 'low' | 'medium' | 'high'
  }
  debug: {
    showStats: boolean
    logPerformance: boolean
  }
}

export const defaultEngineConfig: EngineConfig = {
  renderer: {
    preferWebGPU: true,
    enableCompute: true,
    antialias: true,
    powerPreference: 'high-performance',
  },
  particles: {
    maxCount: 1000000,
    defaultWorkgroupSize: 64,
  },
  postfx: {
    enabled: true,
    quality: 'high',
  },
  debug: {
    showStats: false,
    logPerformance: false,
  },
}

let engineConfig = { ...defaultEngineConfig }

export const getEngineConfig = (): EngineConfig => engineConfig

export const setEngineConfig = (config: Partial<EngineConfig>): void => {
  engineConfig = { ...engineConfig, ...config }
}

export const resetEngineConfig = (): void => {
  engineConfig = { ...defaultEngineConfig }
}
```

### Step 3: Implement Sketch Composer (1 hour)

Open `src/engine/core/createEngineSketch.ts`:

```typescript
import { Fn, Node, vec3 } from 'three/tsl'
import { EngineSketchConfig } from './engineTypes'

/**
 * Creates an engine-aware sketch from a configuration.
 * Composes material, postfx, and background into a final shader node.
 * 
 * @param config - Engine sketch configuration
 * @returns A TSL Node (for use as colorNode)
 * 
 * @example
 * ```typescript
 * const sketch = Fn(() => createEngineSketch({
 *   material: createBasicLambert({ baseColor: [1, 0.5, 0.2] }),
 *   background: vec3(0.1)
 * }))
 * ```
 */
export const createEngineSketch = (config: EngineSketchConfig): Node => {
  const { material, postfx, background } = config

  return Fn(() => {
    // Start with background or default black
    let finalColor = background || vec3(0)

    // Apply material if provided
    if (material?.colorNode) {
      finalColor = material.colorNode
    }

    // Apply postfx chain if provided
    if (postfx) {
      finalColor = postfx.compose(finalColor)
    }

    return finalColor
  })()
}
```

✅ **Day 2 Complete Check:**
- `engineTypes.ts` has all interfaces
- `engineConfig.ts` has config system
- `createEngineSketch.ts` has composition logic
- No TypeScript errors

---

## Day 3: First Material - Basic Lambert (3-4 hours)

### Step 1: Implement Material (2 hours)

Open `src/engine/materials/basicLambert.ts`:

```typescript
import { Fn, color, normalWorld, vec3, float } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '../core/engineTypes'

/**
 * Parameters for Basic Lambert material.
 */
export interface BasicLambertParams extends MaterialParams {
  /** Base color [R, G, B] (0-1 range) */
  baseColor?: [number, number, number]
  /** Ambient light intensity (0-1) */
  ambient?: number
  /** Diffuse light intensity (0-1) */
  diffuseIntensity?: number
  /** Light direction [X, Y, Z] (normalized) */
  lightDirection?: [number, number, number]
}

/**
 * Creates a basic Lambert (diffuse) material.
 * Simple lighting model with ambient + directional light.
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * ```typescript
 * const material = createBasicLambert({
 *   baseColor: [0.8, 0.4, 0.2],
 *   ambient: 0.2,
 *   diffuseIntensity: 0.8
 * })
 * ```
 */
export const createBasicLambert = (
  params: BasicLambertParams = {}
): MaterialNodeConfig => {
  const {
    baseColor = [1, 1, 1],
    ambient = 0.1,
    diffuseIntensity = 0.8,
    lightDirection = [1, 1, 1],
  } = params

  const colorNode = Fn(() => {
    // Base color
    const baseCol = color(...baseColor)
    
    // Surface normal (world space)
    const normal = normalWorld
    
    // Light direction (normalized)
    const lightDir = vec3(...lightDirection).normalize()
    
    // Lambert lighting: max(N · L, 0)
    const ndotl = normal.dot(lightDir).max(0).mul(diffuseIntensity)
    
    // Final color = baseColor * (ambient + diffuse)
    const finalColor = baseCol.mul(float(ambient).add(ndotl))
    
    return finalColor
  })()

  return {
    colorNode,
  }
}
```

### Step 2: Create Demo Sketch (1 hour)

Open `src/sketches/engine/materials/basic_lambert.ts`:

```typescript
import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/basicLambert'
import { useControls } from 'leva'

/**
 * Demo sketch for Basic Lambert material.
 * Shows simple diffuse lighting with Leva controls.
 */
const basicLambertDemo = Fn(() => {
  const { baseColorR, baseColorG, baseColorB, ambient, diffuse } = useControls({
    baseColorR: { value: 0.8, min: 0, max: 1, step: 0.01 },
    baseColorG: { value: 0.4, min: 0, max: 1, step: 0.01 },
    baseColorB: { value: 0.2, min: 0, max: 1, step: 0.01 },
    ambient: { value: 0.2, min: 0, max: 1, step: 0.01 },
    diffuse: { value: 0.8, min: 0, max: 1, step: 0.01 },
  })

  return createEngineSketch({
    material: createBasicLambert({
      baseColor: [baseColorR, baseColorG, baseColorB],
      ambient,
      diffuseIntensity: diffuse,
      lightDirection: [1, 1, 1],
    }),
  })
})

export default basicLambertDemo
```

### Step 3: Test in Browser (30 min)

```bash
# Start dev server
pnpm dev

# Navigate to:
# http://localhost:5173/sketches/engine/materials/basic_lambert

# You should see:
# - Sphere with Lambert shading
# - Leva controls to adjust color, ambient, diffuse
# - Changes update in real-time
```

**Troubleshooting:**
- If sketch doesn't appear in dropdown, restart dev server
- If TypeScript errors, check imports
- If shader errors, check browser console

✅ **Day 3 Complete Check:**
- `basicLambert.ts` implemented
- Demo sketch works in browser
- Leva controls functional
- No errors in console

---

## Day 4: Second Material - Phi Metal (3-4 hours)

### Step 1: Implement Material (2 hours)

Open `src/engine/materials/phiMetal.ts`:

```typescript
import { Fn, fresnel, normalWorld, positionWorld, vec3, time } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { MaterialNodeConfig, MaterialParams } from '../core/engineTypes'

/**
 * Parameters for Phi Metal material.
 */
export interface PhiMetalParams extends MaterialParams {
  /** Base metallic color [R, G, B] */
  baseColor?: [number, number, number]
  /** Metalness factor (0-1) */
  metalness?: number
  /** Roughness factor (0-1) */
  roughness?: number
  /** Enable animated noise perturbation */
  animateNoise?: boolean
  /** Noise scale multiplier */
  noiseScale?: number
  /** Noise influence (0-1) */
  noiseInfluence?: number
}

/**
 * Creates a stylized metallic material with Fresnel and noise.
 * Features view-dependent highlights and optional animated surface.
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * ```typescript
 * const material = createPhiMetal({
 *   baseColor: [0.9, 0.7, 0.4],
 *   metalness: 0.95,
 *   roughness: 0.2,
 *   animateNoise: true
 * })
 * ```
 */
export const createPhiMetal = (
  params: PhiMetalParams = {}
): MaterialNodeConfig => {
  const {
    baseColor = [0.8, 0.7, 0.5],
    metalness = 1.0,
    roughness = 0.3,
    animateNoise = true,
    noiseScale = 2.0,
    noiseInfluence = 0.1,
  } = params

  const colorNode = Fn(() => {
    // Base metallic color
    const baseCol = vec3(...baseColor)
    
    // World position for noise
    const pos = positionWorld.mul(noiseScale)
    
    // Animated time offset (if enabled)
    const t = animateNoise ? time.mul(0.1) : 0
    
    // Simplex noise for surface perturbation
    const noise = simplexNoise3d(pos.add(vec3(0, 0, t)))
    
    // Fresnel effect (view-dependent rim light)
    const f = fresnel()
    
    // Combine: base * fresnel + noise
    const metallic = baseCol.mul(f.add(0.2)).add(noise.mul(noiseInfluence))
    
    return metallic
  })()

  return {
    colorNode,
    metalnessNode: Fn(() => metalness)(),
    roughnessNode: Fn(() => roughness)(),
  }
}
```

### Step 2: Create Demo Sketch (1 hour)

Open `src/sketches/engine/materials/phi_metal.ts`:

```typescript
import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/phiMetal'
import { useControls } from 'leva'

/**
 * Demo sketch for Phi Metal material.
 * Animated metallic surface with Fresnel highlights.
 */
const phiMetalDemo = Fn(() => {
  const controls = useControls({
    baseColorR: { value: 0.9, min: 0, max: 1, step: 0.01 },
    baseColorG: { value: 0.7, min: 0, max: 1, step: 0.01 },
    baseColorB: { value: 0.4, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0.95, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    animateNoise: true,
    noiseScale: { value: 2.0, min: 0.1, max: 10, step: 0.1 },
    noiseInfluence: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
  })

  return createEngineSketch({
    material: createPhiMetal({
      baseColor: [controls.baseColorR, controls.baseColorG, controls.baseColorB],
      metalness: controls.metalness,
      roughness: controls.roughness,
      animateNoise: controls.animateNoise,
      noiseScale: controls.noiseScale,
      noiseInfluence: controls.noiseInfluence,
    }),
  })
})

export default phiMetalDemo
```

### Step 3: Test & Verify (30 min)

```bash
# Navigate to:
# http://localhost:5173/sketches/engine/materials/phi_metal

# You should see:
# - Metallic sphere with Fresnel highlights
# - Animated noise perturbation
# - Responsive Leva controls
# - Smooth 60fps animation
```

✅ **Day 4 Complete Check:**
- `phiMetal.ts` implemented
- Demo sketch works with animation
- All Leva controls functional
- Performance is smooth (60fps)

---

## Day 5-7: Documentation & Testing (Flexible)

### Tasks

1. **Add JSDoc to all files** (2 hours)
   - Document all interfaces
   - Document all functions
   - Add usage examples

2. **Create Engine README** (1 hour)
   - `src/engine/README.md`
   - Overview of architecture
   - Quick start guide
   - Module catalog

3. **Test thoroughly** (1 hour)
   - Test both materials
   - Test all Leva controls
   - Check browser console for errors
   - Verify 60fps performance

4. **Create knowledge base docs** (2-3 hours)
   - `INVENTORY/docs/TSL_PATTERNS.md`
   - Document common TSL patterns
   - Document material creation workflow
   - Notes from Three.js examples

5. **Prepare for Phase 2** (1 hour)
   - Review PostFX examples
   - Plan next 2 materials (PBR, SSS)
   - Update task list

✅ **Week 1 Complete Check:**
- Core types fully implemented
- Engine config working
- 2 materials with working demos
- Documentation started
- Ready for Phase 2

---

## Troubleshooting

### TypeScript Errors

**Error: Cannot find module '@/engine/...'**
```typescript
// Solution: Check tsconfig.json has path alias
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Error: Type 'X' is not assignable to type 'Y'**
```typescript
// Solution: Check Three.js version is r181
// Run: pnpm list three
// Should show: three@0.181.0
```

### Runtime Errors

**Error: Cannot read property of undefined**
```typescript
// Solution: Check all optional params have defaults
export const createMaterial = (params: Params = {}) => {
  const { value = defaultValue } = params  // ✅ Good
  // Not: const { value } = params  // ❌ Bad
}
```

**Error: Shader compilation failed**
```typescript
// Solution: Check TSL node types
// All nodes must return proper Node types
// Use Fn(() => { return node })() for complex logic
```

### Performance Issues

**Low FPS (<30fps)**
- Check shader complexity
- Reduce noise octaves
- Simplify calculations
- Profile with browser DevTools

**Memory leaks**
- Check for unclean cleanup
- Verify materials are disposed
- Check useFrame dependencies

---

## Quick Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm serve                  # Preview build
pnpm lint                   # Lint code

# Navigation
# Base sketches
http://localhost:5173/sketches/flare-1
http://localhost:5173/sketches/nested/dawn-1

# Engine sketches
http://localhost:5173/sketches/engine/materials/basic_lambert
http://localhost:5173/sketches/engine/materials/phi_metal

# Debugging
# Open browser DevTools (F12)
# Check Console tab for errors
# Check Performance tab for profiling
```

---

## Success Checklist

After Week 1, you should have:

- ✅ Three.js r181 working
- ✅ All existing sketches still work
- ✅ INVENTORY structure created
- ✅ Core types implemented (`engineTypes.ts`)
- ✅ Engine config implemented (`engineConfig.ts`)
- ✅ Sketch composer implemented (`createEngineSketch.ts`)
- ✅ Basic Lambert material implemented + demo
- ✅ Phi Metal material implemented + demo
- ✅ All demos have Leva controls
- ✅ 60fps performance
- ✅ Zero TypeScript errors
- ✅ Zero console errors
- ✅ Documentation started

**You are now ready for Phase 2! 🎉**

---

## What's Next?

**Week 2 - Phase 2:**
- Implement PBR material
- Implement SSS material
- Implement Bloom PostFX
- Implement Grain+Vignette PostFX

See `TASKS_TODO.md` for detailed breakdown.

---

**Good luck! Build something amazing! 🚀**

