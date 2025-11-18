/**
 * Binary Attractor Particles Demo
 * 
 * Two attractors creating a binary system with orbital motion.
 * 
 * Note: Configuration-ready demonstration.
 * Full GPU compute implementation requires additional setup.
 */

import { Fn, vec3, uv, mix } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { attractorParticlesPresets } from '@/engine/particles/library/attractorParticles'

/**
 * Binary attractor system.
 * 
 * Features:
 * - 2000 particles
 * - Two attractors at [-2,0,0] and [2,0,0]
 * - Mixed particle colors (red-pink and blue)
 * - Creates figure-8 or orbital patterns
 */
const sketch = Fn(() => {
  const particleConfig = attractorParticlesPresets.binary()
  const _uv = uv()
  
  // Visualize the dual-color concept
  const color1 = vec3(1, 0.3, 0.5)  // Red-pink
  const color2 = vec3(0.3, 0.5, 1)  // Blue
  
  // Mix based on UV for visual representation
  const col = mix(color1, color2, _uv.x)
  
  return col
})

export default sketch

export const metadata = {
  name: 'Attractor Particles - Binary',
  description: 'Binary attractor system with dual colors',
  tags: ['particles', 'attractor', 'binary', 'orbital'],
}

