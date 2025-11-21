// @ts-nocheck
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { ComputeRunner } from '@/components/compute/compute_runner'
import { createAttractorSystem } from '@/tsl/particles/emitters/attractor'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import { mix, vec3, float, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'
import { useControlStore } from '@/stores/control_panel'

export default function AttractorDemo() {
  const pointerUniform = usePointerUniform()
  const { flowPointerStrength } = useControlStore()

  const particleSystem = useMemo(
    () =>
      createAttractorSystem({
        count: 100000,
        speed: 0.2,
        drag: 0.97,
        attractorPos: pointerUniform.mul(float(Math.max(0.1, flowPointerStrength)).mul(5)),
      }),
    [pointerUniform, flowPointerStrength],
  )

  // We need to execute the init kernel once
  const initNode = particleSystem.initKernel
  const updateNode = particleSystem.updateKernel

  return (
    <WebGPUScene orthographic={false}>
      <color attach='background' args={['#050505']} />

      <ComputeRunner initNode={initNode} updateNode={updateNode} count={particleSystem.count} />

      <instancedMesh args={[undefined, undefined, particleSystem.count]} frustumCulled={false}>
        <sphereGeometry args={[0.02, 8, 8]} />
        {/* @ts-ignore - r181 specific */}
        <meshBasicNodeMaterial
          colorNode={mix(
            particleSystem.colorStorage.element(instanceIndex),
            vec3(1, 0.6, 0.2),
            pointerUniform.length().mul(flowPointerStrength).clamp(float(0), float(1)),
          )}
          positionNode={particleSystem.positionStorage.element(instanceIndex)}
        />
      </instancedMesh>

      <OrbitControls autoRotate />
    </WebGPUScene>
  )
}
