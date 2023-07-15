import { Job } from "bull";
import { User } from "@/models/entities/user";
import { userAfterHook } from "../userAfterHook";

export default async (job: Job<{user: User}>, done: any) => {
    job.progress(job.data.user.id);
    await userAfterHook(job.data.user);
    done();
}
