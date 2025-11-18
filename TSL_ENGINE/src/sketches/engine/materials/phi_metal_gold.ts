/**
 * Phi Metal - Gold Preset Demo
 * 
 * Demonstrates the gold preset from Phi Metal.
 * Shows how to use material presets for quick results.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { phiMetalPresets } from '@/engine/materials/library/phiMetal'

/**
 * Gold metal preset sketch.
 * 
 * Demonstrates:
 * - Using material presets
 * - Quick material setup
 * - Realistic gold appearance
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: phiMetalPresets.gold(),
    metadata: {
      name: 'Gold Metal',
      description: 'Gold material using Phi Metal preset',
      tags: ['material', 'metal', 'gold', 'preset'],
    },
  })
)

export default sketch

