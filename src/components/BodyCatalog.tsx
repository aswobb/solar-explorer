import { useState } from 'react'
import {orbiterIds,type OrbiterId,type MissionId} from '../data/spacecraft'
import {spaceTexts} from '../locales/spacecraft'
import {releaseTexts} from '../locales/release'
import {explorerFilters,filterExplorerCatalog,explorerTargetCount,type ExplorerFilter} from '../data/explorerCatalog'
import type { BodyId } from '../data/types'
import { useLocale } from '../locales/LocaleProvider'
import { explorationTexts } from '../locales/exploration'
export function BodyCatalog({ onSelect,onOrbiter,onMission }: { onSelect: (id: BodyId) => void;onOrbiter:(id:OrbiterId)=>void;onMission:(id:MissionId)=>void }) {
  const { locale, messages: t } = useLocale()
  const copy = explorationTexts[locale],ui=releaseTexts[locale],space=spaceTexts[locale]
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ExplorerFilter>('all')
  const {bodies:results,crafts}=filterExplorerCatalog(filter,query)
  return <details className="display-settings body-catalog"><summary>{ui.catalog}</summary>
    <div className="catalog-controls"><label>{ui.search}<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <label>{ui.filter}<select value={filter} onChange={event => setFilter(event.target.value as ExplorerFilter)}>{explorerFilters.map(kind => <option key={kind} value={kind}>{kind==='earth-satellite'?ui.earthSatellite:kind==='deep-space-probe'?ui.deepProbe:copy.catalogCategories[kind]}</option>)}</select></label>
    <output aria-live="polite">{ui.matches}: {results.length+crafts.length} / {explorerTargetCount}</output></div>
    {results.length+crafts.length ? <ul className="catalog-results">{results.map(body => <li key={body.id}><button type="button" data-catalog-body={body.id} onClick={() => onSelect(body.id)}><span>{t.bodies[body.id].name}</span><small>{t.details.classes[body.kind === 'star' ? 'star' : body.classification]}{body.kind === 'moon' ? ` · ${t.bodies[body.orbit.center].name}` : 'population' in body ? ` · ${copy.populations[body.population]}` : ''}</small></button></li>)}{crafts.map(id=><li key={id}><button type="button" data-catalog-craft={id} onClick={()=>orbiterIds.includes(id as OrbiterId)?onOrbiter(id as OrbiterId):onMission(id as MissionId)}><span>{space[id]}</span><small>{orbiterIds.includes(id as OrbiterId)?ui.earthSatellite:ui.deepProbe}</small></button></li>)}</ul> : <p className="catalog-empty">{ui.empty}</p>}
  </details>
}
