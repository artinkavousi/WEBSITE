// @ts-nocheck
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { ComputeRunner } from '@/components/compute/compute_runner'
import { createFlowEmitter } from '@/tsl/particles/emitters/flow_emitter'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { color, mix, float, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'
import { useControlStore } from '@/stores/control_panel'

export default function FlowParticlesDemo() {
  const pointerUniform = usePointerUniform()
  const { flowPointerStrength } = useControlStore()

  const system = useMemo(
    () =>
      createFlowEmitter({
        count: 200000,
        speed: 2.0,
        curlScale: 0.3,
        pointer: pointerUniform,
        pointerStrength: flowPointerStrength,
      }),
    [flowPointerStrength, pointerUniform],
  )

  return (
    <WebGPUScene orthographic={false}>
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
    </WebGPUScene>
  )
}
