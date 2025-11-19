/**
 * @sketch engine/fields/sdf_visualization
 * @description Visual demonstration of SDF (Signed Distance Field) primitives
 * 
 * Uses SDFs to create procedural patterns and surface effects.
 * Shows distance-based coloring and edge detection.
 */

import { Fn, vec3, positionLocal, time, float } from 'three/tsl'

const sdfVisualizationDemo = Fn(() => {
  const color1 = vec3(1.0, 0.4, 0.2) // Orange
  const color2 = vec3(0.2, 0.4, 1.0) // Blue
  
  // Local position for SDF calculation
  let p = positionLocal
  
  // Animation
  const t = time.mul(0.3)
  p = p.add(vec3(t.sin().mul(0.1), t.cos().mul(0.1), 0))
  
  // Simple SDF approximation using position length
  // Sphere SDF: length(p) - radius
  const radius = 0.5
  const dist = p.length().sub(radius)
  
  // Distance-based coloring
  const distNormalized = dist.abs().div(radius)
  
  // Edge detection
  const edgeWidth = 0.05
  const edge = float(1.0).sub(dist.abs().div(edgeWidth)).clamp(0, 1)
  
  // Mix colors based on distance
  const baseColor = color1.mix(color2, distNormalized.clamp(0, 1))
  
  // Add edge highlighting
  const edgeColor = vec3(1, 1, 1).mul(edge)
  const finalColor = baseColor.add(edgeColor.mul(0.5))
  
  return finalColor
})

export default sdfVisualizationDemo
