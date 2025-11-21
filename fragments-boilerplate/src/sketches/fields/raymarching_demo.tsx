// @ts-nocheck
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { Fn, vec3, vec2, uv, float, time, sin, cos, mix, smoothstep } from 'three/tsl'
import { sdSphere, sdBox, sdTorus, sdCylinder } from '@/tsl/fields/sdf/shapes'
import { smin } from '@/tsl/fields/sdf/operations'
import { palettes } from '@/tsl/utils/color/palettes'

/**
 * Raymarching demo using the updated SDF Primitives.
 * This is a TSL implementation of a basic raymarcher (Raycasting actually, fixed steps).
 * Note: Real TSL raymarching loops are complex to set up due to loop unrolling/structure.
 * For this demo, we might fake it or do a simple fixed-step loop if supported.
 *
 * Actually, r181 `Loop` works well.
 */
const raymarchSketch = Fn(() => {
  const _uv = uv().sub(0.5).mul(2.0) // -1 to 1
  // Aspect ratio fix would be good here, but keeping simple

  const ro = vec3(0, 0, 3) // Ray Origin
  const rd = vec3(_uv, -1.5).normalize() // Ray Direction

  // Rotate scene
  const t = time.mul(0.5)
  const s = sin(t)
  const c = cos(t)
  // Simple Y rotation
  const rotatedRo = vec3(ro.x.mul(c).sub(ro.z.mul(s)), ro.y, ro.x.mul(s).add(ro.z.mul(c)))

  // We'll just map distance to color for a "slice" or do a few steps
  // Full raymarching loop in TSL:

  // Map function
  const map = (p: any) => {
    // Rotate p for objects
    const q = vec3(p.x.mul(c).add(p.z.mul(s)), p.y, p.x.mul(s).negate().add(p.z.mul(c)))

    // Sphere
    const d1 = sdSphere(q.sub(vec3(0, 0, 0)), float(0.5))

    // Torus orbiting
    const q2 = q.sub(vec3(sin(time), cos(time), 0).mul(1.2))
    const d2 = sdTorus(q2, vec2(0.3, 0.1))

    // Box
    const d3 = sdBox(q.sub(vec3(1.5, 0, 0)), vec3(0.3))

    return smin(d1, smin(d2, d3, float(0.2)), float(0.2))
  }

  // Simplified Raymarch Loop (fixed steps for demo)
  // Note: TSL Loops can be tricky. Let's try a simple visualizer
  // that visualizes the SDF field at Z=0 plane for stability first,
  // or do a limited loop.

  // Let's visualize the field at a slice to verify shapes
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

export default function RaymarchingDemo() {
  return (
    <WebGPUScene>
      <WebGPUSketch colorNode={raymarchSketch()} />
    </WebGPUScene>
  )
}
