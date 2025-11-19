import {
  engineResourceIndex,
  type EngineResourceIndex,
  type EngineResourceCategory,
} from './resourceIndex'

export type EngineRegistry = {
  [K in EngineResourceCategory]: EngineResourceCategorySummary<
    EngineResourceIndex[K][string]
  >
}

export interface EngineResourceCategorySummary<TEntry> {
  id: EngineResourceCategory
  title: string
  description: string
  entries: TEntry[]
}

const categoryMeta: Record<EngineResourceCategory, { title: string; description: string }> = {
  materials: {
    title: 'Materials',
    description: 'Reusable surface shaders built with TSL nodes.',
  },
  postfx: {
    title: 'Post-Processing',
    description: 'Screen-space chains such as bloom, grain, and vignette.',
  },
  fields: {
    title: 'Vector Fields',
    description: 'Force fields and SDF primitives that drive simulations.',
  },
  particles: {
    title: 'Particle Systems',
    description: 'Configurable GPU-friendly particle behaviors.',
  },
  presets: {
    title: 'Hero Presets',
    description: 'Complete scene recipes combining material + postfx stacks.',
  },
}

const buildCategory = <K extends EngineResourceCategory>(
  category: K,
): EngineResourceCategorySummary<EngineResourceIndex[K][string]> => ({
  id: category,
  title: categoryMeta[category].title,
  description: categoryMeta[category].description,
  entries: Object.values(engineResourceIndex[category]) as EngineResourceIndex[K][string][],
})

export const engineRegistry: EngineRegistry = {
  materials: buildCategory('materials'),
  postfx: buildCategory('postfx'),
  fields: buildCategory('fields'),
  particles: buildCategory('particles'),
  presets: buildCategory('presets'),
}

export const getEngineResource = <K extends EngineResourceCategory>(
  category: K,
  id: string,
): EngineResourceIndex[K][string] | undefined => engineResourceIndex[category][id]

export const listEngineResources = <K extends EngineResourceCategory>(
  category: K,
): EngineResourceIndex[K][string][] => engineRegistry[category].entries
