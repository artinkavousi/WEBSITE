import type { SketchControls, SketchFactory } from './types'

/**
 * Minimal helper to build a sketch entry with optional controls.
 * Keeps typings localized so registry remains lightweight.
 */
export const makeSketch = (factory: SketchFactory, controls?: SketchControls) => ({
  factory,
  controls: controls ?? {},
})
