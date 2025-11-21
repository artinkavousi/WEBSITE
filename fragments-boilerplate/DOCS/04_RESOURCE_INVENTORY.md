# Resource Inventory & Porting Status

## Priority 1: High-Impact Visuals
These should be ported first to demonstrate engine capabilities.

| Resource Name | Source | Target Path | Status |
| h | h | h | h |
| **PBR Material** | `three.js/examples/webgpu_material_x` | `tsl/materials/standard/pbr.ts` | ✅ Done |
| **Clearcoat/Glass** | `fluidglass-main` | `tsl/materials/glass/` | ✅ Done |
| **Attractor Particles** | `tsl-compute-particles` | `tsl/particles/emitters/attractor.ts` | ✅ Done |
| **Curl Noise Field** | `tsl-textures-main` | `tsl/fields/noise/curl.ts` | ✅ Done |
| **Bloom Chain** | `three.js/examples` | `tsl/postfx/passes/bloom_simple.ts` | ✅ Done (Basic) |

## Priority 2: Engine Utilities
Essential for building complex scenes.

| Resource Name | Source | Target Path | Status |
| h | h | h | h |
| **SDF Primitives** | `raymarching-tsl-main` | `tsl/fields/sdf/` | ✅ Done |
| **Flow Field** | `flow-master` | `tsl/fields/vectors/flow.ts` | ✅ Done |
| **Color Palettes** | `portfolio-main` | `tsl/utils/color/palettes.ts` | ✅ Done |

## Priority 3: Advanced Effects
"Nice to have" features for specific sketches.

| Resource Name | Source | Target Path | Status |
| h | h | h | h |
| **Fluid Sim** | `fluid-triangle-ANSCII` | `tsl/fields/simulation/fluid.ts` | ⏳ Pending |
| **Volumetrics** | `three.js/examples` | `tsl/effects/volumetric.ts` | ✅ Done (Simple) |
| **Boids/Swarm** | `tsl-compute-particles` | `tsl/particles/emitters/swarm.ts` | ✅ Done (Swarm) |

---

## Implementation Notes

### Post-Processing
Refactored into `src/tsl/postfx` with a chainable system.
Legacy effects are in `src/tsl/effects` but should be migrated.

### Noise
Consolidated in `src/tsl/fields/noise`.

### Examples
`pbr_demo`, `glass_demo`, `flow_demo`, `nebula_storm`, `swarm_demo` are working.
