/**
 * Materials Module
 * 
 * Re-exports all engine materials and material utilities.
 */

// Core material types (already exported from engine/core, but convenient to have here too)
export type { MaterialNodeConfig, MaterialParams, MaterialFactory } from '../core/engineTypes'

// Material library
export * from './library/basicLambert'
export * from './library/phiMetal'

