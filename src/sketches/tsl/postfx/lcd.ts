/**
 * LCD PostFX Sketch
 *
 * Demonstrates the TSL lcdEffect helper over a simple gradient.
 */

import { Fn, screenSize, uv, vec3 } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { lcdEffect } from '@/tsl/post_processing/lcd_effect'

const lcdSketch = Fn(() => {
  const aspectUv = screenAspectUV(screenSize)
  const baseUv = uv()

  // Soft background gradient
  const gradient = vec3(
    baseUv.x.mul(0.6).add(0.2),
    baseUv.y.mul(0.5).add(0.25),
    baseUv.y.mul(0.3).add(0.4),
  )

  // LCD mask pattern (0–1)
  const lcd = lcdEffect({
    resolution: screenSize,
    scalar: 12,
    zoom: 2.0,
    exponent: 1.8,
    edge: 0.25,
  })

  // Mix gradient through LCD pattern
  const color = gradient.mul(lcd.mul(0.8).add(0.2))

  return color
})

export default lcdSketch


