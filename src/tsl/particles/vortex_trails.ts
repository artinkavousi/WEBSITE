import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, InstancedMesh, PlaneGeometry } from 'three'
import {
  SpriteNodeMaterial,
  StorageInstancedBufferAttribute,
  PI,
  cameraPosition,
  clamp,
  float,
  instanceIndex,
  length,
  max,
  mix,
  mx_fractal_noise_vec3,
  pcurve,
  storage,
  timerDelta,
  timerGlobal,
  tslFn,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'
import type { WebGPURenderer } from 'three/webgpu'

export type VortexTrailsConfig = {
  count?: number
  size?: number
  speed?: number
  swirlStrength?: number
  radialPull?: number
  noiseAmplitude?: number
  noiseFrequency?: number
  colorShift?: number
  trail?: number
  fadeDistance?: number
}

const defaultConfig: Required<VortexTrailsConfig> = {
  count: 6000,
  size: 0.045,
  speed: 1.1,
  swirlStrength: 0.85,
  radialPull: 0.35,
  noiseAmplitude: 0.45,
  noiseFrequency: 0.6,
  colorShift: 1.3,
  trail: 1.6,
  fadeDistance: 8,
}

type VortexResources = {
  mesh: InstancedMesh
  material: SpriteNodeMaterial
  initCompute: ReturnType<typeof createInitCompute>
  updateCompute: ReturnType<typeof createUpdateCompute>
}

const spawnSeed = (count: number) =>
  tslFn(() => {
    const idx = instanceIndex.toFloat()
    const angle = idx.mul(PI.mul(0.6180339887))
    const radius = idx.div(count).mul(0.6).fract().add(0.2)
    const y = angle.sin().mul(0.65)
    return vec3(angle.cos().mul(radius), y, angle.sin().mul(radius))
  })()

const createInitCompute = (
  positions: ReturnType<typeof storage>,
  velocities: ReturnType<typeof storage>,
  count: number,
) =>
  tslFn(() => {
    const seed = spawnSeed(count)
    positions.element(instanceIndex).xyz.assign(seed)
    positions.element(instanceIndex).w.assign(float(-1))
    velocities.element(instanceIndex).xyz.assign(vec3(0))
  }).compute(count)

const createUpdateCompute = (
  positions: ReturnType<typeof storage>,
  velocities: ReturnType<typeof storage>,
  cfg: Required<VortexTrailsConfig>,
  count: number,
) => {
  const speed = uniform(cfg.speed)
  const swirl = uniform(cfg.swirlStrength)
  const radial = uniform(cfg.radialPull)
  const noiseAmp = uniform(cfg.noiseAmplitude)
  const noiseFreq = uniform(cfg.noiseFrequency)
  const trail = uniform(cfg.trail)

  return tslFn(() => {
    const p = positions.element(instanceIndex)
    const v = velocities.element(instanceIndex)
    const dt = timerDelta().mul(speed)

    const life = p.w.toVar()
    if (life.lessThanEqual(0.0)) {
      const seed = spawnSeed(count)
      p.xyz.assign(seed)
      v.xyz.assign(vec3(0))
      life.assign(trail)
    }

    const radialDir = vec3(p.x, 0.0, p.z)
    const radialLen = length(radialDir).max(0.0001)
    const swirlDir = vec3(radialDir.z.negate(), 0.0, radialDir.x).div(radialLen)
    const swirlForce = swirlDir.mul(swirl)

    const attract = radialDir.negate().mul(radial)
    const noise = mx_fractal_noise_vec3(p.xyz.mul(noiseFreq).add(timerGlobal(0.2)), 3, 2.0, 0.5).mul(noiseAmp)

    v.xyz.assign(v.xyz.add(swirlForce.mul(dt)).add(attract.mul(dt)).add(noise.mul(dt)))
    p.xyz.assign(p.xyz.add(v.xyz.mul(dt)))

    life.assign(life.sub(dt))
    p.w.assign(life)
  }).compute(count)
}

const createMaterial = (
  positions: ReturnType<typeof storage>,
  velocities: ReturnType<typeof storage>,
  cfg: Required<VortexTrailsConfig>,
) => {
  const mat = new SpriteNodeMaterial()
  mat.transparent = true
  mat.blending = AdditiveBlending
  mat.depthWrite = false
  mat.positionNode = positions.toAttribute()
  mat.scaleNode = vec2(cfg.size)

  const colorShift = uniform(cfg.colorShift)
  const fadeDistance = uniform(cfg.fadeDistance * cfg.fadeDistance)

  mat.colorNode = tslFn(() => {
    const idx = instanceIndex.toFloat()
    const hue = timerGlobal(colorShift).add(idx.mul(0.013)).sin().mul(0.5).add(0.5)
    const rim = positions.toAttribute().xyz.normalize().y.mul(0.5).add(0.5)
    const cool = vec3(0.1, 0.35, 0.95)
    const warm = vec3(1.0, 0.45, 0.35)
    return mix(cool, warm, hue.mul(rim))
  })()

  mat.opacityNode = tslFn(() => {
    const life = positions.toAttribute().w
    const lifeFade = pcurve(life.div(cfg.trail), 1.5, 0.75)
    const camDist = positions.toAttribute().xyz.sub(cameraPosition.xyz).lengthSq()
    const camFade = max(0.0, float(1).sub(camDist.div(fadeDistance)))
    const soft = uv().sub(vec2(0.5)).length().oneMinus()
    return soft.mul(lifeFade).mul(camFade)
  })()

  return mat
}

export const useVortexTrails = (config: VortexTrailsConfig = {}) => {
  const cfg = { ...defaultConfig, ...config }
  const { gl, scene } = useThree()

  const resources = useMemo<VortexResources>(() => {
    const positions = storage(new StorageInstancedBufferAttribute(cfg.count, 4), 'vec4', cfg.count)
    const velocities = storage(new StorageInstancedBufferAttribute(cfg.count, 4), 'vec4', cfg.count)
    const material = createMaterial(positions, velocities, cfg)
    const geometry = new PlaneGeometry(0.08, 0.08)
    const mesh = new InstancedMesh(geometry, material, cfg.count)
    const initCompute = createInitCompute(positions, velocities, cfg.count)
    const updateCompute = createUpdateCompute(positions, velocities, cfg, cfg.count)
    return { mesh, material, initCompute, updateCompute }
  }, [cfg])

  useEffect(() => {
    const renderer = gl as WebGPURenderer
    if (!renderer || !renderer.computeAsync) return
    renderer.computeAsync(resources.initCompute)

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
