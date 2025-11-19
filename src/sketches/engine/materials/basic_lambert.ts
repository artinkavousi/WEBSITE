/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Basic Lambert material.
 * Shows simple diffuse lighting with interactive Leva controls.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/basicLambert'

/**
 * Basic Lambert Material Demo
 * 
 * Features:
 * - Simple diffuse (Lambertian) shading
 * - Adjustable base color (RGB)
 * - Ambient light control
 * - Diffuse intensity control
 * - Light direction control
 * 
 * Use Leva panel to adjust parameters in real-time.
 */
const basicLambertDemo = Fn(() => {
  // Fixed parameters for initial version
  // TODO: Add Leva controls in next iteration
  
  return createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.8, 0.4, 0.2], // Warm orange
      ambient: 0.2,
      diffuseIntensity: 0.8,
      lightDirection: [1, 1, 1], // From top-right-front
    }),
  })
})

export default basicLambertDemo
