# 出典・素材・署名

[READMEへ戻る](../README.md)

## 科学資料

太陽と8惑星の教育向け代表値を、各数値の単位・出典IDと一緒に保存しています。数値は `src/data/bodies.ts`、資料のURLと取得日は `src/data/sources.ts` にあります。データ取得日は2026-10-20で、本書作成時に値や取得日を更新していません。

| 資料 | 用途 |
|---|---|
| [NASA/JPL Planetary Physical Parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html) | 惑星の体積等価平均半径。赤道半径とは区別 |
| [NASA GSFC Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) | 恒星自転周期、軌道長半径、恒星公転周期、赤道傾斜角 |
| [NASA GSFC Sun Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html) | 太陽の平均半径、緯度16度の代表自転周期 |
| [Notes on the Fact Sheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/fact_notes.html) | 周期、逆行、距離、傾斜角の定義 |
| [NASA Solar System Facts](https://science.nasa.gov/solar-system/solar-system-facts/) / [About the Planets](https://science.nasa.gov/solar-system/planets/) | 太陽系の範囲、順序、分類 |

値と出典IDの対応は[天体データ](../src/data/bodies.ts)、取得日とURLは[出典データ](../src/data/sources.ts)で確認できます。表示用半径・配置・軌道・時間圧縮・色はアプリの演出値であり、これらの資料の実測値とは別です。NASAの資料を参照したことは、本プロジェクトへの推薦・承認を意味しません。

## 画像素材

**© Solar System Scope / INOVE** — [提供元](https://www.solarsystemscope.com/textures/)、[Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)。フッターにも作者・提供元・ライセンスのリンクを表示しています。

| 画像 | 個数・形式 | ファイル単位のURL・寸法・SHA256 |
|---|---|---|
| 太陽と8惑星の表面 | JPEG 9枚、2048×1024 | [manifest.json](../public/textures/manifest.json) |
| 地球の夜景・雲 | JPEG 2枚、2048×1024 | [earth-manifest.json](../public/textures/earth-manifest.json) |
| 土星の環 | RGBA PNG 1枚、2048×125 | [ring-manifest.json](../public/textures/ring-manifest.json) |

2026-10-21に取得しました。原サイトのダウンロードがこの環境でHTTP403となったため、作者と出典を記載した固定コミットのミラーから取得しています。

- 表面9枚：[Sanghel / solar-system-3d](https://github.com/Sanghel/solar-system-3d/tree/c826ebef5762074e5c8ba696254bedb0d3694757/public/textures)
- 夜景・雲・環：[Whitebee7 / solarsystem](https://github.com/Whitebee7/solarsystem/tree/235e72c02e825e0c8d0792ec0aa6be43e1a14f68/textures)

ミラーからの画像バイトは未変更です。原サイトのファイルとの一致は独立に確認していません。実行時の球面投影、sRGB、照明、alpha合成、UV変形、雲・大気・コロナは本プロジェクトの表示処理です。素材は色調整や欠損の補完を含む可視化用マップであり、金星は雲の下の地表、地球の夜景は合成画像です。現在の天気・照明・太陽活動を示しません。

配布ファイル内の[ATTRIBUTION.md](../public/textures/ATTRIBUTION.md)にも同じ署名と取得記録があります。素材のライセンスとミラー側のアプリコードのライセンスは区別しています。
外部のフォント、天体モデル、星表、第三者shader素材は追加していません。背景星は手続き的に生成し、専用shaderはプロジェクトコードで実装しています。

## 依存ライブラリ

以下は2026-10-22のインストール済み `package.json` のname / version / licenseを照合した、直接利用する主なランタイムライブラリです。

| パッケージ | バージョン | licenseフィールド |
|---|---|---|
| react | 19.3.1 | MIT |
| react-dom | 19.3.1 | MIT |
| three | 0.180.0 | MIT |
| @react-three/fiber | 9.8.2 | MIT |
| @react-three/drei | 10.7.9 | MIT |
| three-stdlib（Drei経由、型参照等） | 2.36.1 | MIT |

全依存関係の固定バージョンは `package-lock.json`、個々の許諾文・著作権表示は各パッケージの配布物を参照してください。この表は推移依存を含む全パッケージの許諾文の転載ではありません。ViteやTypeScriptなどの開発用パッケージも、それぞれのライセンスに従います。
本プロジェクト固有コードのライセンスはまだ設定していません。画像素材のCC BY 4.0をコード全体に適用したり、依存ライブラリのMITをプロジェクト全体の許諾とみなしたりしません。


## P1 Moon（2026-11-02）

科学参考值：[NASA GSFC Moon Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html)，于 2026-11-02 核对。月球纹理：© Solar System Scope / INOVE，[素材页面](https://www.solarsystemscope.com/textures/)，CC BY 4.0，原始 2K 文件未修改。哈希、字节数和尺寸见 public/textures/manifest.json，署名见 public/textures/ATTRIBUTION.md。模型使用简化圆轨道与潮汐锁定示意，非实时星历。


## P2 木星与土星卫星（2026-11-02）

科学半径、半长轴、周期与同步自转标记：NASA GSFC [Jovian Satellite Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html)、[Saturnian Satellite Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html)。同步自转参考时数由来源的轨道日数乘以 24 换算；对未有来源数据的轴倾角不填虚构的 0。资料主要特点另附 NASA Science 的各卫星介绍，见 src/data/sources.ts。

五张新增地图为镜像标识的 NASA/JPL/USGS 任务拼接影像，按 public-domain 记录，与原有 Solar System Scope 贴图分开署名。固定提交、完整下载来源和 SHA-256 见 public/textures/satellites-manifest.json；原始字节对应关系的核对限制及土卫六地表暖色演示说明见 public/textures/ATTRIBUTION.md。


## P2 补充：六颗土星卫星（2026-11-02）

新增土卫一 Mimas、土卫二 Enceladus、土卫三 Tethys、土卫四 Dione、土卫五 Rhea、土卫八 Iapetus。平均半径采用 [NASA/JPL 卫星物理参数](https://ssd.jpl.nasa.gov/sats/phys_par/sep.html)，轨道半长轴、周期与同步标记采用 [NASA GSFC 土星卫星资料](https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html)；图鉴特点链接到各自 NASA Science 页面。

六张地图直接下载自 NASA 官方 NASA-3D-Resources 固定版本，保留原始字节，1440×720。官方仓库说明为免费、无版权资源。原始路径、提交、哈希和处理说明见 public/textures/satellites-manifest.json 及 ATTRIBUTION.md。


## P3：小行星带、谷神星与灶神星（2026-11-02）

区域简介：[NASA Asteroid Facts](https://science.nasa.gov/solar-system/asteroids/facts/)。背景碎石为带固定随机种子的原创程序几何，数量、尺寸、厚度和密度均属展示增强，不是已知小天体逐颗目录。

两颗代表天体的科学值来自 NASA/JPL SBDB API 的 `phys-par=1&full-prec=1` 响应。完整响应、来源与日期保存在 `docs/data/small-bodies-snapshot.json`，应用不联网刷新。平均半径由直径 / 2 换算；轨道半长轴由 AU × 149597870.7 换算为 km。未提供可靠轴倾角就不显示该行；图鉴准确区分矮行星谷神星与小行星灶神星。

表面素材来自 NASA VTAD 官方 [Ceres 3D Model](https://science.nasa.gov/resource/ceres-3d-model/) 与 [Vesta 3D Model](https://science.nasa.gov/resource/vesta-3d-model/)。提取原模型的底色贴图，缩小/重编码为 2048×1024 JPEG；非原始模型形状。原始 GLB 哈希、具体变更与输出图片哈希见 small-bodies-manifest.json 与素材署名。未使用 AI 生成地图。


## P4：外围矮行星与柯伊伯带（2026-11-02）

主要区域：[NASA Kuiper Belt Facts](https://science.nasa.gov/solar-system/kuiper-belt/facts/)。该资料区分主柯伊伯带与散射盘，并将阋神星作为散射盘例子。背景冰质粒子是原创程序化示意，未赋予已发现天体身份。

平均半径采用 [JPL Physical Parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html) 的代表估计，记录于 docs/data/outer-dwarf-reference-values.json。冥王星周期、自转、半长轴、倾角及轴倾角来自 [NASA GSFC Pluto Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html)。其他三颗的自转与轨道参数为 JPL SBDB 静态快照，见 docs/data/outer-dwarfs-snapshot.json；AU 转换为 km 的因子为 149597870.7。科学值并非当前星历，展示仍为倾斜圆轨道，椭圆轨道求解留给 P5。

冥王星表面地图提取自 NASA VTAD 官方 [Pluto 3D Model](https://science.nasa.gov/resource/pluto-3d-model/)，缩小、JPEG 重编码与哈希记录见 outer-manifest.json。阋神星、妊神星和鸟神星没有近距离贴图文件，使用明确标记的外观示意；不把艺术材质冒充观测影像。

### P5 哈雷彗星
轨道/有效直径：NASA/JPL SBDB 1P，完整采集快照见 `docs/data/halley-sbdb.json`，采集2026-11-02，解算2025-11-21。科普与双尾定义：NASA Science [1P/Halley](https://science.nasa.gov/solar-system/comets/1p-halley/) 和 [Comet Facts](https://science.nasa.gov/solar-system/comets/facts/)。彗核为程序几何，彗发和双尾为程序着色器，无新增第三方图像。

### P6 奥尔特云
范围和观测状态参考 NASA Science [Oort Cloud](https://science.nasa.gov/solar-system/oort-cloud/) / [Facts](https://science.nasa.gov/solar-system/oort-cloud/facts/)，采集2026-11-02。点云、指示圆和距离标尺为程序生成，无新增图片素材。

### P7 人造航天器
轨道代表值和历史日期参考NASA：ISS Orbit Tutorial、Human Spaceflight Factsheet、About Hubble、Hubble by the Numbers、Voyager 1、Pale Blue Dot、Voyager FAQ、New Horizons。完整直链、参考日期和数据适用范围见 [SPACECRAFT.md](SPACECRAFT.md)。核对2026-11-06。全部航天器模型、轨道线与路线为本项目程序几何，无新增第三方模型/图像素材；几何按需创建并提供简单模式。

### P8 整合记录
本阶段未添加外部图片、模型或字体；新增界面与测量脚本为项目代码。P5–P7程序视觉说明同步到public/textures/ATTRIBUTION.md，构建验证该署名文件与27份纹理完整一致。科学快照与阶段说明保留其原始来源，不重新标成2026-11-06的新观测结果。
