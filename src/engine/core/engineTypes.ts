/**
 * @module core/engineTypes
 * @description Core TypeScript interfaces for the TSL engine.
 * 
 * This module defines the foundational types used throughout the engine:
 * - Material system (TSL nodes for PBR properties)
 * - Post-processing effects (PostFX chains)
 * - Vector fields (flow, curl noise)
 * - SDF primitives (implicit geometry)
 * - Particle systems
 * - Engine sketch configuration
 */

import { Node } from 'three/tsl'
import { Material } from 'three'

// ───────────────────────────────────────────────────────────────────
// MATERIALS
// ───────────────────────────────────────────────────────────────────

/**
 * Material node configuration.
 * 
 * Defines TSL nodes for various PBR material properties.
 * These nodes are composable and can be used with MeshStandardNodeMaterial.
 */
export interface MaterialNodeConfig {
  /** Color output node (RGB). Main surface color. */
  colorNode: Node
  
  /** Roughness node (scalar 0-1). Controls surface micro-facet distribution. */
  roughnessNode?: Node
  
  /** Metalness node (scalar 0-1). 0 = dielectric, 1 = conductor. */
  metalnessNode?: Node
  
  /** Normal perturbation node (RGB, tangent space). For bump/normal mapping. */
  normalNode?: Node
  
  /** Emissive color node (RGB). Self-illuminated areas. */
  emissiveNode?: Node
  
  /** Opacity/alpha node (scalar 0-1). 0 = fully transparent, 1 = opaque. */
  opacityNode?: Node
  
  /** Ambient occlusion node (scalar 0-1). Indirect lighting attenuation. */
  aoNode?: Node
  
  /** Hook for additional Three.js material setup. */
  onBeforeCompile?: (material: Material) => void
  
  /** Additional uniforms to pass to the material. */
  uniforms?: Record<string, any>
}

/**
 * Base material parameters interface.
 * Extend this for custom material types.
 */
export interface MaterialParams {
  // Marker interface - extend in specific material modules
}

// ───────────────────────────────────────────────────────────────────
// POST-PROCESSING (PostFX)
// ───────────────────────────────────────────────────────────────────

/**
 * Single post-processing pass.
 * 
 * Each pass receives the previous color node and returns a transformed output.
 * Passes can be chained together in a PostFXChain.
 */
export interface PostFXPass {
  /** Pass name/identifier */
  name: string
  
  /** Function that processes the incoming color node */
  process: (input: Node) => Node
  
  /** Whether this pass is active. Default: true */
  enabled?: boolean
  
  /** Uniforms specific to this pass */
  uniforms?: Record<string, any>
}

/**
 * Chain of post-processing passes.
 * 
 * Passes are applied in order, each operating on the previous pass's output.
 */
export interface PostFXChain {
  /** Array of passes to apply in sequence */
  passes: PostFXPass[]
  
  /** Combined uniforms from all passes */
  uniforms?: Record<string, any>
  
  /** Optional compose helper to apply the chain to a color node */
  compose?: (input: Node) => Node
}

// ───────────────────────────────────────────────────────────────────
// FIELDS
// ───────────────────────────────────────────────────────────────────

/**
 * Vector field for particle advection and flow simulation.
 * 
 * Defines a 3D vector at each point in space.
 * Used for curl noise, force fields, etc.
 */
export interface VectorField {
  /** Field name/identifier */
  name: string
  
  /** Vector output node (returns vec3 given position) */
  fieldNode: Node
  
  /** Uniforms for field parameters */
  uniforms?: Record<string, any>
}

// ───────────────────────────────────────────────────────────────────
// SDF PRIMITIVES
// ───────────────────────────────────────────────────────────────────

/**
 * Signed Distance Field primitive.
 * 
 * Defines implicit geometry via distance function.
 * Negative inside, positive outside, zero on surface.
 */
export interface SDFPrimitive {
  /** Primitive name */
  name: string
  
  /** Distance field node (returns float distance given position) */
  sdfNode: Node
  
  /** Center position in world space */
  center: [number, number, number]
  
  /** Axis-aligned bounding box */
  bounds: {
    min: [number, number, number]
    max: [number, number, number]
  }
}

// ───────────────────────────────────────────────────────────────────
// PARTICLE SYSTEMS
// ───────────────────────────────────────────────────────────────────

/**
 * Particle system configuration.
 * 
 * Defines update logic, initialization, and attributes for a particle system.
 * Can be CPU or GPU (compute shader) based.
 */
export interface ParticleAttributeConfig {
  size: number
  default: number | number[]
}

export interface ParticleAttributeBuffer {
  array: Float32Array
  size: number
}

export interface ParticleKernelContext {
  index: number
  count: number
  time: number
  deltaTime: number
  random: () => number
  getAttribute: (name: string) => Float32Array
  attributeArrays: Record<string, ParticleAttributeBuffer>
}

export interface ParticleCpuKernel {
  init?: (context: ParticleKernelContext) => void
  update: (context: ParticleKernelContext) => void
}

export interface ParticleSystemConfig {
  /** System name */
  name: string
  
  /** Number of particles */
  count: number
  
  /** Update node: computes new particle state per frame */
  updateNode: Node
  
  /** Initialization node: sets initial particle state */
  initNode: Node
  
  /** Uniforms for system parameters */
  uniforms?: Record<string, any>
  
  /** Particle attributes (position, velocity, etc.) */
  attributes: Record<string, ParticleAttributeConfig>
  
  /** Optional compute shader flag */
  useCompute?: boolean

  /** Optional CPU kernel for runtime simulation */
  cpuKernel?: ParticleCpuKernel
}

// ───────────────────────────────────────────────────────────────────
// ENGINE SKETCH
// ───────────────────────────────────────────────────────────────────

/**
 * Complete engine sketch configuration.
 * 
 * Composes material, postfx, and background into a single TSL node.
 */
export interface EngineSketchConfig {
  /** Material configuration */
  material?: MaterialNodeConfig
  
  /** Post-processing chain */
  postfx?: PostFXChain
  
  /** Background color node (fallback if no material) */
  background?: Node
  
  /** Optional particle systems */
  particles?: ParticleSystemConfig[]
  
  /** Optional vector fields */
  fields?: VectorField[]
}
