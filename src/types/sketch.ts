/**
 * Type definitions for the sketch gallery and content management system.
 */

import { Node } from 'three/tsl'

/**
 * Category of sketch (used for filtering and organization)
 */
export type SketchCategory =
  | 'materials'
  | 'postfx'
  | 'particles'
  | 'fields'
  | 'presets'
  | 'experimental'
  | 'showcase'
  | 'base'

/**
 * Difficulty level for learning purposes
 */
export type SketchDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

/**
 * Tags for additional classification
 */
export type SketchTag =
  | 'animated'
  | 'interactive'
  | 'compute'
  | 'pbr'
  | 'stylized'
  | 'procedural'
  | 'noise'
  | 'lighting'
  | '3d'
  | '2d'
  | 'realtime'

/**
 * Metadata for a sketch
 */
export interface SketchMetadata {
  /** Unique identifier (usually file path) */
  id: string
  /** Display name */
  title: string
  /** Short description */
  description: string
  /** Primary category */
  category: SketchCategory
  /** Tags for additional classification */
  tags: SketchTag[]
  /** Difficulty level */
  difficulty: SketchDifficulty
  /** Author name */
  author?: string
  /** Creation/modification date */
  date?: string
  /** Thumbnail image path (optional) */
  thumbnail?: string
  /** Whether this is a featured/hero sketch */
  featured?: boolean
  /** Related modules used */
  modules?: string[]
}

/**
 * Complete sketch entry with code
 */
export interface SketchEntry extends SketchMetadata {
  /** The actual sketch function */
  sketch: () => Node
  /** Source file path */
  source: string
}

/**
 * Gallery section grouping
 */
export interface GallerySection {
  /** Section title */
  title: string
  /** Section description */
  description?: string
  /** Category filter for this section */
  category: SketchCategory
  /** Sketches in this section */
  sketches: SketchMetadata[]
}

