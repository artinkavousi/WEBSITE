import { MeshStandardNodeMaterial } from 'three/webgpu'
import { add, Fn, mix, mul, noise2D, time, vec2, vec3 } from 'three/tsl'
import { fbm } from '@/tsl/utils/noise/fbm'

type LayeredNoiseSurfaceProps = {
  colorA?: any
  colorB?: any
  roughness?: number
  metalness?: number
  speed?: number
  scale?: number
  fbmOctaves?: number
}

/**
 * Simple animated layered-noise standard material.
 */
export const createLayeredNoiseSurface = ({
  colorA = vec3(0.2, 0.4, 0.8),
  colorB = vec3(0.9, 0.9, 0.95),
  roughness = 0.4,
  metalness = 0.15,
  speed = 0.08,
  scale = 1.5,
  fbmOctaves = 4,
}: LayeredNoiseSurfaceProps = {}) => {
  const mat = new MeshStandardNodeMaterial()

  const flowUV = add(vec2(0.0), vec2(scale).mul(time.mul(speed)))
  const baseNoise = fbm(flowUV, fbmOctaves)
  const detailNoise = noise2D(flowUV.mul(2.5))

  const height = baseNoise.mul(0.7).add(detailNoise.mul(0.3))
  const albedo = mix(colorA, colorB, height)

  mat.colorNode = albedo
  mat.roughnessNode = roughness
  mat.metalnessNode = metalness

  return mat
}
