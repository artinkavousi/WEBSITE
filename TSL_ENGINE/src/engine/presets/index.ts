/**
 * Presets Module
 * 
 * Pre-configured combinations and quick-start presets.
 */

// Complete scene presets
export * from './completeScenes'

// Re-export individual system presets for convenience
export {
  lambertPresets,
  phiMetalPresets,
} from '../materials'

export {
  bloomPresets,
  grainVignettePresets,
  chromaticAberrationPresets,
} from '../postfx'

export {
  curlNoiseFieldPresets,
  sdfPrimitivePresets,
} from '../fields'

export {
  attractorParticlesPresets,
  flowFieldParticlesPresets,
} from '../particles'

