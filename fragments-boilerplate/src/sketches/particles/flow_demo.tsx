// @ts-nocheck
import { useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { createFlowEmitter } from '@/tsl/particles/emitters/flow_emitter'
import { ComputeRunner } from '@/components/compute/compute_runner'
import * as THREE from 'three/webgpu'
import { color, mix, float, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'

export const Config: SketchConfig = {
  meta: {
    name: 'Flow Field Particles',
    description: 'Particles following a curl noise vector field.',
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
      label: 'Pointer Attraction',
    },
  },
}

function FlowParticlesScene({ pointerStrength }: { pointerStrength: number }) {
  const pointerUniform = usePointerUniform()

  const system = useMemo(
    () =>
      createFlowEmitter({
        count: 200000,
        speed: 2.0,
        curlScale: 0.3,
        pointer: pointerUniform,
        pointerStrength: pointerStrength,
      }),
    [pointerStrength, pointerUniform],
  )

  return (
    <>
      <color attach='background' args={['#000510']} />

      <ComputeRunner initNode={system.initKernel} updateNode={system.updateKernel} count={system.count} />

      <instancedMesh args={[undefined, undefined, system.count]} frustumCulled={false}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        {/* @ts-ignore */}
        <meshBasicNodeMaterial
          positionNode={system.positionStorage.element(instanceIndex)}
          colorNode={mix(
            mix(color('#0022ff'), color('#00ffff'), system.lifeStorage.element(instanceIndex)),
            color('#ff5ee4'),
            pointerUniform.x.mul(0.5).add(0.5).clamp(float(0), float(1)),
          )}
          transparent
          opacity={0.8}
        />
      </instancedMesh>

      <OrbitControls autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

export default function FlowParticlesDemo() {
  return <SketchWrapper sketch={FlowParticlesScene} config={Config} />
}
