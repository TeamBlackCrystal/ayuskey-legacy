import config from '../../../config';
import { ILocalUser } from '@ayuskey/models';

export default (object: any, user: ILocalUser) => ({
	type: 'Reject',
	actor: `${config.url}/users/${user.id}`,
	object,
});
