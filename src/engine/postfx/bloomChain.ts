import { Fn, Node, float, vec3, vec4, mix, smoothstep } from 'three/tsl'
import { PostFXChain, PostFXPass } from '../core/engineTypes'

/**
 * Parameters for Bloom post-processing effect.
 */
export interface BloomParams {
  /** Luminance threshold (0-1). Only pixels brighter than this will bloom. Default: 0.8 */
  threshold?: number
  /** Bloom intensity multiplier. Default: 1.0 */
  intensity?: number
  /** Blur radius (affects bloom spread). Default: 1.0 */
  radius?: number
  /** Smooth threshold transition. Default: 0.1 */
  smoothThreshold?: number
}

/**
 * Creates a Bloom post-processing chain.
 * 
 * Bloom makes bright areas glow and bleed into surrounding pixels.
 * This is a simplified bloom implementation using threshold extraction
 * and additive blending.
 * 
 * **How It Works:**
 * 1. **Threshold Pass**: Extract pixels brighter than threshold
 * 2. **Blur Pass**: Blur the bright pixels (simulated here)
 * 3. **Composite Pass**: Add blurred bloom back to original image
 * 
 * **Use Cases:**
 * - HDR lighting effects
 * - Emissive materials (glowing objects)
 * - Light sources (sun, lamps, LEDs)
 * - Sci-fi energy effects
 * - Magical/ethereal atmospheres
 * 
 * @param params - Bloom parameters
 * @returns PostFX chain with bloom effect
 * 
 * @example
 * ```typescript
 * // Subtle bloom for HDR lighting
 * const subtle = createBloomChain({
 *   threshold: 0.9,
 *   intensity: 0.8,
 *   radius: 1.0
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Intense bloom for emissive objects
 * const intense = createBloomChain({
 *   threshold: 0.6,
 *   intensity: 2.0,
 *   radius: 1.5
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Soft glow for magical effects
 * const magical = createBloomChain({
 *   threshold: 0.7,
 *   intensity: 1.5,
 *   radius: 2.0,
 *   smoothThreshold: 0.3
 * })
 * ```
 */
export const createBloomChain = (params: BloomParams = {}): PostFXChain => {
  const {
    threshold = 0.8,
    intensity = 1.0,
    radius = 1.0,
    smoothThreshold = 0.1,
  } = params

  // Pass 1: Threshold extraction
  const thresholdPass: PostFXPass = {
    name: 'bloom-threshold',
    process: (input: Node) => {
      return Fn(() => {
        const color = vec3(input)
        
        // Calculate luminance (perceived brightness)
        const luminance = color.dot(vec3(0.2126, 0.7152, 0.0722))
        
        // Smooth threshold transition
        const threshMin = float(threshold).sub(smoothThreshold)
        const threshMax = float(threshold).add(smoothThreshold)
        const bloomMask = smoothstep(threshMin, threshMax, luminance)
        
        // Extract bright pixels
        const brightColor = color.mul(bloomMask)
        
        return vec4(brightColor, 1.0)
      })()
    },
  }

  // Pass 2: Blur (simplified - using softening/expansion)
  const blurPass: PostFXPass = {
    name: 'bloom-blur',
    process: (input: Node) => {
      return Fn(() => {
        const color = vec3(input)
        
        // Simplified blur: expand bright areas
        // In a full implementation, this would be a gaussian blur
        const blurred = color.mul(float(radius))
        
        return vec4(blurred, 1.0)
      })()
    },
  }

  // Pass 3: Composite (add bloom to original)
  const compositePass: PostFXPass = {
    name: 'bloom-composite',
    process: (input: Node) => {
      return Fn(() => {
        // Note: In a full implementation, we'd combine original + bloom
        // For now, this is the bloom contribution that will be added
        const bloom = vec3(input).mul(float(intensity))
        
        return vec4(bloom, 1.0)
      })()
    },
  }

  // Compose all passes
  const compose = (input: Node): Node => {
    return Fn(() => {
      const original = vec3(input)
      
      // Apply threshold to extract bright areas
      const color = vec3(input)
      const luminance = color.dot(vec3(0.2126, 0.7152, 0.0722))
      const threshMin = float(threshold).sub(smoothThreshold)
      const threshMax = float(threshold).add(smoothThreshold)
      const bloomMask = smoothstep(threshMin, threshMax, luminance)
      const brightColor = color.mul(bloomMask)
      
      // Apply blur (simplified - just expand)
      const bloom = brightColor.mul(float(radius)).mul(float(intensity))
      
      // Composite: add bloom to original
      const final = original.add(bloom)
      
      return final
    })()
  }

  return {
    passes: [thresholdPass, blurPass, compositePass],
    compose,
  }
}

/**
 * Preset bloom configurations for common scenarios.
 */
export const bloomPresets = {
  /** Subtle HDR bloom */
  subtle: (): PostFXChain =>
    createBloomChain({
      threshold: 0.9,
      intensity: 0.8,
      radius: 1.0,
    }),

  /** Standard bloom for most scenes */
  standard: (): PostFXChain =>
    createBloomChain({
      threshold: 0.8,
      intensity: 1.0,
      radius: 1.0,
    }),

  /** Intense bloom for emissive objects */
  intense: (): PostFXChain =>
    createBloomChain({
      threshold: 0.6,
      intensity: 2.0,
      radius: 1.5,
    }),

  /** Soft dreamy glow */
  dreamy: (): PostFXChain =>
    createBloomChain({
      threshold: 0.7,
      intensity: 1.5,
      radius: 2.0,
      smoothThreshold: 0.3,
    }),

  /** Sharp highlights only */
  highlights: (): PostFXChain =>
    createBloomChain({
      threshold: 0.95,
      intensity: 1.2,
      radius: 0.5,
      smoothThreshold: 0.05,
    }),
}

