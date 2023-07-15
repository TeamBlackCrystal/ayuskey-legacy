import { UserNotePining } from "@/models/entities/user-note-pinings";
import { UserNotePining as v13UserNotePining } from "@/v13/models/entities/UserNotePining";
import { getConnection } from "typeorm";
import { logger } from "./common";
import { createPagination } from "./common";
import { migrateNote } from "./note";
import { createUser } from "./user";

export async function migrateUserNotePining(options: {piningId?: string, userNotePining?: UserNotePining}) {
    const originalDb = getConnection();
    const nextDb = getConnection("nextDb");
    const userNotePiningRepository = nextDb.getRepository(v13UserNotePining);
    const originalUserNotePiningRepository = originalDb.getRepository(UserNotePining);

    let pining: UserNotePining;

    if (options.userNotePining) {
        pining = options.userNotePining;
    } else {
        const result = await originalUserNotePiningRepository.findOne({
            id: options.piningId
        })
        if (!result) throw new Error(`UserNotePining: ${options.piningId} が見つかりません`);
        pining = result;
    }



    const checkExists = await userNotePiningRepository.findOne({where: {id: pining.id}});
	if (checkExists) {
        logger.info(`UserNotePining: ${pining.id} は移行済みです`)
        return
    };

    await createUser({userId: pining.userId});
    await migrateNote(pining.noteId);

    await userNotePiningRepository.save({
        id: pining.id,
        createdAt: pining.createdAt,
        userId: pining.userId,
        noteId: pining.noteId        
    })
}


export async function migrateUserNotePinings() {
	const originalDb = getConnection();
	const pagination = createPagination(originalDb, UserNotePining);

	while (true) {
		const userNotePinings = await pagination.next();
		for (const userNotePining of userNotePinings) {
			await migrateUserNotePining({userNotePining});
		}

		if (userNotePinings.length === 0) break; // 100以下になったら止める
	}
}
