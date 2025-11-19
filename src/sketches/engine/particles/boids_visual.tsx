/**
 * @sketch engine/particles/boids_visual
 * @description Visual representation of boids flocking behavior
 * 
 * Shows cohesive, flowing patterns that simulate flocking.
 * Uses noise-based directional patterns to represent group movement.
 */

import { Fn, vec3, positionLocal, time, normalWorld } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { ParticlePoints } from '@/components/particles/ParticlePoints'
import { createBoidsSystem, boidsPresets } from '@/engine/particles/boidsSystem'
import { useMemo } from 'react'

const boidsVisualDemo = Fn(() => {
  const flockCol = vec3(1.0, 0.8, 0.2) // Yellow
  const bgCol = vec3(0.1, 0.1, 0.18) // Dark blue
  
  const p = positionLocal.mul(3.0)
  const t = time.mul(0.3)
  
  // Multiple noise layers for different flocking behaviors
  // Cohesion: tendency to group together
  const cohesionPos = p.mul(0.5).add(vec3(t, 0, 0))
  const cohesionNoise = simplexNoise3d(cohesionPos)
  
  // Separation: maintain distance
  const separationPos = p.mul(4.0).add(vec3(t.mul(2), 0, 0))
  const separationNoise = simplexNoise3d(separationPos)
  
  // Alignment: move in similar direction
  const alignmentPos = p.mul(1.5).add(vec3(t, t.mul(1.3), t.mul(0.7)))
  const alignmentNoise = simplexNoise3d(alignmentPos)
  
  // Combine behaviors
  const cohesionFactor = cohesionNoise.mul(0.8)
  const separationFactor = separationNoise.mul(0.5)
  const flockPattern = cohesionFactor.add(separationFactor.mul(0.5)).add(alignmentNoise.mul(0.3))
  
  // Create boid density pattern
  const density = flockPattern.abs()
  
  // Direction-based streaking
  const normal = normalWorld
  const flowDir = vec3(cohesionNoise, alignmentNoise, separationNoise).normalize()
  const directionality = normal.dot(flowDir).abs()
  
  // Final color with boid clustering
  const intensity = density.mul(directionality).add(0.1)
  const finalColor = bgCol.mix(flockCol, intensity.clamp(0, 1))
  
  return finalColor
})

export default boidsVisualDemo

export const Scene = () => {
  const system = useMemo(
    () =>
      createBoidsSystem({
        ...boidsPresets.tight,
        count: 900,
        spawnBounds: [6, 4, 6],
        wrapBoundaries: true,
      }),
    [],
  )

  return <ParticlePoints system={system} color='#ffe082' size={0.035} opacity={0.9} />
}
