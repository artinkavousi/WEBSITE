/**
 * Central Attractor Particles Demo
 * 
 * Demonstrates a single central attractor pulling particles toward the origin.
 * Shows basic attractor particle behavior.
 * 
 * Note: This is a conceptual demonstration. Full GPU compute implementation
 * requires additional WebGPU compute shader setup.
 */

import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { attractorParticlesPresets } from '@/engine/particles/library/attractorParticles'

/**
 * Single central attractor with pink particles.
 * 
 * Demonstrates:
 * - Basic attractor configuration
 * - Particle spawn distribution
 * - Force-based motion concept
 * 
 * The preset configures:
 * - 1000 particles
 * - Sphere spawn distribution (radius 5)
 * - Single attractor at origin (strength 2.0)
 * - Pink particle color
 */
const sketch = Fn(() => {
  // Get attractor particle configuration
  const particleConfig = attractorParticlesPresets.central()
  
  // For now, visualize as a simple color field
  // Full particle rendering requires compute shader setup
  // This demonstrates the configuration is ready
  
  // Create a gradient based on particle concept
  const col = vec3(
    particleConfig.color as [number, number, number]
  )
  
  return col
})

export default sketch

// Metadata for the sketch
export const metadata = {
  name: 'Attractor Particles - Central',
  description: 'Single central attractor particle system concept',
  tags: ['particles', 'attractor', 'physics'],
  note: 'Configuration ready - full compute implementation in progress'
}

