// @ts-nocheck
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { flowField } from '@/tsl/fields/vectors/flow'
import { positionLocal, time, float } from 'three/tsl'
import { OrbitControls } from '@react-three/drei'

export const Config: SketchConfig = {
  meta: {
    name: 'Flow Vis',
    description: 'Vector field visualizer powered by flow utilities',
  },
  settings: {
    camera: {
      position: [0, 0, 5],
      fov: 45,
    },
  },
  controls: {
    gridScale: { value: 2.0, min: 0.1, max: 10.0, step: 0.1 },
    timeScale: { value: 0.1, min: 0, max: 2.0, step: 0.01 },
  },
}

function FlowVisScene({ gridScale, timeScale }: any) {
  // Visualize the flow field by mapping vector direction to color
  const flowVisNode = flowField(positionLocal, time.mul(float(timeScale)), float(gridScale)).add(0.5)

  return (
    <>
      <color attach='background' args={['#000']} />

      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicNodeMaterial colorNode={flowVisNode} />
      </mesh>

      <OrbitControls />
    </>
  )
}

export default function FlowFieldVis() {
  return <SketchWrapper sketch={FlowVisScene} config={Config} />
}
