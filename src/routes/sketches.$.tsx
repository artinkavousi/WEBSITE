import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useRef, useState } from 'react'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchesDropdown } from '@/components/sketches_dropdown'

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

  const [module, setModule] = useState<{ colorNode?: () => any; Scene?: () => JSX.Element; standalone?: boolean }>({})

  // Updated glob pattern to include subfolders
  const sketches: Record<string, { default: () => any; Scene?: () => JSX.Element; standalone?: boolean }> =
    import.meta.glob('../sketches/**/*.{ts,tsx}', {
      eager: true,
    })

  useEffect(() => {
    // Convert URL path to file path and support both .ts and .tsx sketches
    const tsPath = `../sketches/${sketchPath}.ts`
    const tsxPath = `../sketches/${sketchPath}.tsx`
    const mod = sketches[tsPath] ?? sketches[tsxPath]

    if (mod) {
      setModule({ colorNode: mod.default, Scene: mod.Scene, standalone: (mod as any).standalone })
    } else {
      console.error('Sketch not found:', sketchPath)
    }
  }, [sketchPath])

  const ref = useRef<any>(null)

  const { colorNode, Scene, standalone } = module

  const colorNodeValue = colorNode?.()
  const hasSketch = Boolean(colorNodeValue || Scene)

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        {standalone ? (
          Scene ? <Scene /> : null
        ) : hasSketch ? (
          <WebGPUScene
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
            }}
            eventSource={ref}
            eventPrefix='client'
          >
            {colorNodeValue ? <WebGPUSketch colorNode={colorNodeValue} /> : null}
            {Scene ? <Scene /> : null}
          </WebGPUScene>
        ) : null}
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
