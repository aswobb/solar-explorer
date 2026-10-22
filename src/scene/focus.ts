import { overviewDistance } from './geometry.ts'
export type CameraMode = 'overview' | 'focusing' | 'following' | 'returning'
export const focusConfig = { duration: 1.35, margin: 1.45, outlineScale: 1.18, maxDelta: 0.1 } as const
export function focusDistance(radius: number, fov: number, aspect: number): number {
  return overviewDistance(radius * focusConfig.outlineScale, fov, aspect, focusConfig.margin)
}
export function focusLimits(radius: number, distance: number) {
  if (![radius,distance].every(Number.isFinite) || radius <= 0 || distance <= radius) throw new RangeError('Invalid focus limits')
  return { min: radius * 1.5, max: Math.max(12, distance * 4) }
}
export function transitionProgress(elapsed: number, duration: number): number {
  if (![elapsed,duration].every(Number.isFinite) || elapsed < 0 || duration < 0) throw new RangeError('Invalid transition time')
  const t = duration === 0 ? 1 : Math.min(1, elapsed / duration)
  return Math.max(0, Math.min(1, t * t * t * (t * (t * 6 - 15) + 10)))
}
