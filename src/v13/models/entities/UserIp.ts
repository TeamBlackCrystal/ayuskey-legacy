import { Entity, Index, Column, PrimaryGeneratedColumn } from 'typeorm';
import { id } from '../id';
import type { User } from './User';

@Entity()
@Index(['userId', 'ip'], { unique: true })
export class UserIp {
	@PrimaryGeneratedColumn()
	public id: string;

	@Column('timestamp with time zone', {
	})
	public createdAt: Date;

	@Index()
	@Column(id())
	public userId: User['id'];

	@Column('varchar', {
		length: 128,
	})
	public ip: string;
}
