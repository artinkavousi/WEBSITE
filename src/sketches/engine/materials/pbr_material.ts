/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Demo sketch for PBR Material.
 * Shows physically-based rendering with metallic/roughness workflow.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPBRMaterial } from '@/engine/materials/pbrMaterial'

/**
 * PBR Material Demo
 * 
 * Features:
 * - Physically-based rendering
 * - Metallic/roughness workflow
 * - Energy-conserving lighting
 * - Ambient occlusion
 * - Optional emissive
 * 
 * This demo shows a brushed metal appearance with
 * realistic lighting and energy conservation.
 */
const pbrMaterialDemo = Fn(() => {
  return createEngineSketch({
    material: createPBRMaterial({
      baseColor: [0.9, 0.9, 0.95], // Light gray (aluminum-like)
      metalness: 1.0, // Full metal
      roughness: 0.4, // Slightly rough (brushed metal)
      ao: 1.0, // No occlusion (uniform surface)
      emissive: [0, 0, 0],
      emissiveIntensity: 0.0,
    }),
  })
})

export default pbrMaterialDemo
