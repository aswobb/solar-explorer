import { cometTexts } from '../locales/comet'
import { smallBodyIds } from '../data/types'
import type { ReactNode } from 'react'
import { isSatelliteSystem } from '../scene/satelliteSystems'
import type { SatelliteSystemId } from '../data/types'
import { bodies } from '../data/bodies'
import type { BodyId, CelestialBody, SourceId } from '../data/types'
import { scienceSources } from '../data/sources'
import { bodySourceIds } from '../data/bodyDetails'
import { formatRotationHours, formatScientificValue } from '../data/format'
import { explorationTexts } from '../locales/exploration'
import { useLocale } from '../locales/LocaleProvider'

function FactRow({ label, children, source, sources, sourceLabel }: { label: string; children: ReactNode; source?: SourceId; sources: SourceId[]; sourceLabel: string }) {
  return <div className="fact-row"><dt>{label}</dt><dd>{children}{source && <a className="fact-source" href={scienceSources[source].url} target="_blank" rel="noopener noreferrer" aria-label={`${sourceLabel}: ${scienceSources[source].title}`}>[{sources.indexOf(source) + 1}]</a>}</dd></div>
}

export function BodyDetails({ bodyId, onExploreSystem }: { bodyId: BodyId; onExploreSystem?: (center: SatelliteSystemId) => void }) {
  const { locale, messages: t } = useLocale()
  const body: CelestialBody | undefined = bodies.find(item => item.id === bodyId)
  if (!body) return null
  const copy = t.details
  const sources = bodySourceIds(body)
  const direction = (body.siderealRotation?.value ?? 0) < 0 ? copy.retrograde : copy.prograde
  const rowProps = { sources, sourceLabel: copy.source }
  return <section className="body-details" data-body-details={body.id} aria-labelledby="body-profile-name">
    <p className="eyebrow">{copy.heading}</p>
    <h2 id="body-profile-name">{t.bodies[body.id].name}</h2>
    <p className="body-class">{copy.classes[body.kind === 'star' ? 'star' : body.classification]}</p>
    <p className="body-summary">{t.bodies[body.id].summary}</p>
    {isSatelliteSystem(bodyId) && onExploreSystem && <button className="earth-system-entry" type="button" onClick={() => onExploreSystem(bodyId)}>{explorationTexts[locale].exploreSystem}</button>}
    {body.kind === 'moon' && <p>{copy.parent}: <button className="parent-system-link" type="button" onClick={() => onExploreSystem?.(body.orbit.center)}>{t.bodies[body.orbit.center].name} · {explorationTexts[locale].exploreSystem}</button></p>}
    {'population' in body && <p>{explorationTexts[locale].population}: {explorationTexts[locale].populations[body.population]}</p>}
    <p className="real-values-note">{copy.realValues}</p>
    {body.kind === 'comet' && <details className="comet-science"><summary>{copy.sources}</summary><p>{cometTexts[locale].science}</p></details>}
    <dl className="body-facts">
      {body.kind === 'comet' && <FactRow {...rowProps} label={cometTexts[locale].eccentricity} source={body.orbit.eccentricity.source}>{body.orbit.eccentricity.value.toFixed(6)}</FactRow>}
      <FactRow {...rowProps} label={copy.radius} source={body.meanRadius.source}>{formatScientificValue(body.meanRadius.value, 'km', locale)}</FactRow>
      {body.siderealRotation && <FactRow {...rowProps} label={copy.rotationPeriod} source={body.siderealRotation.source}>{formatRotationHours(body.siderealRotation.value, locale)}<span className="rotation-direction">{direction}</span></FactRow>}
      <FactRow {...rowProps} label={copy.distance} source={body.orbit?.semiMajorAxis.source}>{body.orbit ? formatScientificValue(body.orbit.semiMajorAxis.value, 'km', locale, 0) : copy.notApplicable}</FactRow>
      <FactRow {...rowProps} label={copy.orbitPeriod} source={body.orbit?.siderealPeriod.source}>{body.orbit ? formatScientificValue(body.orbit.siderealPeriod.value, 'd', locale) : copy.notApplicable}</FactRow>
      {body.orbit && 'obliquity' in body.orbit && body.orbit.obliquity && <FactRow {...rowProps} label={copy.tilt} source={body.orbit.obliquity.source}>{formatScientificValue(body.orbit.obliquity.value, 'deg', locale)}</FactRow>}
      {body.orbit && 'inclination' in body.orbit && <FactRow {...rowProps} label={explorationTexts[locale].inclination} source={body.orbit.inclination.source}>{formatScientificValue(body.orbit.inclination.value, 'deg', locale)}</FactRow>}
    </dl>
    <div className="body-notes">
      {body.kind === 'moon' ? <><p>{copy.moonNote}</p>{body.id === 'titan' && <p>{explorationTexts[locale].titanSurface}</p>}{['mimas', 'enceladus', 'tethys', 'dione', 'rhea', 'iapetus'].includes(body.id) && <p>{explorationTexts[locale].surfaceCoverage}</p>}</> : body.kind === 'star' ? <><p>{copy.solarOrbitNote}</p><p>{copy.solarRotationNote}</p></> : body.kind !== 'comet' ? <p>{copy.directionNote}</p> : null}
      {smallBodyIds.some(id => id === body.id) && <p>{explorationTexts[locale].smallBodyNote}</p>}{'population' in body && <><p>{explorationTexts[locale].outerNote}</p><p>{body.appearance === 'illustrative' ? explorationTexts[locale].artAppearance : explorationTexts[locale].mappedPluto}</p></>}<p>{copy.definitionNote}</p><p>{copy.precisionNote}</p>
    </div>
    <details className="body-sources"><summary>{copy.sources}</summary><ol>{sources.map((sourceId, index) => { const source = scienceSources[sourceId]; return <li key={sourceId}><span className="source-number">[{index + 1}]</span><div><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><p>{source.publisher}</p><p>{copy.checked}: <time dateTime={source.accessedOn}>{source.accessedOn}</time></p></div></li> })}</ol></details>
  </section>
}
