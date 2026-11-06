import type { CelestialBody, SourceId } from './types'
/** Reference order follows the numerical rows first, then explanatory sources. */
export function bodySourceIds(body: CelestialBody): SourceId[] {
  const sources: SourceId[] = [body.meanRadius.source, ...(body.siderealRotation ? [body.siderealRotation.source] : [])]
  if (body.orbit) sources.push(body.orbit.semiMajorAxis.source, body.orbit.siderealPeriod.source)
  if (body.orbit && 'obliquity' in body.orbit && body.orbit.obliquity) sources.push(body.orbit.obliquity.source)
  if (body.orbit && 'inclination' in body.orbit) sources.push(body.orbit.inclination.source)
  if (body.kind === 'star') sources.push(body.rotationModel.referenceLatitude.source)
  sources.push(...body.descriptionSources, 'nasa-notes')
  return [...new Set(sources)]
}
