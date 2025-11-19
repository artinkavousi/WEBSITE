import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Plane, Raycaster, Sprite, Vector2, Vector3 } from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { createComputeParticleGraph } from '@/tsl/compute/particles'

const graph = createComputeParticleGraph(8192)
const particles = new Sprite(graph.material)
particles.count = graph.particleCount
particles.frustumCulled = false

const raycaster = new Raycaster()
const pointer = new Vector2()
const plane = new Plane(new Vector3(0, 1, 0), 0)

const computeParticlesSketch = () => undefined

export const Scene = () => {
  const renderer = useThree((state) => state.gl as WebGPURenderer)
  const camera = useThree((state) => state.camera)
  const spriteRef = useRef<Sprite>(particles)

  useControls('Compute Particles', {
    gravity: {
      value: graph.uniforms.gravity.value,
      min: -0.01,
      max: 0,
      step: 0.0001,
      onChange: (value) => (graph.uniforms.gravity.value = value),
    },
    bounce: {
      value: graph.uniforms.bounce.value,
      min: 0,
      max: 1.5,
      step: 0.01,
      onChange: (value) => (graph.uniforms.bounce.value = value),
    },
    friction: {
      value: graph.uniforms.friction.value,
      min: 0.9,
      max: 1,
      step: 0.0005,
      onChange: (value) => (graph.uniforms.friction.value = value),
    },
    size: {
      value: graph.uniforms.size.value,
      min: 0.05,
      max: 0.4,
      step: 0.01,
      onChange: (value) => (graph.uniforms.size.value = value),
    },
  })

  useEffect(() => {
    renderer.computeAsync(graph.initCompute)
  }, [renderer])

  useFrame(() => {
    renderer.computeAsync(graph.updateCompute)
  })

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.ray.intersectPlane(plane, new Vector3())
      if (hit) {
        graph.uniforms.clickPosition.value.copy(hit)
        renderer.computeAsync(graph.hitCompute)
      }
    }

    const dom = renderer.domElement
    dom.addEventListener('pointermove', handlePointerMove)
    return () => {
      dom.removeEventListener('pointermove', handlePointerMove)
    }
  }, [camera, renderer])

  return <primitive object={spriteRef.current} />
}

export default computeParticlesSketch
