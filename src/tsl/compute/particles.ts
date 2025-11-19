import {
  Fn,
  If,
  float,
  hash,
  instancedArray,
  instanceIndex,
  uv,
  vec2,
  vec3,
  uniform,
} from 'three/tsl'
import { Vector3 } from 'three'
import { SpriteNodeMaterial } from 'three/webgpu'

export type ComputeParticleGraph = ReturnType<typeof createComputeParticleGraph>

/**
 * Compute-driven particle graph extracted from the TSL compute example.
 *
 * Buffers: instanced `vec3` arrays for positions, velocities, and colors.
 * Uniforms: `gravity`, `bounce`, `friction`, `size`, and a `clickPosition` vec3 to push particles.
 *
 * @param {number} particleCount Number of particles to allocate
 */
export function createComputeParticleGraph(particleCount = 4096) {
  const gravity = uniform(-0.00098)
  const bounce = uniform(0.8)
  const friction = uniform(0.99)
  const size = uniform(0.12)

  const positions = instancedArray(particleCount, 'vec3')
  const velocities = instancedArray(particleCount, 'vec3')
  const colors = instancedArray(particleCount, 'vec3')

  const clickPosition = uniform(new Vector3(0, -1, 0))

  const amount = float(Math.sqrt(particleCount))
  const offset = amount.div(2)

  const initCompute = Fn(() => {
    const position = positions.element(instanceIndex)
    const color = colors.element(instanceIndex)

    const x = instanceIndex.mod(amount)
    const z = instanceIndex.div(amount)

    position.x = offset.sub(x).mul(0.2)
    position.z = offset.sub(z).mul(0.2)

    const randX = hash(instanceIndex)
    const randY = hash(instanceIndex.add(2))
    const randZ = hash(instanceIndex.add(3))

    color.assign(vec3(randX, randY.mul(0.5), randZ))
  })().compute(particleCount)

  const updateCompute = Fn(() => {
    const position = positions.element(instanceIndex)
    const velocity = velocities.element(instanceIndex)

    velocity.addAssign(vec3(0.0, gravity, 0.0))
    position.addAssign(velocity)
    velocity.mulAssign(friction)

    If(position.y.lessThan(0), () => {
      position.y = 0
      velocity.y = velocity.y.negate().mul(bounce)
      velocity.x = velocity.x.mul(0.9)
      velocity.z = velocity.z.mul(0.9)
    })
  }).compute(particleCount)

  const hitCompute = Fn(() => {
    const position = positions.element(instanceIndex)
    const velocity = velocities.element(instanceIndex)

    const dist = position.distance(clickPosition)
    const direction = position.sub(clickPosition).normalize()
    const distArea = float(3).sub(dist).max(0)

    const power = distArea.mul(0.01)
    const relativePower = power.mul(hash(instanceIndex).mul(1.5).add(0.5))

    velocity.assign(velocity.add(direction.mul(relativePower)))
  }).compute(particleCount)

  const material = new SpriteNodeMaterial()
  material.colorNode = uv().mul(colors.element(instanceIndex))
  material.positionNode = positions.toAttribute()
  material.scaleNode = size
  material.alphaTestNode = uv().mul(2).distance(vec2(1))
  material.alphaToCoverage = true
  material.transparent = false

  return {
    particleCount,
    uniforms: {
      gravity,
      bounce,
      friction,
      size,
      clickPosition,
    },
    positions,
    velocities,
    colors,
    initCompute,
    updateCompute,
    hitCompute,
    material,
  }
}
