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
