/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for Grain+Vignette post-processing effect.
 * Shows cinematic film grain combined with edge darkening.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/basicLambert'
import { createGrainVignette } from '@/engine/postfx/grainVignette'

/**
 * Grain+Vignette PostFX Demo
 * 
 * Features:
 * - Film grain texture
 * - Radial vignette darkening
 * - Cinematic atmosphere
 * - Vintage aesthetic
 * 
 * This demo applies grain and vignette to a simple Lambert material,
 * creating a cinematic film-like appearance with subtle texture
 * and edge darkening to focus attention on the center.
 */
const grainVignetteDemo = Fn(() => {
  return createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.7, 0.6, 0.5], // Warm neutral tone
      ambient: 0.3,
      diffuseIntensity: 0.7,
    }),
    postfx: createGrainVignette({
      grainIntensity: 0.1,
      vignetteIntensity: 0.5,
      vignettePower: 2.0,
      vignetteRadius: 0.5,
    }),
    background: vec3(0.2, 0.2, 0.25), // Slightly bright background to show vignette
  })
})

export default grainVignetteDemo
