import { Connection } from "typeorm";
import { App } from "@/models/entities/app";
import { App as v13App } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateApp(
	originalDb: Connection,
	nextDb: Connection,
	appId: string
) {
	const appRepository = nextDb.getRepository(v13App);
	const originalAppRepository = originalDb.getRepository(App);

	const checkExists = await appRepository.findOne({
		where: { id: appId },
	});
	if (checkExists) return;
	const app = await originalAppRepository.findOne({
		where: { id: appId },
	});
	if (!app) throw new Error(`app: ${appId} が見つかりません`);
	if (app.userId) await createUser({userId: app.userId});
	await appRepository.save({
		id: app.id,
		createdAt: app.createdAt,
		userId: app.userId,
		secret: app.secret,
		name: app.name,
		description: app.description,
		permission: app.permission,
		callbackUrl: app.callbackUrl,
	});
	logger.succ(`app: ${appId} の移行が完了しました`);
}

export async function migrateApps(  // TODO: 使う
	originalDb: Connection,
	nextDb: Connection,
) {
	const pagination = createPagination(originalDb, App);

	while (true) {
		const apps = await pagination.next();
		for (const app of apps) {
			await migrateApp(originalDb, nextDb, app.id);
		}
		if (apps.length === 0) break; // 100以下になったら止める
	}
}
