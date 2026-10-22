export const qualityLevels = ['standard', 'eco'] as const
export type Quality = typeof qualityLevels[number]
export function isQuality(value: string): value is Quality {
  return qualityLevels.some(level => level === value)
}
export const qualitySettings = {
  standard: { maxDpr: 1.5, sphere: [32, 24], detailSphere: [64, 48], stars: 2400, brightStars: 180 },
  eco: { maxDpr: 1, sphere: [24, 16], detailSphere: [32, 24], stars: 800, brightStars: 60 },
} as const
