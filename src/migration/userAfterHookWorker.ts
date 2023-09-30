import { initDb } from "@/db/postgre";
import { logger } from "./common";
import { noteQueue, userAfterHookQueue, userQueue } from "./jobqueue";
import noteProcessor from "./processor/note.processor";
import { createConnection } from "typeorm";
import config from "@/config";
import { AyuskeyNextEntities } from "@/v13/models";
import userAfterHookProcessor from "./processor/userAfterHook.processor";
import userProcessor from "./processor/user.processor";

const cluster = require('cluster');

async function main() {
	const numWorkers = 16;

	if (cluster.isPrimary) {
		for (let i = 0; i < numWorkers; i++) {
			cluster.fork();
		}
		cluster.on("exit", (worker: any, code :any, signal:any) => {
			console.log(`worker ${worker.process.pid} died`);
		});
	} else {
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
		// userQueue.process(userProcessor);

		// userQueue.on("completed", (job) => {
		// 	logger.succ(`User: ${job.data.id} の処理が完了しました`);
		// });

		userAfterHookQueue.process(userAfterHookProcessor);
		userAfterHookQueue.on("completed", (job) => {
			logger.succ(`UserAfterHook: ${job.data.id} の処理が完了しました`);
		});
	}
}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
