import config from '../../../config';
import { ILocalUser } from '@ayuskey/models';

export default (user: ILocalUser, target: any, object: any) => ({
	type: 'Remove',
	actor: `${config.url}/users/${user.id}`,
	target,
	object,
});
