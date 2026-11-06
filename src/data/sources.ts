import type { SourceId } from './types'

export interface ScienceSource {
  readonly title: string
  readonly publisher: string
  readonly url: string
  readonly accessedOn: string
}
export const scienceSources = {
  'jpl-halley': { title: '1P/Halley — SBDB elements, epoch JD 2439875.5 TDB', publisher: 'NASA/JPL SSD', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1P&phys-par=1&full-prec=1', accessedOn: '2026-11-02' },
  'nasa-halley': { title: '1P/Halley', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/comets/1p-halley/', accessedOn: '2026-11-02' },
  'nasa-kuiper': { title: 'Kuiper Belt Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/kuiper-belt/facts/', accessedOn: '2026-11-02' },
  'jpl-dwarf-physical': { title: 'Dwarf Planet Physical Parameters (representative estimates)', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html', accessedOn: '2026-11-02' },
  'nasa-pluto-facts': { title: 'Pluto Fact Sheet', publisher: 'NASA GSFC', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html', accessedOn: '2026-11-02' },
  'nasa-pluto': { title: 'Pluto', publisher: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/pluto/', accessedOn: '2026-11-02' },
  'nasa-eris': { title: 'Eris', publisher: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/eris/', accessedOn: '2026-11-02' },
  'nasa-haumea': { title: 'Haumea', publisher: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/haumea/', accessedOn: '2026-11-02' },
  'nasa-makemake': { title: 'Makemake', publisher: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/makemake/', accessedOn: '2026-11-02' },
  'jpl-eris': { title: 'JPL SBDB: Eris snapshot', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=136199&phys-par=1&full-prec=1', accessedOn: '2026-11-02' },
  'jpl-haumea': { title: 'JPL SBDB: Haumea snapshot', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=136108&phys-par=1&full-prec=1', accessedOn: '2026-11-02' },
  'jpl-makemake': { title: 'JPL SBDB: Makemake snapshot', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=136472&phys-par=1&full-prec=1', accessedOn: '2026-11-02' },

  'jpl-ceres': { title: 'JPL SBDB: Ceres (2026-11-02 snapshot)', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1&phys-par=1&full-prec=1', accessedOn: '2026-11-02' },
  'jpl-vesta': { title: 'JPL SBDB: Vesta (2026-11-02 snapshot)', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=4&phys-par=1&full-prec=1', accessedOn: '2026-11-02' },
  'nasa-ceres': { title: 'Ceres Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/dwarf-planets/ceres/facts/', accessedOn: '2026-11-02' },
  'nasa-vesta': { title: 'Dawn: Vesta', publisher: 'NASA Science', url: 'https://science.nasa.gov/mission/dawn/science/vesta/', accessedOn: '2026-11-02' },
  'nasa-asteroids': { title: 'Asteroid Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/asteroids/facts/', accessedOn: '2026-11-02' },

  'jpl-satellite-physical': { title: 'Planetary Satellite Physical Parameters', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/sats/phys_par/sep.html', accessedOn: '2026-11-02' },
  'nasa-mimas': { title: 'Mimas', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/mimas/', accessedOn: '2026-11-02' },
  'nasa-enceladus': { title: 'Enceladus', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/enceladus/', accessedOn: '2026-11-02' },
  'nasa-tethys': { title: 'Tethys', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/tethys/', accessedOn: '2026-11-02' },
  'nasa-dione': { title: 'Dione', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/dione/', accessedOn: '2026-11-02' },
  'nasa-rhea': { title: 'Rhea', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/rhea/', accessedOn: '2026-11-02' },
  'nasa-iapetus': { title: 'Iapetus', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/iapetus/', accessedOn: '2026-11-02' },

  'nasa-jovian': { title: 'Jovian Satellite Fact Sheet', publisher: 'NASA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html', accessedOn: '2026-11-02' },
  'nasa-saturnian': { title: 'Saturnian Satellite Fact Sheet', publisher: 'NASA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html', accessedOn: '2026-11-02' },
  'nasa-io': { title: 'Io Facts', publisher: 'NASA', url: 'https://science.nasa.gov/jupiter/jupiter-moons/io/', accessedOn: '2026-11-02' },
  'nasa-europa': { title: 'Europa Facts', publisher: 'NASA', url: 'https://science.nasa.gov/jupiter/jupiter-moons/europa/', accessedOn: '2026-11-02' },
  'nasa-ganymede': { title: 'Ganymede Facts', publisher: 'NASA', url: 'https://science.nasa.gov/jupiter/jupiter-moons/ganymede/', accessedOn: '2026-11-02' },
  'nasa-callisto': { title: 'Callisto Facts', publisher: 'NASA', url: 'https://science.nasa.gov/jupiter/jupiter-moons/callisto/', accessedOn: '2026-11-02' },
  'nasa-titan': { title: 'Titan Facts', publisher: 'NASA', url: 'https://science.nasa.gov/saturn/moons/titan/facts/', accessedOn: '2026-11-02' },

  'nasa-moon': { title: 'Moon Fact Sheet', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html', accessedOn: '2026-11-02' },
  'jpl-physical': { title: 'Planetary Physical Parameters', publisher: 'NASA/JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html', accessedOn: '2026-10-20' },
  'nasa-planetary': { title: 'Planetary Fact Sheet – Metric', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/', accessedOn: '2026-10-20' },
  'nasa-sun': { title: 'Sun Fact Sheet', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html', accessedOn: '2026-10-20' },
  'nasa-notes': { title: 'Notes on the Fact Sheets', publisher: 'NASA GSFC / NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/fact_notes.html', accessedOn: '2026-10-20' },
  'nasa-system': { title: 'Solar System Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/solar-system-facts/', accessedOn: '2026-10-20' },
  'nasa-planets': { title: 'About the Planets', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/planets/', accessedOn: '2026-10-20' },
} as const satisfies Record<SourceId, ScienceSource>
