import { createFileRoute } from '@tanstack/react-router'
import { findSketchByPath } from '@/sketches/registry'
import { SketchShell } from '@/components/layout/sketch_shell'

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

  const sketch = findSketchByPath(sketchPath)

  return <SketchShell sketch={sketch} />
}
