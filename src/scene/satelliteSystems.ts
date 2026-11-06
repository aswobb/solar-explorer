import { bodies, moons } from '../data/bodies.ts'
import type { BodyId, SatelliteSystemId } from '../data/types.ts'
import { bodyDisplay, bodyVisualRadius } from './displayConfig.ts'
export const satelliteSystemIds = ['earth', 'jupiter', 'saturn'] as const
export type SystemRequest = { id: number; center: SatelliteSystemId } | null
export function isSatelliteSystem(id: string): id is SatelliteSystemId {
  return satelliteSystemIds.some(center => center === id)
}
export function satelliteParent(id: BodyId): SatelliteSystemId | null {
  return moons.find(moon => moon.id === id)?.orbit.center ?? null
}
export function systemVisualRadius(center: SatelliteSystemId): number {
  return Math.max(bodyVisualRadius(center), ...moons.filter(moon => moon.orbit.center === center).map(moon => bodyDisplay[moon.id].orbitRadius + bodyVisualRadius(moon.id) * 1.2))
}
export function visibleBodyIds(center: SatelliteSystemId | null, showMoons: boolean, showBelt = false, showOuter = false, showComet = false): BodyId[] {
  return bodies.filter(body => center ? body.id === center || showMoons && body.kind === 'moon' && body.orbit.center === center : body.kind === 'comet' ? showComet : 'population' in body ? showOuter : body.kind === 'moon' ? showMoons : body.kind === 'asteroid' || body.kind === 'dwarf-planet' ? showBelt : true).map(body => body.id)
}
