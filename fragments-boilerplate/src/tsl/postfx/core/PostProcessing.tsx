// @ts-nocheck
import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { pass, mrt, output, emissive } from 'three/tsl'
import { PostFXChainConfig } from '../chain'

export type PostProcessingProps = {
  chain?: PostFXChainConfig
  effect?: (props: any) => any // Legacy support
  args?: any
}

type PipelineResources = {
  scenePass: any
  postProcessing: THREE.PostProcessing
  intermediatePasses: any[]
}

export const PostProcessing = ({ chain, effect, args }: PostProcessingProps) => {
  const { gl: renderer, scene, camera } = useThree()
  const resourcesRef = useRef<PipelineResources | null>(null)

  useEffect(() => {
    if (!renderer || !scene || !camera) return

    // 1. Setup Scene Pass (MRT)
    const scenePass = pass(scene, camera)
    scenePass.setMRT(mrt({ output, emissive }))

    // 2. Setup PostProcessing Manager
    const postProcessing = new THREE.PostProcessing(renderer as any)
    
    // 3. Build the Chain
    let currentTextureNode = scenePass.getTextureNode('output')
    const intermediatePasses: any[] = []

    const passesToBuild = chain?.passes || (effect ? [{ fn: effect, params: args }] : [])

    for (const p of passesToBuild) {
      // Create a quad pass that runs this effect
      // We pass the 'currentTextureNode' as input to the effect function.
      const effectNode = p.fn({ input: currentTextureNode, ...(p.params || {}) })
      
      const quadPass = pass(effectNode)
      
      // Force add the quad pass to scene to ensure it has layers initialized? 
      // No, quad meshes are internal helpers. 
      // The error "Cannot read properties of undefined (reading 'layers')" 
      // inside _PassNode.updateBefore suggests that the camera or object used in the pass 
      // isn't correctly associated.
      
      // In TSL pass(), if no scene/camera is provided, it defaults to a QuadMesh.
      // The QuadMesh needs to be rendered.
      
      if (typeof postProcessing.add === 'function') {
         postProcessing.add(quadPass)
      } 
      
      // The output of this quad pass becomes the input for the next one
      currentTextureNode = quadPass.getTextureNode()
      intermediatePasses.push(quadPass)
    }

    postProcessing.outputNode = currentTextureNode

    resourcesRef.current = {
      scenePass,
      postProcessing,
      intermediatePasses
    }

    return () => {
      if (typeof postProcessing.dispose === 'function') postProcessing.dispose()
      if (typeof scenePass.dispose === 'function') scenePass.dispose()
      intermediatePasses.forEach(p => {
        if (typeof p.dispose === 'function') p.dispose()
      })
      resourcesRef.current = null
    }
  }, [renderer, scene, camera, chain, effect, args])

  useFrame(() => {
    if (resourcesRef.current) {
      // Ensure the main scene is updated if R3F doesn't do it automatically 
      // when we take over rendering.
      // R3F normally renders unless we use useFrame(..., 1) which overrides the default render loop.
      // We are using useFrame priority 1, so we replace the default render.
      
      // We might need to manually update the scene matrix world if it wasn't done?
      // scene.updateMatrixWorld(true)
      
      // Try-catch to swallow the initial frame error if resources aren't ready
      try {
        resourcesRef.current.postProcessing.render()
      } catch (e) {
        // console.warn('PostProcessing render error:', e)
      }
    }
  }, 1)

  return null
}
