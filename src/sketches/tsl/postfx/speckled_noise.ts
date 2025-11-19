/**
 * Speckled Noise PostFX Sketch
 *
 * Demonstrates the TSL speckedNoiseEffect helper as a sparse noise layer.
 */

import { Fn, screenSize, uv, vec3 } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { speckedNoiseEffect } from '@/tsl/post_processing/speckled_noise_effect'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'

const speckledNoiseSketch = Fn(() => {
  const aspectUv = screenAspectUV(screenSize)
  const baseUv = uv()

  // Soft base gradient
  const base = vec3(
    baseUv.x.mul(0.35).add(0.2),
    baseUv.y.mul(0.45).add(0.25),
    baseUv.y.mul(0.3).add(0.35),
  )

  // Sparse bright speckles
  const speckles = speckedNoiseEffect(aspectUv, 0.86).mul(1.5)

  // Faint grain underneath
  const grain = grainTextureEffect(baseUv).mul(0.05)

  const color = base
    .add(vec3(speckles))
    .add(grain)

  return color
})

export default speckledNoiseSketch


