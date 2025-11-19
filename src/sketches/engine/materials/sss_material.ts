/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for SSS Material.
 * Shows subsurface scattering for translucent surfaces.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createSSSMaterial } from '@/engine/materials/sssMaterial'

const sssMaterialDemo = Fn(() => {
  return createEngineSketch({
    material: createSSSMaterial({
      baseColor: [0.9, 0.7, 0.6], // Skin tone
      scatterColor: [1.0, 0.3, 0.2], // Red scatter
      scatterIntensity: 0.6,
      translucency: 0.4,
      thickness: 1.0,
      ambient: 0.2,
      roughness: 0.4,
    }),
    background: vec3(0.05),
  })
})

export default sssMaterialDemo
