// @ts-nocheck
import { Fn, smoothstep, pow, float } from 'three/tsl'
import { sdSphere } from '@/tsl/fields/sdf/shapes'

const toFloatNode = (value: any) => {
  if (value && typeof value === 'object' && 'isNode' in value) {
    return value
  }

  return float(value)
}

/**
 * Creates a vignette effect given the current UV coordinates.
 * @param {vec2} _uv - The UV coordinates.
 * @param {number} [radius=0.5] - The radius of the vignette falloff.
 * @param {number} [smoothing=0.45] - The smoothing of the vignette.
 * @param {number} [exponent=1.2] - The exponent of the vignette.
 * @returns {float} The vignette effect value.
 */
export const vignetteEffect = Fn(([_uv, radius = 0.5, smoothing = 0.45, exponent = 1.2]) => {
  const radiusNode = toFloatNode(radius)
  const smoothingNode = toFloatNode(smoothing)
  const exponentNode = toFloatNode(exponent)

  const distance = sdSphere(_uv, radiusNode)
  const falloff = smoothstep(smoothingNode.negate(), float(0), distance).oneMinus()

  return pow(falloff, exponentNode)
})
