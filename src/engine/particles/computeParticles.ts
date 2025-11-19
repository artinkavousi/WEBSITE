import type {
  ParticleAttributeBuffer,
  ParticleCpuKernel,
  ParticleKernelContext,
  ParticleSystemConfig,
} from '../core/engineTypes'

interface AttributeInternal extends ParticleAttributeBuffer {
  name: string
  defaultValue: number | number[]
}

const DEFAULT_DELTA = 1 / 60

const hashString = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) + 1
}

const createSeededRandom = (seedValue: string): (() => number) => {
  let seed = hashString(seedValue) % 2147483647
  if (seed <= 0) seed += 2147483646

  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const createAttributeBuffer = (
  name: string,
  size: number,
  count: number,
  defaultValue: number | number[],
): AttributeInternal => {
  const array = new Float32Array(count * size)

  if (Array.isArray(defaultValue)) {
    for (let i = 0; i < count; i += 1) {
      const offset = i * size
      for (let j = 0; j < size; j += 1) {
        array[offset + j] = defaultValue[j] ?? 0
      }
    }
  } else {
    array.fill(defaultValue)
  }

  return { name, size, array, defaultValue }
}

export class ParticleRuntime {
  private readonly kernel: ParticleCpuKernel
  private readonly attributes: Record<string, AttributeInternal>
  private readonly attributeArrays: Record<string, ParticleAttributeBuffer>
  private readonly random: () => number
  private elapsedTime = 0

  constructor(private readonly config: ParticleSystemConfig) {
    if (!config.cpuKernel) {
      throw new Error(`Particle system "${config.name}" is missing a cpuKernel implementation.`)
    }

    this.kernel = config.cpuKernel
    this.random = createSeededRandom(config.name)
    this.attributes = Object.entries(config.attributes).reduce<Record<string, AttributeInternal>>(
      (acc, [key, descriptor]) => {
        acc[key] = createAttributeBuffer(key, descriptor.size, config.count, descriptor.default)
        return acc
      },
      {},
    )

    this.attributeArrays = Object.entries(this.attributes).reduce<
      Record<string, ParticleAttributeBuffer>
    >((acc, [key, attr]) => {
      acc[key] = { array: attr.array, size: attr.size }
      return acc
    }, {})

    this.initialize()
  }

  private initialize() {
    if (!this.kernel.init) {
      return
    }

    for (let i = 0; i < this.config.count; i += 1) {
      this.kernel.init(this.createContext(i, 0))
    }
  }

  private createContext(index: number, deltaTime: number): ParticleKernelContext {
    const getAttribute = (name: string): Float32Array => {
      const attr = this.attributes[name]
      if (!attr) {
        throw new Error(`Attribute "${name}" is not defined on system "${this.config.name}".`)
      }
      const offset = index * attr.size
      return attr.array.subarray(offset, offset + attr.size)
    }

    return {
      index,
      count: this.config.count,
      time: this.elapsedTime,
      deltaTime,
      random: this.random,
      getAttribute,
      attributeArrays: this.attributeArrays,
    }
  }

  step(deltaTime: number = DEFAULT_DELTA) {
    const dt = Number.isFinite(deltaTime) && deltaTime > 0 ? deltaTime : DEFAULT_DELTA
    this.elapsedTime += dt

    for (let i = 0; i < this.config.count; i += 1) {
      this.kernel.update(this.createContext(i, dt))
    }
  }

  getAttributeArray(name: string): Float32Array {
    const attr = this.attributes[name]
    if (!attr) {
      throw new Error(`Attribute "${name}" is not defined on system "${this.config.name}".`)
    }
    return attr.array
  }

  dispose() {
    Object.values(this.attributes).forEach((attr) => {
      attr.array.fill(0)
    })
  }
}

export const createParticleRuntime = (config: ParticleSystemConfig): ParticleRuntime => {
  return new ParticleRuntime(config)
}

