import type { Comet, CelestialBody, OuterDwarf, SmallBody, Moon, Planet, Quantity, SourceId } from './types'

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

export const moon = {
  id: 'moon', kind: 'moon', classification: 'moon',
  meanRadius: quantity(1737.4, 'km', 'nasa-moon'),
  siderealRotation: quantity(655.720, 'h', 'nasa-moon'),
  rotationModel: { kind: 'tidally-locked' },
  orbit: { center: 'earth', semiMajorAxis: quantity(384400, 'km', 'nasa-moon'), siderealPeriod: quantity(27.3217, 'd', 'nasa-moon'), obliquity: quantity(6.68, 'deg', 'nasa-moon') },
  descriptionSources: ['nasa-moon'],
} as const satisfies Moon

export const moons = [moon,
  { id: 'io', kind: 'moon', classification: 'moon', meanRadius: quantity(1821.5, 'km', 'nasa-jovian'), siderealRotation: quantity(1.769138 * 24, 'h', 'nasa-jovian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'jupiter', semiMajorAxis: quantity(421800, 'km', 'nasa-jovian'), siderealPeriod: quantity(1.769138, 'd', 'nasa-jovian') }, descriptionSources: ['nasa-jovian', 'nasa-io'] },
  { id: 'europa', kind: 'moon', classification: 'moon', meanRadius: quantity(1560.8, 'km', 'nasa-jovian'), siderealRotation: quantity(3.551181 * 24, 'h', 'nasa-jovian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'jupiter', semiMajorAxis: quantity(671100, 'km', 'nasa-jovian'), siderealPeriod: quantity(3.551181, 'd', 'nasa-jovian') }, descriptionSources: ['nasa-jovian', 'nasa-europa'] },
  { id: 'ganymede', kind: 'moon', classification: 'moon', meanRadius: quantity(2631.2, 'km', 'nasa-jovian'), siderealRotation: quantity(7.154553 * 24, 'h', 'nasa-jovian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'jupiter', semiMajorAxis: quantity(1070400, 'km', 'nasa-jovian'), siderealPeriod: quantity(7.154553, 'd', 'nasa-jovian') }, descriptionSources: ['nasa-jovian', 'nasa-ganymede'] },
  { id: 'callisto', kind: 'moon', classification: 'moon', meanRadius: quantity(2410.3, 'km', 'nasa-jovian'), siderealRotation: quantity(16.689017 * 24, 'h', 'nasa-jovian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'jupiter', semiMajorAxis: quantity(1882700, 'km', 'nasa-jovian'), siderealPeriod: quantity(16.689017, 'd', 'nasa-jovian') }, descriptionSources: ['nasa-jovian', 'nasa-callisto'] },
  { id: 'mimas', kind: 'moon', classification: 'moon', meanRadius: quantity(198.2, 'km', 'jpl-satellite-physical'), siderealRotation: quantity(0.9424218 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(185520, 'km', 'nasa-saturnian'), siderealPeriod: quantity(0.9424218, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-mimas'] },
  { id: 'enceladus', kind: 'moon', classification: 'moon', meanRadius: quantity(252.1, 'km', 'jpl-satellite-physical'), siderealRotation: quantity(1.370218 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(238020, 'km', 'nasa-saturnian'), siderealPeriod: quantity(1.370218, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-enceladus'] },
  { id: 'tethys', kind: 'moon', classification: 'moon', meanRadius: quantity(531.1, 'km', 'jpl-satellite-physical'), siderealRotation: quantity(1.887802 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(294660, 'km', 'nasa-saturnian'), siderealPeriod: quantity(1.887802, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-tethys'] },
  { id: 'dione', kind: 'moon', classification: 'moon', meanRadius: quantity(561.4, 'km', 'jpl-satellite-physical'), siderealRotation: quantity(2.736915 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(377400, 'km', 'nasa-saturnian'), siderealPeriod: quantity(2.736915, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-dione'] },
  { id: 'rhea', kind: 'moon', classification: 'moon', meanRadius: quantity(763.5, 'km', 'jpl-satellite-physical'), siderealRotation: quantity(4.5175 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(527040, 'km', 'nasa-saturnian'), siderealPeriod: quantity(4.5175, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-rhea'] },
  { id: 'titan', kind: 'moon', classification: 'moon', meanRadius: quantity(2575, 'km', 'nasa-saturnian'), siderealRotation: quantity(15.945421 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(1221870, 'km', 'nasa-saturnian'), siderealPeriod: quantity(15.945421, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-titan'] },
  { id: 'iapetus', kind: 'moon', classification: 'moon', meanRadius: quantity(734.3, 'km', 'jpl-satellite-physical'), siderealRotation: quantity(79.330183 * 24, 'h', 'nasa-saturnian'), rotationModel: { kind: 'tidally-locked' }, orbit: { center: 'saturn', semiMajorAxis: quantity(3560850, 'km', 'nasa-saturnian'), siderealPeriod: quantity(79.330183, 'd', 'nasa-saturnian') }, descriptionSources: ['nasa-saturnian', 'nasa-iapetus'] },
] as const satisfies readonly Moon[]

export const smallBodies = [
  { id: 'ceres', kind: 'dwarf-planet', classification: 'dwarf-planet', meanRadius: quantity(469.7, 'km', 'jpl-ceres'), siderealRotation: quantity(9.07417, 'h', 'jpl-ceres'), rotationModel: { kind: 'representative' }, orbit: { center: 'sun', semiMajorAxis: quantity(413720779.52595985, 'km', 'jpl-ceres'), siderealPeriod: quantity(1679.853119758983, 'd', 'jpl-ceres') }, descriptionSources: ['nasa-ceres', 'nasa-asteroids'] },
  { id: 'vesta', kind: 'asteroid', classification: 'asteroid', meanRadius: quantity(261.385, 'km', 'jpl-vesta'), siderealRotation: quantity(5.3421276322, 'h', 'jpl-vesta'), rotationModel: { kind: 'representative' }, orbit: { center: 'sun', semiMajorAxis: quantity(353255320.3265392, 'km', 'jpl-vesta'), siderealPeriod: quantity(1325.389042911101, 'd', 'jpl-vesta') }, descriptionSources: ['nasa-vesta', 'nasa-asteroids'] },
] as const satisfies readonly SmallBody[]

export const outerDwarfs = [
  { id: 'pluto', kind: 'dwarf-planet', classification: 'dwarf-planet', population: 'trans-neptunian', appearance: 'mapped', meanRadius: quantity(1188.3, 'km', 'jpl-dwarf-physical'), siderealRotation: quantity(-153.2928, 'h', 'nasa-pluto-facts'), rotationModel: { kind: 'representative' }, orbit: { center: 'sun', semiMajorAxis: quantity(5869656000, 'km', 'nasa-pluto-facts'), siderealPeriod: quantity(90560, 'd', 'nasa-pluto-facts'), inclination: quantity(17.16, 'deg', 'nasa-pluto-facts'), obliquity: quantity(119.51, 'deg', 'nasa-pluto-facts') }, descriptionSources: ['nasa-pluto', 'nasa-kuiper'] },
  { id: 'eris', kind: 'dwarf-planet', classification: 'dwarf-planet', population: 'scattered-disk', appearance: 'illustrative', meanRadius: quantity(1200, 'km', 'jpl-dwarf-physical'), siderealRotation: quantity(25.9, 'h', 'jpl-eris'), rotationModel: { kind: 'representative' }, orbit: { center: 'sun', semiMajorAxis: quantity(10162773801.275846, 'km', 'jpl-eris'), siderealPeriod: quantity(204516.6629430732, 'd', 'jpl-eris'), inclination: quantity(43.9258279471791, 'deg', 'jpl-eris') }, descriptionSources: ['nasa-eris', 'nasa-kuiper'] },
  { id: 'haumea', kind: 'dwarf-planet', classification: 'dwarf-planet', population: 'trans-neptunian', appearance: 'illustrative', meanRadius: quantity(715, 'km', 'jpl-dwarf-physical'), siderealRotation: quantity(3.9154, 'h', 'jpl-haumea'), rotationModel: { kind: 'representative' }, orbit: { center: 'sun', semiMajorAxis: quantity(6441727731.1058235, 'km', 'jpl-haumea'), siderealPeriod: quantity(103208.1173403618, 'd', 'jpl-haumea'), inclination: quantity(28.20847393040364, 'deg', 'jpl-haumea') }, descriptionSources: ['nasa-haumea', 'nasa-kuiper'] },
  { id: 'makemake', kind: 'dwarf-planet', classification: 'dwarf-planet', population: 'trans-neptunian', appearance: 'illustrative', meanRadius: quantity(714, 'km', 'jpl-dwarf-physical'), siderealRotation: quantity(22.8266, 'h', 'jpl-makemake'), rotationModel: { kind: 'representative' }, orbit: { center: 'sun', semiMajorAxis: quantity(6817314568.492872, 'km', 'jpl-makemake'), siderealPeriod: quantity(112364.8068762869, 'd', 'jpl-makemake'), inclination: quantity(29.02785603743067, 'deg', 'jpl-makemake') }, descriptionSources: ['nasa-makemake', 'nasa-kuiper'] },
] as const satisfies readonly OuterDwarf[]
export const halley = { id: 'halley', kind: 'comet', classification: 'comet', meanRadius: quantity(5.5, 'km', 'jpl-halley'), siderealRotation: null, rotationModel: { kind: 'illustrative' }, orbit: { center: 'sun', semiMajorAxis: quantity(2682085627.8233476, 'km', 'jpl-halley'), siderealPeriod: quantity(27728.04608790421, 'd', 'jpl-halley'), inclination: quantity(162.1905300439129, 'deg', 'jpl-halley'), eccentricity: quantity(0.9679359956953211, '1', 'jpl-halley'), ascendingNode: quantity(59.09894720612437, 'deg', 'jpl-halley'), argumentPeriapsis: quantity(112.2414314637764, 'deg', 'jpl-halley'), epochJD: 2439875.5 }, descriptionSources: ['nasa-halley', 'jpl-halley'] } as const satisfies Comet
export const bodies = [sun, ...planets, ...moons, ...smallBodies, ...outerDwarfs, halley] as const satisfies readonly CelestialBody[]
