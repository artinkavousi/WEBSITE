import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchesDropdown } from '@/components/sketches_dropdown'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useMemo, useRef } from 'react'
import flare1 from '@/sketches/flare-1'
import { PostProcessing } from '@/tsl/postfx/core/PostProcessing'
import { postfx } from '@/tsl/presets/postfx'
import { useControlStore } from '@/stores/control_panel'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const ref = useRef<any>(null)
  const { postfxEnabled, postfxPreset, flareRepetitions, flareBandOffset, flarePaletteShift, flareGrainIntensity } =
    useControlStore()

  const colorNode = useMemo(
    () =>
      flare1({
        repetitions: flareRepetitions,
        bandOffset: flareBandOffset,
        paletteShift: flarePaletteShift,
        grainIntensity: flareGrainIntensity,
      }),
    [flareRepetitions, flareBandOffset, flarePaletteShift, flareGrainIntensity],
  )

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        <WebGPUScene
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
          }}
          eventSource={ref}
          eventPrefix='client'
        >
          <WebGPUSketch colorNode={colorNode} />
          {postfxEnabled ? <PostProcessing chain={postfx[postfxPreset]} /> : null}
        </WebGPUScene>
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
