# Contribution guide
:v: Thanks for your contributions :v:

## Issues
Feature suggestions and bug reports are filed in https://github.com/TeamBlackCrystal/ayuskey/issues .

* Please search existing issues to avoid duplication. If your issue is already filed, please add your reaction or comment to the existing one.
* If you have multiple independent issues, please submit them separately.

## Branches
* **master** branch is tracking the latest release and used for production purposes.
* **develop** branch is where we work for the next release.
* **l10n_develop** branch is reserved for localization management.

## Localization (l10n)
Ayuskey uses [GitLocalize](https://gitlocalize.com/repo/6356) for localization management.
You can improve our translations with your GitHub account.
At the administrator's discretion, a PR containing your translation will be created and merged.
The owner [@sousuke0422](https://github.com/sousuke0422) merges the PR into the develop branch before the next release.

If your language is not listed in GitLocalize, please open an issue.

![gitlocalized](https://gitlocalize.com/repo/6356/whole_project/badge.svg)

## Internationalization (i18n)
Misskey uses the Vue.js plugin [Vue I18n](https://github.com/kazupon/vue-i18n).
Documentation of Vue I18n is available at http://kazupon.github.io/vue-i18n/introduction.html .

## Documentation
* Documents for contributors are located in [`/docs`](/docs).
* Documents for instance admins are located in [`/docs`](/docs).
* Documents for end users are located in [`/src/docs`](/src/docs).

## Test
* Test codes are located in [`/test`](/test).

## Continuous integration
Misskey uses CircleCI for executing automated tests.
Configuration files are located in [`/.circleci`](/.circleci).

## Adding MisskeyRoom items
* Use English for material, object and texture names.
* Use meter for unit of length.
* Your PR should include all source files (e.g. `.png`, `.blend`) of your models (for later editing).
* Your PR must include the glTF binary files (`.glb`) of your models.
* Add a locale key `room.furnitures.YOUR_ITEM` at [`/locales/ja-JP.yml`](/locales/ja-JP.yml).
* Add a furniture definition at [`/src/client/app/common/scripts/room/furnitures.json5`](/src/client/app/common/scripts/room/furnitures.json5).

If you have no experience on 3D modeling, we suggest to use the free 3DCG software [Blender](https://www.blender.org/).
You can find information on glTF 2.0 at [glTF 2.0 — Blender Manual]( https://docs.blender.org/manual/en/dev/addons/io_scene_gltf2.html).

## FAQ
### How to resolve conflictions occurred at pnpm-lock.yaml?

Just execute `pnpm` to fix it.

## Glossary
### AP
Stands for _**A**ctivity**P**ub_.

### MFM
Stands for _**M**isskey **F**lavored **M**arkdown_.

### Mk
Stands for _**M**iss**k**ey_.

### SW
Stands for _**S**ervice**W**orker_.

### Nyaize
Convert な(na) to にゃ(nya)

#### Denyaize
Revert Nyaize

## TypeScript Coding Style
### Do not omit semicolons
This is to avoid Automatic Semicolon Insertion (ASI) hazard.

Ref:
* https://www.ecma-international.org/ecma-262/#sec-automatic-semicolon-insertion
* https://github.com/tc39/ecma262/pull/1062

### Do not omit curly brackets
Bad:
``` ts
if (foo)
	bar;
else
	baz;
```

Good:
``` ts
if (foo) {
	bar;
} else {
	baz;
}
```

As a special case, you can omit the curly brackets if

* the body of the `if`-statement have only one statement and,
* the `if`-statement does not have `else`-clause.

Good:
``` ts
if (foo) bar;
```

Make sure that the condition and the body statement are on the same line.

### Do not use `==` when it can simply be replaced with `===`.
🥰

### Use only boolean (or null related) values in the condition of an `if`-statement.
Bad:
``` ts
if (foo.length)
```

Good:
``` ts
if (foo.length > 0)
```

### Do not use `export default`
This is because the current language support does not work well with `export default`.

Ref:
* https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
* https://gfx.hatenablog.com/entry/2017/11/24/135343

Bad:
``` ts
export default function(foo: string): string {
```

Good:
``` ts
export function something(foo: string): string {
```

## Directory structure
```
src ... Source code
	@types ... Type definitions
	prelude ... Independence utils for coding JavaScript without side effects
	misc ... Independence utils for Misskey without side effects
	service ... Common functions with side effects
	queue ... Job queues and Jobs
	server ... Web Server
	client ... Client
	mfm ... MFM

test ... Test code

```

## Notes
### placeholder
SQLをクエリビルダで組み立てる際、使用するプレースホルダは重複してはならない
例えば
``` ts
query.andWhere(new Brackets(qb => {
	for (const type of ps.fileType) {
		qb.orWhere(`:type = ANY(note.attachedFileTypes)`, { type: type });
	}
}));
```
と書くと、ループ中で`type`というプレースホルダが複数回使われてしまいおかしくなる
だから次のようにする必要がある
```ts
query.andWhere(new Brackets(qb => {
	for (const type of ps.fileType) {
		const i = ps.fileType.indexOf(type);
		qb.orWhere(`:type${i} = ANY(note.attachedFileTypes)`, { [`type${i}`]: type });
	}
}));
```

### Not `null` in TypeORM
```ts
const foo = await Foos.findOne({
	bar: Not(null)
});
```
のようなクエリ(`bar`が`null`ではない)は期待通りに動作しない。
次のようにします:
```ts
const foo = await Foos.findOne({
	bar: Not(IsNull())
});
```

### `null` in SQL
SQLを発行する際、パラメータが`null`になる可能性のある場合はSQL文を出し分けなければならない
例えば
``` ts
query.where('file.folderId = :folderId', { folderId: ps.folderId });
```
という処理で、`ps.folderId`が`null`だと結果的に`file.folderId = null`のようなクエリが発行されてしまい、これは正しいSQLではないので期待した結果が得られない
だから次のようにする必要がある
``` ts
if (ps.folderId) {
	query.where('file.folderId = :folderId', { folderId: ps.folderId });
} else {
	query.where('file.folderId IS NULL');
}
```

### `[]` in SQL
SQLを発行する際、`IN`のパラメータが`[]`(空の配列)になる可能性のある場合はSQL文を出し分けなければならない
例えば
``` ts
const users = await Users.find({
	id: In(userIds)
});
```
という処理で、`userIds`が`[]`だと結果的に`user.id IN ()`のようなクエリが発行されてしまい、これは正しいSQLではないので期待した結果が得られない
だから次のようにする必要がある
``` ts
const users = userIds.length > 0 ? await Users.find({
	id: In(userIds)
}) : [];
```

### 配列のインデックス in SQL
SQLでは配列のインデックスは**1始まり**。
`[a, b, c]`の `a`にアクセスしたいなら`[0]`ではなく`[1]`と書く

### `undefined`にご用心
MongoDBの時とは違い、findOneでレコードを取得する時に対象レコードが存在しない場合 **`undefined`** が返ってくるので注意。
MongoDBは`null`で返してきてたので、その感覚で`if (x === null)`とか書くとバグる。代わりに`if (x == null)`と書いてください

### 簡素な`undefined`チェック
データベースからレコードを取得するときに、プログラムの流れ的に(ほぼ)絶対`undefined`にはならない場合でも、`undefined`チェックしないとTypeScriptに怒られます。
でもいちいち複数行を費やして、発生するはずのない`undefined`をチェックするのも面倒なので、`ensure`というユーティリティ関数を用意しています。
例えば、
``` ts
const user = await Users.findOne(userId);
// この時点で user の型は User | undefined
if (user == null) {
	throw 'missing user';
}
// この時点で user の型は User
```
という処理を`ensure`を使うと
``` ts
const user = await Users.findOne(userId).then(ensure);
// この時点で user の型は User
```
という風に書けます。
もちろん`ensure`内部でエラーを握りつぶすようなことはしておらず、万が一`undefined`だった場合はPromiseがRejectされ後続の処理は実行されません。
``` ts
const user = await Users.findOne(userId).then(ensure);
// 万が一 Users.findOne の結果が undefined だったら、ensure でエラーが発生するので
// この行に到達することは無い
// なので、.then(ensure) は
// if (user == null) {
//	throw 'missing user';
// }
// の糖衣構文のような扱いです
```

### Migration作成方法
```
npx ts-node ./node_modules/typeorm/cli.js migration:generate -n 変更の名前
```

作成されたスクリプトは不必要な変更を含むため除去してください。

<!--
### コネクションには`markRaw`せよ
**Vueのコンポーネントのdataオプションとして**misskey.jsのコネクションを設定するとき、必ず`markRaw`でラップしてください。インスタンスが不必要にリアクティブ化されることで、misskey.js内の処理で不具合が発生するとともに、パフォーマンス上の問題にも繋がる。なお、Composition APIを使う場合はこの限りではない(リアクティブ化はマニュアルなため)。
-->

### JSONのimportに気を付けよう
TypeScriptでjsonをimportすると、tscでコンパイルするときにそのjsonファイルも一緒にdistディレクトリに吐き出されてしまう。この挙動により、意図せずファイルの書き換えが発生することがあるので、jsonをimportするときは書き換えられても良いものかどうか確認すること。書き換えされて欲しくない場合は、importで読み込むのではなく、`fs.readFileSync`などの関数を使って読み込むようにすればよい。

## その他

### 開発環境の作り方（Terraform & Docker）

```bash
git clone git@git.lab.teamblackcrystal.com:blackcrystal/ayuskey.git && ayuskey

# configのコピー & 最小限の設定
cp .config/example.yml .config/default.yml
sed -i -e 's/url: https:\/\/example.tld\//url: http:\/\/localhost:3000/' .config/default.yml

# Terraformを使ってPostgresやRedisを構築
cd terraform
terraform apply && cd -

# 依存関係のインストール
pnpm i && pnpm build && pnpm migrate

# 開発サーバーを起動
pnpm dev
```


### HTMLのクラス名で follow という単語は使わない
広告ブロッカーで誤ってブロックされる
