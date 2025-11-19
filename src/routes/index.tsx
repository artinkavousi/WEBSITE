import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchesDropdown } from '@/components/sketches_dropdown'
import { featuredSketchSlug, findSketch } from '@/sketches/manifest'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [colorNode, setColorNode] = useState<(() => any) | null>(null)
  const ref = useRef<any>(null)

  useEffect(() => {
    const entry = findSketch(featuredSketchSlug)

    entry?.import().then((mod) => {
      setColorNode(() => mod.default)
    })
  }, [])

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
        ) : null}
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
