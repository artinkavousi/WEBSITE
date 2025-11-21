// @ts-nocheck
import { Fn, fract, pow, float, smoothstep, length, screenSize } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'

/**
 * Creates an LED screen effect with configurable parameters.
 */
export const ledPattern = Fn((props) => {
  const {
    resolution = screenSize,
    cellSize = float(10),
    intensity = float(0.5),
    intensityFalloff = float(1.8),
    edgeSoftness = float(0.2),
  } = props || {}

  const _uv = screenAspectUV(resolution).toVar()
  const _scaledRes = resolution.div(cellSize)

  _uv.assign(fract(_uv.mul(_scaledRes)).sub(0.5))
  
  // Circle pattern
  const pattern = length(_uv.div(intensity)).oneMinus().toVar()

  pattern.assign(smoothstep(edgeSoftness, 1, pattern))
  pattern.assign(pow(pattern, intensityFalloff))

  return pattern
})


