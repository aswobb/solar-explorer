import type { BodyId } from '../data/types'

/** Local, unchanged 2048×1024 maps; provenance and hashes: public/textures/ATTRIBUTION.md. */
export const textureFiles = {
  sun: 'sun.jpg', mercury: 'mercury.jpg', venus: 'venus.jpg', earth: 'earth.jpg',
  mars: 'mars.jpg', jupiter: 'jupiter.jpg', saturn: 'saturn.jpg', uranus: 'uranus.jpg', neptune: 'neptune.jpg',
} as const satisfies Record<BodyId, string>
export type TextureStatus = 'loading' | 'ready' | 'failed' | 'off'

export const earthTextureFiles = { 'earth-night': '2k_earth_nightmap.jpg', 'earth-clouds': '2k_earth_clouds.jpg' } as const
export const ringTextureFiles = { 'saturn-ring': '2k_saturn_ring_alpha.png' } as const
export type TextureKey = BodyId | keyof typeof earthTextureFiles | keyof typeof ringTextureFiles
