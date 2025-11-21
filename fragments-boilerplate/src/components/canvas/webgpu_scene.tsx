import { Canvas, extend } from '@react-three/fiber'

import { AdaptiveDpr, Preload, StatsGl, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'

import { MeshPhysicalNodeMaterial, MeshStandardNodeMaterial, MeshBasicNodeMaterial, WebGPURenderer } from 'three/webgpu'
import { ColorSpaceCorrection } from './color_space_correction'

extend({ MeshPhysicalNodeMaterial, MeshStandardNodeMaterial, MeshBasicNodeMaterial })

type SceneProps = {
  debug?: boolean
  frameloop?: 'always' | 'demand' | 'never'
} & any

/**
 * WebGPUScene
 *
 * Renders a three.js scene using the WebGPURenderer inside a @react-three/fiber Canvas.
 *
 * @param {SceneProps} props - Scene configuration props
 * @param {boolean} [props.debug=false] - Show WebGL stats overlay
 * @param {'always'|'demand'|'never'} [props.frameloop='always'] - Canvas render loop mode
 * @param {boolean} [props.orthographic=false] - Use orthographic camera (not currently used)
 * @param {React.ReactNode} props.children - Scene children
 * @returns {JSX.Element}
 *
 * Notes:
 * - Uses WebGPURenderer (three.js) for next-gen rendering
 * - Handles color space and tone mapping for WebGPU
 * - Preloads assets and adapts DPR
 */
const WebGPUScene = ({ debug = false, frameloop = 'always', orthographic = true, children, ...props }: SceneProps) => {
  return (
    <Canvas
      id='__webgpucanvas'
      // TODO: flat and linear together breaks webgpu renderer
      // flat // Uses NoToneMapping as opposed to ACESFilmicToneMapping
      // linear // Disables automatic sRGB color space and gamma correction
      {...props}
      frameloop={frameloop}
      gl={async (props) => {
        const renderer = new WebGPURenderer(props as any)

        await renderer.init()

        return renderer
      }}
    >
      <Preload all />

      <AdaptiveDpr />

      {children}

      <ColorSpaceCorrection />

      {debug ? <StatsGl className='fragments-supply__statsgl' /> : null}

      {orthographic ? (
        <OrthographicCamera makeDefault position={[0, 0, 1]} />
      ) : (
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      )}
    </Canvas>
  )
}

export default WebGPUScene
