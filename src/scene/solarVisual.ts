/** Display parameters, not measured solar activity, corona height or temperature. */
export const solarVisual = { coronaScale: 1.42, outlineScale: 1.008, phaseRate: 0.18, defaultGlow: 0.65 } as const
export const solarGlowLevels = [0, 0.35, 0.65, 1] as const
export type SolarGlow = typeof solarGlowLevels[number]
export function isSolarGlow(value: number): value is SolarGlow {
  return solarGlowLevels.some(level => level === value)
}
/** All shader motion uses integer-frequency sin/cos of this bounded phase. */
export function solarPhase(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Invalid solar time')
  return seconds * solarVisual.phaseRate % (Math.PI * 2)
}
