import { Connection } from "typeorm";
import { NoteReaction } from "@/models/entities/note-reaction";
import { NoteReaction as v13NoteReaction } from "@/v13/models";
import { migrateUser } from "./user";
import { createPagination } from "./common";
import { migrateNote } from "./note";

export async function migrateNoteReaction(
	originalDb: Connection,
	nextDb: Connection,
	noteReactionId: string
) {
	const noteReactionRepository = nextDb.getRepository(v13NoteReaction);
	const originalNoteReactionRepository = originalDb.getRepository(NoteReaction);

	const checkExists = await noteReactionRepository.findOne({
		where: { id: noteReactionId },
	});
	if (checkExists) return;
	const noteReaction = await originalNoteReactionRepository.findOne({
		where: { id: noteReactionId },
	});

	if (!noteReaction)
		throw new Error(`NoteReaction: ${noteReactionId} が見つかりません`);

    await migrateUser(originalDb, nextDb, noteReaction.userId);
	await migrateNote(noteReaction.noteId)
	await noteReactionRepository.save({
		id: noteReaction.id,
        createdAt: noteReaction.createdAt,
        userId: noteReaction.userId,
		noteId: noteReaction.noteId,
		reaction: noteReaction.reaction
	});
	console.log(`NoteReaction: ${noteReaction.id} の移行が完了しました`);

}

export async function migrateNoteReactions(
	originalDb: Connection,
	nextDb: Connection,
	noteId: string
) {
	const pagination = createPagination(originalDb, NoteReaction, {where: {noteId}})

	while (true) {
		const noteReactions = await pagination.next();
		for (const noteReaction of noteReactions) {
			await migrateNoteReaction(originalDb, nextDb, noteReaction.id);
		}
		if (noteReactions.length < 100) break; // 100以下になったら止める
	}
}
