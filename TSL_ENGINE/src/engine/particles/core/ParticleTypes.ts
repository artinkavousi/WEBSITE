/**
 * Particle System Types
 * 
 * Core types for GPU-driven particle systems using compute shaders.
 * These types extend the base types from engineTypes.ts.
 */

export type {
  ParticleSystemConfig,
  ParticleParams,
  ParticleSystemFactory,
} from '../../core/engineTypes'

/**
 * Particle behavior modes.
 */
export type ParticleBehavior =
  | 'attract'
  | 'repel'
  | 'orbit'
  | 'flow'
  | 'swarm'
  | 'bounce'
  | 'trail'

/**
 * Particle rendering modes.
 */
export type ParticleRenderMode =
  | 'points'
  | 'sprites'
  | 'instanced-mesh'
  | 'trails'

/**
 * Attractor/Repeller point in 3D space.
 */
export interface AttractorPoint {
  /** Position [x, y, z] */
  position: [number, number, number]
  
  /** Strength (positive = attract, negative = repel) */
  strength: number
  
  /** Radius of influence */
  radius?: number
  
  /** Falloff exponent */
  falloff?: number
}

/**
 * Particle spawn configuration.
 */
export interface ParticleSpawnConfig {
  /** Spawn distribution type */
  distribution: 'sphere' | 'box' | 'disk' | 'point' | 'surface'
  
  /** Spawn area size/radius */
  size?: number | [number, number, number]
  
  /** Initial velocity range */
  velocityRange?: {
    min: [number, number, number]
    max: [number, number, number]
  }
  
  /** Spawn rate (particles per second, 0 = spawn all at once) */
  rate?: number
}

/**
 * Particle lifetime configuration.
 */
export interface ParticleLifetime {
  /** Minimum lifetime in seconds */
  min: number
  
  /** Maximum lifetime in seconds */
  max: number
  
  /** Fade in duration */
  fadeIn?: number
  
  /** Fade out duration */
  fadeOut?: number
}

/**
 * Extended particle system configuration with behavior.
 */
export interface ExtendedParticleConfig {
  /** Number of particles */
  count: number
  
  /** Spawn configuration */
  spawn: ParticleSpawnConfig
  
  /** Particle lifetime */
  lifetime?: ParticleLifetime
  
  /** Particle size */
  size?: number | [number, number]
  
  /** Size over lifetime curve */
  sizeOverLifetime?: 'constant' | 'grow' | 'shrink' | 'pulse'
  
  /** Particle color or gradient */
  color?: [number, number, number] | Array<[number, number, number]>
  
  /** Color over lifetime */
  colorOverLifetime?: 'constant' | 'fade' | 'gradient'
  
  /** Behavior mode */
  behavior: ParticleBehavior
  
  /** Attractors/repellers */
  attractors?: AttractorPoint[]
  
  /** Global forces (gravity, wind, etc.) */
  forces?: {
    gravity?: [number, number, number]
    wind?: [number, number, number]
    turbulence?: number
  }
  
  /** Physics parameters */
  physics?: {
    damping?: number
    maxVelocity?: number
    mass?: number
  }
  
  /** Collision bounds */
  bounds?: {
    type: 'box' | 'sphere' | 'none'
    size?: number | [number, number, number]
    bounce?: number
  }
  
  /** Rendering mode */
  renderMode?: ParticleRenderMode
}

/**
 * Particle compute shader data structure.
 * This matches the buffer layout used in compute shaders.
 */
export interface ParticleData {
  /** Position [x, y, z] */
  position: Float32Array
  
  /** Velocity [x, y, z] */
  velocity: Float32Array
  
  /** Lifetime data [age, maxAge, fadeIn, fadeOut] */
  lifetime: Float32Array
  
  /** Size data [current, start, end] */
  size: Float32Array
  
  /** Color [r, g, b, a] */
  color: Float32Array
  
  /** Custom data [custom0, custom1, custom2, custom3] */
  custom?: Float32Array
}

/**
 * Particle system update callback signature.
 */
export type ParticleUpdateCallback = (deltaTime: number, particleData: ParticleData) => void

/**
 * Particle system metadata.
 */
export interface ParticleSystemMetadata {
  name?: string
  description?: string
  author?: string
  version?: string
  tags?: string[]
  complexity?: 'low' | 'medium' | 'high'
  particleCount?: number
}

