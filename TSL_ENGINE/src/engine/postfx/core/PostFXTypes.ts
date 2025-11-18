/**
 * Post-Processing Types and Utilities
 * 
 * Core types for the post-processing system.
 * These types are already defined in engineTypes.ts, but we re-export them here
 * for convenience and add PostFX-specific helpers.
 */

export type {
  PostFXPass,
  PostFXChain,
  PostFXPassParams,
  PostFXFactory,
} from '../../core/engineTypes'

/**
 * Standard post-FX pass categories for organization.
 */
export type PostFXCategory =
  | 'blur'
  | 'bloom'
  | 'color'
  | 'distortion'
  | 'noise'
  | 'sharpen'
  | 'composite'
  | 'utility'

/**
 * Extended pass metadata for better organization.
 */
export interface PostFXPassMetadata {
  /** Pass category */
  category: PostFXCategory
  
  /** Performance cost estimate (1-5, 5 being most expensive) */
  cost?: number
  
  /** Whether this pass requires specific WebGPU features */
  requiresWebGPU?: boolean
  
  /** Recommended quality settings for this pass */
  qualityLevels?: {
    low?: Record<string, any>
    medium?: Record<string, any>
    high?: Record<string, any>
  }
}

