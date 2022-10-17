import config from '../../../config';
import { ILocalUser, UserKeypair } from '@ayuskey/models';
import { createPublicKey } from 'crypto';

export default (user: ILocalUser, key: UserKeypair, postfix?: string) => ({
	id: `${config.url}/users/${user.id}${postfix || '/publickey'}`,
	type: 'Key',
	owner: `${config.url}/users/${user.id}`,
	publicKeyPem: createPublicKey(key.publicKey).export({
		type: 'spki',
		format: 'pem',
	}),
});
