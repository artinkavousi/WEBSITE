/**
 * Enhanced SDF Primitives
 * 
 * Extended signed distance field shapes building on existing TSL SDF utilities.
 * Provides additional shapes and operations.
 */

import { Fn, length, max, abs, min, vec3, vec2, float } from 'three/tsl'
import { SDFPrimitive, FieldParams } from '../../core/engineTypes'

// Import existing SDF shapes from TSL utilities
import {
  sdSphere,
  sdBox,
  sdTorus,
  sdCylinder,
  sdCapsule,
} from '@/tsl/utils/sdf/shapes'

/**
 * Parameters for SDF primitive configuration.
 */
export interface SDFPrimitiveParams extends FieldParams {
  /** Primitive-specific parameters */
  [key: string]: any
}

/**
 * Creates an SDF sphere primitive.
 * 
 * @param radius - Sphere radius
 * @returns SDF primitive
 * 
 * @example
 * ```ts
 * const sphere = createSDFSphere(1.0)
 * const dist = sphere.distance(position)
 * ```
 */
export const createSDFSphere = (radius: number = 1.0): SDFPrimitive => {
  return {
    distance: Fn((p) => sdSphere(p, float(radius))),
    params: { radius },
    type: 'sphere',
  }
}

/**
 * Creates an SDF box primitive.
 * 
 * @param size - Box half-extents [x, y, z]
 * @returns SDF primitive
 * 
 * @example
 * ```ts
 * const box = createSDFBox([1, 0.5, 2])
 * const dist = box.distance(position)
 * ```
 */
export const createSDFBox = (size: [number, number, number] = [1, 1, 1]): SDFPrimitive => {
  return {
    distance: Fn((p) => sdBox(p, vec3(...size))),
    params: { size },
    type: 'box',
  }
}

/**
 * Creates an SDF torus primitive.
 * 
 * @param majorRadius - Major radius (ring radius)
 * @param minorRadius - Minor radius (tube radius)
 * @returns SDF primitive
 * 
 * @example
 * ```ts
 * const torus = createSDFTorus(2.0, 0.5)
 * const dist = torus.distance(position)
 * ```
 */
export const createSDFTorus = (
  majorRadius: number = 1.0,
  minorRadius: number = 0.3
): SDFPrimitive => {
  return {
    distance: Fn((p) => sdTorus(p, vec2(majorRadius, minorRadius))),
    params: { majorRadius, minorRadius },
    type: 'torus',
  }
}

/**
 * Creates an SDF cylinder primitive.
 * 
 * @param height - Cylinder height
 * @param radius - Cylinder radius
 * @returns SDF primitive
 * 
 * @example
 * ```ts
 * const cylinder = createSDFCylinder(2.0, 0.5)
 * const dist = cylinder.distance(position)
 * ```
 */
export const createSDFCylinder = (
  height: number = 1.0,
  radius: number = 0.5
): SDFPrimitive => {
  return {
    distance: Fn((p) => sdCylinder(p, float(height), float(radius))),
    params: { height, radius },
    type: 'cylinder',
  }
}

/**
 * Creates an SDF capsule primitive.
 * 
 * @param height - Capsule height (distance between hemisphere centers)
 * @param radius - Capsule radius
 * @returns SDF primitive
 * 
 * @example
 * ```ts
 * const capsule = createSDFCapsule(2.0, 0.5)
 * const dist = capsule.distance(position)
 * ```
 */
export const createSDFCapsule = (
  height: number = 1.0,
  radius: number = 0.5
): SDFPrimitive => {
  return {
    distance: Fn((p) => sdCapsule(p, float(height), float(radius))),
    params: { height, radius },
    type: 'cylinder',
  }
}

/**
 * SDF primitive presets for common use cases.
 */
export const sdfPrimitivePresets = {
  /**
   * Unit sphere
   */
  unitSphere: (): SDFPrimitive => createSDFSphere(1.0),

  /**
   * Unit cube
   */
  unitCube: (): SDFPrimitive => createSDFBox([1, 1, 1]),

  /**
   * Flat disc
   */
  disc: (): SDFPrimitive => createSDFCylinder(0.1, 1.0),

  /**
   * Tall pillar
   */
  pillar: (): SDFPrimitive => createSDFCylinder(4.0, 0.5),

  /**
   * Ring
   */
  ring: (): SDFPrimitive => createSDFTorus(2.0, 0.3),

  /**
   * Pill shape
   */
  pill: (): SDFPrimitive => createSDFCapsule(1.5, 0.4),
}

