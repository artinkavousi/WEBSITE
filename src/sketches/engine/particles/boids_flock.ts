import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, Loop, exp, float, length, mix, screenSize, sin, cos, time, vec2, vec3 } from 'three/tsl'

const boidsFlock = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.2).toVar()
  const t = time.mul(0.35)

  const color = vec3(0.0).toVar()

  // @ts-ignore
  Loop({ start: 0, end: 18 }, ({ i }) => {
    const fi = float(i)
    const heading = t.add(fi.mul(0.35))
    const orbit = sin(heading.mul(0.7)).mul(0.4)
    const pos = vec2(sin(heading).mul(0.7), cos(heading.mul(1.1)).mul(0.45)).add(vec2(orbit, orbit.mul(0.5)))
    const dist = length(uvAspect.sub(pos))
    const plume = exp(dist.mul(-14.0)).mul(1.2)
    const tint = mix(vec3(0.1, 0.2, 0.45), vec3(0.9, 0.9, 0.3), fi.div(18.0))

    color.addAssign(tint.mul(plume))
  })

  color.addAssign(grainTextureEffect(uvAspect).mul(0.03))

  return color
})

export default boidsFlock
