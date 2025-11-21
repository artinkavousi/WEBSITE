// @ts-nocheck
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { ComputeRunner } from '@/components/compute/compute_runner'
import { createSwarmEmitter } from '@/tsl/particles/emitters/swarm'
import { OrbitControls, Environment } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { color, mix, positionLocal, float, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'
import { useControlStore } from '@/stores/control_panel'

export default function SwarmDemo() {
  const pointerUniform = usePointerUniform()
  const { flowPointerStrength } = useControlStore()

  const system = useMemo(
    () =>
      createSwarmEmitter({
        count: 100000,
        speed: 1.5,
        confusion: 0.5,
        cohesion: 0.8,
        pointer: pointerUniform.mul(float(5)),
        pointerStrength: flowPointerStrength,
      }),
    [flowPointerStrength, pointerUniform],
  )

  return (
    <WebGPUScene orthographic={false}>
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
    </WebGPUScene>
  )
}
