/**
 * Golden Dreams - Complete Scene Preset
 * 
 * Demonstrates complete scene composition using preset.
 * One-liner to create a beautiful scene!
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { completeScenePresets } from '@/engine/presets/completeScenes'

/**
 * Golden Dreams: Warm golden metal with dreamy bloom.
 * 
 * Just one line to get this complete effect!
 */
const sketch = Fn(() =>
  createEngineSketch(completeScenePresets.goldenDreams())
)

export default sketch

