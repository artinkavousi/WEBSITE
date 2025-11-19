/**
 * Pixellation PostFX Sketch
 *
 * Demonstrates the TSL pixellationEffect by quantizing UVs of a color gradient.
 */

import { Fn, screenSize, uv, vec3 } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { pixellationEffect } from '@/tsl/post_processing/pixellation_effect'

const pixellationSketch = Fn(() => {
  const aspectUv = screenAspectUV(screenSize)

  // Compute pixelated UVs
  const pixelUv = pixellationEffect(aspectUv, 40.0)

  // Map pixelated UVs into a colorful gradient
  const color = vec3(
    pixelUv.x.mul(0.8).add(0.2),
    pixelUv.y.mul(0.7).add(0.1),
    pixelUv.x.add(pixelUv.y).mul(0.5).add(0.25),
  )

  return color
})

export default pixellationSketch


