/**
 * Particle System Utilities
 * 
 * Helper functions for creating and managing particle systems.
 */

import { ParticleSpawnConfig, ParticleData } from './ParticleTypes'

/**
 * Initialize particle positions based on spawn configuration.
 * 
 * @param count - Number of particles
 * @param config - Spawn configuration
 * @returns Position array [x1, y1, z1, x2, y2, z2, ...]
 */
export function initializeParticlePositions(
  count: number,
  config: ParticleSpawnConfig
): Float32Array {
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const offset = i * 3
    const pos = generateSpawnPosition(config)
    positions[offset] = pos[0]
    positions[offset + 1] = pos[1]
    positions[offset + 2] = pos[2]
  }
  
  return positions
}

/**
 * Generate a single spawn position based on distribution type.
 */
function generateSpawnPosition(config: ParticleSpawnConfig): [number, number, number] {
  const { distribution, size = 1 } = config
  
  switch (distribution) {
    case 'sphere': {
      const radius = typeof size === 'number' ? size : Math.max(...size)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.cbrt(Math.random()) * radius
      
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]
    }
    
    case 'box': {
      const [sx, sy, sz] = typeof size === 'number' ? [size, size, size] : size
      return [
        (Math.random() - 0.5) * sx,
        (Math.random() - 0.5) * sy,
        (Math.random() - 0.5) * sz,
      ]
    }
    
    case 'disk': {
      const radius = typeof size === 'number' ? size : Math.max(...size)
      const angle = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * radius
      return [r * Math.cos(angle), r * Math.sin(angle), 0]
    }
    
    case 'point':
      return [0, 0, 0]
    
    default:
      return [0, 0, 0]
  }
}

/**
 * Initialize particle velocities.
 * 
 * @param count - Number of particles
 * @param velocityRange - Velocity range config
 * @returns Velocity array [vx1, vy1, vz1, vx2, vy2, vz2, ...]
 */
export function initializeParticleVelocities(
  count: number,
  velocityRange?: {
    min: [number, number, number]
    max: [number, number, number]
  }
): Float32Array {
  const velocities = new Float32Array(count * 3)
  
  if (!velocityRange) {
    return velocities // All zeros
  }
  
  const { min, max } = velocityRange
  
  for (let i = 0; i < count; i++) {
    const offset = i * 3
    velocities[offset] = min[0] + Math.random() * (max[0] - min[0])
    velocities[offset + 1] = min[1] + Math.random() * (max[1] - min[1])
    velocities[offset + 2] = min[2] + Math.random() * (max[2] - min[2])
  }
  
  return velocities
}

/**
 * Initialize particle lifetimes.
 * 
 * @param count - Number of particles
 * @param minLife - Minimum lifetime
 * @param maxLife - Maximum lifetime
 * @returns Lifetime array [age1, maxAge1, age2, maxAge2, ...]
 */
export function initializeParticleLifetimes(
  count: number,
  minLife: number = 1.0,
  maxLife: number = 3.0
): Float32Array {
  const lifetimes = new Float32Array(count * 2)
  
  for (let i = 0; i < count; i++) {
    const offset = i * 2
    lifetimes[offset] = 0 // age
    lifetimes[offset + 1] = minLife + Math.random() * (maxLife - minLife) // maxAge
  }
  
  return lifetimes
}

/**
 * Initialize particle sizes.
 * 
 * @param count - Number of particles
 * @param size - Size or size range [min, max]
 * @returns Size array
 */
export function initializeParticleSizes(
  count: number,
  size: number | [number, number] = 1.0
): Float32Array {
  const sizes = new Float32Array(count)
  
  if (typeof size === 'number') {
    sizes.fill(size)
  } else {
    const [min, max] = size
    for (let i = 0; i < count; i++) {
      sizes[i] = min + Math.random() * (max - min)
    }
  }
  
  return sizes
}

/**
 * Initialize particle colors.
 * 
 * @param count - Number of particles
 * @param color - Single color or color array
 * @returns Color array [r1, g1, b1, a1, r2, g2, b2, a2, ...]
 */
export function initializeParticleColors(
  count: number,
  color: [number, number, number] | Array<[number, number, number]> = [1, 1, 1]
): Float32Array {
  const colors = new Float32Array(count * 4)
  
  if (!Array.isArray(color[0])) {
    // Single color
    const [r, g, b] = color as [number, number, number]
    for (let i = 0; i < count; i++) {
      const offset = i * 4
      colors[offset] = r
      colors[offset + 1] = g
      colors[offset + 2] = b
      colors[offset + 3] = 1
    }
  } else {
    // Multiple colors - pick randomly
    const colorArray = color as Array<[number, number, number]>
    for (let i = 0; i < count; i++) {
      const offset = i * 4
      const [r, g, b] = colorArray[Math.floor(Math.random() * colorArray.length)]
      colors[offset] = r
      colors[offset + 1] = g
      colors[offset + 2] = b
      colors[offset + 3] = 1
    }
  }
  
  return colors
}

/**
 * Create complete particle data structure.
 * 
 * @param count - Number of particles
 * @param config - Spawn and appearance configuration
 * @returns Complete particle data
 */
export function createParticleData(
  count: number,
  config: {
    spawn: ParticleSpawnConfig
    size?: number | [number, number]
    color?: [number, number, number] | Array<[number, number, number]>
    lifetime?: { min: number; max: number }
  }
): ParticleData {
  const { spawn, size, color, lifetime } = config
  
  return {
    position: initializeParticlePositions(count, spawn),
    velocity: initializeParticleVelocities(count, spawn.velocityRange),
    lifetime: initializeParticleLifetimes(
      count,
      lifetime?.min ?? 1.0,
      lifetime?.max ?? 3.0
    ),
    size: initializeParticleSizes(count, size),
    color: initializeParticleColors(count, color),
  }
}

/**
 * Calculate distance between two 3D points.
 */
export function distance3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Smooth step interpolation.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

