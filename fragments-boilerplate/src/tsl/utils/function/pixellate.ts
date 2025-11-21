import { Fn, floor, float, screenSize } from 'three/tsl'

/**
 * Returns pixellated UV coordinates.
 * @param {vec2} _uv - The UV coordinates.
 * @param {number} [size=20.0] - The size of the pixellation.
 */
export const pixellateUV = Fn(([_uv, size = 20.0]) => {
  const _size = float(size)
  const pixelSize = _size.div(screenSize.x)
  return floor(_uv.div(pixelSize)).mul(pixelSize)
})


