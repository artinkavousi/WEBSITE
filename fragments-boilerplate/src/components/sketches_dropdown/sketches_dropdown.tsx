import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import { getSketchEntries } from '@/sketches/registry'
import { SketchesList } from './sketches_list'
export function SketchesDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showSketches, setShowSketches] = useState(false)
  const sketches = useMemo(() => getSketchEntries(), [])

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
              <SketchesList sketches={sketches} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
