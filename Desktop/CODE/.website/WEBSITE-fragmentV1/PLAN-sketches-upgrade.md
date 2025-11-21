# Sketches System Upgrade Plan

## Vision
To create a sleek, modular, and self-contained system for WebGPU sketches where each module manages its own configuration, controls, and environment, wrapped in a high-quality "Glassmorphism" UI.

## Core Architecture

### 1. The "Sketch Module" Pattern
Each sketch will be a self-contained module (single file or folder) exporting:
- **`Sketch`**: The React component containing the 3D logic.
- **`Config`**: A schema object defining:
  - `controls`: Leva-compatible schema for UI knobs.
  - `settings`: Environment defaults (camera position, lights, post-fx toggles).
  - `meta`: Title, description, tags.

### 2. `SketchWrapper` (The Universal Template)
A new high-level component that abstracts the boilerplate:
- **Environment Setup**: Initializes `WebGPUScene`, Camera, Lights based on `Config`.
- **Control Generation**: Automatically generates the Leva panel from `Config.controls`.
- **State Injection**: Passes control values into the `Sketch` component.
- **UI Layout**: Renders the Glassmorphic Control Panel.

### 3. Glassmorphic Control Panel
- customization of the Leva panel to use a glass effect (backdrop-filter, translucent backgrounds, refined typography).
- centralized theme definition.

## Implementation Roadmap

### Phase 1: Foundation
- [ ] **Create `SketchWrapper`**: Build the container component that accepts `component` and `config`.
- [ ] **Implement `GlassPanel`**: Create the custom Leva theme/wrapper.
- [ ] **Refactor `NebulaStorm`**: Convert the hero sketch to the new `SketchModule` pattern.
- [ ] **Remove Global Store**: Deprecate `useControlStore` in favor of per-sketch local state/Leva.

### Phase 2: Migration & Cleanup
- [ ] Migrate other existing sketches (particles, materials) to the new pattern.
- [ ] Delete the old `useControlStore`.

### Phase 3: Advanced Features (Future)
- [ ] Add "Snapshot/Export" features to the control panel.
- [ ] Add automated "Tour" mode that cycles through presets.

## Example Structure

```tsx
// sketches/hero/nebula_storm.tsx

export const Config = {
  meta: { name: "Nebula Storm", description: "..." },
  controls: {
    speed: { value: 1.5, min: 0, max: 5 },
    color: { value: '#ff0000' }
  },
  settings: {
    camera: { position: [0, 0, 10] }
  }
}

export function Sketch({ speed, color }) {
  // ... standard three.js/react-three-fiber code using props ...
  return <mesh ... />
}
```

