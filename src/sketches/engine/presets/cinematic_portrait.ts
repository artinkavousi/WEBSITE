import { fbm } from '@/tsl/noise/fbm'
import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, exp, length, mix, screenSize, smoothstep, time, vec2, vec3 } from 'three/tsl'

const cinematicPortrait = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).toVar()
  const t = time.mul(0.05)

  const focal = length(uvAspect.sub(vec2(-0.1, -0.05)))
  const faceMask = exp(focal.mul(-6.0))
  const rim = smoothstep(0.2, 0.6, uvAspect.x.add(0.4))
  const background = mix(vec3(0.04, 0.05, 0.07), vec3(0.25, 0.15, 0.2), uvAspect.x.mul(0.5).add(0.5))

  const skinGrain = grainTextureEffect(uvAspect.mul(1.5).add(time.mul(0.1))).mul(0.08)
  const skin = mix(vec3(0.94, 0.7, 0.58), vec3(0.75, 0.45, 0.4), fbm(vec3(uvAspect.mul(2.0), t), 3.0, 1.6, 0.7).mul(0.5).add(0.5))
  const keyLight = mix(vec3(0.8, 0.55, 0.4), vec3(1.0, 0.8, 0.6), rim)

  const color = background
    .mul(faceMask.oneMinus())
    .add(skin.mul(faceMask).add(keyLight.mul(faceMask.mul(0.6))))
    .toVar()
  color.addAssign(skinGrain)

  return color
})

export default cinematicPortrait
