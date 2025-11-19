import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, abs, fract, mix, screenSize, smoothstep, time, vec3 } from 'three/tsl'

const neonMetropolis = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.3).toVar()
  const grid = fract(uvAspect.mul(6.0)).sub(0.5).abs()
  const horizontal = smoothstep(0.0, 0.08, grid.y)
  const vertical = smoothstep(0.0, 0.08, grid.x)

  const neonMask = horizontal.oneMinus().mul(vertical.oneMinus())
  const parallax = smoothstep(-0.5, 0.5, uvAspect.y.add(time.mul(0.1)))

  const color = mix(vec3(0.02, 0.02, 0.05), vec3(0.2, 0.35, 0.6), parallax)
    .add(vec3(0.1, 0.9, 0.9).mul(neonMask))
    .add(vec3(0.9, 0.2, 0.8).mul(vertical.oneMinus().mul(0.5)))
    .toVar()

  color.addAssign(grainTextureEffect(uvAspect.mul(2.0)).mul(0.04))

  return color
})

export default neonMetropolis
