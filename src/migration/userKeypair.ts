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
	if (!userKeypair) {
		console.log(`Userkeypair: ${userId} のキーペアが見つかりませんでした`);
		return
	}

	if (checkExists) return;

	await userKeypairRepository.save({
		userId: userKeypair.userId,
		publicKey: userKeypair.publicKey,
		privateKey: userKeypair.privateKey,
	});

	console.log(`Userkeypair: ${userId} の移行が完了しました`);
}
