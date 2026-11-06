import type { BodyDictionary } from '../../data/types'
export const bodyTexts = {
  halley: { name: "哈雷彗星", summary: "约76年回归的周期彗星；彗核为放大示意，接近太阳时彗发和双尾增强。" },
  pluto: { name: '冥王星', summary: '海王星外的矮行星，新视野号曾近距离拍摄其冰质表面。' },
  eris: { name: '阋神星', summary: '散射盘中的矮行星，轨道倾角大，活动范围比主柯伊伯带更远。' },
  haumea: { name: '妊神星', summary: '海王星外的快速自转矮行星，具有明显拉长的外形。' },
  makemake: { name: '鸟神星', summary: '海王星外的矮行星，表面存在冰，缺少近距离表面影像。' },

  ceres: { name: '谷神星', summary: '主小行星带中最大的天体，属于矮行星。黎明号曾探测其表面的明亮盐类沉积。' },
  vesta: { name: '灶神星', summary: '主小行星带中的大型岩质小行星，保留着巨大的撞击盆地，曾由黎明号近距离探测。' },
  mimas: { name: '土卫一', summary: '以巨大的赫歇尔撞击坑著称，表面密布撞击痕迹。' },
  enceladus: { name: '土卫二', summary: '明亮的冰卫星，南极地区会喷出含水冰的羽流。' },
  tethys: { name: '土卫三', summary: '冰质卫星，拥有巨大的奥德修斯撞击坑和伊萨卡峡谷。' },
  dione: { name: '土卫四', summary: '冰质表面布满撞击坑，亮色条纹主要来自陡峭的冰崖。' },
  rhea: { name: '土卫五', summary: '土星第二大的卫星，冰质表面保留着大量撞击坑。' },
  iapetus: { name: '土卫八', summary: '以明暗对比强烈的两面和赤道附近的山脊著称。' },

  io: { name: '木卫一', summary: '木星的火山卫星，表面分布着活跃火山和硫质沉积。' },
  europa: { name: '木卫二', summary: '表面覆盖冰壳，有证据支持冰下存在液态海洋。' },
  ganymede: { name: '木卫三', summary: '太阳系最大的天然卫星，拥有自己的磁场。' },
  callisto: { name: '木卫四', summary: '木星外侧的伽利略卫星，古老表面布满撞击坑。' },
  titan: { name: '土卫六', summary: '土星最大的卫星，拥有浓厚大气和液态甲烷、乙烷湖泊。' },

  moon: { name: '月球', summary: '地球唯一的天然卫星。潮汐锁定使它大致以同一面朝向地球。' },
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
