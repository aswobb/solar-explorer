/** Artistic parameters only; not atmospheric height, weather or radiative transfer. */
export const earthVisual = { cloudScale: 1.009, atmosphereScale: 1.045, outlineScale: 1.012, cloudRadiansPerSecond: 0.018, twilight: 0.12 } as const
/** World-space direction from the Earth center to our Sun at the origin. Reuses target. */
export function setEarthSunDirection(center: { x: number; y: number; z: number }, target: { x: number; y: number; z: number }) {
  const length = Math.hypot(center.x, center.y, center.z)
  if (!Number.isFinite(length) || length === 0) throw new RangeError('Invalid Earth center')
  target.x = -center.x / length; target.y = -center.y / length; target.z = -center.z / length
}
export function cloudDrift(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Invalid cloud time')
  return seconds * earthVisual.cloudRadiansPerSecond % (2 * Math.PI)
}
