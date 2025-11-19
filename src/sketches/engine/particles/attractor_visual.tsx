/**
 * @sketch engine/particles/attractor_visual
 * @description Visual representation of attractor particle system concept
 * 
 * Uses distance-based effects to visualize gravitational attraction.
 * Shows pull towards center with radial falloff patterns.
 */

import { Fn, vec3, positionLocal, time, float } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { ParticlePoints } from '@/components/particles/ParticlePoints'
import { createAttractorSystem, attractorPresets } from '@/engine/particles/attractorSystem'
import { useMemo } from 'react'

const attractorVisualDemo = Fn(() => {
  const centerCol = vec3(1.0, 0.6, 0.2) // Orange
  const outerCol = vec3(0.2, 0.2, 1.0) // Blue
  
  // Calculate distance from center (attractor position)
  let p = positionLocal
  
  const t = time.mul(0.2)
  p = p.add(vec3(t.sin().mul(0.1), t.cos().mul(0.1), t.mul(0.5).sin().mul(0.1)))
  
  // Distance to center with noise
  const noise = simplexNoise3d(p.mul(3.0).add(time.mul(0.3)))
  const dist = p.length().add(noise.mul(0.2))
  
  // Attraction force visualization (inverse distance with falloff)
  const strength = float(1.0)
  const falloff = float(2.0)
  const force = strength.div(dist.pow(falloff).max(0.1))
  
  // Color based on force strength
  const colorMix = force.clamp(0, 1)
  const baseColor = centerCol.mix(outerCol, dist.mul(0.5).clamp(0, 1))
  
  // Add force-based glow
  const glow = centerCol.mul(force.mul(0.5).clamp(0, 1))
  const finalColor = baseColor.add(glow)
  
  return finalColor
})

export default attractorVisualDemo

export const Scene = () => {
  const system = useMemo(
    () =>
      createAttractorSystem({
        ...attractorPresets.binary,
        count: 1200,
        spawnRadius: 6,
      }),
    [],
  )

  return <ParticlePoints system={system} color='#ffb347' size={0.05} opacity={0.85} />
}
