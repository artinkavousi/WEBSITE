// @ts-nocheck
import { Canvas } from '@react-three/fiber'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { pbrMaterial } from '@/tsl/materials/standard/pbr'
import { color, float } from 'three/tsl'
import { OrbitControls, Environment } from '@react-three/drei'

export default function PBRDemo() {
  const materialConfig = pbrMaterial({
    baseColor: color(0.0, 0.5, 1.0),
    roughness: float(0.2),
    metalness: float(1.0),
  })

  return (
    <WebGPUScene orthographic={false}>
      <color attach='background' args={['#111']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Environment preset='city' />

      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        {/* @ts-ignore - r181 specific */}
        <meshPhysicalNodeMaterial {...materialConfig} />
      </mesh>

      <OrbitControls />
    </WebGPUScene>
  )
}
