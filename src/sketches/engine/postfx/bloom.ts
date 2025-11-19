/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Bloom post-processing effect.
 * Shows glowing bright areas with bloom bleeding.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/phiMetal'
import { createBloomChain } from '@/engine/postfx/bloomChain'

/**
 * Bloom PostFX Demo
 * 
 * Features:
 * - Threshold-based bloom extraction
 * - Bright area detection
 * - Glow spreading
 * - Additive blending
 * 
 * This demo applies bloom to a metallic material, making
 * the brightest areas (Fresnel highlights) glow and spread.
 * 
 * The bloom effect makes bright pixels bleed into surrounding
 * areas, creating a soft glow that enhances HDR lighting and
 * emissive materials.
 */
const bloomDemo = Fn(() => {
  return createEngineSketch({
    material: createPhiMetal({
      baseColor: [1.0, 0.9, 0.6], // Bright gold
      metalness: 1.0,
      roughness: 0.1, // Very smooth for bright highlights
      animateNoise: true,
      fresnelBias: 0.3, // More edge glow
    }),
    postfx: createBloomChain({
      threshold: 0.7,
      intensity: 1.5,
      radius: 1.2,
      smoothThreshold: 0.2,
    }),
    background: vec3(0.05, 0.05, 0.1), // Dark background to show bloom
  })
})

export default bloomDemo
