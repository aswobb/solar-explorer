import type { BodyDictionary } from '../../data/types'
export const bodyTexts = {
  sun: { name: '太阳', summary: '太阳系中唯一的恒星，自转速度随纬度变化。' },
  mercury: { name: '水星', summary: '距离太阳最近的岩石行星。' },
  venus: { name: '金星', summary: '距离太阳第二近的岩石行星，自转方向与地球相反。' },
  earth: { name: '地球', summary: '我们生活的家园，距离太阳第三近的岩石行星。' },
  mars: { name: '火星', summary: '距离太阳第四近的岩石行星，自转周期与地球相近。' },
  jupiter: { name: '木星', summary: '太阳系中最大的行星，属于气态巨行星。' },
  saturn: { name: '土星', summary: '带有行星环的气态巨行星，距离太阳第六近。' },
  uranus: { name: '天王星', summary: '自转轴大幅倾斜的冰巨行星，距离太阳第七近。' },
  neptune: { name: '海王星', summary: '八大行星中距离太阳最远的冰巨行星。' },
} as const satisfies BodyDictionary
