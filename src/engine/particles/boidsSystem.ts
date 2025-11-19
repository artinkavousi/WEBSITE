/**
 * @module particles/boidsSystem
 * @description Flocking behavior using Boids algorithm (Reynolds 1987)
 * 
 * Implements three core rules:
 * 1. Separation: Avoid crowding neighbors
 * 2. Alignment: Steer towards average heading of neighbors
 * 3. Cohesion: Steer towards average position of neighbors
 */

import { Fn, vec3, float, uniform } from 'three/tsl'
import type { ParticleCpuKernel, ParticleSystemConfig } from '../core/engineTypes'

export interface BoidsConfig {
  /** Particle count */
  count?: number
  /** Neighbor search radius */
  neighborRadius?: number
  /** Separation distance */
  separationDistance?: number
  /** Separation force weight */
  separationWeight?: number
  /** Alignment force weight */
  alignmentWeight?: number
  /** Cohesion force weight */
  cohesionWeight?: number
  /** Maximum speed */
  maxSpeed?: number
  /** Maximum steering force */
  maxForce?: number
  /** Spawn bounds */
  spawnBounds?: [number, number, number]
  /** Enable boundary wrapping */
  wrapBoundaries?: boolean
}

const vectorLength = (x: number, y: number, z: number): number => Math.sqrt(x * x + y * y + z * z)

const clampVector = (vec: Float32Array, maxMagnitude: number) => {
  const mag = vectorLength(vec[0], vec[1], vec[2])
  if (mag > maxMagnitude && mag > 0) {
    const scale = maxMagnitude / mag
    vec[0] *= scale
    vec[1] *= scale
    vec[2] *= scale
  }
}

const wrapComponent = (value: number, limit: number): number => {
  if (value > limit) return -limit + (value - limit)
  if (value < -limit) return limit + (value + limit)
  return value
}

const createBoidsKernel = (options: {
  neighborRadius: number
  separationDistance: number
  separationWeight: number
  alignmentWeight: number
  cohesionWeight: number
  maxSpeed: number
  maxForce: number
  spawnBounds: [number, number, number]
  wrapBoundaries: boolean
}): ParticleCpuKernel => {
  const neighborRadiusSq = options.neighborRadius * options.neighborRadius
  const separationDistanceSq = options.separationDistance * options.separationDistance

  return {
    init: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')

      position[0] = (ctx.random() * 2 - 1) * options.spawnBounds[0]
      position[1] = (ctx.random() * 2 - 1) * options.spawnBounds[1]
      position[2] = (ctx.random() * 2 - 1) * options.spawnBounds[2]

      velocity[0] = (ctx.random() * 2 - 1) * options.maxSpeed * 0.5
      velocity[1] = (ctx.random() * 2 - 1) * options.maxSpeed * 0.5
      velocity[2] = (ctx.random() * 2 - 1) * options.maxSpeed * 0.5
    },
    update: (ctx) => {
      const position = ctx.getAttribute('position')
      const velocity = ctx.getAttribute('velocity')
      const dt = ctx.deltaTime
      const positions = ctx.attributeArrays.position
      const velocities = ctx.attributeArrays.velocity

      const separation = [0, 0, 0]
      const alignment = [0, 0, 0]
      const cohesion = [0, 0, 0]
      let neighbors = 0

      for (let i = 0; i < ctx.count; i += 1) {
        if (i === ctx.index) continue

        const offset = i * positions.size
        const ox = positions.array[offset]
        const oy = positions.array[offset + 1]
        const oz = positions.array[offset + 2]

        const dx = ox - position[0]
        const dy = oy - position[1]
        const dz = oz - position[2]
        const distSq = dx * dx + dy * dy + dz * dz

        if (distSq < neighborRadiusSq && distSq > 0) {
          neighbors += 1

          alignment[0] += velocities.array[offset]
          alignment[1] += velocities.array[offset + 1]
          alignment[2] += velocities.array[offset + 2]

          cohesion[0] += ox
          cohesion[1] += oy
          cohesion[2] += oz

          if (distSq < separationDistanceSq) {
            separation[0] -= dx
            separation[1] -= dy
            separation[2] -= dz
          }
        }
      }

      if (neighbors > 0) {
        alignment[0] = (alignment[0] / neighbors - velocity[0]) * options.alignmentWeight
        alignment[1] = (alignment[1] / neighbors - velocity[1]) * options.alignmentWeight
        alignment[2] = (alignment[2] / neighbors - velocity[2]) * options.alignmentWeight

        cohesion[0] = ((cohesion[0] / neighbors - position[0]) * options.cohesionWeight) / 10
        cohesion[1] = ((cohesion[1] / neighbors - position[1]) * options.cohesionWeight) / 10
        cohesion[2] = ((cohesion[2] / neighbors - position[2]) * options.cohesionWeight) / 10
      }

      separation[0] *= options.separationWeight
      separation[1] *= options.separationWeight
      separation[2] *= options.separationWeight

      const ax = separation[0] + alignment[0] + cohesion[0]
      const ay = separation[1] + alignment[1] + cohesion[1]
      const az = separation[2] + alignment[2] + cohesion[2]

      const accelMagnitude = vectorLength(ax, ay, az)
      const limitForce = options.maxForce
      const scale = accelMagnitude > limitForce && accelMagnitude > 0 ? limitForce / accelMagnitude : 1

      velocity[0] += ax * scale * dt
      velocity[1] += ay * scale * dt
      velocity[2] += az * scale * dt

      clampVector(velocity, options.maxSpeed)

      position[0] += velocity[0] * dt
      position[1] += velocity[1] * dt
      position[2] += velocity[2] * dt

      if (options.wrapBoundaries) {
        position[0] = wrapComponent(position[0], options.spawnBounds[0])
        position[1] = wrapComponent(position[1], options.spawnBounds[1])
        position[2] = wrapComponent(position[2], options.spawnBounds[2])
      }
    },
  }
}

