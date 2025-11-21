// @ts-nocheck
import { useMemo } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { createSwarmEmitter } from '@/tsl/particles/emitters/swarm'
import { ComputeRunner } from '@/components/compute/compute_runner'
import { color, mix, positionLocal, float, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'

export const Config: SketchConfig = {
  meta: {
    name: 'Boid Swarm',
    description: 'Flocking behavior with separation, alignment, and cohesion.',
  },
  settings: {
    camera: {
      position: [0, 0, 5],
      fov: 45,
    },
  },
  controls: {
    pointerStrength: {
      value: 0.4,
      min: 0,
      max: 5,
      step: 0.05,
      label: 'Pointer Influence',
    },
  },
}

function SwarmScene({ pointerStrength }: { pointerStrength: number }) {
  const pointerUniform = usePointerUniform()

  const system = useMemo(
    () =>
      createSwarmEmitter({
        count: 100000,
        speed: 1.5,
        confusion: 0.5,
        cohesion: 0.8,
        pointer: pointerUniform.mul(float(5)),
        pointerStrength: pointerStrength,
      }),
    [pointerStrength, pointerUniform],
  )

  return (
    <>
      <color attach='background' args={['#000']} />
      <Environment preset='city' />

      <ComputeRunner initNode={system.initKernel} updateNode={system.updateKernel} count={system.count} />

      <instancedMesh args={[undefined, undefined, system.count]} frustumCulled={false}>
        <capsuleGeometry args={[0.01, 0.05, 4, 8]} />
        {/* @ts-ignore */}
        <meshStandardNodeMaterial
          positionNode={system.positionStorage.element(instanceIndex)}
          // Align capsule with velocity would be cool but complex in TSL node rotation right now
          colorNode={mix(
            color('#ffaa00'),
            color('#00aaff'),
            positionLocal.y.add(1.0).mul(0.5).add(pointerUniform.y.mul(0.5)),
          )}
          roughness={0.4}
          metalness={1.0}
        />
      </instancedMesh>

      <OrbitControls autoRotate autoRotateSpeed={1.0} />
    </>
  )
}

export default function SwarmDemo() {
  return <SketchWrapper sketch={SwarmScene} config={Config} />
}
