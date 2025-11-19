import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { BufferGeometry, Mesh, Sprite, WebGPURenderer } from 'three/webgpu'
import { createLinkedParticleGraph } from '@/tsl/particles/linked'

const graph = createLinkedParticleGraph(192)

const buildLinkGeometry = (particleCount: number, positionAttr: any, colorAttr: any) => {
  const geom = new BufferGeometry()
  geom.setAttribute('position', positionAttr)
  geom.setAttribute('color', colorAttr)

  const indices: number[] = []
  for (let i = 0; i < particleCount; i++) {
    const offset = i * 8
    indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3)
    indices.push(offset + 4, offset + 5, offset + 6, offset + 4, offset + 6, offset + 7)
  }
  geom.setIndex(indices)
  return geom
}

const particles = new Sprite(graph.spriteMaterial)
particles.count = graph.particleCount
particles.frustumCulled = false

const linksGeometry = buildLinkGeometry(
  graph.particleCount,
  graph.linkVerticesAttr,
  graph.linkColorsAttr,
)
const linksMesh = new Mesh(linksGeometry, graph.linkMaterial)
linksMesh.frustumCulled = false

const linkedParticlesSketch = () => graph.linkedParticlesColor

export const Scene = () => {
  const renderer = useThree((state) => state.gl as WebGPURenderer)

  useControls('Linked Particles', {
    timeScale: {
      value: graph.uniforms.uTimeScale.value,
      min: 0,
      max: 2,
      step: 0.01,
      onChange: (value) => (graph.uniforms.uTimeScale.value = value),
    },
    particleLifetime: {
      value: graph.uniforms.uParticleLifetime.value,
      min: 0.25,
      max: 4,
      step: 0.01,
      onChange: (value) => (graph.uniforms.uParticleLifetime.value = value),
    },
    particleSize: {
      value: graph.uniforms.uParticleSize.value,
      min: 0.02,
      max: 0.4,
      step: 0.005,
      onChange: (value) => (graph.uniforms.uParticleSize.value = value),
    },
    colorVariance: {
      value: graph.uniforms.uColorVariance.value,
      min: 0.1,
      max: 4,
      step: 0.01,
      onChange: (value) => (graph.uniforms.uColorVariance.value = value),
    },
    colorRotationSpeed: {
      value: graph.uniforms.uColorRotationSpeed.value,
      min: 0,
      max: 4,
      step: 0.01,
      onChange: (value) => (graph.uniforms.uColorRotationSpeed.value = value),
    },
    turbFrequency: {
      value: graph.uniforms.turbFrequency.value,
      min: 0,
      max: 2,
      step: 0.01,
      onChange: (value) => (graph.uniforms.turbFrequency.value = value),
    },
    turbAmplitude: {
      value: graph.uniforms.turbAmplitude.value,
      min: 0,
      max: 2,
      step: 0.01,
      onChange: (value) => (graph.uniforms.turbAmplitude.value = value),
    },
    turbGain: {
      value: graph.uniforms.turbGain.value,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (value) => (graph.uniforms.turbGain.value = value),
    },
    turbLacunarity: {
      value: graph.uniforms.turbLacunarity.value,
      min: 1,
      max: 4,
      step: 0.01,
      onChange: (value) => (graph.uniforms.turbLacunarity.value = value),
    },
  })

  useEffect(() => {
    renderer.computeAsync(graph.initParticles)
  }, [renderer])

  useFrame(() => {
    renderer.computeAsync(graph.updateParticles)
  })

  const particleRef = useRef<Sprite>(particles)
  const linksRef = useRef<Mesh>(linksMesh)

  return (
    <>
      <primitive object={particleRef.current} />
      <primitive object={linksRef.current} />
    </>
  )
}

export default linkedParticlesSketch
