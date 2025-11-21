// @ts-nocheck
import { useMemo } from 'react'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { materials } from '@/tsl/presets/materials'
import { createFlowEmitter } from '@/tsl/particles/emitters/flow_emitter'
import { ComputeRunner } from '@/components/compute/compute_runner'
import * as THREE from 'three/webgpu'
import { color, mix, time, float, sin, instanceIndex } from 'three/tsl'
import { usePointerUniform } from '@/hooks/use_pointer_uniform'

/**
 * HERO SKETCH: Nebula Storm
 * Combines:
 * - Flow Field Particles (Compute)
 * - Glass Material (Dispersion)
 * - PostFX Chain (Cinematic)
 * - Complex Composition
 */

export const Config: SketchConfig = {
  meta: {
    name: 'Nebula Storm',
    description: 'A WebGPU particle flow simulation with glass dispersion.',
  },
  settings: {
    camera: {
      type: 'perspective',
      position: [0, 0, 5],
      fov: 45,
    },
    postfx: {
      enabled: true,
      preset: 'cinematic',
    },
  },
  controls: {
    nebulaSpeed: {
      value: 1.5,
      min: 0.1,
      max: 3,
      step: 0.05,
      label: 'Particle Speed',
    },
    nebulaCurlScale: {
      value: 0.4,
      min: 0.1,
      max: 1.5,
      step: 0.05,
      label: 'Curl Scale',
    },
    nebulaPointerStrength: {
      value: 0.8,
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Pointer Gravity',
    },
  },
}

function NebulaStormScene(props: any) {
  const { nebulaSpeed, nebulaCurlScale, nebulaPointerStrength } = props
  const pointerUniform = usePointerUniform()

  // 1. Particle System
  const particles = useMemo(
    () =>
      createFlowEmitter({
        count: 300000,
        speed: nebulaSpeed,
        curlScale: nebulaCurlScale,
        timeScale: 0.2,
        pointer: pointerUniform.mul(float(5)),
        pointerStrength: nebulaPointerStrength,
      }),
    [nebulaSpeed, nebulaCurlScale, nebulaPointerStrength, pointerUniform],
  )

  // 2. Material Config (Crystal)
  const crystalMat = materials.glass.crystal

  const pointerHue = pointerUniform.x.mul(0.5).add(0.5).clamp(float(0), float(1))

  return (
    <>
      <color attach='background' args={['#000205']} />

      {/* Lighting */}
      <directionalLight position={[10, 10, 5]} intensity={2} color='#ffddaa' />
      <directionalLight position={[-10, -5, -5]} intensity={1} color='#4488ff' />
      <ambientLight intensity={0.2} />
      <Environment preset='city' blur={0.8} />

      {/* Compute Particles */}
      <ComputeRunner initNode={particles.initKernel} updateNode={particles.updateKernel} count={particles.count} />

      {/* Particle Render */}
      <instancedMesh args={[undefined, undefined, particles.count]} frustumCulled={false}>
        <boxGeometry args={[0.015, 0.015, 0.015]} />
        {/* @ts-ignore */}
        <meshBasicNodeMaterial
          positionNode={particles.positionStorage.element(instanceIndex)}
          colorNode={mix(
            mix(color('#ff3366'), color('#0088ff'), particles.lifeStorage.element(instanceIndex).add(sin(time))),
            color('#ffe487'),
            pointerHue,
          )}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Centerpiece: Floating Artifact */}
      <Float floatIntensity={2} rotationIntensity={1}>
        <mesh scale={1.5}>
          <icosahedronGeometry args={[1, 0]} />
          {/* @ts-ignore */}
          <meshPhysicalNodeMaterial {...crystalMat} />
        </mesh>
      </Float>

      <OrbitControls autoRotate autoRotateSpeed={0.2} />
    </>
  )
}

export default function NebulaStorm() {
  return <SketchWrapper sketch={NebulaStormScene} config={Config} />
}
