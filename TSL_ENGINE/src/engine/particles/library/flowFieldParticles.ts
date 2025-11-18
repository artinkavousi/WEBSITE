/**
 * Flow Field Particle System
 * 
 * Particles driven by vector flow fields (curl noise, custom fields, etc.).
 * Creates organic, fluid-like particle motion.
 */

import { ExtendedParticleConfig, ParticleSystemMetadata } from '../core/ParticleTypes'
import { createParticleData } from '../core/particleUtils'

/**
 * Parameters for flow field particle system.
 */
export interface FlowFieldParticlesParams {
  /** Number of particles */
  count?: number
  
  /** Flow field scale */
  flowScale?: number
  
  /** Flow field strength */
  flowStrength?: number
  
  /** Flow speed multiplier */
  flowSpeed?: number
  
  /** Spawn area size */
  spawnSize?: number | [number, number, number]
  
  /** Particle size */
  size?: number | [number, number]
  
  /** Particle colors */
  color?: [number, number, number] | Array<[number, number, number]>
  
  /** Trail length (0 = no trails) */
  trailLength?: number
  
  /** Particle lifetime */
  lifetime?: { min: number; max: number }
}

/**
 * Creates a flow field-driven particle system.
 * 
 * Particles follow a 3D vector field, creating organic,
 * fluid-like motion patterns. Great for:
 * - Smoke/mist effects
 * - Abstract visualizations
 * - Flow visualization
 * - Organic motion
 * 
 * @param params - System parameters
 * @returns Particle system configuration
 * 
 * @example
 * Basic flow field:
 * ```ts
 * const system = createFlowFieldParticles({
 *   count: 2000,
 *   flowScale: 1.5,
 *   flowStrength: 2.0
 * })
 * ```
 * 
 * @example
 * Trails visualization:
 * ```ts
 * const system = createFlowFieldParticles({
 *   count: 500,
 *   flowScale: 2.0,
 *   flowStrength: 3.0,
 *   trailLength: 20,
 *   color: [0.3, 0.8, 1]
 * })
 * ```
 */
export const createFlowFieldParticles = (
  params: FlowFieldParticlesParams = {}
): ExtendedParticleConfig => {
  const {
    count = 2000,
    flowScale = 1.0,
    flowStrength = 1.5,
    flowSpeed = 1.0,
    spawnSize = 10.0,
    size = 0.05,
    color = [0.5, 0.8, 1.0],
    trailLength = 0,
    lifetime = { min: 3.0, max: 8.0 },
  } = params

  const boxSize = typeof spawnSize === 'number' 
    ? [spawnSize, spawnSize, spawnSize] as [number, number, number]
    : spawnSize

  return {
    count,
    spawn: {
      distribution: 'box',
      size: boxSize,
      velocityRange: {
        min: [-0.1, -0.1, -0.1],
        max: [0.1, 0.1, 0.1],
      },
    },
    lifetime,
    size,
    color,
    behavior: 'flow',
    forces: {
      turbulence: flowScale * flowStrength,
      wind: [0, 0, 0],
    },
    physics: {
      damping: 0.99,
      maxVelocity: flowSpeed * 5.0,
      mass: 0.5,
    },
    bounds: {
      type: 'box',
      size: [boxSize[0] * 1.5, boxSize[1] * 1.5, boxSize[2] * 1.5],
      bounce: 0.2,
    },
    renderMode: trailLength > 0 ? 'trails' : 'points',
  }
}

/**
 * Flow field particle presets.
 */
export const flowFieldParticlesPresets = {
  /**
   * Gentle flowing mist
   */
  mist: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 1500,
      flowScale: 0.8,
      flowStrength: 1.0,
      flowSpeed: 0.5,
      spawnSize: 12.0,
      color: [0.9, 0.95, 1.0],
      size: [0.08, 0.15],
      lifetime: { min: 5.0, max: 10.0 },
    }),

  /**
   * Turbulent smoke
   */
  smoke: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 2500,
      flowScale: 1.5,
      flowStrength: 2.0,
      flowSpeed: 1.2,
      spawnSize: 8.0,
      color: [[0.3, 0.3, 0.3], [0.5, 0.5, 0.5]],
      size: [0.1, 0.2],
      lifetime: { min: 3.0, max: 6.0 },
    }),

  /**
   * Fast flowing streams
   */
  streams: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 3000,
      flowScale: 2.0,
      flowStrength: 3.0,
      flowSpeed: 2.0,
      spawnSize: [15, 5, 5],
      color: [0.3, 0.7, 1.0],
      size: 0.04,
      trailLength: 15,
      lifetime: { min: 2.0, max: 5.0 },
    }),

  /**
   * Organic cloud
   */
  cloud: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 5000,
      flowScale: 1.2,
      flowStrength: 1.5,
      flowSpeed: 0.8,
      spawnSize: 10.0,
      color: [1.0, 1.0, 1.0],
      size: [0.05, 0.12],
      lifetime: { min: 4.0, max: 8.0 },
    }),

  /**
   * Energy field visualization
   */
  energy: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 4000,
      flowScale: 2.5,
      flowStrength: 4.0,
      flowSpeed: 3.0,
      spawnSize: 8.0,
      color: [[1, 0.3, 0.5], [0.3, 1, 0.9], [0.9, 0.5, 1]],
      size: [0.02, 0.05],
      trailLength: 10,
      lifetime: { min: 1.5, max: 4.0 },
    }),

  /**
   * Calm drift
   */
  drift: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 800,
      flowScale: 0.5,
      flowStrength: 0.8,
      flowSpeed: 0.3,
      spawnSize: 15.0,
      color: [0.8, 0.9, 1.0],
      size: 0.1,
      lifetime: { min: 8.0, max: 15.0 },
    }),

  /**
   * Dense fog
   */
  fog: (): ExtendedParticleConfig =>
    createFlowFieldParticles({
      count: 8000,
      flowScale: 1.0,
      flowStrength: 1.2,
      flowSpeed: 0.6,
      spawnSize: 20.0,
      color: [0.95, 0.95, 0.98],
      size: [0.15, 0.25],
      lifetime: { min: 6.0, max: 12.0 },
    }),
}

/**
 * Metadata for flow field particle system.
 */
export const flowFieldParticlesMetadata: ParticleSystemMetadata = {
  name: 'Flow Field Particles',
  description: 'Particles driven by vector flow fields for organic motion',
  author: 'TSL Engine',
  version: '1.0.0',
  tags: ['particles', 'flow-field', 'curl-noise', 'organic'],
  complexity: 'medium',
}

