/**
 * Attractor Particle System
 * 
 * GPU-friendly particle system with point attractors/repellers.
 * Particles are drawn toward or away from specified points in 3D space.
 */

import { Fn, vec3, length, normalize, float, mul, add, sub, max as tslMax } from 'three/tsl'
import { ExtendedParticleConfig, AttractorPoint, ParticleSystemMetadata } from '../core/ParticleTypes'
import { createParticleData } from '../core/particleUtils'

/**
 * Parameters for attractor particle system.
 */
export interface AttractorParticlesParams {
  /** Number of particles */
  count?: number
  
  /** Attractors and repellers */
  attractors?: AttractorPoint[]
  
  /** Spawn radius */
  spawnRadius?: number
  
  /** Particle size */
  size?: number | [number, number]
  
  /** Particle colors */
  color?: [number, number, number] | Array<[number, number, number]>
  
  /** Global damping factor */
  damping?: number
  
  /** Maximum velocity */
  maxVelocity?: number
  
  /** Particle lifetime range */
  lifetime?: { min: number; max: number }
}

/**
 * Creates an attractor-based particle system configuration.
 * 
 * Particles are influenced by multiple attractor/repeller points.
 * Attractors pull particles toward them (positive strength).
 * Repellers push particles away (negative strength).
 * 
 * @param params - System parameters
 * @returns Particle system configuration
 * 
 * @example
 * Single attractor at origin:
 * ```ts
 * const system = createAttractorParticles({
 *   count: 1000,
 *   attractors: [
 *     { position: [0, 0, 0], strength: 2.0 }
 *   ]
 * })
 * ```
 * 
 * @example
 * Multiple attractors with repellers:
 * ```ts
 * const system = createAttractorParticles({
 *   count: 5000,
 *   attractors: [
 *     { position: [2, 0, 0], strength: 1.5 },
 *     { position: [-2, 0, 0], strength: 1.5 },
 *     { position: [0, 2, 0], strength: -1.0 }  // Repeller
 *   ],
 *   color: [[1, 0.3, 0.5], [0.5, 0.3, 1]]
 * })
 * ```
 */
export const createAttractorParticles = (
  params: AttractorParticlesParams = {}
): ExtendedParticleConfig => {
  const {
    count = 1000,
    attractors = [{ position: [0, 0, 0], strength: 1.0 }],
    spawnRadius = 5.0,
    size = 0.05,
    color = [1, 0.5, 0.8],
    damping = 0.98,
    maxVelocity = 5.0,
    lifetime = { min: 2.0, max: 5.0 },
  } = params

  // Create initial particle data
  const particleData = createParticleData(count, {
    spawn: {
      distribution: 'sphere',
      size: spawnRadius,
      velocityRange: {
        min: [-0.5, -0.5, -0.5],
        max: [0.5, 0.5, 0.5],
      },
    },
    size,
    color,
    lifetime,
  })

  return {
    count,
    spawn: {
      distribution: 'sphere',
      size: spawnRadius,
      velocityRange: {
        min: [-0.5, -0.5, -0.5],
        max: [0.5, 0.5, 0.5],
      },
    },
    lifetime,
    size,
    color,
    behavior: 'attract',
    attractors,
    physics: {
      damping,
      maxVelocity,
      mass: 1.0,
    },
    bounds: {
      type: 'sphere',
      size: spawnRadius * 2,
      bounce: 0.5,
    },
    renderMode: 'points',
  }
}

/**
 * TSL function for calculating attractor forces.
 * This can be used in compute shaders or material shaders.
 * 
 * @param particlePos - Particle position
 * @param attractors - Array of attractor data
 * @returns Force vector
 */
