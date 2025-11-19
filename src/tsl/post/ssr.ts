import { texture } from 'three/nodes'
import { DataTexture, RGBAFormat, UnsignedByteType } from 'three/webgpu'
import {
  blendColor,
  colorToDirection,
  directionToColor,
  diffuseColor,
  metalness,
  mrt,
  normalView,
  output,
  pass,
  roughness,
  sample,
  ssgi,
  ssr,
  traa,
  vec2,
  vec4,
} from 'three/tsl'

export type SsrGraph = ReturnType<typeof createSsrSsgiComposite>

/**
 * Build the SSR + SSGI composite used by the painter demo.
 *
 * Required attachments (match the original MRT layout):
 * - `output` (scene color)
 * - `diffuseColor`
 * - `normal` (as direction-encoded normal)
 * - `metalrough` (metalness in `r`, roughness in `g`)
 * - `depth`
 * - `velocity` (optional, used for TRAA)
 */
export function createSsrSsgiComposite(sceneTexture: ReturnType<typeof pass>, camera: any) {
  const scenePass = sceneTexture
  const scenePassColor = scenePass.getTextureNode('output')
  const scenePassDiffuse = scenePass.getTextureNode('diffuseColor')
  const scenePassDepth = scenePass.getTextureNode('depth')
  const scenePassNormal = scenePass.getTextureNode('normal')
  const scenePassMetalRough = scenePass.getTextureNode('metalrough')
  const scenePassVelocity = scenePass.getTextureNode('velocity')

  const sceneNormal = sample((uvCoord) => colorToDirection(scenePassNormal.sample(uvCoord)))

  const giPass = ssgi(scenePassColor, scenePassDepth, sceneNormal, camera)
  giPass.sliceCount.value = 2
  giPass.stepCount.value = 8
  giPass.aoIntensity.value = 1

  const ssrPass = ssr(
    scenePassColor,
    scenePassDepth,
    sceneNormal,
    scenePassMetalRough.r,
    scenePassMetalRough.g,
    camera,
  )
  ssrPass.maxDistance.value = 10
  ssrPass.blurQuality.value = 1
  ssrPass.thickness.value = 0.015
  ssrPass.resolutionScale = 0.5

  const gi = giPass.rgb
  const ao = giPass.a

  const sceneWithGi = vec4(scenePassColor.rgb.mul(ao), scenePassColor.a).add(
    vec4(scenePassDiffuse.rgb.mul(gi), 0.0),
  )
  const composite = blendColor(sceneWithGi, ssrPass)

  const outputNode = scenePassVelocity ? traa(composite, scenePassDepth, scenePassVelocity, camera) : composite

  return {
    giPass,
    ssrPass,
    outputNode,
    scenePass,
  }
}

/**
 * Convenience helper to create a self contained preview pass with simple gradients feeding SSR/SSGI.
 */
export function createPreviewPass(camera: any) {
  const solid = new DataTexture(new Uint8Array([0x88, 0xaa, 0xff, 0xff]), 1, 1, RGBAFormat, UnsignedByteType)
  solid.needsUpdate = true

  const fakeScene = pass(texture(solid) as any, camera)
  fakeScene.setMRT(
    mrt({
      output,
      diffuseColor,
      normal: directionToColor(normalView),
      metalrough: vec2(metalness, roughness),
      velocity: vec4(0, 0, 0, 0),
    }),
  )

  return createSsrSsgiComposite(fakeScene, camera)
}
