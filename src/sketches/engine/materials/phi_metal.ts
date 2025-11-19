/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Phi Metal material.
 * Animated metallic surface with Fresnel highlights and noise perturbation.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/phiMetal'

/**
 * Phi Metal Material Demo
 * 
 * Features:
 * - Fresnel-based metallic look
 * - Animated 3D simplex noise
 * - View-dependent rim lighting
 * - Stylized golden appearance
 * 
 * The material changes appearance based on viewing angle,
 * with edges glowing brighter than center (Fresnel effect).
 * Noise animation adds dynamic surface detail.
 */
const phiMetalDemo = Fn(() => {
  return createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.9, 0.7, 0.4], // Golden color
      metalness: 0.95,
      roughness: 0.2,
      animateNoise: true,
      noiseScale: 2.0,
      noiseInfluence: 0.1,
      fresnelBias: 0.2,
    }),
  })
})

export default phiMetalDemo
