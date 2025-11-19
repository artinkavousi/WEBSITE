/**
 * @module particles/attractorSystem
 * @description Particle system with gravitational attraction to one or more points
 * 
 * Classic particle-field interaction where particles are attracted to
 * or repelled from attractor points using inverse-square law (or custom falloff).
 */

import { Fn, vec3, float, uniform } from 'three/tsl'
import type { ParticleCpuKernel, ParticleSystemConfig } from '../core/engineTypes'

export interface AttractorConfig {
  /** Attractor positions in world space */
  attractors?: Array<[number, number, number]>
  /** Strength of attraction (negative = repulsion) */
  strength?: number
  /** Falloff exponent (2.0 = inverse square, 1.0 = linear) */
  falloff?: number
  /** Minimum distance to prevent singularities */
  minDistance?: number
  /** Maximum influence distance */
  maxDistance?: number
  /** Particle count */
  count?: number
  /** Damping factor (0 = no damping, 1 = full stop) */
  damping?: number
  /** Initial velocity scale */
  initialVelocity?: number
  /** Spawn radius for initial positions */
  spawnRadius?: number
}

const randomInRange = (random: () => number, min: number, max: number): number => {
  return min + (max - min) * random()
}

const length = (vec: Float32Array): number => {
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2])
}

const createAttractorKernel = (
  attractors: Array<[number, number, number]>,
  options: {
    strength: number
    falloff: number
    minDistance: number
    maxDistance: number
    damping: number
    initialVelocity: number
    spawnRadius: number
  },
): ParticleCpuKernel => {
  return {
    init: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const radius = options.spawnRadius

      position[0] = randomInRange(ctx.random, -radius, radius)
      position[1] = randomInRange(ctx.random, -radius, radius)
      position[2] = randomInRange(ctx.random, -radius, radius)

      velocity[0] = randomInRange(ctx.random, -options.initialVelocity, options.initialVelocity)
      velocity[1] = randomInRange(ctx.random, -options.initialVelocity, options.initialVelocity)
      velocity[2] = randomInRange(ctx.random, -options.initialVelocity, options.initialVelocity)
    },
    update: (ctx) => {
      const { strength, falloff, minDistance, maxDistance, damping } = options
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const dt = ctx.deltaTime

      let ax = 0
      let ay = 0
      let az = 0

      attractors.forEach(([x, y, z]) => {
        const dx = x - position[0]
        const dy = y - position[1]
        const dz = z - position[2]
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), minDistance)

        if (dist > maxDistance) return

        const falloffTerm = strength / Math.pow(dist, falloff)
        ax += (dx / dist) * falloffTerm
        ay += (dy / dist) * falloffTerm
        az += (dz / dist) * falloffTerm
      })

      velocity[0] = (velocity[0] + ax * dt) * damping
      velocity[1] = (velocity[1] + ay * dt) * damping
      velocity[2] = (velocity[2] + az * dt) * damping

      position[0] += velocity[0] * dt
      position[1] += velocity[1] * dt
      position[2] += velocity[2] * dt

      const distFromOrigin = length(position)
      if (distFromOrigin > maxDistance * 2) {
        const radius = options.spawnRadius
        position[0] = randomInRange(ctx.random, -radius, radius)
        position[1] = randomInRange(ctx.random, -radius, radius)
        position[2] = randomInRange(ctx.random, -radius, radius)
        velocity[0] = 0
        velocity[1] = 0
        velocity[2] = 0
      }
    },
  }
}

/**
 * Create an attractor particle system
 */
export const createAttractorSystem = (config: AttractorConfig = {}): ParticleSystemConfig => {
  const {
    attractors = [[0, 0, 0]],
    strength = 1.0,
    falloff = 2.0,
    minDistance = 0.1,
    maxDistance = 10.0,
    count = 1000,
    damping = 0.95,
    initialVelocity = 0.1,
    spawnRadius = maxDistance,
  } = config

  const uStrength = uniform(strength)
  const uFalloff = uniform(falloff)
  const uMinDist = uniform(minDistance)
  const uMaxDist = uniform(maxDistance)
  const uDamping = uniform(damping)

  // Placeholder nodes - full implementation requires compute shaders
  const updateNode = Fn(() => {
    return vec3(0)
  })()

  const initNode = Fn(() => {
    return vec3(0)
  })()

  return {
    name: 'AttractorSystem',
    count,
    updateNode,
    initNode,
    uniforms: {
      uStrength,
      uFalloff,
      uMinDist,
      uMaxDist,
      uDamping,
    },
    attributes: {
      position: { size: 3, default: [0, 0, 0] },
      velocity: { size: 3, default: [0, 0, 0] },
    },
    cpuKernel: createAttractorKernel(attractors, {
      strength,
      falloff,
      minDistance,
      maxDistance,
      damping,
      initialVelocity,
      spawnRadius,
    }),
  }
}

/**
 * Preset configurations
 */
export const attractorPresets = {
  singleCenter: {
    attractors: [[0, 0, 0]],
    strength: 2.0,
    falloff: 2.0,
    maxDistance: 8.0,
    damping: 0.98
  },
  binary: {
    attractors: [[-2, 0, 0], [2, 0, 0]],
    strength: 1.5,
    falloff: 2.0,
    maxDistance: 6.0,
    damping: 0.96
  },
  orbital: {
    attractors: [[0, 0, 0]],
    strength: 3.0,
    falloff: 2.0,
    minDistance: 0.5,
    maxDistance: 10.0,
    damping: 0.99,
    initialVelocity: 0.5
  },
  chaos: {
    attractors: [[2, 2, 0], [-2, -2, 0], [0, 0, 3], [0, 0, -3]],
    strength: 1.0,
    falloff: 1.8,
    maxDistance: 12.0,
    damping: 0.95,
    initialVelocity: 0.2
  }
} as const

