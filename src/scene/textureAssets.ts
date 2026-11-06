import type { BodyId } from '../data/types'

/** Local maps; null explicitly denotes unavailable surface imagery. Provenance and hashes: public/textures/ATTRIBUTION.md. */
export const textureFiles = {
  halley: null,
  pluto: 'pluto.jpg', eris: null, haumea: null, makemake: null,
  ceres: 'ceres.jpg', vesta: 'vesta.jpg',
  mimas: 'mimas.jpg', enceladus: 'enceladus.jpg', tethys: 'tethys.jpg', dione: 'dione.jpg', rhea: 'rhea.jpg', iapetus: 'iapetus.jpg',
  io: 'io.jpg', europa: 'europa.jpg', ganymede: 'ganymede.jpg', callisto: 'callisto.jpg', titan: 'titan.jpg', moon: 'moon.jpg', sun: 'sun.jpg', mercury: 'mercury.jpg', venus: 'venus.jpg', earth: 'earth.jpg',
  mars: 'mars.jpg', jupiter: 'jupiter.jpg', saturn: 'saturn.jpg', uranus: 'uranus.jpg', neptune: 'neptune.jpg',
} as const satisfies Record<BodyId, string | null>
export type TextureStatus = 'loading' | 'ready' | 'failed' | 'off'

export const earthTextureFiles = { 'earth-night': '2k_earth_nightmap.jpg', 'earth-clouds': '2k_earth_clouds.jpg' } as const
export const ringTextureFiles = { 'saturn-ring': '2k_saturn_ring_alpha.png' } as const
export type TextureKey = BodyId | keyof typeof earthTextureFiles | keyof typeof ringTextureFiles
