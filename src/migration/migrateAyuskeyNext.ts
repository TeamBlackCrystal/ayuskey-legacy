import { Connection, createConnection } from "typeorm";
import { initDb } from "../db/postgre";

import { AyuskeyNextEntities } from "@/v13/models";
import config from "@/config";
import { User } from "@/models/entities/user";
import { createPagination } from "./common";
import { migrateUserKeypair } from "./userKeypair";
import { migrateUserPublickey } from "./publickey";
import { migrateUserSecurityKeys } from "./securityKey";
import { migrateUser } from "./user";
import { migrateBlockings } from "./blocking";
import { migrateInstances } from "./instance";
import { migrateMutings } from "./muting";
import { migrateFollowings } from "./following";

import { hashtagQueue, instanceQueue, noteQueue } from "./jobqueue";
import hashtagProcessor from "./processor/hashtag.processor";
import { migrateMeta } from "./meta";
import {spawn} from "child_process";
import instanceProcessor from "./processor/instance.processor";
import { migrateHashtags } from "./hashtag";
import noteProcessor from "./processor/note.processor";

async function migrateUsers(originalDb: Connection, nextDb: Connection) {
	const pagination = createPagination(originalDb, User);
	while (true) {
		const users = await pagination.next();
		for (const user of users) {
			await migrateUser(originalDb, nextDb, user.id);
			await migrateUserKeypair(originalDb, nextDb, user.id);
			await migrateUserPublickey(originalDb, nextDb, user.id);
			await migrateUserSecurityKeys(originalDb, nextDb, user.id);
			await migrateBlockings(originalDb, nextDb, user.id);
			await migrateMutings(originalDb, nextDb, user.id);
			await migrateFollowings(originalDb, nextDb, user.id);
		}
		if (users.length < 100) break; // 100以下になったら止める
	}
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

	const bullDashboardProc = spawn('node', ['./built/migration/bullDashboard.js'])

	instanceQueue.process(instanceProcessor);
	hashtagQueue.process(hashtagProcessor);
	noteQueue.process(noteProcessor);

	await migrateMeta(originalDb, nextDb);  // 並列するまでもない

	await migrateInstances(originalDb, nextDb);
	await migrateHashtags(originalDb, nextDb)
	await migrateUsers(originalDb, nextDb);
}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
