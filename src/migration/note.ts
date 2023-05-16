import { Note } from "@/models/entities/note";
import { Note as v13Note } from "@/v13/models";
import { Connection, getConnection } from "typeorm";
import { createPagination } from "./common";
import { migrateUser } from "./user";
import { migrateNoteReactions } from "./NoteReaction";
import { noteQueue } from "./jobqueue";

export async function migrateNote(noteId: string) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const noteRepository = nextDb.getRepository(v13Note);
	const originalNoteRepository = originalDb.getRepository(Note);

	async function save(note: Note) {
		await migrateUser(originalDb, nextDb, note.userId); // ユーザー作る前にもしかするとノート作成が来る可能性があるから
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
		console.log(`note: ${note.id} の移行が完了しました`);
	}

	async function checkReply(replyId: string) {
		const checkExistsReply = await noteRepository.findOne(replyId);
		if (!checkExistsReply) {
			// 無いなら作成
			const result = await originalNoteRepository.findOne(replyId);
			if (!result) throw Error(`note:reply: ${replyId} が見つかりません`);
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
			if (!result) throw Error(`note:renote: ${renoteId} が見つかりません`);
			if (result.renoteId) {
				// 親の親みたいなことがあるので、再帰的に確認して上から順に作る
				await checkRenoteId(result.renoteId);
			}
			if (result.replyId) await checkReply(result.replyId);
			await save(result); // parentを作成する
		}
	}

	const note = await originalNoteRepository.findOne({ where: { id: noteId } });
	if (!note) throw Error(`note: ${noteId} が見つかりません`);
	const checkExists = await noteRepository.findOne(note.id); // 既にノートが移行済みか確認
	if (checkExists) return; // 移行済みならスキップする

	if (note.replyId) await checkReply(note.replyId); // リプライが既に登録されてるか確認し、無いなら再帰的に作成する
	if (note.renoteId) await checkRenoteId(note.renoteId); // renoteが既に登録されてるか確認し、無いなら再帰的に作成する

	await save(note);
}

export async function migrateNotes(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Note, { where: { userId } });

	while (true) {
		const notes = await pagination.next();
		for (const note of notes) {
			noteQueue.add({ noteId: note.id });
		}
		if (notes.length < 100) break; // 100以下になったら止める
	}
}
