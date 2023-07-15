import { UserKeypair } from "@/models/entities/user-keypair";
import { UserKeypair as v13UserKeypair } from "@/v13/models";
import { Connection } from "typeorm";
import { logger } from "./common";

export async function migrateUserKeypair(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const userKeypairRepository = nextDb.getRepository(v13UserKeypair);
	const originalUserKeypairRepository = originalDb.getRepository(UserKeypair);

	const checkExists = await userKeypairRepository.findOne({
		where: { userId },
	});
	const userKeypair = await originalUserKeypairRepository.findOne({
		where: { userId },
	});
	if (!userKeypair) {
		logger.warn(`Userkeypair: ${userId} のキーペアが見つかりませんでした`);
		return
	}

	if (checkExists) {
		logger.info(`Userkeypair: ${userId} のキーペアは移行済みです`)
		return
	};

	await userKeypairRepository.save({
		userId: userKeypair.userId,
		publicKey: userKeypair.publicKey,
		privateKey: userKeypair.privateKey,
	});

	logger.succ(`Userkeypair: ${userId} の移行が完了しました`);
}
