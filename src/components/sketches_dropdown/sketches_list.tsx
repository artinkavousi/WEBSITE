import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { sketchRegistry } from '@/engine/core/sketchRegistry'
import type { SketchMetadata } from '@/types/sketch'

interface SketchCardData {
  id: string
  title: string
  description: string
  url: string
  category: SketchMetadata['category']
  difficulty: SketchMetadata['difficulty']
}

export function SketchesList() {
  const sketches = useMemo<SketchCardData[]>(
    () =>
      sketchRegistry.map((sketch) => ({
        id: sketch.id,
        title: sketch.title,
        description: sketch.description,
        url: `/sketches/${sketch.id}`,
        category: sketch.category,
        difficulty: sketch.difficulty,
      })),
    [],
  )

  return (
    <div className='sketches-list'>
      <div className='sketches-list__grid'>
        {sketches.map((sketch) => (
          <Link key={sketch.id} to={sketch.url} className='dropdown-sketch-card'>
            <h3 className='sketch-card__title'>{sketch.title}</h3>
            <p className='sketch-card__description'>{sketch.description}</p>
            <div className='sketch-card__path'>
              {sketch.category} · {sketch.difficulty}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
