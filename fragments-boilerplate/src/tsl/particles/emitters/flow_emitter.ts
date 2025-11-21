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

export interface FlowEmitterParams {
  count?: number;
  speed?: number;
  curlScale?: number;
  timeScale?: number;
  pointer?: Node;
  pointerStrength?: number;
}

export const createFlowEmitter = (params: FlowEmitterParams = {}) => {
  const {
    count = 100000,
    speed = 0.5,
    curlScale = 0.5,
    timeScale = 0.1,
    pointer,
    pointerStrength = 0
  } = params;

  // 1. Buffers
  const positionBuffer = new InstancedBufferAttribute(new Float32Array(count * 3), 3);
  const lifeBuffer = new InstancedBufferAttribute(new Float32Array(count * 1), 1); // Life 0..1

  // 2. Storage
  const positionStorage = storage(positionBuffer, 'vec3', count);
  const lifeStorage = storage(lifeBuffer, 'float', count);

  // 3. Init Kernel
  const initKernel = Fn(() => {
    const i = instanceIndex;
    
    // Random position in a box
    const x = hash(i.mul(0.1)).mul(10).sub(5);
    const y = hash(i.mul(0.2)).mul(10).sub(5);
    const z = hash(i.mul(0.3)).mul(10).sub(5);
    
    positionStorage.element(i).assign(vec3(x, y, z));
    lifeStorage.element(i).assign(hash(i.mul(0.4))); // Random start life
  });

  const pointerTarget = pointer ?? vec3(0);
  const pointerStrengthNode = float(pointerStrength);

  // 4. Update Kernel
  const updateKernel = Fn(() => {
    const i = instanceIndex;
    
    const pos = positionStorage.element(i);
    const life = lifeStorage.element(i);
    
    // Sample Curl Noise Flow Field
    // We use the position as input to the field
    const t = time.mul(float(timeScale));
    const flow = curlNoise3D(pos.mul(curlScale), t);
    
    // Update position
    pos.addAssign(flow.mul(speed).mul(0.016)); // Assume 60fps dt approx
    
    // Update Life
    life.subAssign(0.005);
    
    // Respawn if dead
    If(life.lessThan(0.0), () => {
        // Respawn random
        const x = hash(i.add(t)).mul(10).sub(5);
        const y = hash(i.add(t).add(1)).mul(10).sub(5);
        const z = hash(i.add(t).add(2)).mul(10).sub(5);
        
        pos.assign(vec3(x, y, z));
        life.assign(1.0);
    });

    If(pointerStrengthNode.greaterThan(0.0), () => {
        const pointerDir = pointerTarget.sub(pos).toVar();
        const distance = pointerDir.length().add(0.001).toVar();
        const attraction = pointerDir.normalize().mul(pointerStrengthNode).div(distance).mul(0.016);
        pos.addAssign(attraction);
    });
  });

  return {
    count,
    positionStorage,
    lifeStorage,
    initKernel: initKernel(),
    updateKernel: updateKernel()
  };
};

