import type { BodyId } from '../data/types'
export type OrbitAction = 'left' | 'right' | 'up' | 'down'
export type CameraAction = 'reset' | 'outer' | 'oort' | 'in' | 'out' | OrbitAction
export interface CameraSnapshot { position:[number,number,number]; target:[number,number,number]; body:string|null; min:number; max:number; overview:'inner'|'outer'|'oort' }
export type CameraCommand = {readonly id:number;readonly action:'track';readonly objectName:string;readonly radius:number} | {readonly id:number;readonly action:'restore';readonly snapshot:CameraSnapshot} | { readonly id: number; readonly action: CameraAction } | { readonly id: number; readonly action: 'focus'; readonly bodyId: BodyId; readonly framing?: 'satellite-system' }
export const controlLimits = { minDistance: 12, maxDistance: 320, minPolar: 0.12, maxPolar: Math.PI / 2 - 0.08, zoomFactor: 0.8 } as const
export function orbitAngles(azimuth: number, polar: number, action: OrbitAction) {
  if (![azimuth, polar].every(Number.isFinite)) throw new RangeError('Invalid camera angle')
  const step = Math.PI / 12
  return {
    azimuth: azimuth + (action === 'left' ? -step : action === 'right' ? step : 0),
    polar: Math.min(controlLimits.maxPolar, Math.max(controlLimits.minPolar, polar + (action === 'up' ? -step : action === 'down' ? step : 0))),
  }
}
export function zoomDistance(distance: number, action: 'in' | 'out', min: number = controlLimits.minDistance, max: number = controlLimits.maxDistance): number {
  if (![distance,min,max].every(Number.isFinite) || distance <= 0 || min <= 0 || max < min) throw new RangeError('Invalid camera distance')
  const next = distance * (action === 'in' ? controlLimits.zoomFactor : 1 / controlLimits.zoomFactor)
  return Math.min(max, Math.max(min, next))
}
