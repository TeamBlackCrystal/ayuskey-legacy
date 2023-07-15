import { Job } from "bull";
import { migrateUsedUsername } from "../UsedUsername";

export default async (job: Job<{usedUsernameId: string}>, done: any) => {
    job.progress(job.data.usedUsernameId);
    await migrateUsedUsername(job.data.usedUsernameId);
    done();
}
