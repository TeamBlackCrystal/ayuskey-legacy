import $ from 'cafy';
import define from '../../../define';
import { Instances } from '../../../../../models';
import { toPuny } from '@ayuskey/shared';
import { fetchInstanceMetadata } from '../../../../../services/fetch-instance-metadata';

export const meta = {
	tags: ['admin'],

	requireCredential: true as const,
	requireModerator: true,

	params: {
		host: {
			validator: $.str,
		},
	},
};

export default define(meta, async (ps, me) => {
	const instance = await Instances.findOne({ host: toPuny(ps.host) });

	if (instance == null) {
		throw new Error('instance not found');
	}

	fetchInstanceMetadata(instance, true);
});
