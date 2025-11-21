# Workflows & Porting Guide

## 1. Porting Resources from Inventory

### Step 1: Identification
Locate the resource in `INVENTORY/` (e.g., a cool particle system in `three.js-tsl-sandbox`).
Identify the core logic:
- Compute Shaders (WGSL or TSL `Fn`)
- Material Nodes
- Uniform updates

### Step 2: Extraction
Copy the relevant logic into a new file in `src/tsl/`.
- **Compute Logic** -> `src/tsl/particles/compute/` or `src/tsl/fields/`
- **Visual Logic** -> `src/tsl/materials/` or `src/tsl/effects/`

### Step 3: Adaptation (The "Direct Port" Rule)
**Do not rewrite the math.**
Adapt the *interface* to match our functional pattern, but keep the *algorithm* identical.

**Original (Class-based):**
```javascript
class CoolParticleSystem {
  constructor(count) { ... }
  update() { ... }
}
```

**Adapted (Functional):**
```typescript
// src/tsl/particles/emitters/cool_system.ts
export const createCoolParticles = (count: number) => {
  const initKernel = Fn(...)
  const updateKernel = Fn(...)
  return { initKernel, updateKernel, ... };
}
```

### Step 4: Verification
Create a sketch in `src/sketches/` that replicates the original demo.
- If the original had controls, add Leva controls.
- If the original had animation, ensure it animates.

---

## 2. Creating New Features

### The "Sketch-First" Workflow
1. **Plan:** Decide what you want to make (e.g., "A velvet material").
2. **Sketch:** Create `src/sketches/materials/velvet_dev.tsx`.
3. **Draft:** Write the TSL code directly inside the sketch file first.
4. **Refine:** Get it looking good.
5. **Extract:** Move the reusable TSL logic to `src/tsl/materials/standard/velvet.ts`.
6. **Clean:** Import the new module back into the sketch.

---

## 3. Working with git
- **Commit often.**
- **One feature per branch/PR** (even if working alone, it helps mental organization).
- **Update Index:** When you add a module, verify it's exported from the relevant `index.ts`.

---

## 4. Debugging TSL
- Use `node.log()` or `console.log(node)` to inspect the shader graph construction.
- If WebGPU crashes, check the browser console for WGSL validation errors.
- Use the `WebGPUScene` debug overlay (if available) to check render info.


