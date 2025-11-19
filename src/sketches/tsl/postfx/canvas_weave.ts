/**
 * Canvas Weave PostFX Sketch
 *
 * Demonstrates the TSL canvas weave and speckled noise helpers
 * as a standalone fullscreen 2D texture.
 */

import { Fn, screenSize, uv, vec3 } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { canvasWeaveEffect } from '@/tsl/post_processing/canvas_weave_effect'
import { speckedNoiseEffect } from '@/tsl/post_processing/speckled_noise_effect'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'

const canvasWeaveSketch = Fn(() => {
  const aspectUv = screenAspectUV(screenSize)
  const baseUv = uv()

  // Fabric base tone
  const baseColor = vec3(0.88, 0.84, 0.78)

  // Weave pattern (scalar 0–1)
  const weave = canvasWeaveEffect(aspectUv)

  // Subtle speckles and film grain for extra texture
  const speckles = speckedNoiseEffect(aspectUv.mul(3.0), 0.9)
  const grain = grainTextureEffect(baseUv).mul(0.08)

  const fabric = baseColor
    .mul(weave) // weave modulation
    .add(vec3(speckles).mul(0.15))
    .add(grain)

  return fabric
})

export default canvasWeaveSketch


