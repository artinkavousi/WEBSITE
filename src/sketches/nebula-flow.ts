import { Fn, uv, vec3, screenSize, add, clamp } from 'three/tsl'
import { cosinePalette } from '@/tsl/utils/color/cosine_palette'
import { domainWarpedFbm } from '@/tsl/noise/fbm'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { grainTextureEffect } from '@/tsl/effects/grain_texture_effect'

/**
 * Soft-flowing nebula clouds driven by domain-warped FBM and cosine palette blending.
 */
const nebulaFlow = Fn(() => {
  const baseUv = screenAspectUV(screenSize).mul(1.25)
  const uv0 = uv().toVar()

  const warped = domainWarpedFbm(vec3(baseUv, 0.0), 5.0, 1.25, 1.0, 2.0, 0.55, 0.15)

  const warmPalette = cosinePalette(warped, vec3(0.3), vec3(0.6), vec3(1.2, 0.6, 0.2), vec3(0.2, 0.1, 0.05))
  const coolPalette = cosinePalette(warped, vec3(0.4), vec3(0.4), vec3(0.2, 0.6, 1.2), vec3(0.05, 0.1, 0.2))

  const mixFactor = clamp(add(warped.mul(0.5), baseUv.y.mul(0.35)), 0.0, 1.0)

  const cloud = warmPalette.mix(coolPalette, mixFactor)

  const grain = grainTextureEffect(uv0).mul(0.08)

  return cloud.add(grain)
})

export default nebulaFlow
