import { Connection } from "typeorm";
import { AuthSession } from "@/models/entities/auth-session";
import { AuthSession as v13AuthSession } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";
import { migrateApp } from "./App";

export async function migrateAuthSession(
	originalDb: Connection,
	nextDb: Connection,
	authSessionId: string
) {
	const authSessionRepository = nextDb.getRepository(v13AuthSession);
	const originalAuthSessionRepository = originalDb.getRepository(AuthSession);

	const checkExists = await authSessionRepository.findOne({
		where: { id: authSessionId },
	});
	if (checkExists) return;
	const authSession = await originalAuthSessionRepository.findOne({
		where: { id: authSessionId },
	});
	if (!authSession) throw new Error(`authSession: ${authSessionId} が見つかりません`);

	await createUser({userId: authSession.userId});
    await migrateApp(originalDb, nextDb, authSession.appId)

    await authSessionRepository.save({
		id: authSession.id,
        createdAt: authSession.createdAt,
        token: authSession.token,
        userId: authSession.userId,
        appId: authSession.appId
	});
    logger.succ(`authSession: ${authSessionId} の移行が完了しました`);
}

export async function migrateAuthSessions(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, AuthSession, {
		where: { userId },
	});

	while (true) {
		const authSessions = await pagination.next();
		for (const authSession of authSessions) {
			await migrateAuthSession(originalDb, nextDb, authSession.id);
		}
		if (authSessions.length === 0) break; // 100以下になったら止める
	}
}
