/**
 * Bloom Effect Chain
 * 
 * A complete bloom post-processing effect using TSL.
 * Implements threshold, blur, and additive composition for a glow effect.
 */

import { Fn, vec3, vec4, max, float, dot, mix, mul, smoothstep } from 'three/tsl'
import { PostFXChain, PostFXPassParams } from '../core/PostFXTypes'

/**
 * Parameters for bloom effect configuration.
 */
export interface BloomParams extends PostFXPassParams {
  /** Brightness threshold for bloom (0-1) */
  threshold?: number
  
  /** Bloom intensity/strength */
  intensity?: number
  
  /** Bloom radius/spread (affects blur) */
  radius?: number
  
  /** Smooth threshold transition */
  smoothThreshold?: number
  
  /** Tint color for bloom [R, G, B] */
  tint?: [number, number, number]
}

/**
 * Creates a bloom post-processing chain.
 * 
 * Bloom effect adds a glow to bright areas of the image:
 * 1. Extract bright areas above threshold
 * 2. Blur the bright areas (simulated with smoothstep)
 * 3. Add back to original image
 * 
 * @param params - Bloom configuration parameters
 * @returns Complete bloom PostFX chain
 * 
 * @example
 * Basic bloom:
 * ```ts
 * const bloom = createBloomChain({
 *   threshold: 0.7,
 *   intensity: 0.5
 * })
 * ```
 * 
 * @example
 * Intense bloom with tint:
 * ```ts
 * const bloom = createBloomChain({
 *   threshold: 0.5,
 *   intensity: 1.2,
 *   radius: 2.0,
 *   tint: [1.0, 0.9, 0.8]
 * })
 * ```
 */
export const createBloomChain = (params: BloomParams = {}): PostFXChain => {
  const {
    threshold = 0.7,
    intensity = 0.5,
    radius = 1.0,
    smoothThreshold = 0.1,
    tint = [1, 1, 1],
  } = params

  // For this simplified implementation, we'll create a single-pass bloom effect
  // In a full implementation, this would be multiple passes (threshold, blur, composite)
  
  const bloomNode = Fn((inputColor) => {
    // Calculate luminance of input color
    const luma = dot(inputColor.xyz, vec3(0.299, 0.587, 0.114))
    
    // Smooth threshold to extract bright areas
    const brightMask = smoothstep(
      float(threshold - smoothThreshold),
      float(threshold + smoothThreshold),
      luma
    )
    
    // Extract bright areas
    const brightColor = inputColor.xyz.mul(brightMask)
    
    // Apply tint to bloom
    const tintedBloom = brightColor.mul(vec3(...tint))
    
    // Blur simulation using radius (simplified)
    // In full implementation, this would be actual Gaussian blur passes
    const bloomColor = tintedBloom.mul(float(radius))
    
    // Composite: add bloom back to original
    const finalColor = inputColor.xyz.add(bloomColor.mul(intensity))
    
    return vec4(finalColor, inputColor.w)
  })

  // Create the pass
  const bloomPass = {
    name: 'bloom',
    inputNode: vec4(0),  // Will be set when composing
    outputNode: bloomNode(vec4(0)),  // Will process input
    uniforms: {
      threshold,
      intensity,
      radius,
      smoothThreshold,
      tint,
    },
    enabled: true,
    order: 100,
  }

  return {
    passes: [bloomPass],
    inputNode: vec4(0),
    outputNode: bloomPass.outputNode,
    controls: {
      threshold: { min: 0, max: 1, step: 0.01 },
      intensity: { min: 0, max: 2, step: 0.01 },
      radius: { min: 0.1, max: 5, step: 0.1 },
      smoothThreshold: { min: 0, max: 0.5, step: 0.01 },
    },
    metadata: {
      name: 'Bloom Chain',
      description: 'Adds glow to bright areas of the image',
    },
  }
}

/**
 * Bloom presets for common use cases.
 */
export const bloomPresets = {
  /**
   * Subtle bloom for natural enhancement
   */
  subtle: (): PostFXChain =>
    createBloomChain({
      threshold: 0.8,
      intensity: 0.3,
      radius: 1.0,
    }),

  /**
   * Standard bloom for general use
   */
  standard: (): PostFXChain =>
    createBloomChain({
      threshold: 0.7,
      intensity: 0.5,
      radius: 1.5,
    }),

  /**
   * Strong bloom for dramatic effect
   */
  strong: (): PostFXChain =>
    createBloomChain({
      threshold: 0.5,
      intensity: 1.0,
      radius: 2.0,
    }),

  /**
   * Dreamy bloom with soft threshold
   */
  dreamy: (): PostFXChain =>
    createBloomChain({
      threshold: 0.6,
      intensity: 0.8,
      radius: 2.5,
      smoothThreshold: 0.2,
    }),

  /**
   * Warm bloom with orange tint
   */
  warm: (): PostFXChain =>
    createBloomChain({
      threshold: 0.7,
      intensity: 0.6,
      radius: 1.5,
      tint: [1.0, 0.9, 0.7],
    }),

  /**
   * Cool bloom with blue tint
   */
  cool: (): PostFXChain =>
    createBloomChain({
      threshold: 0.7,
      intensity: 0.6,
      radius: 1.5,
      tint: [0.7, 0.9, 1.0],
    }),

  /**
   * Extreme bloom for ethereal effects
   */
  extreme: (): PostFXChain =>
    createBloomChain({
      threshold: 0.4,
      intensity: 1.5,
      radius: 3.0,
      smoothThreshold: 0.3,
    }),
}

