import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { id } from '../id';
import { User } from './User';
import { Flash } from './Flash';

@Entity()
@Index(['userId', 'flashId'], { unique: true })
export class FlashLike {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone')
	public createdAt: Date;

	@Index()
	@Column(id())
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: User | null;

	@Column(id())
	public flashId: Flash['id'];

	@ManyToOne(type => Flash, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public flash: Flash | null;
}
