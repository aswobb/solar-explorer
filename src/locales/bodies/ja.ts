import type { BodyDictionary } from '../../data/types'
export const bodyTexts = {
  sun: { name: '太陽', summary: '太陽系で唯一の恒星。自転の速さは緯度によって異なります。' },
  mercury: { name: '水星', summary: '太陽に最も近い岩石惑星です。' },
  venus: { name: '金星', summary: '太陽から2番目の岩石惑星。地球とは逆向きに自転します。' },
  earth: { name: '地球', summary: '私たちが暮らす、太陽から3番目の岩石惑星です。' },
  mars: { name: '火星', summary: '太陽から4番目の岩石惑星。自転周期は地球に近い長さです。' },
  jupiter: { name: '木星', summary: '太陽系で最も大きな惑星で、ガス惑星に分類されます。' },
  saturn: { name: '土星', summary: '環を持つガス惑星。太陽から6番目をめぐります。' },
  uranus: { name: '天王星', summary: '大きく傾いた自転軸を持つ、太陽から7番目の氷惑星です。' },
  neptune: { name: '海王星', summary: '8つの惑星の中で太陽から最も遠い氷惑星です。' },
} as const satisfies BodyDictionary
