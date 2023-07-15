import { Connection, getConnection } from "typeorm";
import { UsedUsername } from "@/models/entities/used-username";
import { UsedUsername as v13UsedUsername } from "@/v13/models";
import { createPagination, logger } from "./common";
import { usedUsernameQueue } from "./jobqueue";

export async function migrateUsedUsername(
	usedUsernameId: string
) {
    const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const usedUsernameRepository = nextDb.getRepository(v13UsedUsername);
	const originalUsedUsernameRepository = originalDb.getRepository(UsedUsername);

	const checkExists = await usedUsernameRepository.findOne({
		where: { username: usedUsernameId },
	});
	if (checkExists) return;
	const usedUsername = await originalUsedUsernameRepository.findOne({
		where: { username: usedUsernameId },
	});
	if (!usedUsername) throw new Error(`usedUsername: ${usedUsernameId} が見つかりません`);

	await usedUsernameRepository.save({
		username: usedUsername.username,
        createdAt: usedUsername.createdAt
	});
	logger.succ(`usedUsername: ${usedUsernameId} の移行が完了しました`);
}

export async function migrateUsedUsernames(  // TODO: 使う
	originalDb: Connection,
	nextDb: Connection,
) {
	const pagination = createPagination(originalDb, UsedUsername);

	while (true) {
		const usedUsernames = await pagination.next();
		for (const usedUsername of usedUsernames) {
			usedUsernameQueue.add({usedUsernameId: usedUsername.username});
		}
		if (usedUsernames.length === 0) break; // 100以下になったら止める
	}
}
