/**
 * @module particles/flowSystem
 * @description Particle system following vector field flow (e.g., curl noise)
 * 
 * Particles advect through a vector field, creating fluid-like trails.
 * Integrates with field modules for dynamic, organic motion.
 */

import { Fn, vec3, float, uniform } from 'three/tsl'
import type { ParticleCpuKernel, ParticleSystemConfig, VectorField } from '../core/engineTypes'
import { createCurlNoise } from '../fields/curlNoise'

export interface FlowConfig {
  /** Vector field to follow */
  field?: VectorField
  /** Flow strength multiplier */
  flowStrength?: number
  /** Particle lifetime before respawn (0 = infinite) */
  lifetime?: number
  /** Respawn boundary box half-extents */
  spawnBounds?: [number, number, number]
  /** Particle count */
  count?: number
  /** Integration time step scale */
  timeScale?: number
  /** Velocity damping */
  damping?: number
}

const pseudoNoise = (x: number, y: number, z: number): number => {
  return Math.sin(x * 0.73 + y * 0.37 + z * 0.19) + Math.cos(x * 0.11 + y * 0.13 + z * 0.17)
}

const sampleCurlField = (pos: Float32Array, time: number): [number, number, number] => {
  const dx = pseudoNoise(pos[1] + time, pos[2] - time, pos[0])
  const dy = pseudoNoise(pos[2] + time * 0.5, pos[0] - time, pos[1])
  const dz = pseudoNoise(pos[0] + time * 0.25, pos[1] - time * 0.5, pos[2])

  return [dy - dz, dz - dx, dx - dy]
}

const createFlowKernel = (options: {
  flowStrength: number
  lifetime: number
  spawnBounds: [number, number, number]
  damping: number
  timeScale: number
}): ParticleCpuKernel => {
  const kernel: ParticleCpuKernel = {
    init: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const age = ctx.getAttribute('age')

      position[0] = (ctx.random() * 2 - 1) * options.spawnBounds[0]
      position[1] = (ctx.random() * 2 - 1) * options.spawnBounds[1]
      position[2] = (ctx.random() * 2 - 1) * options.spawnBounds[2]

      velocity[0] = velocity[1] = velocity[2] = 0
      age[0] = ctx.random() * Math.max(options.lifetime, 1)
    },
    update: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const age = ctx.getAttribute('age')
      const dt = ctx.deltaTime * options.timeScale

      const curl = sampleCurlField(position, ctx.time * 0.5)
      velocity[0] = velocity[0] * options.damping + curl[0] * options.flowStrength * dt
      velocity[1] = velocity[1] * options.damping + curl[1] * options.flowStrength * dt
      velocity[2] = velocity[2] * options.damping + curl[2] * options.flowStrength * dt

      position[0] += velocity[0] * dt
      position[1] += velocity[1] * dt
      position[2] += velocity[2] * dt

      age[0] += dt
      if (options.lifetime > 0 && age[0] >= options.lifetime) {
        kernel.init?.(ctx)
        return
      }

      for (let i = 0; i < 3; i += 1) {
        const bound = options.spawnBounds[i]
        if (position[i] > bound) position[i] = -bound
        if (position[i] < -bound) position[i] = bound
      }
    },
  }

  return kernel
}

/**
 * Create a flow field particle system
 */
export const createFlowSystem = (config: FlowConfig = {}): ParticleSystemConfig => {
  const {
    field = createCurlNoise({ frequency: 1.0, amplitude: 1.0 }),
    flowStrength = 1.0,
    lifetime = 0,
    spawnBounds = [5, 5, 5],
    count = 2000,
    timeScale = 1.0,
    damping = 0.98,
  } = config

  const uFlowStrength = uniform(flowStrength)
  const uLifetime = uniform(lifetime)
  const uSpawnBounds = uniform(vec3(...spawnBounds))
  const uTimeScale = uniform(timeScale)
  const uDamping = uniform(damping)
  const uTime = uniform(0)

  // Placeholder nodes - full implementation requires compute shaders
  const updateNode = Fn(() => {
    return vec3(0)
  })()

  const initNode = Fn(() => {
    return vec3(0)
  })()

  return {
    name: 'FlowSystem',
    count,
    updateNode,
    initNode,
    uniforms: {
      uFlowStrength,
      uLifetime,
      uSpawnBounds,
      uTimeScale,
      uDamping,
      uTime,
      ...field.uniforms,
    },
    attributes: {
      position: { size: 3, default: [0, 0, 0] },
      velocity: { size: 3, default: [0, 0, 0] },
      age: { size: 1, default: 0 },
    },
    cpuKernel: createFlowKernel({
      flowStrength,
      lifetime,
      spawnBounds,
      damping,
      timeScale,
    }),
  }
}

/**
 * Preset configurations
 */
export const flowPresets = {
  gentle: {
    flowStrength: 0.5,
    lifetime: 10,
    timeScale: 0.8,
    damping: 0.99
  },
  turbulent: {
    flowStrength: 2.0,
    lifetime: 5,
    timeScale: 1.5,
    damping: 0.95
  },
  eternal: {
    flowStrength: 1.0,
    lifetime: 0, // No respawn
    timeScale: 1.0,
    damping: 0.98
  },
  storm: {
    flowStrength: 3.0,
    lifetime: 3,
    timeScale: 2.0,
    damping: 0.9
  }
} as const

