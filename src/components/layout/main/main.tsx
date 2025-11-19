import { useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export const Main = ({ className, children }: HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <main ref={ref} className={cn(className, 'tsl-webgpu-engine__main')}>
      {children}
    </main>
  )
}
