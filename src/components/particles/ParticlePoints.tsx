import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { ParticleSystemConfig } from '@/engine/core/engineTypes'
import { createParticleRuntime } from '@/engine/particles/computeParticles'
import type { BufferAttribute, BufferGeometry } from 'three'

type ParticlePointsProps = {
  system: ParticleSystemConfig
  color?: string
  size?: number
  opacity?: number
}

export const ParticlePoints = ({
  system,
  color = '#ffffff',
  size = 0.035,
  opacity = 0.9,
}: ParticlePointsProps) => {
  const runtime = useMemo(() => createParticleRuntime(system), [system])
  const geometryRef = useRef<BufferGeometry>(null)
  const positions = runtime.getAttributeArray('position')

  useFrame((_, delta) => {
    runtime.step(delta)
    const geometry = geometryRef.current
    if (!geometry) return

    const positionAttr = geometry.getAttribute('position') as BufferAttribute | null
    if (positionAttr) {
      positionAttr.needsUpdate = true
    }
  })

  useEffect(() => () => runtime.dispose(), [runtime])

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach='attributes-position'
          array={positions}
          count={system.count}
          itemSize={system.attributes.position?.size ?? 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  )
}

