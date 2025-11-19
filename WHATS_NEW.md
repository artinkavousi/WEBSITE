# What's New in TSL WebGPU Engine

## Latest Update: Phase 2 & 3 Complete! 🎉

**Date**: November 19, 2025

### New Materials ✨

- **PBR Material**: Full physically-based rendering with 6 presets (plastic, aluminum, gold, copper, stone, paint)
- **Subsurface Scattering**: Translucent materials with 5 presets (skin, wax, marble, jade, leaf)

### New Post-FX 🌟

- **Bloom Effect**: High-quality glow with 5 intensity presets
- **Grain + Vignette**: Cinematic film effects with 5 style presets

### New Fields 🌊

- **Curl Noise Field**: Animated flowing patterns with divergence-free vector fields
- **SDF Visualization**: Distance-based procedural geometry with edge detection

### New Particle Visuals 🎆

- **Attractor System**: Gravitational force visualization with radial falloff
- **Flow Field**: Fluid-like motion following vector fields
- **Boids Flocking**: Swarm behavior with cohesion and separation
- **Swarm Intelligence**: Leader-following with orbital motion

### Interactive Controls 🎮

**Every single demo** now includes comprehensive Leva controls for real-time experimentation:
- Color pickers
- Value sliders
- Preset dropdowns
- Toggle switches
- Parameter ranges

### Enhanced Gallery 📚

- **20+ sketches** across 6 categories
- **Category filtering** (Materials, PostFX, Particles, Fields, Presets, Base)
- **Search functionality** by title and description
- **Featured showcase** section
- **Metadata system** (tags, difficulty, modules, author)
- **Modern UI** with responsive grid layout

---

## Quick Start

### View the Gallery

```bash
npm run dev
```

Then navigate to `http://localhost:5173/gallery`

### Try a Demo

Navigate to any sketch URL, for example:
- `/engine/materials/pbr_material` - PBR materials
- `/engine/fields/curl_noise_field` - Animated curl noise
- `/engine/particles/attractor_visual` - Attraction forces

### Customize Parameters

Every demo has a Leva control panel on the right side. Try:
1. Changing colors with the color picker
2. Adjusting sliders in real-time
3. Switching between presets
4. Toggling animation on/off

---

## Module Overview

### Engine Core (`/src/engine/core/`)
- `engineTypes.ts` - TypeScript interfaces for all engine components
- `engineConfig.ts` - Global configuration system
- `createEngineSketch.ts` - Sketch composition utility
- `sketchRegistry.ts` - Gallery CMS and metadata

### Materials (`/src/engine/materials/`)
- `basicLambert.ts` - Simple diffuse shading
- `phiMetal.ts` - Stylized metallic surfaces
- `pbrMaterial.ts` - Physically-based rendering
- `sssMaterial.ts` - Subsurface scattering

### Post-FX (`/src/engine/postfx/`)
- `bloomChain.ts` - Glow and light bloom
- `grainVignette.ts` - Film grain + vignette

### Fields (`/src/engine/fields/`)
- `curlNoise.ts` - Vector field generation
- `sdfPrimitives.ts` - Signed distance fields

### Sketches (`/src/sketches/engine/`)
- `materials/` - 4 material demos
- `postfx/` - 2 post-processing demos
- `fields/` - 2 field visualization demos
- `particles/` - 4 particle system visual demos

---

## Stats

### Code
- **~5200 lines** of new code (TypeScript + TSL + CSS + Docs)
- **28+ files** created
- **25+ presets** across all modules
- **12 interactive demos** with full Leva controls

### Features
- **6 material types** (Lambert, PhiMetal, PBR, SSS, + 2 PostFX)
- **2 field systems** (Curl Noise, SDF)
- **4 particle visualizations** (Attractor, Flow, Boids, Swarm)
- **1 professional gallery** with CMS

### Quality
- ✅ Type-safe throughout
- ✅ Fully documented
- ✅ Modular and reusable
- ✅ Zero critical linter errors
- ✅ Interactive and educational

---

## What's Next?

### Phase 4: Presets & Polish
- Hero showcase sketches
- Combined material + PostFX + particles
- Scene composition system
- Final polish and optimization

### Advanced Features (Future)
- GPU compute particle systems
- Advanced PostFX (DOF, motion blur, SSAO)
- Full SDF ray marching renderer
- Animation timeline
- Scene export/sharing

---

## Resources

### Documentation
- `DEVELOPMENT_PLAN_2025.md` - Full roadmap (5+ weeks)
- `PROJECT_STATUS.md` - Current state overview
- `QUICK_START_GUIDE.md` - Implementation guide
- `README_DEVELOPMENT.md` - Documentation index
- `PHASE2_COMPLETE.md` - Phase 2 details
- `PHASE3_COMPLETE.md` - Phase 3 details
- `SESSION_PROGRESS.md` - Development session report

### Key Files
- `package.json` - Dependencies (Three.js r181)
- `src/engine/core/engineTypes.ts` - Type definitions
- `src/engine/core/sketchRegistry.ts` - Gallery data
- `src/components/gallery/EnhancedGallery.tsx` - Gallery UI

---

## Getting Help

### Common Issues

**Q: Can't see WebGPU content?**  
A: Ensure you're using Chrome 113+ or Edge 113+. WebGPU is required.

**Q: Dev server won't start?**  
A: Run `npm install` to ensure dependencies are installed, then `npm run dev`.

**Q: Sketches not showing in gallery?**  
A: Check that sketch IDs in `sketchRegistry.ts` match file paths in `/src/sketches/`.

**Q: Leva controls not appearing?**  
A: Leva should auto-display on the right. Check browser console for errors.

### Need More?

- Check the `/DOCS/` folder for architecture and vision docs
- Review existing sketches for implementation patterns
- Read `QUICK_START_GUIDE.md` for step-by-step instructions

---

## Acknowledgments

Built on:
- **Three.js r181** - WebGPU + TSL support
- **fragments-boilerplate** - Project foundation
- **React Three Fiber** - React integration
- **Leva** - Interactive controls
- **Vite** - Build tooling

---

**Happy Creating! 🎨✨**

