import { Connection } from "typeorm";
import { Signin } from "@/models/entities/signin";
import { Signin as v13Signin } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateSignin(
	originalDb: Connection,
	nextDb: Connection,
	signinId: string
) {
	const signinRepository = nextDb.getRepository(v13Signin);
	const originalSigninRepository = originalDb.getRepository(Signin);

	const checkExists = await signinRepository.findOne({
		where: { id: signinId },
	});
	if (checkExists) return;
	const signin = await originalSigninRepository.findOne({
		where: { id: signinId },
	});

	if (!signin)
		throw new Error(`signin: ${signinId} が見つかりません`);
	await createUser({userId: signin.userId});

	await signinRepository.save({
		id: signin.id,
		createdAt: signin.createdAt,
        userId: signin.userId,
        ip: signin.ip,
        headers: signin.headers,
        success: signin.success
	});
	logger.succ(`signin: ${signin.id} の移行が完了しました`);

}

export async function migrateSignins(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Signin, {
		where: { userId },
	});

	while (true) {
		const signins = await pagination.next();
		for (const signin of signins) {
			await migrateSignin(originalDb, nextDb, signin.id);
		}
		if (signins.length === 0) break; // 100以下になったら止める
	}
}
