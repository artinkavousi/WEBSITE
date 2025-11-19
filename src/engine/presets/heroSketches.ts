import { Fn, vec3 } from 'three/tsl'
import { createEngineSketch } from '../core/createEngineSketch'
import { EngineSketchConfig } from '../core/engineTypes'
import { materialPresets, combinePostFXPresets } from './parameterPresets'

type HeroPresetFactory = () => EngineSketchConfig

export type HeroPresetName = 'cinematicPortrait' | 'goldenGlow' | 'neonMetropolis'

const heroConfigs: Record<HeroPresetName, HeroPresetFactory> = {
  cinematicPortrait: () => ({
    material: materialPresets.skinSoft(),
    postfx: combinePostFXPresets('cinematicBloom', 'cinematicGrain'),
    background: vec3(0.02, 0.015, 0.02),
  }),
  goldenGlow: () => ({
    material: materialPresets.moltenGold(),
    postfx: combinePostFXPresets('cinematicBloom', 'subtleVignette'),
    background: vec3(0.03, 0.02, 0.01),
  }),
  neonMetropolis: () => ({
    material: materialPresets.neonAlloy(),
    postfx: combinePostFXPresets('neonBloom', 'subtleVignette'),
    background: vec3(0.01, 0.01, 0.05),
  }),
}

export const heroSketches: Record<HeroPresetName, () => ReturnType<typeof createEngineSketch>> = {
  cinematicPortrait: () => createEngineSketch(heroConfigs.cinematicPortrait()),
  goldenGlow: () => createEngineSketch(heroConfigs.goldenGlow()),
  neonMetropolis: () => createEngineSketch(heroConfigs.neonMetropolis()),
}

export const getHeroConfig = (name: HeroPresetName) => heroConfigs[name]()

export const createHeroSketch = (name: HeroPresetName) => Fn(() => heroSketches[name]())

