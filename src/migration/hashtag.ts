import { Connection, getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { Hashtag as v13Hashtag } from "@/v13/models"
import { createUser } from "./user";
import { Hashtag } from "@/models/entities/hashtag";
import { hashtagQueue } from "./jobqueue";

export async function migrateHashtag(hashtagId: string, useHashtag?: Hashtag) {
    const originalDb = getConnection()
    const nextDb = getConnection('nextDb')
    const hashtagRepository = nextDb.getRepository(v13Hashtag);
    const originalHashtagRepository = originalDb.getRepository(Hashtag);

    const checkExists = await hashtagRepository.findOne({where: {id: hashtagId}});
    if (checkExists) {
        // 存在する場合はスキップ
        logger.info(`hashtag: ${hashtagId} は移行済みです`);
        return
    }
    let hashtag: Hashtag
    if (useHashtag) {
        hashtag = useHashtag
    } {
        const result = await originalHashtagRepository.findOne({where: {id: hashtagId}})
        if (!result) throw Error(`hashtag: ${hashtagId} が見つかりません`);
        hashtag = result

    }
    const userIds = [
        ...hashtag.mentionedLocalUserIds,
    ];

    for (const userId of userIds) {
            // 先にユーザーを作成する
            await createUser({userId: userId})
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
    logger.succ(`hashtag: ${hashtagId} の移行が完了しました`);
}

export async function migrateHashtags(originalDb: Connection, nextDb: Connection) {
    const pagination = createPagination(originalDb, Hashtag);
    const hashtagRepository = nextDb.getRepository(v13Hashtag);
    let count = 0
    while (true) {
        const hashtags = await pagination.next();
        for (const hashtag of hashtags) {
            count++
            const checkExists = await hashtagRepository.findOne({where: {id: hashtag.id}});
            if (checkExists) {
                logger.info(`Hashtag: ${hashtag.id} は移行済みです ${count}`)
                continue
            }
            hashtagQueue.add({hashtagId: hashtag.id, useHashtag: hashtag})
        }
		if (hashtags.length === 0) break; // 100以下になったら止める
    }
}
