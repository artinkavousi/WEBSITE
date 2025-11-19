/**
 * @sketch tsl/particles/linked_particles
 * @description Port of the linked particles WebGPU demo using TSL compute/storage buffers.
 */

import { useControls } from 'leva'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { useLinkedParticles } from '@/tsl/particles/linked_particles'
import { color } from 'three/tsl'

const linkedParticlesBackground = color(0x05060a)

export default linkedParticlesBackground

const LinkedParticlesLayer = () => {
  const controls = useControls('Linked Particles', {
    count: { value: 8192, min: 1024, max: 32768, step: 1024 },
    size: { value: 0.06, min: 0.01, max: 0.25, step: 0.005 },
    lifetime: { value: 1.2, min: 0.4, max: 3, step: 0.1 },
    timeScale: { value: 1, min: 0.1, max: 2, step: 0.05 },
    turbulenceFrequency: { value: 0.35, min: 0.05, max: 1.25, step: 0.05 },
    turbulenceAmplitude: { value: 0.8, min: 0.1, max: 2, step: 0.05 },
    colorRotation: { value: 1, min: 0, max: 4, step: 0.05 },
    colorVariance: { value: 2.5, min: 0, max: 5, step: 0.05 },
  })

  useLinkedParticles({
    count: controls.count,
    size: controls.size,
    lifetime: controls.lifetime,
    timeScale: controls.timeScale,
    turbulence: {
      frequency: controls.turbulenceFrequency,
      amplitude: controls.turbulenceAmplitude,
      octaves: 3,
      lacunarity: 2,
      gain: 0.5,
      friction: 0.02,
    },
    colorRotation: controls.colorRotation,
    colorVariance: controls.colorVariance,
  })

  return null
}

export const Scene = () => (
  <WebGPUScene frameloop='always'>
    <LinkedParticlesLayer />
  </WebGPUScene>
)
