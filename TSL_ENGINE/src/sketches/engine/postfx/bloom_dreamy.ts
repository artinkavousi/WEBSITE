/**
 * Dreamy Bloom Effect Demo
 * 
 * Shows dreamy bloom preset with soft threshold for ethereal look.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { phiMetalPresets } from '@/engine/materials/library/phiMetal'
import { bloomPresets } from '@/engine/postfx/library/bloomChain'

/**
 * Dreamy bloom with holographic metal.
 * Creates an ethereal, otherworldly effect.
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: phiMetalPresets.holographic(),
    postfx: bloomPresets.dreamy(),
    metadata: {
      name: 'Bloom Effect - Dreamy',
      description: 'Dreamy bloom for ethereal effects',
      tags: ['postfx', 'bloom', 'dreamy'],
    },
  })
)

export default sketch

