import type { BufferGeometry } from 'three'

/** A 1D radial strip: inner edge -> u=0, outer edge -> u=1, independent of angle. */
export function ringRadialU(radius: number, inner: number, outer: number) {
  if (![radius, inner, outer].every(Number.isFinite) || inner <= 0 || outer <= inner || radius < 0) throw new RangeError('Invalid ring dimensions')
  return Math.max(0, Math.min(1, (radius - inner) / (outer - inner)))
}
export function mapRingUvs(geometry: BufferGeometry, inner: number, outer: number) {
  const positions = geometry.getAttribute('position')
  const uv = geometry.getAttribute('uv')
  for (let i = 0; i < positions.count; i++) uv.setXY(i, ringRadialU(Math.hypot(positions.getX(i), positions.getY(i)), inner, outer), 0.5)
  uv.needsUpdate = true
}
