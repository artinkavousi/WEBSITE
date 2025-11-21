// @ts-nocheck
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { velvetMaterial } from '@/tsl/materials/standard/velvet'
import { carPaintMaterial } from '@/tsl/materials/standard/car_paint'
import { pbrMaterial } from '@/tsl/materials/standard/pbr'
import { color, float, time, sin, vec3 } from 'three/tsl'
import { OrbitControls, Environment, Stage, Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function MaterialGallery() {
  return (
    <WebGPUScene orthographic={false}>
      <color attach='background' args={['#1a1a1a']} />

      <group position={[-2, 0, 0]}>
        <SphereWithMaterial name='Velvet' config={velvetMaterial({ baseColor: color('#600'), sheen: color('#f88') })} />
      </group>

      <group position={[0, 0, 0]}>
        <SphereWithMaterial
          name='Car Paint'
          config={carPaintMaterial({ baseColor: color('#1144aa'), flakeIntensity: 0.1 })}
        />
      </group>

      <group position={[2, 0, 0]}>
        <SphereWithMaterial
          name='Gold PBR'
          config={pbrMaterial({ baseColor: color('#fc9'), metalness: 1, roughness: 0.15 })}
        />
      </group>

      <Environment preset='studio' />
      <OrbitControls />
    </WebGPUScene>
  )
}

function SphereWithMaterial({ name, config }) {
  const meshRef = useRef<any>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        {/* @ts-ignore */}
        <meshPhysicalNodeMaterial {...config} />
      </mesh>
      <Text position={[0, -1.2, 0]} fontSize={0.2} color='white' anchorX='center' anchorY='middle'>
        {name}
      </Text>
    </group>
  )
}
