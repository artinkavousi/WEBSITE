import { Fn, vec2, vec3, float, sin, cos, fract, length, smoothstep, dot, vec4, uv, screenSize } from 'three/tsl'

const toFloatNode = (value: any) => {
  if (value && typeof value === 'object' && 'isNode' in value) {
    return value
  }

  return float(value)
}

const toVec3Node = (value: any) => {
  if (!value && value !== 0) {
    return null
  }

  if (value && typeof value === 'object' && 'isNode' in value) {
    return value
  }

  if (Array.isArray(value)) {
    return vec3(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0)
  }

  return vec3(value)
}

/**
 * Creates a halftone dot pattern effect for print/comic book aesthetics in post-processing.
 * @param {Object} props - Effect parameters
 * @param {vec4} props.input - The input color texture from the scene
 * @param {number} [props.frequency=20] - Frequency of the halftone dots
 * @param {number} [props.angle=0.785] - Rotation angle of the pattern (radians, default ~45 degrees)
 * @param {number} [props.smoothness=0.05] - Edge smoothness of the dots
 * @returns {vec4} The halftone processed color
 */
export const halftoneEffect = Fn((props) => {
  const { input, inputUV = uv, frequency = 100, angle = 0.5, smoothness = 0.1, color = null } = props || {}

  if (!input || typeof (input as any).sample !== 'function') {
    return input ?? vec4(0);
  }

  const _uv = inputUV().toVar()

  const _frequency = toFloatNode(frequency)
  const _angle = toFloatNode(angle)
  const _smoothness = toFloatNode(smoothness)

  // Aspect correct UV coordinates
  const aspect = screenSize.x.div(screenSize.y).toVar()
  const aspectCorrectedUV = vec2(_uv.x.mul(aspect), _uv.y).toVar()

  // Rotate UV coordinates
  const c = cos(_angle).toVar()
  const s = sin(_angle).toVar()
  const rotatedUV = vec2(dot(aspectCorrectedUV, vec2(c, s.negate())), dot(aspectCorrectedUV, vec2(s, c))).toVar()

  // Create grid
  const gridUV = fract(rotatedUV.mul(_frequency)).sub(0.5).toVar()

  const originalColor = input.sample(_uv)
  const brightness = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114)).toVar()

  // Create dots with size based on brightness
  const dotSize = brightness.mul(0.7).add(0.15).toVar()
  const dist = length(gridUV).toVar()
  const innerEdge = dotSize.sub(_smoothness).toVar()
  const outerEdge = dotSize.add(_smoothness).toVar()
  const mask = smoothstep(innerEdge, outerEdge, dist).oneMinus().toVar()

  const tintNode = toVec3Node(color)
  const finalColor = tintNode ? tintNode.mul(mask) : originalColor.rgb.mul(mask)

  return vec4(finalColor, originalColor.a)
})
