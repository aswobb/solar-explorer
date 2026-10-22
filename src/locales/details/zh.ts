export const detailText = {
  heading: '天体资料', read: '查看介绍', realValues: '以下为实际代表值，与画面的大小、距离和播放速度不同。',
  radius: '平均半径', distance: '轨道半长轴', orbitPeriod: '恒星公转周期', rotationPeriod: '恒星自转周期', tilt: '赤道倾角',
  notApplicable: '不适用', solarOrbitNote: '本项目采用日心模型，太阳的“绕太阳公转周期与距离”不适用。',
  solarRotationNote: '太阳自转速度随纬度变化。这里显示纬度16°所采用的代表周期。',
  prograde: '顺行', retrograde: '逆行', directionNote: '自转周期以正数表示时长，方向单独标注。逆行表示自转方向与地球相反。',
  definitionNote: '恒星周期以远方恒星为参考，与昼夜长度不同。轨道半长轴并不是当前距太阳的距离。',
  precisionNote: '教育用途的概数。半径最多保留1位小数，小时最多2位，公转天数最多1位，角度最多3位；不用于精密预测或计算。',
  sources: '来源与定义', source: '来源', checked: '数据采集日期',
  classes: { star: '恒星', terrestrial: '岩石行星', 'gas-giant': '气态巨行星', 'ice-giant': '冰巨行星' },
} as const
