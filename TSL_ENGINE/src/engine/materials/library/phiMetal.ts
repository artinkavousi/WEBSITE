/**
 * Phi Metal Material
 * 
 * A stylized metallic material with procedural noise perturbation and Fresnel effects.
 * Creates an elegant, slightly animated metallic surface.
 */

import { Fn, vec3, positionWorld, normalWorld, time, mul, add, float } from 'three/tsl'
import { MaterialNodeConfig, MaterialParams } from '../../core/engineTypes'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'

/**
 * Parameters for the Phi Metal material.
 */
export interface PhiMetalParams extends MaterialParams {
  /** Base metallic color [R, G, B] */
  baseColor?: [number, number, number]
  
  /** Metalness value (0 = dielectric, 1 = full metal) */
  metalness?: number
  
  /** Surface roughness (0 = mirror smooth, 1 = very rough) */
  roughness?: number
  
  /** Enable animated noise perturbation */
  animateNoise?: boolean
  
  /** Noise scale factor */
  noiseScale?: number
  
  /** Noise intensity (how much it affects the color) */
  noiseIntensity?: number
  
  /** Animation speed multiplier */
  animationSpeed?: number
  
  /** Fresnel intensity (edge glow effect) */
  fresnelIntensity?: number
}

/**
 * Creates a stylized metallic material with procedural variations.
 * 
 * This material combines:
 * - Base metallic color
 * - Simplex noise for surface variation
 * - Fresnel effect for edge highlights
 * - Optional animation over time
 * 
 * Perfect for elegant, artistic metallic surfaces.
 * 
 * @param params - Material parameters
 * @returns Material node configuration
 * 
 * @example
 * Golden metal:
 * ```ts
 * const material = createPhiMetal({
 *   baseColor: [0.9, 0.7, 0.4],
 *   metalness: 0.95,
 *   roughness: 0.2
 * })
 * ```
 * 
 * @example
 * Animated chrome:
 * ```ts
 * const material = createPhiMetal({
 *   baseColor: [0.95, 0.95, 0.95],
 *   metalness: 1.0,
 *   roughness: 0.1,
 *   animateNoise: true,
 *   noiseIntensity: 0.15
 * })
 * ```
 * 
 * @example
 * Copper with high detail:
 * ```ts
 * const material = createPhiMetal({
 *   baseColor: [0.95, 0.5, 0.3],
 *   noiseScale: 4.0,
 *   noiseIntensity: 0.2
 * })
 * ```
 */
export const createPhiMetal = (params: PhiMetalParams = {}): MaterialNodeConfig => {
  const {
    baseColor = [0.8, 0.7, 0.5],
    metalness = 1.0,
    roughness = 0.3,
    animateNoise = true,
    noiseScale = 2.0,
    noiseIntensity = 0.1,
    animationSpeed = 0.1,
    fresnelIntensity = 0.5,
  } = params

  const colorNode = Fn(() => {
    // Base metallic color
    const baseCol = vec3(...baseColor)
    
    // Get world position for noise sampling
    const pos = positionWorld
    
    // Get surface normal for Fresnel
    const normal = normalWorld
    
    // Time component for animation
    const t = animateNoise ? time.mul(animationSpeed) : float(0)
    
    // Sample simplex noise at world position + time
    const noisePos = pos.mul(noiseScale).add(vec3(0, 0, t))
    const noise = simplexNoise3d(noisePos)
    
    // Apply noise to color as subtle variation
    const noiseColor = noise.mul(noiseIntensity)
    
    // Simple Fresnel approximation: (1 - N·V)^5
    // For a fullscreen quad, we approximate view direction
    const viewDir = vec3(0, 0, 1)
    const ndotv = normal.dot(viewDir).abs()
    const fresnel = mul(1.0, ndotv).oneMinus().pow(3.0).mul(fresnelIntensity)
    
    // Combine base color + noise + fresnel
    const metallic = baseCol.add(noiseColor).add(fresnel)
    
    return metallic
  })()

  return {
    colorNode,
    metalnessNode: metalness,
    roughnessNode: roughness,
    metadata: {
      name: 'Phi Metal',
      description: 'Stylized metallic material with procedural noise and Fresnel',
      author: 'TSL Engine',
    },
  }
}

/**
 * Pre-configured Phi Metal material presets.
 */
export const phiMetalPresets = {
  /**
   * Classic gold material
   */
  gold: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [1.0, 0.766, 0.336],
      metalness: 1.0,
      roughness: 0.2,
      noiseScale: 3.0,
      noiseIntensity: 0.08,
    }),

  /**
   * Silver/Chrome material
   */
  silver: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.97, 0.97, 0.97],
      metalness: 1.0,
      roughness: 0.1,
      noiseScale: 2.5,
      noiseIntensity: 0.05,
    }),

  /**
   * Copper material
   */
  copper: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.955, 0.637, 0.538],
      metalness: 1.0,
      roughness: 0.25,
      noiseScale: 2.0,
      noiseIntensity: 0.12,
    }),

  /**
   * Brass material
   */
  brass: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.88, 0.78, 0.5],
      metalness: 0.95,
      roughness: 0.35,
      noiseScale: 1.8,
      noiseIntensity: 0.1,
    }),

  /**
   * Iron material with more roughness
   */
  iron: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.56, 0.57, 0.58],
      metalness: 1.0,
      roughness: 0.5,
      noiseScale: 1.5,
      noiseIntensity: 0.15,
    }),

  /**
   * Titanium with subtle blue tint
   */
  titanium: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.76, 0.73, 0.69],
      metalness: 1.0,
      roughness: 0.4,
      noiseScale: 2.2,
      noiseIntensity: 0.1,
    }),

  /**
   * Animated holographic metal
   */
  holographic: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.8, 0.6, 0.9],
      metalness: 0.9,
      roughness: 0.15,
      animateNoise: true,
      noiseScale: 4.0,
      noiseIntensity: 0.3,
      animationSpeed: 0.2,
      fresnelIntensity: 0.8,
    }),

  /**
   * Minimal matte metal
   */
  matte: (): MaterialNodeConfig =>
    createPhiMetal({
      baseColor: [0.7, 0.7, 0.7],
      metalness: 0.8,
      roughness: 0.7,
      noiseScale: 1.0,
      noiseIntensity: 0.05,
      animateNoise: false,
    }),
}

