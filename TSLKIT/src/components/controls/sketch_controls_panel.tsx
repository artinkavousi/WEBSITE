import { Leva } from 'leva'

/**
 * Shared control panel wrapper with a subtle glassmorphic look.
 * Keeps Leva mounted so controls persist between sketch switches.
 */
export const SketchControlsPanel = ({ hidden = false }: { hidden?: boolean }) => {
  return (
    <Leva
      hidden={hidden}
      collapsed
      flat
      oneLineLabels
      theme={{
        colors: {
          elevation1: 'rgba(255,255,255,0.04)',
          elevation2: 'rgba(255,255,255,0.08)',
          elevation3: 'rgba(255,255,255,0.12)',
          accent1: '#80d7ff',
          accent2: '#5db2ff',
          accent3: '#a0e3ff',
          highlight1: '#ffffff',
          highlight2: '#1a1f2c',
          highlight3: '#101522',
          vivid1: '#6ae2ff',
          danger: '#ff8a80',
        },
        shadows: {
          level1: '0 10px 30px rgba(0, 0, 0, 0.35)',
          level2: '0 20px 45px rgba(0, 0, 0, 0.45)',
        },
        fonts: {
          mono: 'Inter, \"SF Mono\", Menlo, Consolas, monospace',
          sans: 'Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif',
        },
      }}
    />
  )
}
