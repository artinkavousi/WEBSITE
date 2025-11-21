import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { getSketchEntries, type SketchMeta } from '@/sketches/registry'

type SketchesListProps = {
  sketches?: SketchMeta[]
}

export function SketchesList({ sketches: sketchesProp }: SketchesListProps) {
  const sketches = useMemo(() => sketchesProp ?? getSketchEntries(), [sketchesProp])
  const grouped = useMemo(() => {
    const map = new Map<string, SketchMeta[]>()

    sketches.forEach((sketch) => {
      if (!map.has(sketch.category)) {
        map.set(sketch.category, [])
      }

      map.get(sketch.category)!.push(sketch)
    })

    return Array.from(map.entries())
  }, [sketches])

  return (
    <div className='sketches-list'>
      {grouped.map(([category, items]) => (
        <div key={category} className='sketches-category'>
          <p className='sketches-category__title'>{formatCategory(category)}</p>

          <div className='sketches-list__grid'>
            {items.map((sketch) => (
              <Link key={sketch.relativePath} to={sketch.url} className='sketch-card'>
                <h3 className='sketch-card__title'>{sketch.name}</h3>
                {sketch.description ? <p className='sketch-card__description'>{sketch.description}</p> : null}
                <div className='sketch-card__path'>/{sketch.relativePath}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatCategory(category: string) {
  if (category === 'root') return 'featured'
  return category.replace(/[-_]/g, ' ')
}
