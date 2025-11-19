/**
 * @module fields/curlNoise
 * @description Curl Noise vector field for fluid-like particle motion
 * 
 * Generates divergence-free vector fields using curl of a potential field.
 * Perfect for organic, fluid-like motion without sources or sinks.
 */

import { Fn, vec3, uniform } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import type { VectorField } from '../core/engineTypes'

export interface CurlNoiseConfig {
  /** Time offset for animation */
  time?: number
  /** Spatial frequency of noise */
  frequency?: number
  /** Amplitude of curl vectors */
  amplitude?: number
  /** Epsilon for numerical curl calculation */
  epsilon?: number
}

/**
 * Create a curl noise vector field
 * 
 * Uses numerical curl calculation on simplex noise to generate divergence-free flow.
 */
export const createCurlNoise = (config: CurlNoiseConfig = {}): VectorField => {
  const {
    time = 0,
    frequency = 1.0,
    amplitude = 1.0,
    epsilon = 0.01
  } = config

  const uTime = uniform(time)
  const uFrequency = uniform(frequency)
  const uAmplitude = uniform(amplitude)
  const uEpsilon = uniform(epsilon)

  // Note: This returns a static field node.
  // In full implementation, this would be a function node that takes position parameter.
  // For now, this is a placeholder structure.
  
  const fieldNode = Fn(() => {
    // Simple curl-like vector field using noise
    // This is a simplified version - full curl would require position input
    const p = vec3(0).mul(uFrequency).add(vec3(uTime, uTime.mul(0.7), uTime.mul(0.5)))
    
    // Sample noise at offset positions for pseudo-curl
    const eps = uEpsilon
    const n1 = simplexNoise3d(p.add(vec3(eps, 0, 0)))
    const n2 = simplexNoise3d(p.add(vec3(0, eps, 0)))
    const n3 = simplexNoise3d(p.add(vec3(0, 0, eps)))
    
    // Create a vector field
    const curlVec = vec3(n2.sub(n3), n3.sub(n1), n1.sub(n2))
    
    return curlVec.mul(uAmplitude)
  })()

  return {
    name: 'CurlNoise',
    fieldNode,
    uniforms: {
      uTime,
      uFrequency,
      uAmplitude,
      uEpsilon
    }
  }
}

/**
 * Preset configurations
 */
export const curlNoisePresets = {
  gentle: {
    frequency: 0.8,
    amplitude: 0.5
  },
  turbulent: {
    frequency: 2.0,
    amplitude: 1.5
  },
  ethereal: {
    frequency: 0.5,
    amplitude: 0.8
  },
  chaotic: {
    frequency: 3.0,
    amplitude: 2.0
  }
} as const
