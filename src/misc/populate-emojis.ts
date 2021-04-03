import { Emojis, Users } from '../models';
import { Emoji } from '../models/entities/emoji';
import { Cache } from './cache';
import { isSelfHost, toPunyNullable } from './convert-host';
import parseAcct from './acct/parse';
import { resolveUser } from '../remote/resolve-user';

const cache = new Cache<Emoji | null>(1000 * 60 * 60);

/**
 * 添付用絵文字情報
 */
type PopulatedEmoji = {
	name: string;
	url: string;
};

/**
 * 添付用絵文字情報を解決する
 * @param emojiName ノートやユーザープロフィールに添付された、またはリアクションのカスタム絵文字名 (:は含めない, リアクションでローカルホストの場合は@.を付ける (これはdecodeReactionで可能))
 * @param noteUserHost ノートやユーザープロフィールの所有者のホスト
 * @returns 絵文字情報, nullは未マッチを意味する
 */
export async function populateEmoji(emojiName: string, noteUserHost: string | null): Promise<PopulatedEmoji | null> {
	const accts = emojiName.startsWith('@');
	const match = emojiName.match(/^(\w+)(?:@([\w.-]+))?$/);
	if (!match) return null;

	const name = match[1];

	if (accts) { 
		await Promise.all(
			match
				.map(acct => ({ acct, parsed: parseAcct(acct) }))
				.map(async ({ acct, parsed }) => {
					const user = await resolveUser(parsed.username.toLowerCase(), parsed.host || noteUserHost).catch(() => null);
					return ({ acct, user: user ? await Users.pack(user) : undefined })
				})
		).then(users => users.filter((u) => u.user != null).map(u => {
			return {
				name: u.acct,
				url: u.user?.avatarUrl || ''
			};
		}));
	}

	// クエリに使うホスト
	let host = match[2] === '.' ? null	// .はローカルホスト (ここがマッチするのはリアクションのみ)
		: match[2] === undefined ? noteUserHost	// ノートなどでホスト省略表記の場合はローカルホスト (ここがリアクションにマッチすることはない)
		: isSelfHost(match[2]) ? null	// 自ホスト指定
		: (match[2] || noteUserHost);	// 指定されたホスト || ノートなどの所有者のホスト (こっちがリアクションにマッチすることはない)

	host = toPunyNullable(host);

	const queryOrNull = async () => (await Emojis.findOne({
		name,
		host
	})) || null;

	const emoji = await cache.fetch(`${name} ${host}`, queryOrNull);

	if (emoji == null) return null;

	return {
		name: emojiName,
		url: emoji.url,
	};
}

/**
 * 複数の添付用絵文字情報を解決する (キャシュ付き, 存在しないものは結果から除外される)
 */
export async function populateEmojis(emojiNames: string[], noteUserHost: string | null): Promise<PopulatedEmoji[]> {
	const emojis = await Promise.all(emojiNames.map(x => populateEmoji(x, noteUserHost)));
	return emojis.filter((x): x is PopulatedEmoji => x != null);
}

