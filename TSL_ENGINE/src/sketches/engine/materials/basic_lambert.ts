/**
 * Basic Lambert Material Demo
 * 
 * Demonstrates the basic Lambert material with simple diffuse lighting.
 * Shows how to use the engine's material system in a sketch.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/library/basicLambert'

/**
 * Simple Lambert material sketch with warm orange color.
 * 
 * Demonstrates:
 * - Basic material creation
 * - Engine sketch wrapper usage
 * - Simple lighting setup
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.9, 0.5, 0.2],
      ambient: 0.2,
      lightDir: [1, 1, 1],
      lightIntensity: 1.2,
    }),
    metadata: {
      name: 'Basic Lambert Demo',
      description: 'Simple diffuse material with Lambert shading',
      tags: ['material', 'lambert', 'diffuse'],
    },
  })
)

export default sketch

