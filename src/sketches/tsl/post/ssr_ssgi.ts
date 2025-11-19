import { useControls } from 'leva'
import { PerspectiveCamera } from 'three/webgpu'
import { createPreviewPass } from '@/tsl/post/ssr'

const camera = new PerspectiveCamera(40, 1, 0.1, 100)
const preview = createPreviewPass(camera)

const ssrSsgiSketch = () => preview.outputNode

export const Scene = () => {
  useControls('SSR + SSGI', {
    ssrMaxDistance: {
      value: preview.ssrPass.maxDistance.value,
      min: 0.5,
      max: 20,
      step: 0.1,
      onChange: (value) => (preview.ssrPass.maxDistance.value = value),
    },
    ssrThickness: {
      value: preview.ssrPass.thickness.value,
      min: 0.001,
      max: 0.05,
      step: 0.001,
      onChange: (value) => (preview.ssrPass.thickness.value = value),
    },
    ssrResolutionScale: {
      value: preview.ssrPass.resolutionScale,
      min: 0.25,
      max: 1,
      step: 0.05,
      onChange: (value) => (preview.ssrPass.resolutionScale = value),
    },
    ssrBlurQuality: {
      value: preview.ssrPass.blurQuality.value,
      min: 0,
      max: 2,
      step: 1,
      onChange: (value) => (preview.ssrPass.blurQuality.value = value),
    },
    giSliceCount: {
      value: preview.giPass.sliceCount.value,
      min: 1,
      max: 8,
      step: 1,
      onChange: (value) => (preview.giPass.sliceCount.value = value),
    },
    giStepCount: {
      value: preview.giPass.stepCount.value,
      min: 4,
      max: 32,
      step: 1,
      onChange: (value) => (preview.giPass.stepCount.value = value),
    },
    giAoIntensity: {
      value: preview.giPass.aoIntensity.value,
      min: 0,
      max: 2,
      step: 0.01,
      onChange: (value) => (preview.giPass.aoIntensity.value = value),
    },
  })

  return null
}

export default ssrSsgiSketch
