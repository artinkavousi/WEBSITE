/**
 * Engine Configuration System
 * 
 * Global configuration and settings for the TSL-WebGPU Engine.
 * Provides sensible defaults and allows runtime configuration changes.
 */

/**
 * Complete engine configuration interface.
 */
export interface EngineConfig {
  /** Renderer settings */
  renderer: {
    /** Prefer WebGPU over WebGL when available */
    preferWebGPU: boolean
    
    /** Enable compute shader support */
    enableCompute: boolean
    
    /** Enable antialiasing */
    antialias: boolean
    
    /** Power preference for GPU selection */
    powerPreference: 'high-performance' | 'low-power' | 'default'
    
    /** Enable automatic tone mapping */
    toneMapping: boolean
    
    /** Pixel ratio (1 = native, 0.5 = half, 2 = double) */
    pixelRatio?: number
  }
  
  /** Particle system settings */
  particles: {
    /** Maximum number of particles across all systems */
    maxCount: number
    
    /** Default compute workgroup size */
    defaultComputeWorkgroupSize: number
    
    /** Enable particle LOD (reduce count at distance) */
    enableLOD: boolean
    
    /** Enable frustum culling for particles */
    enableFrustumCulling: boolean
  }
  
  /** Post-processing settings */
  postfx: {
    /** Global enable/disable for all post-FX */
    enabled: boolean
    
    /** Quality preset */
    quality: 'low' | 'medium' | 'high' | 'ultra'
    
    /** Resolution scale for post-FX (1 = full res, 0.5 = half res) */
    resolutionScale: number
    
    /** Enable individual passes */
    enableBloom: boolean
    enableDOF: boolean
    enableMotionBlur: boolean
  }
  
  /** Performance settings */
  performance: {
    /** Target frame rate (0 = unlimited) */
    targetFPS: number
    
    /** Enable adaptive quality */
    adaptiveQuality: boolean
    
    /** Minimum FPS before quality reduction */
    minFPS: number
    
    /** Maximum frame time in milliseconds */
    maxFrameTime: number
  }
  
  /** Debug settings */
  debug: {
    /** Show performance stats overlay */
    showStats: boolean
    
    /** Log performance metrics to console */
    logPerformance: boolean
    
    /** Show wireframes */
    showWireframes: boolean
    
    /** Log shader compilation */
    logShaders: boolean
    
    /** Enable verbose logging */
    verbose: boolean
  }
}

/**
 * Default engine configuration.
 * These are sensible defaults for most use cases.
 */
export const defaultEngineConfig: EngineConfig = {
  renderer: {
    preferWebGPU: true,
    enableCompute: true,
    antialias: true,
    powerPreference: 'high-performance',
    toneMapping: true,
    pixelRatio: undefined, // Will use window.devicePixelRatio
  },
  
  particles: {
    maxCount: 1000000,
    defaultComputeWorkgroupSize: 64,
    enableLOD: false,
    enableFrustumCulling: false,
  },
  
  postfx: {
    enabled: true,
    quality: 'high',
    resolutionScale: 1.0,
    enableBloom: true,
    enableDOF: true,
    enableMotionBlur: false,
  },
  
  performance: {
    targetFPS: 60,
    adaptiveQuality: false,
    minFPS: 30,
    maxFrameTime: 33, // ~30 FPS
  },
  
  debug: {
    showStats: false,
    logPerformance: false,
    showWireframes: false,
    logShaders: false,
    verbose: false,
  },
}

/**
 * Quality presets for different hardware capabilities.
 */
export const qualityPresets: Record<'low' | 'medium' | 'high' | 'ultra', Partial<EngineConfig>> = {
  low: {
    renderer: {
      antialias: false,
      pixelRatio: 1,
    },
    particles: {
      maxCount: 100000,
      enableLOD: true,
    },
    postfx: {
      quality: 'low',
      resolutionScale: 0.5,
      enableDOF: false,
      enableMotionBlur: false,
    },
  },
  
  medium: {
    renderer: {
      antialias: true,
      pixelRatio: 1,
    },
    particles: {
      maxCount: 500000,
      enableLOD: false,
    },
    postfx: {
      quality: 'medium',
      resolutionScale: 0.75,
      enableDOF: true,
      enableMotionBlur: false,
    },
  },
  
  high: {
    renderer: {
      antialias: true,
      pixelRatio: undefined,
    },
    particles: {
      maxCount: 1000000,
      enableLOD: false,
    },
    postfx: {
      quality: 'high',
      resolutionScale: 1.0,
      enableDOF: true,
      enableMotionBlur: true,
    },
  },
  
  ultra: {
    renderer: {
      antialias: true,
      pixelRatio: 2,
    },
    particles: {
      maxCount: 2000000,
      enableLOD: false,
    },
    postfx: {
      quality: 'ultra',
      resolutionScale: 1.0,
      enableDOF: true,
      enableMotionBlur: true,
    },
  },
}

