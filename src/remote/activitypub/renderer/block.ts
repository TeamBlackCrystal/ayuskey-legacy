import config from '../../../config';
import { ILocalUser, IRemoteUser } from '@ayuskey/models';

export default (blocker: ILocalUser, blockee: IRemoteUser) => ({
	type: 'Block',
	actor: `${config.url}/users/${blocker.id}`,
	object: blockee.uri,
});
