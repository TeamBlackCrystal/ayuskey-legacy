import { User } from "@/models/entities/user";
import { User as v13User } from "@/v13/models";
import { Connection, getConnection } from "typeorm";
import { migrateDriveFile } from "./drive";
import { logger } from "./common";
import { userAfterHookQueue, userQueue } from "./jobqueue";
import { createPagination } from "./common";
import { precisionTruncate, truncate } from "@/misc/truncate";
import { migrateUserProfile } from "./UserProfile";
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, v13User>({
	max: 1000
})

/**
 * 最小限のユーザーを作成します。 
*/
export async function createUser(options: {userId: string, useUser?: User}) {
	const cacheKey = `createUser${options.userId}`


	const cacheResult = cache.get(cacheKey)
	if (cacheResult) return cacheResult;  // キャッシュがあるならそれ返して終わり

	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const userRepository = nextDb.getRepository(v13User);
	const originalUserRepository = originalDb.getRepository(User);
	const checkExists = await userRepository.findOne(options.userId);
	let user: User;
	if (options.useUser) {
		user = options.useUser;
	} else {
		const result = await originalUserRepository.findOne(options.userId);
		if (!result) throw Error(`User: ${options.userId} ユーザーが見つからない`);
		user = result;
	}
	let resultUser: v13User;

	if (checkExists) {
		resultUser = checkExists;
		logger.info(`User: ${options.userId} は既に移行済みです`);
	} else {
		resultUser = await userRepository.save({
			id: user.id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			lastFetchedAt: user.lastFetchedAt,
			lastActiveDate: user.lastActiveDate,
			hideOnlineStatus: user.hideOnlineStatus,
			username: user.username,
			usernameLower: user.username.toLowerCase(),
			name: user.name ? precisionTruncate(user.name, 128) : null,
			followersCount: user.followersCount,
			followingCount: user.followingCount,
			notesCount: user.notesCount,
			tags: user.tags,
			isSuspended: user.isSuspended,
			isLocked: user.isLocked,
			isBot: user.isBot,
			isCat: user.isCat,
			isRoot: user.isAdmin,
			isExplorable: user.isExplorable,
			isDeleted: user.isDeleted,
			emojis: user.emojis,
			host: user.host,
			inbox: user.inbox,
			sharedInbox: user.sharedInbox,
			featured: user.featured,
			uri: user.uri,
			followersUri: user.followersUri,
			token: user.token,
			movedToUri: user.movedToUser?.uri,
		});
		logger.succ(`User: ${options.userId} の移行が完了しました`);
	}
	cache.set(cacheKey, resultUser)
	return resultUser
}

export async function migrateUser(
	userId: string,
	options: { useUser?: User; useSetup?: boolean } = { useSetup: true }
) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const originalUserRepository = originalDb.getRepository(User);
	const userRepository = nextDb.getRepository(v13User);

	let user: User;
	if (options.useUser) {
		user = options.useUser;
	} else {
		const result = await originalUserRepository.findOne(userId);
		if (!result) throw Error(`User: ${userId} ユーザーが見つからない`);
		user = result;
	}

	const requiredFileIds = []; // migrateDriveFilesだとおそらくユーザーに関連付けされてない場合があり、アバターやバナー等の移行時エラーが出ることがあるからその対策
	if (user.avatarId) requiredFileIds.push(user.avatarId);
	if (user.bannerId) requiredFileIds.push(user.bannerId);
	for (const fileId of requiredFileIds) {
		await migrateDriveFile(fileId);
	}
	const resultUser = await createUser({userId, useUser: user})
	
	// ユーザーに関するファイルを設定
	resultUser.avatarId = user.avatarId;
	resultUser.bannerId = user.bannerId;
	await userRepository.save(resultUser);

	await migrateUserProfile(originalDb, nextDb, user.id);
	userAfterHookQueue.add({ userId: user.id, user });
}

export async function migrateUsers(originalDb: Connection, nextDb: Connection) {
	const pagination = createPagination(originalDb, User);
	while (true) {
		const users = await pagination.next();
		for (const user of users) {			
			await userQueue.add({ userId: user.id, user });
		}
		if (users.length === 0) break; // 100以下になったら止める
	}
}
