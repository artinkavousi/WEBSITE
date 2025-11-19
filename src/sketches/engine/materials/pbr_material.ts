/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for PBR Material.
 * Shows physically-based rendering with metallic/roughness workflow.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPBRMaterial } from '@/engine/materials/pbrMaterial'

const pbrMaterialDemo = Fn(() => {
  return createEngineSketch({
    material: createPBRMaterial({
      baseColor: [0.9, 0.7, 0.4], // Gold
      metalness: 1.0,
      roughness: 0.3,
      ao: 1.0,
      emissive: [0, 0, 0],
      emissiveIntensity: 0,
    }),
    background: vec3(0.05),
  })
})

export default pbrMaterialDemo
