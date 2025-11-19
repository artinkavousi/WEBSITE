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

export type RippleSheetConfig = {
  resolution?: number
  span?: number
  amplitude?: number
  speed?: number
  decay?: number
  size?: number
  colorA?: [number, number, number]
  colorB?: [number, number, number]
}

const defaultConfig: Required<RippleSheetConfig> = {
  resolution: 96,
  span: 10,
  amplitude: 0.9,
  speed: 1.1,
  decay: 0.65,
  size: 0.055,
  colorA: [0.15, 0.65, 1.0],
  colorB: [0.95, 0.45, 0.8],
}

type RippleResources = {
  mesh: InstancedMesh
  material: SpriteNodeMaterial
  updateCompute: ReturnType<typeof createUpdateCompute>
}

const createUpdateCompute = (
  positions: ReturnType<typeof storage>,
  cfg: Required<RippleSheetConfig>,
) => {
  const resolution = uniform(cfg.resolution)
  const span = uniform(cfg.span)
  const amplitude = uniform(cfg.amplitude)
  const speed = uniform(cfg.speed)
  const decay = uniform(cfg.decay)

  return tslFn(() => {
    const idx = instanceIndex.toFloat()
    const ix = idx.mod(resolution)
    const iy = idx.div(resolution).floor()
    const uvX = ix.div(resolution).mul(2).sub(1)
    const uvY = iy.div(resolution).mul(2).sub(1)

    const centerA = vec2(timerGlobal(0.3).sin().mul(0.4).sub(0.4), timerGlobal(0.2).cos().mul(0.35))
    const centerB = vec2(timerGlobal(0.25).cos().mul(0.35).add(0.35), timerGlobal(0.22).sin().mul(0.45))

    const dA = length(vec3(uvX.sub(centerA.x), 0, uvY.sub(centerA.y)))
    const dB = length(vec3(uvX.sub(centerB.x), 0, uvY.sub(centerB.y)))

    const rippleA = sin(dA.mul(10).sub(timerGlobal(1.4))).mul(float(1).sub(dA.mul(0.8)).max(0))
    const rippleB = sin(dB.mul(12).sub(timerGlobal(1.8))).mul(float(1).sub(dB.mul(0.85)).max(0))

    const combined = rippleA.add(rippleB)
    const falloff = clamp(float(1).sub(length(vec3(uvX, 0, uvY)).mul(decay)), 0.0, 1.0)
    const height = combined.mul(amplitude).mul(falloff)

    const pos = positions.element(instanceIndex)
    pos.xyz.assign(vec3(uvX.mul(span * 0.5), height.mul(speed), uvY.mul(span * 0.5)))
    pos.w.assign(height)
  }).compute(cfg.resolution * cfg.resolution)
}

const createMaterial = (positions: ReturnType<typeof storage>, cfg: Required<RippleSheetConfig>) => {
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
    const bias = tanh(h.mul(1.4)).add(1.0).mul(0.5)
    return mix(colorA, colorB, bias)
  })()

  mat.opacityNode = tslFn(() => {
    const h = positions.toAttribute().w.abs()
    const cameraFade = max(0.0, float(1).sub(length(positions.toAttribute().xyz.sub(cameraPosition.xyz)).mul(0.08)))
    const soft = uv().sub(vec2(0.5)).length().oneMinus()
    return soft.mul(h.mul(amplitude.oneOver()).clamp(0.35, 1.0)).mul(cameraFade)
  })()

  return mat
}

export const useRippleSheet = (config: RippleSheetConfig = {}) => {
  const cfg = { ...defaultConfig, ...config }
  const { gl, scene } = useThree()

  const resources = useMemo<RippleResources>(() => {
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
