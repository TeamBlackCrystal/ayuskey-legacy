import $ from 'cafy';
import { publishMainStream } from '../../../../services/stream';
import define from '../../define';
import { Users, UserProfiles } from '../../../../models';

export const meta = {
	desc: {
		'ja-JP': '指定した部屋の情報を更新します。',
	},

	tags: ['room'],

	requireCredential: true,

	params: {
		room: {
			validator: $.obj({
				furnitures: $.arr($.obj({
					id: $.str,
					type: $.str,
					position: $.obj({
						x: $.num,
						y: $.num,
						z: $.num,
					}),
					rotation: $.obj({
						x: $.num,
						y: $.num,
						z: $.num,
					}),
					props: $.optional.nullable.obj(),
				})),
				roomType: $.str,
				carpetColor: $.str,
			}),
		},
	},
};

export default define(meta, async (ps, user) => {
	await UserProfiles.update({ userId: user.id }, {
		room: ps.room as any,
	});

	const iObj = await Users.pack(user.id, user, {
		detail: true,
		includeSecrets: true,
	});

	// Publish meUpdated event
	publishMainStream(user.id, 'meUpdated', iObj);

	return iObj;
});
