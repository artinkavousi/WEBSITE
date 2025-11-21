// @ts-nocheck
export type Node = any;

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
  sheenNode?: Node;
  sheenRoughnessNode?: Node;
  transmissionNode?: Node;
  thicknessNode?: Node;
  iorNode?: Node;
  dispersionNode?: Node;
  [key: string]: any; // Allow extra props
}

/**
 * Configuration for a Post-Processing Chain.
 */
export interface PostFXChainConfig {
  inputNode?: Node;
  outputNode?: Node;
  passes: PostFXPass[];
}

/**
 * A single pass in a Post-Processing chain.
 */
export interface PostFXPass {
  name?: string;
  enabled?: boolean;
  fn: (props: any) => Node;
  params?: Record<string, any>;
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
  [key: string]: any;
}
