import { useContext, useEffect, useMemo, useRef } from 'react'
import { context as FiberContext } from '@react-three/fiber'
import { uniform } from 'three/tsl'
import { Vector3 } from 'three'

export const usePointerUniform = () => {
  const pointerVec = useMemo(() => new Vector3(), [])
  const pointerUniform = useMemo(() => uniform(new Vector3()), [])
  const store = useContext(FiberContext)
  const rafRef = useRef<number>(undefined)

  useEffect(() => {
    if (!store) return

    const updateFromStore = () => {
      const { pointer } = store.getState()
      pointerVec.set(pointer.x, pointer.y, 0)
      pointerUniform.value.copy(pointerVec)
      rafRef.current = requestAnimationFrame(updateFromStore)
    }

    updateFromStore()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [store, pointerVec, pointerUniform])

  useEffect(() => {
    // @ts-ignore - store check might be redundant if typed strictly, but needed for runtime safety
    if (store) return

    const handlePointerMove = (event: PointerEvent) => {
      const width = window.innerWidth || 1
      const height = window.innerHeight || 1
      pointerVec.set((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1, 0)
      pointerUniform.value.copy(pointerVec)
    }

    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [store, pointerVec, pointerUniform])

  return pointerUniform
}

