/**
 * Lambert Material Presets Demo
 * 
 * Shows various Lambert material presets in a single sketch.
 * Cycles through different preset colors.
 */

import { Fn, oscSine, time } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { lambertPresets } from '@/engine/materials/library/basicLambert'

/**
 * Lambert presets demo - uses warm orange preset.
 * 
 * Note: In a full implementation, you could cycle through presets
 * using time-based selection or Leva controls.
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: lambertPresets.warmOrange(),
    metadata: {
      name: 'Lambert Presets',
      description: 'Lambert material presets demonstration',
      tags: ['material', 'lambert', 'presets'],
    },
  })
)

export default sketch

