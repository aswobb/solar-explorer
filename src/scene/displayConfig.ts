import { bodies } from '../data/bodies.ts'
import { outerBodyIds } from '../data/types.ts'
import type { BodyId } from '../data/types'
import { solarVisual } from './solarVisual.ts'

/** Artistic ring dimensions; not measured radii. Reserve this extent even when hidden. */
export const saturnRingConfig = { innerScale: 1.22, outerScale: 2.15, segments: 160 } as const

export interface BodyDisplay {
  readonly radius: number
  readonly orbitRadius: number
  /** Artistic initial position in radians, not an ephemeris. */
  readonly initialPhase: number
  readonly color: string
}
/** Scene units only: intentionally independent of scientific km/h/day values. */
export const bodyDisplay = {
  sun: { radius: 2.8, orbitRadius: 0, initialPhase: 0, color: '#ffc56d' },
  mercury: { radius: 0.5, orbitRadius: 5.5, initialPhase: 0.4, color: '#a9a39b' },
  venus: { radius: 0.85, orbitRadius: 8, initialPhase: 2.4, color: '#d9b879' },
  earth: { radius: 0.9, orbitRadius: 10.5, initialPhase: 4.2, color: '#518bc4' },
  mars: { radius: 0.65, orbitRadius: 13, initialPhase: 5.5, color: '#c07855' },
  jupiter: { radius: 2.1, orbitRadius: 17.5, initialPhase: 1, color: '#d6b799' },
  saturn: { radius: 1.8, orbitRadius: 23.5, initialPhase: 3.25, color: '#d3c393' },
  uranus: { radius: 1.3, orbitRadius: 29, initialPhase: 5, color: '#8cc7ce' },
  neptune: { radius: 1.25, orbitRadius: 34.5, initialPhase: 2.1, color: '#5278c6' },
  moon: { radius: 0.245, orbitRadius: 3.6, initialPhase: 0.7, color: '#bab9b5' },
  io: { radius: 0.26, orbitRadius: 3.5, initialPhase: 0.4, color: '#d2b769' },
  europa: { radius: 0.23, orbitRadius: 4.9, initialPhase: 2.1, color: '#c9b9a0' },
  ganymede: { radius: 0.38, orbitRadius: 6.5, initialPhase: 3.7, color: '#a69b89' },
  callisto: { radius: 0.35, orbitRadius: 8.2, initialPhase: 5.3, color: '#8e8378' },
  mimas: { radius: 0.15, orbitRadius: 4.45, initialPhase: 0.2, color: '#c9c5bd' },
  enceladus: { radius: 0.18, orbitRadius: 5.25, initialPhase: 1.2, color: '#e2e5e4' },
  tethys: { radius: 0.23, orbitRadius: 6.1, initialPhase: 2.4, color: '#d3d0c8' },
  dione: { radius: 0.25, orbitRadius: 7.05, initialPhase: 3.7, color: '#c7c7c5' },
  rhea: { radius: 0.3, orbitRadius: 8.15, initialPhase: 5.0, color: '#c2c0ba' },
  titan: { radius: 0.39, orbitRadius: 9.8, initialPhase: 1.8, color: '#d3b17b' },
  iapetus: { radius: 0.29, orbitRadius: 12.0, initialPhase: 4.4, color: '#a69b85' },

  ceres: { radius: 0.23, orbitRadius: 14.78, initialPhase: 2.7, color: '#a7a49b' },
  vesta: { radius: 0.18, orbitRadius: 14.22, initialPhase: 5.8, color: '#a59b89' },
  pluto: { radius: 0.55, orbitRadius: 45, initialPhase: 1.1, color: '#b5a08c' },
  eris: { radius: 0.55, orbitRadius: 75, initialPhase: 3.9, color: '#c1c7ce' },
  haumea: { radius: 0.5, orbitRadius: 50, initialPhase: 2.4, color: '#c9c5bc' },
  makemake: { radius: 0.43, orbitRadius: 55, initialPhase: 5.6, color: '#b58c72' },
  halley: { radius: 0.26, orbitRadius: 24, initialPhase: 0, color: '#82776b' },
} as const satisfies Record<BodyId, BodyDisplay>

export const sceneConfig = {
  background: '#070b12',
  camera: { fov: 45, near: 0.1, far: 1000, framingMargin: 1.18, elevation: Math.PI / 4 },
  sphereSegments: [32, 24] as const,
  orbitSegments: 192,
  selectionOutlineScale: 1.04,
  orbitColor: '#63768d',
  orbitOpacity: 0.2,
  focusedOrbitOpacity: 0.045,
  light: { ambient: 0.45, sunIntensity: 3, decay: 0 },
  starfield: { count: 2400, innerRadius: 400, outerRadius: 520, brightCount: 180, faintSize: 0.7, brightSize: 1.3, faintOpacity: 0.48, brightOpacity: 0.8 },
} as const

export function bodyVisualRadius(id: BodyId) {
  return bodyDisplay[id].radius * (id === 'saturn' ? saturnRingConfig.outerScale : id === 'sun' ? solarVisual.coronaScale : 1)
}
export const earthMoonSystemRadius = bodyDisplay.moon.orbitRadius + bodyDisplay.moon.radius * 1.2
/** Sum parent-relative orbit radii so outer moons also fit the optional full-system view. */
export function orbitalEnvelope(id: BodyId): number {
  const body = bodies.find(body => body.id === id)!
  return bodyDisplay[id].orbitRadius + (body.orbit ? orbitalEnvelope(body.orbit.center) : 0)
}
export const overviewRadius = Math.max(...bodies.filter(body => body.kind !== 'comet' && !outerBodyIds.some(id => id === body.id)).map(body => orbitalEnvelope(body.id) + bodyVisualRadius(body.id)))

export const outerOverviewRadius = Math.max(62, ...bodies.map(body => orbitalEnvelope(body.id) + bodyVisualRadius(body.id)))
export function bodyShape(id: BodyId): [number, number, number] { return id === 'halley' ? [1, 0.55, 0.55] : id === 'haumea' ? [1, 0.52, 0.65] : [1, 1, 1] }
