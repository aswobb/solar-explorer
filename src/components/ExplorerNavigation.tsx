import {useLocale} from '../locales/LocaleProvider'
import {releaseTexts} from '../locales/release'
import {explorationTexts} from '../locales/exploration'
import {spaceTexts} from '../locales/spacecraft'
import {oortTexts} from '../locales/oort'
import {cometTexts} from '../locales/comet'
import {satelliteSystemIds} from '../scene/satelliteSystems'
import type {SatelliteSystemId} from '../data/types'
import {missionIds,type MissionId} from '../data/spacecraft'
export function ExplorerNavigation({onHome,onBack,onRestore,canBack,canRestore,onSystem,onOrbit,onMission,onComet,onOuter,onOort,mission,outer,oort}:{onHome:()=>void;onBack:()=>void;onRestore:()=>void;canBack:boolean;canRestore:boolean;onSystem:(id:SatelliteSystemId)=>void;onOrbit:()=>void;onMission:(id:MissionId)=>void;onComet:()=>void;onOuter:()=>void;onOort:()=>void;mission:MissionId|null;outer:boolean;oort:boolean}) {
 const {locale}=useLocale(),ui=releaseTexts[locale],e=explorationTexts[locale],s=spaceTexts[locale],o=oortTexts[locale],c=cometTexts[locale]
 return <section className="explorer-navigation" aria-label={ui.navigation}><nav className="parent-navigation"><button className="overview-entry" type="button" onClick={onHome}>{ui.home}</button><button className="parent-entry" type="button" disabled={!canBack} onClick={onBack}>{mission?s.exit:e.back}</button>{canRestore&&<button className="restore-view" type="button" onClick={onRestore}>{o.restore}</button>}</nav><details open><summary>{ui.entries}</summary><nav className="system-navigation">{satelliteSystemIds.map(id=><button key={id} type="button" disabled={!!mission} onClick={()=>onSystem(id)}>{e.systemNames[id]}</button>)}<button type="button" className="earth-orbit-entry" disabled={!!mission} onClick={onOrbit}>{s.enterOrbit}</button><button className="comet-entry" type="button" disabled={!!mission} onClick={onComet}>{c.enter}</button>{missionIds.map(id=><button key={id} className={`mission-entry mission-${id}`} type="button" aria-current={mission===id?'true':undefined} onClick={()=>onMission(id)}>{s[id]}</button>)}</nav><nav className="scale-navigation" aria-label={o.zoom}><button type="button" disabled={!!mission} aria-current={!outer&&!oort&&!mission?'step':undefined} onClick={onHome}>01 · {o.planets}</button><span aria-hidden="true">→</span><button type="button" className="outer-entry" disabled={!!mission} aria-current={outer?'step':undefined} onClick={onOuter}>02 · {o.kuiper}</button><span aria-hidden="true">→</span><button type="button" className="oort-entry" disabled={!!mission} aria-current={oort?'step':undefined} onClick={onOort}>03 · {o.oort}</button></nav></details></section>
}
export type LayerOption={id:string;label:string;checked:boolean;onChange:(value:boolean)=>void}
export function ExplorerLayers({options}:{options:LayerOption[]}) {
 const {locale}=useLocale()
 return <details className="display-settings explorer-layers" open><summary>{releaseTexts[locale].layers}</summary><div className="layer-options">{options.map(o=><label key={o.id}><input type="checkbox" checked={o.checked} onChange={e=>o.onChange(e.target.checked)}/>{o.label}</label>)}</div></details>
}
