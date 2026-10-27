# Echo Show 11 Dashboard

Echo Show 11のSilkで表示する、**全面背景＋右側に大きな時計・日付・東京の天気** を表示するシンプルな時計サイトです。Echo Showを置き時計として使うために作りました。

- 画面は壁紙が主役。情報は右側にまとめます。初回のみ、画面下部に再生ボタン（画面維持用）を表示します。
- 時計は東京時間の24時間表示（その下に日付）、天気はOpen-Meteoによる現在の東京の情報を15分間隔で更新します。
- [Keep Silk Open](https://gitlab.com/DaGammla/keep-silk-open) （MIT）を同梱し、Silkで最初の画面タップ後に無音音声を再生することで、アイドル時のホーム画面への復帰を抑制します。**完全な固定は保証できません**。

## Echo Showで使う

1. このリポジトリをHTTPSのWebホスティングへデプロイ（後述）。
2. Echo Show 11に「アレクサ、Silkを開いて」と伝え、デプロイ先URLを入力。
3. 画面下部の再生ボタンをタップして無音音声再生と全画面表示を開始。
4. 20〜30分放置し、自動的にレシピや広告のホーム画面へ戻らないか確認。

### 背景画像の変更

**URLパラメータで切り替え**: 配信URLの末尾に `?bg=` を付けると背景を選べます。既定はAI生成の風景（山の湖）です。

| 指定 | 背景 |
|---|---|
| （なし） | 山の湖 `assets/bg-1.jpg`（AI生成） |
| `?bg=1` （`?bg=mountain`） | 山の湖 |
| `?bg=2` （`?bg=ocean`） | 海の夕焼け |
| `?bg=3` （`?bg=forest`） | 森の木漏れ日 |
| `?bg=4` （`?bg=gradient`） | 青グラデーション |

Echo Showでは、開きたい背景のURLをそのまま入力（またはブックマーク）してください。

### 背景画像の変更

**画像はリポジトリで管理します。** 既定の画像は `assets/bg-1.jpg`（AI生成の風景）です。差し替える場合は同名ファイルを置き換えるか、別のファイル名で追加して `styles.css` の `url("./assets/bg-1.jpg")` を変更してpushしてください。画像を端末に直接アップロードする画面はありません。旧既定の `assets/wallpaper.svg` も残してあります。権利のある第三者のイラストは公開リポジトリに同梱しないでください。

背景は縦横比の異なる画像でも `cover` で自動拡大されます（周囲は切り取られる場合があります）。情報パネルは画面右側に配置されるため、右側に余白のある画像が向いています。プライベートな写真や権利的に問題のある画像は公開サイトへ置く前によく確認してください。

### 手軽な表示確認

静的サイトです。 `python -m http.server 8000` をリポジトリ直下で実行し、PCのブラウザから `http://localhost:8000` を開きます。無音再生OSSはSilkのUser Agentでのみ実行します。

## プライベートリポジトリと公開URLの違い

- **GitHubの非公開リポジトリ**：ソース・背景画像を他人から見えなくする。
- **公開HTTPSサイト**：Echo Show 11がログインなしで開けるURL。公開サイト上に配信した画像やHTMLは第三者が取得できる可能性があります。
- GitHub FreeのプライベートリポジトリではGitHub Pagesが利用できません。[GitHub公式](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)参照。
- GitHub privateと組み合わせるなら、[Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/git-integration/) のPrivate Git接続が対応。ダッシュボードで「Workers & Pages → Create → Pages → Connect to Git」→本リポジトリを選択。ビルドコマンドは不要（指定必須なら `exit 0`）、出力ディレクトリは `/`（ルート）相当を指定してください。

**Alexaアプリだけでは標準ホーム画面をこのサイトに置き換えられません。** ブラウザを開いた状態で利用します。

## OSS

`vendor/keep-silk-open/` にオリジナルのスクリプト・無音MP3・MITライセンスを同梱します。ソース: [DaGammla / Keep Silk Open](https://gitlab.com/DaGammla/keep-silk-open)。

## テスト

```sh
python -m unittest discover -s tests -v
```

自動テストは構造・リソース・表示ルールを検証するもので、Echo Show 11実機の連続表示を保証しません。詳しくは `docs/SPEC.md` を参照してください。
