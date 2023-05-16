import { User } from "@/models/entities/user";
import { User as v13User } from "@/v13/models";
import { Connection } from "typeorm";
import { migrateDriveFile, migrateDriveFiles, migrateDriveFolder } from "./drive";
import { migrateNotes } from "./note";

export async function migrateUser(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const userRepository = nextDb.getRepository(v13User);
	const originalUserRepository = originalDb.getRepository(User);

	let resultUser: v13User;
	const checkExists = await userRepository.findOne(userId);
	const user = await originalUserRepository.findOne(userId);
	if (!user) throw Error("ユーザーが見つからない");

	if (checkExists) {
		resultUser = checkExists;
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
			name: user.name,
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
	}

	await migrateDriveFolder(originalDb, nextDb, resultUser.id);
	await migrateDriveFiles(originalDb, nextDb, resultUser.id);
	
	const requiredFileIds = []  // migrateDriveFilesだとおそらくユーザーに関連付けされてない場合があり、アバターやバナー等の移行時エラーが出ることがあるからその対策
	if (user.avatarId) requiredFileIds.push(user.avatarId);
	if (user.bannerId) requiredFileIds.push(user.bannerId);

	for (const fileId of requiredFileIds) {
		await migrateDriveFile(originalDb, nextDb, fileId)
	}
	resultUser.avatarId = user.avatarId;
	resultUser.bannerId = user.bannerId;
	await userRepository.save(resultUser);

	await migrateNotes(originalDb, nextDb, resultUser.id);
	console.log(`User: ${userId} の移行が完了しました`);
}
