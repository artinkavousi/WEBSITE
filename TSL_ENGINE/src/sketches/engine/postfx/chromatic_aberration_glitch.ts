/**
 * Glitch Chromatic Aberration Demo
 * 
 * Horizontal glitch-style chromatic aberration.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/library/phiMetal'
import { chromaticAberrationPresets } from '@/engine/postfx/library/chromaticAberrationChain'

/**
 * Glitch effect with horizontal RGB separation.
 * Creates a digital distortion aesthetic.
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.7, 0.3, 0.9],
      metalness: 0.9,
      animateNoise: true,
      noiseIntensity: 0.2,
    }),
    postfx: chromaticAberrationPresets.glitchHorizontal(),
    metadata: {
      name: 'Chromatic Aberration - Glitch',
      description: 'Glitch-style chromatic aberration',
      tags: ['postfx', 'chromatic-aberration', 'glitch'],
    },
  })
)

export default sketch