/**
 * Create a boids flocking system
 */
export const createBoidsSystem = (config: BoidsConfig = {}): ParticleSystemConfig => {
  const {
    count = 500,
    neighborRadius = 2.0,
    separationDistance = 1.0,
    separationWeight = 1.5,
    alignmentWeight = 1.0,
    cohesionWeight = 1.0,
    maxSpeed = 2.0,
    maxForce = 0.1,
    spawnBounds = [10, 10, 10],
    wrapBoundaries = true,
  } = config

  const uNeighborRadius = uniform(neighborRadius)
  const uSeparationDist = uniform(separationDistance)
  const uSeparationWeight = uniform(separationWeight)
  const uAlignmentWeight = uniform(alignmentWeight)
  const uCohesionWeight = uniform(cohesionWeight)
  const uMaxSpeed = uniform(maxSpeed)
  const uMaxForce = uniform(maxForce)
  const uSpawnBounds = uniform(vec3(...spawnBounds))
  const uWrapBoundaries = uniform(wrapBoundaries ? 1.0 : 0.0)

  // Placeholder nodes - full implementation requires compute shaders
  const updateNode = Fn(() => {
    return vec3(0)
  })()

  const initNode = Fn(() => {
    return vec3(0)
  })()

  return {
    name: 'BoidsSystem',
    count,
    updateNode,
    initNode,
    uniforms: {
      uNeighborRadius,
      uSeparationDist,
      uSeparationWeight,
      uAlignmentWeight,
      uCohesionWeight,
      uMaxSpeed,
      uMaxForce,
      uSpawnBounds,
      uWrapBoundaries,
    },
    attributes: {
      position: { size: 3, default: [0, 0, 0] },
      velocity: { size: 3, default: [0, 0, 0] },
    },
    cpuKernel: createBoidsKernel({
      neighborRadius,
      separationDistance,
      separationWeight,
      alignmentWeight,
      cohesionWeight,
      maxSpeed,
      maxForce,
      spawnBounds,
      wrapBoundaries,
    }),
  }
}

/**
 * Preset configurations
 */
export const boidsPresets = {
  tight: {
    neighborRadius: 1.5,
    separationDistance: 0.8,
    separationWeight: 2.0,
    alignmentWeight: 1.5,
    cohesionWeight: 1.0,
    maxSpeed: 1.5
  },
  loose: {
    neighborRadius: 3.0,
    separationDistance: 2.0,
    separationWeight: 1.0,
    alignmentWeight: 0.8,
    cohesionWeight: 0.6,
    maxSpeed: 2.5
  },
  chaotic: {
    neighborRadius: 2.5,
    separationDistance: 1.5,
    separationWeight: 2.5,
    alignmentWeight: 0.5,
    cohesionWeight: 0.3,
    maxSpeed: 3.0
  },
  synchronized: {
    neighborRadius: 2.0,
    separationDistance: 1.0,
    separationWeight: 1.0,
    alignmentWeight: 2.5,
    cohesionWeight: 1.5,
    maxSpeed: 2.0
  }
} as const

