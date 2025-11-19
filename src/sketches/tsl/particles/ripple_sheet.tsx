/**
 * @sketch tsl/particles/ripple_sheet
 * @description Dual-source ripple heightfield driven by TSL compute nodes.
 */

import { useControls } from 'leva'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { useRippleSheet } from '@/tsl/particles/ripple_sheet'
import { color } from 'three/tsl'

const rippleBackground = color(0x05070d)

export default rippleBackground

const RippleSheetLayer = () => {
  const controls = useControls('Ripple Sheet', {
    resolution: { value: 96, min: 32, max: 192, step: 16 },
    span: { value: 10, min: 4, max: 18, step: 0.5 },
    amplitude: { value: 0.9, min: 0.1, max: 2, step: 0.05 },
    speed: { value: 1.1, min: 0.1, max: 3, step: 0.05 },
    decay: { value: 0.65, min: 0.2, max: 1.5, step: 0.05 },
    size: { value: 0.055, min: 0.01, max: 0.15, step: 0.005 },
  })

  useRippleSheet({
    resolution: controls.resolution,
    span: controls.span,
    amplitude: controls.amplitude,
    speed: controls.speed,
    decay: controls.decay,
    size: controls.size,
  })

  return null
}

export const Scene = () => (
  <WebGPUScene frameloop='always'>
    <RippleSheetLayer />
  </WebGPUScene>
)
