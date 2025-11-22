import { Fn } from 'three/tsl'
import { grainTextureEffect } from '@/tsl/postfx/passes/grain_texture_effect'
import { vignetteEffect } from '@/tsl/postfx/passes/vignette_effect'

type GrainVignetteProps = {
  input: any
  inputUV?: any
  intensity?: number
  scale?: number
  smoothing?: number
  exponent?: number
}

/**
 * Simple preset that applies a vignette mask and layered grain on top of a rendered scene.
 */
export const grainVignette = Fn((props: GrainVignetteProps) => {
  const { input, inputUV, intensity = 0.1, scale = 1.0, smoothing = 0.25, exponent = 5 } = props || {}

  const withVignette = vignetteEffect({ input, inputUV, smoothing, exponent })
  return grainTextureEffect({ input: withVignette, inputUV, intensity, scale })
})
