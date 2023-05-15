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
import { migrateHashtags } from "./hashtag";
import { migrateBlockings } from "./blocking";
import { migrateInstances } from "./instance";
import { migrateMutings } from "./muting";
import { migrateFollowings } from "./following";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { KoaAdapter } from "@bull-board/koa";

import { hashtagQueue, queues } from "./jobqueue";
import * as Router from "@koa/router";
import * as Koa from "koa";
import hashtagProcessor from "./processor/hashtag.processor";
import { migrateMeta } from "./meta";

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

	const app = new Koa();
	const router = new Router();
	const serverAdapter = new KoaAdapter();
	hashtagQueue.process(hashtagProcessor);

	// @ts-ignore
	createBullBoard({
		queues: queues.map((q) => new BullAdapter(q)),
		serverAdapter,
	});
	serverAdapter.setBasePath("/ui");
	await app.use(serverAdapter.registerPlugin());
	app.use(router.routes()).use(router.allowedMethods());

	await app.listen(3000, async () => {
		await migrateMeta(originalDb, nextDb);
		await migrateHashtags(originalDb, nextDb);
		await migrateInstances(originalDb, nextDb);
		await migrateUsers(originalDb, nextDb);
		console.log(`Worker ${process.pid} is listening on port 3000`);
	});
}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
