import { NoteFavorite } from "@/models/entities/note-favorite";
import { NoteFavorite as V13PollVote } from "@/v13/models";
import { getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { createUser } from "./user";
import { migrateNote } from "./note";

export async function migrateNoteFavorite(options: {
	pollVoteId?: string;
	noteFavorite?: NoteFavorite;
}) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const originalPollVoteRepository = originalDb.getRepository(NoteFavorite);
	const pollVoteRepository = nextDb.getRepository(V13PollVote);

	let noteFavorite: NoteFavorite;

	if (options.noteFavorite) {
		noteFavorite = options.noteFavorite;
	} else {
		const result = await originalPollVoteRepository.findOne({
			where: { id: options.pollVoteId },
		});
		if (!result)
			throw Error(`NoteFavorite: ${options.pollVoteId} が見つかりません`);
		noteFavorite = result;
	}

	const checkExists = await pollVoteRepository.findOne({
		where: { id: noteFavorite.id },
	});
	if (checkExists) {
		logger.info(`NoteFavorite: ${noteFavorite.id} は移行済みです`);
		return;
	}

	await migrateNote(noteFavorite.noteId);
	await createUser({ userId: noteFavorite.userId });

	await pollVoteRepository.save({
		id: noteFavorite.id,
		createdAt: noteFavorite.createdAt,
		userId: noteFavorite.userId,
		noteId: noteFavorite.noteId,
	});
	logger.succ(`NoteFavorite: ${noteFavorite.id} の移行が完了しました`);
}

export async function migrateNoteFavorites(noteId: string) {
	const originalDb = getConnection();
	const pagination = createPagination(originalDb, NoteFavorite, {
		where: { noteId },
	});

	while (true) {
		const NoteFavorites = await pagination.next();
		for (const noteFavorite of NoteFavorites) {
			await migrateNoteFavorite({ noteFavorite });
		}

		if (NoteFavorites.length === 0) break; // 100以下になったら止める
	}
}
