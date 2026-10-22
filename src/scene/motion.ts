/** Artistic time compression. Orbit and spin deliberately do not share a physical clock. */
export const motionConfig = {
  earthOrbitSeconds: 40,
  earthSpinSeconds: 12,
  earthOrbitDays: 365.2,
  earthSpinHours: 23.9,
  orbitExponent: 0.35,
  spinExponent: 0.25,
  maxFrameDelta: 0.25,
  speeds: [0.25, 0.5, 1, 2, 5],
} as const
export type MotionSpeed = typeof motionConfig.speeds[number]
export function isMotionSpeed(value: number): value is MotionSpeed {
  return motionConfig.speeds.some(speed => speed === value)
}
export function simulationStep(delta: number, speed: number, running: boolean): number {
  if (!Number.isFinite(delta) || delta < 0 || !isMotionSpeed(speed)) throw new RangeError('Invalid motion step')
  return running ? Math.min(delta, motionConfig.maxFrameDelta) * speed : 0
}
export function orbitDisplayPeriod(days: number): number {
  if (!Number.isFinite(days) || days <= 0) throw new RangeError('Invalid orbital period')
  return motionConfig.earthOrbitSeconds * (days / motionConfig.earthOrbitDays) ** motionConfig.orbitExponent
}
export function spinDisplayPeriod(hours: number): number {
  if (!Number.isFinite(hours) || hours === 0) throw new RangeError('Invalid rotation period')
  return motionConfig.earthSpinSeconds * (Math.abs(hours) / motionConfig.earthSpinHours) ** motionConfig.spinExponent
}
export function wrapAngle(angle: number): number {
  if (!Number.isFinite(angle)) throw new RangeError('Invalid angle')
  const turn = Math.PI * 2
  return ((angle % turn) + turn) % turn
}
/** Canonical northward axis; retrograde is encoded exactly once by signed spin. */
export function displayTilt(degrees: number): number {
  if (!Number.isFinite(degrees) || degrees < 0 || degrees > 180) throw new RangeError('Invalid obliquity')
  return Math.min(degrees, 180 - degrees) * Math.PI / 180
}
export function anglesAt(time: number, initialPhase: number, orbitDays: number | null, spinHours: number) {
  if (!Number.isFinite(time) || time < 0) throw new RangeError('Invalid simulation time')
  return {
    // orbitPosition uses +sin(z); decreasing angle gives prograde rotation about +Y.
    orbit: wrapAngle(initialPhase - (orbitDays === null ? 0 : time / orbitDisplayPeriod(orbitDays) * Math.PI * 2)),
    spin: wrapAngle(Math.sign(spinHours) * time / spinDisplayPeriod(spinHours) * Math.PI * 2),
  }
}
