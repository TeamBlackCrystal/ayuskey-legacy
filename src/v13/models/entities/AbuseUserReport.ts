import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { id } from '../id';
import { User } from './User';

@Entity()
export class AbuseUserReport {
	@PrimaryColumn(id())
	public id: string;

	@Index()
	@Column('timestamp with time zone', {
		comment: 'The created date of the AbuseUserReport.',
	})
	public createdAt: Date;

	@Index()
	@Column(id())
	public targetUserId: User['id'];  // ない 多分userId?

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public targetUser: User | null;  // ない

	@Index()
	@Column(id())
	public reporterId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public reporter: User | null;

	@Column({
		...id(),
		nullable: true,
	})
	public assigneeId: User['id'] | null;  // ない

	@ManyToOne(type => User, {
		onDelete: 'SET NULL',
	})
	@JoinColumn()
	public assignee: User | null;  // ない

	@Index()
	@Column('boolean', {
		default: false,
	})
	public resolved: boolean;  // ない

	@Column('boolean', {
		default: false,
	})
	public forwarded: boolean; //ない

	@Column('varchar', {
		length: 2048,
	})
	public comment: string;

	//#region Denormalized fields
	@Index()
	@Column('varchar', {
		length: 128, nullable: true,
		comment: '[Denormalized]',
	})
	public targetUserHost: string | null; //ない

	@Index()
	@Column('varchar', {
		length: 128, nullable: true,
		comment: '[Denormalized]',
	})
	public reporterHost: string | null; //ない
	//#endregion
}
