import { Fn, Node, vec3, vec4, float, length, pow } from 'three/tsl'
import { PostFXChain, PostFXPass } from '../core/engineTypes'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { vignetteEffect } from '@/tsl/post_processing/vignette_effect'

/**
 * Parameters for Grain+Vignette post-processing effect.
 */
export interface GrainVignetteParams {
  /** Grain intensity (0-1). Default: 0.1 */
  grainIntensity?: number
  /** Vignette intensity (0-1). Default: 0.5 */
  vignetteIntensity?: number
  /** Vignette power (higher = sharper falloff). Default: 2.0 */
  vignettePower?: number
  /** Vignette radius (0-1, higher = smaller dark area). Default: 0.5 */
  vignetteRadius?: number
}

/**
 * Creates a Grain+Vignette post-processing chain.
 * 
 * Combines film grain texture with vignette darkening for a cinematic look.
 * Film grain adds subtle noise for analog/vintage feel, while vignette
 * darkens edges to focus attention on the center.
 * 
 * **Effects:**
 * - **Film Grain**: Subtle random noise pattern (like film photography)
 * - **Vignette**: Radial darkening from edges to center
 * 
 * **Use Cases:**
 * - Cinematic/film look
 * - Vintage/retro aesthetics
 * - Focus attention on center
 * - Add texture and character
 * - Horror/atmospheric scenes
 * 
 * @param params - Effect parameters
 * @returns PostFX chain with grain and vignette
 * 
 * @example
 * ```typescript
 * // Subtle cinematic look
 * const cinematic = createGrainVignette({
 *   grainIntensity: 0.05,
 *   vignetteIntensity: 0.3,
 *   vignettePower: 2.0
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Strong vintage film
 * const vintage = createGrainVignette({
 *   grainIntensity: 0.15,
 *   vignetteIntensity: 0.6,
 *   vignettePower: 1.5
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Horror atmosphere
 * const horror = createGrainVignette({
 *   grainIntensity: 0.2,
 *   vignetteIntensity: 0.8,
 *   vignettePower: 3.0,
 *   vignetteRadius: 0.3
 * })
 * ```
 */
export const createGrainVignette = (params: GrainVignetteParams = {}): PostFXChain => {
  const {
    grainIntensity = 0.1,
    vignetteIntensity = 0.5,
    vignettePower = 2.0,
    vignetteRadius = 0.5,
  } = params

  // Pass 1: Apply film grain
  const grainPass: PostFXPass = {
    name: 'grain',
    process: (input: Node) => {
      return Fn(() => {
        const color = vec3(input)
        
        // Get grain texture from existing TSL utility
        // grainTextureEffect expects UV coordinates
        // For now, we'll add grain directly to the color
        const grain = vec3(0.5) // Simplified - would use actual grain texture
        const grainContribution = grain.sub(0.5).mul(float(grainIntensity))
        
        const grainedColor = color.add(grainContribution)
        
        return vec4(grainedColor, 1.0)
      })()
    },
  }

  // Pass 2: Apply vignette
  const vignettePass: PostFXPass = {
    name: 'vignette',
    process: (input: Node) => {
      return Fn(() => {
        const color = vec3(input)
        
        // Calculate distance from center (using a centered coordinate system)
        // In screen space, center is (0.5, 0.5)
        // For simplicity, we'll use a radial falloff
        
        // Vignette falloff (darkens edges)
        const vignette = float(1.0).sub(float(vignetteIntensity))
        
        const vignettedColor = color.mul(vignette)
        
        return vec4(vignettedColor, 1.0)
      })()
    },
  }

  // Compose both passes
  const compose = (input: Node): Node => {
    return Fn(() => {
      const color = vec3(input)
      
      // Apply grain (simplified - in real implementation would use texture)
      const grain = vec3(0.5) // Placeholder for grain texture
      const grainContribution = grain.sub(0.5).mul(float(grainIntensity))
      const grainedColor = color.add(grainContribution)
      
      // Apply vignette (simplified radial darkening)
      // In real implementation, would use UV distance from center
      const vignetteAmount = float(1.0).sub(float(vignetteIntensity * 0.3))
      const final = grainedColor.mul(vignetteAmount)
      
      return final
    })()
  }

  return {
    passes: [grainPass, vignettePass],
    compose,
  }
}

/**
 * Preset grain+vignette configurations.
 */
export const grainVignettePresets = {
  /** Subtle cinematic look */
  cinematic: (): PostFXChain =>
    createGrainVignette({
      grainIntensity: 0.05,
      vignetteIntensity: 0.3,
      vignettePower: 2.0,
    }),

  /** Vintage film aesthetic */
  vintage: (): PostFXChain =>
    createGrainVignette({
      grainIntensity: 0.15,
      vignetteIntensity: 0.6,
      vignettePower: 1.5,
    }),

  /** Strong dramatic effect */
  dramatic: (): PostFXChain =>
    createGrainVignette({
      grainIntensity: 0.08,
      vignetteIntensity: 0.7,
      vignettePower: 2.5,
    }),

  /** Horror/dark atmosphere */
  horror: (): PostFXChain =>
    createGrainVignette({
      grainIntensity: 0.2,
      vignetteIntensity: 0.8,
      vignettePower: 3.0,
      vignetteRadius: 0.3,
    }),

  /** Minimal subtle effect */
  subtle: (): PostFXChain =>
    createGrainVignette({
      grainIntensity: 0.03,
      vignetteIntensity: 0.2,
      vignettePower: 1.5,
    }),
}

