// @ts-nocheck
import { useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { createAttractorSystem } from '@/tsl/particles/emitters/attractor'
import { ComputeRunner } from '@/components/compute/compute_runner'
import { mix, vec3, float, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'

export const Config: SketchConfig = {
  meta: {
    name: 'Attractor Swarm',
    description: 'Compute-driven particles orbiting a moving attractor point.',
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
      label: 'Attractor Strength',
    },
  },
}

function AttractorScene({ pointerStrength }: { pointerStrength: number }) {
  const pointerUniform = usePointerUniform()

  const particleSystem = useMemo(
    () =>
      createAttractorSystem({
        count: 100000,
        speed: 0.2,
        drag: 0.97,
        attractorPos: pointerUniform.mul(float(Math.max(0.1, pointerStrength)).mul(5)),
      }),
    [pointerUniform, pointerStrength],
  )

  // We need to execute the init kernel once
  const initNode = particleSystem.initKernel
  const updateNode = particleSystem.updateKernel

  return (
    <>
      <color attach='background' args={['#050505']} />

      <ComputeRunner initNode={initNode} updateNode={updateNode} count={particleSystem.count} />

      <instancedMesh args={[undefined, undefined, particleSystem.count]} frustumCulled={false}>
        <sphereGeometry args={[0.02, 8, 8]} />
        {/* @ts-ignore - r181 specific */}
        <meshBasicNodeMaterial
          colorNode={mix(
            particleSystem.colorStorage.element(instanceIndex),
            vec3(1, 0.6, 0.2),
            pointerUniform.length().mul(pointerStrength).clamp(float(0), float(1)),
          )}
          positionNode={particleSystem.positionStorage.element(instanceIndex)}
        />
      </instancedMesh>

      <OrbitControls autoRotate />
    </>
  )
}

export default function AttractorDemo() {
  return <SketchWrapper sketch={AttractorScene} config={Config} />
}
