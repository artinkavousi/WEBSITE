import { useRef } from 'react'
import { cn } from '@/utils/cn'
import { ControlDashboard } from '@/components/controls'

export const Main = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<any>(null)

  return (
    <main ref={ref} className={cn(className, 'fragments-boilerplate__main')}>
      {children}
      <ControlDashboard />
    </main>
  )
}
