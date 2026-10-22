import type { Locale } from '../locales/types'
import { localeTags } from '../locales/types.ts'
export type ScientificUnit = 'km' | 'h' | 'd' | 'deg'
const intlUnits: Record<ScientificUnit, string> = { km: 'kilometer', h: 'hour', d: 'day', deg: 'degree' }
const defaultDigits: Record<ScientificUnit, number> = { km: 1, h: 2, d: 1, deg: 3 }
/** Formatting only: no display-scale conversion or mutation of scientific data. */
export function formatScientificValue(value: number, unit: ScientificUnit, locale: Locale, maximumFractionDigits = defaultDigits[unit]): string {
  if (!Number.isFinite(value) || !Number.isInteger(maximumFractionDigits) || maximumFractionDigits < 0 || maximumFractionDigits > 6) throw new RangeError('Invalid scientific format input')
  return new Intl.NumberFormat(localeTags[locale], { style: 'unit', unit: intlUnits[unit], unitDisplay: 'short', useGrouping: true, maximumFractionDigits }).format(value)
}
export function formatRotationHours(hours: number, locale: Locale): string {
  if (hours === 0 || !Number.isFinite(hours)) throw new RangeError('Invalid rotation period')
  return formatScientificValue(Math.abs(hours), 'h', locale)
}
