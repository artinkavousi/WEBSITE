/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Grain + Vignette PostFX.
 * Shows cinematic film grain and vignette effects.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/basicLambert'
import { createGrainVignette } from '@/engine/postfx/grainVignette'

const grainVignetteDemo = Fn(() => {
  return createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.7, 0.6, 0.5], // Warm neutral
      ambient: 0.3,
      diffuseIntensity: 0.7,
    }),
    postfx: createGrainVignette({
      grainIntensity: 0.1,
      vignetteIntensity: 0.5,
      vignettePower: 2.0,
      vignetteRadius: 0.5,
    }),
    background: vec3(0.2, 0.2, 0.25),
  })
})

export default grainVignetteDemo
