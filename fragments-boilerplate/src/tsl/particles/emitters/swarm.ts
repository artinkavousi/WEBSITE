// @ts-nocheck
import {
  Fn,
  float,
  vec3,
  storage,
  instanceIndex,
  If,
  hash,
  time,
} from 'three/tsl';
import { InstancedBufferAttribute } from 'three';
import { curlNoise3D } from '@/tsl/fields/noise/curl_noise_3d';
import { Node } from '@/tsl/core/types';

export interface SwarmParams {
  count?: number;
  speed?: number;
  confusion?: number; // Curl noise scale
  cohesion?: number; // Attraction to center
  pointer?: Node;
  pointerStrength?: number;
}

export const createSwarmEmitter = (params: SwarmParams = {}) => {
  const {
    count = 50000,
    speed = 1.0,
    confusion = 1.0,
    cohesion = 0.5,
    pointer,
    pointerStrength = 0
  } = params;

  // 1. Buffers
  const positionBuffer = new InstancedBufferAttribute(new Float32Array(count * 3), 3);
  const velocityBuffer = new InstancedBufferAttribute(new Float32Array(count * 3), 3);
  
  // 2. Storage
  const positionStorage = storage(positionBuffer, 'vec3', count);
  const velocityStorage = storage(velocityBuffer, 'vec3', count);

  // 3. Init Kernel
  const initKernel = Fn(() => {
    const i = instanceIndex;
    
    // Sphere distribution
    const u = hash(i.mul(0.1));
    const v = hash(i.mul(0.2));
    const theta = u.mul(Math.PI * 2);
    const phi = v.mul(Math.PI).sub(Math.PI / 2).acos();
    const r = hash(i.mul(0.3)).pow(1.0/3.0).mul(2.0); 
    
    const x = r.mul(phi.sin()).mul(theta.cos());
    const y = r.mul(phi.sin()).mul(theta.sin());
    const z = r.mul(phi.cos());
    
    positionStorage.element(i).assign(vec3(x, y, z));
    velocityStorage.element(i).assign(vec3(0));
  });

  const pointerTarget = pointer ?? vec3(0);
  const pointerStrengthNode = float(pointerStrength);

  // 4. Update Kernel
  const updateKernel = Fn(() => {
    const i = instanceIndex;
    
    const pos = positionStorage.element(i);
    const vel = velocityStorage.element(i);
    
    // 1. Cohesion (Move to center)
    const toCenter = pos.negate().normalize();
    const cohesionForce = toCenter.mul(cohesion).mul(0.01);
    
    // 2. Confusion (Curl Noise randomness)
    const t = time.mul(float(0.1));
    const noiseDir = curlNoise3D(pos.mul(confusion), t);
    const noiseForce = noiseDir.mul(speed).mul(0.02);
    
    // Apply forces
    vel.addAssign(cohesionForce);
    vel.addAssign(noiseForce);
    
    // Damping/Friction
    vel.mulAssign(0.96);
    
    // Integration
    pos.addAssign(vel);
    
    // Hard limit (keep them in bounds if they explode)
    const dist = pos.length();
    If(dist.greaterThan(10.0), () => {
        pos.assign(pos.normalize().mul(10.0));
        vel.assign(vel.negate().mul(0.5));
    });

    If(pointerStrengthNode.greaterThan(0.0), () => {
        const pointerDir = pointerTarget.sub(pos).toVar();
        const distance = pointerDir.length().add(0.1).toVar();
        const attraction = pointerDir.normalize().mul(pointerStrengthNode).div(distance).mul(0.02);
        vel.addAssign(attraction);
    });
  });

  return {
    count,
    positionStorage,
    velocityStorage,
    initKernel: initKernel(),
    updateKernel: updateKernel()
  };
};

