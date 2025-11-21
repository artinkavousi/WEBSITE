// @ts-nocheck
import { Fn, vec3 } from 'three/tsl';
import { Node } from '@/tsl/core/types';
import { curlNoise3D } from '@/tsl/fields/noise/curl_noise_3d';

export const flowField = Fn(([position, time, scale = 1.0]) => {
    const pos = position.mul(scale);
    // Curl noise is divergence free, making it great for fluid-like motion
    return curlNoise3D(pos, time);
});

