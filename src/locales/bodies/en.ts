import type { BodyDictionary } from '../../data/types'
export const bodyTexts = {
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
