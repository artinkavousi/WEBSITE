/**
 * @sketch engine/particles/swarm_visual
 * @description Visual representation of swarm intelligence
 * 
 * Shows leader-following patterns with orbital motion.
 * Creates dynamic, synchronized swarm-like movements.
 */

import { Fn, vec3, positionLocal, time, normalWorld, float } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { ParticlePoints } from '@/components/particles/ParticlePoints'
import { createSwarmSystem, swarmPresets } from '@/engine/particles/swarmSystem'
import { useMemo } from 'react'

const swarmVisualDemo = Fn(() => {
  const swarmCol = vec3(1.0, 0.2, 0.4) // Pink/red
  const leaderCol = vec3(1.0, 1.0, 0.2) // Yellow
  
  const p = positionLocal
  const t = time.mul(0.4)
  
  // Leader position (animated orbit)
  const leaderPos = vec3(
    t.sin().mul(0.3),
    t.cos().mul(0.3),
    t.mul(0.5).sin().mul(0.2)
  )
  
  // Distance to leader
  const toLeader = p.sub(leaderPos)
  const distToLeader = toLeader.length()
  
  // Leader influence (stronger closer to leader)
  const leaderInfluence = float(1.5).div(distToLeader.add(0.2))
  
  // Orbital motion around leader
  const orbitalPhase = t.add(p.length().mul(2.0))
  const orbitalX = orbitalPhase.cos().mul(0.7)
  const orbitalY = orbitalPhase.sin().mul(0.7)
  const orbitalMotion = simplexNoise3d(p.add(vec3(orbitalX, orbitalY, t)))
  
  // Swarm cohesion (particles cluster together)
  const cohesionNoise = simplexNoise3d(p.mul(3.0).add(t))
  const swarmDensity = cohesionNoise.abs().mul(0.6)
  
  // Combine leader following and swarm behavior
  const swarmPattern = leaderInfluence.add(orbitalMotion.mul(0.5)).add(swarmDensity)
  
  // Color mixing: closer to leader = more leader color
  const leaderProximity = float(1.0).sub(distToLeader.div(2.0)).clamp(0, 1)
  const baseColor = swarmCol.mix(leaderCol, leaderProximity)
  
  // Direction-based intensity
  const normal = normalWorld
  const swarmDir = toLeader.normalize()
  const alignment = normal.dot(swarmDir).abs()
  
  // Final color with swarm intensity
  const intensity = swarmPattern.mul(alignment).add(0.15)
  const finalColor = baseColor.mul(intensity.clamp(0, 1))
  
  return finalColor
})

export default swarmVisualDemo

export const Scene = () => {
  const system = useMemo(
    () =>
      createSwarmSystem({
        ...swarmPresets.dance,
        count: 900,
        spawnBounds: [5, 5, 5],
        leaders: [
          [0, 0, 0],
          [1.5, 0.5, -1.2],
          [-1.5, -0.5, 1.2],
        ],
      }),
    [],
  )

  return <ParticlePoints system={system} color='#ff99c8' size={0.04} opacity={0.85} />
}
