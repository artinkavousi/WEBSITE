/**
 * @sketch tsl/particles/vortex_trails
 * @description Swirling vortex particle ribbons driven by TSL compute nodes.
 */

import { useControls } from 'leva'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { useVortexTrails } from '@/tsl/particles/vortex_trails'
import { color } from 'three/tsl'

const vortexBackground = color(0x04060b)

export default vortexBackground

const VortexTrailsLayer = () => {
  const controls = useControls('Vortex Trails', {
    count: { value: 6000, min: 1024, max: 20000, step: 512 },
    size: { value: 0.045, min: 0.01, max: 0.1, step: 0.005 },
    speed: { value: 1.1, min: 0.25, max: 2.5, step: 0.05 },
    swirlStrength: { value: 0.85, min: 0.1, max: 2.5, step: 0.05 },
    radialPull: { value: 0.35, min: 0.05, max: 1.25, step: 0.05 },
    noiseAmplitude: { value: 0.45, min: 0, max: 1.5, step: 0.05 },
    noiseFrequency: { value: 0.6, min: 0.1, max: 2, step: 0.05 },
    colorShift: { value: 1.3, min: 0, max: 4, step: 0.05 },
    trail: { value: 1.6, min: 0.5, max: 3, step: 0.05 },
    fadeDistance: { value: 8, min: 2, max: 20, step: 0.5 },
  })

  useVortexTrails({
    count: controls.count,
    size: controls.size,
    speed: controls.speed,
    swirlStrength: controls.swirlStrength,
    radialPull: controls.radialPull,
    noiseAmplitude: controls.noiseAmplitude,
    noiseFrequency: controls.noiseFrequency,
    colorShift: controls.colorShift,
    trail: controls.trail,
    fadeDistance: controls.fadeDistance,
  })

  return null
}

export const Scene = () => (
  <WebGPUScene frameloop='always'>
    <VortexTrailsLayer />
  </WebGPUScene>
)
