import { createFileRoute } from '@tanstack/react-router'
import { ComponentType, Suspense, useRef } from 'react'
import { SketchesDropdown } from '@/components/sketches_dropdown'
import { getSketchModule } from '@/sketches/registry'

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

  const ref = useRef<any>(null)
  const module = sketchPath ? getSketchModule(sketchPath) : undefined
  const Sketch = module?.defaultExport

  if (!Sketch) return null

  const SketchComponent = Sketch as ComponentType<any>

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        <SketchComponent />
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
