/**
 * Phi Metal - Copper Preset Demo
 * 
 * Demonstrates the copper preset from Phi Metal.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { phiMetalPresets } from '@/engine/materials/library/phiMetal'

/**
 * Copper metal preset sketch.
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: phiMetalPresets.copper(),
    metadata: {
      name: 'Copper Metal',
      description: 'Copper material using Phi Metal preset',
      tags: ['material', 'metal', 'copper', 'preset'],
    },
  })
)

export default sketch

