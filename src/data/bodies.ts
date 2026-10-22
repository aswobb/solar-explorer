import type { CelestialBody, Planet, Quantity, SourceId } from './types'

function quantity<U extends string>(value: number, unit: U, source: SourceId): Quantity<U> {
  return { value, unit, source }
}
/** Science values only. Scene radii, distances and time scales belong in T06 display configuration. */
export const sun = {
  id: 'sun', kind: 'star',
  meanRadius: quantity(695700, 'km', 'nasa-sun'),
  siderealRotation: quantity(609.12, 'h', 'nasa-sun'),
  rotationModel: { kind: 'differential', referenceLatitude: quantity(16, 'deg', 'nasa-sun') },
  orbit: null,
  descriptionSources: ['nasa-system', 'nasa-sun'],
} as const satisfies CelestialBody

export const planets = [
  {
    id: 'mercury', kind: 'planet', classification: 'terrestrial',
    meanRadius: quantity(2439.4, 'km', 'jpl-physical'), siderealRotation: quantity(1407.6, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(57.9e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(88.0, 'd', 'nasa-planetary'), obliquity: quantity(0.034, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary'],
  },
  {
    id: 'venus', kind: 'planet', classification: 'terrestrial',
    meanRadius: quantity(6051.8, 'km', 'jpl-physical'), siderealRotation: quantity(-5832.5, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(108.2e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(224.7, 'd', 'nasa-planetary'), obliquity: quantity(177.4, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary', 'nasa-notes'],
  },
  {
    id: 'earth', kind: 'planet', classification: 'terrestrial',
    meanRadius: quantity(6371.0084, 'km', 'jpl-physical'), siderealRotation: quantity(23.9, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(149.6e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(365.2, 'd', 'nasa-planetary'), obliquity: quantity(23.4, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary'],
  },
  {
    id: 'mars', kind: 'planet', classification: 'terrestrial',
    meanRadius: quantity(3389.5, 'km', 'jpl-physical'), siderealRotation: quantity(24.6, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(228.0e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(687.0, 'd', 'nasa-planetary'), obliquity: quantity(25.2, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary'],
  },
  {
    id: 'jupiter', kind: 'planet', classification: 'gas-giant',
    meanRadius: quantity(69911, 'km', 'jpl-physical'), siderealRotation: quantity(9.9, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(778.5e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(4331, 'd', 'nasa-planetary'), obliquity: quantity(3.1, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary'],
  },
  {
    id: 'saturn', kind: 'planet', classification: 'gas-giant',
    meanRadius: quantity(58232, 'km', 'jpl-physical'), siderealRotation: quantity(10.7, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(1432.0e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(10747, 'd', 'nasa-planetary'), obliquity: quantity(26.7, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary'],
  },
  {
    id: 'uranus', kind: 'planet', classification: 'ice-giant',
    meanRadius: quantity(25362, 'km', 'jpl-physical'), siderealRotation: quantity(-17.2, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(2867.0e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(30589, 'd', 'nasa-planetary'), obliquity: quantity(97.8, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary', 'nasa-notes'],
  },
  {
    id: 'neptune', kind: 'planet', classification: 'ice-giant',
    meanRadius: quantity(24622, 'km', 'jpl-physical'), siderealRotation: quantity(16.1, 'h', 'nasa-planetary'),
    rotationModel: { kind: 'representative' },
    orbit: { center: 'sun', semiMajorAxis: quantity(4515.0e6, 'km', 'nasa-planetary'), siderealPeriod: quantity(59800, 'd', 'nasa-planetary'), obliquity: quantity(28.3, 'deg', 'nasa-planetary') },
    descriptionSources: ['nasa-planets', 'nasa-planetary'],
  },
] as const satisfies readonly Planet[]

export const bodies = [sun, ...planets] as const satisfies readonly CelestialBody[]
