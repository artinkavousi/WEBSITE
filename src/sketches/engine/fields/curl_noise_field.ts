/**
 * @sketch engine/fields/curl_noise_field
 * @description Visual demonstration of curl noise vector field
 * 
 * Shows the curl noise field by using it to perturb surface normals,
 * creating an animated, flowing metallic surface.
 */

import { Fn, vec3, normalWorld, positionWorld, cameraPosition, time } from 'three/tsl'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { fresnel } from '@/tsl/utils/lighting'

const curlNoiseFieldDemo = Fn(() => {
  const baseCol = vec3(0.3, 0.6, 0.6) // Teal
  
  // Create curl-like perturbation using noise
  const worldPos = positionWorld
  const t = time.mul(0.5)
  
  // Sample noise at offset positions to create curl-like vectors
  const p = worldPos.mul(1.0)
  const eps = 0.01
  
  const n1 = simplexNoise3d(p.add(vec3(eps, 0, t)))
  const n2 = simplexNoise3d(p.add(vec3(0, eps, t)))
  const n3 = simplexNoise3d(p.add(vec3(0, 0, eps).add(t)))
  
  // Create curl vector
  const curlVec = vec3(n2.sub(n3), n3.sub(n1), n1.sub(n2)).mul(0.3)
  
  // Perturb normal with curl
  const perturbedNormal = normalWorld.add(curlVec).normalize()
  
  // Fresnel effect with perturbed normal
  const viewDir = cameraPosition.sub(worldPos).normalize()
  const f = fresnel(viewDir, perturbedNormal)
  
  // Final color with curl-influenced Fresnel
  const finalColor = baseCol.mul(f.add(0.3)).add(curlVec.mul(0.1))
  
  return finalColor
})

export default curlNoiseFieldDemo
