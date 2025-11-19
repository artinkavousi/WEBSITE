/**
 * Global engine configuration system.
 * Manages quality presets, feature toggles, and performance settings.
 */

/**
 * Complete engine configuration structure.
 * Controls renderer settings, particle limits, post-processing quality, and debug features.
 */
export interface EngineConfig {
  /** Renderer configuration */
  renderer: {
    /** Prefer WebGPU over WebGL when available */
    preferWebGPU: boolean
    /** Enable compute shader support */
    enableCompute: boolean
    /** Enable antialiasing */
    antialias: boolean
    /** Power preference hint for GPU selection */
    powerPreference: 'high-performance' | 'low-power' | 'default'
  }
  /** Particle system configuration */
  particles: {
    /** Maximum number of particles allowed */
    maxCount: number
    /** Default compute workgroup size (must be power of 2) */
    defaultWorkgroupSize: number
  }
  /** Post-processing configuration */
  postfx: {
    /** Enable post-processing globally */
    enabled: boolean
    /** Quality preset for post-processing effects */
    quality: 'low' | 'medium' | 'high'
  }
  /** Debug and development features */
  debug: {
    /** Show performance statistics */
    showStats: boolean
    /** Log performance metrics to console */
    logPerformance: boolean
  }
}

/**
 * Default engine configuration with recommended settings.
 * Optimized for high-quality rendering on modern hardware.
 */
export const defaultEngineConfig: EngineConfig = {
  renderer: {
    preferWebGPU: true,
    enableCompute: true,
    antialias: true,
    powerPreference: 'high-performance',
  },
  particles: {
    maxCount: 1000000, // 1M particles max
    defaultWorkgroupSize: 64,
  },
  postfx: {
    enabled: true,
    quality: 'high',
  },
  debug: {
    showStats: false,
    logPerformance: false,
  },
}

/**
 * Low-end hardware preset.
 * Reduced quality for better performance on older GPUs.
 */
export const lowEndConfig: Partial<EngineConfig> = {
  particles: {
    maxCount: 50000,
    defaultWorkgroupSize: 32,
  },
  postfx: {
    enabled: true,
    quality: 'low',
  },
}

/**
 * High-end hardware preset.
 * Maximum quality for powerful GPUs.
 */
export const highEndConfig: Partial<EngineConfig> = {
  particles: {
    maxCount: 2000000,
    defaultWorkgroupSize: 128,
  },
  postfx: {
    enabled: true,
    quality: 'high',
  },
}

// Internal state
let engineConfig: EngineConfig = { ...defaultEngineConfig }

/**
 * Get the current engine configuration.
 * @returns The active engine configuration
 * 
 * @example
 * ```typescript
 * const config = getEngineConfig()
 * console.log(`Max particles: ${config.particles.maxCount}`)
 * ```
 */
export const getEngineConfig = (): EngineConfig => engineConfig

/**
 * Update the engine configuration.
 * Merges the provided partial configuration with existing settings.
 * 
 * @param config - Partial configuration to merge
 * 
 * @example
 * ```typescript
 * // Enable debug mode
 * setEngineConfig({
 *   debug: { showStats: true, logPerformance: true }
 * })
 * 
 * // Apply low-end preset
 * setEngineConfig(lowEndConfig)
 * ```
 */
export const setEngineConfig = (config: Partial<EngineConfig>): void => {
  engineConfig = {
    ...engineConfig,
    ...config,
    renderer: { ...engineConfig.renderer, ...config.renderer },
    particles: { ...engineConfig.particles, ...config.particles },
    postfx: { ...engineConfig.postfx, ...config.postfx },
    debug: { ...engineConfig.debug, ...config.debug },
  }
}

/**
 * Reset engine configuration to defaults.
 * Useful for testing or resetting after applying presets.
 * 
 * @example
 * ```typescript
 * resetEngineConfig()
 * ```
 */
export const resetEngineConfig = (): void => {
  engineConfig = { ...defaultEngineConfig }
}

/**
 * Apply a quality preset based on detected hardware capabilities.
 * @param level - Quality level ('low' | 'medium' | 'high')
 * 
 * @example
 * ```typescript
 * // Auto-detect and apply preset
 * const gpuTier = detectGPUTier()
 * applyQualityPreset(gpuTier)
 * ```
 */
export const applyQualityPreset = (level: 'low' | 'medium' | 'high'): void => {
  switch (level) {
    case 'low':
      setEngineConfig(lowEndConfig)
      break
    case 'high':
      setEngineConfig(highEndConfig)
      break
    case 'medium':
    default:
      setEngineConfig(defaultEngineConfig)
      break
  }
}

