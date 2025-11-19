import { createFileRoute } from '@tanstack/react-router'
import { EnhancedGallery } from '@/components/gallery/EnhancedGallery'

export const Route = createFileRoute('/gallery')({
  component: RouteComponent,
})

/**
 * Gallery Route - Enhanced showcase with CMS capabilities
 * 
 * Features:
 * - Category-based organization
 * - Search and filtering
 * - Featured sketches showcase
 * - Metadata display
 * - Responsive grid layout
 */
function RouteComponent() {
  return <EnhancedGallery />
}
