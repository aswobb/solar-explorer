/** Stable IDs shared by science data, translations and future scene selection. */
export const planetIds = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const
export const bodyIds = ['sun', ...planetIds] as const
export type PlanetId = typeof planetIds[number]
export type BodyId = typeof bodyIds[number]
export type PlanetClass = 'terrestrial' | 'gas-giant' | 'ice-giant'
export type SourceId = 'jpl-physical' | 'nasa-planetary' | 'nasa-sun' | 'nasa-notes' | 'nasa-system' | 'nasa-planets'
export interface Quantity<U extends string> {
  readonly value: number
  readonly unit: U
  readonly source: SourceId
}
interface CommonBody {
  readonly id: BodyId
  readonly meanRadius: Quantity<'km'>
  /** Signed sidereal period: negative means retrograde in the source convention. Not solar day length. */
  readonly siderealRotation: Quantity<'h'>
  readonly descriptionSources: readonly SourceId[]
}
export interface Star extends CommonBody {
  readonly id: 'sun'
  readonly kind: 'star'
  readonly orbit: null
  readonly rotationModel: { readonly kind: 'differential'; readonly referenceLatitude: Quantity<'deg'> }
}
export interface Planet extends CommonBody {
  readonly id: PlanetId
  readonly kind: 'planet'
  readonly classification: PlanetClass
  readonly rotationModel: { readonly kind: 'representative' }
  readonly orbit: {
    readonly center: 'sun'
    /** Semi-major axis, not current distance. */
    readonly semiMajorAxis: Quantity<'km'>
    readonly siderealPeriod: Quantity<'d'>
    readonly obliquity: Quantity<'deg'>
  }
}
export type CelestialBody = Star | Planet
export interface BodyText { readonly name: string; readonly summary: string }
export type BodyDictionary = Readonly<Record<BodyId, BodyText>>
