import { Node } from 'three/tsl'
import { PostFXChain } from '../core/engineTypes'

/**
 * Combine multiple PostFX chains into a single chain.
 * Preserves pass order and composes their output functions.
 */
export const combinePostFXChains = (
  chains: Array<PostFXChain | undefined | null>
): PostFXChain | undefined => {
  const validChains = chains.filter((chain): chain is PostFXChain => Boolean(chain))

  if (!validChains.length) {
    return undefined
  }

  const combinedCompose = (input: Node): Node => {
    return validChains.reduce((result, chain) => {
      if (typeof chain.compose === 'function') {
        return chain.compose(result)
      }
      // Fallback: sequentially run pass processors
      if (chain.passes?.length) {
        return chain.passes.reduce((current, pass) => {
          if (pass.enabled === false) {
            return current
          }
          return pass.process(current)
        }, result)
      }
      return result
    }, input)
  }

  return {
    passes: validChains.flatMap((chain) => chain.passes ?? []),
    uniforms: validChains.reduce((acc, chain) => Object.assign(acc, chain.uniforms), {}),
    compose: combinedCompose,
  }
}

