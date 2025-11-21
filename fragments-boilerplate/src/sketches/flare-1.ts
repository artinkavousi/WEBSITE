// @ts-nocheck
/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 *
 * This sketch is licensed under CC BY-NC-SA 4.0. You are free to:
 * - Share and adapt this work
 * - Use modified versions commercially
 *
 * Under these conditions:
 * - Attribution: Credit Ben McCormick (phobon) and link to this project
 * - NonCommercial: Don't sell the original, unmodified sketch
 * - ShareAlike: Distribute derivatives under the same license
 */

import { abs, Fn, oneMinus, screenSize, uv, vec3, floor, sin, PI, mul, Loop, vec2, float } from 'three/tsl'
import { cosinePalette } from '@/tsl/utils/color/cosine_palette'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { grainTexture } from '@/tsl/patterns/grain'

export type FlareSketchConfig = {
  repetitions?: number
  bandOffset?: number
  paletteShift?: number
  grainIntensity?: number
}

const defaults: Required<FlareSketchConfig> = {
  repetitions: 12,
  bandOffset: 0.05,
  paletteShift: 0.0,
  grainIntensity: 0.1,
}

const createFlareNode = (config: FlareSketchConfig = {}) => {
  const cfg = { ...defaults, ...config }

  return Fn(() => {
    const _uv = screenAspectUV(screenSize)
    const uv0 = uv().toVar()

    const finalColor = vec3(0).toVar()

    const a = vec3(0.5, 0.5, 0.5)
    const b = vec3(0.5, 0.5, 0.5)
    const c = vec3(2.0, 1.0, 0.0)
    const d = vec3(0.5, 0.2, 0.25)

    const repetitions = cfg.repetitions
    const uvR = floor(_uv.y.mul(repetitions))

    const s = sin(uv0.y.mul(PI))

    const bandOffsetNode = float(cfg.bandOffset)
    const paletteShiftNode = float(cfg.paletteShift)
    const grainIntensityNode = float(cfg.grainIntensity)

    // @ts-ignore
    Loop({ start: 0, end: repetitions }, ({ i: _i }) => {
      const f = mul(uvR.mul(_i), 0.005)
      const offsetUv = vec2(_uv.x, _uv.y.add(f).add(mul(s, bandOffsetNode)))

      const r = oneMinus(abs(offsetUv.x.mul(1.5))).add(abs(offsetUv.y.mul(1.5)))

      const col = cosinePalette(uv0.y.mul(0.25).add(paletteShiftNode), a, b, c, d)

      finalColor.assign(col.mul(r))
    })

    const g = grainTexture(uv0).mul(grainIntensityNode)
    finalColor.addAssign(g)

    return finalColor
  })()
}

/**
 * A gradient sketch with fractionated coordinates.
 */
export default function flare1(config?: FlareSketchConfig) {
  return createFlareNode(config)
}
