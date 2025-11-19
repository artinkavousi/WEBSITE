/**
 * @module fields/sdfPrimitives
 * @description Signed Distance Field primitives for spatial queries and effects
 * 
 * SDFs define implicit geometry using distance functions. Useful for:
 * - Particle containment/repulsion
 * - Procedural modeling
 * - Ray marching effects
 * - Collision detection
 */

import { Fn, vec3, float } from 'three/tsl'
import type { SDFPrimitive } from '../core/engineTypes'

/**
 * Create a sphere SDF primitive
 */
export const createSphereSDF = (
  center: [number, number, number] = [0, 0, 0],
  radius: number = 1.0
): SDFPrimitive => {
  const centerVec = vec3(...center)
  const radiusFloat = float(radius)
  
  const sdfNode = Fn(() => {
    // For now, return the radius as a placeholder
    // Full implementation would take position parameter
    return radiusFloat
  })()
  
  return {
    name: 'Sphere',
    sdfNode,
    center,
    bounds: {
      min: [center[0] - radius, center[1] - radius, center[2] - radius],
      max: [center[0] + radius, center[1] + radius, center[2] + radius]
    }
  }
}

/**
 * Create a box SDF primitive
 */
export const createBoxSDF = (
  center: [number, number, number] = [0, 0, 0],
  size: [number, number, number] = [1, 1, 1],
  rounding: number = 0
): SDFPrimitive => {
  const centerVec = vec3(...center)
  const sizeVec = vec3(...size)
  const roundingFloat = float(rounding)
  
  const sdfNode = Fn(() => {
    // Placeholder - would calculate box SDF in full implementation
    return roundingFloat
  })()
  
  return {
    name: 'Box',
    sdfNode,
    center,
    bounds: {
      min: [center[0] - size[0] - rounding, center[1] - size[1] - rounding, center[2] - size[2] - rounding],
      max: [center[0] + size[0] + rounding, center[1] + size[1] + rounding, center[2] + size[2] + rounding]
    }
  }
}

/**
 * Create a torus SDF primitive
 */
export const createTorusSDF = (
  center: [number, number, number] = [0, 0, 0],
  majorRadius: number = 1.0,
  minorRadius: number = 0.3
): SDFPrimitive => {
  const centerVec = vec3(...center)
  const majorFloat = float(majorRadius)
  const minorFloat = float(minorRadius)
  
  const sdfNode = Fn(() => {
    // Placeholder
    return minorFloat
  })()
  
  const totalRadius = majorRadius + minorRadius
  
  return {
    name: 'Torus',
    sdfNode,
    center,
    bounds: {
      min: [center[0] - totalRadius, center[1] - minorRadius, center[2] - totalRadius],
      max: [center[0] + totalRadius, center[1] + minorRadius, center[2] + totalRadius]
    }
  }
}

/**
 * Preset SDF scenes
 */
export const sdfPresets = {
  sphere: () => createSphereSDF([0, 0, 0], 1.0),
  cube: () => createBoxSDF([0, 0, 0], [0.8, 0.8, 0.8], 0.1),
  torus: () => createTorusSDF([0, 0, 0], 1.2, 0.4)
} as const
