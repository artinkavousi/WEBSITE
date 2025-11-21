// @ts-nocheck
import { color, float, vec3, NodeRepresentation } from 'three/tsl';
import { MaterialConfig, Node } from '@/tsl/core/types';

export interface PBRParams {
  baseColor?: NodeRepresentation;
  roughness?: NodeRepresentation;
  metalness?: NodeRepresentation;
  emissive?: NodeRepresentation;
  normal?: Node;
  clearcoat?: NodeRepresentation;
  clearcoatRoughness?: NodeRepresentation;
}

const ensureNode = (val: NodeRepresentation | undefined, defaultVal?: Node): Node | undefined => {
  if (val === undefined) return defaultVal;
  if ((val as any).isNode) return val as Node;
  if (typeof val === 'number') return float(val);
  if (typeof val === 'string') return color(val);
  // Handle array/vec3 like inputs if needed, but NodeRepresentation usually covers basic types
  return val as Node; 
};

export const pbrMaterial = (params: PBRParams = {}): MaterialConfig => {
  const {
    baseColor,
    roughness,
    metalness,
    emissive,
    normal,
    clearcoat,
    clearcoatRoughness
  } = params;

  return {
    colorNode: ensureNode(baseColor, color(1, 1, 1)),
    roughnessNode: ensureNode(roughness, float(0.5)),
    metalnessNode: ensureNode(metalness, float(0.0)),
    emissiveNode: ensureNode(emissive, vec3(0, 0, 0)),
    normalNode: normal,
    clearcoatNode: ensureNode(clearcoat, float(0)),
    clearcoatRoughnessNode: ensureNode(clearcoatRoughness, float(0))
  };
};

