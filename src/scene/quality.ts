export const qualityLevels = ['standard', 'eco'] as const
export type Quality = typeof qualityLevels[number]
export function isQuality(value: string): value is Quality {
  return qualityLevels.some(level => level === value)
}
export const qualitySettings = {
  standard: { regionPoints: 6000, regionInstances: 1200, labelLimit: 24, maxTextureSize: 2048, maxDpr: 1.5, sphere: [32, 24], detailSphere: [64, 48], stars: 2400, brightStars: 180 },
  eco: { regionPoints: 1500, regionInstances: 300, labelLimit: 10, maxTextureSize: 2048, maxDpr: 1, sphere: [24, 16], detailSphere: [32, 24], stars: 800, brightStars: 60 },
} as const
