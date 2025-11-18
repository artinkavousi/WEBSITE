/**
 * Holographic Glitch - Complete Scene Preset
 * 
 * Animated holographic material with horizontal glitch effect.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { completeScenePresets } from '@/engine/presets/completeScenes'

/**
 * Holographic Glitch: Animated iridescent material with distortion.
 */
const sketch = Fn(() =>
  createEngineSketch(completeScenePresets.holographicGlitch())
)

export default sketch

