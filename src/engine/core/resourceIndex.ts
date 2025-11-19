import { createBasicLambert } from '../materials/basicLambert'
import { createPBRMaterial } from '../materials/pbrMaterial'
import { createPhiMetal } from '../materials/phiMetal'
import { createSSSMaterial } from '../materials/sssMaterial'
import { createBloomChain } from '../postfx/bloomChain'
import { createGrainVignette } from '../postfx/grainVignette'
import { createCurlNoise } from '../fields/curlNoise'
import { combinePostFXChains } from '../postfx/combineChains'
import { createAttractorSystem } from '../particles/attractorSystem'
import { createBoidsSystem } from '../particles/boidsSystem'
import { createFlowSystem } from '../particles/flowSystem'
import { createSwarmSystem } from '../particles/swarmSystem'
import {
  getHeroConfig,
  heroSketches,
  type HeroPresetName,
} from '../presets/heroSketches'
import type {
  EngineSketchConfig,
  MaterialNodeConfig,
  ParticleSystemConfig,
  PostFXChain,
  VectorField,
} from './engineTypes'
import type { SketchDifficulty, SketchTag } from '@/types/sketch'

type GenericParams = Record<string, any>

export type MaterialFactory = (params?: GenericParams) => MaterialNodeConfig
export type PostFXFactory = (params?: GenericParams) => PostFXChain | undefined
export type FieldFactory = (params?: GenericParams) => VectorField
export type ParticleFactory = (params?: GenericParams) => ParticleSystemConfig
export type SketchConfigFactory = () => EngineSketchConfig

export interface EngineResourceEntry<TFactory> {
  id: string
  title: string
  description: string
  tags: SketchTag[]
  difficulty: SketchDifficulty
  sketchId: string
  modules?: string[]
  featured?: boolean
  create: TFactory
}

export interface EnginePresetEntry
  extends EngineResourceEntry<SketchConfigFactory> {
  id: HeroPresetName
  createSketch: () => ReturnType<(typeof heroSketches)[HeroPresetName]>
}

export interface EngineResourceIndex {
  materials: Record<string, EngineResourceEntry<MaterialFactory>>
  postfx: Record<string, EngineResourceEntry<PostFXFactory>>
  fields: Record<string, EngineResourceEntry<FieldFactory>>
  particles: Record<string, EngineResourceEntry<ParticleFactory>>
  presets: Record<string, EnginePresetEntry>
}

const materialResources: EngineResourceIndex['materials'] = {
  basicLambert: {
    id: 'basicLambert',
    title: 'Basic Lambert',
    description: 'Simple diffuse material with ambient + directional lighting.',
    tags: ['lighting', '3d', 'pbr'],
    difficulty: 'beginner',
    modules: ['createBasicLambert', 'engineCore'],
    featured: true,
    sketchId: 'engine/materials/basic_lambert',
    create: createBasicLambert,
  },
  pbrMaterial: {
    id: 'pbrMaterial',
    title: 'PBR Material',
    description: 'Metallic/roughness workflow for physically-based shading.',
    tags: ['pbr', '3d', 'lighting'],
    difficulty: 'intermediate',
    modules: ['createPBRMaterial'],
    sketchId: 'engine/materials/pbr_material',
    create: createPBRMaterial,
  },
  phiMetal: {
    id: 'phiMetal',
    title: 'Phi Metal',
    description: 'Stylized metallic shader with Fresnel rim and animated noise.',
    tags: ['stylized', 'pbr', '3d'],
    difficulty: 'intermediate',
    modules: ['createPhiMetal', 'simplexNoise3d', 'fresnel'],
    featured: true,
    sketchId: 'engine/materials/phi_metal',
    create: createPhiMetal,
  },
  sssMaterial: {
    id: 'sssMaterial',
    title: 'Subsurface Scattering',
    description: 'Translucent material approximation for skin, wax, jade, etc.',
    tags: ['stylized', 'lighting', '3d'],
    difficulty: 'advanced',
    modules: ['createSSSMaterial'],
    sketchId: 'engine/materials/sss_material',
    create: createSSSMaterial,
  },
}

