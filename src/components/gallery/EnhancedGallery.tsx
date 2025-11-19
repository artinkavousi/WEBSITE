/**
 * Enhanced Gallery Component with CMS capabilities
 * 
 * Features:
 * - Category-based organization
 * - Search and filtering
 * - Featured sketches showcase
 * - Metadata display
 * - Responsive grid layout
 */

import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  sketchRegistry,
  gallerySections,
  searchSketches,
  getSketchesByTag,
  getFeaturedSketches,
} from '@/engine/core/sketchRegistry'
import { SketchMetadata, SketchTag, SketchCategory } from '@/types/sketch'
import './enhanced-gallery.css'

/**
 * Sketch card component for displaying individual sketches
 */
const SketchCard = ({ sketch }: { sketch: SketchMetadata }) => {
  return (
    <Link
      to="/sketches/$"
      params={{ _splat: sketch.id }}
      className="sketch-card"
      data-featured={sketch.featured ? 'true' : 'false'}
    >
      <div className="sketch-card-image">
        {sketch.thumbnail ? (
          <img src={sketch.thumbnail} alt={sketch.title} />
        ) : (
          <div className="sketch-card-placeholder">
            <span className="sketch-category-badge">{sketch.category}</span>
          </div>
        )}
        {sketch.featured && <span className="featured-badge">★ Featured</span>}
      </div>
      
      <div className="sketch-card-content">
        <h3 className="sketch-title">{sketch.title}</h3>
        <p className="sketch-description">{sketch.description}</p>
        
        <div className="sketch-meta">
          <span className={`difficulty-badge difficulty-${sketch.difficulty}`}>
            {sketch.difficulty}
          </span>
          {sketch.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>

        {sketch.modules && sketch.modules.length > 0 && (
          <div className="sketch-modules">
            <span className="modules-label">Uses:</span>
            {sketch.modules.slice(0, 2).map((mod) => (
              <code key={mod} className="module-name">
                {mod}
              </code>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

/**
 * Gallery section component
 */
const GallerySection = ({
  title,
  description,
  sketches,
}: {
  title: string
  description?: string
  sketches: SketchMetadata[]
}) => {
  if (sketches.length === 0) return null

  return (
    <section className="gallery-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-description">{description}</p>}
        <span className="section-count">{sketches.length} sketches</span>
      </div>

      <div className="sketch-grid">
        {sketches.map((sketch) => (
          <SketchCard key={sketch.id} sketch={sketch} />
        ))}
      </div>
    </section>
  )
}

/**
 * Main enhanced gallery component
 */
export const EnhancedGallery = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SketchCategory | 'all'>('all')
  const [selectedTag, setSelectedTag] = useState<SketchTag | null>(null)

  // Filtered sketches based on search and filters
  const filteredSketches = useMemo(() => {
    let results = sketchRegistry

    // Apply search query
    if (searchQuery.trim()) {
      results = searchSketches(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter((s) => s.category === selectedCategory)
    }

    // Apply tag filter
    if (selectedTag) {
      results = results.filter((s) => s.tags.includes(selectedTag))
    }

    return results
  }, [searchQuery, selectedCategory, selectedTag])

  // Get all unique tags for filter
  const allTags = useMemo(() => {
    const tags = new Set<SketchTag>()
    sketchRegistry.forEach((s) => s.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const categories: Array<SketchCategory | 'all'> = [
    'all',
    'materials',
    'postfx',
    'particles',
    'fields',
    'presets',
    'base',
  ]

  return (
    <div className="enhanced-gallery">
      {/* Header */}
      <header className="gallery-header">
        <h1 className="gallery-title">TSL-WebGPU Engine Gallery</h1>
        <p className="gallery-subtitle">
          Explore {sketchRegistry.length} interactive WebGPU sketches showcasing
          materials, particles, post-processing, and more
        </p>
      </header>

      {/* Search and Filters */}
      <div className="gallery-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search sketches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {selectedTag && (
            <div className="active-filters">
              <span className="active-filter-label">Tag:</span>
              <button
                className="active-filter-badge"
                onClick={() => setSelectedTag(null)}
              >
                {selectedTag} ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || selectedCategory !== 'all' || selectedTag) && (
        <div className="results-info">
          Found {filteredSketches.length} sketches
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Gallery content */}
      <div className="gallery-content">
        {searchQuery || selectedCategory !== 'all' || selectedTag ? (
          // Filtered view: single grid
          filteredSketches.length > 0 ? (
            <div className="sketch-grid">
              {filteredSketches.map((sketch) => (
                <SketchCard key={sketch.id} sketch={sketch} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No sketches found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedTag(null)
                }}
                className="reset-filters-btn"
              >
                Clear all filters
              </button>
            </div>
          )
        ) : (
          // Default view: organized sections
          gallerySections.map((section) => (
            <GallerySection
              key={section.category}
              title={section.title}
              description={section.description}
              sketches={section.sketches}
            />
          ))
        )}
      </div>

      {/* Tag cloud */}
      <aside className="tag-cloud">
        <h3 className="tag-cloud-title">Browse by Tag</h3>
        <div className="tag-cloud-items">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`tag-cloud-item ${selectedTag === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}

