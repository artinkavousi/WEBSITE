// @ts-nocheck
import { Fn, smoothstep, pow, uv, float, vec4 } from 'three/tsl'
import { sdSphere } from '@/tsl/fields/sdf/shapes'

const toFloatNode = (value: any) => {
  if (value && typeof value === 'object' && 'isNode' in value) {
    return value
  }

  return float(value)
}

/**
 * Creates a vignette effect for post-processing.
 * @param {Object} props - Effect parameters
 * @param {vec4} props.input - The input color texture from the scene
 * @param {number} [props.radius=0.5] - The radius at which the vignette falloff reaches zero.
 * @param {number} [props.smoothing=0.25] - The smoothing of the vignette.
 * @param {number} [props.exponent=5] - The exponent of the vignette.
 * @returns {vec4} The vignette processed color
 */
export const vignetteEffect = Fn((props) => {
  const { input, inputUV = uv, radius = 0.5, smoothing = 0.25, exponent = 5 } = props || {}

  if (!input || typeof (input as any).sample !== 'function') {
    return input ?? vec4(0);
  }

  const _uv = inputUV().toVar()
  const centeredUV = _uv.sub(0.5).toVar()
  const radiusNode = toFloatNode(radius)
  const smoothingNode = toFloatNode(smoothing)
  const exponentNode = toFloatNode(exponent)

  const distance = sdSphere(centeredUV, radiusNode)
  const vignette = smoothstep(smoothingNode.negate(), float(0), distance).oneMinus()
  const vignetteMask = pow(vignette, exponentNode).toVar()

  const originalColor = input.sample(_uv)
  return originalColor.mul(vignetteMask)
})
