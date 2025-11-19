/**
 * @sketch engine/particles/flow_visual
 * @description Visual representation of flow field particle system
 * 
 * Shows fluid-like motion patterns using curl noise and streaking.
 * Visualizes how particles would flow through a vector field.
 */

import { Fn, vec3, positionLocal, time, normalWorld } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { ParticlePoints } from '@/components/particles/ParticlePoints'
import { createFlowSystem, flowPresets } from '@/engine/particles/flowSystem'
import { useMemo } from 'react'

const flowVisualDemo = Fn(() => {
  const flowCol = vec3(0.2, 0.8, 1.0) // Cyan
  const bgCol = vec3(0.1, 0.1, 0.18) // Dark blue
  
  // Position with time-based flow
  const p = positionLocal.mul(2.0)
  const t = time.mul(0.5)
  
  // Create flow field using multiple noise samples
  const flow1 = simplexNoise3d(p.add(vec3(t, 0, 0)))
  const flow2 = simplexNoise3d(p.add(vec3(0, t.mul(0.7), 0)))
  const flow3 = simplexNoise3d(p.add(vec3(0, 0, t.mul(0.5))))
  
  // Combine flows into vector field
  const flowVec = vec3(flow1, flow2, flow3).mul(1.0)
  
  // Create streak pattern along flow direction
  const flowMag = flowVec.length()
  const streakPattern = flowMag.mul(0.5)
  
  // Use normal alignment with flow for directional effect
  const normal = normalWorld
  const flowDir = flowVec.normalize()
  const alignment = normal.dot(flowDir).abs()
  
  // Final color: flow-based intensity
  const intensity = streakPattern.mul(alignment).add(0.2)
  const finalColor = bgCol.mix(flowCol, intensity.clamp(0, 1))
  
  return finalColor
})

export default flowVisualDemo

export const Scene = () => {
  const system = useMemo(
    () =>
      createFlowSystem({
        ...flowPresets.turbulent,
        count: 1500,
        spawnBounds: [4, 4, 4],
      }),
    [],
  )

  return <ParticlePoints system={system} color='#7fd8ff' size={0.03} opacity={0.85} />
}
