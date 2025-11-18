/**
 * Engine Sketch Wrapper
 * 
 * Creates engine-aware sketches that compose materials, post-FX, and other engine modules.
 * This is the main integration point between the engine layer and the sketch system.
 */

import { Fn, Node, vec3, vec4 } from 'three/tsl'
import { EngineSketchConfig } from './engineTypes'

/**
 * Creates an engine-powered sketch from a configuration.
 * 
 * This function composes various engine modules (materials, post-FX, particles, etc.)
 * into a single TSL node that can be used as a colorNode in WebGPUSketch.
 * 
 * @param config - Engine sketch configuration
 * @returns A TSL Node representing the final composed output
 * 
 * @example
 * Basic material usage:
 * ```ts
 * const sketch = Fn(() => 
 *   createEngineSketch({
 *     material: createPhiMetal({ metalness: 0.9 })
 *   })
 * )
 * ```
 * 
 * @example
 * Material with post-FX:
 * ```ts
 * const sketch = Fn(() =>
 *   createEngineSketch({
 *     material: createBasicLambert(),
 *     postfx: createBloomChain({ intensity: 0.5 })
 *   })
 * )
 * ```
 * 
 * @example
 * Complete scene composition:
 * ```ts
 * const sketch = Fn(() =>
 *   createEngineSketch({
 *     material: createPhiMetal(),
 *     postfx: cinematicChain,
 *     background: vec3(0.01, 0.02, 0.03),
 *     fields: [flowField, curlField]
 *   })
 * )
 * ```
 */
export const createEngineSketch = (config: EngineSketchConfig): Node => {
  const { material, postfx, background, metadata } = config

  return Fn(() => {
    // Start with background or default black
    let finalColor: Node = vec3(0)

    // Apply background if provided
    if (background) {
      if (Array.isArray(background)) {
        finalColor = vec3(...background)
      } else {
        finalColor = background
      }
    }

    // Apply material color if provided
    if (material?.colorNode) {
      finalColor = material.colorNode
    }

    // Apply post-processing chain if provided
    if (postfx && postfx.passes.length > 0) {
      let processedColor: Node = finalColor

      // Execute passes in order
      const sortedPasses = [...postfx.passes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      for (const pass of sortedPasses) {
        // Skip disabled passes
        if (pass.enabled === false) {
          continue
        }

        // Apply the pass
        // Note: In a full implementation, this would properly connect
        // the input/output nodes through the pass's processing logic.
        // For now, we use the pass's output node directly.
        processedColor = pass.outputNode
      }

      finalColor = processedColor
    }

    return finalColor
  })()
}

/**
 * Creates a simple sketch from just a material.
 * Convenience wrapper around createEngineSketch.
 * 
 * @param colorNode - The material's color node
 * @returns A TSL Node
 * 
 * @example
 * ```ts
 * const sketch = createMaterialSketch(
 *   createPhiMetal().colorNode
 * )
 * ```
 */
export const createMaterialSketch = (colorNode: Node): Node => {
  return createEngineSketch({
    material: { colorNode },
  })
}

/**
 * Creates a sketch with just post-FX applied to a base color.
 * 
 * @param baseColor - Base color as vec3 or RGB array
 * @param postfx - Post-FX chain to apply
 * @returns A TSL Node
 * 
 * @example
 * ```ts
 * const sketch = createPostFXSketch(
 *   vec3(1, 0, 0),
 *   bloomChain
 * )
 * ```
 */
export const createPostFXSketch = (
  baseColor: Node | [number, number, number],
  postfx: EngineSketchConfig['postfx']
): Node => {
  const colorNode = Array.isArray(baseColor) ? vec3(...baseColor) : baseColor

  return createEngineSketch({
    material: { colorNode },
    postfx,
  })
}

/**
 * Validate an engine sketch configuration.
 * Checks for common configuration errors.
 * 
 * @param config - Configuration to validate
 * @returns Validation result with errors if any
 */
export const validateEngineSketchConfig = (
  config: EngineSketchConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check if at least one module is provided
  if (!config.material && !config.postfx && !config.particles && !config.background) {
    errors.push('Configuration must include at least one module (material, postfx, particles, or background)')
  }

  // Validate material if provided
  if (config.material) {
    if (!config.material.colorNode) {
      errors.push('Material configuration must include a colorNode')
    }
  }

  // Validate post-FX if provided
  if (config.postfx) {
    if (!config.postfx.passes || config.postfx.passes.length === 0) {
      errors.push('PostFX configuration must include at least one pass')
    }

    for (let i = 0; i < (config.postfx.passes?.length || 0); i++) {
      const pass = config.postfx.passes[i]
      if (!pass.name) {
        errors.push(`PostFX pass at index ${i} must have a name`)
      }
      if (!pass.outputNode) {
        errors.push(`PostFX pass "${pass.name || i}" must have an outputNode`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Log information about an engine sketch configuration.
 * Useful for debugging.
 * 
 * @param config - Configuration to log
 * @param label - Optional label for the log
 */
export const logSketchConfig = (config: EngineSketchConfig, label?: string): void => {
  const prefix = label ? `[${label}]` : '[EngineSketch]'

  console.group(`${prefix} Configuration`)

  if (config.metadata?.name) {
    console.log('Name:', config.metadata.name)
  }

  if (config.metadata?.description) {
    console.log('Description:', config.metadata.description)
  }

  console.log('Has material:', !!config.material)
  console.log('Has post-FX:', !!config.postfx)
  console.log('Has particles:', !!config.particles)
  console.log('Has fields:', !!config.fields && config.fields.length > 0)
  console.log('Has background:', !!config.background)

  if (config.postfx) {
    console.log('Post-FX passes:', config.postfx.passes.length)
    config.postfx.passes.forEach((pass, i) => {
      console.log(`  ${i + 1}. ${pass.name} (enabled: ${pass.enabled !== false})`)
    })
  }

  const validation = validateEngineSketchConfig(config)
  if (!validation.valid) {
    console.warn('Validation errors:', validation.errors)
  }

  console.groupEnd()
}

