import { initDb } from "@/db/postgre";
import { logger } from "./common";
import {
	driveFileQueue,
	hashtagQueue,
	instanceQueue,
	noteQueue,
	usedUsernameQueue,
	userAfterHookQueue,
	userQueue,
} from "./jobqueue";
import driveFileProcessor from "./processor/driveFile.processor";
import hashtagProcessor from "./processor/hashtag.processor";
import instanceProcessor from "./processor/instance.processor";
import noteProcessor from "./processor/note.processor";
import usedUsernameProcessor from "./processor/usedUsername.processor";
import userProcessor from "./processor/user.processor";
import userAfterHookProcessor from "./processor/userAfterHook.processor";
import { createConnection } from "typeorm";
import config from "@/config";
import { AyuskeyNextEntities } from "@/v13/models";

async function main() {
    await initDb();
    await createConnection({
		name: "nextDb",
		type: "postgres",
		host: config.db.nextDb.host,
		port: config.db.nextDb.port,
		username: config.db.nextDb.user,
		password: config.db.nextDb.pass,
		database: config.db.nextDb.db,
		entities: AyuskeyNextEntities,
	});

	instanceQueue.process(instanceProcessor);
	hashtagQueue.process(hashtagProcessor);
	noteQueue.process(noteProcessor);
	usedUsernameQueue.process(usedUsernameProcessor);
	driveFileQueue.process(driveFileProcessor);
	userQueue.process(userProcessor);
	userAfterHookQueue.process(userAfterHookProcessor);

	instanceQueue.on("completed", (job) => {
		logger.succ(`Instance: ${job.data.id} の処理が完了しました`);
	});

	noteQueue.on("completed", (job) => {
		logger.succ(`Note: ${job.data.id} の処理が完了しました`);
	});

	hashtagQueue.on("completed", (job) => {
		logger.succ(`Hashtag: ${job.data.id} の処理が完了しました`);
	});

	userQueue.on("completed", (job) => {
		logger.succ(`User: ${job.data.id} の処理が完了しました`);
	});

	usedUsernameQueue.on("completed", (job) => {
		logger.succ(`UsedUsername: ${job.data.id} の処理が完了しました`);
	});

	userAfterHookQueue.on("completed", (job) => {
		logger.succ(`UserAfterHook: ${job.data.id} の処理が完了しました`);
	});
}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
