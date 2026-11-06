import type { CatalogEntry } from '../data/types.ts'
export function buildHierarchy<T extends CatalogEntry>(entries: readonly T[]) {
  const byId = new Map<string, T>()
  const children = new Map<string, T[]>()
  for (const entry of entries) {
    if (byId.has(entry.id)) throw new Error(`Duplicate body: ${entry.id}`)
    byId.set(entry.id, entry)
    children.set(entry.id, [])
  }
  const ordered: T[] = []
  const visiting = new Set<string>()
  const visited = new Set<string>()
  function visit(entry: T) {
    if (visiting.has(entry.id)) throw new Error(`Orbit cycle: ${entry.id}`)
    if (visited.has(entry.id)) return
    visiting.add(entry.id)
    if (entry.orbit) {
      const parent = byId.get(entry.orbit.center)
      if (!parent) throw new Error(`Missing parent: ${entry.orbit.center}`)
      visit(parent)
      children.get(parent.id)!.push(entry)
    }
    visiting.delete(entry.id)
    visited.add(entry.id)
    ordered.push(entry)
  }
  entries.forEach(visit)
  return { byId, children, ordered, roots: entries.filter(entry => !entry.orbit) }
}
/** Translation only: parent spin/obliquity never rotates a child's orbit frame. */
export function composeWorldPosition(parent: readonly number[], local: readonly number[]): [number, number, number] {
  return [parent[0] + local[0], parent[1] + local[1], parent[2] + local[2]]
}
