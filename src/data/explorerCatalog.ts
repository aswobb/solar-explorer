import {catalogFilters,filterCatalog,type CatalogFilter} from './catalog.ts'
import {bodies} from './bodies.ts'
import {orbiterIds,missionIds,type OrbiterId,type MissionId} from './spacecraft.ts'
import {spaceTexts} from '../locales/spacecraft.ts'
export const explorerFilters=[...catalogFilters,'earth-satellite','deep-space-probe'] as const
export type ExplorerFilter=typeof explorerFilters[number]
export const explorerTargetCount=bodies.length+orbiterIds.length+missionIds.length
const normalize=(s:string)=>s.normalize('NFKC').toLocaleLowerCase().trim()
export function filterExplorerCatalog(filter:ExplorerFilter,query:string) {
 const term=normalize(query),crafts=[...orbiterIds,...missionIds].filter(id=>(filter==='all'||filter==='earth-satellite'&&orbiterIds.includes(id as OrbiterId)||filter==='deep-space-probe'&&missionIds.includes(id as MissionId))&&[id,...Object.values(spaceTexts).map(t=>t[id])].some(s=>normalize(s).includes(term)))
 const celestial=filter==='earth-satellite'||filter==='deep-space-probe'?[]:filterCatalog(filter as CatalogFilter,query)
 return {bodies:celestial,crafts}
}
