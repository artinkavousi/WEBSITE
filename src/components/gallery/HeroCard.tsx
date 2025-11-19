import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { SketchMetadata } from '@/types/sketch'

export const HERO_GRADIENTS: Record<string, string> = {
  'engine/presets/cinematic_portrait': 'linear-gradient(135deg, #2b1b1f, #7a3d32)',
  'engine/presets/golden_glow': 'linear-gradient(135deg, #211306, #c08a2f)',
  'engine/presets/neon_metropolis': 'linear-gradient(135deg, #030b1f, #23e9ff)',
}

export const DEFAULT_HERO_GRADIENT = HERO_GRADIENTS['engine/presets/cinematic_portrait']

export const HeroCard = ({
  sketch,
  gradient,
}: {
  sketch: SketchMetadata
  gradient: string
}) => {
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
