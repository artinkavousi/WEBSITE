import { createFileRoute } from '@tanstack/react-router'
import { defaultSketch } from '@/sketches/registry'
import { SketchShell } from '@/components/layout/sketch_shell'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <SketchShell sketch={defaultSketch} />
}
