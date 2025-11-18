/**
 * Chromatic Aberration Demo
 * 
 * Demonstrates RGB channel separation for lens distortion effect.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { phiMetalPresets } from '@/engine/materials/library/phiMetal'
import { chromaticAberrationPresets } from '@/engine/postfx/library/chromaticAberrationChain'

/**
 * Standard chromatic aberration on silver metal.
 * 
 * Demonstrates:
 * - RGB channel separation
 * - Lens distortion simulation
 * - Color fringing effect
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: phiMetalPresets.silver(),
    postfx: chromaticAberrationPresets.standard(),
    metadata: {
      name: 'Chromatic Aberration - Standard',
      description: 'Standard lens chromatic aberration',
      tags: ['postfx', 'chromatic-aberration', 'distortion'],
    },
  })
)

export default sketch

