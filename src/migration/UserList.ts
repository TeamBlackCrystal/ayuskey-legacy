import { Connection } from "typeorm";
import { UserList } from "@/models/entities/user-list";
import { UserList as v13UserList } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateUserList(
	originalDb: Connection,
	nextDb: Connection,
	userListId: string
) {
	const userListRepository = nextDb.getRepository(v13UserList);
	const originalUserListRepository = originalDb.getRepository(UserList);

	const checkExists = await userListRepository.findOne({
		where: { id: userListId },
	});
	if (checkExists) {
        logger.info(`ユーザーリスト: ${userListId} は移行済みです`)
        return
    };
	const userList = await originalUserListRepository.findOne({
		where: { id: userListId },
	});

	if (!userList)
		throw new Error("userList が見つかりません");

	await createUser({userId: userList.userId});

	await userListRepository.save({
		id: userList.id,
        createdAt: userList.createdAt,
        userId: userList.userId,
        name: userList.name
	});
	logger.succ(`ユーザーリスト: ${userList.id} の移行が完了しました`);
}

export async function migrateUserLists(
	originalDb: Connection,
	nextDb: Connection,
) {
	const pagination = createPagination(originalDb, UserList);

	while (true) {
		const userLists = await pagination.next();
		for (const userList of userLists) {
			await migrateUserList(originalDb, nextDb, userList.id);
		}
		if (userLists.length === 0) break; // 100以下になったら止める
	}
}
