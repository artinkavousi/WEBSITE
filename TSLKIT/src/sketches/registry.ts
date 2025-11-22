import flare1 from './flare-1'
import dawn1 from './nested/dawn-1'
import layeredSurfaceSketch from './materials/layered-surface-1'
import { ControlSchema } from '@/components/controls'
import { grainVignette } from '@/tsl/presets/postfx/grain_vignette'

export type SketchEntry = {
  id: string
  title: string
  path: string
  colorNode: (controls?: Record<string, any>) => any
  postEffect?: (params: { input: any; inputUV?: any; controls?: Record<string, any> }) => any
  controls?: ControlSchema
  tags?: string[]
}

export const sketches: SketchEntry[] = [
  {
    id: 'flare-1',
    title: 'Flare 1',
    path: 'flare-1',
    colorNode: flare1,
    controls: {
      grainAmount: { value: 0.1, min: 0, max: 0.4, step: 0.01 },
      paletteShift: { value: 0, min: -1, max: 1, step: 0.01 },
      bandBoost: { value: 1, min: 0.5, max: 2, step: 0.01 },
      postGrainIntensity: { value: 0.12, min: 0, max: 0.3, step: 0.01 },
      postGrainScale: { value: 1.4, min: 0.2, max: 3, step: 0.05 },
      postVignetteSmoothing: { value: 0.25, min: 0, max: 1, step: 0.01 },
      postVignetteExponent: { value: 5, min: 1, max: 10, step: 0.1 },
    },
    postEffect: ({ input, controls = {} }) =>
      grainVignette({
        input,
        intensity: controls.postGrainIntensity,
        scale: controls.postGrainScale,
        smoothing: controls.postVignetteSmoothing,
        exponent: controls.postVignetteExponent,
      }),
    tags: ['gradient', 'grain'],
  },
  {
    id: 'nested-dawn-1',
    title: 'Dawn 1',
    path: 'nested/dawn-1',
    colorNode: dawn1,
    controls: {
      grainAmount: { value: 0.2, min: 0, max: 0.6, step: 0.01 },
      paletteOffset: { value: 0.5, min: -1, max: 1, step: 0.01 },
      timeSpeed: { value: 0.01, min: 0, max: 0.05, step: 0.001 },
      postGrainIntensity: { value: 0.08, min: 0, max: 0.25, step: 0.01 },
      postGrainScale: { value: 1.1, min: 0.2, max: 3, step: 0.05 },
      postVignetteSmoothing: { value: 0.35, min: 0, max: 1, step: 0.01 },
      postVignetteExponent: { value: 4, min: 1, max: 10, step: 0.1 },
    },
    postEffect: ({ input, controls = {} }) =>
      grainVignette({
        input,
        intensity: controls.postGrainIntensity,
        scale: controls.postGrainScale,
        smoothing: controls.postVignetteSmoothing,
        exponent: controls.postVignetteExponent,
      }),
    tags: ['gradient', 'palette'],
  },
  {
    id: 'layered-surface-1',
    title: 'Layered Noise Surface',
    path: 'materials/layered-surface-1',
    colorNode: layeredSurfaceSketch,
    controls: {
      scale: { value: 1.5, min: 0.5, max: 3, step: 0.05 },
      speed: { value: 0.08, min: 0, max: 0.25, step: 0.005 },
      roughness: { value: 0.4, min: 0, max: 1, step: 0.01 },
      metalness: { value: 0.15, min: 0, max: 1, step: 0.01 },
      postGrainIntensity: { value: 0.06, min: 0, max: 0.25, step: 0.005 },
      postGrainScale: { value: 1.0, min: 0.2, max: 3, step: 0.05 },
      postVignetteSmoothing: { value: 0.25, min: 0, max: 1, step: 0.01 },
      postVignetteExponent: { value: 5, min: 1, max: 10, step: 0.1 },
    },
    postEffect: ({ input, controls = {} }) =>
      grainVignette({
        input,
        intensity: controls.postGrainIntensity,
        scale: controls.postGrainScale,
        smoothing: controls.postVignetteSmoothing,
        exponent: controls.postVignetteExponent,
      }),
    tags: ['material', 'fbm'],
  },
]

export const defaultSketch = sketches[0]

export const findSketchByPath = (path: string) => sketches.find((sketch) => sketch.path === path || sketch.id === path)
