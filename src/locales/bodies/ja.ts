import type { BodyDictionary } from '../../data/types'
export const bodyTexts = {
  halley: { name: "ハレー彗星", summary: "約76年周期の彗星。太陽に近づくとコマと二種類の尾が発達します。" },
  pluto: { name: '冥王星', summary: '海王星以遠の準惑星。ニューホライズンズが氷の表面を接近撮影しました。' },
  eris: { name: 'エリス', summary: '大きな軌道傾斜を持つ散乱円盤の準惑星。主カイパーベルトより遠くまで公転します。' },
  haumea: { name: 'ハウメア', summary: '海王星以遠にある高速自転の準惑星で、細長い形が特徴です。' },
  makemake: { name: 'マケマケ', summary: '氷に覆われた海王星以遠の準惑星。接近撮影された表面画像はありません。' },

  ceres: { name: 'ケレス', summary: '主小惑星帯で最大の天体で、準惑星に分類されます。ドーン探査機が明るい塩類の堆積物を観測しました。' },
  vesta: { name: 'ベスタ', summary: '巨大な衝突盆地を持つ岩石質の大型小惑星。ドーン探査機が接近観測しました。' },
  mimas: { name: 'ミマス', summary: '巨大なハーシェル・クレーターで知られる、衝突痕の多い衛星です。' },
  enceladus: { name: 'エンケラドス', summary: '明るい氷の衛星。南極付近から水や氷の粒子を噴出します。' },
  tethys: { name: 'テティス', summary: '巨大なオデュッセウス・クレーターとイサカ峡谷を持つ氷の衛星です。' },
  dione: { name: 'ディオネ', summary: 'クレーターに覆われ、明るい氷の崖が帯状に見られる衛星です。' },
  rhea: { name: 'レア', summary: '土星で2番目に大きい衛星。氷の表面に多数のクレーターがあります。' },
  iapetus: { name: 'イアペトゥス', summary: '明暗が大きく異なる半球と、赤道付近の山脈で知られる衛星です。' },

  io: { name: 'イオ', summary: '火山活動が活発な木星の衛星。表面に火山や硫黄質の堆積物が見られます。' },
  europa: { name: 'エウロパ', summary: '氷の地殻を持つ木星の衛星。地下に液体の海があることを示す証拠があります。' },
  ganymede: { name: 'ガニメデ', summary: '太陽系最大の天然衛星で、固有の磁場を持ちます。' },
  callisto: { name: 'カリスト', summary: 'クレーターに覆われた古い表面を持つ、外側のガリレオ衛星です。' },
  titan: { name: 'タイタン', summary: '厚い大気と液体のメタン・エタンの湖を持つ、土星最大の衛星です。' },

  moon: { name: '月', summary: '地球唯一の天然衛星。潮汐固定により、ほぼ同じ面を地球に向けています。' },
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
