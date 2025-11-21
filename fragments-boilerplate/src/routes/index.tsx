import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useRef } from 'react'
import Flare1 from '@/sketches/flare_1'
import { SketchesDropdown } from '@/components/sketches_dropdown'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const ref = useRef<any>(null)

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        <Flare1 />
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
