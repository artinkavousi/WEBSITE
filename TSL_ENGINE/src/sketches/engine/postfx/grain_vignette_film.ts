/**
 * Film Grain & Vignette Demo
 * 
 * Demonstrates cinematic grain and vignette effects.
 * Creates a classic film look.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { lambertPresets } from '@/engine/materials/library/basicLambert'
import { grainVignettePresets } from '@/engine/postfx/library/grainVignetteChain'

/**
 * Film-style grain and vignette on warm material.
 * 
 * Demonstrates:
 * - Cinematic post-processing
 * - Vintage film look
 * - Grain texture + edge darkening
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: lambertPresets.warmOrange(),
    postfx: grainVignettePresets.film(),
    metadata: {
      name: 'Grain & Vignette - Film',
      description: 'Cinematic grain and vignette effects',
      tags: ['postfx', 'grain', 'vignette', 'film'],
    },
  })
)

export default sketch

