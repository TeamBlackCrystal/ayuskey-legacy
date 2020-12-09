import $ from 'cafy';
import define from '../../../define';
import { Emojis } from '../../../../../models';
import { toPunyNullable } from '../../../../../misc/convert-host';
import { escapeRegExp } from 'lodash';

export const meta = {
	desc: {
		'ja-JP': 'カスタム絵文字を取得します。'
	},

	tags: ['admin'],

	requireCredential: true as const,
	requireModerator: true,

	params: {
		limit: {
			validator: $.optional.num.range(1, 100),
			default: 10
		},

		offset: {
			validator: $.optional.num.min(0),
			default: 0
		},

		remote: {
			validator: $.optional.bool,
		},

		newer: {
			validator: $.optional.bool,
		},

		name: {
			validator: $.optional.str
		},

		host: {
			validator: $.optional.nullable.str
		}
	}
};

export default define(meta, async (ps) => {
	const query = {
		host: ps.remote ? { $ne: null } : null
	} as any;

	if (ps.name) {
		query.name = new RegExp(escapeRegExp(ps.name.toLowerCase()));
	}

	if (ps.host !== undefined) {
		query.host = ps.host;
	}

	const emojis = await Emojis.find({
		where: {
			host: toPunyNullable(ps.host)
		},
		order: {
			category: 'ASC',
			name: 'ASC'
		}
	});

	return emojis.map(e => ({
		id: e.id,
		name: e.name,
		category: e.category,
		aliases: e.aliases,
		host: e.host,
		url: e.url,
		type: e.type,
	}));
});

/*
return emojis.map(e => ({
	id: e.id,
	name: e.name,
	category: e.category,
	aliases: e.aliases,
	host: e.host,
	url: e.url,
	type: e.type,
	md5: e.md5,
}));
});
*/
