export type SketchEntry = {
  slug: string
  title: string
  description: string
  import: () => Promise<{ default: () => any }>
}

export const sketchesManifest: SketchEntry[] = [
  {
    slug: 'flare-1',
    title: 'Flare Bands',
    description: 'Fractionated flare bands with cosine palette gradients and grain.',
    import: () => import('./flare-1'),
  },
  {
    slug: 'nested/dawn-1',
    title: 'Dawn Spiral',
    description: 'Nested coordinates forming a spiral dawn glow with vignette tinting.',
    import: () => import('./nested/dawn-1'),
  },
  {
    slug: 'nebula-flow',
    title: 'Nebula Flow',
    description: 'Domain-warped FBM clouds with warm-to-cool palette mixing.',
    import: () => import('./nebula-flow'),
  },
  {
    slug: 'grid-pulse',
    title: 'Grid Pulse',
    description: 'Hard-edged pulse grid with smooth falloff and scanline texture.',
    import: () => import('./grid-pulse'),
  },
]

export const featuredSketchSlug = sketchesManifest[0]?.slug ?? 'flare-1'

export function findSketch(slug: string) {
  return sketchesManifest.find((entry) => entry.slug === slug)
}
