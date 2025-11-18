/**
 * Complete Scene Presets
 * 
 * Pre-composed complete scenes combining materials, PostFX, and particles.
 * These are "hero" presets that demonstrate the full power of the engine.
 */

import { EngineSketchConfig } from '../core/engineTypes'
import { phiMetalPresets, lambertPresets } from '../materials'
import { bloomPresets, grainVignettePresets, chromaticAberrationPresets } from '../postfx'
import { attractorParticlesPresets, flowFieldParticlesPresets } from '../particles'

/**
 * Complete scene presets combining multiple engine systems.
 */
export const completeScenePresets = {
  /**
   * Golden Dreams - Warm metallic with dreamy bloom
   */
  goldenDreams: (): EngineSketchConfig => ({
    material: phiMetalPresets.gold(),
    postfx: bloomPresets.warm(),
    metadata: {
      name: 'Golden Dreams',
      description: 'Warm golden metal with dreamy bloom effect',
      tags: ['material', 'postfx', 'bloom', 'warm'],
    },
  }),

  /**
   * Copper Vintage - Vintage copper with film grain
   */
  copperVintage: (): EngineSketchConfig => ({
    material: phiMetalPresets.copper(),
    postfx: grainVignettePresets.vintage(),
    metadata: {
      name: 'Copper Vintage',
      description: 'Vintage copper material with heavy film grain',
      tags: ['material', 'postfx', 'vintage', 'grain'],
    },
  }),

  /**
   * Holographic Glitch - Animated holographic with glitch effect
   */
  holographicGlitch: (): EngineSketchConfig => ({
    material: phiMetalPresets.holographic(),
    postfx: chromaticAberrationPresets.glitchHorizontal(),
    metadata: {
      name: 'Holographic Glitch',
      description: 'Animated holographic material with glitch distortion',
      tags: ['material', 'postfx', 'glitch', 'holographic'],
    },
  }),

  /**
   * Silver Bloom - Clean silver with subtle bloom
   */
  silverBloom: (): EngineSketchConfig => ({
    material: phiMetalPresets.silver(),
    postfx: bloomPresets.subtle(),
    metadata: {
      name: 'Silver Bloom',
      description: 'Clean silver material with subtle bloom highlights',
      tags: ['material', 'postfx', 'bloom', 'silver'],
    },
  }),

  /**
   * Noir Scene - Earth tones with noir vignette
   */
  noirScene: (): EngineSketchConfig => ({
    material: lambertPresets.earthTone(),
    postfx: grainVignettePresets.noir(),
    metadata: {
      name: 'Noir Scene',
      description: 'Film noir aesthetic with heavy vignette',
      tags: ['material', 'postfx', 'noir', 'vignette'],
    },
  }),

  /**
   * Cool Dreams - Cool blue with dreamy effects
   */
  coolDreams: (): EngineSketchConfig => ({
    material: lambertPresets.coolBlue(),
    postfx: bloomPresets.cool(),
    metadata: {
      name: 'Cool Dreams',
      description: 'Cool blue palette with dreamy bloom',
      tags: ['material', 'postfx', 'bloom', 'cool'],
    },
  }),

  /**
   * Extreme Metal - Extreme chromatic aberration on metal
   */
  extremeMetal: (): EngineSketchConfig => ({
    material: phiMetalPresets.titanium(),
    postfx: chromaticAberrationPresets.extreme(),
    metadata: {
      name: 'Extreme Metal',
      description: 'Titanium with extreme chromatic distortion',
      tags: ['material', 'postfx', 'chromatic-aberration', 'extreme'],
    },
  }),

  /**
   * Pastel Dreams - Soft pastel with dreamy bloom
   */
  pastelDreams: (): EngineSketchConfig => ({
    material: lambertPresets.pastelPink(),
    postfx: bloomPresets.dreamy(),
    metadata: {
      name: 'Pastel Dreams',
      description: 'Soft pastel colors with ethereal bloom',
      tags: ['material', 'postfx', 'bloom', 'pastel'],
    },
  }),

  /**
   * Film Brass - Brass with film grain and vintage feel
   */
  filmBrass: (): EngineSketchConfig => ({
    material: phiMetalPresets.brass(),
    postfx: grainVignettePresets.film(),
    metadata: {
      name: 'Film Brass',
      description: 'Cinematic brass with film grain',
      tags: ['material', 'postfx', 'film', 'brass'],
    },
  }),

  /**
   * Iron Glitch - Raw iron with vertical glitch
   */
  ironGlitch: (): EngineSketchConfig => ({
    material: phiMetalPresets.iron(),
    postfx: chromaticAberrationPresets.glitchVertical(),
    metadata: {
      name: 'Iron Glitch',
      description: 'Raw iron with vertical glitch effect',
      tags: ['material', 'postfx', 'glitch', 'iron'],
    },
  }),
}

/**
 * Quick access to all scene presets.
 */
export const scenePresetNames = Object.keys(completeScenePresets) as Array<
  keyof typeof completeScenePresets
>

/**
 * Get a random scene preset.
 */
export const randomScenePreset = (): EngineSketchConfig => {
  const names = scenePresetNames
  const randomName = names[Math.floor(Math.random() * names.length)]
  return completeScenePresets[randomName]()
}

