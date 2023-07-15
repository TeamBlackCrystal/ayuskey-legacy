import { Job } from "bull";
import { migrateDriveFile } from "../drive";
import { DriveFile } from "@/models/entities/drive-file";

export default async (job: Job<{driveFileId: string,
	useFile: DriveFile}>, done: any) => {
    job.progress(job.data.driveFileId);
    await migrateDriveFile(job.data.driveFileId, job.data.useFile);
    done();
}
