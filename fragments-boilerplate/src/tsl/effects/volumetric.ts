// @ts-nocheck
import {
  Fn,
  float,
  vec3,
  uv,
  mix,
  smoothstep,
  length
} from 'three/tsl';

/**
 * Simple Volumetric Fog Effect (Fake).
 * Uses depth-based exponential fog pattern mixed with noise.
 * For a post-process effect, this assumes input is a color buffer and we have depth access.
 * 
 * @param {Object} props
 * @param {Node} props.input - Input color node.
 * @param {Node} props.depthNode - Depth node (e.g. linearDepth).
 * @param {Node} [props.color=vec3(0.8, 0.9, 1.0)] - Fog color.
 * @param {Node} [props.density=0.05] - Fog density.
 */
export const simpleVolumetricFog = Fn(({ input, depthNode, color = vec3(0.8, 0.9, 1.0), density = 0.05 }) => {
  const d = depthNode;
  const fogFactor = float(1.0).sub(d.mul(density).negate().exp());
  const fogged = mix(input, color, fogFactor);
  return fogged;
});


