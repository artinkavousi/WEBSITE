import { Fn, uv, vec2, vec3, abs, floor, sin, PI, screenSize } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { grainTextureEffect } from '@/tsl/effects/grain_texture_effect'
import { crtScanlineEffect } from '@/tsl/post_processing/crt_scanline_effect'

/**
 * Pulse grid sketch with alternating bands and CRT-style scanline texture.
 */
const gridPulse = Fn(() => {
  const _uv = screenAspectUV(screenSize)
  const uv0 = uv().toVar()

  const grid = floor(abs(_uv).mul(vec2(8.0, 12.0)))
  const pulse = sin(grid.x.add(grid.y).mul(0.5).add(uv0.x.mul(PI))).abs()

  const base = vec3(pulse.mul(0.5).add(0.25))
  const highlight = vec3(0.8, 0.6, 0.4).mul(pulse)

  const scanlines = crtScanlineEffect(uv0, 1.2, 0.8)
  const grain = grainTextureEffect(uv0).mul(0.06)

  return base.add(highlight).add(scanlines).add(grain)
})

export default gridPulse
