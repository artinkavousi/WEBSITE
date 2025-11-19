/**
 * Sketch Registry and Content Management System
 * 
 * Central catalog of all sketches with metadata for gallery display,
 * filtering, searching, and organization.
 */

import { engineRegistry } from './engineRegistry'
import type { EngineResourceCategory } from './resourceIndex'
import { SketchMetadata, GallerySection, SketchCategory } from '@/types/sketch'

/**
 * Registry of all available sketches with metadata.
 * This serves as the single source of truth for the gallery system.
 */
const baseSketches: SketchMetadata[] = [
  {
    id: 'base/flare-1',
    title: 'Flare Gradient',
    description: 'Colorful gradient with fractionated coordinates and cosine palette',
    category: 'base',
    tags: ['animated', 'procedural', 'noise', '2d'],
    difficulty: 'beginner',
    author: 'phobon',
    featured: true,
    modules: ['cosinePalette', 'screenAspectUV', 'grainTexture'],
  },
  {
    id: 'base/nested/dawn-1',
    title: 'Dawn',
    description: 'Nested example sketch demonstrating folder organization',
    category: 'base',
    tags: ['procedural', '2d'],
    difficulty: 'beginner',
    author: 'phobon',
  },
]

const tslSketches: SketchMetadata[] = [
  {
    id: 'tsl/postfx/canvas_weave',
    title: 'Canvas Weave',
    description: 'Procedural canvas weave texture with speckled noise and film grain',
    category: 'postfx',
    tags: ['procedural', 'noise', '2d'],
    difficulty: 'intermediate',
    modules: ['canvasWeaveEffect', 'speckedNoiseEffect', 'grainTextureEffect'],
  },
  {
    id: 'tsl/postfx/lcd',
    title: 'LCD Pattern',
    description: 'Stylized LCD screen pattern masked over a color gradient',
    category: 'postfx',
    tags: ['stylized', 'procedural', '2d'],
    difficulty: 'beginner',
    modules: ['lcdEffect'],
  },
  {
    id: 'tsl/postfx/pixellation',
    title: 'Pixellation Effect',
    description: 'Pixelation of a gradient using screen-size aware UV quantization',
    category: 'postfx',
    tags: ['stylized', 'procedural', '2d'],
    difficulty: 'beginner',
    modules: ['pixellationEffect'],
  },
  {
    id: 'tsl/postfx/speckled_noise',
    title: 'Speckled Noise',
    description: 'Sparse speckled noise layer combined with subtle film grain',
    category: 'postfx',
    tags: ['noise', 'procedural', '2d'],
    difficulty: 'intermediate',
    modules: ['speckedNoiseEffect', 'grainTextureEffect'],
  },
]

const experimentalEngineSketches: SketchMetadata[] = [
  {
    id: 'engine/postfx/depth_of_field',
    title: 'Depth of Field',
    description: 'Bokeh blur effect with adjustable focus distance',
    category: 'postfx',
    tags: ['realtime', '2d', '3d'],
    difficulty: 'advanced',
    modules: ['depthOfField'],
  },
  {
    id: 'engine/postfx/motion_blur',
    title: 'Motion Blur',
    description: 'Velocity-based directional blur for moving objects',
    category: 'postfx',
    tags: ['realtime', '2d', 'animated'],
    difficulty: 'advanced',
    modules: ['motionBlur'],
  },
  {
    id: 'engine/fields/sdf_visualization',
    title: 'SDF Visualization',
    description: 'Signed distance field primitives with distance-based coloring',
    category: 'fields',
    tags: ['procedural', '3d', 'animated'],
    difficulty: 'intermediate',
    modules: ['sdfPrimitives'],
  },
]

