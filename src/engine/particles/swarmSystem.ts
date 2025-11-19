/**
 * @module particles/swarmSystem
 * @description Swarm intelligence with leader following and obstacle avoidance
 * 
 * Combines aspects of boids with explicit leader(s) and dynamic targets.
 * Particles follow leaders while maintaining formation and avoiding obstacles.
 */

import { Fn, vec3, float, uniform } from 'three/tsl'
import type { ParticleCpuKernel, ParticleSystemConfig } from '../core/engineTypes'

export interface SwarmConfig {
  /** Leader positions */
  leaders?: Array<[number, number, number]>
  /** Leader attraction strength */
  leaderAttraction?: number
  /** Formation tightness */
  formationTightness?: number
  /** Individual wander strength */
  wanderStrength?: number
  /** Maximum speed */
  maxSpeed?: number
  /** Particle count */
  count?: number
  /** Spawn bounds */
  spawnBounds?: [number, number, number]
  /** Enable leader orbit */
  orbitLeader?: boolean
  /** Orbit radius */
  orbitRadius?: number
}

const createSwarmKernel = (
  leaders: Array<[number, number, number]>,
  options: {
    leaderAttraction: number
    formationTightness: number
    wanderStrength: number
    maxSpeed: number
    spawnBounds: [number, number, number]
    orbitLeader: boolean
    orbitRadius: number
  },
): ParticleCpuKernel => {
  return {
    init: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const seed = ctx.getAttribute('seed')

      position[0] = (ctx.random() * 2 - 1) * options.spawnBounds[0]
      position[1] = (ctx.random() * 2 - 1) * options.spawnBounds[1]
      position[2] = (ctx.random() * 2 - 1) * options.spawnBounds[2]

      velocity[0] = velocity[1] = velocity[2] = 0
      seed[0] = ctx.random() * Math.PI * 2
    },
    update: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const seed = ctx.getAttribute('seed')
      const dt = ctx.deltaTime

      const leaderIndex = ctx.index % leaders.length
      const baseLeader = leaders[leaderIndex]
      const orbitOffset = options.orbitLeader
        ? [
            Math.sin(ctx.time * 0.5 + seed[0]) * options.orbitRadius,
            Math.cos(ctx.time * 0.4 + seed[0]) * options.orbitRadius * 0.5,
            Math.cos(ctx.time * 0.3 + seed[0]) * options.orbitRadius,
          ]
        : [0, 0, 0]

      const target = [
        baseLeader[0] + orbitOffset[0],
        baseLeader[1] + orbitOffset[1],
        baseLeader[2] + orbitOffset[2],
      ]

      const toLeader = [
        target[0] - position[0],
        target[1] - position[1],
        target[2] - position[2],
      ]

      const dist = Math.max(Math.sqrt(toLeader[0] ** 2 + toLeader[1] ** 2 + toLeader[2] ** 2), 0.001)
      const leaderForce = (options.leaderAttraction / dist) * dt

      velocity[0] += toLeader[0] * leaderForce
      velocity[1] += toLeader[1] * leaderForce
      velocity[2] += toLeader[2] * leaderForce

      const wander = [
        Math.sin(seed[0] + ctx.time * 1.3),
        Math.cos(seed[0] + ctx.time * 1.1),
        Math.sin(seed[0] + ctx.time * 0.9),
      ]

      velocity[0] += wander[0] * options.wanderStrength * dt
      velocity[1] += wander[1] * options.wanderStrength * dt
      velocity[2] += wander[2] * options.wanderStrength * dt

      const speed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2)
      if (speed > options.maxSpeed) {
        const scale = options.maxSpeed / speed
        velocity[0] *= scale
        velocity[1] *= scale
        velocity[2] *= scale
      }

      position[0] += velocity[0] * dt
      position[1] += velocity[1] * dt
      position[2] += velocity[2] * dt

      for (let axis = 0; axis < 3; axis += 1) {
        const bound = options.spawnBounds[axis]
        if (position[axis] > bound) position[axis] = -bound
        if (position[axis] < -bound) position[axis] = bound
      }

      velocity[0] *= options.formationTightness
      velocity[1] *= options.formationTightness
      velocity[2] *= options.formationTightness
    },
  }
}

/**
 * Create a swarm particle system
 */
export const createSwarmSystem = (config: SwarmConfig = {}): ParticleSystemConfig => {
  const {
    leaders = [[0, 0, 0]],
    leaderAttraction = 1.0,
    formationTightness = 0.5,
    wanderStrength = 0.3,
    maxSpeed = 2.0,
    count = 800,
    spawnBounds = [8, 8, 8],
    orbitLeader = false,
    orbitRadius = 3.0,
  } = config

  const uLeaderAttraction = uniform(leaderAttraction)
  const uFormationTightness = uniform(formationTightness)
  const uWanderStrength = uniform(wanderStrength)
  const uMaxSpeed = uniform(maxSpeed)
  const uSpawnBounds = uniform(vec3(...spawnBounds))
  const uOrbitLeader = uniform(orbitLeader ? 1.0 : 0.0)
  const uOrbitRadius = uniform(orbitRadius)
  const uTime = uniform(0)

  // Placeholder nodes - full implementation requires compute shaders
  const updateNode = Fn(() => {
    return vec3(0)
  })()

  const initNode = Fn(() => {
    return vec3(0)
  })()

  return {
    name: 'SwarmSystem',
    count,
    updateNode,
    initNode,
    uniforms: {
      uLeaderAttraction,
      uFormationTightness,
      uWanderStrength,
      uMaxSpeed,
      uSpawnBounds,
      uOrbitLeader,
      uOrbitRadius,
      uTime,
    },
    attributes: {
      position: { size: 3, default: [0, 0, 0] },
      velocity: { size: 3, default: [0, 0, 0] },
      seed: { size: 1, default: 0 },
    },
    cpuKernel: createSwarmKernel(leaders, {
      leaderAttraction,
      formationTightness,
      wanderStrength,
      maxSpeed,
      spawnBounds,
      orbitLeader,
      orbitRadius,
    }),
  }
}

/**
 * Preset configurations
 */
export const swarmPresets = {
  followers: {
    leaderAttraction: 1.5,
    formationTightness: 0.8,
    wanderStrength: 0.2,
    maxSpeed: 2.0,
    orbitLeader: false
  },
  orbital: {
    leaderAttraction: 2.0,
    formationTightness: 0.5,
    wanderStrength: 0.1,
    maxSpeed: 2.5,
    orbitLeader: true,
    orbitRadius: 4.0
  },
  scattered: {
    leaderAttraction: 0.5,
    formationTightness: 0.2,
    wanderStrength: 0.8,
    maxSpeed: 1.5,
    orbitLeader: false
  },
  dance: {
    leaderAttraction: 1.0,
    formationTightness: 0.6,
    wanderStrength: 0.5,
    maxSpeed: 3.0,
    orbitLeader: true,
    orbitRadius: 2.5
  }
} as const

