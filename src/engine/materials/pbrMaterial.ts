import { Fn, color, normalWorld, positionWorld, vec3, float, mix, pow } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '../core/engineTypes'

/**
 * Parameters for PBR (Physically-Based Rendering) material.
 * Uses metallic/roughness workflow.
 */
export interface PBRMaterialParams extends MaterialParams {
  /** Base color (albedo) as RGB array (0-1). Default: [0.8, 0.8, 0.8] (light gray) */
  baseColor?: [number, number, number]
  /** Metalness factor (0 = dielectric, 1 = metal). Default: 0.0 */
  metalness?: number
  /** Roughness factor (0 = smooth/glossy, 1 = rough/matte). Default: 0.5 */
  roughness?: number
  /** Ambient occlusion intensity (0-1). Default: 1.0 (no occlusion) */
  ao?: number
  /** Emissive color as RGB array. Default: [0, 0, 0] (no emission) */
  emissive?: [number, number, number]
  /** Emissive intensity. Default: 0.0 */
  emissiveIntensity?: number
}

/**
 * Creates a PBR (Physically-Based Rendering) material.
 * 
 * Implements the metallic/roughness workflow with proper energy conservation.
 * This is the industry-standard material model used in modern real-time rendering.
 * 
 * **PBR Principles:**
 * - **Energy Conservation**: Light reflected + absorbed = 1
 * - **Metallic Workflow**: Metals have colored reflections, dielectrics have white
 * - **Roughness**: Controls micro-facet distribution (smooth vs rough surface)
 * - **Fresnel Effect**: View-dependent reflection (built into Three.js PBR)
 * 
 * **Material Types:**
 * - **Dielectric** (metalness = 0): Plastic, wood, stone, skin
 * - **Metal** (metalness = 1): Gold, silver, copper, iron
 * - **Hybrid** (metalness 0-1): Painted metals, rusted surfaces
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * ```typescript
 * // Smooth plastic (dielectric)
 * const plastic = createPBRMaterial({
 *   baseColor: [0.8, 0.2, 0.2],
 *   metalness: 0.0,
 *   roughness: 0.3
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Brushed metal
 * const metal = createPBRMaterial({
 *   baseColor: [0.9, 0.9, 0.95],
 *   metalness: 1.0,
 *   roughness: 0.4
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Gold with slight roughness
 * const gold = createPBRMaterial({
 *   baseColor: [1.0, 0.766, 0.336],
 *   metalness: 1.0,
 *   roughness: 0.2
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Emissive sci-fi material
 * const sciFi = createPBRMaterial({
 *   baseColor: [0.1, 0.1, 0.15],
 *   metalness: 0.8,
 *   roughness: 0.3,
 *   emissive: [0.0, 0.5, 1.0],
 *   emissiveIntensity: 2.0
 * })
 * ```
 */
export const createPBRMaterial = (
  params: PBRMaterialParams = {}
): MaterialNodeConfig => {
  const {
    baseColor = [0.8, 0.8, 0.8],
    metalness = 0.0,
    roughness = 0.5,
    ao = 1.0,
    emissive = [0, 0, 0],
    emissiveIntensity = 0.0,
  } = params

  const colorNode = Fn(() => {
    // Base albedo color
    const albedo = color(...baseColor)
    
    // Position and normal for lighting calculations
    const pos = positionWorld
    const normal = normalWorld
    
    // Simple ambient + directional lighting
    // (Three.js will handle full PBR lighting with environment maps)
    const lightDir = vec3(1, 1, 0.5).normalize()
    const ndotl = normal.dot(lightDir).max(0)
    
    // Ambient occlusion darkens crevices
    const ambientOcclusion = float(ao)
    
    // Simple lighting approximation for base color
    // Metallic surfaces have darker base, more reflective
    const metalFactor = float(metalness)
    const dielectricFactor = float(1.0).sub(metalFactor)
    
    // Dielectrics: full albedo color with lighting
    // Metals: darkened albedo (energy goes to reflections)
    const litColor = albedo.mul(ndotl.mul(0.8).add(0.2))
    const metalColor = albedo.mul(0.3) // Metals are darker at base
    const finalColor = mix(litColor, metalColor, metalFactor).mul(ambientOcclusion)
    
    return finalColor
  })()

  // Emissive node (if enabled)
  const emissiveNode = emissiveIntensity > 0
    ? Fn(() => {
        const emissiveColor = color(...emissive)
        return emissiveColor.mul(emissiveIntensity)
      })()
    : undefined

  return {
    colorNode,
    metalnessNode: Fn(() => metalness)(),
    roughnessNode: Fn(() => roughness)(),
    aoNode: Fn(() => ao)(),
    emissiveNode,
  }
}

/**
 * Preset materials for common PBR surfaces.
 */
export const pbrPresets = {
  /** Smooth white plastic */
  plastic: (): MaterialNodeConfig =>
    createPBRMaterial({
      baseColor: [0.9, 0.9, 0.9],
      metalness: 0.0,
      roughness: 0.3,
    }),

  /** Brushed aluminum */
  aluminum: (): MaterialNodeConfig =>
    createPBRMaterial({
      baseColor: [0.913, 0.921, 0.925],
      metalness: 1.0,
      roughness: 0.4,
    }),

  /** Pure gold */
  gold: (): MaterialNodeConfig =>
    createPBRMaterial({
      baseColor: [1.0, 0.766, 0.336],
      metalness: 1.0,
      roughness: 0.2,
    }),

  /** Copper */
  copper: (): MaterialNodeConfig =>
    createPBRMaterial({
      baseColor: [0.955, 0.637, 0.538],
      metalness: 1.0,
      roughness: 0.3,
    }),

  /** Rough stone */
  stone: (): MaterialNodeConfig =>
    createPBRMaterial({
      baseColor: [0.5, 0.5, 0.5],
      metalness: 0.0,
      roughness: 0.9,
      ao: 0.7,
    }),

  /** Glossy paint */
  paint: (): MaterialNodeConfig =>
    createPBRMaterial({
      baseColor: [0.8, 0.2, 0.2],
      metalness: 0.0,
      roughness: 0.2,
    }),
}

