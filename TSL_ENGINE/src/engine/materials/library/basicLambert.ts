/**
 * Basic Lambert Material
 * 
 * A simple diffuse material with Lambert shading.
 * Good starting point for understanding material creation in the engine.
 */

import { Fn, vec3, normalWorld, dot, max } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '../../core/engineTypes'

/**
 * Parameters for the Basic Lambert material.
 */
export interface BasicLambertParams extends MaterialParams {
  /** Base color of the material [R, G, B] in range 0-1 */
  baseColor?: [number, number, number]
  
  /** Ambient light contribution (0-1) */
  ambient?: number
  
  /** Light direction for simple directional lighting */
  lightDir?: [number, number, number]
  
  /** Light color [R, G, B] */
  lightColor?: [number, number, number]
  
  /** Light intensity multiplier */
  lightIntensity?: number
}

/**
 * Creates a basic Lambert (diffuse) material.
 * 
 * This material implements simple diffuse lighting using the Lambert model:
 * - Diffuse reflection based on surface normal and light direction
 * - Ambient term for base illumination
 * - Simple and performant
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * Basic usage:
 * ```ts
 * const material = createBasicLambert({
 *   baseColor: [0.8, 0.4, 0.2],
 *   ambient: 0.2
 * })
 * ```
 * 
 * @example
 * Custom lighting:
 * ```ts
 * const material = createBasicLambert({
 *   baseColor: [0.5, 0.7, 1.0],
 *   lightDir: [0, 1, 0],
 *   lightColor: [1, 0.9, 0.8],
 *   lightIntensity: 1.5
 * })
 * ```
 */
export const createBasicLambert = (params: BasicLambertParams = {}): MaterialNodeConfig => {
  const {
    baseColor = [0.8, 0.8, 0.8],
    ambient = 0.1,
    lightDir = [1, 1, 1],
    lightColor = [1, 1, 1],
    lightIntensity = 1.0,
  } = params

  const colorNode = Fn(() => {
    // Base material color
    const baseCol = vec3(...baseColor)
    
    // Get surface normal
    const normal = normalWorld
    
    // Normalize light direction
    const light = vec3(...lightDir).normalize()
    
    // Calculate Lambert diffuse term: max(0, N · L)
    const ndotl = max(dot(normal, light), 0.0)
    
    // Apply light color and intensity
    const lightCol = vec3(...lightColor).mul(lightIntensity)
    
    // Combine diffuse and ambient
    const diffuse = baseCol.mul(lightCol).mul(ndotl)
    const ambientTerm = baseCol.mul(ambient)
    
    // Final color = diffuse + ambient
    return diffuse.add(ambientTerm)
  })()

  return {
    colorNode,
    roughnessNode: 1.0, // Fully rough (diffuse)
    metalnessNode: 0.0, // Non-metallic
    metadata: {
      name: 'Basic Lambert',
      description: 'Simple diffuse material with Lambert shading',
      author: 'TSL Engine',
    },
  }
}

/**
 * Pre-configured Lambert material presets.
 */
export const lambertPresets = {
  /**
   * Warm orange material
   */
  warmOrange: (): MaterialNodeConfig =>
    createBasicLambert({
      baseColor: [0.9, 0.5, 0.2],
      ambient: 0.15,
    }),

  /**
   * Cool blue material
   */
  coolBlue: (): MaterialNodeConfig =>
    createBasicLambert({
      baseColor: [0.2, 0.5, 0.9],
      ambient: 0.15,
    }),

  /**
   * Soft white material
   */
  softWhite: (): MaterialNodeConfig =>
    createBasicLambert({
      baseColor: [0.95, 0.95, 0.95],
      ambient: 0.2,
    }),

  /**
   * Earth tone material
   */
  earthTone: (): MaterialNodeConfig =>
    createBasicLambert({
      baseColor: [0.6, 0.4, 0.3],
      ambient: 0.1,
    }),

  /**
   * Pastel pink material
   */
  pastelPink: (): MaterialNodeConfig =>
    createBasicLambert({
      baseColor: [1.0, 0.7, 0.8],
      ambient: 0.25,
    }),
}

