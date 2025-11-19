import { Fn, Node, vec3 } from 'three/tsl'
import { EngineSketchConfig } from './engineTypes'

/**
 * Creates an engine-aware sketch from a configuration.
 * Composes material, post-processing, and background into a final shader node.
 * 
 * This is the main composition utility for the engine. It takes a configuration
 * object and produces a TSL Node that can be used as a colorNode in materials.
 * 
 * @param config - Engine sketch configuration
 * @returns A TSL Node (for use as colorNode in MeshBasicNodeMaterial)
 * 
 * @example
 * ```typescript
 * import { Fn } from 'three/tsl'
 * import { createEngineSketch } from '@/engine/core/createEngineSketch'
 * import { createBasicLambert } from '@/engine/materials/basicLambert'
 * 
 * const sketch = Fn(() => createEngineSketch({
 *   material: createBasicLambert({ 
 *     baseColor: [1, 0.5, 0.2],
 *     ambient: 0.2 
 *   }),
 *   background: vec3(0.1)
 * }))
 * 
 * export default sketch
 * ```
 * 
 * @example
 * ```typescript
 * // With post-processing
 * const sketch = Fn(() => createEngineSketch({
 *   material: createPhiMetal({ metalness: 0.95 }),
 *   postfx: createBloomChain({ intensity: 1.5 }),
 *   background: vec3(0.05, 0.05, 0.1)
 * }))
 * ```
 */
export const createEngineSketch = (config: EngineSketchConfig): Node => {
  const { material, postfx, background } = config

  return Fn(() => {
    // Start with background or default black
    let finalColor: Node = background || vec3(0)

    // Apply material if provided
    if (material?.colorNode) {
      finalColor = material.colorNode
    }

    // Apply post-processing chain if provided
    if (postfx && postfx.compose) {
      finalColor = postfx.compose(finalColor)
    }

    return finalColor
  })()
}

/**
 * Helper to create a simple sketch from just a colorNode.
 * Useful for quick prototyping without full engine features.
 * 
 * @param colorNode - TSL node representing the color output
 * @returns A composed engine sketch node
 * 
 * @example
 * ```typescript
 * import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
 * import { simpleSketch } from '@/engine/core/createEngineSketch'
 * 
 * const sketch = Fn(() => {
 *   const noise = simplexNoise3d(positionWorld.mul(2))
 *   return simpleSketch(vec3(noise))
 * })
 * ```
 */
export const simpleSketch = (colorNode: Node): Node => {
  return createEngineSketch({ material: { colorNode } })
}

