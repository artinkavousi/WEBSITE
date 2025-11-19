import { fbm } from '@/tsl/noise/fbm'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, abs, mix, screenSize, smoothstep, time, vec3 } from 'three/tsl'

const depthOfFieldSketch = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).toVar()
  const t = time.mul(0.25)

  const depth = uvAspect.y.add(fbm(vec3(uvAspect.mul(2.5), t), 3.0, 1.5, 0.7).mul(0.25))
  const focusPlane = t.sin().mul(0.15)
  const focusResponse = smoothstep(0.0, 0.18, abs(depth.sub(focusPlane)))
  const sharpMask = focusResponse.oneMinus()
  const blurMask = focusResponse

  const nearColor = mix(vec3(0.2, 0.35, 0.6), vec3(0.95, 0.6, 0.45), uvAspect.y.mul(0.5).add(0.5))
  const farColor = mix(vec3(0.05, 0.06, 0.08), vec3(0.25, 0.28, 0.32), depth.mul(0.5).add(0.5))

  const color = nearColor.mul(sharpMask).add(farColor.mul(blurMask)).toVar()
  color.addAssign(grainTextureEffect(uvAspect).mul(0.035).mul(blurMask.add(0.2)))

  return color
})

export default depthOfFieldSketch
