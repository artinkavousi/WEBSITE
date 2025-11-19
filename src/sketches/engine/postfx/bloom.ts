/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Bloom PostFX.
 * Shows high-quality bloom effect applied to a glowing metallic material.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/phiMetal'
import { createBloomChain } from '@/engine/postfx/bloomChain'

const bloomDemo = Fn(() => {
  return createEngineSketch({
    material: createPhiMetal({
      baseColor: [1.0, 0.9, 0.6], // Bright gold
      metalness: 1.0,
      roughness: 0.1,
      animateNoise: true,
      fresnelBias: 0.3,
    }),
    postfx: createBloomChain({
      threshold: 0.7,
      intensity: 1.5,
      radius: 1.2,
      smoothThreshold: 0.2,
    }),
    background: vec3(0.05, 0.05, 0.1),
  })
})

export default bloomDemo
