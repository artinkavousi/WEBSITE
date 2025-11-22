import { Suspense, useRef } from 'react'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchControlsPanel, useSketchControls, ControlSchema } from '@/components/controls'
import { SketchesDropdown } from '@/components/sketches_dropdown'
import { SketchEntry } from '@/sketches/registry'
import { PostProcessing } from '@/tsl/postfx/pipeline'

type SketchShellProps = {
  sketch: SketchEntry | undefined
  controls?: ControlSchema
}

/**
 * Centralized sketch wrapper that wires up the WebGPU scene, controls panel, and sketch picker.
 */
export const SketchShell = ({ sketch, controls }: SketchShellProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const appliedControls = controls ?? sketch?.controls
  const controlValues = useSketchControls(appliedControls)
  const showControls = Boolean(appliedControls && Object.keys(appliedControls).length > 0)

  const colorNode = sketch?.colorNode
  const isMissing = !colorNode

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        {colorNode ? (
          <WebGPUScene
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
            }}
            eventSource={ref}
            eventPrefix='client'
          >
            <WebGPUSketch colorNode={colorNode(controlValues)} />
            {sketch?.postEffect ? (
              <PostProcessing effect={(params) => sketch.postEffect?.({ ...params, controls: controlValues })} />
            ) : null}
          </WebGPUScene>
        ) : (
          <div className='fragments-boilerplate__main__empty'>
            <p>No sketch found for this path.</p>
          </div>
        )}
      </Suspense>

      <SketchControlsPanel hidden={!showControls} />
      <SketchesDropdown />
    </section>
  )
}
