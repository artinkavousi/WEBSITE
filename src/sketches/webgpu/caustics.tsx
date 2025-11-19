/**
 * @sketch webgpu/caustics
 * @description WebGPU caustics node material showcase ported from three.js examples
 */

import { OrbitControls, PerspectiveCamera, useGLTF, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useState } from 'react'
import {
  Color,
  DoubleSide,
  Mesh,
  MeshPhysicalNodeMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  type Group,
  HalfFloatType,
} from 'three/webgpu'
import { Fn, div, normalView, positionLocal, positionViewDirection, refract, texture, uniform, vec2, vec3, vec4 } from 'three/tsl'

const causticOcclusion = uniform(20)
const THREE_EXAMPLES_BASE = 'https://raw.githubusercontent.com/mrdoob/three.js/r181/examples'
const DUCK_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'
const CAUSTIC_MAP_URL = `${THREE_EXAMPLES_BASE}/textures/opengameart/Caustic_Free.jpg`
const GLASS_MAP_URL = `${THREE_EXAMPLES_BASE}/textures/colors.png`
const GROUND_MAP_URL = `${THREE_EXAMPLES_BASE}/textures/hardwood2_diffuse.jpg`

const useRendererShadows = () => {
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = HalfFloatType
  }, [gl])
}

const useDuckMaterial = (causticMapPath: string) => {
  const causticMap = useTexture(causticMapPath)

  return useMemo(() => {
    causticMap.wrapS = causticMap.wrapT = RepeatWrapping
    causticMap.colorSpace = SRGBColorSpace

    const material = new MeshPhysicalNodeMaterial()
    material.side = DoubleSide
    material.transparent = true
    material.color = new Color(0xffd700)
    material.transmission = 1
    material.thickness = 0.25
    material.ior = 1.5
    material.metalness = 0
    material.roughness = 0.1

    material.castShadowPositionNode = Fn(() => positionLocal)()

    material.castShadowNode = Fn(() => {
      const refractionVector = refract(positionViewDirection.negate(), normalView, div(1.0, material.ior)).normalize()
      const viewZ = normalView.z.pow(causticOcclusion)

      const textureUV = refractionVector.xy.mul(0.6)

      const causticColor = uniform(material.color)
      const chromaticAberrationOffset = normalView.z.pow(-0.9).mul(0.004)

      const causticProjection = vec3(
        texture(causticMap, textureUV.add(vec2(chromaticAberrationOffset.x.negate(), 0))).r,
        texture(causticMap, textureUV.add(vec2(0, chromaticAberrationOffset.y.negate()))).g,
        texture(causticMap, textureUV.add(vec2(chromaticAberrationOffset.x, chromaticAberrationOffset.y))).b,
      )

      return causticProjection.mul(viewZ.mul(25)).add(viewZ).mul(causticColor)
    })()

    return material
  }, [causticMap])
}

const useGlassMaterial = (colorPath: string) => {
  const colorMap = useTexture(colorPath)

  return useMemo(() => {
    colorMap.wrapS = colorMap.wrapT = RepeatWrapping
    colorMap.colorSpace = SRGBColorSpace

    const glassMaterial = new MeshPhysicalNodeMaterial()
    glassMaterial.map = colorMap
    glassMaterial.side = DoubleSide
    glassMaterial.transparent = true
    glassMaterial.color = new Color(0xffffff)
    glassMaterial.transmission = 1
    glassMaterial.ior = 1.5
    glassMaterial.metalness = 0
    glassMaterial.roughness = 0.1
    glassMaterial.castShadowNode = vec4(texture(colorMap).rgb, 0.8)

    return glassMaterial
  }, [colorMap])
}

const useGroundMaterial = (mapPath: string) => {
  const map = useTexture(mapPath)

  return useMemo(() => {
    map.wrapS = map.wrapT = RepeatWrapping
    map.repeat.set(10, 10)

    const material = new MeshStandardMaterial({ color: 0x999999, map })
    return material
  }, [map])
}

export default () => undefined

export const Scene = () => {
  useRendererShadows()

  const duckMaterial = useDuckMaterial(CAUSTIC_MAP_URL)
  const glassMaterial = useGlassMaterial(GLASS_MAP_URL)
  const groundMaterial = useGroundMaterial(GROUND_MAP_URL)

  const duckGltf = useGLTF(DUCK_MODEL_URL) as any

  const [modelChoice, setModelChoice] = useState<'duck' | 'glass'>('duck')

  const duckScene = useMemo(() => {
    const cloned = duckGltf.scene.clone(true) as Group
    cloned.scale.setScalar(0.5)
    const mesh = cloned.children?.[0] as Mesh
    if (mesh) {
      mesh.material = duckMaterial
      mesh.castShadow = true
    }
    return cloned
  }, [duckGltf.scene, duckMaterial])

  const glassPlane = useMemo(() => {
    const mesh = new Mesh(new PlaneGeometry(0.2, 0.2), glassMaterial)
    mesh.castShadow = true
    mesh.position.set(0, 0.1, 0)
    return mesh
  }, [glassMaterial])

  useFrame(() => {
    duckScene.rotation.y -= 0.01
  })

  return (
    <>
      <PerspectiveCamera makeDefault fov={25} near={0.025} far={5} position={[-0.5, 0.35, 0.2]} />
      <ambientLight intensity={0.2} />
      <spotLight
        position={[0.2, 0.3, 0.2]}
        intensity={1}
        angle={Math.PI / 6}
        penumbra={1}
        decay={2}
        distance={0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.003}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2, 2]} />
        <primitive object={groundMaterial} attach='material' />
      </mesh>

      <OrbitControls maxDistance={3} maxPolarAngle={Math.PI / 2} />

      <primitive object={duckScene} visible={modelChoice === 'duck'} />
      <primitive object={glassPlane} visible={modelChoice === 'glass'} />

      <SelectableUI selection={modelChoice} onChange={setModelChoice} />
    </>
  )
}

type SelectableUIProps = {
  selection: 'duck' | 'glass'
  onChange: (next: 'duck' | 'glass') => void
}

const SelectableUI = ({ selection, onChange }: SelectableUIProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        borderRadius: 8,
        fontSize: 12,
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: 4 }}>Model</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['duck', 'glass'].map((key) => (
          <button
            key={key}
            onClick={() => onChange(key as 'duck' | 'glass')}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: selection === key ? '#ffd700' : 'rgba(255,255,255,0.1)',
              color: selection === key ? '#1a1a1a' : '#fff',
              cursor: 'pointer',
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

useGLTF.preload(DUCK_MODEL_URL)
