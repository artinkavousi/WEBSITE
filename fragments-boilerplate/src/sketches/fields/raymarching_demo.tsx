// @ts-nocheck
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { Fn, vec3, vec2, uv, float, time, sin, cos, mix, smoothstep } from 'three/tsl'
import { sdSphere, sdBox, sdTorus, sdCylinder } from '@/tsl/fields/sdf/shapes'
import { smin } from '@/tsl/fields/sdf/operations'
import { palettes } from '@/tsl/utils/color/palettes'

export const Config: SketchConfig = {
  meta: {
    name: 'Raymarching Demo',
    description: 'SDF raymarch demo layering noise + lighting',
  },
  settings: {
    camera: {
      type: 'orthographic',
    },
  },
  controls: {},
}

/**
 * Raymarching demo using the updated SDF Primitives.
 * This is a TSL implementation of a basic raymarcher (Raycasting actually, fixed steps).
 */
const raymarchSketch = Fn(() => {
  const _uv = uv().sub(0.5).mul(2.0) // -1 to 1
  // Aspect ratio fix would be good here, but keeping simple

  const t = time.mul(0.5)
  const s = sin(t)
  const c = cos(t)

  // Simple visualizer that visualizes the SDF field at Z=0 plane for stability first
  const sliceP = vec3(_uv.mul(2.0), 0) // Z=0 plane
  // Add rotation
  const q = vec3(sliceP.x.mul(c).sub(sliceP.z.mul(s)), sliceP.y, sliceP.x.mul(s).add(sliceP.z.mul(c)))

  // Testing 3D shapes
  const dBox = sdBox(q, vec3(0.5))
  const dTorus = sdTorus(q, vec2(0.8, 0.2))
  const dSphere = sdSphere(q.sub(vec3(1.0, 0.5, 0.0)), float(0.4))
  const dCyl = sdCylinder(q.sub(vec3(-1.0, -0.5, 0.0)), vec2(0.3, 0.8))

  const d = smin(dBox, dTorus, float(0.1))
  const finalD = smin(d, smin(dSphere, dCyl, float(0.1)), float(0.1))

  // Visualization: coloring based on distance
  const col = palettes.heat(finalD.mul(2.0).add(0.5))
  const lines = sin(finalD.mul(50.0)).smoothstep(0.95, 1.0)

  // Interior mask
  const mask = smoothstep(0.01, 0.0, finalD)

  return mix(col, vec3(1), lines).mix(vec3(0.1), mask.mul(0.5))
})

function RaymarchingScene() {
  return <WebGPUSketch colorNode={raymarchSketch()} />
}

export default function RaymarchingDemo() {
  return <SketchWrapper sketch={RaymarchingScene} config={Config} />
}
