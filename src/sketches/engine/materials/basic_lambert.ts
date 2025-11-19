/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Basic Lambert material.
 * Shows simple diffuse lighting with interactive Leva controls.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/basicLambert'

/**
 * Basic Lambert Material Demo
 * 
 * Shows simple diffuse lighting with ambient and directional light.
 */
const basicLambertDemo = Fn(() => {
  return createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.8, 0.4, 0.2], // Orange
      ambient: 0.2,
      diffuseIntensity: 0.8,
      lightDirection: [1, 1, 1],
    }),
    background: vec3(0.05),
  })
})

export default basicLambertDemo
