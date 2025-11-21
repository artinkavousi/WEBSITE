import {
  Fn,
  float,
  vec3,
  storage,
  instanceIndex,
  If,
  hash,
} from 'three/tsl';
import { InstancedBufferAttribute } from 'three';
import { Node } from '@/tsl/core/types';

export interface AttractorParams {
  count?: number;
  speed?: number | Node;
  drag?: number | Node;
  attractorPos?: Node;
}

export const createAttractorSystem = (params: AttractorParams = {}) => {
  const {
    count = 100000,
    speed = 0.1,
    drag = 0.95,
    attractorPos = vec3(0, 0, 0)
  } = params;

  // 1. Buffers
  const positionBuffer = new InstancedBufferAttribute(new Float32Array(count * 3), 3);
  const velocityBuffer = new InstancedBufferAttribute(new Float32Array(count * 3), 3);
  const colorBuffer = new InstancedBufferAttribute(new Float32Array(count * 3), 3);

  // 2. Storage Nodes
  const positionStorage = storage(positionBuffer, 'vec3', count);
  const velocityStorage = storage(velocityBuffer, 'vec3', count);
  const colorStorage = storage(colorBuffer, 'vec3', count);

  // 3. Init Kernel
  const initKernel = Fn(() => {
    const i = instanceIndex;
    
    // Random position sphere
    const u = hash(i.mul(0.1));
    const v = hash(i.mul(0.2));
    const theta = u.mul(Math.PI * 2);
    const phi = v.mul(Math.PI).sub(Math.PI / 2).acos();
    const r = hash(i.mul(0.3)).pow(1.0/3.0).mul(5.0); // Radius 5
    
    const x = r.mul(phi.sin()).mul(theta.cos());
    const y = r.mul(phi.sin()).mul(theta.sin());
    const z = r.mul(phi.cos());
    
    positionStorage.element(i).assign(vec3(x, y, z));
    velocityStorage.element(i).assign(vec3(0, 0, 0));
    
    // Random color
    colorStorage.element(i).assign(vec3(hash(i), hash(i.add(1)), hash(i.add(2))));
  });

  // 4. Update Kernel
  const updateKernel = Fn(() => {
    const i = instanceIndex;
    
    const pos = positionStorage.element(i);
    const vel = velocityStorage.element(i);
    
    // Attractor Force
    const diff = attractorPos.sub(pos);
    const dist = diff.length();
    const dir = diff.normalize();
    
    // F = ma, simple gravity-like pull + curl noise (simulated random)
    const force = dir.mul(float(speed).div(dist.add(1.0))); 
    
    // Update velocity
    vel.addAssign(force);
    vel.mulAssign(drag); // Friction
    
    // Update position
    pos.addAssign(vel);
    
    // Reset if too close
    If(dist.lessThan(0.1), () => {
        const r = hash(i.add(float(Math.random()))).mul(5.0);
        // Reset logic could be better, but this works for now
        pos.assign(dir.mul(r).negate()); 
        vel.assign(vec3(0));
    });
  });

  return {
    count,
    positionBuffer,
    velocityBuffer,
    colorBuffer,
    positionStorage,
    velocityStorage,
    colorStorage,
    initKernel: initKernel(), // Call to return the node
    updateKernel: updateKernel() // Call to return the node
  };
};