const postFXResources: EngineResourceIndex['postfx'] = {
  bloomChain: {
    id: 'bloomChain',
    title: 'Bloom',
    description: 'Threshold + blur + composite passes for emissive glow.',
    tags: ['realtime', '2d'],
    difficulty: 'intermediate',
    modules: ['createBloomChain'],
    sketchId: 'engine/postfx/bloom',
    create: createBloomChain,
  },
  grainVignette: {
    id: 'grainVignette',
    title: 'Grain + Vignette',
    description: 'Film grain texture combined with vignette darkening.',
    tags: ['stylized', '2d'],
    difficulty: 'beginner',
    modules: ['createGrainVignette'],
    sketchId: 'engine/postfx/grain_vignette',
    create: createGrainVignette,
  },
  combinedFX: {
    id: 'combinedFX',
    title: 'Combined FX',
    description: 'Demonstration of combining multiple PostFX chains (Bloom + Grain).',
    tags: ['postfx', 'composition'],
    difficulty: 'intermediate',
    modules: ['combinePostFXChains', 'createBloomChain', 'createGrainVignette'],
    sketchId: 'engine/postfx/combined_fx',
    create: () => combinePostFXChains([createBloomChain(), createGrainVignette()]),
  },
}

const fieldResources: EngineResourceIndex['fields'] = {
  curlNoise: {
    id: 'curlNoise',
    title: 'Curl Noise Field',
    description: 'Divergence-free vector field for fluid-like particle motion.',
    tags: ['procedural', 'noise', '3d'],
    difficulty: 'intermediate',
    modules: ['createCurlNoise'],
    sketchId: 'engine/fields/curl_noise_field',
    create: createCurlNoise,
  },
}

const particleResources: EngineResourceIndex['particles'] = {
  attractorSystem: {
    id: 'attractorSystem',
    title: 'Attractor System',
    description: 'Inverse-square attraction/repulsion to configurable points.',
    tags: ['animated', 'realtime', '3d'],
    difficulty: 'intermediate',
    modules: ['createAttractorSystem'],
    featured: true,
    sketchId: 'engine/particles/attractor_visual',
    create: createAttractorSystem,
  },
  boidsSystem: {
    id: 'boidsSystem',
    title: 'Boids Flocking',
    description: 'Classic separation + alignment + cohesion flocking system.',
    tags: ['animated', 'realtime', '3d'],
    difficulty: 'intermediate',
    modules: ['createBoidsSystem'],
    sketchId: 'engine/particles/boids_visual',
    create: createBoidsSystem,
  },
  flowSystem: {
    id: 'flowSystem',
    title: 'Flow Field System',
    description: 'Advection of particles through configurable vector fields.',
    tags: ['animated', 'procedural', '3d'],
    difficulty: 'intermediate',
    modules: ['createFlowSystem', 'createCurlNoise'],
    sketchId: 'engine/particles/flow_visual',
    create: createFlowSystem,
  },
  swarmSystem: {
    id: 'swarmSystem',
    title: 'Swarm Intelligence',
    description: 'Leader-following particles with formation + orbit behavior.',
    tags: ['animated', 'realtime', '3d'],
    difficulty: 'intermediate',
    modules: ['createSwarmSystem'],
    sketchId: 'engine/particles/swarm_visual',
    create: createSwarmSystem,
  },
}

const presetDescriptions: Record<
  HeroPresetName,
  {
    title: string
    description: string
    tags: SketchTag[]
    difficulty: SketchDifficulty
    sketchId: string
  }
> = {
  cinematicPortrait: {
    title: 'Cinematic Portrait',
    description: 'SSS skin preset with bloom + grain finishing.',
    tags: ['stylized', 'lighting', 'pbr'],
    difficulty: 'advanced',
    sketchId: 'engine/presets/cinematic_portrait',
  },
  goldenGlow: {
    title: 'Golden Glow',
    description: 'Molten gold preset with emissive bloom polish.',
    tags: ['pbr', 'lighting', 'stylized'],
    difficulty: 'advanced',
    sketchId: 'engine/presets/golden_glow',
  },
  neonMetropolis: {
    title: 'Neon Metropolis',
    description: 'Phi Metal alloy with neon bloom and vignette.',
    tags: ['stylized', 'animated', 'lighting'],
    difficulty: 'advanced',
    sketchId: 'engine/presets/neon_metropolis',
  },
}

const presetResources = (
  Object.keys(presetDescriptions) as HeroPresetName[]
).reduce<EngineResourceIndex['presets']>((acc, name) => {
  const meta = presetDescriptions[name]
  acc[name] = {
    id: name,
    title: meta.title,
    description: meta.description,
    tags: meta.tags,
    difficulty: meta.difficulty,
    featured: true,
    sketchId: meta.sketchId,
    modules: ['heroSketches'],
    create: () => getHeroConfig(name),
    createSketch: () => heroSketches[name](),
  }
  return acc
}, {})

export const engineResourceIndex: EngineResourceIndex = {
  materials: materialResources,
  postfx: postFXResources,
  fields: fieldResources,
  particles: particleResources,
  presets: presetResources,
}

export type EngineResourceCategory = keyof EngineResourceIndex
