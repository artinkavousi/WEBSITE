/**
 * Chromatic Aberration Effect
 * 
 * Simulates lens chromatic aberration by offsetting color channels.
 * Creates a color fringing effect at edges.
 */

import { Fn, vec2, vec4, uv, mul, length } from 'three/tsl'
import { PostFXChain, PostFXPassParams } from '../core/PostFXTypes'
import { chromaticAberrationEffect } from '@/tsl/post_processing/chromatic_aberration_effect'

/**
 * Parameters for chromatic aberration effect.
 */
export interface ChromaticAberrationParams extends PostFXPassParams {
  /** Aberration amount/strength */
  amount?: number
  
  /** Radial distortion from center */
  radialAmount?: number
  
  /** Direction of aberration [x, y] */
  direction?: [number, number]
}

/**
 * Creates a chromatic aberration post-processing chain.
 * 
 * Chromatic aberration separates RGB channels slightly,
 * creating a color fringing effect often seen in:
 * - Vintage lenses
 * - Glitch effects
 * - Artistic distortion
 * 
 * @param params - Effect configuration
 * @returns PostFX chain
 * 
 * @example
 * Subtle lens aberration:
 * ```ts
 * const fx = createChromaticAberrationChain({
 *   amount: 0.002,
 *   radialAmount: 0.5
 * })
 * ```
 * 
 * @example
 * Strong glitch effect:
 * ```ts
 * const fx = createChromaticAberrationChain({
 *   amount: 0.01,
 *   direction: [1, 0]
 * })
 * ```
 */
export const createChromaticAberrationChain = (
  params: ChromaticAberrationParams = {}
): PostFXChain => {
  const {
    amount = 0.003,
    radialAmount = 0.5,
    direction = [1, 0],
  } = params

  const effectNode = Fn((inputColor) => {
    const _uv = uv()
    
    // Calculate radial factor (stronger at edges)
    const center = vec2(0.5, 0.5)
    const uvOffset = _uv.sub(center)
    const radialFactor = length(uvOffset).mul(radialAmount)
    
    // Apply chromatic aberration effect
    // The effect function from tsl/post_processing expects uv and amount
    const aberratedColor = chromaticAberrationEffect(_uv, amount.mul(1.0 + radialFactor))
    
    return vec4(aberratedColor, inputColor.w)
  })

  const pass = {
    name: 'chromatic-aberration',
    inputNode: vec4(0),
    outputNode: effectNode(vec4(0)),
    uniforms: {
      amount,
      radialAmount,
      direction,
    },
    enabled: true,
    order: 300,
  }

  return {
    passes: [pass],
    inputNode: vec4(0),
    outputNode: pass.outputNode,
    controls: {
      amount: { min: 0, max: 0.02, step: 0.0001 },
      radialAmount: { min: 0, max: 2, step: 0.1 },
    },
    metadata: {
      name: 'Chromatic Aberration',
      description: 'RGB channel separation for lens distortion effect',
    },
  }
}

/**
 * Chromatic aberration presets.
 */
export const chromaticAberrationPresets = {
  /**
   * Very subtle lens effect
   */
  subtle: (): PostFXChain =>
    createChromaticAberrationChain({
      amount: 0.001,
      radialAmount: 0.3,
    }),

  /**
   * Standard lens aberration
   */
  standard: (): PostFXChain =>
    createChromaticAberrationChain({
      amount: 0.003,
      radialAmount: 0.5,
    }),

  /**
   * Strong vintage lens
   */
  vintage: (): PostFXChain =>
    createChromaticAberrationChain({
      amount: 0.005,
      radialAmount: 0.8,
    }),

  /**
   * Glitch style (horizontal)
   */
  glitchHorizontal: (): PostFXChain =>
    createChromaticAberrationChain({
      amount: 0.008,
      radialAmount: 0.1,
      direction: [1, 0],
    }),

  /**
   * Glitch style (vertical)
   */
  glitchVertical: (): PostFXChain =>
    createChromaticAberrationChain({
      amount: 0.008,
      radialAmount: 0.1,
      direction: [0, 1],
    }),

  /**
   * Extreme effect
   */
  extreme: (): PostFXChain =>
    createChromaticAberrationChain({
      amount: 0.015,
      radialAmount: 1.5,
    }),
}

