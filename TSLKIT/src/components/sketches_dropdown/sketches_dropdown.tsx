import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import './index.css'
import { sketches } from '@/sketches/registry'

type SketchInfo = {
  name: string
  path: string
  url: string
}
export function SketchesDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showSketches, setShowSketches] = useState(false)
  const [sketchList] = useState<SketchInfo[]>(
    sketches.map((sketch) => ({
      name: sketch.title,
      path: `/${sketch.path}`,
      url: `/sketches/${sketch.path}`,
    })),
  )

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
                  {sketchList.map((sketch) => (
                    <Link key={sketch.path} to={sketch.url} className='sketch-card'>
                      <h3 className='sketch-card__title'>{sketch.name}</h3>
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
