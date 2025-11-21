import type { ComponentType } from 'react'

type SketchModuleType = 'ts' | 'tsx'

type SketchModuleExports = {
  default?: ComponentType<any> | (() => any)
}

export type SketchMeta = {
  category: string
  description?: string
  name: string
  relativePath: string
  type: SketchModuleType
  url: string
}

type SketchRegistryEntry = {
  meta: SketchMeta
  module: SketchModuleExports
}

const SKETCH_DESCRIPTIONS: Record<string, string> = {
  'flare-1': 'Fractionated gradient flare with cosine palette + grain',
  'nested/dawn-1': 'Multi-band gradient inspired by Rik Oostenbroek',
  'fields/flow_vis': 'Vector field visualizer powered by flow utilities',
  'fields/raymarching_demo': 'SDF raymarch demo layering noise + lighting',
  'hero/nebula_storm': 'Hero WebGPU scene with volumetric nebula clouds',
  'materials/gallery': 'Material gallery cycling through presets + lighting',
  'materials/glass_demo': 'Dispersion-heavy glass shader with caustic tint',
  'materials/pbr_demo': 'TSL PBR stack with clearcoat + sheen controls',
  'particles/attractor_demo': 'Compute-driven attractor swarm',
  'particles/flow_demo': 'Emitter riding turbulence + curl noise flow',
  'particles/swarm_demo': 'Flocking swarm integrating steering behaviors',
}

const sketchesGlob = import.meta.glob('./**/*.{ts,tsx}', {
  eager: true,
}) as Record<string, SketchModuleExports>

const registry = Object.entries(sketchesGlob).reduce<Record<string, SketchRegistryEntry>>((acc, [path, module]) => {
  const relativePath = normalizePath(path)
  const name = relativePath.split('/').pop() ?? relativePath
  const category = extractCategory(relativePath)
  const type: SketchModuleType = path.endsWith('.tsx') ? 'tsx' : 'ts'

  const meta: SketchMeta = {
    category,
    description: SKETCH_DESCRIPTIONS[relativePath] ?? SKETCH_DESCRIPTIONS[name],
    name,
    relativePath,
    type,
    url: `/sketches/${relativePath}`,
  }

  acc[relativePath] = {
    meta,
    module,
  }

  return acc
}, {})

const sketchesMeta = Object.values(registry)
  .map((entry) => entry.meta)
  .sort((a, b) => {
    const categoryA = categorySortKey(a.category)
    const categoryB = categorySortKey(b.category)

    if (categoryA === categoryB) {
      return a.name.localeCompare(b.name)
    }

    return categoryA.localeCompare(categoryB)
  })

export function getSketchEntries(): SketchMeta[] {
  return sketchesMeta.map((meta) => ({ ...meta }))
}

export function getSketchModule(relativePath: string) {
  const entry = registry[relativePath]

  if (!entry?.module?.default) {
    return undefined
  }

  return {
    defaultExport: entry.module.default,
    type: entry.meta.type,
  }
}

function normalizePath(path: string) {
  return path.replace('./', '').replace(/\.(ts|tsx)$/i, '')
}

function extractCategory(relativePath: string) {
  const parts = relativePath.split('/')

  if (parts.length <= 1) {
    return 'root'
  }

  return parts[parts.length - 2]
}

function categorySortKey(category: string) {
  if (category === 'root') {
    return ''
  }

  return category
}
