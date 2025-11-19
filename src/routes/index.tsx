import { createFileRoute } from '@tanstack/react-router'
import { EnhancedGallery } from '@/components/gallery/EnhancedGallery'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="app-root">
      <div className="app-background" />
      <EnhancedGallery />
    </div>
  )
}
