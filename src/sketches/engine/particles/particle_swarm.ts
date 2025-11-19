import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, Loop, exp, float, length, mix, screenSize, sin, cos, time, vec2, vec3 } from 'three/tsl'

const particleSwarm = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.2).toVar()
  const t = time.mul(0.22)

  const color = vec3(0.0).toVar()

  // @ts-ignore
  Loop({ start: 0, end: 32 }, ({ i }) => {
    const fi = float(i)
    const seed = fi.div(32.0)
    const radius = mix(0.15, 0.95, seed)
    const angle = t.mul(1.2).add(seed.mul(12.0))
    const pos = vec2(cos(angle).mul(radius), sin(angle).mul(radius.mul(0.7)))
    const dist = length(uvAspect.sub(pos))
    const falloff = exp(dist.mul(-18.0))
    const tint = mix(vec3(0.1, 0.2, 0.4), vec3(0.95, 0.6, 0.2), seed)

    color.addAssign(tint.mul(falloff))
  })

  color.addAssign(grainTextureEffect(uvAspect).mul(0.02))

  return color
})

export default particleSwarm
