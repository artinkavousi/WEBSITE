import { Fn, normalWorld, positionWorld, cameraPosition, vec3, time } from 'three/tsl'
import { fresnel } from '@/tsl/utils/lighting'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { MaterialNodeConfig, MaterialParams } from '../core/engineTypes'

/**
 * Parameters for Phi Metal material.
 * Stylized metallic surface with Fresnel highlights and animated noise.
 */
export interface PhiMetalParams extends MaterialParams {
  /** Base metallic color as RGB array (0-1). Default: [0.8, 0.7, 0.5] (golden) */
  baseColor?: [number, number, number]
  /** Metalness factor (0-1). Default: 1.0 (full metal) */
  metalness?: number
  /** Roughness factor (0-1). Default: 0.3 (slightly rough) */
  roughness?: number
  /** Enable animated noise perturbation. Default: true */
  animateNoise?: boolean
  /** Noise scale multiplier. Default: 2.0 */
  noiseScale?: number
  /** Noise influence on final color (0-1). Default: 0.1 */
  noiseInfluence?: number
  /** Fresnel bias (0-1). Default: 0.2 */
  fresnelBias?: number
}

/**
 * Creates a stylized metallic material with Fresnel and noise.
 * 
 * **Features:**
 * - **Fresnel Effect**: View-dependent rim lighting (edges glow more than center)
 * - **Noise Perturbation**: Adds surface detail via 3D simplex noise
 * - **Animation**: Optional time-based noise animation
 * - **Metalness**: Configurable metal vs dielectric properties
 * 
 * **Use Cases:**
 * - Stylized metals (gold, silver, bronze, copper)
 * - Sci-fi surfaces with energy patterns
 * - Abstract art with metallic sheens
 * - Animated crystalline structures
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * ```typescript
 * // Classic gold metal
 * const gold = createPhiMetal({
 *   baseColor: [0.9, 0.7, 0.4],
 *   metalness: 0.95,
 *   roughness: 0.2,
 *   animateNoise: true
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Sci-fi energy metal
 * const energy = createPhiMetal({
 *   baseColor: [0.2, 0.8, 0.9], // Cyan
 *   metalness: 1.0,
 *   roughness: 0.1,
 *   noiseInfluence: 0.3, // Strong noise
 *   animateNoise: true
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Static copper
 * const copper = createPhiMetal({
 *   baseColor: [0.95, 0.5, 0.3],
 *   metalness: 0.9,
 *   roughness: 0.4,
 *   animateNoise: false
 * })
 * ```
 */
export const createPhiMetal = (
  params: PhiMetalParams = {}
): MaterialNodeConfig => {
  const {
    baseColor = [0.8, 0.7, 0.5],
    metalness = 1.0,
    roughness = 0.3,
    animateNoise = true,
    noiseScale = 2.0,
    noiseInfluence = 0.1,
    fresnelBias = 0.2,
  } = params

  const colorNode = Fn(() => {
    // Base metallic color
    const baseCol = vec3(...baseColor)
    
    // World position for noise sampling and view computations
    const worldPos = positionWorld
    const noisePos = worldPos.mul(noiseScale)
    
    // Animated time offset (only if animation enabled)
    const t = animateNoise ? time.mul(0.1) : 0
    
    // 3D simplex noise for surface perturbation
    // Offset by time in Z direction for animation
    const noise = simplexNoise3d(noisePos.add(vec3(0, 0, t)))
    
    // Fresnel effect: view-dependent rim lighting
    // Use custom fresnel helper based on view direction and surface normal.
    // Returns a value from 0 (facing camera) to 1 (edge-on)
    const normal = normalWorld
    const viewDir = cameraPosition.sub(worldPos).normalize()
    const f = fresnel(viewDir, normal)
    
    // Combine base color with Fresnel
    // Add fresnelBias to prevent pure black in center
    const metallic = baseCol.mul(f.add(fresnelBias))
    
    // Add noise perturbation
    const noiseContribution = noise.mul(noiseInfluence)
    const finalColor = metallic.add(noiseContribution)
    
    return finalColor
  })()

  // Return full material configuration including PBR nodes
  return {
    colorNode,
    metalnessNode: Fn(() => metalness)(),
    roughnessNode: Fn(() => roughness)(),
  }
}

