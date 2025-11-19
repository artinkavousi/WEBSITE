import { Fn, color, normalWorld, vec3, float } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '../core/engineTypes'

/**
 * Parameters for Basic Lambert material.
 * Simple diffuse lighting model with ambient + directional light.
 */
export interface BasicLambertParams extends MaterialParams {
  /** Base color as RGB array (0-1 range). Default: [1, 1, 1] (white) */
  baseColor?: [number, number, number]
  /** Ambient light intensity (0-1). Default: 0.1 */
  ambient?: number
  /** Diffuse light intensity (0-1). Default: 0.8 */
  diffuseIntensity?: number
  /** Light direction as normalized XYZ array. Default: [1, 1, 1] */
  lightDirection?: [number, number, number]
}

/**
 * Creates a basic Lambert (diffuse) material.
 * 
 * Implements simple Lambertian reflectance with ambient and directional lighting.
 * This is the most basic physically-based shading model, suitable for matte surfaces.
 * 
 * **Lighting Model:**
 * - Ambient: Constant light from all directions
 * - Diffuse: Lambert's cosine law (N · L)
 * - Final: baseColor * (ambient + diffuse * max(N · L, 0))
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * ```typescript
 * // Orange matte surface
 * const material = createBasicLambert({
 *   baseColor: [0.8, 0.4, 0.2],
 *   ambient: 0.2,
 *   diffuseIntensity: 0.8
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Pure white with strong directional light
 * const material = createBasicLambert({
 *   baseColor: [1, 1, 1],
 *   ambient: 0.05,
 *   diffuseIntensity: 1.0,
 *   lightDirection: [0, 1, 0.5] // From above and front
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
    // Base surface color
    const baseCol = color(...baseColor)
    
    // Surface normal (world space, automatically normalized)
    const normal = normalWorld
    
    // Light direction (normalize to ensure correct dot product)
    const lightDir = vec3(...lightDirection).normalize()
    
    // Lambert diffuse: max(N · L, 0)
    // This is the cosine of the angle between normal and light
    const ndotl = normal.dot(lightDir).max(0)
    
    // Scaled diffuse contribution
    const diffuse = ndotl.mul(diffuseIntensity)
    
    // Final color: baseColor * (ambient + diffuse)
    // ambient provides base illumination, diffuse adds directional shading
    const lighting = float(ambient).add(diffuse)
    const finalColor = baseCol.mul(lighting)
    
    return finalColor
  })()

  return {
    colorNode,
  }
}

