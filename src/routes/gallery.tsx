import { createFileRoute } from '@tanstack/react-router'
import { EnhancedGallery } from '@/components/gallery/EnhancedGallery'

export const Route = createFileRoute('/gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="app-root">
      <div className="app-background" />
      <EnhancedGallery />
    </div>
  )
}
