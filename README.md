JA | [EN](README.en-US.md)

----------------------------------------------------------------

<h1 align="center">Ayuskey</h1>

# このプロジェクトは今後保守されなくなります

このプロジェクトには多くの技術的負債があり、また依存関係を更新するうえで更にそれらが悪化するという考えのもとv11ベースでの開発を終了する予定です。
今後の開発はv13ベースになり、[このリポジトリ](https://github.com/teamblackcrystal/ayuskey-next)で行われます。移行についてはスクリプトを作成中なのでお待ちください。

## 移行について

Ayuskey V12FE用に作成されていた本来v11には存在しないテーブルなどは移行の対象外になります。
現在まだ本番環境での最終テストが行えるレベルではないので、実際の実行方法は後ほど記述します。

### 対象外のテーブル

- antenna
- games
- channel-following
- user-group-invite
- app
- channel-note-pining
- moderation-log
- user-group-joining
- attestation-challenge
- note-watching
- user-group
- clip-note
- notification
- log
- messaging-message
- clip

### 移行対象のテーブル

- abuse-user-report
- drive-file
- meta
- note
- page
- registry-item
- user-list
- user
- access-token
- drive-folder
- hashtag
- note-unread
- password-reset-request
- relay
- user-note-pinings
- announcement-read
- emoji
- instance
- muting
- poll
- signin
- user-profile
- announcement
- auth-session
- following
- note-favorite
- poll-vote
- sw-subscription
- user-keypair
- user-publickey
- antenna-note
- blocking
- follow-request
- note-reaction
- page-like
- registration-tick
- used-username
- user-list-joining
- user-security-key

## 本番環境に適さない不安定版です。
このバージョンの代わりに[develop-lts](https://lab.teamblackcrystal.com/blackcrystal/ayuskey/-/tree/develop-lts)をご利用ください。

<div align="center">

[![][e2e-badge]][e2e-link]

[![][fork-of-badge]][fork-of-link]
[![][summaly-badge]][summaly-link]
[![][xev-badge]][xev-link]
[![][mfmjs-badge]][mfmjs-link]

Ayuskeyはこの世界のどこかで生まれたMisskey v11のフォークです。
Fediverseの世界に漂うため、Misskeyをはじめとした他のソーシャルメディアプラットフォームと相互につながることができます。

</div>

----------------------------------------------------------------

## 公式インスタンス

* <https://kr.akirin.xyz>

## ドキュメント

* [misskeyからの移行](https://github.com/sousuke0422/notes/blob/master/misskey/migrate-misskey-to-ayuskey.md)
* [Ayuskey Hub](https://ayuskey-hub.readthedocs.io/)

## クライアント

* [TenCha](https://github.com/coke12103/TenCha)
  * isLadyをサポート

## ライブラリ（Ayuskey動作保証）

* [ayuskey.js](https://github.com/TeamBlackCrystal/ayuskey.js)
  * Misskey.jsをforkした公式SDK
* [MiPA(Mi.py互換)](https://github.com/yupix/mipa)
  * bot向けフレームワーク
  * misskey(v12)対応
* [MiPAC](https://github.com/yupix/mipac)
  * [MiPA](https://github.com/yupix/mipa)の内部APIです。
  * MisskeyのAPI Wrapperであり、オブジェクト的にAPIを操作することができます
  * misskey(v12)対応

<details>
<summary>非推奨</summary>

* ~~[Mi.py](https://github.com/yupix/Mi.py)~~
  * **開発終了の為非推奨**
  * bot向けフレームワーク
  * misskey(v12)対応
  * 今後新たにBOTを作成する場合は [MiPA](https://github.com/yupix/mipa) をご利用ください

</details>

## ライブラリ（Ayuskey動作未保障）

* [Misskey.py](https://github.com/YuzuRyo61/Misskey.py)

<details>
<summary>内部</summary>

* [@ayuskey/summaly](https://github.com/TeamBlackCrystal/summaly)
  * 微調整が施されたsummaly

* [@ayuskey/xev](https://github.com/TeamBlackCrystal/xev)
  * 本家がesm化されたため、cjsで保守

</details>

## Contribution

* [コントリビューションガイド](CONTRIBUTING.md)をご確認ください。
* 翻訳を行い場合は[GitLocalize](https://gitlocalize.com/repo/6356)が利用できます。
  * プルリクエストを直接送ることも可能です、新規項目以外は推奨されません。

### Collaborators

<table>
 <tr>
  <td><img src="https://avatars.githubusercontent.com/u/33174568?s=120&v=4"></img></td>
	<td><img src="https://avatars.githubusercontent.com/u/50538210?s=120&v=4"></img></td>
 </tr>
 <tr>
  <td align="center"><a href="https://github.com/sousuke0422">@sousuke0422</a></td>
	<td align="center"><a href="https://github.com/yupix">@yupix</a></td>
 </tr>
</table>

## Screenshots

<p align="center">
  <img src="https://s3.akarinext.org/assets/*/ayuskey-desk-3.png" alt="Ayuskey">
</p>

<p align="center">
  <img src="https://kr.akirin.xyz/files/e21b4c19-61ef-4ab0-9522-a9f98ded2174/e21b4c19-61ef-4ab0-9522-a9f98ded2174.png" alt="Ayuskey Deck">
</p>

[e2e-link]:      https://github.com/TeamBlackCrystal/misskey/actions/workflows/e2e.yml
[e2e-badge]:     https://img.shields.io/github/workflow/status/TeamBlackCrystal/misskey/Ayuskey%20E2E%20Test?label=E2E%20Test&style=flat-square
[fork-of-link]:  https://github.com/syuilo/misskey/tree/v11
[fork-of-badge]: https://img.shields.io/badge/fork%20of-misskey--dev%2Fmisskey-important.svg?style=flat-square
[summaly-link]:  https://www.npmjs.com/package/@ayuskey/summaly
[summaly-badge]: https://img.shields.io/badge/summaly-%40ayuskey%2Fsummaly-blue.svg?style=flat-square
[xev-link]:  https://www.npmjs.com/package/@ayuskey/xev
[xev-badge]: https://img.shields.io/badge/xev-%40ayuskey%2Fxev-blue.svg?style=flat-square
[mfmjs-link]:    https://github.com/TeamBlackCrystal/misskey/issues/222
[mfmjs-badge]:   https://img.shields.io/badge/mfm.js-none(%23222)-blue.svg?style=flat-square
