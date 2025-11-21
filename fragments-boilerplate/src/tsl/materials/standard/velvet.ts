// @ts-nocheck
import { color, float, NodeRepresentation, vec3 } from 'three/tsl';
import { MaterialConfig, Node } from '@/tsl/core/types';

export interface VelvetParams {
  baseColor?: NodeRepresentation;
  sheen?: NodeRepresentation;
  sheenRoughness?: NodeRepresentation;
  roughness?: NodeRepresentation;
}

const ensureNode = (val: NodeRepresentation | undefined, defaultVal: Node): Node => {
  if (val === undefined) return defaultVal;
  if ((val as any).isNode) return val as Node;
  if (typeof val === 'number') return float(val);
  if (typeof val === 'string') return color(val);
  return val as Node;
};

export const velvetMaterial = (params: VelvetParams = {}): MaterialConfig => {
  const {
    baseColor = color('#4c0013'), // Deep red default
    sheen = color('#ff99aa'),     // Pinkish sheen
    sheenRoughness = 0.5,
    roughness = 1.0               // Cloth is usually rough base
  } = params;

  return {
    colorNode: ensureNode(baseColor, color(1, 1, 1)),
    roughnessNode: ensureNode(roughness, float(1.0)),
    metalnessNode: float(0.0),
    // Sheen is key for velvet
    sheenNode: ensureNode(sheen, color(1, 1, 1)),
    sheenRoughnessNode: ensureNode(sheenRoughness, float(0.5)),
  };
};

