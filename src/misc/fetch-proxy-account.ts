import { fetchMeta } from './fetch-meta';
import { ILocalUser } from '@ayuskey/models';
import { Users } from '../models';
import { ensure } from '@ayuskey/shared';

export async function fetchProxyAccount(): Promise<ILocalUser> {
	const meta = await fetchMeta();
	return await Users.findOne({ username: meta.proxyAccount!, host: null }).then(ensure) as ILocalUser;
}
