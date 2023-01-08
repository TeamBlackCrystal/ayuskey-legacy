# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## ToDo

### Added

- アカウント登録にメールアドレスの設定を必須にするオプション (ayu5-email)

## [Unreleased]

## [11.37.1-rei0784-6.1.0] 2023-01-08

### Changed

- 色々最適化

### Fixed

- `disableFederation`使用中の際、ユーザーフォローを行うともれなく`500`エラーが返ってくる AY-402

### Security

- forkbomにを引き起こす問題の緩和

## [11.37.1-rei0784-6.0.1] 2022-11-14

### Changed

- v6のコードネーム: `moonstone`

## [11.37.1-rei0784-6.0.0] 2022-11-13

### Added

- ~~Twemoji をインスタンスで配信~~
  - オプション化し、使用する cdn を変更
- 引越し先をユーザーページに表示するように
  - マイグレーションが必要
- 投稿ページの URL で埋め込みプレイヤーを提供するように
- Bull Dashboard を組み込み、ジョブキューの確認や操作を行えるように
- welcome ページでcwが設定されている場合は 「もっと見る」ボタンを出すように TeamBlackCrystal/misskey#1813
- blurをoffにする設定を追加しました
- toolsにアプリケーションを作るためのサンプルを追加 [#30](https://github.com/TeamBlackCrystal/ayuskey/issues/30)
- ハイライトがない際は無いと表示する [#120](https://github.com/TeamBlackCrystal/ayuskey/issues/120)
- パスワードリマインダー(パスワードリセット)

### Changed

- ~~**yarn@3に変更**~~
  - **pnpmに変更**
- リバーシのグラデーションを変更 [#71](https://github.com/TeamBlackCrystal/ayuskey/issues/71)
- メニューのアイコンの位置を統一 [#68](https://github.com/TeamBlackCrystal/ayuskey/issues/68)
- renoteした際のHeaderの位置を変える [#33](https://github.com/TeamBlackCrystal/ayuskey/issues/33)
- emojilist を更新
- クエリの最適化
- docker で node@18 を使用します
- node 14 をドロップ
  - **BREAKING CHANGE: node 12 は利用できません。** 
    - 16 or 18 に移行してください
- 既存のファイルにsensitiveフラグが飛んできたときの挙動
- CORSを調整
- ビルド時の出力を調整

### Deprecated

- ESやsonicを利用した検索
  - これらを使用している場合は検索の修正は提供されていません

### Fixed

- `channels/follow` エンドポイントで既にfollowしてる物をfollowしようとするとdbのエラーが直接帰ってきてしまう [#362](https://github.com/TeamBlackCrystal/ayuskey/issues/362)
- メンション時にアバターの比率が異なるとアバターのデザインが崩れる #164
- メンション時アバターが取得できない #163
- モバイル時にRenoteするとボーダーがうまく表示されない [#31](https://github.com/TeamBlackCrystal/ayuskey/issues/31)
- アプリケーションの認証時にログインしてないとテーマが白すぎて見れたものじゃない TeamBlackCrystal/misskey#477
- リモートユーザーでも可能であれば誕生日と場所を表示
- noteの検索がおかしかった

### Security

- 依存関係が更新されました。脆弱性が修正されている場合があります。
  - CVE-2022-29256 (sharp)
  - CVE-2022-33987 (got)
  - CVE-2022-24434 (multer)

## [11.37.1-rei0784-5.21.1] 2022-07-28

### Fixed

- うまく DockerImage ビルドできなかった

## [11.37.1-rei0784-5.21.0] 2022-07-28

### Fixed

- 依存関係が更新されました。脆弱性が修正されている場合があります。
- antenna, clip, list のパフォーマンス悪いのを修正
  - _ayuskey では antenna, clip の api のみを提供しています。_

### Changed

- パフォーマンスが良くなる
- bull@4 へ移行
- fortawesome@6 へ移行
- 返信を分かりやすいようにデザインを調整

## [11.37.1-rei0784-5.20.0] 2022-04-19

### Fixed

- 依存関係が更新されました。脆弱性が修正されている場合があります。

### Changed

- node 12 をドロップ
  - **BREAKING CHANGE: node 12 は利用できません。**

## [11.37.1-rei0784-5.19.1] 2022-04-19

### Fixed

- 依存関係が更新されました。脆弱性が修正されている場合があります。

## [11.37.1-rei0784-5.19.0] 2022-04-19

### Added

- NodeInfo にユーザー数と投稿数の情報を追加する

### Changed

- ネームスペース変更
  - **BREAKING CHANGE: 旧バージョンとの isLady 連合ができなくなります。**
- Unifying Misskey-specific IRIs in JSON-LD `@context`
- ノートに添付できるファイルの数が 16 に増えました
- renote は noindex
- update nodejs for docker
- メンションのアバターを調整
- birthday に謎の値(02/32 など)が設定できるように(なったはず)

### Fixed

- 依存関係が更新されました。脆弱性が修正されている場合があります。
- Fix Twitter embed
- tools が動かないのを修正
- deliver delayed
- ログアウトできない
- katex がおかしい

## [11.37.1-rei0784-5.18.1] 2022-01-25

### Fixed

- 依存関係が更新されました。脆弱性が修正されている場合があります。

## [11.37.1-rei0784-5.18.0] 2022-01-25

### Added

- クライアント: メンションにユーザーのアバターを表示するように
- インスタンスプロフィールレンダリング ready
- 猫耳動かす AS-3

### Changed

- 通知にブラーと丸みを追加 AS-20 - firefox は config でブラーを有効にしても正常に動作しない可能性があります
- ウィジェットの丸みを強化 AS-16

### Fixed

- バッヂにカーソルを合わせた際に説明を出すように
- フォロー申請を有効にした状態でフォローリクエストが来ると メニューに true と表示される AS-15
- デスクトップ版で通知が何もないと empty と出る不具合 AS-10
- YAML ファイルへのバックスペース文字混入対策
- 猫耳の色が場所によって違う AS-17

## [11.37.1-rei0784-5.17.2] 2021-12-07

### Fixed

- ルームを開けるように
  - _既知の問題: `THREE.Scene: .dispose() has been removed.`が出る_
- published を付けないと Activity が一部実装で除外されてしまうのを修正
- 削除したノートやユーザーがリモートから参照されると復活することがある のを修正
- 依存関係が更新されました。脆弱性が修正されている場合があります。

## [11.37.1-rei0784-5.17.1] 2021-11-13

### Fixed

- Docker 環境で正常にコンテナがビルドできない

## [11.37.1-rei0784-5.17.0] 2021-11-13

### Added

- 新しい MFM: \$[sparkle キラキラ]

### Changed

- クライアント: 画像ビューアを強化

### Fixed

- クライアント: CW で画像が隠されたとき、画像の高さがおかしいことになる問題を修正

### Removed

- iOS 15 未満のサポート
  - 対象のバージョンをお使いの方は、iOS のバージョンアップを行ってください。

## [11.37.1-rei0784-5.17.0-rc.2] 2021-11-06

### Changed

- ストリーミング(ws)の挙動を調整

### Fixed

- 依存関係が更新されました。脆弱性が修正されている場合があります。
- WebSocket が繋がらない問題を修正

## [11.37.1-rei0784-5.17.0-rc.1] 2021-11-05

### Added

- room に book3 が実装されました
  - Misskey 完全攻略ガイドブックの v12 版です
- ファイルサイズ上限が実装されました。config 上の`maxFileSize`から設定できます。
  - デフォルトは`262144000B`
- オブジェクトストレージの`S3ForcePathStyle`を指定できるように
- 藍ちゃんウィジェット
- アカウント削除の連合
- API: 管理者用アカウント削除 API を実装(/admin/accounts/delete)
  - リモートユーザーの削除も可能に

### Changed

- 対応していないものは false か null を返すように (`api:meta`)
- オンライン状態の仕様を v12 と同じものに
- ActivityPub: deliver キューのメモリ使用量を削減
- API: ap 系のエンドポイントをログイン必須化+レートリミット追加

### Fixed

- 一部の条件下(DM など)で既読がつかない問題を修正
- アンテナに既読がつくようになりました
- 空のプッシュ通知が発生しないように
- アカウント削除の安定性を向上

## [11.37.1-rei0784-5.16.0] 2021-09-12 [YANKED]

### Security

- XSS GHSA-669q-w6qc-75h3
  - 5.15.1 へバックポートされています
- SSRF GHSA-x9q4-5jhg-9mpf
  - URL からのアップロード, AP の添付ファイル, 外部ファイルのプロキシ等では、Private アドレス等へのリクエストは拒否されるようになりました。
    - development で動作している場合は、この制限は適用されません。
    - Proxy 使用時には、この制限は適用されません。 Proxy 使用時に同等の制限を行いたい場合は、Proxy 側で設定を行う必要があります。
    - default.yml にて allowedPrivateNetworks に CIDR を追加することにより、宛先ネットワークを指定してこの制限から除外することが出来ます。

### Added

- html mail
- Job Queue が詰まったとき音を鳴らす機能
- `$[fn text]`のタイプの mfm との簡易的な互換性確保(ネストは不可)
- v12 互換の通知 api
- Channels API
- Clip API
- token を消せるように
- リアクション数の取得

### Fixed

- アンテナが動作するようになりました
  - 既読がつかない既知の不具合があります

### Changed

- 不明な絵文字(mastodon 等の like 含む)のフォールバックが 👍 ではなく ⭐ がデフォルトに
  - 👍 にしたい場合は設定が必要です
- 改造以前の音源の場所を変更
- リモートユーザーの一定以上の bio と name を切り捨てるように
- 検索を調整(`host:address`形式のみ)
- CSP や Cookie の調整
- TL に流れてくる画像を v12 と同じ感じに

### Removed

- 不要な音源を削除

## [11.37.1-rei0784-5.15.0] 2021-08-22

### Added

- pizzax を部分的に移植
- Array ActivityStreams type のサポート

### Fixed

- docker のコンテナがビルドできない
- ドキュメント内の github へ飛ぶリンクが古いのが修正されました。
- InBox の Delayed 発生が軽減されました
  - not reacted な Undo.Like が inbox に滞留するのを修正
  - AP Delate Activity の修正
  - 存在しないユーザーの削除をリトライしない
- リモートドライブの不具合修正
- AP Actor の修正
- inbox のバグ修正
- room の不具合修正
- 特定条件でログアウトさせられる問題を修正

### Changed

- 音の鳴らし方が v12 と同様になりました。
  - 古い音源は次のバージョンで削除予定です。
- ActivityPub: ジョブキューの試行タイミングを調整
- bio と名前の上限を緩和
- job queue の調整

### Removed

- 不要になったためコンテナ内から vips を削除

## [11.37.1-rei0784-5.14.0] - 2021-08-12

### Added

- 5.11.2 からたくさんの機能が追加されました

### Fixed

- 5.11.2 から検索した際プログレスバーが検索し終わっても消えないなどのいくつかのバグが修正されています。
- beta.6 からの修正
  - 仕様を以前の戻し、絵文字表示バグに終止符を打ちました。

## [11.37.1-rei0784-5.14.0-beta.6] - 2021-08-12

### Added

- 言語ファイルに welcome のタグリストが空の際の言語を追加
- ウィジェットに v12 仕様の job queue を追加
- キャッシュを消す機能を追加
- フォロー/ミュート/ブロック インポートでファイル名を見るように

### Fixed

- 同じインスタンスからの絵文字が通知欄に表示されない
- 検索した際プログレスバーが検索し終わっても消えない
- welcome ページのタイムラインで画像が表示されない
- welcome ページで管理者が設定されていない場合空白が表示される
- パスワードを空に変更できてしまうのを修正 Fix [mei23#1455](https://github.com/mei23/misskey-v11/issues/1455)
- 投票に数字で終わるリプライを付けられていると inbox で処理できないのを修正 Fix [mei23#1522](https://github.com/mei23/misskey-v11/issues/1522)

### Changed

- Token の生成方法を変更
- Twitter ウィジットが使える時はプレイヤーを使わないように

### Removed

- テーマの状態をログに出していた物を削除

## [11.37.1-rei0784-4.0.0] - 2020-11-01

### Added

- お嬢様スイッチを追加
- 検索窓がびよ～んするようになった

### Fixed

- docker 環境において files をマウントするように
- 内部的な修正をたくさん

[unreleased]: https://github.com/TeamBlackCrystal/ayuskey/compare/11.37.1-rei0784-6.0.0...HEAD
[11.37.1-rei0784-6.1.0]: https://github.com/TeamBlackCrystal/ayuskey/compare/11.37.1-rei0784-6.0.0...11.37.1-rei0784-6.1.0
[11.37.1-rei0784-6.0.1]: https://github.com/TeamBlackCrystal/ayuskey/compare/11.37.1-rei0784-6.0.0...11.37.1-rei0784-6.0.1
[11.37.1-rei0784-6.0.0]: https://github.com/TeamBlackCrystal/ayuskey/compare/11.37.1-rei0784-5.21.1...11.37.1-rei0784-6.0.0
[11.37.1-rei0784-5.21.1]: https://github.com/TeamBlackCrystal/ayuskey/compare/11.37.1-rei0784-5.21.0...11.37.1-rei0784-5.21.1
[11.37.1-rei0784-5.21.0]: https://github.com/TeamBlackCrystal/ayuskey/compare/11.37.1-rei0784-5.20.0...11.37.1-rei0784-5.21.0
[11.37.1-rei0784-5.20.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.19.1...11.37.1-rei0784-5.20.0
[11.37.1-rei0784-5.19.1]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.19.0...11.37.1-rei0784-5.19.1
[11.37.1-rei0784-5.19.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.18.1...11.37.1-rei0784-5.19.0
[11.37.1-rei0784-5.18.1]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.18.0...11.37.1-rei0784-5.18.1
[11.37.1-rei0784-5.18.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.17.2...11.37.1-rei0784-5.18.0
[11.37.1-rei0784-5.17.2]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.17.1...11.37.1-rei0784-5.17.2
[11.37.1-rei0784-5.17.1]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.17.0...11.37.1-rei0784-5.17.1
[11.37.1-rei0784-5.17.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.17.0-rc.2...11.37.1-rei0784-5.17.0
[11.37.1-rei0784-5.17.0-rc.2]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.17.0-rc.1...11.37.1-rei0784-5.17.0-rc.2
[11.37.1-rei0784-5.17.0-rc.1]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.16.0...11.37.1-rei0784-5.17.0-rc.1
[11.37.1-rei0784-5.16.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.15.0...11.37.1-rei0784-5.16.0
[11.37.1-rei0784-5.15.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.14.0...11.37.1-rei0784-5.15.0
[11.37.1-rei0784-5.14.0]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.14.0-beta.6...11.37.1-rei0784-5.14.0
[11.37.1-rei0784-5.14.0-beta.6]: https://github.com/TeamBlackCrystal/misskey/compare/11.37.1-rei0784-5.14.0-beta.5...11.37.1-rei0784-5.14.0-beta.6
[11.37.1-rei0784-4.0.0]: https://github.com/TeamOrangeServer/misskey/compare/v3.6.0...v11.37.1-rei0784-4.0.0
