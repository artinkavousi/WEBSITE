import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, exp, length, mix, screenSize, sin, time, vec3 } from 'three/tsl'

const goldenGlow = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).toVar()
  const phi = 1.61803398875
  const r = length(uvAspect)
  const t = time.mul(0.12)

  const spiral = sin(uvAspect.x.mul(phi).add(uvAspect.y.mul(-phi)).add(t.mul(0.6))).mul(0.5).add(0.5)
  const glow = exp(r.mul(-5.5)).mul(1.2)

  const base = mix(vec3(0.1, 0.07, 0.04), vec3(0.5, 0.3, 0.12), spiral)
  const highlight = vec3(1.0, 0.78, 0.35).mul(glow)

  const color = base.add(highlight).toVar()
  color.addAssign(grainTextureEffect(uvAspect.mul(phi)).mul(0.03))

  return color
})

export default goldenGlow
