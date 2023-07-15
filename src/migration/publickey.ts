import { Connection } from "typeorm";
import { UserPublickey } from "@/models/entities/user-publickey";
import { UserPublickey as v13UserPublickey } from "@/v13/models";
import { logger } from "./common";

export async function migrateUserPublickey(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const userPublickeyRepository = nextDb.getRepository(v13UserPublickey);
	const originalUserPublickeyRepository =
		originalDb.getRepository(UserPublickey);
	const checkExists = await userPublickeyRepository.findOne({
		where: { userId },
	});
	if (checkExists) return;

	const userPublickey = await originalUserPublickeyRepository.findOne({
		where: { userId },
	});
	if (!userPublickey) {
		logger.warn(`publickey: ${userId} が見つかりませんでした`);
		return;
	}
	await userPublickeyRepository.save({
		keyId: userPublickey.keyId,
		keyPem: userPublickey.keyPem,
		userId,
	});
	logger.succ(`publickey: ${userPublickey.keyId} の移行が完了しました`);
}
