import { vec2 } from 'three/tsl';
import { createFXChain } from '@/tsl/postfx/chain';
import { chromaticAberrationEffect } from '@/tsl/postfx/passes/chromatic_aberration_effect';
import { vignetteEffect } from '@/tsl/postfx/passes/vignette_effect';
import { simpleBloomEffect } from '@/tsl/postfx/passes/bloom_simple';

export const postfx = {
  cinematic: createFXChain([
    { fn: chromaticAberrationEffect, params: { offset: 0.002, direction: vec2(1.0, 0.0) } },
  ]),
  
  glitchHeavy: createFXChain([
    { fn: chromaticAberrationEffect, params: { offset: 0.01, direction: vec2(1.0, 1.0) } },
    // We could add scanlines here once ported
  ]),
  
  clean: createFXChain([
    { fn: vignetteEffect, params: { smoothing: 0.5, exponent: 1.1 } }
  ]),

  dreamy: createFXChain([
    { fn: simpleBloomEffect, params: { threshold: 0.5, strength: 2.0, radius: 0.005 } },
  ])
};
