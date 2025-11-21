// @ts-nocheck
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { velvetMaterial } from '@/tsl/materials/standard/velvet'
import { carPaintMaterial } from '@/tsl/materials/standard/car_paint'
import { pbrMaterial } from '@/tsl/materials/standard/pbr'
import { color } from 'three/tsl'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export const Config: SketchConfig = {
  meta: {
    name: 'Material Gallery',
    description: 'Showcase of different TSL material presets.',
  },
  settings: {
    camera: {
      position: [0, 0, 5],
      fov: 45,
    },
  },
  controls: {
    rotateSpeed: { value: 0.2, min: 0, max: 2, step: 0.1 },
  },
}

function MaterialGalleryScene({ rotateSpeed }: { rotateSpeed: number }) {
  return (
    <>
      <color attach='background' args={['#1a1a1a']} />

      <group position={[-2, 0, 0]}>
        <SphereWithMaterial
          name='Velvet'
          config={velvetMaterial({ baseColor: color('#600'), sheen: color('#f88') })}
          rotateSpeed={rotateSpeed}
        />
      </group>

      <group position={[0, 0, 0]}>
        <SphereWithMaterial
          name='Car Paint'
          config={carPaintMaterial({ baseColor: color('#1144aa'), flakeIntensity: 0.1 })}
          rotateSpeed={rotateSpeed}
        />
      </group>

      <group position={[2, 0, 0]}>
        <SphereWithMaterial
          name='Gold PBR'
          config={pbrMaterial({ baseColor: color('#fc9'), metalness: 1, roughness: 0.15 })}
          rotateSpeed={rotateSpeed}
        />
      </group>

      <Environment preset='studio' />
      <OrbitControls />
    </>
  )
}

function SphereWithMaterial({ name, config, rotateSpeed }: any) {
  const meshRef = useRef<any>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * rotateSpeed
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * rotateSpeed
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

export default function MaterialGallery() {
  return <SketchWrapper sketch={MaterialGalleryScene} config={Config} />
}
