import { fbm } from '@/tsl/noise/fbm'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, Loop, float, mix, screenSize, smoothstep, time, vec2, vec3 } from 'three/tsl'

const flowFieldTrails = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.4).toVar()
  const t = time.mul(0.12)

  const color = vec3(0.0).toVar()

  // @ts-ignore
  Loop({ start: 0, end: 24 }, ({ i }) => {
    const fi = float(i)
    const seed = fi.div(24.0)
    const path = uvAspect.add(vec2(seed.mul(1.6).sub(0.8), seed.mul(0.8).sub(0.4)))
    const noise = fbm(vec3(path.mul(3.0), t.add(seed.mul(4.0))), 3.0, 1.8, 0.8)
    const trail = smoothstep(0.35, 0.02, path.x.add(noise.mul(0.3)).abs())
    const tint = mix(vec3(0.05, 0.1, 0.2), vec3(0.3, 0.8, 0.9), seed)

    color.addAssign(tint.mul(trail))
  })

  color.addAssign(grainTextureEffect(uvAspect).mul(0.025))

  return color
})

export default flowFieldTrails
