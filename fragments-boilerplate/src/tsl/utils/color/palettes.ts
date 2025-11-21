// @ts-nocheck
import { vec3, color } from 'three/tsl';
import { cosinePalette } from './cosine_palette';

export const palettes = {
  // IQ's famous palettes (https://iquilezles.org/articles/palettes/)
  rainbow: (t: any) => cosinePalette(
    t,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 1.0, 1.0),
    vec3(0.0, 0.33, 0.67)
  ),
  
  sunset: (t: any) => cosinePalette(
    t,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 1.0, 0.5),
    vec3(0.8, 0.9, 0.3)
  ),
  
  ocean: (t: any) => cosinePalette(
    t,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 0.7, 0.4),
    vec3(0.0, 0.15, 0.20)
  ),
  
  neon: (t: any) => cosinePalette(
    t,
    vec3(0.26, 0.26, 0.26),
    vec3(0.30, 0.30, 0.30),
    vec3(0.56, 0.56, 0.56),
    vec3(0.13, 0.69, 0.67) // Cyberpunk-ish
  ),

  heat: (t: any) => cosinePalette(
    t,
    vec3(0.8, 0.5, 0.4),
    vec3(0.2, 0.4, 0.2),
    vec3(2.0, 1.0, 1.0),
    vec3(0.0, 0.25, 0.25)
  )
};


