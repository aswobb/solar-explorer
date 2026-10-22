/** Deterministic decorative sky; no astronomical positions or solar-system members. */
export function createStarPositions(count: number, innerRadius: number, outerRadius: number, seed = 73): Float32Array {
  if (!Number.isInteger(count) || count < 0 || count > 10000) throw new RangeError('Invalid star count')
  if (!Number.isFinite(innerRadius) || !Number.isFinite(outerRadius) || innerRadius <= 0 || outerRadius <= innerRadius) throw new RangeError('Invalid sky radii')
  let state = seed >>> 0
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const y = 2 * random() - 1
    const angle = random() * Math.PI * 2
    const radius = innerRadius + random() * (outerRadius - innerRadius)
    const horizontal = Math.sqrt(1 - y * y)
    positions.set([radius * horizontal * Math.cos(angle), radius * y, radius * horizontal * Math.sin(angle)], i * 3)
  }
  return positions
}
