/**
 * TSL-WebGPU Engine
 * 
 * Main entry point for the engine.
 * Re-exports all engine modules for convenient importing.
 * 
 * @example
 * ```ts
 * import { createPhiMetal, createEngineSketch, bloomPresets } from '@/engine'
 * 
 * const sketch = Fn(() =>
 *   createEngineSketch({
 *     material: createPhiMetal({ metalness: 0.9 }),
 *     postfx: bloomPresets.standard()
 *   })
 * )
 * ```
 */

// Core functionality
export * from './core'

// Materials
export * from './materials'

// Post-processing
export * from './postfx'

// Fields (vector fields, SDF primitives)
export * from './fields'

// Note: Particles and presets will be added in future phases
// export * from './particles'
// export * from './presets'
