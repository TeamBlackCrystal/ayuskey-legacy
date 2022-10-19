import { EntityRepository, Repository } from 'typeorm';
import { ReversiMatching, User } from '@ayuskey/models';
import { Users } from '../../..';
import { awaitAll, ensure } from '@ayuskey/shared';
import { Packed } from '@/misc/schema';

@EntityRepository(ReversiMatching)
export class ReversiMatchingRepository extends Repository<ReversiMatching> {
	public async pack(
		src: ReversiMatching['id'] | ReversiMatching,
		me: { id: User['id'] },
	): Promise<Packed<'ReversiMatching'>> {
		const matching = typeof src === 'object' ? src : await this.findOne(src).then(ensure);

		return await awaitAll({
			id: matching.id,
			createdAt: matching.createdAt.toISOString(),
			parentId: matching.parentId,
			parent: Users.pack(matching.parentId, me, {
				detail: true,
			}),
			childId: matching.childId,
			child: Users.pack(matching.childId, me, {
				detail: true,
			}),
		});
	}
}

export const packedReversiMatchingSchema = {
	type: 'object' as const,
	optional: false as const, nullable: false as const,
	properties: {
		id: {
			type: 'string' as const,
			optional: false as const, nullable: false as const,
			format: 'id',
			example: 'xxxxxxxxxx',
		},
		createdAt: {
			type: 'string' as const,
			optional: false as const, nullable: false as const,
			format: 'date-time',
		},
		parentId: {
			type: 'string' as const,
			optional: false as const, nullable: false as const,
			format: 'id',
			example: 'xxxxxxxxxx',
		},
		parent: {
			type: 'object' as const,
			optional: false as const, nullable: true as const,
			ref: 'User' as const,
		},
		childId: {
			type: 'string' as const,
			optional: false as const, nullable: false as const,
			format: 'id',
			example: 'xxxxxxxxxx',
		},
		child: {
			type: 'object' as const,
			optional: false as const, nullable: false as const,
			ref: 'User' as const,
		},
	},
};
