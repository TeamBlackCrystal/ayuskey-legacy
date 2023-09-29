import { initDb } from "@/db/postgre";
import { logger } from "./common";
import {
	noteQueue,
} from "./jobqueue";
import noteProcessor from "./processor/note.processor";
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

	noteQueue.process(noteProcessor);


	noteQueue.on("completed", (job) => {
		logger.succ(`Note: ${job.data.id} の処理が完了しました`);
	});

}
main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
