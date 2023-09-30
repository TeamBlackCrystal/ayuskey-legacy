import { Note } from "@/models/entities/note";
import { Note as v13Note } from "@/v13/models";
import { Connection, getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { createUser } from "./user";
import { migrateNoteReactions } from "./NoteReaction";
import { noteQueue } from "./jobqueue";
import { migrateNoteUnreads } from "./NoteUnread";
import { migrateNoteFavorites } from "./NoteFavorite";

export async function migrateNote(noteId: string, useNote?: Note) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const noteRepository = nextDb.getRepository(v13Note);
	const originalNoteRepository = originalDb.getRepository(Note);

	async function save(note: Note) {
		await createUser({userId: note.userId}); // ユーザー作る前にもしかするとノート作成が来る可能性があるから
		await noteRepository.save({
			id: note.id,
			createdAt: note.createdAt,
			replyId: note.replyId,
			renoteId: note.renoteId,
			text: note.text,
			name: note.name,
			cw: note.cw,
			userId: note.userId,
			localOnly: note.localOnly,
			renoteCount: note.renoteCount,
			repliesCount: note.repliesCount,
			reactions: note.reactions,
			visibility: note.visibility,
			uri: note.uri,
			url: note.url,
			score: note.score,
			fileIds: note.fileIds,
			attachedFileTypes: note.attachedFileTypes,
			visibleUserIds: note.visibleUserIds,
			mentions: note.mentions,
			mentionedRemoteUsers: note.mentionedRemoteUsers,
			emojis: note.emojis,
			tags: note.tags,
			hasPoll: note.hasPoll,
			userHost: note.userHost,
			replyUserId: note.userId,
			replyUserHost: note.replyUserHost,
			renoteUserId: note.renoteId,
			renoteUserHost: note.renoteUserHost,
		});
		await migrateNoteReactions(originalDb, nextDb, note.id);
		await migrateNoteUnreads(originalDb, nextDb, note.id);
		await migrateNoteFavorites(note.id);
		if (await noteQueue.getCompletedCount() >  1000) {
			await noteQueue.clean(0, 'completed')
		}
		logger.succ(`Note: ${note.id} の移行が完了しました`);
	}

	async function checkReply(replyId: string) {
		const checkExistsReply = await noteRepository.findOne(replyId);
		if (!checkExistsReply) {
			// 無いなら作成
			const result = await originalNoteRepository.findOne(replyId);
			if (!result) throw Error(`Note:reply: ${replyId} が見つかりません`);
			if (result.replyId) {
				// 親の親みたいなことがあるので、再帰的に確認して上から順に作る
				await checkReply(result.replyId);
			}
			if (result.renoteId) await checkRenoteId(result.renoteId);
			await save(result); // parentを作成する
		}
	}
	async function checkRenoteId(renoteId: string) {
		const checkExistsReply = await noteRepository.findOne(renoteId);
		if (!checkExistsReply) {
			// 無いなら作成
			const result = await originalNoteRepository.findOne(renoteId);
			if (!result) throw Error(`Note:renote: ${renoteId} が見つかりません`);
			if (result.renoteId) {
				// 親の親みたいなことがあるので、再帰的に確認して上から順に作る
				await checkRenoteId(result.renoteId);
			}
			if (result.replyId) await checkReply(result.replyId);
			await save(result); // parentを作成する
		}
	}
	let note: Note
	if (useNote) {
		note = useNote
	} else {
		const result = await originalNoteRepository.findOne({ where: { id: noteId } });
		if (!result) throw Error(`Note: ${noteId} が見つかりません`);
		note = result
	}

	


	if (note.replyId) await checkReply(note.replyId); // リプライが既に登録されてるか確認し、無いなら再帰的に作成する
	if (note.renoteId) await checkRenoteId(note.renoteId); // renoteが既に登録されてるか確認し、無いなら再帰的に作成する

	const checkExists = await noteRepository.findOne({where: {id: note.id}}); // 既にノートが移行済みか確認
	if (checkExists) return; // 移行済みならスキップする

	await save(note);
}

export async function migrateNotes(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Note, { where: { userId } });
	const noteRepository = nextDb.getRepository(v13Note);

	while (true) {
		const notes = await pagination.next();
		for (const note of notes) {
			const checkExists =  await noteRepository.findOne({where: {id: note.id}})
			if (checkExists) {
				// logger.info(`Note: ${note.id} は移行済みです`)
				continue
			}
			noteQueue.add({ noteId: note.id, note });
		}
		if (notes.length === 0) break; // 100以下になったら止める
	}
}
