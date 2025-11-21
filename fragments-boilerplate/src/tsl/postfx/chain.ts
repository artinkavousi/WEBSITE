import { Node } from '@/tsl/core/types';

// TSL Effects typically take a single props object: { input: Node, ...params }
export type PostFXPassFn = (props: any) => Node;

export interface PostFXChainConfig {
  passes: { fn: PostFXPassFn; params?: any }[];
}

/**
 * Composes multiple PostFX passes into a single Node.
 * @param input The initial input color/texture node.
 * @param config The chain configuration.
 */
export const composePostFX = (input: Node, config: PostFXChainConfig): Node => {
  let currentNode = input;

  if (import.meta.env.DEV) {
    console.debug('[composePostFX] total passes', config.passes.length)
  }

  for (const pass of config.passes) {
    if (import.meta.env.DEV) {
      console.debug(
        '[composePostFX] Executing pass',
        pass.fn.name || 'anonymous',
        'sample type:',
        currentNode && typeof (currentNode as any).sample,
      );
    }
    // Merge input node with params object
    currentNode = pass.fn({ input: currentNode, ...(pass.params || {}) });
  }

  return currentNode;
};

/**
 * Helper to create a simple chain configuration.
 */
export const createFXChain = (passes: { fn: PostFXPassFn; params?: any }[]): PostFXChainConfig => {
  return { passes };
};
