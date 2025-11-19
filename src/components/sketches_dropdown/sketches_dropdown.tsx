import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { sketchesManifest } from '@/sketches/manifest'
import './index.css'

type SketchInfo = {
  name: string
  path: string
  url: string
  description?: string
}
export function SketchesDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showSketches, setShowSketches] = useState(false)
  const [sketches, setSketches] = useState<SketchInfo[]>([])

  useEffect(() => {
    const sketchesList: SketchInfo[] = sketchesManifest.map((sketch) => ({
      name: sketch.title,
      path: `/${sketch.slug}`,
      url: `/sketches/${sketch.slug}`,
      description: sketch.description,
    }))

    setSketches(sketchesList)
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
          Sketches
        </button>

        {showSketches && (
          <div className='sketches-dropdown'>
            <div className='sketches-dropdown__content'>
              <div className='sketches-list'>
                <div className='sketches-list__grid'>
                  {sketches.map((sketch) => (
                    <Link key={sketch.path} to={sketch.url} className='sketch-card'>
                      <h3 className='sketch-card__title'>{sketch.name}</h3>
                      {sketch.description ? (
                        <p className='sketch-card__description'>{sketch.description}</p>
                      ) : null}
                      <div className='sketch-card__path'>{sketch.path}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
