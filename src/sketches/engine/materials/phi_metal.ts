/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Phi Metal material.
 * Shows stylized metallic surface with Fresnel and animated noise.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/phiMetal'

const phiMetalDemo = Fn(() => {
  return createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.9, 0.7, 0.4], // Golden
      metalness: 0.95,
      roughness: 0.2,
      animateNoise: true,
      noiseScale: 2.0,
      noiseInfluence: 0.1,
      fresnelBias: 0.2,
    }),
    background: vec3(0.02),
  })
})

export default phiMetalDemo
