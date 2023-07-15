import { Hashtag } from "@/models/entities/hashtag";
import { migrateHashtag } from "../hashtag";
import { Job } from "bull";

export default async (job: Job<{hashtagId: string, useHashtag:Hashtag}>, done: any) => {
    job.progress(job.data.hashtagId);
    await migrateHashtag(job.data.hashtagId, job.data.useHashtag);
    done();
}