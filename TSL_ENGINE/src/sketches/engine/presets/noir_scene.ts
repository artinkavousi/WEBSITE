/**
 * Noir Scene - Complete Scene Preset
 * 
 * Film noir aesthetic with heavy vignette and grain.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { completeScenePresets } from '@/engine/presets/completeScenes'

/**
 * Noir Scene: Classic film noir look with heavy shadows.
 */
const sketch = Fn(() =>
  createEngineSketch(completeScenePresets.noirScene())
)

export default sketch

