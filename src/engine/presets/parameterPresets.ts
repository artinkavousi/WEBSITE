import { MaterialNodeConfig, PostFXChain } from '../core/engineTypes'
import { createPBRMaterial } from '../materials/pbrMaterial'
import { createSSSMaterial } from '../materials/sssMaterial'
import { createPhiMetal } from '../materials/phiMetal'
import { samplePaletteColor } from './colorPalettes'
import { createBloomChain } from '../postfx/bloomChain'
import { createGrainVignette } from '../postfx/grainVignette'
import { combinePostFXChains } from '../postfx/combineChains'

type MaterialPresetFactory = () => MaterialNodeConfig
type PostFXPresetFactory = () => PostFXChain

export type MaterialPresetName = 'skinSoft' | 'moltenGold' | 'neonAlloy'
export type PostFXPresetName = 'cinematicBloom' | 'cinematicGrain' | 'neonBloom' | 'subtleVignette'

export const materialPresets: Record<MaterialPresetName, MaterialPresetFactory> = {
  skinSoft: () => {
    const base = samplePaletteColor('portraitSkin', 2)
    const scatter = samplePaletteColor('portraitSkin', 3)
    return createSSSMaterial({
      baseColor: base,
      scatterColor: scatter,
      scatterIntensity: 0.65,
      translucency: 0.4,
      thickness: 1.1,
      ambient: 0.25,
      roughness: 0.35,
    })
  },
  moltenGold: () => {
    const base = samplePaletteColor('lavaGold', 2)
    return createPBRMaterial({
      baseColor: base,
      metalness: 1.0,
      roughness: 0.22,
      emissive: samplePaletteColor('lavaGold', 3),
      emissiveIntensity: 0.6,
      ao: 0.9,
    })
  },
  neonAlloy: () => {
    return createPhiMetal({
      baseColor: samplePaletteColor('neonCyber', 1),
      metalness: 1.0,
      roughness: 0.15,
      animateNoise: true,
      noiseScale: 1.8,
      noiseInfluence: 0.15,
      fresnelBias: 0.4,
    })
  },
}

export const postFXPresets: Record<PostFXPresetName, PostFXPresetFactory> = {
  cinematicBloom: () =>
    createBloomChain({
      threshold: 0.65,
      intensity: 1.4,
      radius: 1.6,
      smoothThreshold: 0.2,
    }),
  cinematicGrain: () =>
    createGrainVignette({
      grainIntensity: 0.08,
      vignetteIntensity: 0.55,
      vignettePower: 2.2,
      vignetteRadius: 0.6,
    }),
  neonBloom: () =>
    createBloomChain({
      threshold: 0.55,
      intensity: 2.2,
      radius: 1.9,
      smoothThreshold: 0.25,
    }),
  subtleVignette: () =>
    createGrainVignette({
      grainIntensity: 0.04,
      vignetteIntensity: 0.25,
      vignettePower: 1.8,
    }),
}

export const combinePostFXPresets = (...names: PostFXPresetName[]): PostFXChain | undefined => {
  const chains = names.map((name) => postFXPresets[name]())
  return combinePostFXChains(...chains)
}

