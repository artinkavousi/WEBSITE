import type { NodeRepresentation } from 'three/tsl'

export type TSLColorNode = NodeRepresentation
export type SketchControls = Record<string, any>
export type SketchFactory = (controls?: SketchControls) => TSLColorNode
