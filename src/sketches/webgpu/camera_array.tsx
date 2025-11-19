/**
 * @sketch webgpu/camera_array
 * @description ArrayCamera example rendered through WebGPUScene
 */

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { ArrayCamera, Mesh, PerspectiveCamera as ThreePerspectiveCamera, Vector4 } from 'three/webgpu'

const AMOUNT = 6

export default () => undefined

export const Scene = () => {
  const { size } = useThree()
  const meshRef = useRef<Mesh>(null)

  const arrayCamera = useMemo(() => {
    const subCameras = []
    for (let i = 0; i < AMOUNT * AMOUNT; i++) {
      const subCamera = new ThreePerspectiveCamera(40, 1, 0.1, 10)
      subCamera.viewport = new Vector4()
      subCameras.push(subCamera)
    }

    const camera = new ArrayCamera(subCameras)
    camera.position.z = 3
    return camera
  }, [])

  useEffect(() => {
    const ASPECT_RATIO = size.width / size.height
    const WIDTH = size.width / AMOUNT
    const HEIGHT = size.height / AMOUNT

    arrayCamera.aspect = ASPECT_RATIO
    arrayCamera.updateProjectionMatrix()

    for (let y = 0; y < AMOUNT; y++) {
      for (let x = 0; x < AMOUNT; x++) {
        const subcamera = arrayCamera.cameras[AMOUNT * y + x]
        subcamera.copy(arrayCamera)
        subcamera.viewport.set(Math.floor(x * WIDTH), Math.floor(y * HEIGHT), Math.ceil(WIDTH), Math.ceil(HEIGHT))
        subcamera.updateProjectionMatrix()
        subcamera.position.set((x / AMOUNT - 0.5) * 2, (0.5 - y / AMOUNT) * 2, 1.5 + (x + y) * 0.5)
        subcamera.position.multiplyScalar(2)
        subcamera.lookAt(0, 0, 0)
        subcamera.updateMatrixWorld()
      }
    }
  }, [arrayCamera, size.height, size.width])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.z += 0.01
    }
  })

  return (
    <>
      <primitive object={arrayCamera} makeDefault />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[0.5, 0.5, 1]}
        intensity={3}
        castShadow
        shadow-bias={-0.001}
      />

      <mesh position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial color={0x000066} />
      </mesh>

      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshPhongMaterial color={0xff0000} />
      </mesh>
    </>
  )
}
