import { UserListJoining } from "@/models/entities/user-list-joining";
import { UserListJoining as V13UserListJoining } from "@/v13/models";
import { getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { createUser } from "./user";
import { migrateUserList } from "./UserList";

export async function migrateUserListJoining(options: {
	userListJoiningId?: string;
	userListJoining?: UserListJoining;
}) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const originalPollVoteRepository = originalDb.getRepository(UserListJoining);
	const userListJoiningRepository = nextDb.getRepository(V13UserListJoining);

	let userListJoining: UserListJoining;

	if (options.userListJoining) {
		userListJoining = options.userListJoining;
	} else {
		const result = await originalPollVoteRepository.findOne({
			where: { id: options.userListJoiningId },
		});
		if (!result)
			throw Error(`UserListJoining: ${options.userListJoiningId} が見つかりません`);
		userListJoining = result;
	}

	const checkExists = await userListJoiningRepository.findOne({
		where: { id: userListJoining.id },
	});
	if (checkExists) {
		logger.info(`UserListJoining: ${userListJoining.id} は移行済みです`);
		return;
	}

	await createUser({ userId: userListJoining.userId });
    await migrateUserList(originalDb, nextDb, userListJoining.userListId);

	await userListJoiningRepository.save({
		id: userListJoining.id,
		createdAt: userListJoining.createdAt,
		userId: userListJoining.userId,
        userListId: userListJoining.userListId,
	});
	logger.succ(`UserListJoining: ${userListJoining.id} の移行が完了しました`);
}

export async function migrateUserListJoinings() {
	const originalDb = getConnection();
	const pagination = createPagination(originalDb, UserListJoining);

	while (true) {
		const UserListJoinings = await pagination.next();
		for (const userListJoining of UserListJoinings) {
			await migrateUserListJoining({ userListJoining });
		}

		if (UserListJoinings.length === 0) break; // 100以下になったら止める
	}
}
