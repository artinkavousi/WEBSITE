import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three/webgpu'
import type { Node } from '@/tsl/core/types'

type Vec3Tuple = [number, number, number]

export interface ComputeRunnerProps {
  initNode: Node
  updateNode: Node
  count: number
  workgroupSize?: number | Vec3Tuple
  workgroupCount?: number | Vec3Tuple
  autoInit?: boolean
}

const DEFAULT_WORKGROUP_SIZE: Vec3Tuple = [256, 1, 1]

const clampPositiveInt = (value?: number, fallback = 1) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return Math.max(1, Math.floor(fallback))
  }
  return Math.max(1, Math.floor(value))
}

const normalizeVec3 = (value: number | Vec3Tuple | undefined, fallback: Vec3Tuple): Vec3Tuple => {
  if (Array.isArray(value)) {
    return [
      clampPositiveInt(value[0], fallback[0]),
      clampPositiveInt(value[1], fallback[1]),
      clampPositiveInt(value[2], fallback[2]),
    ]
  }

  if (typeof value === 'number') {
    return [clampPositiveInt(value, fallback[0]), 1, 1]
  }

  return [...fallback] as Vec3Tuple
}

const deriveDispatchCounts = (totalThreads: number, size: Vec3Tuple, explicit?: number | Vec3Tuple): Vec3Tuple => {
  if (explicit !== undefined) {
    return normalizeVec3(explicit, [1, 1, 1])
  }

  const safeCount = Math.max(1, Math.floor(totalThreads))
  const x = Math.max(1, Math.ceil(safeCount / size[0]))
  return [x, 1, 1]
}

const buildComputeNode = (node: Node, size: Vec3Tuple, dispatch: Vec3Tuple) => {
  const workgroup = [...size] as Vec3Tuple
  const count = [...dispatch] as Vec3Tuple
  const computeNode = new THREE.ComputeNode(node, workgroup)
  computeNode.setCount(count)
  return computeNode
}

export function ComputeRunner({
  initNode,
  updateNode,
  count,
  workgroupSize,
  workgroupCount,
  autoInit = true,
}: ComputeRunnerProps) {
  const { gl } = useThree()

  const normalizedWorkgroupSize = useMemo(() => normalizeVec3(workgroupSize, DEFAULT_WORKGROUP_SIZE), [workgroupSize])

  const dispatchCounts = useMemo(
    () => deriveDispatchCounts(count, normalizedWorkgroupSize, workgroupCount),
    [count, normalizedWorkgroupSize, workgroupCount],
  )

  const initCompute = useMemo(
    () => buildComputeNode(initNode, normalizedWorkgroupSize, dispatchCounts),
    [initNode, normalizedWorkgroupSize, dispatchCounts],
  )

  const updateCompute = useMemo(
    () => buildComputeNode(updateNode, normalizedWorkgroupSize, dispatchCounts),
    [updateNode, normalizedWorkgroupSize, dispatchCounts],
  )

  useEffect(
    () => () => {
      initCompute.dispose()
      updateCompute.dispose()
    },
    [initCompute, updateCompute],
  )

  const initialized = useRef(false)

  useFrame(() => {
    // WebGPUScene ensures WebGPURenderer, but guard to avoid crashes if not ready yet.
    // @ts-ignore - renderer typing misses compute API in r181.
    if (typeof gl.compute !== 'function') {
      return
    }

    if (autoInit && !initialized.current) {
      // @ts-ignore
      gl.compute(initCompute)
      initialized.current = true
    }

    // @ts-ignore
    gl.compute(updateCompute)
  })

  return null
}

export default ComputeRunner
