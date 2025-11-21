// @ts-nocheck
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { flowField } from '@/tsl/fields/vectors/flow'
import { positionLocal, time, float } from 'three/tsl'
import { OrbitControls } from '@react-three/drei'

export default function FlowFieldVis() {
  // Visualize the flow field by mapping vector direction to color
  const flowVisNode = flowField(positionLocal, time.mul(0.1), float(2.0)).add(0.5)

  return (
    <WebGPUScene orthographic={false}>
      <color attach='background' args={['#000']} />

      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicNodeMaterial colorNode={flowVisNode} />
      </mesh>

      <OrbitControls />
    </WebGPUScene>
  )
}
