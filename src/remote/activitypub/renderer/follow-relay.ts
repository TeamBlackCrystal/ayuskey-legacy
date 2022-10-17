import config from '../../../config';
import { Relay, ILocalUser } from '@ayuskey/models';

export function renderFollowRelay(relay: Relay, relayActor: ILocalUser) {
	const follow = {
		id: `${config.url}/activities/follow-relay/${relay.id}`,
		type: 'Follow',
		actor: `${config.url}/users/${relayActor.id}`,
		object: 'https://www.w3.org/ns/activitystreams#Public',
	};

	return follow;
}
