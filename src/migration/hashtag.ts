import { Connection, getConnection } from "typeorm";
import { createPagination } from "./common";
import { Hashtag as v13Hashtag } from "@/v13/models"
import { migrateUser } from "./user";
import { Hashtag } from "@/models/entities/hashtag";
import { hashtagQueue } from "./jobqueue";

export async function migrateHashtag(hashtagId: string) {
    const originalDb = getConnection()
    const nextDb = getConnection('nextDb')
    const hashtagRepository = nextDb.getRepository(v13Hashtag);
    const originalHashtagRepository = originalDb.getRepository(Hashtag);

    const checkExists = await hashtagRepository.findOne({where: {id: hashtagId}});
    if (checkExists) {
        // 存在する場合はスキップ
        console.log(`ハッシュタグ: ${checkExists.name}は移行済みです`);
    }
    const hashtag = await originalHashtagRepository.findOne({where: {id: hashtagId}})
    if (!hashtag) throw Error('ハッシュタグが見つかりません');
    const userIds = [
        ...hashtag.mentionedLocalUserIds,
        ...hashtag.attachedLocalUserIds,
    ];

    for (const userId of userIds) {
            // 先にユーザーを作成する
            await migrateUser(originalDb, nextDb, userId)
        };
    await hashtagRepository.save({
        id: hashtag.id,
        name: hashtag.name,
        mentionedUserIds: hashtag.mentionedUserIds,
        mentionedUsersCount: hashtag.mentionedUsersCount,
        mentionedLocalUserIds: hashtag.mentionedLocalUserIds,
        mentionedLocalUsersCount: hashtag.mentionedLocalUsersCount,
        mentionedRemoteUserIds: hashtag.mentionedRemoteUserIds,
        mentionedRemoteUsersCount: hashtag.mentionedRemoteUsersCount,
        attachedUserIds: hashtag.attachedUserIds,
        attachedUsersCount: hashtag.attachedUsersCount,
        attachedLocalUserIds: hashtag.attachedLocalUserIds,
        attachedLocalUsersCount: hashtag.attachedLocalUsersCount,
        attachedRemoteUserIds: hashtag.attachedRemoteUserIds,
        attachedRemoteUsersCount: hashtag.attachedRemoteUsersCount,
    });
    console.log(`ハッシュタグ: ${hashtag.name}の移行が完了しました`);
}

export async function migrateHashtags(originalDb: Connection, nextDb: Connection) {
    const pagination = createPagination(originalDb, Hashtag);
    const hashtagRepository = nextDb.getRepository(v13Hashtag);

    while (true) {
        const hashtags = await pagination.next();
        for (const hashtag of hashtags) {
            const checkExists = await hashtagRepository.findOne({where: {id: hashtag.id}});
            if (checkExists) continue
            hashtagQueue.add({hashtagId: hashtag.id})
        }
        if (hashtags.length < 100) break; // 100以下になったら止める
    }
}
