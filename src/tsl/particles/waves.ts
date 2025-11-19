import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, InstancedMesh, PlaneGeometry } from 'three'
import {
  SpriteNodeMaterial,
  StorageInstancedBufferAttribute,
  cameraPosition,
  clamp,
  float,
  instanceIndex,
  length,
  max,
  mix,
  mul,
  sin,
  storage,
  tanh,
  timerGlobal,
  tslFn,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'
import type { WebGPURenderer } from 'three/webgpu'

export type WaveParticlesConfig = {
  resolution?: number
  span?: number
  amplitude?: number
  frequency?: number
  speed?: number
  tilt?: number
  falloff?: number
  size?: number
  colorA?: [number, number, number]
  colorB?: [number, number, number]
}

const defaultConfig: Required<WaveParticlesConfig> = {
  resolution: 96,
  span: 8,
  amplitude: 0.75,
  frequency: 2.5,
  speed: 1.25,
  tilt: 0.35,
  falloff: 0.6,
  size: 0.05,
  colorA: [0.2, 0.65, 1.0],
  colorB: [1.0, 0.4, 0.65],
}

type WaveResources = {
  mesh: InstancedMesh
  material: SpriteNodeMaterial
  updateCompute: ReturnType<typeof createUpdateCompute>
}

const createUpdateCompute = (
  positions: ReturnType<typeof storage>,
  cfg: Required<WaveParticlesConfig>,
) => {
  const resolution = uniform(cfg.resolution)
  const span = uniform(cfg.span)
  const amplitude = uniform(cfg.amplitude)
  const frequency = uniform(cfg.frequency)
  const speed = uniform(cfg.speed)
  const tilt = uniform(cfg.tilt)
  const falloff = uniform(cfg.falloff)

  return tslFn(() => {
    const idx = instanceIndex.toFloat()
    const ix = idx.mod(resolution)
    const iy = idx.div(resolution).floor()

    const uvX = ix.div(resolution).mul(2).sub(1)
    const uvY = iy.div(resolution).mul(2).sub(1)

    const radial = uvX.mul(uvX).add(uvY.mul(uvY)).sqrt()
    const attenuate = clamp(float(1).sub(radial.pow(2).mul(falloff)), 0.0, 1.0)

    const wavePhase = uvX.mul(tilt).add(uvY).mul(frequency).add(timerGlobal(speed))
    const height = sin(wavePhase).mul(amplitude).mul(attenuate)

    const pos = positions.element(instanceIndex)
    pos.xyz.assign(vec3(uvX.mul(span * 0.5), height, uvY.mul(span * 0.5)))
    pos.w.assign(height)
  }).compute(cfg.resolution * cfg.resolution)
}

const createMaterial = (
  positions: ReturnType<typeof storage>,
  cfg: Required<WaveParticlesConfig>,
) => {
  const mat = new SpriteNodeMaterial()
  mat.transparent = true
  mat.blending = AdditiveBlending
  mat.depthWrite = false
  mat.positionNode = positions.toAttribute()
  mat.scaleNode = vec2(cfg.size)

  const colorA = vec3(cfg.colorA[0], cfg.colorA[1], cfg.colorA[2])
  const colorB = vec3(cfg.colorB[0], cfg.colorB[1], cfg.colorB[2])
  const amplitude = uniform(cfg.amplitude)

  mat.colorNode = tslFn(() => {
    const h = positions.toAttribute().w
    const bias = tanh(h.mul(2.0)).add(1.0).mul(0.5)
    return mix(colorA, colorB, bias)
  })()

  mat.opacityNode = tslFn(() => {
    const h = positions.toAttribute().w.abs()
    const cameraFade = max(0.0, float(1).sub(length(positions.toAttribute().xyz.sub(cameraPosition.xyz)).mul(0.08)))
    const soft = uv().sub(vec2(0.5)).length().oneMinus()
    return soft.mul(h.mul(amplitude.oneOver()).clamp(0.4, 1.0)).mul(cameraFade)
  })()

  return mat
}

export const useWaveParticles = (config: WaveParticlesConfig = {}) => {
  const cfg = { ...defaultConfig, ...config }
  const { gl, scene } = useThree()

  const resources = useMemo<WaveResources>(() => {
    const count = cfg.resolution * cfg.resolution
    const positions = storage(new StorageInstancedBufferAttribute(count, 4), 'vec4', count)
    const material = createMaterial(positions, cfg)
    const geometry = new PlaneGeometry(0.08, 0.08)
    const mesh = new InstancedMesh(geometry, material, count)
    const updateCompute = createUpdateCompute(positions, cfg)
    return { mesh, material, updateCompute }
  }, [cfg])

  useEffect(() => {
    const renderer = gl as WebGPURenderer
    if (!renderer || !renderer.computeAsync) return
    renderer.computeAsync(resources.updateCompute)

    return () => {
      resources.material.dispose()
      resources.mesh.geometry.dispose()
    }
  }, [gl, resources])

  useFrame(() => {
    const renderer = gl as WebGPURenderer
    if (!renderer) return
    if (renderer.compute) {
      renderer.compute(resources.updateCompute)
    } else if (renderer.computeAsync) {
      renderer.computeAsync(resources.updateCompute)
    }
  })

  useEffect(() => {
    scene.add(resources.mesh)
    return () => {
      scene.remove(resources.mesh)
    }
  }, [resources.mesh, scene])

  return resources.mesh
}
