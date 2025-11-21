// @ts-nocheck
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { pbrMaterial } from '@/tsl/materials/standard/pbr'
import { color, float } from 'three/tsl'
import { OrbitControls, Environment } from '@react-three/drei'

export const Config: SketchConfig = {
  meta: {
    name: 'PBR Material',
    description: 'Standard Physically Based Rendering material parameters.',
  },
  settings: {
    camera: {
      position: [0, 0, 5],
      fov: 45,
    },
  },
  controls: {
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    metalness: { value: 1.0, min: 0, max: 1, step: 0.01 },
    baseColor: { value: '#0080ff' },
  },
}

function PBRScene({ roughness, metalness, baseColor }: any) {
  const materialConfig = pbrMaterial({
    baseColor: color(baseColor),
    roughness: float(roughness),
    metalness: float(metalness),
  })

  return (
    <>
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
    </>
  )
}

export default function PBRDemo() {
  return <SketchWrapper sketch={PBRScene} config={Config} />
}
