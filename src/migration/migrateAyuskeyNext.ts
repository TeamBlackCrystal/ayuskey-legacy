import { createConnection } from "typeorm";
import { initDb } from "../db/postgre";

import { AyuskeyNextEntities } from "@/v13/models";

import config from "@/config";

import { migrateMeta } from "./meta";
import { spawn } from "child_process";
import { migrateUsedUsernames } from "./UsedUsername";

import {
	driveFileQueue,
	hashtagQueue,
	instanceQueue,
	noteQueue,
	usedUsernameQueue,
	userAfterHookQueue,
	userQueue,
} from "./jobqueue";
import hashtagProcessor from "./processor/hashtag.processor";
import instanceProcessor from "./processor/instance.processor";
import noteProcessor from "./processor/note.processor";
import usedUsernameProcessor from "./processor/usedUsername.processor";

import driveFileProcessor from "./processor/driveFile.processor";
import userProcessor from "./processor/user.processor";
import userAfterHookProcessor from "./processor/userAfterHook.processor";
import { migrateUsers } from "./user";
import { migrateRelaies } from "./Relay";
import { migrateApps } from "./App";
import { migrateAbuseUserReports } from "./AbuseUserReport";
import { migrateRegistryItems } from "./RegistryItem";
import { migrateUserLists } from "./UserList";
import { migrateSwSubscriptions } from "./SwSubscription";
import { migratePolls } from "./Poll";
import { migrateUserListJoinings } from "./UserListJoining";
import { migrateAnnouncements } from "./Announcement";
import { migrateInstances } from "./instance";
import { migrateHashtags } from "./hashtag";
import { Queue } from "bull";

async function useCleanQueue(queue: Queue): Promise<void> {
	async function cleanQueue(queue: Queue): Promise<void> {
		try {
			const removedCount = await queue.clean(0, "completed");
			console.log(`削除されたジョブ数 (${queue.name}): ${removedCount}`);
		} catch (error) {
			console.error(
				`ジョブのクリーンアップ中にエラーが発生しました (${queue.name}):`,
				error
			);
		}
	}

	setTimeout(() => {
		cleanQueue(queue);
	}, 5 * 60 * 1000);
}

async function main(): Promise<any> {
	const originalDb = await initDb();
	const nextDb = await createConnection({
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

	useCleanQueue(noteQueue);
	useCleanQueue(userQueue);

	const bullDashboardProc = spawn("node", [
		"./built/migration/bullDashboard.js",
	]);

	bullDashboardProc.stdout.on("message", (data) => {
		console.log(data);
	});

	await migrateAnnouncements();
	await migrateRelaies(originalDb, nextDb);
	await migrateUsedUsernames(originalDb, nextDb);
	await migrateMeta(originalDb, nextDb); // 並列するまでもない

	await migrateInstances(originalDb, nextDb);
	await migrateHashtags(originalDb, nextDb);
	await migrateUserLists(originalDb, nextDb);
	await migrateUserListJoinings();
	await migrateRegistryItems(originalDb, nextDb);
	await migrateAbuseUserReports(originalDb, nextDb);
	await migrateApps(originalDb, nextDb);
	await migratePolls();
	await migrateSwSubscriptions();
	await migrateUsers(originalDb, nextDb);

	process.on("SIGINT", () => {
		bullDashboardProc.kill();
		process.exit(0);
	});
}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
