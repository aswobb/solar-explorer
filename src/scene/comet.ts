import { halley } from '../data/bodies.ts'
import { orbitDisplayPeriod } from './motion.ts'
import { eccentricAt, type Ellipse } from './kepler.ts'
const radians = Math.PI / 180
/** Artistic eccentricity prevents the enlarged Sun swallowing perihelion. Science data stays intact. */
export const halleyDisplayOrbit: Ellipse = { a: 24, e: 0.78, inclination: halley.orbit.inclination.value*radians, node: halley.orbit.ascendingNode.value*radians, periapsis: halley.orbit.argumentPeriapsis.value*radians, phase: 0, direction: 1, period: orbitDisplayPeriod(halley.orbit.siderealPeriod.value) }
export const halleyScienceOrbit: Ellipse = { ...halleyDisplayOrbit, a: halley.orbit.semiMajorAxis.value/149597870.7, e: halley.orbit.eccentricity.value }
export const cometBudget = { standard: 96, eco: 32 } as const
export function cometActivity(distanceAU: number) {
  if (!Number.isFinite(distanceAU) || distanceAU < 0) throw new RangeError('Invalid heliocentric distance')
  const t = Math.max(0, Math.min(1, (5-distanceAU)/4))
  return t*t*(3-2*t)
}
export function cometDistance(seconds: number) { const o=halleyScienceOrbit; return o.a*(1-o.e*Math.cos(eccentricAt(o,seconds))) }
export type TimeRequest = { id: number; seconds: number } | null
