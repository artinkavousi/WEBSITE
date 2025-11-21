// @ts-nocheck
import { SketchWrapper, SketchConfig } from '@/components/sketch_wrapper'
import { glassMaterial } from '@/tsl/materials/glass/dispersion'
import { color, float } from 'three/tsl'
import { OrbitControls, Environment } from '@react-three/drei'
import { createFXChain } from '@/tsl/postfx/chain'
import { PostProcessing } from '@/tsl/postfx/core/PostProcessing'
import { chromaticAberrationEffect } from '@/tsl/postfx/passes/chromatic_aberration_effect'

export const Config: SketchConfig = {
  meta: {
    name: 'Dispersion Glass',
    description: 'Physical glass material with chromatic dispersion and variable IOR.',
  },
  settings: {
    camera: {
      position: [0, 0, 5],
      fov: 45,
    },
  },
  controls: {
    ior: { value: 1.5, min: 1.0, max: 2.33, step: 0.01, label: 'IOR' },
    dispersion: { value: 0.1, min: 0, max: 1.0, step: 0.01, label: 'Dispersion' },
    roughness: { value: 0.1, min: 0, max: 1.0, step: 0.01, label: 'Roughness' },
    thickness: { value: 1.5, min: 0, max: 5.0, step: 0.1, label: 'Thickness' },
    chromaticAberration: { value: 0.002, min: 0, max: 0.02, step: 0.001, label: 'PostFX Chroma' },
  },
}

function GlassScene(props: any) {
  const { ior, dispersion, roughness, thickness, chromaticAberration } = props

  const materialConfig = glassMaterial({
    baseColor: color(1.0, 1.0, 1.0),
    roughness: float(roughness),
    transmission: float(1.0),
    thickness: float(thickness),
    ior: float(ior),
    dispersion: float(dispersion),
  })

  // Example of chaining FX
  const fxChain = createFXChain([{ fn: chromaticAberrationEffect, params: { offset: chromaticAberration } }])

  return (
    <>
      <color attach='background' args={['#000']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      {/* High contrast environment for glass to reflect */}
      <Environment preset='city' background blur={0.5} />

      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        {/* @ts-ignore - r181 specific props */}
        <meshPhysicalNodeMaterial
          {...materialConfig}
          transmission={1.0} // Explicit prop might still be needed in some versions for enabling the pass
        />
      </mesh>

      <PostProcessing chain={fxChain} />

      <OrbitControls />
    </>
  )
}

export default function GlassDemo() {
  return <SketchWrapper sketch={GlassScene} config={Config} />
}
