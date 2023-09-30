import { Job } from "bull";
import { migrateNote } from "../note";
import { Note } from "@/models/entities/note";

export default async (job: Job<{noteId: string, note: Note}>, done: any) => {

    job.progress(job.data.noteId);
    await migrateNote(job.data.noteId, job.data.note);
    done();
		
}
