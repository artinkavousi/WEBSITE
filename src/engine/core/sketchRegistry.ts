/**
 * Sketch Registry and Content Management System
 * 
 * Central catalog of all sketches with metadata for gallery display,
 * filtering, searching, and organization.
 */

import { SketchMetadata, GallerySection } from '@/types/sketch'

/**
 * Registry of all available sketches with metadata.
 * This serves as the single source of truth for the gallery system.
 */
export const sketchRegistry: SketchMetadata[] = [
  // ===== BASE SKETCHES =====
  {
    id: 'flare-1',
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
    id: 'nested/dawn-1',
    title: 'Dawn',
    description: 'Nested example sketch demonstrating folder organization',
    category: 'base',
    tags: ['procedural', '2d'],
    difficulty: 'beginner',
    author: 'phobon',
  },

  // ===== ENGINE MATERIALS =====
  {
    id: 'engine/materials/basic_lambert',
    title: 'Basic Lambert Material',
    description: 'Simple diffuse (Lambertian) shading with ambient and directional lighting',
    category: 'materials',
    tags: ['lighting', '3d', 'pbr'],
    difficulty: 'beginner',
    featured: true,
    modules: ['basicLambert', 'engineCore'],
  },
  {
    id: 'engine/materials/phi_metal',
    title: 'Phi Metal',
    description: 'Stylized metallic material with Fresnel highlights and animated noise',
    category: 'materials',
    tags: ['animated', 'stylized', 'noise', '3d', 'pbr'],
    difficulty: 'intermediate',
    featured: true,
    modules: ['phiMetal', 'simplexNoise', 'fresnel'],
  },
  {
    id: 'engine/materials/pbr_material',
    title: 'PBR Material',
    description: 'Physically-based rendering with metallic/roughness workflow',
    category: 'materials',
    tags: ['pbr', '3d', 'lighting'],
    difficulty: 'intermediate',
    modules: ['pbrMaterial'],
  },
  {
    id: 'engine/materials/sss_material',
    title: 'Subsurface Scattering',
    description: 'Translucent material with depth-based light scattering',
    category: 'materials',
    tags: ['pbr', '3d', 'lighting', 'stylized'],
    difficulty: 'advanced',
    modules: ['sssMaterial'],
  },

  // ===== ENGINE POST-FX =====
  {
    id: 'engine/postfx/bloom',
    title: 'Bloom Effect',
    description: 'High-quality bloom with threshold and blur passes',
    category: 'postfx',
    tags: ['realtime', '2d'],
    difficulty: 'intermediate',
    modules: ['bloomChain'],
  },
  {
    id: 'engine/postfx/grain_vignette',
    title: 'Grain + Vignette',
    description: 'Film grain texture combined with vignette darkening',
    category: 'postfx',
    tags: ['stylized', '2d'],
    difficulty: 'beginner',
    modules: ['grainVignette'],
  },
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

  // ===== ENGINE PARTICLES =====
  {
    id: 'engine/particles/attractor_cloud',
    title: 'Attractor Particles',
    description: 'GPU-driven particles attracted to point sources',
    category: 'particles',
    tags: ['compute', 'animated', '3d', 'realtime'],
    difficulty: 'advanced',
    featured: true,
    modules: ['attractorSystem', 'computeParticles'],
  },
  {
    id: 'engine/particles/flow_field_trails',
    title: 'Flow Field Trails',
    description: 'Particles following curl noise vector fields',
    category: 'particles',
    tags: ['compute', 'animated', '3d', 'noise', 'procedural'],
    difficulty: 'advanced',
    featured: true,
    modules: ['flowFieldParticles', 'curlNoise'],
  },
  {
    id: 'engine/particles/boids_flock',
    title: 'Boids Flocking',
    description: 'Swarm behavior with separation, alignment, and cohesion',
    category: 'particles',
    tags: ['compute', 'animated', '3d', 'realtime'],
    difficulty: 'expert',
    modules: ['boidsSystem'],
  },
  {
    id: 'engine/particles/particle_swarm',
    title: 'Particle Swarm',
    description: 'Dynamic swarm behaviors with emergent patterns',
    category: 'particles',
    tags: ['compute', 'animated', '3d', 'procedural'],
    difficulty: 'expert',
    modules: ['computeParticles'],
  },

  // ===== ENGINE FIELDS =====
  {
    id: 'engine/fields/curl_noise_flow',
    title: 'Curl Noise Flow',
    description: 'Divergence-free vector fields for fluid-like motion',
    category: 'fields',
    tags: ['noise', 'procedural', '3d', 'animated'],
    difficulty: 'intermediate',
    modules: ['curlNoiseField'],
  },
  {
    id: 'engine/fields/sdf_shapes',
    title: 'SDF Shapes',
    description: 'Signed distance fields with smooth operations',
    category: 'fields',
    tags: ['procedural', '3d'],
    difficulty: 'intermediate',
    modules: ['sdfPrimitives'],
  },

  // ===== ENGINE PRESETS =====
  {
    id: 'engine/presets/cinematic_portrait',
    title: 'Cinematic Portrait',
    description: 'PBR material with SSS, bloom, and color grading',
    category: 'presets',
    tags: ['pbr', 'stylized', 'lighting', '3d'],
    difficulty: 'advanced',
    featured: true,
    modules: ['heroSketches', 'pbrMaterial', 'bloomChain'],
  },
  {
    id: 'engine/presets/golden_glow',
    title: 'Golden Glow',
    description: 'Metallic material with particle sparkles and warm palette',
    category: 'presets',
    tags: ['stylized', 'animated', 'particles', '3d'],
    difficulty: 'advanced',
    featured: true,
    modules: ['heroSketches', 'phiMetal', 'attractorSystem'],
  },
  {
    id: 'engine/presets/neon_metropolis',
    title: 'Neon Metropolis',
    description: 'Emissive materials with flow particles and cyberpunk aesthetic',
    category: 'presets',
    tags: ['stylized', 'animated', 'particles', 'lighting'],
    difficulty: 'advanced',
    featured: true,
    modules: ['heroSketches', 'flowFieldParticles', 'bloomChain'],
  },
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

