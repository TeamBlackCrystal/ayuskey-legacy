import { Poll as v13Poll } from "@/v13/models/entities/Poll";
import { getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { Poll } from "@/models/entities/poll";
import { createUser } from "./user";
import { migrateNote } from "./note";

export async function migratePoll(
	options: {pollId?: string, poll?: Poll}
) {
    const originalDb = getConnection();
    const nextDb = getConnection("nextDb");
    const pollRepository = nextDb.getRepository(v13Poll);
    const originalPollRepository = originalDb.getRepository(Poll);

    let poll: Poll;

    if (options.poll) {
        poll = options.poll;
    } else {
        const result = await originalPollRepository.findOne({where: {id: options.pollId}});
        if (!result) throw Error(`Poll: ${options.pollId} が見つかりません`);
        poll = result;
    }

    const checkExists = await pollRepository.findOne({where: {noteId: poll.noteId}});
	if (checkExists) {
        logger.info(`Poll: ${options.pollId} は移行済みです`)
        return
    };

    await createUser({userId: poll.userId});
    await migrateNote(poll.noteId);

    await pollRepository.save({
        noteId: poll.noteId,
        expiresAt: poll.expiresAt,
        multiple: poll.multiple,
        choice: poll.choices,
        votes: poll.votes,
        noteVisibility: poll.noteVisibility,
        userId: poll.userId,
        userHost: poll.userHost
    });
}

export async function migratePolls() {
    const originalDb = getConnection();
    const pagination = createPagination(originalDb, Poll);

    while (true) {
        const polls = await pagination.next();
        for (const poll of polls) {
            await migratePoll({poll});
        };

        if (polls.length === 0) break; // 100以下になったら止める
    };
}