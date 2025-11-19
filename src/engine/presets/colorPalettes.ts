/**
 * Color palette utilities for hero presets and sketches.
 *
 * Provides curated palettes plus helpers to sample or build palettes.
 */

export type PaletteColor = [number, number, number]

export interface ColorPalette {
  name: string
  description?: string
  colors: PaletteColor[]
}

const hexToRgb = (hex: string): PaletteColor => {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r / 255, g / 255, b / 255]
}

const createPalette = (
  name: string,
  hexColors: string[],
  description?: string
): ColorPalette => ({
  name,
  description,
  colors: hexColors.map(hexToRgb),
})

export const colorPalettes = {
  desertSunset: createPalette('Desert Sunset', ['#FF9A8D', '#FAD0C4', '#FDCB82', '#FF7582'], 'Warm oranges and corals'),
  aurora: createPalette('Aurora', ['#0E1F40', '#144A79', '#19A3A3', '#72F1B8'], 'Cool aurora inspired hues'),
  neonCyber: createPalette('Neon Cyber', ['#030E21', '#0FF0FC', '#FF4DFF', '#F5F6FE'], 'Retro synthwave colors'),
  oceanic: createPalette('Oceanic', ['#031926', '#468189', '#77ACA2', '#9DBEBB'], 'Muted ocean palette'),
  forestMist: createPalette('Forest Mist', ['#0B3D20', '#1C5D2E', '#5E8D5A', '#BECEAA'], 'Earthy greens'),
  lavaGold: createPalette('Lava Gold', ['#20130A', '#5C2C0C', '#D97C0B', '#FFD76F'], 'Molten gold/brown blend'),
  portraitSkin: createPalette('Portrait Skin', ['#3C1F17', '#8C4E37', '#C98A6B', '#F4C7B5'], 'Skin tones for portraits'),
  pastelDream: createPalette('Pastel Dream', ['#FEE4E9', '#FFE7C7', '#E0F7CF', '#C8E3FC'], 'Soft pastel gradient'),
  midnightGlow: createPalette('Midnight Glow', ['#02010A', '#191A36', '#31345E', '#F2C94C'], 'Dark with gold accent'),
  volcanic: createPalette('Volcanic', ['#020202', '#2F1E17', '#A34F32', '#FFAB5C'], 'Charred reds/oranges'),
} as const

export type PaletteName = keyof typeof colorPalettes

export const palettesList = Object.values(colorPalettes)

export const getPalette = (name: PaletteName): ColorPalette => colorPalettes[name]

export const samplePaletteColor = (name: PaletteName, index: number): PaletteColor => {
  const palette = getPalette(name)
  return palette.colors[index % palette.colors.length]
}

export interface CosinePaletteParams {
  a: PaletteColor
  b: PaletteColor
  c: PaletteColor
  d: PaletteColor
  samples?: number
  name?: string
  description?: string
}

/**
 * Generate a palette based on IQ's cosine palette technique.
 */
export const generateCosinePalette = ({
  a,
  b,
  c,
  d,
  samples = 8,
  name = 'Cosine Palette',
  description,
}: CosinePaletteParams): ColorPalette => {
  const colors: PaletteColor[] = []
  for (let i = 0; i < samples; i++) {
    const t = i / Math.max(samples - 1, 1)
    const angle = (value: number) => Math.cos(2.0 * Math.PI * (value + t))

    const color: PaletteColor = [
      a[0] + b[0] * angle(c[0]) + d[0],
      a[1] + b[1] * angle(c[1]) + d[1],
      a[2] + b[2] * angle(c[2]) + d[2],
    ].map((channel) => Math.min(Math.max(channel, 0), 1)) as PaletteColor

    colors.push(color)
  }

  return {
    name,
    description,
    colors,
  }
}

