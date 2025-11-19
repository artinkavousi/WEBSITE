import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import './index.css'
import { sketchRegistry } from '@/engine/core/sketchRegistry'
import type { SketchCategory, SketchMetadata } from '@/types/sketch'

type SketchInfo = {
  id: string
  title: string
  url: string
  category: SketchCategory
}

type CategoryGroup = {
  category: SketchCategory
  sketches: SketchInfo[]
}

const categoryLabels: Record<SketchCategory, string> = {
  base: 'Base Sketches',
  materials: 'Materials',
  postfx: 'Post FX',
  particles: 'Particle Systems',
  fields: 'Fields & SDF',
  presets: 'Hero Presets',
  experimental: 'Experimental',
  showcase: 'Featured',
}

const categoryOrder: SketchCategory[] = [
  'showcase',
  'base',
  'materials',
  'postfx',
  'particles',
  'fields',
  'presets',
  'experimental',
]

export function SketchesDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showSketches, setShowSketches] = useState(false)
  const groupedSketches = useMemo<CategoryGroup[]>(() => {
    const groups = new Map<SketchCategory, SketchInfo[]>()

    const appendSketch = (sketch: SketchMetadata, overrides?: Partial<SketchInfo>) => {
      const category = overrides?.category ?? sketch.category
      const entry: SketchInfo = {
        id: sketch.id,
        title: sketch.title,
        url: `/sketches/${sketch.id}`,
        category,
        ...overrides,
      }

      const current = groups.get(category) ?? []
      current.push(entry)
      groups.set(category, current)
    }

    sketchRegistry.forEach((sketch) => appendSketch(sketch))

    return categoryOrder
      .filter((category) => groups.has(category))
      .map((category) => ({
        category,
        sketches: (groups.get(category) ?? []).sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
      }))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSketches(false)
      }
    }

    if (showSketches) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSketches])

  return (
    <div className='sketches-overlay'>
      <div className='sketches-toggle' ref={dropdownRef}>
        <button onClick={() => setShowSketches(!showSketches)} className='sketches-toggle__button'>
          <span style={{ fontSize: '1.2em' }}>☰</span> Sketches
        </button>

        {showSketches && (
          <div className='sketches-dropdown'>
            <div className='sketches-dropdown__content'>
              {groupedSketches.map(({ category, sketches }) => (
                <div key={category} className='sketches-category'>
                  <h4 className='sketches-category__title'>
                    {categoryLabels[category] ?? category}
                  </h4>
                  <div className='sketches-list__grid'>
                    {sketches.map((sketch) => (
                      <Link key={sketch.id} to={sketch.url} className='dropdown-sketch-card'>
                        <h3 className='sketch-card__title'>{sketch.title}</h3>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
