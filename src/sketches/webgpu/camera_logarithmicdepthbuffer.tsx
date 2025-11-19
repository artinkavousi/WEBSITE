/**
 * @sketch webgpu/camera_logarithmicdepthbuffer
 * @description Logarithmic depth buffer comparison rendered side-by-side with WebGPUScene
 */

import { PerspectiveCamera, useLoader } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type React from 'react'
import {
  Color,
  MathUtils,
  MeshPhongMaterial,
  PerspectiveCamera as ThreePerspectiveCamera,
  SphereGeometry,
} from 'three/webgpu'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import WebGPUScene from '@/components/canvas/webgpu_scene'

export const standalone = true
export default () => undefined

const HELVETIKER_FONT_URL =
  'https://raw.githubusercontent.com/mrdoob/three.js/r181/examples/fonts/helvetiker_regular.typeface.json'

const labeldata = [
  { size: 0.01, scale: 0.0001, label: 'microscopic (1µm)' },
  { size: 0.01, scale: 0.1, label: 'minuscule (1mm)' },
  { size: 0.01, scale: 1.0, label: 'tiny (1cm)' },
  { size: 1, scale: 1.0, label: 'child-sized (1m)' },
  { size: 10, scale: 1.0, label: 'tree-sized (10m)' },
  { size: 100, scale: 1.0, label: 'building-sized (100m)' },
  { size: 1000, scale: 1.0, label: 'medium (1km)' },
  { size: 10000, scale: 1.0, label: 'city-sized (10km)' },
  { size: 3400000, scale: 1.0, label: 'moon-sized (3,400 Km)' },
  { size: 12000000, scale: 1.0, label: 'planet-sized (12,000 km)' },
  { size: 1400000000, scale: 1.0, label: 'sun-sized (1,400,000 km)' },
  { size: 7.47e12, scale: 1.0, label: 'solar system-sized (50Au)' },
  { size: 9.4605284e15, scale: 1.0, label: 'gargantuan (1 light year)' },
  { size: 3.08567758e16, scale: 1.0, label: 'ludicrous (1 parsec)' },
  { size: 1e19, scale: 1.0, label: 'mind boggling (1000 light years)' },
]

const buildLabels = (font: any) => {
  const sphereGeometry = new SphereGeometry(0.5, 24, 12)

  return labeldata.map((entry, idx) => {
    const textGeo = new TextGeometry(entry.label, {
      font,
      size: entry.size,
      depth: entry.size / 2,
    })

    textGeo.computeBoundingSphere()
    textGeo.translate(-textGeo.boundingSphere!.radius, 0, 0)

    const materialColor = new Color().setHSL(Math.random(), 0.5, 0.5)
    const material = new MeshPhongMaterial({ color: materialColor, specular: new Color(0x050505), shininess: 50 })

    const groupZ = -entry.size * entry.scale

    return (
      <group key={`${entry.label}-${idx}`} position={[0, 0, groupZ]}>
        <mesh
          geometry={textGeo}
          material={material}
          scale={[entry.scale, entry.scale, entry.scale]}
          position={[0, entry.size / 4 * entry.scale, groupZ]}
        />
        <mesh
          geometry={sphereGeometry}
          material={material}
          position={[0, -entry.size / 4 * entry.scale, 0]}
          scale={entry.size * entry.scale}
        />
      </group>
    )
  })
}

type LogDepthViewProps = {
  logarithmicDepth: boolean
  mouse: { x: number; y: number }
  zoomState: { pos: number; speed: number; setPos: (value: number) => void; setSpeed: (value: number) => void }
}

const NEAR = 1e-6
const FAR = 1e27

const LogDepthView = ({ logarithmicDepth: _logarithmicDepth, mouse, zoomState }: LogDepthViewProps) => {
  const font = useLoader(FontLoader, HELVETIKER_FONT_URL)
  const labels = useMemo(() => buildLabels(font), [font])
  const cameraRef = useRef<ThreePerspectiveCamera>(null)

  useFrame(() => {
    if (!cameraRef.current) return

    const minzoom = labeldata[0].size * labeldata[0].scale * 1
    const maxzoom = labeldata[labeldata.length - 1].size * labeldata[labeldata.length - 1].scale * 100
    let damping = Math.abs(zoomState.speed) > 0.015 ? 0.95 : 1.0

    const zoom = MathUtils.clamp(Math.exp(zoomState.pos), minzoom, maxzoom)
    zoomState.setPos(Math.log(zoom))

    if ((zoom === minzoom && zoomState.speed < 0) || (zoom === maxzoom && zoomState.speed > 0)) {
      damping = 0.85
    }

    const nextSpeed = zoomState.speed * damping
    zoomState.setSpeed(nextSpeed)
    zoomState.setPos(zoomState.pos + nextSpeed)

    cameraRef.current.position.x = Math.sin(0.5 * Math.PI * (mouse.x - 0.5)) * zoom
    cameraRef.current.position.y = Math.sin(0.25 * Math.PI * (mouse.y - 0.5)) * zoom
    cameraRef.current.position.z = Math.cos(0.5 * Math.PI * (mouse.x - 0.5)) * zoom
    cameraRef.current.lookAt(0, 0, 0)
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef as any} makeDefault fov={50} near={NEAR} far={FAR} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 100, 100]} intensity={3} />
      {labels}
    </>
  )
}

export const Scene = () => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [split, setSplit] = useState(0.5)
  const [zoomPos, setZoomPos] = useState(-100)
  const [zoomSpeed, setZoomSpeed] = useState(0.015)

  const zoomState = {
    pos: zoomPos,
    speed: zoomSpeed,
    setPos: setZoomPos,
    setSpeed: setZoomSpeed,
  }

  const handleWheel = (e: React.WheelEvent) => {
    const amount = e.deltaY
    if (amount === 0) return
    const dir = amount / Math.abs(amount)
    setZoomSpeed(dir / 10)
  }

  return (
    <div
      style={{ display: 'flex', width: '100%', height: '100vh', position: 'relative' }}
      onMouseMove={(e) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })}
      onWheel={handleWheel}
    >
      <div style={{ width: `${split * 100}%`, height: '100%' }}>
        <WebGPUScene webgpuOptions={{ logarithmicDepthBuffer: false }} style={{ width: '100%', height: '100%' }}>
          <LogDepthView logarithmicDepth={false} mouse={mouse} zoomState={zoomState} />
        </WebGPUScene>
        <div style={{ position: 'absolute', bottom: '1em', width: '100%', textAlign: 'center', color: 'white' }}>
          normal z-buffer
        </div>
      </div>
      <div style={{ width: `${(1 - split) * 100}%`, height: '100%' }}>
        <WebGPUScene webgpuOptions={{ logarithmicDepthBuffer: true }} style={{ width: '100%', height: '100%' }}>
          <LogDepthView logarithmicDepth mouse={mouse} zoomState={zoomState} />
        </WebGPUScene>
        <div style={{ position: 'absolute', bottom: '1em', width: '100%', textAlign: 'center', color: 'white' }}>
          logarithmic z-buffer
        </div>
      </div>
      <input
        type='range'
        min={0.1}
        max={0.9}
        step={0.01}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: '40%' }}
      />
    </div>
  )
}
