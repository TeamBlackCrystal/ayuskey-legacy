import { UserKeypair } from "@/models/entities/user-keypair";
import { UserKeypair as v13UserKeypair } from "@/v13/models";
import { Connection } from "typeorm";

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
	console.log(userId);
	if (!userKeypair) throw Error("ユーザーキーペアが見つからない");

	if (checkExists) return;

	await userKeypairRepository.save({
		userId: userKeypair.userId,
		user: userKeypair.user,
		publicKey: userKeypair.publicKey,
		private: userKeypair.privateKey,
	});

	console.log(`id: ${userId}の移行が完了しました`);
}
