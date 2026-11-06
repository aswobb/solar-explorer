# 静的配信

[READMEへ戻る](../README.md)

公開版：[Solar Explorer](https://aswobb.github.io/solar-explorer/)（2026-10-23公開）。GitHub Pagesで静的ファイルを配信しています。専用サーバーや独自ドメインは使用しません。

## 共通設定

| 項目 | 設定 |
|---|---|
| 実行環境 | Node.js 24、npm 10.5.1以上 |
| インストール | `npm ci` |
| ビルド | `npm run build` |
| 配信物の確認 | `npm run check:dist` |
| 配信ディレクトリ | `dist/` の内容全体 |
| エントリー | `index.html` |
| パス | Viteの `base: './'`。ルートと任意のサブディレクトリに対応 |
| ナビゲーション | ページ内ハッシュ。アプリ用のURLルーターは使わない |

GitHub Pages用のワークフローを追加しています。生成物自体は通常の静的ホストでも配信できます。ソース、node_modules、開発用ドキュメントを配信ディレクトリに入れません。

## ビルドと検査

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run check:dist
```

`check:dist` は生成HTMLの相対JS/CSS参照、参照先の存在、27枚の画像のサイズ・SHA256、6つの出典manifestと素材署名が元ファイルと同じことを検査します。ビルド前や不完全なコピーでは失敗します。クラウド側のHTTP設定やブラウザ動作を代わりに検査するものではありません。

`dist/` は次の形です。ハッシュ付きファイル名はビルドごとに変わることがあります。

```text
dist/
  index.html
  assets/       # JS・CSS
  textures/     # 画像27枚、manifest6枚、ATTRIBUTION.md
```

## ルートとサブディレクトリの検証

ルートに置く場合：

```sh
npm run preview -- --port 4174 --strictPort
```

表示された `http://127.0.0.1:4174/` を開きます。

同じ生成物を `/solar-explorer/` に置く場合の確認は、別ターミナルで行えます。

```sh
npm run preview -- --port 4176 --strictPort --base /solar-explorer/
```

`http://127.0.0.1:4176/solar-explorer/` を開きます。`--base` はこのプレビューのマウント位置を指定し、画像を作り直しません。実際のホストでは `dist/` の内容をそのディレクトリへ配置します。URL末尾の `/` を付け、ディレクトリURLは末尾スラッシュへ誘導します。

```text
サイトの公開ルート/
  solar-explorer/
    index.html
    assets/
    textures/
```

## 配信側で確認すること

- index.html、JS、CSS、JPEG、PNG、JSON、署名Markdownをそのまま配信します。JS/CSSには適切なContent-Typeが必要です。
- 存在しない画像やJSへindex.htmlを返す設定は避けます。ハッシュ移動はサーバーへの別ルート要求になりません。
- index.htmlと未ハッシュのtexturesは、更新を確認できるキャッシュ設定にします。長期間のimmutableキャッシュはハッシュ付きassetsだけに限定します。現在のアプリはService Workerを登録しません。
- 古いHTMLが参照するassetsを削除しないよう、更新は生成物一式で行います。ホストの切り替えやキャッシュ機構は採用先で確認します。
- HTTPSの公開URLでWebGL2、読み込み、選択、解説、リロード、外部出典、コンソールを再確認します。ローカル検証は実ホスト検証の代替ではありません。
- 画像の出典・ライセンス・変更内容の表示と `textures/ATTRIBUTION.md` を保持します。ソースコード配布の際は、未設定のプロジェクトライセンスと依存ライブラリの許諾文も確認します。

## ローカルで確認した範囲

2026-10-22、相対パスの同一ビルドをルートと `/solar-explorer/` でローカル配信し、各20ファイルのHTTP200と内容ハッシュをdistと照合しました。ブラウザで本体・遅延ロードする3Dコード・12画像、子ディレクトリでのハッシュ付き刷新、言語保存、ブランドリンクの復帰を確認しています。通常コンソールのwarn/errorは空でした。
型検査、45テスト、ビルド、配信物検査が通過しました。画像を一時的に欠落させた検査では失敗し、復元後に通過することも確認しています。3D分包の500kB超警告は残り、フレームレートや実ホスト性能を示しません。

[スクリーンショット](showcase/README.md) / [機能の総合検証](VALIDATION.md)

## GitHub Pagesの更新

[ワークフロー](../.github/workflows/pages.yml)はmainへのpushで動きます。READMEとdocsだけの変更は配信を省略します。必要ならActionsのRun workflowから手動実行できます。

Node.js 24でnpm ci、テスト、型検査を含むビルド、配信物検査を順に実行し、成功時にdistだけを公開します。公式ActionsはコミットSHAで固定し、配信ジョブにのみpages:writeとid-token:writeを付与します。追加のアクセストークンをリポジトリに保存しません。Pagesの配信元はGitHub Actionsです。

[初回の成功した配信](https://github.com/aswobb/solar-explorer/actions/runs/39926462626)で45テスト・ビルド・配信物検査が通過しました。公開URLでも画像12枚、地球の追従、全景復帰、3言語切り替えをブラウザで確認し、通常のwarn/errorは空でした。公開ホスト上のFPSや全端末の互換性は未測定です。

## P8 本地构建交付（2026-11-06）
本轮生成并检查dist静态产物，另提供artifacts/solar-explorer-p8.zip与SHA256摘要。生产预览验证DEV故障参数不起作用，运行资源无需外部联网。当前未更新GitHub Pages等公开环境；实体手机GPU性能仍待验收。不要将本地P8构建验证等同于线上已部署。

## P0–P8 扩展版发布（2026-11-06）
用户已明确授权提交与部署。本次将扩展代码、资料、测试和验收证据提交到main并推送，沿用现有GitHub Actions Pages工作流发布；不更换域名或托管服务。提交前79项测试、类型检查、构建和27份纹理校验通过。执行结果可在 [Pages工作流](https://github.com/aswobb/solar-explorer/actions/workflows/pages.yml) 查看。P8本地验收章节中的“未部署”指当时的验收阶段；手机真机性能仍保留待验，不因本次发布自动勾选。
