// @ts-nocheck
import { color, float, ior, transmission, vec3, NodeRepresentation } from 'three/tsl';
import { MaterialConfig, Node } from '@/tsl/core/types';

export interface GlassParams {
  baseColor?: NodeRepresentation;
  roughness?: NodeRepresentation;
  metalness?: NodeRepresentation;
  transmission?: NodeRepresentation;
  thickness?: NodeRepresentation;
  ior?: NodeRepresentation;
  dispersion?: NodeRepresentation;
}

const ensureNode = (val: NodeRepresentation | undefined, defaultVal?: Node): Node | undefined => {
    if (val === undefined) return defaultVal;
    if ((val as any).isNode) return val as Node;
    if (typeof val === 'number') return float(val);
    if (typeof val === 'string') return color(val);
    return val as Node; 
};

export const glassMaterial = (params: GlassParams = {}): MaterialConfig => {
  const {
    baseColor,
    roughness,
    metalness,
    transmission: trans,
    thickness,
    ior: iorVal,
    dispersion
  } = params;

  // Note: In TSL/WebGPU, some of these might need to be set directly on the material properties 
  // rather than just returning nodes, depending on how we construct the MeshPhysicalNodeMaterial.
  // But for now, we return the config to be spread.

  return {
    colorNode: ensureNode(baseColor, color(1, 1, 1)),
    roughnessNode: ensureNode(roughness, float(0.05)),
    metalnessNode: ensureNode(metalness, float(0.0)),
    // Special properties for physical material (need to handle these in the sketch usually, 
    // as they are properties, not just nodes, but r181 is unifying this)
    transmissionNode: ensureNode(trans, float(1.0)),
    thicknessNode: ensureNode(thickness, float(0.5)),
    iorNode: ensureNode(iorVal, float(1.5)),
    dispersionNode: ensureNode(dispersion, float(0.02))
  };
};