const webgpuSketches: SketchMetadata[] = [
  {
    id: 'webgpu/caustics',
    title: 'WebGPU Caustics',
    description: 'Realtime caustics node material with duck/glass toggle and shadow refraction',
    category: 'materials',
    tags: ['webgpu', 'materials', 'shadows'],
    difficulty: 'advanced',
  },
  {
    id: 'webgpu/centroid_sampling',
    title: 'Centroid Sampling',
    description: 'Per-face sampling comparison across centroid, sample, and flat interpolation',
    category: 'materials',
    tags: ['webgpu', 'nodes'],
    difficulty: 'intermediate',
  },
  {
    id: 'webgpu/camera_array',
    title: 'Array Camera',
    description: 'Grid of subcameras rendering a shared scene in a single WebGPU pass',
    category: 'materials',
    tags: ['camera', 'webgpu'],
    difficulty: 'intermediate',
  },
  {
    id: 'webgpu/camera_logarithmicdepthbuffer',
    title: 'Logarithmic Depth Buffer',
    description: 'Side-by-side normal vs logarithmic depth rendering for extreme depth ranges',
    category: 'materials',
    tags: ['camera', 'depth', 'webgpu'],
    difficulty: 'advanced',
  },
  {
    id: 'webgpu/backdrop_water',
    title: 'Backdrop Water',
    description: 'Backdrop refraction water surface with Worley noise ripples and caustics',
    category: 'materials',
    tags: ['webgpu', 'water', 'materials'],
    difficulty: 'advanced',
  },
]

const engineCategoryToSketchCategory: Record<
  EngineResourceCategory,
  SketchCategory
> = {
  materials: 'materials',
  postfx: 'postfx',
  particles: 'particles',
  fields: 'fields',
  presets: 'presets',
}

const engineSketches: SketchMetadata[] = (
  Object.keys(engineCategoryToSketchCategory) as EngineResourceCategory[]
).flatMap((category) =>
  engineRegistry[category].entries.map((entry) => ({
    id: entry.sketchId,
    title: entry.title,
    description: entry.description,
    category: engineCategoryToSketchCategory[category],
    tags: entry.tags,
    difficulty: entry.difficulty,
    featured: entry.featured,
    modules: entry.modules ?? [entry.id],
  })),
)

export const sketchRegistry: SketchMetadata[] = [
  ...baseSketches,
  ...tslSketches,
  ...experimentalEngineSketches,
  ...webgpuSketches,
  ...engineSketches,
]

/**
 * Gallery sections for organized display.
 * Each section groups sketches by category with a title and description.
 */
export const gallerySections: GallerySection[] = [
  {
    title: 'Featured Showcases',
    description: 'Hero sketches demonstrating the engine\'s full capabilities',
    category: 'showcase',
    sketches: sketchRegistry.filter((s) => s.featured),
  },
  {
    title: 'Materials',
    description: 'PBR materials, stylized shaders, and surface effects',
    category: 'materials',
    sketches: sketchRegistry.filter((s) => s.category === 'materials'),
  },
  {
    title: 'Post-Processing Effects',
    description: 'Screen-space effects and image processing',
    category: 'postfx',
    sketches: sketchRegistry.filter((s) => s.category === 'postfx'),
  },
  {
    title: 'Particle Systems',
    description: 'GPU-driven compute particles and simulations',
    category: 'particles',
    sketches: sketchRegistry.filter((s) => s.category === 'particles'),
  },
  {
    title: 'Fields & SDFs',
    description: 'Vector fields and signed distance functions',
    category: 'fields',
    sketches: sketchRegistry.filter((s) => s.category === 'fields'),
  },
  {
    title: 'Complete Presets',
    description: 'Ready-to-use scene compositions',
    category: 'presets',
    sketches: sketchRegistry.filter((s) => s.category === 'presets'),
  },
  {
    title: 'Base Examples',
    description: 'Original sketches from the boilerplate',
    category: 'base',
    sketches: sketchRegistry.filter((s) => s.category === 'base'),
  },
]

/**
 * Get sketch metadata by ID
 */
export const getSketchById = (id: string): SketchMetadata | undefined => {
  return sketchRegistry.find((s) => s.id === id)
}

/**
 * Get sketches by category
 */
export const getSketchesByCategory = (category: string): SketchMetadata[] => {
  return sketchRegistry.filter((s) => s.category === category)
}

/**
 * Get sketches by tag
 */
export const getSketchesByTag = (tag: string): SketchMetadata[] => {
  return sketchRegistry.filter((s) => s.tags.includes(tag as any))
}

/**
 * Search sketches by title or description
 */
export const searchSketches = (query: string): SketchMetadata[] => {
  const lowerQuery = query.toLowerCase()
  return sketchRegistry.filter(
    (s) =>
      s.title.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get featured sketches
 */
export const getFeaturedSketches = (): SketchMetadata[] => {
  return sketchRegistry.filter((s) => s.featured)
}