// ============================================================================
// Configuration Management
// ============================================================================

/** Current engine configuration (starts with defaults) */
let engineConfig: EngineConfig = { ...defaultEngineConfig }

/**
 * Get the current engine configuration.
 * @returns Current engine config
 */
export const getEngineConfig = (): EngineConfig => engineConfig

/**
 * Update engine configuration with partial changes.
 * Deep merges the provided config with current config.
 * 
 * @param config - Partial configuration to merge
 * 
 * @example
 * ```ts
 * setEngineConfig({
 *   debug: { showStats: true },
 *   postfx: { quality: 'medium' }
 * })
 * ```
 */
export const setEngineConfig = (config: Partial<EngineConfig>): void => {
  engineConfig = deepMerge(engineConfig, config)
  
  if (engineConfig.debug.verbose) {
    console.log('[Engine] Configuration updated:', config)
  }
}

/**
 * Apply a quality preset to the engine configuration.
 * 
 * @param preset - Quality preset name
 * 
 * @example
 * ```ts
 * applyQualityPreset('medium')
 * ```
 */
export const applyQualityPreset = (preset: 'low' | 'medium' | 'high' | 'ultra'): void => {
  const presetConfig = qualityPresets[preset]
  setEngineConfig(presetConfig)
  
  if (engineConfig.debug.verbose) {
    console.log(`[Engine] Applied ${preset} quality preset`)
  }
}

/**
 * Reset engine configuration to defaults.
 */
export const resetEngineConfig = (): void => {
  engineConfig = { ...defaultEngineConfig }
  
  if (engineConfig.debug.verbose) {
    console.log('[Engine] Configuration reset to defaults')
  }
}

/**
 * Get a specific configuration value by path.
 * 
 * @param path - Dot-notation path to config value
 * @returns Configuration value
 * 
 * @example
 * ```ts
 * const showStats = getConfigValue('debug.showStats')
 * const maxCount = getConfigValue('particles.maxCount')
 * ```
 */
export const getConfigValue = (path: string): any => {
  const parts = path.split('.')
  let value: any = engineConfig
  
  for (const part of parts) {
    value = value?.[part]
    if (value === undefined) break
  }
  
  return value
}

/**
 * Set a specific configuration value by path.
 * 
 * @param path - Dot-notation path to config value
 * @param value - Value to set
 * 
 * @example
 * ```ts
 * setConfigValue('debug.showStats', true)
 * setConfigValue('postfx.quality', 'high')
 * ```
 */
export const setConfigValue = (path: string, value: any): void => {
  const parts = path.split('.')
  const lastPart = parts.pop()!
  let target: any = engineConfig
  
  for (const part of parts) {
    if (!(part in target)) {
      target[part] = {}
    }
    target = target[part]
  }
  
  target[lastPart] = value
  
  if (engineConfig.debug.verbose) {
    console.log(`[Engine] Set ${path} =`, value)
  }
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Deep merge two objects.
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]
    
    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue as any, sourceValue as any) as any
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as any
    }
  }
  
  return result
}

/**
 * Check if value is a plain object.
 * @param value - Value to check
 * @returns True if plain object
 */
function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Log current configuration to console (formatted).
 * Useful for debugging.
 */
export const logConfig = (): void => {
  console.log('[Engine] Current Configuration:')
  console.table(engineConfig)
}

/**
 * Export configuration as JSON string.
 * @returns JSON string of current config
 */
export const exportConfig = (): string => {
  return JSON.stringify(engineConfig, null, 2)
}

/**
 * Import configuration from JSON string.
 * @param json - JSON string of configuration
 */
export const importConfig = (json: string): void => {
  try {
    const config = JSON.parse(json)
    setEngineConfig(config)
  } catch (error) {
    console.error('[Engine] Failed to import configuration:', error)
  }
}

