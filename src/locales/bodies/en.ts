import type { BodyDictionary } from '../../data/types'
export const bodyTexts = {
  halley: { name: "Halley’s Comet", summary: "A periodic comet returning roughly every 76 years, with a coma and two tails near the Sun." },
  pluto: { name: 'Pluto', summary: 'A dwarf planet beyond Neptune, with an icy surface imaged up close by New Horizons.' },
  eris: { name: 'Eris', summary: 'A scattered-disk dwarf planet with a highly inclined orbit extending beyond the main Kuiper belt.' },
  haumea: { name: 'Haumea', summary: 'A rapidly rotating trans-Neptunian dwarf planet with a distinctly elongated shape.' },
  makemake: { name: 'Makemake', summary: 'An icy trans-Neptunian dwarf planet without close-range surface imagery.' },

  ceres: { name: 'Ceres', summary: 'The largest body in the main asteroid belt, classified as a dwarf planet. Dawn studied bright salt deposits on its surface.' },
  vesta: { name: 'Vesta', summary: 'A large rocky main-belt asteroid with giant impact basins, explored at close range by Dawn.' },
  mimas: { name: 'Mimas', summary: 'A heavily cratered moon known for its enormous Herschel impact crater.' },
  enceladus: { name: 'Enceladus', summary: 'A bright icy moon that ejects plumes containing water and ice from its south polar region.' },
  tethys: { name: 'Tethys', summary: 'An icy moon with the enormous Odysseus crater and the Ithaca Chasma canyon.' },
  dione: { name: 'Dione', summary: 'A cratered icy moon with bright streaks formed by steep ice cliffs.' },
  rhea: { name: 'Rhea', summary: 'The second-largest Saturnian moon, with a heavily cratered icy surface.' },
  iapetus: { name: 'Iapetus', summary: 'A moon with strongly contrasting bright and dark hemispheres and an equatorial ridge.' },

  io: { name: 'Io', summary: 'A volcanically active Jovian moon with volcanoes and sulfur-rich deposits.' },
  europa: { name: 'Europa', summary: 'An icy Jovian moon with evidence for a liquid ocean beneath its crust.' },
  ganymede: { name: 'Ganymede', summary: 'The largest natural satellite in the solar system, with its own magnetic field.' },
  callisto: { name: 'Callisto', summary: 'The outermost Galilean moon, with an ancient, heavily cratered surface.' },
  titan: { name: 'Titan', summary: 'The largest Saturnian moon, with a dense atmosphere and lakes of liquid methane and ethane.' },

  moon: { name: 'Moon', summary: 'Earth’s only natural satellite. Tidal locking keeps approximately the same face toward Earth.' },
  sun: { name: 'Sun', summary: 'The only star in our Solar System. Its rotation rate varies with latitude.' },
  mercury: { name: 'Mercury', summary: 'The rocky planet closest to the Sun.' },
  venus: { name: 'Venus', summary: 'The second rocky planet from the Sun, rotating in the opposite direction to Earth.' },
  earth: { name: 'Earth', summary: 'Our home, the third rocky planet from the Sun.' },
  mars: { name: 'Mars', summary: 'The fourth rocky planet from the Sun, with a rotation period close to Earth’s.' },
  jupiter: { name: 'Jupiter', summary: 'The largest planet in our Solar System, classified as a gas giant.' },
  saturn: { name: 'Saturn', summary: 'A ringed gas giant, sixth from the Sun.' },
  uranus: { name: 'Uranus', summary: 'The seventh planet from the Sun: an ice giant with a strongly tilted rotation axis.' },
  neptune: { name: 'Neptune', summary: 'An ice giant and the most distant of the eight planets from the Sun.' },
} as const satisfies BodyDictionary
