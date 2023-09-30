import { Job } from "bull";
import { migrateNote } from "../note";
import { Note } from "@/models/entities/note";
import { initDb } from "@/db/postgre";
import { createConnection } from "typeorm";
import config from "@/config";
import { AyuskeyNextEntities } from "@/v13/models";

export default async (job: Job<{noteId: string, note: Note}>, done: any) => {
	await initDb();
	const con = await createConnection({
		name: "nextDb",
		type: "postgres",
		host: config.db.nextDb.host,
		port: config.db.nextDb.port,
		username: config.db.nextDb.user,
		password: config.db.nextDb.pass,
		database: config.db.nextDb.db,
		entities: AyuskeyNextEntities,
	});
    job.progress(job.data.noteId);
    await migrateNote(job.data.noteId, job.data.note);
    done();
		await con.close();
		
}
