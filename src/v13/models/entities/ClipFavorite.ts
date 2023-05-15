import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { id } from '../id';
import { User } from './User';
import { Clip } from './Clip';

@Entity()
@Index(['userId', 'clipId'], { unique: true })
export class ClipFavorite {
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
	public clipId: Clip['id'];

	@ManyToOne(type => Clip, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public clip: Clip | null;
}
