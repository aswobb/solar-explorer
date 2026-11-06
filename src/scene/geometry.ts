/** Circular display orbit in the XZ plane. Angle is radians, never a real current position. */
export function orbitPosition(radius: number, angle: number): [number, number, number] {
  if (!Number.isFinite(radius) || radius < 0 || !Number.isFinite(angle)) throw new RangeError('Invalid orbit position')
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
}

export function createOrbitPositions(radius: number, segments: number): Float32Array {
  if (!Number.isInteger(segments) || segments < 3 || segments > 4096) throw new RangeError('Invalid orbit segments')
  const positions = new Float32Array(segments * 3)
  for (let i = 0; i < segments; i++) positions.set(orbitPosition(radius, i / segments * Math.PI * 2), i * 3)
  return positions
}

/** Distance needed to enclose a bounding sphere in both horizontal and vertical FOV. */
export function overviewDistance(radius: number, fovDegrees: number, aspect: number, margin: number): number {
  if (![radius, fovDegrees, aspect, margin].every(Number.isFinite) || radius <= 0 || fovDegrees <= 0 || fovDegrees >= 180 || aspect <= 0 || margin < 1) throw new RangeError('Invalid overview framing')
  const verticalHalf = fovDegrees * Math.PI / 360
  const horizontalHalf = Math.atan(Math.tan(verticalHalf) * aspect)
  return radius * margin / Math.sin(Math.min(verticalHalf, horizontalHalf))
}

/** Inclined circular display orbit; eccentric orbit solving belongs to P5. */
export function inclinedOrbitPosition(radius: number, angle: number, inclination: number = 0): [number, number, number] {
  if (!Number.isFinite(inclination) || inclination < 0 || inclination > 180) throw new RangeError('Invalid orbital inclination')
  const [x, , z] = orbitPosition(radius, angle)
  const radians = inclination * Math.PI / 180
  return [x, z * Math.sin(radians), z * Math.cos(radians)]
}
