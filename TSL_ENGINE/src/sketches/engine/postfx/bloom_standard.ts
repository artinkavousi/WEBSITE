/**
 * Bloom Effect Demo
 * 
 * Demonstrates the standard bloom effect on a metallic material.
 * Shows how to combine materials with post-processing.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/library/phiMetal'
import { bloomPresets } from '@/engine/postfx/library/bloomChain'

/**
 * Metallic material with standard bloom effect.
 * 
 * Demonstrates:
 * - Combining material + postFX
 * - Bloom enhancing metallic highlights
 * - Complete engine composition
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.9, 0.7, 0.4],
      metalness: 0.95,
      roughness: 0.15,
      fresnelIntensity: 0.8,
    }),
    postfx: bloomPresets.standard(),
    metadata: {
      name: 'Bloom Effect - Standard',
      description: 'Standard bloom on metallic material',
      tags: ['postfx', 'bloom', 'material'],
    },
  })
)

export default sketch

