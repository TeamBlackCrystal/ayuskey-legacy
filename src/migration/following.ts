import { Connection } from "typeorm";
import { Following } from "@/models/entities/following";
import { Following as v13Following } from "@/v13/models";
import { migrateUser } from "./user";
import { createPagination } from "./common";

export async function migrateFollowing(
	originalDb: Connection,
	nextDb: Connection,
	followingId: string
) {
	const followingRepository = nextDb.getRepository(v13Following);
	const originalFollowingRepository = originalDb.getRepository(Following);

	const checkExists = await followingRepository.findOne({
		where: { id: followingId },
	});
	if (checkExists) return;
	const following = await originalFollowingRepository.findOne({
		where: { id: followingId },
	});

	if (!following || !following.followee)
		throw new Error("following もしくは following.followee が見つかりません");
	await migrateUser(originalDb, nextDb, following.followee.id);

	await followingRepository.save({
		id: following.id,
		createdAt: following.createdAt,
		followeeId: following.followeeId,
		followerId: following.followerId,
		followerHost: following.followerHost,
		followerInbox: following.followerInbox,
		followerSharedInbox: following.followerSharedInbox,
		followeeHost: following.followeeHost,
		followeeInbox: following.followeeInbox,
		followeeSharedInbox: following.followeeSharedInbox,
	});
	console.log(`フォロー: ${following.follower?.username} => ${following.followee?.username} の移行が完了しました`);

}

export async function migrateFollowings(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Following, {
		where: { followerId: userId },
	});

	while (true) {
		const followers = await pagination.next();
		for (const follower of followers) {
			await migrateFollowing(originalDb, nextDb, follower.id);
		}
		if (followers.length < 100) break; // 100以下になったら止める
	}
}
