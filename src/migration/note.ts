import { Note } from '@/models/entities/note';
import { Note as v13Note } from '@/v13/models';
import { Connection } from 'typeorm';
import { createPagination } from './common';


export async function migrateNote(originalDb: Connection, nextDb: Connection, userId: string) {
    const noteRepository = nextDb.getRepository(v13Note)
    const originalNoteRepository = originalDb.getRepository(Note)
    const pagination = createPagination(originalDb, Note, { where: { userId } })

    async function save(note: Note) {
        await noteRepository.save({
            id: note.id,
            createdAt: note.createdAt,
            replyId: note.replyId,
            renoteId: note.renoteId,
            text: note.text,
            name: note.name,
            cw: note.cw,
            userId,
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
            renoteUserHost: note.renoteUserHost
        })
        console.log(`ノート: ${note.id} の移行が完了しました`)
    }

    async function checkReply(replyId: string) {
        const checkExistsReply = await noteRepository.findOne(replyId);
        if (!checkExistsReply) {  // 無いなら作成
            const result = await originalNoteRepository.findOne(replyId);
            if (!result) throw Error('replyが見つからない')
            if (result.replyId) {  // 親の親みたいなことがあるので、再帰的に確認して上から順に作る
                await checkReply(result.replyId)
            }
            if (result.renoteId) await checkRenoteId(result.renoteId)
            await save(result)  // parentを作成する
        }
    }
    async function checkRenoteId(renoteId: string) {
        const checkExistsReply = await noteRepository.findOne(renoteId);
        if (!checkExistsReply) {  // 無いなら作成
            const result = await originalNoteRepository.findOne(renoteId);
            if (!result) throw Error('renoteが見つからない')
            if (result.renoteId) {  // 親の親みたいなことがあるので、再帰的に確認して上から順に作る
                await checkRenoteId(result.renoteId)
            }
            if (result.replyId) await checkReply(result.replyId)
            await save(result)  // parentを作成する
        }
    }

    while (true) {
        const notes = await pagination.next();
        for (const note of notes) {
            const checkExists = await noteRepository.findOne(note.id)  // 既にノートが移行済みか確認
            if (checkExists) continue  // 移行済みならスキップする

            if (note.replyId) await checkReply(note.replyId) // リプライが既に登録されてるか確認し、無いなら再帰的に作成する
            if (note.renoteId) await checkRenoteId(note.renoteId)  // renoteが既に登録されてるか確認し、無いなら再帰的に作成する

            await save(note)
        }
        if (notes.length < 100) break;  // 100以下になったら止める
    }
}