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

import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  sketchRegistry,
  gallerySections,
  searchSketches,
} from '@/engine/core/sketchRegistry'
import { engineRegistry } from '@/engine/core/engineRegistry'
import { SketchMetadata, SketchTag, SketchCategory } from '@/types/sketch'
import './enhanced-gallery.css'

/**
 * Sketch card component for displaying individual sketches
 */
const categoryGradients: Record<SketchCategory | 'default', string> = {
  materials: 'linear-gradient(135deg, #4e4376, #2b5876)',
  postfx: 'linear-gradient(135deg, #42275a, #734b6d)',
  particles: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  fields: 'linear-gradient(135deg, #0b486b, #f56217)',
  presets: 'linear-gradient(135deg, #5433ff, #20bdff, #a5fecb)',
  base: 'linear-gradient(135deg, #3a6073, #16222a)',
  experimental: 'linear-gradient(135deg, #2c3e50, #fd746c)',
  showcase: 'linear-gradient(135deg, #000428, #004e92)',
  default: 'linear-gradient(135deg, #232526, #414345)',
}

const SketchCard = ({ sketch }: { sketch: SketchMetadata }) => {
  const placeholderGradient = categoryGradients[sketch.category] ?? categoryGradients.default
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>(
    sketch.thumbnail ? 'loading' : 'error',
  )

  const isLoading = imageStatus === 'loading' && Boolean(sketch.thumbnail)
  const isEmpty = !sketch.thumbnail || imageStatus === 'error'

  return (
    <Link
      to="/sketches/$"
      params={{ _splat: sketch.id }}
      className="sketch-card"
      data-featured={sketch.featured ? 'true' : 'false'}
    >
      <div
        className="sketch-card-image"
        data-loading={isLoading}
        data-empty={isEmpty}
      >
        {sketch.thumbnail && (
          <img
            src={sketch.thumbnail}
            alt={sketch.title}
            loading="lazy"
            onLoad={() => setImageStatus('loaded')}
            onError={() => setImageStatus('error')}
            className={`sketch-thumbnail ${imageStatus === 'loaded' ? 'is-visible' : ''}`}
          />
        )}

        {isEmpty && (
          <div
            className="sketch-card-placeholder"
            style={{ backgroundImage: placeholderGradient }}
            role="img"
            aria-label={`${sketch.title} thumbnail unavailable`}
          >
            <div className="sketch-placeholder-overlay" />
            <div className="sketch-placeholder-content">
              <span className="sketch-placeholder-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path
                    d="M4 5c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v14a1 1 0 0 1-1.64.77L14 16l-4.36 3.77A1 1 0 0 1 8 19V5H6a2 2 0 0 0-2 2v10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="15" cy="9" r="2" fill="currentColor" />
                </svg>
              </span>
              <div className="sketch-placeholder-text">
                <span className="sketch-category-badge">{sketch.category}</span>
                <span className="sketch-placeholder-title">{sketch.title}</span>
                <span className="sketch-placeholder-subtitle">Thumbnail unavailable</span>
              </div>
            </div>
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
type CategoryOption = SketchCategory | 'all'

export const EnhancedGallery = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('all')
  const [selectedTag, setSelectedTag] = useState<SketchTag | null>(null)

  const heroPresets = useMemo(
    () =>
      sketchRegistry.filter(
        (sketch) => sketch.category === 'presets' && sketch.featured,
      ),
    [],
  )

const heroGradients: Record<string, string> = {
  'engine/presets/cinematic_portrait': 'linear-gradient(135deg, #2b1b1f, #7a3d32)',
  'engine/presets/golden_glow': 'linear-gradient(135deg, #211306, #c08a2f)',
  'engine/presets/neon_metropolis': 'linear-gradient(135deg, #030b1f, #23e9ff)',
}

const HeroCard = ({ sketch, gradient }: { sketch: SketchMetadata; gradient: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame: number
    let t = 0

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const gradientFill = ctx.createLinearGradient(0, 0, width, height)
      gradientFill.addColorStop(0, `rgba(255, 255, 255, ${0.05 + 0.05 * Math.sin(t)})`)
      gradientFill.addColorStop(1, 'rgba(0, 0, 0, 0.25)')

      ctx.fillStyle = gradientFill
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + 0.02 * Math.sin(t * 1.5)})`
      ctx.lineWidth = 1 * (window.devicePixelRatio || 1)
      ctx.setLineDash([8, 18])

      ctx.beginPath()
      for (let x = -width; x < width * 2; x += 40) {
        const offset = (t * 12) % 40
        ctx.moveTo(x + offset, 0)
        ctx.lineTo(x + offset, height)
      }
      ctx.stroke()

      ctx.beginPath()
      for (let y = -height; y < height * 2; y += 40) {
        const offset = (t * 20) % 40
        ctx.moveTo(0, y + offset)
        ctx.lineTo(width, y + offset)
      }
      ctx.stroke()

      t += 0.004
      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * ratio
      canvas.height = canvas.clientHeight * ratio
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <Link
      to="/sketches/$"
      params={{ _splat: sketch.id }}
      className="hero-card"
      style={{ backgroundImage: gradient }}
    >
      <canvas ref={canvasRef} className="hero-card-canvas" />
      <div className="hero-card-overlay">
        <div className="hero-card-meta">
          <span className="hero-tag">{sketch.category}</span>
          <span className="hero-featured">★ Featured</span>
        </div>
        <h3>{sketch.title}</h3>
        <p>{sketch.description}</p>
        {sketch.modules && (
          <div className="hero-modules">
            {sketch.modules.slice(0, 3).map((module) => (
              <code key={module}>{module}</code>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

  // Filtered sketches based on search and filters
  const filteredSketches = useMemo(() => {
    let results = sketchRegistry

    if (searchQuery.trim()) {
      results = searchSketches(searchQuery)
    }

    if (selectedCategory !== 'all') {
      results = results.filter((s) => s.category === selectedCategory)
    }

    if (selectedTag) {
      results = results.filter((s) => s.tags.includes(selectedTag))
    }

    return results
  }, [searchQuery, selectedCategory, selectedTag])

  const allTags = useMemo(() => {
    const tags = new Set<SketchTag>()
    sketchRegistry.forEach((s) => s.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const uniqueCategories = Array.from(new Set(sketchRegistry.map((s) => s.category))).sort()
    return ['all', ...uniqueCategories]
  }, [])

  const categoryCounts = useMemo(() => {
    const counts = new Map<SketchCategory, number>()
    sketchRegistry.forEach((sketch) => {
      counts.set(sketch.category, (counts.get(sketch.category) ?? 0) + 1)
    })
    return counts
  }, [])

  const resourceSummaries = useMemo(
    () => Object.values(engineRegistry),
    [],
  )

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

      {heroPresets.length > 0 && (
        <section className="hero-showcase">
          <div className="hero-showcase-header">
            <div>
              <h2>Hero Presets</h2>
              <p>Portfolio-ready combinations of materials, fields, and postFX</p>
            </div>
            <span className="section-count">{heroPresets.length} featured presets</span>
          </div>
          <div className="hero-card-row">
            {heroPresets.map((sketch) => (
              <HeroCard key={sketch.id} sketch={sketch} gradient={heroGradients[sketch.id] ?? heroGradients['engine/presets/cinematic_portrait']} />
            ))}
          </div>
        </section>
      )}

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
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all'
                    ? 'All Categories'
                    : `${cat} (${categoryCounts.get(cat as SketchCategory) ?? 0})`}
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

      {/* Engine catalog overview */}
      <section className="engine-catalog">
        <div className="section-header">
          <h2 className="section-title">Engine Catalog</h2>
          <p className="section-description">
            Reference overview of materials, postFX, vector fields, particles, and presets available in the engine core.
          </p>
        </div>

        <div className="sketch-grid">
          {resourceSummaries.map((summary) => (
            <div key={summary.id} className="sketch-card engine-card">
              <div className="sketch-card-content">
                <h3 className="sketch-title">
                  {summary.title}
                  <span className="section-count">{summary.entries.length} modules</span>
                </h3>
                <p className="sketch-description">{summary.description}</p>
                <div className="sketch-modules">
                  <span className="modules-label">Examples:</span>
                  {summary.entries.slice(0, 3).map((entry) => (
                    <code key={entry.id} className="module-name">
                      {entry.title}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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

