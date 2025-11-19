import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, Loop, exp, float, length, mix, screenSize, sin, cos, time, vec2, vec3 } from 'three/tsl'

const attractorCloud = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.1).toVar()
  const t = time.mul(0.2)

  const color = vec3(0.0).toVar()

  // @ts-ignore
  Loop({ start: 0, end: 7 }, ({ i }) => {
    const fi = float(i)
    const angle = t.mul(0.8).add(fi.mul(0.75))
    const center = vec2(sin(angle).mul(0.45), cos(angle).mul(0.45))
    const dist = length(uvAspect.sub(center))
    const falloff = exp(dist.mul(-6.5))
    const tint = mix(vec3(0.05, 0.18, 0.35), vec3(0.95, 0.55, 0.2), fi.div(7.0))

    color.addAssign(tint.mul(falloff))
  })

  color.addAssign(grainTextureEffect(uvAspect).mul(0.035))

  return color
})

export default attractorCloud
