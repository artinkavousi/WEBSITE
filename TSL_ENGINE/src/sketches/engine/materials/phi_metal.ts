/**
 * Phi Metal Material Demo
 * 
 * Demonstrates the Phi Metal material with animated noise and Fresnel effects.
 * Shows an elegant, stylized metallic surface.
 */

import { Fn } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createPhiMetal } from '@/engine/materials/library/phiMetal'

/**
 * Animated metallic material sketch with golden color.
 * 
 * Demonstrates:
 * - Advanced material with procedural noise
 * - Animated surface effects
 * - Fresnel highlights
 * - Metalness and roughness control
 */
const sketch = Fn(() =>
  createEngineSketch({
    material: createPhiMetal({
      baseColor: [0.9, 0.7, 0.4],
      metalness: 0.95,
      roughness: 0.2,
      animateNoise: true,
      noiseScale: 2.5,
      noiseIntensity: 0.12,
      animationSpeed: 0.1,
      fresnelIntensity: 0.6,
    }),
    metadata: {
      name: 'Phi Metal Demo',
      description: 'Stylized metallic material with procedural variations',
      tags: ['material', 'metal', 'procedural', 'animated'],
    },
  })
)

export default sketch

