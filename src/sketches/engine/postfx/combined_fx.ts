import { createEngineSketch } from '@/engine/core/createEngineSketch'
import { createBasicLambert } from '@/engine/materials/basicLambert'
import { createBloomChain } from '@/engine/postfx/bloomChain'
import { combinePostFXChains } from '@/engine/postfx/combineChains'
import { createGrainVignette } from '@/engine/postfx/grainVignette'
import { Fn, vec3 } from 'three/tsl'

const fxChain = combinePostFXChains([
  createBloomChain({
    strength: 0.5,
    radius: 0.4,
    threshold: 0.2,
  }),
  createGrainVignette({
    grainIntensity: 0.2,
    vignetteIntensity: 0.6,
    vignettePower: 2.5,
  })
])

const combinedFXSketch = Fn(() => {
  return createEngineSketch({
    material: createBasicLambert({
      baseColor: [0.2, 0.8, 1.0],
      ambient: 0.5, // Ensure it's visible even without strong lights
    }),
    postfx: fxChain,
    background: vec3(0.05, 0.05, 0.1), // Dark blue background
  })
})

export default combinedFXSketch

