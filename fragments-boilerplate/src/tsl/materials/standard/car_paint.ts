// @ts-nocheck
import { color, float, NodeRepresentation, vec3, normalWorld, cross, mix } from 'three/tsl';
import { MaterialConfig, Node } from '@/tsl/core/types';
import { simplexNoise3d } from '@/tsl/fields/noise/simplex_noise_3d';

export interface CarPaintParams {
  baseColor?: NodeRepresentation;
  metalness?: NodeRepresentation;
  roughness?: NodeRepresentation;
  clearcoat?: NodeRepresentation;
  clearcoatRoughness?: NodeRepresentation;
  flakeSize?: number;
  flakeIntensity?: number;
}

const ensureNode = (val: NodeRepresentation | undefined, defaultVal: Node): Node => {
  if (val === undefined) return defaultVal;
  if ((val as any).isNode) return val as Node;
  if (typeof val === 'number') return float(val);
  if (typeof val === 'string') return color(val);
  return val as Node;
};

export const carPaintMaterial = (params: CarPaintParams = {}): MaterialConfig => {
  const {
    baseColor = color('#0044ff'),
    metalness = 0.7,
    roughness = 0.2,
    clearcoat = 1.0,
    clearcoatRoughness = 0.05,
    flakeSize = 200.0,
    flakeIntensity = 0.3
  } = params;

  // Create flake normals using noise
  // We perturb the normal slightly based on high-freq noise
  const flakes = simplexNoise3d(normalWorld.mul(float(flakeSize)));
  const perturbedNormal = mix(normalWorld, cross(normalWorld, vec3(0,1,0)).add(normalWorld), flakes.mul(float(flakeIntensity)));

  // Note: Modifying the normalNode affects lighting. 
  // For real metallic flakes, we might want to perturb the normal used for the metallic layer specifically,
  // but standard material has one normal. 
  // A subtle noise on the normal gives a sparkly effect.

  return {
    colorNode: ensureNode(baseColor, color(0, 0, 1)),
    metalnessNode: ensureNode(metalness, float(0.7)),
    roughnessNode: ensureNode(roughness, float(0.2)),
    clearcoatNode: ensureNode(clearcoat, float(1.0)),
    clearcoatRoughnessNode: ensureNode(clearcoatRoughness, float(0.05)),
    // We apply the flakes to the normal
    normalNode: perturbedNormal.normalize()
  };
};

