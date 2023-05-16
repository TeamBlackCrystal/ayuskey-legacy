import { Job } from "bull";
import { migrateNote } from "../note";

export default async (job: Job<{noteId: string}>, done: any) => {
    job.progress(job.data.noteId);
    await migrateNote(job.data.noteId);
    done();
}