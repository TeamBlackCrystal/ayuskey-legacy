import { Connection } from "typeorm";
import { UserSecurityKey } from "@/models/entities/user-security-key";
import { UserSecurityKey as v13UserSecurityKey } from "@/v13/models";
import { createPagination, logger } from "./common";

export async function migrateUserSecurityKey(
	originalDb: Connection,
	nextDb: Connection,
	userSecurityKeyId: string
) {
	const userSecurityKeyRepository = nextDb.getRepository(v13UserSecurityKey);
	const originalUserSecurityKeyRepository =
		originalDb.getRepository(UserSecurityKey);

	const checkExists = await userSecurityKeyRepository.findOne({
		where: { id: userSecurityKeyId },
	});
	if (checkExists) return;
	const userSecurityKey = await originalUserSecurityKeyRepository.findOne({
		where: {id: userSecurityKeyId}
	});
	if (!userSecurityKey) throw new Error("userSecurityKey が見つかりません");
	await userSecurityKeyRepository.save({
		id: userSecurityKey.id,
		lastUsed: userSecurityKey.id,
		name: userSecurityKey.name,
		publicKey: userSecurityKey.publicKey,
		userId: userSecurityKey.userId,
	});
	logger.succ(`ユーザーセキュリティキー: ${userSecurityKey.id} の移行が完了しました`);
}

export async function migrateUserSecurityKeys(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, UserSecurityKey, {
		where: { userId },
	});

	while (true) {
		const userSecurityKeys = await pagination.next();
		for (const userSecurityKey of userSecurityKeys) {
			await migrateUserSecurityKey(originalDb, nextDb, userSecurityKey.id);
		}
		if (userSecurityKeys.length === 0) break; // 100以下になったら止める
	}
}
