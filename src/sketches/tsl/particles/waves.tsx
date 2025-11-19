/**
 * @sketch tsl/particles/waves
 * @description GPU wave field particles driven by TSL compute updates.
 */

import { useControls } from 'leva'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { useWaveParticles } from '@/tsl/particles/waves'
import { color } from 'three/tsl'

const wavesBackground = color(0x05070c)

export default wavesBackground

const WaveParticlesLayer = () => {
  const controls = useControls('Wave Particles', {
    resolution: { value: 96, min: 32, max: 192, step: 16 },
    span: { value: 8, min: 2, max: 16, step: 0.5 },
    amplitude: { value: 0.75, min: 0.1, max: 2, step: 0.05 },
    frequency: { value: 2.5, min: 0.5, max: 6, step: 0.1 },
    speed: { value: 1.25, min: 0.1, max: 4, step: 0.05 },
    tilt: { value: 0.35, min: -1, max: 1, step: 0.05 },
    falloff: { value: 0.6, min: 0.1, max: 1.5, step: 0.05 },
    size: { value: 0.05, min: 0.01, max: 0.15, step: 0.005 },
  })

  useWaveParticles({
    resolution: controls.resolution,
    span: controls.span,
    amplitude: controls.amplitude,
    frequency: controls.frequency,
    speed: controls.speed,
    tilt: controls.tilt,
    falloff: controls.falloff,
    size: controls.size,
  })

  return null
}

export const Scene = () => (
  <WebGPUScene frameloop='always'>
    <WaveParticlesLayer />
  </WebGPUScene>
)
