import { Job } from "bull";
import { migrateInstance } from "../instance";

export default async (job: Job<{instanceId: string}>, done: any) => {
    job.progress(job.data.instanceId);
    await migrateInstance(job.data.instanceId);
    done();
}