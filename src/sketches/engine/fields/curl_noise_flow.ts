import { curlNoise3d } from '@/tsl/noise/curl_noise_3d'
import { fbm } from '@/tsl/noise/fbm'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, abs, dot, mix, screenSize, smoothstep, time, vec2, vec3, length } from 'three/tsl'

const curlNoiseFlow = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.4).toVar()
  const t = time.mul(0.1)

  const warp = vec2(
    fbm(vec3(uvAspect, t), 3.0, 1.2, 0.8),
    fbm(vec3(uvAspect.add(vec2(2.5, -1.7)), t), 3.0, 1.2, 0.8),
  ).mul(0.35)
  uvAspect.addAssign(warp)

  const curl = curlNoise3d(vec3(uvAspect, t.mul(0.75))).toVar()
  const dir = vec2(curl.x, curl.y).toVar()
  const dirLen = length(dir).add(0.03)
  const normalizedDir = dir.div(dirLen)

  const flowBand = abs(dot(normalizedDir, uvAspect)).oneMinus()
  const streakMask = smoothstep(0.05, 0.6, flowBand)

  const cool = vec3(0.05, 0.12, 0.28)
  const warm = vec3(0.95, 0.35, 0.25)
  const plasma = vec3(0.35, 0.12, 0.85)

  const swirl = curl.z.mul(0.5).add(0.5)
  const palette = mix(cool, warm, smoothstep(0.1, 0.9, swirl))

  const finalColor = mix(palette, plasma, streakMask).toVar()
  finalColor.mulAssign(smoothstep(0.1, 0.9, curl.x.abs().add(curl.y.abs()).mul(0.5)))
  finalColor.addAssign(grainTextureEffect(uvAspect).mul(0.05))

  return finalColor
})

export default curlNoiseFlow
