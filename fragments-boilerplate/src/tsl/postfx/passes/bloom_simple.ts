// @ts-nocheck
import { Fn, vec2, float, vec3, vec4, uv } from 'three/tsl'

/**
 * Simple Single-Pass Bloom (Fake Bloom).
 * Uses a crude gaussian blur by sampling neighbors and adding to the result if they exceed a threshold.
 * 
 * Note: For production quality, use a multi-pass bloom provided by Three.js PostProcessing class 
 * instead of a TSL node chain. TSL node chains are best for per-pixel color math (grading, noise, distortion).
 * 
 * @param {Object} props
 * @param {Node} props.input - Input color node (must be a texture/pass node to allow sampling).
 * @param {number} [props.threshold=0.8] - Luminance threshold.
 * @param {number} [props.strength=0.3] - Glow strength.
 * @param {number} [props.radius=0.002] - Blur radius (UV space).
 */
export const simpleBloomEffect = Fn(({ input, threshold = 0.8, strength = 0.3, radius = 0.002 }) => {
  if (!input || typeof (input as any).sample !== 'function') {
    return input ?? vec4(0);
  }

  // If input is just a color, we can't blur it. It must be sampleable.
  // Assuming 'input' supports .sample(uv).
  
  const _threshold = float(threshold)
  const _strength = float(strength)
  const _radius = float(radius)
  
  const baseUV = uv().toVar()
  
  const glow = vec3(0).toVar()
  
  const sampleAndAdd = (x: number, y: number) => {
    const offset = vec2(x, y).mul(_radius)
    const c = input.sample(baseUV.add(offset)).rgb
    // Luminance check
    const lum = c.r.mul(0.2126).add(c.g.mul(0.7152)).add(c.b.mul(0.0722))
    // Add if above threshold (soft knee could be better)
    const factor = lum.sub(_threshold).max(0.0)
    glow.addAssign(c.mul(factor))
  }

  // Center
  sampleAndAdd(0, 0)
  // Cardinal
  sampleAndAdd(1, 0)
  sampleAndAdd(-1, 0)
  sampleAndAdd(0, 1)
  sampleAndAdd(0, -1)
  // Diagonals
  sampleAndAdd(0.7, 0.7)
  sampleAndAdd(-0.7, -0.7)
  sampleAndAdd(0.7, -0.7)
  sampleAndAdd(-0.7, 0.7)
  
  const finalGlow = glow.div(9.0).mul(_strength)
  
  const originalSample = input.sample(baseUV)
  const original = originalSample.rgb
  return vec4(original.add(finalGlow), originalSample.a)
})
