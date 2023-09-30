import { User } from "@/models/entities/user";
import { migrateSignins } from "./Signin";
import { migrateUserKeypair } from "./userKeypair";
import { migrateUserPublickey } from "./publickey";
import { migrateUserSecurityKeys } from "./securityKey";
import { migrateBlockings } from "./blocking";
import { migrateFollowings } from "./following";
import { migrateMutings } from "./muting";
import { migrateNotes } from "./note";
import { migrateDriveFiles, migrateDriveFolders } from "./drive";
import { getConnection } from "typeorm";
import { migratePasswordResetRequests } from "./PassworResetRequest";
import { migrateAuthSessions } from "./AuthSession";
import { noteQueue, userAfterHookQueue } from "./jobqueue";
import { logger } from "./common";

export async function userAfterHook(user: User) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	await migrateDriveFolders(originalDb, nextDb, user.id); // そんなにフォルダがあるなんてこと無いだろうから、キューにする必要はない?
	await migrateDriveFiles(originalDb, nextDb, user.id);
	while (true) {
		if ((await noteQueue.getCompletedCount()) < 1000000) {
			await migrateNotes(originalDb, nextDb, user.id);
            break
		} else {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	await migrateUserKeypair(originalDb, nextDb, user.id);
	await migrateUserPublickey(originalDb, nextDb, user.id);
	await migrateUserSecurityKeys(originalDb, nextDb, user.id);
	await migrateBlockings(originalDb, nextDb, user.id);
	await migrateMutings(originalDb, nextDb, user.id);
	await migrateFollowings(originalDb, nextDb, user.id);
	await migrateSignins(originalDb, nextDb, user.id);
	await migratePasswordResetRequests(originalDb, nextDb, user.id);
	await migrateAuthSessions(originalDb, nextDb, user.id);

	if ((await userAfterHookQueue.getCompletedCount()) > 1000) {
		await userAfterHookQueue.clean(0, "completed");
	}
	logger.succ(`UserAfterHook: ${user.id} の処理が完了しました`);
}