import { Fn, positionLocal, vec3 } from 'three/tsl'
import { createLayeredNoiseSurface } from '@/tsl/materials/layered_noise_surface'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { screenSize } from 'three/tsl'

type LayeredSurfaceControls = {
  scale?: number
  speed?: number
  roughness?: number
  metalness?: number
}

/**
 * Mesh-based sketch showcasing the layered noise surface material.
 */
const layeredSurfaceSketch = (controls: LayeredSurfaceControls = {}) => {
  const { scale = 1.5, speed = 0.08, roughness = 0.4, metalness = 0.15 } = controls

  const mat = createLayeredNoiseSurface({
    scale,
    speed,
    roughness,
    metalness,
    colorA: vec3(0.15, 0.35, 0.75),
    colorB: vec3(0.9, 0.95, 1.0),
  })

  const Sketch = Fn(() => {
    const _uv = screenAspectUV(screenSize)
    mat.normalNode = positionLocal.add(vec3(_uv, 0.0)).normalize()
    return mat
  })

  return Sketch()
}

export default layeredSurfaceSketch
