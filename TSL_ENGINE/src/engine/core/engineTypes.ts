/**
 * Core Type Definitions for TSL-WebGPU Engine
 * 
 * This file contains all TypeScript interfaces and types used throughout the engine.
 * These types ensure type safety and provide clear contracts for all engine modules.
 */

import { Node, NodeRepresentation } from 'three/tsl'
import { Material } from 'three'

// ============================================================================
// Material System Types
// ============================================================================

/**
 * Configuration for a material node system.
 * This is the primary interface for defining custom materials in the engine.
 */
export interface MaterialNodeConfig {
  /** Main color output node */
  colorNode: Node
  
  /** Roughness value or node (0 = smooth, 1 = rough) */
  roughnessNode?: Node | number
  
  /** Metalness value or node (0 = dielectric, 1 = metal) */
  metalnessNode?: Node | number
  
  /** Normal map or procedural normal perturbation node */
  normalNode?: Node
  
  /** Emissive/glow output node */
  emissiveNode?: Node
  
  /** Opacity/transparency node (0 = transparent, 1 = opaque) */
  opacityNode?: Node
  
  /** Ambient occlusion node */
  aoNode?: Node
  
  /** Optional callback before material compilation */
  onBeforeCompile?: (material: Material) => void
  
  /** Custom uniforms to expose to shaders */
  uniforms?: Record<string, any>
  
  /** Material metadata */
  metadata?: {
    name?: string
    description?: string
    author?: string
  }
}

/**
 * Base parameters interface for material factories.
 * All specific material parameter interfaces should extend this.
 */
export interface MaterialParams {
  [key: string]: any
}

// ============================================================================
// PostFX System Types
// ============================================================================

/**
 * A single post-processing pass in a chain.
 */
export interface PostFXPass {
  /** Unique identifier for this pass */
  name: string
  
  /** Input node (usually from previous pass or scene) */
  inputNode: Node
  
  /** Output node after processing */
  outputNode: Node
  
  /** Optional uniforms for this pass */
  uniforms?: Record<string, any>
  
  /** Whether this pass is currently active */
  enabled?: boolean
  
  /** Execution order (lower = earlier) */
  order?: number
}

/**
 * A complete post-processing chain configuration.
 */
export interface PostFXChain {
  /** Array of passes to execute in order */
  passes: PostFXPass[]
  
  /** Initial input node (scene color) */
  inputNode: Node
  
  /** Final output node */
  outputNode: Node
  
  /** Optional UI controls configuration */
  controls?: Record<string, any>
  
  /** Chain metadata */
  metadata?: {
    name?: string
    description?: string
  }
}

/**
 * Parameters for configuring a post-FX pass.
 */
export interface PostFXPassParams {
  /** Pass intensity/strength (0-1) */
  intensity?: number
  
  /** Additional custom parameters */
  [key: string]: any
}

// ============================================================================
// Field System Types
// ============================================================================

/**
 * A 3D vector field that can be sampled at any point.
 */
export interface VectorField {
  /** Sample the field at a given position */
  sampleAt: (x: Node, y: Node, z?: Node) => Node
  
  /** Scale factor for field values */
  scale?: number
  
  /** Number of octaves for noise-based fields */
  octaves?: number
  
  /** Frequency for noise-based fields */
  frequency?: number
  
  /** Field metadata */
  metadata?: {
    name?: string
    type?: 'noise' | 'curl' | 'procedural' | 'texture'
  }
}

/**
 * A signed distance field primitive.
 */
export interface SDFPrimitive {
  /** Calculate distance from a point to the surface */
  distance: (p: Node) => Node
  
  /** Parameters for this primitive */
  params: Record<string, any>
  
  /** SDF type */
  type?: 'sphere' | 'box' | 'torus' | 'cylinder' | 'custom'
}

/**
 * Parameters for field generation.
 */
export interface FieldParams {
  /** Scale of the field */
  scale?: number
  
  /** Speed of animation */
  speed?: number
  
  /** Additional parameters */
  [key: string]: any
}

// ============================================================================
// Particle System Types
// ============================================================================

/**
 * Configuration for a GPU-driven particle system.
 */
export interface ParticleSystemConfig {
  /** Number of particles */
  count: number
  
  /** Compute shader for particle initialization */
  computeInit?: Node
  
  /** Compute shader for particle update each frame */
  computeUpdate?: Node
  
  /** Material for rendering particles */
  renderMaterial: Material
  
  /** Custom instance attributes */
  instanceAttributes?: Record<string, any>
  
  /** Particle behavior parameters */
  behavior?: {
    /** Velocity damping factor */
    damping?: number
    
    /** Maximum velocity */
    maxVelocity?: number
    
    /** Attraction/repulsion points */
    attractors?: Array<{ position: [number, number, number]; strength: number }>
    
    /** Bounds for particle containment */
    bounds?: { min: [number, number, number]; max: [number, number, number] }
  }
  
  /** System metadata */
  metadata?: {
    name?: string
    description?: string
  }
}

/**
 * Parameters for particle system creation.
 */
export interface ParticleParams {
  /** Particle count */
  count?: number
  
  /** Particle size */
  size?: number
  
  /** Initial distribution type */
  distribution?: 'sphere' | 'box' | 'disk' | 'custom'
  
  /** Additional parameters */
  [key: string]: any
}

// ============================================================================
// Engine Sketch Configuration
// ============================================================================

/**
 * Complete configuration for an engine-powered sketch.
 * This is the main interface for composing sketches using engine modules.
 */
export interface EngineSketchConfig {
  /** Material configuration */
  material?: MaterialNodeConfig
  
  /** Post-processing chain */
  postfx?: PostFXChain
  
  /** Vector/SDF fields to use */
  fields?: VectorField[]
  
  /** Particle system configuration */
  particles?: ParticleSystemConfig
  
  /** Background color or node */
  background?: Node | [number, number, number]
  
  /** Sketch metadata */
  metadata?: {
    name?: string
    description?: string
    author?: string
    tags?: string[]
  }
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * A factory function that creates a material configuration.
 */
export type MaterialFactory<P extends MaterialParams = MaterialParams> = (
  params?: P
) => MaterialNodeConfig

/**
 * A factory function that creates a post-FX chain.
 */
export type PostFXFactory<P extends PostFXPassParams = PostFXPassParams> = (
  params?: P
) => PostFXChain

/**
 * A factory function that creates a particle system.
 */
export type ParticleSystemFactory<P extends ParticleParams = ParticleParams> = (
  params?: P
) => ParticleSystemConfig

/**
 * A factory function that creates a vector field.
 */
export type VectorFieldFactory<P extends FieldParams = FieldParams> = (
  params?: P
) => VectorField

// ============================================================================
// Engine Module Metadata
// ============================================================================

/**
 * Metadata for any engine module (material, effect, etc.).
 */
export interface EngineModuleMetadata {
  /** Module name */
  name: string
  
  /** Short description */
  description: string
  
  /** Module author */
  author?: string
  
  /** Module version */
  version?: string
  
  /** Module tags for categorization */
  tags?: string[]
  
  /** Usage examples */
  examples?: string[]
  
  /** References to source material */
  references?: string[]
}

