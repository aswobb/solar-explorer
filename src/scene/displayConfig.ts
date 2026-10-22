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
export const overviewRadius = Math.max(...(Object.keys(bodyDisplay) as BodyId[]).map(id => bodyDisplay[id].orbitRadius + bodyVisualRadius(id)))
