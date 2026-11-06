import { outerBodyIds, type OuterBodyId } from '../data/types.ts'
export const kuiperConfig = { innerRadius: 40, outerRadius: 60, halfThickness: 2.4, seed: 1102, fadeStart: 115, fadeEnd: 205 } as const
export function isOuterBody(id: string): id is OuterBodyId { return outerBodyIds.some(body => body === id) }
export function kuiperOpacity(distance: number, reducedMotion = false) {
  if (!Number.isFinite(distance) || distance < 0) throw new RangeError('Invalid outer distance')
  if(reducedMotion)return distance>=kuiperConfig.fadeStart?1:0
  const t = Math.max(0, Math.min(1, (distance - kuiperConfig.fadeStart) / (kuiperConfig.fadeEnd - kuiperConfig.fadeStart)))
  return t * t * (3 - 2 * t)
}
export function createKuiperPositions(count: number, seed = kuiperConfig.seed): Float32Array {
  if (!Number.isInteger(count) || count < 0 || count > 6000 || !Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('Invalid Kuiper field')
  let state = seed >>> 0
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296 }
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2
    const r = kuiperConfig.innerRadius + (random() + random()) / 2 * (kuiperConfig.outerRadius - kuiperConfig.innerRadius)
    positions.set([r * Math.cos(angle), (random() + random() - 1) * kuiperConfig.halfThickness, r * Math.sin(angle)], i * 3)
  }
  return positions
}

/** Stable-prefix point LOD: grow detail without reallocating the geometry. */
export function kuiperDrawCount(count: number, fade: number): number {
  if (!Number.isInteger(count) || count < 0 || count > 6000 || !Number.isFinite(fade) || fade < 0 || fade > 1) throw new RangeError('Invalid Kuiper detail')
  return Math.floor(count * (0.25 + 0.75 * fade))
}
