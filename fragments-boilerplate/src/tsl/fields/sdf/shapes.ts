// @ts-nocheck
import {
  Fn,
  length,
  min,
  max,
  abs,
  vec2,
  sqrt,
  sign,
  float,
  dot,
  vec3,
  If,
  clamp,
  select,
  mul,
  sub,
  add,
  Node
} from 'three/tsl'

// --- GENERIC ---

/**
 * Returns a sphere SDF. Works for 2D (Circle) and 3D (Sphere).
 * @param {Node} p - The point coordinates (vec2 or vec3).
 * @param {Node} r - The radius.
 * @returns {Node} Signed distance.
 */
export const sdSphere = Fn(([p, r]) => {
  return length(p).sub(r)
})

// --- 3D PRIMITIVES ---

/**
 * Signed distance to a Box (3D).
 * @param {Node} p - Point (vec3).
 * @param {Node} b - Half-size (vec3).
 */
export const sdBox = Fn(([p, b]) => {
  const q = abs(p).sub(b)
  return length(max(q, 0.0)).add(min(max(q.x, max(q.y, q.z)), 0.0))
})

/**
 * Signed distance to a Torus (3D).
 * @param {Node} p - Point (vec3).
 * @param {Node} t - vec2(major radius, minor radius).
 */
export const sdTorus = Fn(([p, t]) => {
  const q = vec2(length(p.xz).sub(t.x), p.y)
  return length(q).sub(t.y)
})

/**
 * Signed distance to a Cylinder (3D).
 * @param {Node} p - Point (vec3).
 * @param {Node} h - vec2(radius, height).
 */
export const sdCylinder = Fn(([p, h]) => {
  const d = abs(vec2(length(p.xz), p.y)).sub(h)
  return min(max(d.x, d.y), 0.0).add(length(max(d, 0.0)))
})

/**
 * Signed distance to a Capsule (3D).
 * @param {Node} p - Point (vec3).
 * @param {Node} a - Start point (vec3).
 * @param {Node} b - End point (vec3).
 * @param {Node} r - Radius.
 */
export const sdCapsule = Fn(([p, a, b, r]) => {
  const pa = p.sub(a)
  const ba = b.sub(a)
  const h = clamp(dot(pa, ba).div(dot(ba, ba)), 0.0, 1.0)
  return length(pa.sub(ba.mul(h))).sub(r)
})


// --- 2D PRIMITIVES ---

/**
 * Returns a 2d box SDF.
 */
export const sdBox2d = Fn(([_uv, _size = float(0.0)]) => {
  return max(abs(_uv.x), abs(_uv.y)).sub(_size)
})

/**
 * Returns a diamond SDF.
 */
export const sdDiamond = Fn(([_uv, r = 0.0]) => {
  return abs(_uv.x).add(abs(_uv.y)).sub(r)
})

/**
 * Returns a hexagon SDF.
 */
export const sdHexagon = Fn(([p = vec2(0), _r = 0.5]) => {
  const r = float(_r)
  const k = vec3(-0.866025404, 0.5, 0.577350269)

  const _p = abs(p).toVar()
  _p.subAssign(float(2.0).mul(min(dot(k.xy, _p), 0.0).mul(k.xy)))
  _p.subAssign(vec2(clamp(_p.x, k.z.negate().mul(r), k.z.mul(r)), r))

  return length(_p).mul(sign(_p.y))
})

/**
 * Returns an equilateral triangle SDF.
 */
export const sdEquilateralTriangle = Fn(([p = vec2(0), _r = float(0.1)]) => {
  const r = float(_r)

  const k = sqrt(3.0)
  const _p = p.toVar()

  _p.x = abs(_p.x).sub(r).toVar()
  _p.y = _p.y.add(r.div(k)).toVar()

  If(_p.x.add(k.mul(_p.y)).greaterThan(0), () => {
    _p.assign(vec2(_p.x.sub(k.mul(_p.y)), k.negate().mul(_p.x).sub(_p.y)).div(2))
  })

  _p.x.subAssign(clamp(_p.x, r.mul(-2), 0.0))
  return length(_p).negate().mul(sign(_p.y))
})

/**
 * Returns a line SDF.
 */
export const sdLine = Fn(([p]) => {
  return abs(p)
})

/**
 * Returns a ring SDF.
 */
export const sdRing = Fn(([_uv, s = 0.4]) => {
  return abs(length(_uv).sub(s)).toVar()
})
