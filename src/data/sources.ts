import type { SourceId } from './types'

export interface ScienceSource {
  readonly title: string
  readonly publisher: string
  readonly url: string
  readonly accessedOn: string
}
export const scienceSources = {
  'jpl-physical': { title: 'Planetary Physical Parameters', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html', accessedOn: '2026-10-20' },
  'nasa-planetary': { title: 'Planetary Fact Sheet – Metric', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/', accessedOn: '2026-10-20' },
  'nasa-sun': { title: 'Sun Fact Sheet', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html', accessedOn: '2026-10-20' },
  'nasa-notes': { title: 'Notes on the Fact Sheets', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/fact_notes.html', accessedOn: '2026-10-20' },
  'nasa-system': { title: 'Solar System Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/solar-system-facts/', accessedOn: '2026-10-20' },
  'nasa-planets': { title: 'About the Planets', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/planets/', accessedOn: '2026-10-20' },
} as const satisfies Record<SourceId, ScienceSource>
