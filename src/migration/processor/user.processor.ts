import { Job } from "bull";
import { migrateUser } from "../user";
import { User } from "@/models/entities/user";

export default async (job: Job<{userId: string, user: User}>, done: any) => {
    job.progress(job.data.user);
    await migrateUser(job.data.userId, {useUser: job.data.user});
    done();
}
