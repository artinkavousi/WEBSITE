/**
 * Vintage Grain & Vignette Demo
 * 
 * Heavy vintage effect with pronounced grain and vignette.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/library/basicLambert'
import { grainVignettePresets } from '@/engine/postfx/library/grainVignetteChain'

/**
 * Vintage look with heavy grain and vignette.
 * Creates an old photograph aesthetic.
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.7, 0.6, 0.5],
      ambient: 0.3,
    }),
    postfx: grainVignettePresets.vintage(),
    metadata: {
      name: 'Grain & Vignette - Vintage',
      description: 'Heavy vintage effect',
      tags: ['postfx', 'grain', 'vignette', 'vintage'],
    },
  })
)

export default sketch

