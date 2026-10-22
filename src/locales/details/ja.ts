export const detailText = {
  heading: '天体のプロフィール', read: '解説を見る', realValues: '以下は実際の代表値です。画面の大きさ・距離・再生速度とは異なります。',
  radius: '平均半径', distance: '軌道長半径', orbitPeriod: '恒星公転周期', rotationPeriod: '恒星自転周期', tilt: '赤道傾斜角',
  notApplicable: '適用外', solarOrbitNote: '日心モデルのため、太陽の「太陽を回る周期・距離」は適用しません。',
  solarRotationNote: '太陽は緯度によって自転速度が異なります。ここでは緯度16°の代表周期を示します。',
  prograde: '順行', retrograde: '逆行', directionNote: '自転周期は長さを正の値で表示し、方向を別記しています。逆行は地球と逆向きの自転を表します。',
  definitionNote: '恒星周期は遠方の星を基準とした周期で、昼夜の長さとは異なります。軌道長半径は現在の太陽からの距離ではありません。',
  precisionNote: '教育向けの概数です。半径は小数1桁、時間は最大2桁、公転日数は最大1桁、角度は最大3桁に丸めています。精密な予測や計算には使用できません。',
  sources: '出典・定義', source: '出典', checked: 'データ取得日',
  classes: { star: '恒星', terrestrial: '岩石惑星', 'gas-giant': 'ガス惑星', 'ice-giant': '氷惑星' },
} as const
