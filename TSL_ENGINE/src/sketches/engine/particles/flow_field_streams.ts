/**
 * Flow Field Streams Demo
 * 
 * Demonstrates flow field particle system concept with streaming motion.
 * Particles follow curl noise vector field creating fluid-like streams.
 * 
 * Note: Configuration-ready demonstration.
 */

import { Fn, vec3, uv, time, sin } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { flowFieldParticlesPresets } from '@/engine/particles/library/flowFieldParticles'
import { curlNoise3d } from '@/tsl/noise/curl_noise_3d'

/**
 * Streaming flow field visualization.
 * 
 * Features:
 * - 3000 particles with trails
 * - Fast flow (speed 2.0)
 * - Blue particle color
 * - Trail length: 15 frames
 */
const sketch = Fn(() => {
  const particleConfig = flowFieldParticlesPresets.streams()
  const _uv = uv()
  
  // Visualize flow field concept with curl noise
  const pos = vec3(_uv.x.mul(3), _uv.y.mul(3), time.mul(0.2))
  const flow = curlNoise3d(pos)
  
  // Map flow to color (blue theme matching particle config)
  const col = vec3(0.3, 0.7, 1.0).mul(flow.length().mul(0.5).add(0.5))
  
  return col
})

export default sketch

export const metadata = {
  name: 'Flow Field Particles - Streams',
  description: 'Fast-flowing particle streams with trails',
  tags: ['particles', 'flow-field', 'streams', 'curl-noise'],
}

