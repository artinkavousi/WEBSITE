/**
 * @sketch webgpu/centroid_sampling
 * @description WebGPU centroid sampling comparison adapted for R3F/TSL
 */

import { Html, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  MeshBasicNodeMaterial,
  NearestFilter,
  NoColorSpace,
  RGBAFormat,
  RepeatWrapping,
  UnsignedByteType,
  UVMapping,
} from 'three/webgpu'
import { Fn, texture, uv, varying } from 'three/tsl'

const faces = [
  [0, 1, 0.5, 1, 0.5, 0.5, 0, 0.5],
  [1, 1, 0.5, 1, 0.5, 0.5, 1, 0.5],
  [0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5],
  [1, 0, 0.5, 0, 0.5, 0.5, 1, 0.5],
]

const buildAtlasTexture = () => {
  const atlasCanvas = document.createElement('canvas')
  atlasCanvas.width = 16
  atlasCanvas.height = 16

  const ctx = atlasCanvas.getContext('2d')!
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 8, 8)

  ctx.fillStyle = 'green'
  ctx.fillRect(8, 0, 8, 8)

  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 8, 8, 8)

  ctx.fillStyle = 'yellow'
  ctx.fillRect(8, 8, 8, 8)

  const canvasTexture = new CanvasTexture(atlasCanvas)
  canvasTexture.colorSpace = NoColorSpace
  canvasTexture.mapping = UVMapping
  canvasTexture.wrapS = RepeatWrapping
  canvasTexture.wrapT = RepeatWrapping
  canvasTexture.magFilter = NearestFilter
  canvasTexture.minFilter = NearestFilter
  canvasTexture.format = RGBAFormat
  canvasTexture.type = UnsignedByteType

  return canvasTexture
}

const buildGeometry = (uvs: number[]) => {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3))
  geometry.setIndex([0, 1, 2, 2, 3, 0])
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2))
  return geometry
}

const samplingLabels = [
  'normal',
  'CENTROID',
  'SAMPLE',
  'flat first',
  'flat either',
] as const

type SamplingMode = (typeof samplingLabels)[number]

const interpolationShaders = (canvasTexture: CanvasTexture) => {
  const testUV = varying(uv(), 'testUV')

  const createShader = (type: number, sampling: number) =>
    Fn(() => {
      testUV.setInterpolation(type as any, sampling as any)
      return texture(canvasTexture, testUV).rgb
    })

  const withFlatFirstShader = createShader(1, 0)
  const withFlatEitherShader = createShader(1, 1)
  const withSampleShader = Fn(() => {
    testUV.setInterpolation(0 as any, 2 as any)
    return texture(canvasTexture, testUV).rgb
  })
  const withInterpolationShader = Fn(() => {
    testUV.setInterpolation(0 as any, 1 as any)
    return texture(canvasTexture, testUV).rgb
  })
  const withoutInterpolationShader = Fn(() => texture(canvasTexture, uv()).rgb)

  return {
    normal: withoutInterpolationShader,
    CENTROID: withInterpolationShader,
    SAMPLE: withSampleShader,
    'flat first': withFlatFirstShader,
    'flat either': withFlatEitherShader,
  }
}

export default () => undefined

export const Scene = () => {
  const canvasTexture = useMemo(() => buildAtlasTexture(), [])
  const shaders = useMemo(() => interpolationShaders(canvasTexture), [canvasTexture])
  const [sampling, setSampling] = useState<SamplingMode>('normal')

  const material = useMemo(() => new MeshBasicNodeMaterial({ colorNode: shaders[sampling]() }), [sampling, shaders])

  const grid = useMemo(() => {
    const meshes: JSX.Element[] = []
    const size = 5

    for (let x = -size; x < size; x++) {
      for (let y = -size; y < size; y++) {
        const faceUVs = faces[Math.floor(Math.random() * faces.length)]
        meshes.push(
          <mesh key={`${x}-${y}`} position={[x * 2, y * 2, 0]} geometry={buildGeometry(faceUVs)} material={material} />,
        )
      }
    }

    return meshes
  }, [material])

  useFrame(() => {
    material.colorNode = shaders[sampling]()
    material.needsUpdate = true
  })

  return (
    <>
      <PerspectiveCamera makeDefault fov={60} near={1} far={2100} position={[0, 0, 50]} />
      {grid}
      <Html position={[0, 0, 0]} center distanceFactor={50} style={{ pointerEvents: 'none' }}>
        <ControlPanel sampling={sampling} setSampling={setSampling} />
      </Html>
    </>
  )
}

type ControlPanelProps = {
  sampling: SamplingMode
  setSampling: (mode: SamplingMode) => void
}

const ControlPanel = ({ sampling, setSampling }: ControlPanelProps) => {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        borderRadius: 8,
        minWidth: 180,
        textAlign: 'left',
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 700 }}>Sampling</div>
      <select
        value={sampling}
        onChange={(e) => setSampling(e.target.value as SamplingMode)}
        style={{ width: '100%', padding: 6, borderRadius: 6, background: '#111', color: 'white' }}
      >
        {samplingLabels.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </div>
  )
}
