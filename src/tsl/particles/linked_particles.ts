import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, InstancedMesh, PlaneGeometry } from 'three'
import {
  SpriteNodeMaterial,
  StorageInstancedBufferAttribute,
  cameraPosition,
  float,
  instanceIndex,
  max,
  mix,
  mx_fractal_noise_vec3,
  pcurve,
  PI,
  step,
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

export type LinkedParticlesConfig = {
  count?: number
  size?: number
  lifetime?: number
  timeScale?: number
  turbulence?: {
    frequency: number
    amplitude: number
    octaves: number
    lacunarity: number
    gain: number
    friction: number
  }
  colorRotation?: number
  colorVariance?: number
  fadeDistance?: number
}

const defaultConfig: Required<LinkedParticlesConfig> = {
  count: 8192,
  size: 0.06,
  lifetime: 1.2,
  timeScale: 1,
  turbulence: {
    frequency: 0.35,
    amplitude: 0.8,
    octaves: 3,
    lacunarity: 2,
    gain: 0.5,
    friction: 0.02,
  },
  colorRotation: 1,
  colorVariance: 2.5,
  fadeDistance: 9,
}

type LinkedParticlesResources = {
  mesh: InstancedMesh
  material: SpriteNodeMaterial
  initCompute: ReturnType<typeof createInitCompute>
  updateCompute: ReturnType<typeof createUpdateCompute>
}

const createInitCompute = (
  positions: ReturnType<typeof storage>,
  velocities: ReturnType<typeof storage>,
  count: number,
) =>
  tslFn(() => {
    positions.element(instanceIndex).xyz.assign(vec3(0))
    positions.element(instanceIndex).w.assign(float(-1))
    velocities.element(instanceIndex).xyz.assign(vec3(0))
  }).compute(count)

const createUpdateCompute = (
  positions: ReturnType<typeof storage>,
  velocities: ReturnType<typeof storage>,
  config: Required<LinkedParticlesConfig>,
  count: number,
) => {
  const timeScale = uniform(config.timeScale)
  const lifetime = uniform(config.lifetime)
  const turbFrequency = uniform(config.turbulence.frequency)
  const turbAmplitude = uniform(config.turbulence.amplitude)
  const turbOctaves = uniform(config.turbulence.octaves)
  const turbLacunarity = uniform(config.turbulence.lacunarity)
  const turbGain = uniform(config.turbulence.gain)
  const turbFriction = uniform(config.turbulence.friction)

  const spawnRadius = uniform(0.8)

  return tslFn(() => {
    const p = positions.element(instanceIndex)
    const v = velocities.element(instanceIndex)
    const dt = timerDelta().mul(timeScale)

    const life = p.w.toVar()

    // respawn particles when lifetime runs out
    if (life.lessThanEqual(0.0)) {
      const angle = timerGlobal(1.0).add(instanceIndex.toFloat().mul(0.123)).sin().mul(PI)
      const radius = spawnRadius.mul(0.5).add(spawnRadius.mul(0.5).mul(timerGlobal(0.25).sin().abs()))
      p.xyz.assign(vec3(angle.sin().mul(radius), angle.cos().mul(radius), 0.0))
      v.xyz.assign(vec3(0))
      life.assign(lifetime)
    }

    // turbulence-driven velocity field
    const flow = mx_fractal_noise_vec3(
      p.xyz.mul(turbFrequency).add(timerGlobal(0.25)),
      turbOctaves,
      turbLacunarity,
      turbGain,
    )
    v.xyz.assign(v.xyz.add(flow.mul(turbAmplitude).mul(dt)).mul(float(1).sub(turbFriction.mul(dt))))

    // integrate
    p.xyz.assign(p.xyz.add(v.xyz.mul(dt)))
    life.assign(life.sub(dt))
    p.w.assign(life)
  }).compute(count)
}

const createMaterial = (
  positions: ReturnType<typeof storage>,
  velocities: ReturnType<typeof storage>,
  config: Required<LinkedParticlesConfig>,
) => {
  const mat = new SpriteNodeMaterial()
  mat.transparent = true
  mat.blending = AdditiveBlending
  mat.depthWrite = false
  mat.positionNode = positions.toAttribute()
  mat.scaleNode = vec2(config.size)
  mat.rotationNode = velocities.toAttribute().xy.atan2()

  const colorRotation = uniform(config.colorRotation)
  const colorVariance = uniform(config.colorVariance)
  const fadeDistance = uniform(config.fadeDistance * config.fadeDistance)

  mat.colorNode = tslFn(() => {
    const idx = instanceIndex.toFloat()
    const hueShift = timerGlobal(colorRotation).add(idx.mul(0.01)).sin().mul(0.5).add(0.5)
    const band = mx_fractal_noise_vec3(vec3(idx.mul(0.01)), 2, 2.0, 0.5).abs()
    const cool = vec3(0.2, 0.6, 1.0)
    const warm = vec3(1.0, 0.4, 0.8)
    const base = cool.mix(warm, hueShift)
    const variance = mix(float(1), colorVariance, band.x)
    return base.mul(variance)
  })()

  mat.opacityNode = tslFn(() => {
    const life = positions.toAttribute().w
    const lifeFade = pcurve(life.div(config.lifetime), 2.0, 1.0)
    const camDist = positions.toAttribute().xyz.sub(cameraPosition.xyz).lengthSq()
    const camFade = max(0.0, step(0.0, camDist.sub(fadeDistance)).oneMinus())
    const hex = vec2(uv().x, uv().y).sub(0.5).length().oneMinus()
    return hex.mul(lifeFade).mul(camFade)
  })()

  return mat
}

export const useLinkedParticles = (config: LinkedParticlesConfig = {}) => {
  const resolved = { ...defaultConfig, ...config, turbulence: { ...defaultConfig.turbulence, ...config.turbulence } }
  const { gl, scene } = useThree()

  const resources = useMemo<LinkedParticlesResources>(() => {
    const positions = storage(new StorageInstancedBufferAttribute(resolved.count, 4), 'vec4', resolved.count)
    const velocities = storage(new StorageInstancedBufferAttribute(resolved.count, 4), 'vec4', resolved.count)

    const material = createMaterial(positions, velocities, resolved)
    const geometry = new PlaneGeometry(0.08, 0.08)
    const mesh = new InstancedMesh(geometry, material, resolved.count)

    const initCompute = createInitCompute(positions, velocities, resolved.count)
    const updateCompute = createUpdateCompute(positions, velocities, resolved, resolved.count)

    return { mesh, material, initCompute, updateCompute }
  }, [resolved.count, resolved.turbulence.amplitude, resolved.turbulence.frequency])

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

export const linkedParticlesConfigControls = {
  count: defaultConfig.count,
  size: defaultConfig.size,
  lifetime: defaultConfig.lifetime,
  timeScale: defaultConfig.timeScale,
  turbulenceFrequency: defaultConfig.turbulence.frequency,
  turbulenceAmplitude: defaultConfig.turbulence.amplitude,
  colorRotation: defaultConfig.colorRotation,
  colorVariance: defaultConfig.colorVariance,
}