export const calculateAttractorForce = Fn((particlePos, attractorPos, strength, radius) => {
  // Vector from particle to attractor
  const toAttractor = sub(attractorPos, particlePos)
  
  // Distance
  const dist = length(toAttractor)
  
  // Direction (normalized)
  const direction = normalize(toAttractor)
  
  // Falloff: 1/dist^2 with minimum distance to avoid singularity
  const minDist = float(0.1)
  const safeDist = tslMax(dist, minDist)
  const falloff = mul(strength, 1.0).div(safeDist.mul(safeDist))
  
  // Apply radius influence if specified
  const radiusFactor = radius ? tslMax(0.0, sub(1.0, div(dist, radius))) : float(1.0)
  
  // Final force
  return mul(direction, mul(falloff, radiusFactor))
})

/**
 * Attractor particle presets.
 */
export const attractorParticlesPresets = {
  /**
   * Single central attractor with pink particles
   */
  central: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 1000,
      attractors: [{ position: [0, 0, 0], strength: 2.0, radius: 10.0 }],
      spawnRadius: 5.0,
      color: [1, 0.5, 0.8],
      size: 0.05,
    }),

  /**
   * Binary system with two attractors
   */
  binary: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 2000,
      attractors: [
        { position: [-2, 0, 0], strength: 1.5, radius: 8.0 },
        { position: [2, 0, 0], strength: 1.5, radius: 8.0 },
      ],
      spawnRadius: 6.0,
      color: [[1, 0.3, 0.5], [0.3, 0.5, 1]],
      size: 0.04,
    }),

  /**
   * Orbital system with central attractor and repeller
   */
  orbital: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 3000,
      attractors: [
        { position: [0, 0, 0], strength: 3.0, radius: 10.0 },
        { position: [0, 3, 0], strength: -1.0, radius: 5.0 }, // Repeller
      ],
      spawnRadius: 8.0,
      color: [0.5, 0.8, 1],
      size: [0.03, 0.06],
      damping: 0.99,
    }),

  /**
   * Triangle formation with three attractors
   */
  triangle: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 4000,
      attractors: [
        { position: [0, 3, 0], strength: 1.2, radius: 6.0 },
        { position: [-2.6, -1.5, 0], strength: 1.2, radius: 6.0 },
        { position: [2.6, -1.5, 0], strength: 1.2, radius: 6.0 },
      ],
      spawnRadius: 7.0,
      color: [[1, 0.5, 0.3], [0.3, 1, 0.5], [0.5, 0.3, 1]],
      size: 0.04,
    }),

  /**
   * Chaotic system with attractors and repellers
   */
  chaotic: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 5000,
      attractors: [
        { position: [0, 0, 0], strength: 2.5, radius: 12.0 },
        { position: [3, 2, 1], strength: -0.8, radius: 4.0 },
        { position: [-3, -2, 1], strength: -0.8, radius: 4.0 },
        { position: [0, 3, -2], strength: 1.0, radius: 5.0 },
      ],
      spawnRadius: 8.0,
      color: [0.8, 0.6, 1],
      size: [0.02, 0.05],
      maxVelocity: 8.0,
    }),

  /**
   * Sparse field with subtle attraction
   */
  sparse: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 500,
      attractors: [{ position: [0, 0, 0], strength: 0.5, radius: 15.0 }],
      spawnRadius: 10.0,
      color: [1, 1, 1],
      size: 0.08,
      damping: 0.95,
      maxVelocity: 2.0,
    }),

  /**
   * Dense swarm
   */
  swarm: (): ExtendedParticleConfig =>
    createAttractorParticles({
      count: 10000,
      attractors: [{ position: [0, 0, 0], strength: 1.5, radius: 8.0 }],
      spawnRadius: 4.0,
      color: [0.9, 0.9, 0.5],
      size: 0.02,
      damping: 0.97,
      maxVelocity: 4.0,
    }),
}

/**
 * Metadata for attractor particle system.
 */
export const attractorParticlesMetadata: ParticleSystemMetadata = {
  name: 'Attractor Particles',
  description: 'GPU-driven particles influenced by attractor/repeller points',
  author: 'TSL Engine',
  version: '1.0.0',
  tags: ['particles', 'attractors', 'physics', 'gpu'],
  complexity: 'medium',
}

