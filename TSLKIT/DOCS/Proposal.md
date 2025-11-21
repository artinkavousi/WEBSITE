# TSLKIT Project Kickoff Prompt

## Context

You are building **TSLKIT** — a clean, modular, WebGPU-first TSL pipeline built on top of `fragments-boilerplate`.

### Foundation
- **Base:** Clone of `phobon/fragments-boilerplate` (WebGPU + TSL + R3F working foundation)
- **Knowledge Base:** `TSLKIT/DOCS/KNWLADGE RESOURCE/` contains TSL reference docs
- **Master Plan:** `TSLKIT/DOCS/TSLKIT-Complete-Documentation.md` is the implementation guide

### Core Philosophy
- **The project itself IS the engine** — no separate engine layer
- Keep `fragments-boilerplate` core intact (WebGPU scene, sketch routing, TSL folder)
- Extend and organize, don't reinvent
- Direct ports with minimal changes
- Every module needs a working sketch with proper controls

---

## Success Criteria for Phase 1

- [ ] `src/tsl/` has clean domain folder structure
- [ ] All existing TSL code moved to appropriate folders
- [ ] All imports fixed in sketches
- [ ] **App compiles with zero errors**
- [ ] **Existing sketches render identically to before**
- [ ] No broken functionality

## Key Constraints & Rules

### DO:
✓ Keep changes minimal and incremental
✓ Test after each step (compile + visual check)
✓ Preserve all existing behavior
✓ Follow existing code style from `fragments-boilerplate`
✓ Use TypeScript everywhere
✓ Import from `three/tsl` (not raw GLSL)

### DON'T:
✗ Rewrite working code "to make it better"
✗ Add new features yet (just reorganize)
✗ Change shader math or algorithms
✗ Break existing sketches
✗ Create docs unless explicitly needed 

---

## Reference Documentation

When implementing, consult:

1. **`TSLKIT-Complete-Documentation.md`** — Master implementation guide
2. **`TSL-COMPLETE-REFERENCE.md`** — TSL syntax and API reference  
3. **`TSL-GETTING-STARTED.md`** — TSL basics and patterns
4. **`Threejs Shading Language.md`** — Core TSL concepts

