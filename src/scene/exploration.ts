import { outerBodyIds } from '../data/types.ts'
import { satelliteParent, isSatelliteSystem } from './satelliteSystems.ts'
import type { BodyId, SatelliteSystemId } from '../data/types.ts'
export type ExplorationView = {kind:'earth-orbit'} | {kind:'mission'} | { kind: 'oort' } | { kind: 'overview' } | { kind: 'body'; center: BodyId } | { kind: 'system'; center: SatelliteSystemId } | { kind: 'outer'; region: string }
export interface LayerSettings { orbits: boolean; labels: boolean; moons: boolean; regions: boolean; kuiper: boolean }
export const defaultLayers: LayerSettings = { orbits: true, labels: true, moons: false, regions: true, kuiper: false }
export function parentView(view: ExplorationView): ExplorationView {
  if(view.kind==='earth-orbit')return {kind:'body',center:'earth'}
  if (view.kind === 'oort') return {kind:'outer',region:'kuiper'}
  if (view.kind === 'body') {
    if (outerBodyIds.some(id => id === view.center)) return { kind: 'outer', region: 'kuiper' }
    const parent = satelliteParent(view.center)
    if (parent) return { kind: 'system', center: parent }
  }
  if (view.kind === 'system' && isSatelliteSystem(view.center)) return { kind: 'body', center: view.center }
  return { kind: 'overview' }
}
export function visibleSelection<Id extends string>(selected: Id | null, visible: ReadonlySet<Id>): Id | null {
  return selected !== null && visible.has(selected) ? selected : null
}
export interface ViewDisplay { radius: number; near: number; far: number; units: 'schematic' }
export function viewDisplay(radius: number): ViewDisplay {
  if (!Number.isFinite(radius) || radius <= 0) throw new RangeError('Invalid view extent')
  return { radius, near: Math.max(0.01, radius / 10000), far: Math.max(1000, radius * 30), units: 'schematic' }
}
