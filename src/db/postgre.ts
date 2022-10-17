import { createConnection, Logger, getConnection } from 'typeorm';
import config from '../config';
import { entities as charts } from '../services/chart/entities';
import { dbLogger } from './logger';
import * as highlight from 'cli-highlight';
import {
	Log,
	User,
	DriveFile,
	DriveFolder,
	AccessToken,
	App,
	PollVote,
	Note,
	NoteReaction,
	NoteWatching,
	NoteUnread,
	Notification,
	Meta,
	Following,
	Instance,
	Muting,
	SwSubscription,
	Blocking,
	UserList,
	UserListJoining,
	UserGroup,
	UserGroupJoining,
	UserGroupInvite,
	Hashtag,
	NoteFavorite,
	AbuseUserReport,
	RegistrationTicket,
	MessagingMessage,
	Signin,
	AuthSession,
	FollowRequest,
	Emoji,
	ReversiGame,
	ReversiMatching,
	UserNotePining,
	Poll,
	UserKeypair,
	UserPublickey,
	UserProfile,
	UserSecurityKey,
	AttestationChallenge,
	Page,
	PageLike,
	ModerationLog,
	UsedUsername,
	Announcement,
	AnnouncementRead,
	Clip,
	ClipNote,
	Antenna,
	AntennaNote,
	Relay,
	Channel,
	ChannelFollowing,
	ChannelNotePining,
	RegistryItem,
	PasswordResetRequest
} from '@ayuskey/models';
import { RedisOptions } from 'ioredis';

const sqlLogger = dbLogger.createSubLogger('sql', 'white', false);

class MyCustomLogger implements Logger {
	private highlight(sql: string) {
		return highlight.highlight(sql, {
			language: 'sql', ignoreIllegals: true,
		});
	}

	public logQuery(query: string, parameters?: any[]) {
		sqlLogger.info(this.highlight(query));
	}

	public logQueryError(error: string, query: string, parameters?: any[]) {
		sqlLogger.error(this.highlight(query));
	}

	public logQuerySlow(time: number, query: string, parameters?: any[]) {
		sqlLogger.warn(this.highlight(query));
	}

	public logSchemaBuild(message: string) {
		sqlLogger.info(message);
	}

	public log(message: string) {
		sqlLogger.info(message);
	}

	public logMigration(message: string) {
		sqlLogger.info(message);
	}
}

export const entities = [
	Announcement,
	AnnouncementRead,
	Meta,
	Instance,
	App,
	AuthSession,
	AccessToken,
	User,
	UserProfile,
	UserKeypair,
	UserPublickey,
	UserList,
	UserListJoining,
	UserGroup,
	UserGroupJoining,
	UserGroupInvite,
	UserNotePining,
	UserSecurityKey,
	UsedUsername,
	AttestationChallenge,
	Following,
	FollowRequest,
	Muting,
	Blocking,
	Note,
	NoteFavorite,
	NoteReaction,
	NoteWatching,
	NoteUnread,
	Page,
	PageLike,
	Log,
	DriveFile,
	DriveFolder,
	Poll,
	PollVote,
	Notification,
	Emoji,
	Hashtag,
	SwSubscription,
	AbuseUserReport,
	RegistrationTicket,
	MessagingMessage,
	Signin,
	ModerationLog,
	Clip,
	ClipNote,
	Antenna,
	AntennaNote,
	ReversiGame,
	ReversiMatching,
	Relay,
	Channel,
	ChannelFollowing,
	ChannelNotePining,
	RegistryItem,
	PasswordResetRequest,
	...charts as any,
];

let redisOpts: RedisOptions;

if (config.redis.path == null) {
	redisOpts = {
		host: config.redis.host,
		port: config.redis.port,
		family: config.redis.family == null ? 0 : config.redis.family,
		password: config.redis.pass,
		keyPrefix: `${config.redis.prefix}:query:`,
		db: config.redis.db || 0,
	};
} else {
	redisOpts = {
		path: config.redis.path,
		password: config.redis.pass,
		keyPrefix: `${config.redis.prefix}:query:`,
		db: config.redis.db || 0,
	};
}

export function initDb(justBorrow = false, sync = false, log = false, forceRecreate = false) {
	if (!forceRecreate) {
		try {
			const conn = getConnection();
			return Promise.resolve(conn);
		} catch (e) {}
	}

	return createConnection({
		type: 'postgres',
		host: config.db.host,
		port: config.db.port,
		username: config.db.user,
		password: config.db.pass,
		database: config.db.db,
		extra: config.db.extra,
		synchronize: process.env.NODE_ENV === 'test' || sync,
		dropSchema: process.env.NODE_ENV === 'test' && !justBorrow,
		cache: !config.db.disableCache ? {
			type: 'ioredis',
			options: redisOpts,
		} : false,
		logging: log,
		logger: log ? new MyCustomLogger() : undefined,
		entities: entities,
	});
}
