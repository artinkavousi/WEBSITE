import { useMemo } from 'react'
import { Leva, folder, useControls } from 'leva'
import { useControlStore } from '@/stores/control_panel'
import { postfx } from '@/tsl/presets/postfx'

const POSTFX_OPTIONS = Object.keys(postfx).reduce<Record<string, string>>((acc, key) => {
  acc[key] = key
  return acc
}, {})

const theme = {
  colors: {
    elevation1: 'rgba(9, 12, 21, 0.8)',
    elevation2: 'rgba(14, 18, 30, 0.85)',
    elevation3: 'rgba(18, 24, 40, 0.9)',
    accent1: '#7f5bff',
    accent2: '#5de4ff',
    highlight1: '#5de4ff',
    highlight2: '#f472b6',
    highlight3: '#fcd34d',
    vivid1: '#7f5bff',
    text1: '#f8fbff',
    text2: '#9da9c2',
    text3: '#5a6272',
  },
  shadows: {
    level1: '0 30px 80px rgba(4, 7, 12, 0.55)',
  },
  sizes: {
    titleBarHeight: '34px',
    controlWidth: '320px',
  },
}

export function ControlDashboard() {
  const {
    postfxEnabled,
    postfxPreset,
    flareRepetitions,
    flareBandOffset,
    flarePaletteShift,
    flareGrainIntensity,
    flowPointerStrength,
    nebulaSpeed,
    nebulaCurlScale,
    nebulaPointerStrength,
    setPostfxEnabled,
    setPostfxPreset,
    setFlareRepetitions,
    setFlareBandOffset,
    setFlarePaletteShift,
    setFlareGrainIntensity,
    setFlowPointerStrength,
    setNebulaSpeed,
    setNebulaCurlScale,
    setNebulaPointerStrength,
  } = useControlStore()

  useControls(
    () => ({
      Scene: folder(
        {
          'Post FX Enabled': {
            value: postfxEnabled,
            onChange: (value: boolean) => setPostfxEnabled(value),
          },
          'Post FX Preset': {
            value: postfxPreset,
            options: POSTFX_OPTIONS,
            onChange: (value: string) => setPostfxPreset(value as keyof typeof postfx),
          },
        },
        { collapsed: false },
      ),
      Flare: folder(
        {
          Repetitions: {
            value: flareRepetitions,
            min: 4,
            max: 48,
            step: 1,
            onChange: (value: number) => setFlareRepetitions(Math.max(1, Math.floor(value))),
          },
          'Band Offset': {
            value: flareBandOffset,
            min: 0.01,
            max: 0.2,
            step: 0.005,
            onChange: (value: number) => setFlareBandOffset(value),
          },
          'Palette Shift': {
            value: flarePaletteShift,
            min: -2,
            max: 2,
            step: 0.01,
            onChange: (value: number) => setFlarePaletteShift(value),
          },
          'Grain Intensity': {
            value: flareGrainIntensity,
            min: 0,
            max: 0.5,
            step: 0.01,
            onChange: (value: number) => setFlareGrainIntensity(value),
          },
        },
        { collapsed: false },
      ),
      Particles: folder(
        {
          'Pointer Attraction': {
            value: flowPointerStrength,
            min: 0,
            max: 5,
            step: 0.05,
            onChange: (value: number) => setFlowPointerStrength(value),
          },
        },
        { collapsed: false },
      ),
      'Nebula Storm': folder(
        {
          'Particle Speed': {
            value: nebulaSpeed,
            min: 0.2,
            max: 3,
            step: 0.05,
            onChange: (value: number) => setNebulaSpeed(value),
          },
          'Curl Scale': {
            value: nebulaCurlScale,
            min: 0.1,
            max: 1.5,
            step: 0.05,
            onChange: (value: number) => setNebulaCurlScale(value),
          },
          'Pointer Gravity': {
            value: nebulaPointerStrength,
            min: 0,
            max: 5,
            step: 0.1,
            onChange: (value: number) => setNebulaPointerStrength(value),
          },
        },
        { collapsed: false },
      ),
    }),
    [
      postfxEnabled,
      postfxPreset,
      flareRepetitions,
      flareBandOffset,
      flarePaletteShift,
      flareGrainIntensity,
      flowPointerStrength,
      nebulaSpeed,
      nebulaCurlScale,
      nebulaPointerStrength,
    ],
  )

  const levaTheme = useMemo(() => theme, [])

  return (
    <Leva
      theme={levaTheme}
      collapsed={false}
      hideCopyButton
      oneLineLabels
      titleBar={{ title: 'Fragments Control Center', drag: true, filter: false }}
    />
  )
}

export default ControlDashboard
