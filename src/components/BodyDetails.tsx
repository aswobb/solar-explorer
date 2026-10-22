import type { ReactNode } from 'react'
import { bodies } from '../data/bodies'
import type { BodyId, CelestialBody, SourceId } from '../data/types'
import { scienceSources } from '../data/sources'
import { bodySourceIds } from '../data/bodyDetails'
import { formatRotationHours, formatScientificValue } from '../data/format'
import { useLocale } from '../locales/LocaleProvider'

function FactRow({ label, children, source, sources, sourceLabel }: { label: string; children: ReactNode; source?: SourceId; sources: SourceId[]; sourceLabel: string }) {
  return <div className="fact-row"><dt>{label}</dt><dd>{children}{source && <a className="fact-source" href={scienceSources[source].url} target="_blank" rel="noopener noreferrer" aria-label={`${sourceLabel}: ${scienceSources[source].title}`}>[{sources.indexOf(source) + 1}]</a>}</dd></div>
}

export function BodyDetails({ bodyId }: { bodyId: BodyId }) {
  const { locale, messages: t } = useLocale()
  const body: CelestialBody | undefined = bodies.find(item => item.id === bodyId)
  if (!body) return null
  const copy = t.details
  const sources = bodySourceIds(body)
  const direction = body.siderealRotation.value < 0 ? copy.retrograde : copy.prograde
  const rowProps = { sources, sourceLabel: copy.source }
  return <section className="body-details" data-body-details={body.id} aria-labelledby="body-profile-name">
    <p className="eyebrow">{copy.heading}</p>
    <h2 id="body-profile-name">{t.bodies[body.id].name}</h2>
    <p className="body-class">{copy.classes[body.kind === 'star' ? 'star' : body.classification]}</p>
    <p className="body-summary">{t.bodies[body.id].summary}</p>
    <p className="real-values-note">{copy.realValues}</p>
    <dl className="body-facts">
      <FactRow {...rowProps} label={copy.radius} source={body.meanRadius.source}>{formatScientificValue(body.meanRadius.value, 'km', locale)}</FactRow>
      <FactRow {...rowProps} label={copy.rotationPeriod} source={body.siderealRotation.source}>{formatRotationHours(body.siderealRotation.value, locale)}<span className="rotation-direction">{direction}</span></FactRow>
      <FactRow {...rowProps} label={copy.distance} source={body.orbit?.semiMajorAxis.source}>{body.orbit ? formatScientificValue(body.orbit.semiMajorAxis.value, 'km', locale, 0) : copy.notApplicable}</FactRow>
      <FactRow {...rowProps} label={copy.orbitPeriod} source={body.orbit?.siderealPeriod.source}>{body.orbit ? formatScientificValue(body.orbit.siderealPeriod.value, 'd', locale) : copy.notApplicable}</FactRow>
      {body.orbit && <FactRow {...rowProps} label={copy.tilt} source={body.orbit.obliquity.source}>{formatScientificValue(body.orbit.obliquity.value, 'deg', locale)}</FactRow>}
    </dl>
    <div className="body-notes">
      {body.kind === 'star' ? <><p>{copy.solarOrbitNote}</p><p>{copy.solarRotationNote}</p></> : <p>{copy.directionNote}</p>}
      <p>{copy.definitionNote}</p><p>{copy.precisionNote}</p>
    </div>
    <details className="body-sources"><summary>{copy.sources}</summary><ol>{sources.map((sourceId, index) => { const source = scienceSources[sourceId]; return <li key={sourceId}><span className="source-number">[{index + 1}]</span><div><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><p>{source.publisher}</p><p>{copy.checked}: <time dateTime={source.accessedOn}>{source.accessedOn}</time></p></div></li> })}</ol></details>
  </section>
}
