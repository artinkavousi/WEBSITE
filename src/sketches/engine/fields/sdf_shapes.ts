import { grainTextureEffect } from '@/tsl/post_processing/grain_texture_effect'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { sdBox2d, sdEquilateralTriangle, sdHexagon, sdSphere } from '@/tsl/utils/sdf/shapes'
import { smin } from '@/tsl/utils/sdf/operations'
import { Fn, abs, mix, screenSize, smoothstep, time, vec2, vec3 } from 'three/tsl'

const sdfShowcase = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).mul(1.1).toVar()
  const t = time.mul(0.45)

  const pulsingSphere = sdSphere(uvAspect, smoothstep(-1.0, 1.0, t.sin()).mul(0.1).add(0.35))
  const offsetHex = sdHexagon(uvAspect.add(vec2(0.4, 0.25)), 0.35)
  const tiltedBox = sdBox2d(uvAspect.sub(vec2(0.55, -0.3)), 0.3)
  const signatureTri = sdEquilateralTriangle(uvAspect.add(vec2(0.0, -0.2)), 0.45)

  const unionA = smin(pulsingSphere, offsetHex, 0.25)
  const unionB = smin(tiltedBox, signatureTri, 0.25)
  const finalDistance = smin(unionA, unionB, 0.35)

  const fill = smoothstep(-0.35, 0.0, finalDistance).oneMinus()
  const edge = smoothstep(0.02, 0.12, abs(finalDistance)).oneMinus()

  const baseColor = mix(vec3(0.05, 0.07, 0.12), vec3(0.95, 0.55, 0.2), fill)
  const accent = mix(vec3(0.2, 0.25, 0.55), vec3(0.65, 0.8, 1.0), edge)

  const backdrop = mix(vec3(0.02, 0.03, 0.05), vec3(0.15, 0.18, 0.3), uvAspect.y.mul(0.5).add(0.5))
  const finalColor = mix(backdrop, mix(baseColor, accent, edge.mul(0.8)), fill.add(edge.mul(0.5))).toVar()
  finalColor.addAssign(grainTextureEffect(uvAspect).mul(0.04))

  return finalColor
})

export default sdfShowcase
