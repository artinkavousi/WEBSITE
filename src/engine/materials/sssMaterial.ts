import { Fn, color, normalWorld, positionWorld, cameraPosition, vec3, float, pow, max } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '../core/engineTypes'

/**
 * Parameters for SSS (Subsurface Scattering) material.
 * Simulates translucent materials where light penetrates and scatters beneath the surface.
 */
export interface SSSMaterialParams extends MaterialParams {
  /** Base color (surface albedo) as RGB array. Default: [0.9, 0.7, 0.6] (skin tone) */
  baseColor?: [number, number, number]
  /** Subsurface scattering color (interior color). Default: [1.0, 0.3, 0.2] (red/warm) */
  scatterColor?: [number, number, number]
  /** Scattering intensity (0-1). Default: 0.5 */
  scatterIntensity?: number
  /** Translucency (how much light passes through). Default: 0.3 */
  translucency?: number
  /** Thickness factor (simulates material depth). Default: 1.0 */
  thickness?: number
  /** Ambient light intensity. Default: 0.2 */
  ambient?: number
  /** Roughness for surface reflection. Default: 0.4 */
  roughness?: number
}

/**
 * Creates an SSS (Subsurface Scattering) material.
 * 
 * Simulates translucent materials like skin, wax, marble, jade, leaves, etc.
 * Light penetrates the surface, scatters inside, and exits at a different point.
 * 
 * **SSS Approximation:**
 * This uses a simplified SSS model suitable for real-time rendering:
 * - **Front lighting**: Standard diffuse + specular
 * - **Back lighting**: Simulates light passing through the material
 * - **Scatter color**: Interior color of the material (often warmer/redder)
 * - **Thickness**: Controls how deep light can penetrate
 * 
 * **Common Materials:**
 * - **Skin**: Red/orange scatter color, medium translucency
 * - **Wax**: Yellow scatter, high translucency
 * - **Marble**: White scatter, low translucency
 * - **Leaves**: Green scatter, high translucency
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * ```typescript
 * // Human skin
 * const skin = createSSSMaterial({
 *   baseColor: [0.9, 0.7, 0.6],
 *   scatterColor: [1.0, 0.3, 0.2],
 *   scatterIntensity: 0.6,
 *   translucency: 0.4,
 *   thickness: 1.0
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Candle wax
 * const wax = createSSSMaterial({
 *   baseColor: [0.95, 0.9, 0.7],
 *   scatterColor: [1.0, 0.9, 0.5],
 *   scatterIntensity: 0.8,
 *   translucency: 0.7,
 *   thickness: 0.5
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // White marble
 * const marble = createSSSMaterial({
 *   baseColor: [0.95, 0.95, 0.95],
 *   scatterColor: [0.9, 0.9, 1.0],
 *   scatterIntensity: 0.3,
 *   translucency: 0.2,
 *   thickness: 2.0
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Green jade
 * const jade = createSSSMaterial({
 *   baseColor: [0.3, 0.7, 0.4],
 *   scatterColor: [0.5, 1.0, 0.6],
 *   scatterIntensity: 0.5,
 *   translucency: 0.4,
 *   thickness: 1.5
 * })
 * ```
 */
export const createSSSMaterial = (
  params: SSSMaterialParams = {}
): MaterialNodeConfig => {
  const {
    baseColor = [0.9, 0.7, 0.6],
    scatterColor = [1.0, 0.3, 0.2],
    scatterIntensity = 0.5,
    translucency = 0.3,
    thickness = 1.0,
    ambient = 0.2,
    roughness = 0.4,
  } = params

  const colorNode = Fn(() => {
    // Base colors
    const albedo = color(...baseColor)
    const scatter = color(...scatterColor)
    
    // Geometry data
    const pos = positionWorld
    const normal = normalWorld
    const viewDir = cameraPosition.sub(pos).normalize()
    
    // Light direction (simplified - single directional light)
    const lightDir = vec3(1, 1, 0.5).normalize()
    
    // === FRONT LIGHTING (standard diffuse) ===
    const ndotl = normal.dot(lightDir).max(0)
    const frontLighting = albedo.mul(ndotl.mul(0.8).add(ambient))
    
    // === BACK LIGHTING (subsurface scattering approximation) ===
    // When light comes from behind, it passes through the material
    // We use the inverse normal to detect backlit areas
    const backNormal = normal.negate()
    const backDot = backNormal.dot(lightDir).max(0)
    
    // Thickness affects how much light can pass through
    // Thinner materials allow more light through
    const thicknessAtten = pow(backDot, float(thickness))
    
    // Translucency controls overall SSS intensity
    const sssContribution = scatter
      .mul(thicknessAtten)
      .mul(float(translucency))
      .mul(float(scatterIntensity))
    
    // === VIEW-DEPENDENT EFFECTS ===
    // Edges show more subsurface scattering (rim lighting)
    const ndotv = normal.dot(viewDir).max(0)
    const rimFactor = pow(float(1.0).sub(ndotv), float(3.0))
    const rimSSS = scatter.mul(rimFactor).mul(float(scatterIntensity * 0.3))
    
    // === COMBINE ALL CONTRIBUTIONS ===
    const finalColor = frontLighting.add(sssContribution).add(rimSSS)
    
    return finalColor
  })()

  return {
    colorNode,
    roughnessNode: Fn(() => roughness)(),
  }
}

/**
 * Preset SSS materials for common translucent surfaces.
 */
export const sssPresets = {
  /** Human skin tone */
  skin: (): MaterialNodeConfig =>
    createSSSMaterial({
      baseColor: [0.9, 0.7, 0.6],
      scatterColor: [1.0, 0.3, 0.2],
      scatterIntensity: 0.6,
      translucency: 0.4,
      thickness: 1.0,
    }),

  /** Candle wax */
  wax: (): MaterialNodeConfig =>
    createSSSMaterial({
      baseColor: [0.95, 0.9, 0.7],
      scatterColor: [1.0, 0.9, 0.5],
      scatterIntensity: 0.8,
      translucency: 0.7,
      thickness: 0.5,
    }),

  /** White marble */
  marble: (): MaterialNodeConfig =>
    createSSSMaterial({
      baseColor: [0.95, 0.95, 0.95],
      scatterColor: [0.9, 0.9, 1.0],
      scatterIntensity: 0.3,
      translucency: 0.2,
      thickness: 2.0,
    }),

  /** Green jade */
  jade: (): MaterialNodeConfig =>
    createSSSMaterial({
      baseColor: [0.3, 0.7, 0.4],
      scatterColor: [0.5, 1.0, 0.6],
      scatterIntensity: 0.5,
      translucency: 0.4,
      thickness: 1.5,
    }),

  /** Leaf/plant */
  leaf: (): MaterialNodeConfig =>
    createSSSMaterial({
      baseColor: [0.3, 0.6, 0.2],
      scatterColor: [0.6, 1.0, 0.3],
      scatterIntensity: 0.7,
      translucency: 0.6,
      thickness: 0.3,
    }),
}

