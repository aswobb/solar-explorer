import type { CelestialBody, SourceId } from './types'
/** Reference order follows the numerical rows first, then explanatory sources. */
export function bodySourceIds(body: CelestialBody): SourceId[] {
  const sources: SourceId[] = [body.meanRadius.source, body.siderealRotation.source]
  if (body.orbit) sources.push(body.orbit.semiMajorAxis.source, body.orbit.siderealPeriod.source, body.orbit.obliquity.source)
  if (body.kind === 'star') sources.push(body.rotationModel.referenceLatitude.source)
  sources.push(...body.descriptionSources, 'nasa-notes')
  return [...new Set(sources)]
}
