import { EntityRepository, Repository } from 'typeorm';
import { Apps } from '..';
import { AuthSession } from '@ayuskey/models';
import { ensure } from '@ayuskey/shared';
import { awaitAll } from '@ayuskey/shared';

@EntityRepository(AuthSession)
export class AuthSessionRepository extends Repository<AuthSession> {
	public async pack(
		src: AuthSession['id'] | AuthSession,
		me?: any,
	) {
		const session = typeof src === 'object' ? src : await this.findOne(src).then(ensure);

		return await awaitAll({
			id: session.id,
			app: Apps.pack(session.appId, me),
			token: session.token,
		});
	}
}
