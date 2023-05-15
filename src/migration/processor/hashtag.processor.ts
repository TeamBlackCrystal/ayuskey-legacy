import { migrateHashtag } from "../hashtag";
import { Job } from "bull";

export default async (job: Job<{hashtagId: string}>, done: any) => {
    job.progress(job.data.hashtagId);
    await migrateHashtag(job.data.hashtagId);
    done();
}