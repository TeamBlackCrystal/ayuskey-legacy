import { Entity, PrimaryColumn, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { id } from '../id';
import { User } from './User';
import { App } from './App';

@Entity()
export class AuthSession {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the AuthSession.',
	})
	public createdAt: Date;

	@Index()
	@Column('varchar', {
		length: 128,
	})
	public token: string;

	@Column({
		...id(),
		nullable: true,
	})
	public userId: User['id'] | null;

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
		nullable: true,
	})
	@JoinColumn()
	public user: User | null;

	@Column(id())
	public appId: App['id'];

	@ManyToOne(type => App, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public app: App | null;
}
