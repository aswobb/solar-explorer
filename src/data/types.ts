/** Stable IDs shared by science data, translations and future scene selection. */
export const planetIds = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const
export const moonIds = ['moon', 'io', 'europa', 'ganymede', 'callisto', 'mimas', 'enceladus', 'tethys', 'dione', 'rhea', 'titan', 'iapetus'] as const
export type MoonId = typeof moonIds[number]
export type SatelliteSystemId = 'earth' | 'jupiter' | 'saturn'
export const smallBodyIds = ['ceres', 'vesta'] as const
export type SmallBodyId = typeof smallBodyIds[number]
export const outerBodyIds = ['pluto', 'eris', 'haumea', 'makemake'] as const
export type OuterBodyId = typeof outerBodyIds[number]
export const bodyIds = ['sun', ...planetIds, ...moonIds, ...smallBodyIds, ...outerBodyIds, 'halley'] as const
export type PlanetId = typeof planetIds[number]
export type BodyId = typeof bodyIds[number]
export type PlanetClass = 'terrestrial' | 'gas-giant' | 'ice-giant'
export type SourceId = 'jpl-halley' | 'nasa-halley' | 'jpl-physical' | 'nasa-planetary' | 'nasa-sun' | 'nasa-notes' | 'nasa-system' | 'nasa-planets' | 'nasa-moon' | 'nasa-jovian' | 'nasa-saturnian' | 'nasa-io' | 'nasa-europa' | 'nasa-ganymede' | 'nasa-callisto' | 'nasa-titan' | 'jpl-satellite-physical' | 'nasa-mimas' | 'nasa-enceladus' | 'nasa-tethys' | 'nasa-dione' | 'nasa-rhea' | 'nasa-iapetus' | 'jpl-ceres' | 'jpl-vesta' | 'nasa-ceres' | 'nasa-vesta' | 'nasa-asteroids' | 'nasa-pluto' | 'nasa-eris' | 'nasa-haumea' | 'nasa-makemake' | 'nasa-kuiper' | 'nasa-pluto-facts' | 'jpl-dwarf-physical' | 'jpl-eris' | 'jpl-haumea' | 'jpl-makemake'
export interface Quantity<U extends string> {
  readonly value: number
  readonly unit: U
  readonly source: SourceId
}
export interface CommonBody {
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
    readonly center: BodyId
    /** Semi-major axis, not current distance. */
    readonly semiMajorAxis: Quantity<'km'>
    readonly siderealPeriod: Quantity<'d'>
    readonly obliquity: Quantity<'deg'>
  }
}
export interface Moon extends CommonBody {
  readonly id: MoonId
  readonly kind: 'moon'
  readonly classification: 'moon'
  readonly rotationModel: { readonly kind: 'tidally-locked' }
  readonly orbit: { readonly center: SatelliteSystemId; readonly semiMajorAxis: Quantity<'km'>; readonly siderealPeriod: Quantity<'d'>; readonly obliquity?: Quantity<'deg'> }
}
export interface SmallBody extends CommonBody {
  readonly id: SmallBodyId
  readonly kind: 'dwarf-planet' | 'asteroid'
  readonly classification: 'dwarf-planet' | 'asteroid'
  readonly rotationModel: { readonly kind: 'representative' }
  readonly orbit: { readonly center: 'sun'; readonly semiMajorAxis: Quantity<'km'>; readonly siderealPeriod: Quantity<'d'>; readonly obliquity?: Quantity<'deg'> }
}
export interface OuterDwarf extends CommonBody {
  readonly id: OuterBodyId
  readonly kind: 'dwarf-planet'
  readonly classification: 'dwarf-planet'
  readonly population: 'trans-neptunian' | 'scattered-disk'
  readonly appearance: 'mapped' | 'illustrative'
  readonly rotationModel: { readonly kind: 'representative' }
  readonly orbit: { readonly center: 'sun'; readonly semiMajorAxis: Quantity<'km'>; readonly siderealPeriod: Quantity<'d'>; readonly inclination: Quantity<'deg'>; readonly obliquity?: Quantity<'deg'> }
}
export interface Comet extends Omit<CommonBody, 'siderealRotation'> {
  readonly id: 'halley'
  readonly kind: 'comet'
  readonly classification: 'comet'
  readonly siderealRotation: null
  readonly rotationModel: { readonly kind: 'illustrative' }
  readonly orbit: { readonly center: 'sun'; readonly semiMajorAxis: Quantity<'km'>; readonly siderealPeriod: Quantity<'d'>; readonly inclination: Quantity<'deg'>; readonly eccentricity: Quantity<'1'>; readonly ascendingNode: Quantity<'deg'>; readonly argumentPeriapsis: Quantity<'deg'>; readonly epochJD: number }
}
export type CelestialBody = Star | Planet | Moon | SmallBody | OuterDwarf | Comet
export interface BodyText { readonly name: string; readonly summary: string }
export type BodyDictionary = Readonly<Record<BodyId, BodyText>>

/** Extensible catalog contracts; concrete IDs are registered when content ships. */
export type CatalogKind = 'star' | 'planet' | 'moon' | 'dwarf-planet' | 'asteroid' | 'comet' | 'spacecraft'
export interface CatalogEntry<Id extends string = string> {
  readonly id: Id
  readonly kind: CatalogKind
  readonly orbit: { readonly center: Id } | null
}
export interface RegionDefinition {
  readonly id: string
  readonly kind: 'asteroid-belt' | 'kuiper-belt' | 'oort-cloud'
  readonly estimatedRangeKm: readonly [number, number]
  readonly sources: readonly string[]
}

/** Future content can share physical quantities without widening current texture IDs. */
export interface PhysicalCatalogEntry<Id extends string = string> extends CatalogEntry<Id> {
  readonly meanRadius: Quantity<'km'>
  readonly siderealRotation: Quantity<'h'>
  readonly descriptionSources: readonly string[]
  readonly orbit: ({ readonly center: Id; readonly semiMajorAxis: Quantity<'km'>; readonly siderealPeriod: Quantity<'d'>; readonly obliquity?: Quantity<'deg'> }) | null
}
