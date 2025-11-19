/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for SSS (Subsurface Scattering) Material.
 * Shows translucent material with light scattering beneath the surface.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createSSSMaterial } from '@/engine/materials/sssMaterial'

/**
 * SSS Material Demo
 * 
 * Features:
 * - Subsurface scattering approximation
 * - Translucency effect
 * - Back-lighting simulation
 * - View-dependent rim scattering
 * - Interior color scattering
 * 
 * This demo shows a skin-like translucent material with
 * red/warm subsurface scattering, perfect for organic surfaces.
 */
const sssMaterialDemo = Fn(() => {
  return createEngineSketch({
    material: createSSSMaterial({
      baseColor: [0.9, 0.7, 0.6], // Skin tone
      scatterColor: [1.0, 0.3, 0.2], // Red interior
      scatterIntensity: 0.6,
      translucency: 0.4,
      thickness: 1.0,
      ambient: 0.2,
      roughness: 0.4,
    }),
  })
})

export default sssMaterialDemo
