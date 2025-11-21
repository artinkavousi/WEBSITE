import { Leva, useControls } from 'leva'
import { useMemo } from 'react'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { PostProcessing } from '@/tsl/postfx/core/PostProcessing'
import { postfx } from '@/tsl/presets/postfx'

// Types for the Sketch Module
export type SketchConfig = {
  meta?: {
    name: string
    description?: string
    tags?: string[]
  }
  controls: Record<string, any>
  settings?: {
    camera?: {
      type?: 'perspective' | 'orthographic'
      position?: [number, number, number]
      fov?: number
      zoom?: number
    }
    postfx?: {
      enabled?: boolean
      preset?: keyof typeof postfx
    }
  }
}

export type SketchProps = {
  // sketch receives the values from controls
  [key: string]: any
}

type SketchWrapperProps = {
  sketch: React.ComponentType<SketchProps>
  config: SketchConfig
}

// Glassmorphic Leva Theme
const glassTheme = {
  colors: {
    elevation1: 'rgba(20, 20, 30, 0.6)', // Transparent dark background
    elevation2: 'rgba(30, 30, 40, 0.6)',
    elevation3: 'rgba(40, 40, 50, 0.6)',
    accent1: '#7f5bff',
    accent2: '#5de4ff',
    highlight1: '#5de4ff',
    highlight2: '#f472b6',
    highlight3: '#fcd34d',
    vivid1: '#7f5bff',
    text1: '#ffffff',
    text2: '#a0a0b0',
    text3: '#707080',
  },
  radii: {
    xs: '4px',
    sm: '6px',
    lg: '12px',
  },
  shadows: {
    level1: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
    level2: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
  },
  borderWidths: {
    root: '0px', // No border, we use backdrop-filter
  },
}

function SketchContent({
  Sketch,
  config,
}: {
  Sketch: React.ComponentType<SketchProps>
  config: SketchConfig
}) {
  // Generate controls from schema
  const controls = useControls(config.meta?.name || 'Controls', config.controls)
  
  // Additional Global/Scene controls (optional, could be in config)
  const sceneControls = useControls('Scene', {
    postfx: config.settings?.postfx?.enabled ?? true,
    preset: {
      value: config.settings?.postfx?.preset ?? 'cinematic',
      options: Object.keys(postfx),
    },
  })

  return (
    <>
      <Sketch {...controls} />
      {sceneControls.postfx && <PostProcessing chain={postfx[sceneControls.preset as keyof typeof postfx]} />}
    </>
  )
}

export function SketchWrapper({ sketch: Sketch, config }: SketchWrapperProps) {
  const theme = useMemo(() => glassTheme, [])

  // Determine camera settings
  const cameraSettings = config.settings?.camera || {}
  const isOrthographic = cameraSettings.type === 'orthographic' || (!cameraSettings.type && !cameraSettings.fov)

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* 
          Leva Panel 
          We inject global styles for backdrop-filter since Leva doesn't support it directly in theme
      */}
      <style>{`
        .leva-c-hbtPzl {
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.125);
        }
      `}</style>

      <Leva
        theme={theme}
        collapsed={false}
        hideCopyButton
        titleBar={{
          title: config.meta?.name || 'Sketch Control',
          drag: true,
          filter: false,
        }}
      />

      <WebGPUScene
        orthographic={isOrthographic}
        camera={{
          position: cameraSettings.position,
          fov: cameraSettings.fov,
          zoom: cameraSettings.zoom
        }}
      >
        <SketchContent Sketch={Sketch} config={config} />
      </WebGPUScene>
    </div>
  )
}

