import { EntityRepository, Repository } from 'typeorm';
import { Users } from '..';
import { ModerationLog } from '@ayuskey/models';
import { ensure } from '../../prelude/ensure';
import { awaitAll } from '@ayuskey/shared';

@EntityRepository(ModerationLog)
export class ModerationLogRepository extends Repository<ModerationLog> {
	public async pack(
		src: ModerationLog['id'] | ModerationLog,
	) {
		const log = typeof src === 'object' ? src : await this.findOne(src).then(ensure);

		return await awaitAll({
			id: log.id,
			createdAt: log.createdAt,
			type: log.type,
			info: log.info,
			userId: log.userId,
			user: Users.pack(log.user || log.userId, null, {
				detail: true,
			}),
		});
	}

	public packMany(
		reports: any[],
	) {
		return Promise.all(reports.map(x => this.pack(x)));
	}
}
