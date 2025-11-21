import WebGPUScene from '@/components/canvas/webgpu_scene'
import { glassMaterial } from '@/tsl/materials/glass/dispersion'
import { color, float } from 'three/tsl'
import { OrbitControls, Environment } from '@react-three/drei'
import { createFXChain } from '@/tsl/postfx/chain'
import { PostProcessing } from '@/tsl/postfx/core/PostProcessing'
import { chromaticAberrationEffect } from '@/tsl/postfx/passes/chromatic_aberration_effect'

export default function GlassDemo() {
  const materialConfig = glassMaterial({
    baseColor: color(1.0, 1.0, 1.0),
    roughness: float(0.1),
    transmission: float(1.0),
    thickness: float(1.5),
    ior: float(1.5),
    dispersion: float(0.1),
  })

  // Example of chaining FX
  const fxChain = createFXChain([{ fn: chromaticAberrationEffect, params: { offset: 0.002 } }])

  return (
    <WebGPUScene orthographic={false}>
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
          roughness={0.1}
        />
      </mesh>

      <PostProcessing chain={fxChain} />

      <OrbitControls />
    </WebGPUScene>
  )
}
