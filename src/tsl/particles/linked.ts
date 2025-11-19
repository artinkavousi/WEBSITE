import {
  AdditiveBlending,
  DoubleSide,
  MeshBasicNodeMaterial,
  SpriteNodeMaterial,
  StorageBufferAttribute,
  StorageInstancedBufferAttribute,
} from 'three/webgpu'
import {
  If,
  PI2,
  float,
  instanceIndex,
  mix,
  mx_fractal_noise_vec3,
  sin,
  storage,
  timerDelta,
  tslFn,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'

export type LinkedParticleGraph = ReturnType<typeof createLinkedParticleGraph>

/**
 * Build the storage buffers, uniforms, and NodeMaterials used by the linked particles example.
 *
 * The original demo used two storage buffers (`vec4` positions/lifetimes and `vec3` velocities)
 * plus two storage-backed attributes for the link mesh (8 vertices per particle, position `vec4`
 * with opacity in `w` and `vec3` colors). Uniforms mirror the lil-gui controls from the source:
 *
 * - `uTimeScale`, `uParticleLifetime`, `uParticleSize`
 * - `uLinksWidth`, `uColorVariance`, `uColorRotationSpeed`, `uColorOffset`
 * - `uUseRGBShift`, `uUseAnamorphic`, `uUseBlur`
 * - turbulence controls: `turbFrequency`, `turbAmplitude`, `turbOctaves`, `turbLacunarity`, `turbGain`, `turbFriction`
 * - `uCamFadeThreshold` for camera-based fading
 *
 * @param {number} particleCount Number of particles to allocate (positions/velocities + 8 link vertices per particle)
 */
export function createLinkedParticleGraph(particleCount = 256) {
  const partPositionsAttr = new StorageInstancedBufferAttribute(particleCount, 4)
  const partVelocitiesAttr = new StorageInstancedBufferAttribute(particleCount, 3)

  const linkVerticesAttr = new StorageBufferAttribute(particleCount * 8, 4)
  const linkColorsAttr = new StorageBufferAttribute(particleCount * 8, 3)

  const partPositions = storage(partPositionsAttr, 'vec4', particleCount)
  const partVelocities = storage(partVelocitiesAttr, 'vec3', particleCount)
  const linkVertices = storage(linkVerticesAttr, 'vec4', linkVerticesAttr.count)
  const linkColors = storage(linkColorsAttr, 'vec3', linkColorsAttr.count)

  const uTimeScale = uniform(1.0)
  const uParticleSize = uniform(0.12)
  const uParticleLifetime = uniform(1.5)
  const uLinksWidth = uniform(0.01)
  const uColorVariance = uniform(2.0)
  const uColorRotationSpeed = uniform(1.0)
  const uColorOffset = uniform(0.0)
  const uUseRGBShift = uniform(1.0)
  const uUseAnamorphic = uniform(0.0)
  const uUseBlur = uniform(1.0)
  const uCamFadeThreshold = uniform(9.0)

  const turbFrequency = uniform(0.5)
  const turbAmplitude = uniform(0.5)
  const turbOctaves = uniform(2)
  const turbLacunarity = uniform(2.0)
  const turbGain = uniform(0.5)
  const turbFriction = uniform(0.01)

  const initParticles = tslFn(() => {
    const position = partPositions.element(instanceIndex)
    const velocity = partVelocities.element(instanceIndex)

    position.xyz.assign(vec3(0))
    position.w.assign(-1.0)
    velocity.assign(vec3(0))
  })().compute(particleCount)

  const updateParticles = tslFn(() => {
    const position = partPositions.element(instanceIndex)
    const velocity = partVelocities.element(instanceIndex)

    const dt = timerDelta(0.016).mul(uTimeScale)

    If(position.w.lessThanEqual(0.0), () => {
      position.xyz.assign(vec3(0))
      position.w.assign(1.0)
      velocity.assign(vec3(0))
    })

    const flow = mx_fractal_noise_vec3(position.xyz.mul(turbFrequency), turbOctaves, turbLacunarity, turbGain, turbAmplitude)
    velocity.addAssign(flow.mul(position.w.add(0.1)).mul(dt))
    velocity.mulAssign(turbFriction.oneMinus())
    position.xyz.assign(position.xyz.add(velocity.mul(dt)))

    position.w.subAssign(dt.mul(float(1.0).div(uParticleLifetime)))

    // write a simple ribbon quad into the link buffers (two triangles)
    const vOffset = instanceIndex.mul(8)
    const head = position.xyz
    const dir = velocity.normalize().mul(uLinksWidth.mul(100.0))
    const tangent = vec3(-dir.y, dir.x, 0.0)

    const p0 = linkVertices.element(vOffset)
    p0.xyz.assign(head.add(tangent))
    p0.w.assign(position.w)

    const p1 = linkVertices.element(vOffset.add(1))
    p1.xyz.assign(head.sub(tangent))
    p1.w.assign(position.w)

    const p2 = linkVertices.element(vOffset.add(2))
    p2.xyz.assign(head.add(dir).add(tangent))
    p2.w.assign(position.w)

    const p3 = linkVertices.element(vOffset.add(3))
    p3.xyz.assign(head.add(dir).sub(tangent))
    p3.w.assign(position.w)

    // mirrored strip
    const p4 = linkVertices.element(vOffset.add(4))
    p4.xyz.assign(head.sub(dir).add(tangent))
    p4.w.assign(position.w)

    const p5 = linkVertices.element(vOffset.add(5))
    p5.xyz.assign(head.sub(dir).sub(tangent))
    p5.w.assign(position.w)

    const p6 = linkVertices.element(vOffset.add(6))
    p6.xyz.assign(head.sub(tangent))
    p6.w.assign(position.w)

    const p7 = linkVertices.element(vOffset.add(7))
    p7.xyz.assign(head.add(tangent))
    p7.w.assign(position.w)

    const baseHue = mix(uColorOffset, uColorOffset.add(PI2), position.w)
    const col = vec3(
      sin(baseHue.add(uColorRotationSpeed)),
      sin(baseHue.mul(0.5)).add(1.0).mul(0.5),
      sin(baseHue.mul(1.5)).mul(0.5).add(0.5),
    ).mul(uColorVariance)

    linkColors.element(vOffset).assign(col)
    linkColors.element(vOffset.add(1)).assign(col)
    linkColors.element(vOffset.add(2)).assign(col)
    linkColors.element(vOffset.add(3)).assign(col)
    linkColors.element(vOffset.add(4)).assign(col)
    linkColors.element(vOffset.add(5)).assign(col)
    linkColors.element(vOffset.add(6)).assign(col)
    linkColors.element(vOffset.add(7)).assign(col)
  })().compute(particleCount)

  const spriteMaterial = new SpriteNodeMaterial({ transparent: true })
  spriteMaterial.positionNode = partPositions.toAttribute().xyz
  spriteMaterial.colorNode = vec3(1, 0.9, 0.8)
  spriteMaterial.scaleNode = uParticleSize
  spriteMaterial.alphaTestNode = float(1.0).sub(partPositions.toAttribute().w.max(0.0))
  spriteMaterial.alphaToCoverage = true
  spriteMaterial.depthWrite = false

  const linkMaterial = new MeshBasicNodeMaterial({
    transparent: true,
    side: DoubleSide,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  linkMaterial.colorNode = linkColors.toAttribute()
  linkMaterial.opacityNode = linkVertices.toAttribute().w.max(0.0)

  const gridColor = tslFn(() => {
    const uvCoord = uv().mul(6.0)
    const hex = uvCoord.floor().mod(2.0)
    const mask = hex.x.eq(hex.y).select(float(1.0), float(0.4))
    const bloom = mx_fractal_noise_vec3(uvCoord.xy.mul(0.1), 3, 2.0, 0.5, 0.25)
    return vec3(mask).mul(0.05).add(bloom.mul(0.4))
  })

  const linkedParticlesColor = tslFn(() => {
    const base = gridColor()
    const turbulence = mx_fractal_noise_vec3(uv().mul(turbFrequency), turbOctaves, turbLacunarity, turbGain, turbAmplitude)
    const vignette = uv()
      .sub(vec2(0.5))
      .length()
      .mul(2.0)
      .oneMinus()
      .max(0.0)
    const highlight = turbulence.abs().mul(uColorVariance)
    return base.add(highlight).mul(vignette)
  })

  return {
    particleCount,
    partPositionsAttr,
    partVelocitiesAttr,
    linkVerticesAttr,
    linkColorsAttr,
    partPositions,
    partVelocities,
    linkVertices,
    linkColors,
    initParticles,
    updateParticles,
    uniforms: {
      uTimeScale,
      uParticleLifetime,
      uParticleSize,
      uLinksWidth,
      uColorVariance,
      uColorRotationSpeed,
      uColorOffset,
      uUseRGBShift,
      uUseAnamorphic,
      uUseBlur,
      uCamFadeThreshold,
      turbFrequency,
      turbAmplitude,
      turbOctaves,
      turbLacunarity,
      turbGain,
      turbFriction,
    },
    spriteMaterial,
    linkMaterial,
    linkedParticlesColor,
  }
}
