/**
 * Flow Field Energy Demo
 * 
 * High-energy particle field with multiple colors and fast motion.
 * Demonstrates turbulent flow with trail visualization.
 */

import { Fn, vec3, uv, time, mix } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { flowFieldParticlesPresets } from '@/engine/particles/library/flowFieldParticles'
import { curlNoise3d } from '@/tsl/noise/curl_noise_3d'

/**
 * Energy field visualization with animated multi-color.
 * 
 * Features:
 * - 4000 particles
 * - High turbulence (scale 2.5, strength 4.0)
 * - Multi-color palette
 * - Fast motion with trails
 */
const sketch = Fn(() => {
  const particleConfig = flowFieldParticlesPresets.energy()
  const _uv = uv()
  
  // Animated curl noise for energy feel
  const pos = vec3(_uv.x.mul(4), _uv.y.mul(4), time.mul(0.5))
  const flow = curlNoise3d(pos)
  
  // Multi-color palette (matching particle config)
  const color1 = vec3(1, 0.3, 0.5)     // Pink
  const color2 = vec3(0.3, 1, 0.9)     // Cyan
  const color3 = vec3(0.9, 0.5, 1)     // Purple
  
  // Mix colors based on flow
  const t1 = flow.x.mul(0.5).add(0.5)
  const t2 = flow.y.mul(0.5).add(0.5)
  const col = mix(mix(color1, color2, t1), color3, t2)
  
  // Add brightness variation
  const brightness = flow.length().mul(0.3).add(0.7)
  
  return col.mul(brightness)
})

export default sketch

export const metadata = {
  name: 'Flow Field Particles - Energy',
  description: 'High-energy multi-color particle field',
  tags: ['particles', 'flow-field', 'energy', 'multi-color'],
}

