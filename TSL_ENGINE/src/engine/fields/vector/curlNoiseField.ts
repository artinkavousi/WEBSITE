/**
 * Curl Noise Vector Field
 * 
 * Creates a divergence-free 3D vector field using curl of noise.
 * Perfect for fluid-like motion and natural-looking flow patterns.
 */

import { Fn, vec3, mul, float } from 'three/tsl'
import { VectorField, FieldParams } from '../../core/engineTypes'
import { curlNoise3d } from '@/tsl/noise/curl_noise_3d'

/**
 * Parameters for curl noise field.
 */
export interface CurlNoiseFieldParams extends FieldParams {
  /** Field scale/frequency */
  scale?: number
  
  /** Animation speed */
  speed?: number
  
  /** Field strength multiplier */
  strength?: number
  
  /** Time offset for animation */
  timeOffset?: number
}

/**
 * Creates a curl noise vector field.
 * 
 * Curl noise produces smooth, swirling vector fields that are:
 * - Divergence-free (no sources or sinks)
 * - Naturally flowing
 * - Perfect for particles and distortions
 * 
 * @param params - Field configuration
 * @returns Vector field
 * 
 * @example
 * Basic curl field:
 * ```ts
 * const field = createCurlNoiseField({
 *   scale: 2.0,
 *   strength: 1.0
 * })
 * 
 * // Sample at a position
 * const velocity = field.sampleAt(x, y, z)
 * ```
 * 
 * @example
 * Animated curl field:
 * ```ts
 * const field = createCurlNoiseField({
 *   scale: 1.5,
 *   speed: 0.5,
 *   strength: 2.0
 * })
 * ```
 */
export const createCurlNoiseField = (
  params: CurlNoiseFieldParams = {}
): VectorField => {
  const {
    scale = 1.0,
    speed = 0.0,
    strength = 1.0,
    timeOffset = 0.0,
  } = params

  const sampleAt = Fn((x, y, z) => {
    // Create position vector
    const pos = vec3(x, y, z).mul(scale)
    
    // Sample curl noise (from existing TSL utilities)
    const curl = curlNoise3d(pos)
    
    // Apply strength
    return curl.mul(strength)
  })

  return {
    sampleAt,
    scale,
    octaves: 1,
    frequency: scale,
    metadata: {
      name: 'Curl Noise Field',
      type: 'curl',
    },
  }
}

/**
 * Curl noise field presets.
 */
export const curlNoiseFieldPresets = {
  /**
   * Gentle flowing field
   */
  gentle: (): VectorField =>
    createCurlNoiseField({
      scale: 0.8,
      strength: 0.5,
    }),

  /**
   * Standard turbulent field
   */
  turbulent: (): VectorField =>
    createCurlNoiseField({
      scale: 1.5,
      strength: 1.0,
    }),

  /**
   * Strong chaotic field
   */
  chaotic: (): VectorField =>
    createCurlNoiseField({
      scale: 2.5,
      strength: 2.0,
    }),

  /**
   * Fine detail field
   */
  detailed: (): VectorField =>
    createCurlNoiseField({
      scale: 4.0,
      strength: 0.8,
    }),

  /**
   * Slow drifting field
   */
  drifting: (): VectorField =>
    createCurlNoiseField({
      scale: 0.5,
      speed: 0.1,
      strength: 0.3,
    }),
}

