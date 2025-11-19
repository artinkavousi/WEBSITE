import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useRef, useState } from 'react'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchesDropdown } from '@/components/sketches_dropdown'
import { findSketch } from '@/sketches/manifest'

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

  const [module, setModule] = useState<any>({})
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const sketch = findSketch(sketchPath)

    if (!sketch) {
      setNotFound(true)
      return
    }

    setNotFound(false)

    sketch.import().then((mod) => {
      setModule({ colorNode: mod.default })
    })
  }, [sketchPath])

  const ref = useRef<any>(null)

  const { colorNode } = module

  return (
    <section className='tsl-webgpu-engine__main__canvas' ref={ref}>
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
            <WebGPUSketch colorNode={colorNode()} />
          </WebGPUScene>
        ) : notFound ? (
          <div className='sketches-error'>Sketch not found.</div>
        ) : null}
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
