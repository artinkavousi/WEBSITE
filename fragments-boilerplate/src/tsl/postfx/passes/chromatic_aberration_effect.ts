// @ts-nocheck
import { Fn, float, vec2, vec4, uv } from 'three/tsl'

/**
 * Chromatic aberration effect.
 * @param {Object} props
 * @param {Node} props.input - The input texture node (must be sampleable).
 * @param {Node} [props.offset=0.005] - The offset amount.
 * @param {Node} [props.direction=vec2(1)] - The direction of the split.
 */
export const chromaticAberrationEffect = Fn(({ input, offset = 0.005, direction = vec2(1.0) }) => {
  // In the new multi-pass pipeline, 'input' is always a texture node from the previous pass.
  // But we keep the check just in case.
  if (!input || typeof (input as any).sample !== 'function') {
    return input ?? vec4(0)
  }

  const baseUV = uv().toVar()
  const dir = direction.mul(float(offset))

  // Sample R, G, B channels at slightly different offsets
  const rSample = input.sample(baseUV.add(dir))
  const gSample = input.sample(baseUV)
  const bSample = input.sample(baseUV.sub(dir))

  return vec4(rSample.r, gSample.g, bSample.b, gSample.a)
})
