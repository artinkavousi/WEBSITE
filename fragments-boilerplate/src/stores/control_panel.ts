import { create } from 'zustand'
import { postfx } from '@/tsl/presets/postfx'

type PostFXPreset = keyof typeof postfx

type ControlState = {
  postfxEnabled: boolean
  postfxPreset: PostFXPreset
  flareRepetitions: number
  flareBandOffset: number
  flarePaletteShift: number
  flareGrainIntensity: number
  flowPointerStrength: number
  nebulaSpeed: number
  nebulaCurlScale: number
  nebulaPointerStrength: number
  setPostfxEnabled: (value: boolean) => void
  setPostfxPreset: (preset: PostFXPreset) => void
  setFlareRepetitions: (value: number) => void
  setFlareBandOffset: (value: number) => void
  setFlarePaletteShift: (value: number) => void
  setFlareGrainIntensity: (value: number) => void
  setFlowPointerStrength: (value: number) => void
  setNebulaSpeed: (value: number) => void
  setNebulaCurlScale: (value: number) => void
  setNebulaPointerStrength: (value: number) => void
}

export const useControlStore = create<ControlState>((set) => ({
  postfxEnabled: true,
  postfxPreset: 'cinematic',
  flareRepetitions: 12,
  flareBandOffset: 0.05,
  flarePaletteShift: 0.0,
  flareGrainIntensity: 0.1,
  flowPointerStrength: 0.4,
  nebulaSpeed: 1.5,
  nebulaCurlScale: 0.4,
  nebulaPointerStrength: 0.8,
  setPostfxEnabled: (value) => set({ postfxEnabled: value }),
  setPostfxPreset: (preset) => set({ postfxPreset: preset }),
  setFlareRepetitions: (value) => set({ flareRepetitions: value }),
  setFlareBandOffset: (value) => set({ flareBandOffset: value }),
  setFlarePaletteShift: (value) => set({ flarePaletteShift: value }),
  setFlareGrainIntensity: (value) => set({ flareGrainIntensity: value }),
  setFlowPointerStrength: (value) => set({ flowPointerStrength: Math.max(0, value) }),
  setNebulaSpeed: (value) => set({ nebulaSpeed: Math.max(0.1, value) }),
  setNebulaCurlScale: (value) => set({ nebulaCurlScale: Math.max(0.05, value) }),
  setNebulaPointerStrength: (value) => set({ nebulaPointerStrength: Math.max(0, value) }),
}))

