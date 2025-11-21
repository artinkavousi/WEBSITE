import { createFileRoute } from '@tanstack/react-router'
import { ComponentType, Suspense, useRef } from 'react'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchesDropdown } from '@/components/sketches_dropdown'
import { getSketchModule } from '@/sketches/registry'
import { PostProcessing } from '@/tsl/postfx/core/PostProcessing'
import { postfx } from '@/tsl/presets/postfx'
import { useControlStore } from '@/stores/control_panel'

export const Route = createFileRoute('/sketches/$')({
  component: RouteComponent,
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}

function RouteComponent() {
  const { _splat: sketchPath } = Route.useParams()
  const { postfxEnabled, postfxPreset } = useControlStore()

  const ref = useRef<any>(null)
  const module = sketchPath ? getSketchModule(sketchPath) : undefined
  const Sketch = module?.defaultExport
  const type = module?.type

  if (!Sketch) return null

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        {type === 'ts' ? (
          <WebGPUScene
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
            }}
            eventSource={ref}
            eventPrefix='client'
          >
            <WebGPUSketch colorNode={(Sketch as () => any)()} />
            {postfxEnabled ? <PostProcessing chain={postfx[postfxPreset]} /> : null}
          </WebGPUScene>
        ) : (
          (() => {
            const SketchComponent = Sketch as ComponentType<any>
            return <SketchComponent />
          })()
        )}
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
