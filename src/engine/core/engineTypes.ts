import { Node, Material } from 'three/tsl'

// ===== MATERIAL SYSTEM TYPES =====

/**
 * Configuration for a material using TSL nodes.
 * Defines all the node-based properties for advanced material systems.
 */
export interface MaterialNodeConfig {
  /** Color output node (required) */
  colorNode: Node
  /** Roughness node (0 = smooth, 1 = rough) */
  roughnessNode?: Node
  /** Metalness node (0 = dielectric, 1 = metal) */
  metalnessNode?: Node
  /** Normal map node for surface detail */
  normalNode?: Node
  /** Emissive node for glowing effects */
  emissiveNode?: Node
  /** Opacity node for transparency */
  opacityNode?: Node
  /** Ambient occlusion node */
  aoNode?: Node
  /** Custom uniforms for additional parameters */
  uniforms?: Record<string, any>
}

/**
 * Base interface for all material parameter types.
 * Extend this for specific material implementations.
 */
export interface MaterialParams {
  [key: string]: any
}

// ===== POST-PROCESSING SYSTEM TYPES =====

/**
 * A single post-processing pass in a chain.
 * Processes an input node and returns a modified output node.
 */
export interface PostFXPass {
  /** Unique name for the pass */
  name: string
  /** Function that processes the input node */
  process: (input: Node) => Node
  /** Custom uniforms for the pass */
  uniforms?: Record<string, any>
  /** Whether this pass is enabled (default: true) */
  enabled?: boolean
}

/**
 * A chain of post-processing effects.
 * Applies multiple passes in sequence.
 */
export interface PostFXChain {
  /** Array of passes to apply */
  passes: PostFXPass[]
  /** Compose all passes into a single node function */
  compose: (input: Node) => Node
}

// ===== FIELD SYSTEM TYPES =====

/**
 * A vector field that can be sampled at any point in 3D space.
 * Used for particle flow, displacement, and other spatial effects.
 */
export interface VectorField {
  /** Sample the field at a given position */
  sampleAt: (p: Node) => Node
  /** Scale factor for the field */
  scale?: number
  /** Number of octaves for noise-based fields */
  octaves?: number
}

/**
 * A Signed Distance Field primitive.
 * Returns the distance to the surface at any point.
 */
export interface SDFPrimitive {
  /** Calculate signed distance at a point */
  distance: (p: Node) => Node
  /** Parameters for the SDF shape */
  params: Record<string, any>
}

// ===== PARTICLE SYSTEM TYPES =====

/**
 * Configuration for a GPU-driven particle system.
 * Uses compute shaders for initialization and updates.
 */
export interface ParticleSystemConfig {
  /** Number of particles in the system */
  count: number
  /** Compute shader for particle initialization */
  computeInit: (index: Node) => Node
  /** Compute shader for particle updates */
  computeUpdate: (position: Node, velocity: Node, index: Node) => {
    position: Node
    velocity: Node
  }
  /** Material used for rendering particles */
  renderMaterial: Material
  /** Additional per-instance attributes */
  instanceAttributes?: Record<string, any>
}

// ===== ENGINE SKETCH CONFIGURATION =====

/**
 * Complete configuration for an engine-aware sketch.
 * Composes material, post-processing, fields, and particles.
 * 
 * @example
 * ```typescript
 * const config: EngineSketchConfig = {
 *   material: createPhiMetal({ baseColor: [0.9, 0.7, 0.4] }),
 *   postfx: bloomChain({ threshold: 0.8, intensity: 1.5 }),
 *   background: vec3(0.1, 0.1, 0.15)
 * }
 * ```
 */
export interface EngineSketchConfig {
  /** Material configuration (optional) */
  material?: MaterialNodeConfig
  /** Post-processing chain (optional) */
  postfx?: PostFXChain
  /** Vector fields for spatial effects (optional) */
  fields?: VectorField[]
  /** Particle system configuration (optional) */
  particles?: ParticleSystemConfig
  /** Background color/node (optional) */
  background?: Node
}

