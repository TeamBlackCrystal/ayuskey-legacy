import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { id } from '../id';
import { User } from './User';

@Entity()
export class ModerationLog {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the ModerationLog.',
	})
	public createdAt: Date;

	@Index()
	@Column(id())
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: User | null;

	@Column('varchar', {
		length: 128,
	})
	public type: string;

	@Column('jsonb')
	public info: Record<string, any>;
}
