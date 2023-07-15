import { PollVote } from "@/models/entities/poll-vote";
import { PollVote as V13PollVote } from "@/v13/models";
import { getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { createUser } from "./user";
import { migrateNote } from "./note";

export async function migratePollVote (options: {pollVoteId?: string,  pollVote?: PollVote}) {
    const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
    const originalPollVoteRepository = originalDb.getRepository(PollVote);
    const pollVoteRepository = nextDb.getRepository(V13PollVote);

    let pollVote: PollVote;

    if (options.pollVote) {
        pollVote = options.pollVote;
    } else {
        const result = await originalPollVoteRepository.findOne({where: {id: options.pollVoteId}});
        if (!result) throw Error(`PollVote: ${options.pollVoteId} が見つかりません`);
        pollVote = result;
    }

    const checkExists = await pollVoteRepository.findOne({where: {id: pollVote.id}});
	if (checkExists) {
        logger.info(`PollVote: ${pollVote.id} は移行済みです`)
        return
    };

    await migrateNote(pollVote.noteId);
    await createUser({userId: pollVote.userId});

    await pollVoteRepository.save({
        id: pollVote.id,
        createdAt: pollVote.createdAt,
        userId: pollVote.userId,
        noteId: pollVote.noteId,
        choice: pollVote.choice,
    })
	logger.succ(`PollVote: ${pollVote.id} の移行が完了しました`);


}

export async function migratePollVotes (pollId: string) {
    const originalDb = getConnection();
    const pagination = createPagination(originalDb, PollVote, {where: {noteId: pollId}});

    while (true) {
        const pollVotes = await pagination.next();
        for (const pollVote of pollVotes) {
            await migratePollVote({pollVote});
        }

        if (pollVotes.length === 0) break; // 100以下になったら止める
    }
}