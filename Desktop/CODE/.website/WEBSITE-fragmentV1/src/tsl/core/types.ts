import { Node } from 'three/tsl';

/**
 * Configuration object returned by a Material Factory.
 * This mimics the properties of a standard Three.js NodeMaterial.
 */
export interface MaterialConfig {
  colorNode?: Node;
  roughnessNode?: Node;
  metalnessNode?: Node;
  normalNode?: Node;
  emissiveNode?: Node;
  opacityNode?: Node;
  clearcoatNode?: Node;
  clearcoatRoughnessNode?: Node;
  positionNode?: Node;
}

/**
 * Configuration for a Post-Processing Chain.
 */
export interface PostFXChainConfig {
  inputNode: Node;
  outputNode: Node;
  passes: PostFXPass[];
}

/**
 * A single pass in a Post-Processing chain.
 */
export interface PostFXPass {
  name: string;
  enabled: boolean;
  params: Record<string, any>;
}

/**
 * Configuration for a Particle System.
 */
export interface ParticleSystemConfig {
  count: number;
  initKernel: Node;
  updateKernel: Node;
  positionNode: Node;
  colorNode: Node;
  sizeNode?: Node;
}


