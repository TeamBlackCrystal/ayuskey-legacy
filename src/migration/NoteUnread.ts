import { Connection } from "typeorm";
import { NoteUnread } from "@/models/entities/note-unread";
import { NoteUnread as v13NoteUnread } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateNoteUnread(
	originalDb: Connection,
	nextDb: Connection,
	noteUnreadId: string
) {
	const noteUnreadRepository = nextDb.getRepository(v13NoteUnread);
	const originalNoteUnreadRepository = originalDb.getRepository(NoteUnread);

	const checkExists = await noteUnreadRepository.findOne({
		where: { id: noteUnreadId },
	});
	if (checkExists) return;
	const noteUnread = await originalNoteUnreadRepository.findOne({
		where: { id: noteUnreadId },
	});
	if (!noteUnread) throw new Error(`noteUnread: ${noteUnreadId} が見つかりません`);
	await createUser({userId: noteUnread.userId});
	await createUser({userId: noteUnread.noteUserId});
	await noteUnreadRepository.save({
		id: noteUnread.id,
		userId: noteUnread.userId,
		noteId: noteUnread.noteId,
		isMentioned:  noteUnread.isMentioned,
		isSpecified:  noteUnread.isSpecified,
		noteUserId: noteUnread.noteUserId,
	});
	logger.succ(`noteUnread: ${noteUnreadId} の移行が完了しました`);
}

export async function migrateNoteUnreads(  // TODO: 使う
	originalDb: Connection,
	nextDb: Connection,
	noteId: string
) {
	const pagination = createPagination(originalDb, NoteUnread, {where: {noteId}});

	while (true) {
		const noteUnreads = await pagination.next();
		for (const noteUnread of noteUnreads) {
			await migrateNoteUnread(originalDb, nextDb, noteUnread.id);
		}
		if (noteUnreads.length === 0) break; // 100以下になったら止める
	}
}
