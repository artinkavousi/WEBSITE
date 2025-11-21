// @ts-nocheck
import { color, float } from 'three/tsl';
import { pbrMaterial } from '@/tsl/materials/standard/pbr';
import { velvetMaterial } from '@/tsl/materials/standard/velvet';
import { carPaintMaterial } from '@/tsl/materials/standard/car_paint';
import { glassMaterial } from '@/tsl/materials/glass/dispersion';

export const materials = {
  metals: {
    gold: pbrMaterial({
      baseColor: color('#ffcc00'),
      metalness: 1.0,
      roughness: 0.15,
    }),
    chrome: pbrMaterial({
      baseColor: color('#ffffff'),
      metalness: 1.0,
      roughness: 0.0,
    }),
    brushedSteel: pbrMaterial({
      baseColor: color('#aaaaaa'),
      metalness: 0.9,
      roughness: 0.4,
    }),
  },
  fabrics: {
    redVelvet: velvetMaterial({
      baseColor: color('#4a0404'),
      sheen: color('#ff8888'),
      sheenRoughness: 0.5,
      roughness: 1.0,
    }),
    royalBlueVelvet: velvetMaterial({
      baseColor: color('#000044'),
      sheen: color('#8888ff'),
      sheenRoughness: 0.4,
    }),
  },
  automotive: {
    midnightBlue: carPaintMaterial({
      baseColor: color('#001133'),
      flakeIntensity: 0.4,
      flakeSize: 300,
      clearcoat: 1.0,
    }),
    ferrariRed: carPaintMaterial({
      baseColor: color('#cc0000'),
      flakeIntensity: 0.1,
      clearcoat: 1.0,
      roughness: 0.1,
    }),
  },
  glass: {
    clear: glassMaterial({
      transmission: 1.0,
      roughness: 0.0,
      ior: 1.5,
      thickness: 0.5,
    }),
    frosted: glassMaterial({
      transmission: 0.9,
      roughness: 0.4,
      ior: 1.5,
    }),
    crystal: glassMaterial({
      transmission: 1.0,
      roughness: 0.0,
      ior: 2.0, // High IOR for sparkle
      dispersion: 0.05,
    }),
  }
};


