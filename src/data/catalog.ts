import { bodies } from './bodies.ts'
import { bodyTexts as zh } from '../locales/bodies/zh.ts'
import { bodyTexts as ja } from '../locales/bodies/ja.ts'
import { bodyTexts as en } from '../locales/bodies/en.ts'
export const catalogFilters = ['all', 'star', 'planet', 'moon', 'dwarf-planet', 'asteroid', 'comet'] as const
export type CatalogFilter = typeof catalogFilters[number]
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim()
export function filterCatalog(filter: CatalogFilter, query: string) {
  const term = normalize(query)
  return bodies.filter(body => (filter === 'all' || body.kind === filter) && [body.id, zh[body.id].name, ja[body.id].name, en[body.id].name].some(name => normalize(name).includes(term)))
}
