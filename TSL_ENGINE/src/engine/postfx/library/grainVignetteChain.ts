/**
 * Grain & Vignette Effect Chain
 * 
 * Combines grain texture and vignette effects for a filmic look.
 * Uses existing TSL utilities from the tsl/ folder.
 */

import { Fn, vec3, vec4, uv, mul } from 'three/tsl'
import { PostFXChain, PostFXPassParams } from '../core/PostFXTypes'
import { grainTextureEffect } from '@/tsl/effects/grain_texture_effect'
import { vignetteEffect } from '@/tsl/effects/vignette_effect'

/**
 * Parameters for grain and vignette effect.
 */
export interface GrainVignetteParams extends PostFXPassParams {
  /** Grain intensity (0-1) */
  grainIntensity?: number
  
  /** Vignette intensity (0-1) */
  vignetteIntensity?: number
  
  /** Vignette softness */
  vignetteSoftness?: number
  
  /** Vignette color [R, G, B] */
  vignetteColor?: [number, number, number]
}

/**
 * Creates a grain and vignette post-processing chain.
 * 
 * This effect combines:
 * - Film grain for texture and analog feel
 * - Vignette darkening at edges for focus
 * 
 * Perfect for cinematic and vintage looks.
 * 
 * @param params - Effect configuration
 * @returns PostFX chain
 * 
 * @example
 * Subtle film grain:
 * ```ts
 * const fx = createGrainVignetteChain({
 *   grainIntensity: 0.1,
 *   vignetteIntensity: 0.3
 * })
 * ```
 * 
 * @example
 * Heavy vintage effect:
 * ```ts
 * const fx = createGrainVignetteChain({
 *   grainIntensity: 0.3,
 *   vignetteIntensity: 0.7,
 *   vignetteSoftness: 0.5
 * })
 * ```
 */
export const createGrainVignetteChain = (
  params: GrainVignetteParams = {}
): PostFXChain => {
  const {
    grainIntensity = 0.1,
    vignetteIntensity = 0.5,
    vignetteSoftness = 0.5,
    vignetteColor = [0, 0, 0],
  } = params

  const effectNode = Fn((inputColor) => {
    const _uv = uv()
    
    // Apply grain effect
    const grain = grainTextureEffect(_uv).mul(grainIntensity)
    const colorWithGrain = inputColor.xyz.add(grain)
    
    // Apply vignette effect
    const vignette = vignetteEffect(_uv, vignetteSoftness)
    const vignetteCol = vec3(...vignetteColor)
    
    // Mix with vignette
    const finalColor = colorWithGrain.mul(
      vec3(1).sub(vignetteCol.mul(vignette).mul(vignetteIntensity))
    )
    
    return vec4(finalColor, inputColor.w)
  })

  const pass = {
    name: 'grain-vignette',
    inputNode: vec4(0),
    outputNode: effectNode(vec4(0)),
    uniforms: {
      grainIntensity,
      vignetteIntensity,
      vignetteSoftness,
      vignetteColor,
    },
    enabled: true,
    order: 200,
  }

  return {
    passes: [pass],
    inputNode: vec4(0),
    outputNode: pass.outputNode,
    controls: {
      grainIntensity: { min: 0, max: 0.5, step: 0.01 },
      vignetteIntensity: { min: 0, max: 1, step: 0.01 },
      vignetteSoftness: { min: 0, max: 1, step: 0.01 },
    },
    metadata: {
      name: 'Grain & Vignette',
      description: 'Film grain and edge darkening for cinematic look',
    },
  }
}

/**
 * Grain and vignette presets.
 */
export const grainVignettePresets = {
  /**
   * Minimal grain, subtle vignette
   */
  minimal: (): PostFXChain =>
    createGrainVignetteChain({
      grainIntensity: 0.05,
      vignetteIntensity: 0.2,
      vignetteSoftness: 0.7,
    }),

  /**
   * Standard film look
   */
  film: (): PostFXChain =>
    createGrainVignetteChain({
      grainIntensity: 0.15,
      vignetteIntensity: 0.5,
      vignetteSoftness: 0.5,
    }),

  /**
   * Heavy vintage effect
   */
  vintage: (): PostFXChain =>
    createGrainVignetteChain({
      grainIntensity: 0.25,
      vignetteIntensity: 0.7,
      vignetteSoftness: 0.3,
    }),

  /**
   * Noir style (heavy vignette, light grain)
   */
  noir: (): PostFXChain =>
    createGrainVignetteChain({
      grainIntensity: 0.1,
      vignetteIntensity: 0.8,
      vignetteSoftness: 0.4,
    }),

  /**
   * Dreamy soft vignette
   */
  dreamy: (): PostFXChain =>
    createGrainVignetteChain({
      grainIntensity: 0.08,
      vignetteIntensity: 0.4,
      vignetteSoftness: 0.8,
    }),
}

