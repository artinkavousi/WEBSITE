/**
 * @sketch webgpu/backdrop_water
 * @description Backdrop water refraction node pipeline ported for R3F
 */

import { OrbitControls, PerspectiveCamera, useGLTF, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimationMixer,
  BoxGeometry,
  Clock,
  Fog,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicNodeMaterial,
  MeshStandardNodeMaterial,
  NoColorSpace,
  RepeatWrapping,
  Vector3,
} from 'three/webgpu'
import {
  color,
  linearDepth,
  mx_worley_noise_float,
  normalWorld,
  positionWorld,
  screenUV,
  texture,
  time,
  triplanarTexture,
  vec2,
  viewportDepthTexture,
  viewportLinearDepth,
  viewportSharedTexture,
} from 'three/tsl'

export default () => undefined

const count = 100
const scale = 3.5
const column = 10
const THREE_EXAMPLES_BASE = 'https://raw.githubusercontent.com/mrdoob/three.js/r181/examples'
const MICHELLE_MODEL_URL = `${THREE_EXAMPLES_BASE}/models/gltf/Michelle.glb`
const WATER_TEXTURE_URL = `${THREE_EXAMPLES_BASE}/textures/water.jpg`

export const Scene = () => {
  const { scene } = useThree()
  const [floorPosition, setFloorPosition] = useState(0.2)
  const clock = useMemo(() => new Clock(), [])

  useEffect(() => {
    scene.fog = new Fog(0x0487e2, 7, 25)
  }, [scene])

  const { scene: modelScene, animations } = useGLTF(MICHELLE_MODEL_URL) as any
  const mixerRef = useRef<any>()

  useEffect(() => {
    if (animations?.length) {
      mixerRef.current = new AnimationMixer(modelScene)
      const action = mixerRef.current.clipAction(animations[0])
      action.play()
    }
    modelScene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    scene.add(modelScene)
    return () => {
      scene.remove(modelScene)
    }
  }, [animations, modelScene, scene])

  const waterTexture = useTexture(WATER_TEXTURE_URL)
  waterTexture.wrapS = waterTexture.wrapT = RepeatWrapping
  waterTexture.colorSpace = NoColorSpace

  const iceColorNode = useMemo(() => triplanarTexture(texture(waterTexture)).add(color(0x0066ff)).mul(0.8), [waterTexture])

  const geometry = useMemo(() => new IcosahedronGeometry(1, 3), [])
  const material = useMemo(() => new MeshStandardNodeMaterial({ colorNode: iceColorNode }), [iceColorNode])

  const objects = useMemo(() => {
    const group = new Group()
    for (let i = 0; i < count; i++) {
      const x = i % column
      const y = Math.floor(i / column)
      const mesh = new Mesh(geometry, material)
      mesh.position.set(x * scale, 0, y * scale)
      mesh.rotation.set(Math.random(), Math.random(), Math.random())
      group.add(mesh)
    }

    group.position.set(((column - 1) * scale) * -0.5, -1, ((count / column) * scale) * -0.5)
    return group
  }, [geometry, material])

  const timer = time.mul(0.8)
  const floorUV = positionWorld.xzy

  const waterLayer0 = mx_worley_noise_float(floorUV.mul(4).add(timer))
  const waterLayer1 = mx_worley_noise_float(floorUV.mul(2).add(timer))

  const waterIntensity = waterLayer0.mul(waterLayer1)
  const waterColor = waterIntensity.mul(1.4).mix(color(0x0487e2), color(0x74ccf4))
  const depth = linearDepth()
  const depthWater = viewportLinearDepth.sub(depth)
  const depthEffect = depthWater.remapClamp(-0.002, 0.04)
  const refractionUV = screenUV.add(vec2(0, waterIntensity.mul(0.1)))
  const depthTestForRefraction = linearDepth(viewportDepthTexture(refractionUV)).sub(depth)
  const depthRefraction = depthTestForRefraction.remapClamp(0, 0.1)
  const finalUV = depthTestForRefraction.lessThan(0).select(screenUV, refractionUV)
  const viewportTexture = viewportSharedTexture(finalUV)

  const waterMaterial = useMemo(() => {
    const mat = new MeshBasicNodeMaterial()
    mat.colorNode = waterColor
    mat.backdropNode = depthEffect.mix(viewportSharedTexture(), viewportTexture.mul(depthRefraction.mix(1, waterColor)))
    mat.backdropAlphaNode = depthRefraction.oneMinus()
    mat.transparent = true
    return mat
  }, [depthEffect, depthRefraction, viewportTexture, waterColor])

  const waterMesh = useMemo(() => {
    const mesh = new Mesh(new BoxGeometry(50, 0.001, 50), waterMaterial)
    mesh.position.set(0, 0, 0)
    return mesh
  }, [waterMaterial])

  const floorMesh = useMemo(() => {
    const mesh = new Mesh(new BoxGeometry(2.2, 10, 2.2), new MeshStandardNodeMaterial({ colorNode: iceColorNode }))
    mesh.position.set(0, -5, 0)
    return mesh
  }, [iceColorNode])

  useEffect(() => {
    scene.add(objects)
    scene.add(waterMesh)
    scene.add(floorMesh)
    return () => {
      scene.remove(objects)
      scene.remove(waterMesh)
      scene.remove(floorMesh)
    }
  }, [floorMesh, objects, scene, waterMesh])

  useFrame(() => {
    const delta = clock.getDelta()
    floorMesh.position.y = floorPosition - 5
    objects.children.forEach((object) => {
      object.position.y = Math.sin(clock.elapsedTime + object.id) * 0.3
      object.rotation.y += delta * 0.3
    })

    if (mixerRef.current) {
      mixerRef.current.update(delta)
      modelScene.position.y = floorPosition
    }
  })

  const waterPosY = positionWorld.y.sub(waterMesh.position.y)
  let transition = waterPosY.add(0.1).saturate().oneMinus()
  transition = waterPosY.lessThan(0).select(transition, normalWorld.y.mix(transition, 0)).toVar()
  const causticColorNode = transition.mix(material.colorNode, material.colorNode.add(waterLayer0))
  floorMesh.material.colorNode = causticColorNode

  return (
    <>
      <PerspectiveCamera makeDefault fov={50} near={0.25} far={30} position={[3, 2, 4]} />
      <hemisphereLight args={[0x333366, 0x74ccf4, 5]} />
      <hemisphereLight args={[0x74ccf4, 0, 1]} />
      <directionalLight
        args={[0xffe499, 5]}
        position={[0.5, 3, 0.5]}
        castShadow
        shadow-camera-near={0.1}
        shadow-camera-far={5}
        shadow-camera-right={2}
        shadow-camera-left={-2}
        shadow-camera-top={1}
        shadow-camera-bottom={-2}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
      />

      <primitive object={waterMesh} />
      <primitive object={floorMesh} />
      <primitive object={objects} />
      <primitive object={modelScene} />

      <OrbitControls
        minDistance={1}
        maxDistance={10}
        maxPolarAngle={Math.PI * 0.9}
        autoRotate
        autoRotateSpeed={1}
        target={[0, 0.2, 0]}
      />

      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          padding: '10px 14px',
          background: 'rgba(0,0,0,0.55)',
          color: 'white',
          borderRadius: 10,
          zIndex: 10,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <label htmlFor='floor-position'>Floor position</label>
        <input
          id='floor-position'
          type='range'
          min={-1}
          max={1}
          step={0.001}
          value={floorPosition}
          onChange={(e) => setFloorPosition(Number(e.target.value))}
        />
      </div>
    </>
  )
}

useGLTF.preload(MICHELLE_MODEL_URL)
