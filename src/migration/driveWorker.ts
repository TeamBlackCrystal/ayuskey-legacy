import { initDb } from "@/db/postgre";
import { logger } from "./common";
import { driveFileQueue } from "./jobqueue";
import driveFileProcessor from "./processor/driveFile.processor";
import { createConnection } from "typeorm";
import config from "@/config";
import { AyuskeyNextEntities } from "@/v13/models";

const cluster = require("cluster");

async function main() {
	const numWorkers = 16;
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
	if (cluster.isPrimary) {
		for (let i = 0; i < numWorkers; i++) {
			cluster.fork();
		}
		cluster.on("exit", (worker: any, code: any, signal: any) => {
			console.log(`worker ${worker.process.pid} died`);
		});
	} else {
		driveFileQueue.process(driveFileProcessor);

		driveFileQueue.on("completed", (job) => {
			logger.succ(`DriveFile: ${job.data.driveFileId} の処理が完了しました`);
		});
	}
}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
