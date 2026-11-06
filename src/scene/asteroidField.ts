import { orbitDisplayPeriod } from './motion.ts'
/** Display units only; density and size are enhanced, not a catalog or observed sky. */
export const asteroidBeltConfig = { innerRadius: 14, outerRadius: 15.05, halfThickness: 0.22, maxRockRadius: 0.085, seed: 7331, dustBudgetFraction: 0.3, representativeOrbitDays: 1500 } as const
export interface BeltParticle {
  x: number; y: number; z: number; radius: number; angle: number; scale: number; spin: number; shade: number
}
export function createBeltParticles(count: number, seed: number = asteroidBeltConfig.seed): BeltParticle[] {
  if (!Number.isInteger(count) || count < 0 || count > 6000 || !Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('Invalid asteroid field')
  let state = seed >>> 0
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
  return Array.from({ length: count }, () => {
    const angle = random() * Math.PI * 2
    // A broad component plus a central concentration; not observed gaps or named objects.
    const radial = random() < 0.65 ? (random() + random()) / 2 : random()
    const radius = asteroidBeltConfig.innerRadius + radial * (asteroidBeltConfig.outerRadius - asteroidBeltConfig.innerRadius)
    return { x: radius * Math.cos(angle), y: (random() + random() - 1) * asteroidBeltConfig.halfThickness, z: radius * Math.sin(angle), radius, angle, scale: 0.018 + random() ** 3 * 0.067, spin: random() * Math.PI * 2, shade: random() }
  })
}
export function beltRotation(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Invalid belt time')
  return seconds / orbitDisplayPeriod(asteroidBeltConfig.representativeOrbitDays) * Math.PI * 2 % (Math.PI * 2)
}
