import { UserKeypairs } from '@/models/index';
import { User, UserKeypair } from '@ayuskey/models';
import { Cache } from './cache';

const cache = new Cache<UserKeypair>(Infinity);

export async function getUserKeypair(userId: User['id']): Promise<UserKeypair> {
	return await cache.fetch(userId, () => UserKeypairs.findOneOrFail(userId));
}
