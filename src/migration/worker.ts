import { logger } from "./common";
import {
	driveFileQueue,
	hashtagQueue,
	instanceQueue,
	noteQueue,
	usedUsernameQueue,
	userAfterHookQueue,
	userQueue,
} from "./jobqueue";
import driveFileProcessor from "./processor/driveFile.processor";
import hashtagProcessor from "./processor/hashtag.processor";
import instanceProcessor from "./processor/instance.processor";
import noteProcessor from "./processor/note.processor";
import usedUsernameProcessor from "./processor/usedUsername.processor";
import userProcessor from "./processor/user.processor";
import userAfterHookProcessor from "./processor/userAfterHook.processor";

instanceQueue.process(instanceProcessor);
hashtagQueue.process(hashtagProcessor);
noteQueue.process(noteProcessor);
usedUsernameQueue.process(usedUsernameProcessor);
driveFileQueue.process(driveFileProcessor);
userQueue.process(userProcessor);
userAfterHookQueue.process(userAfterHookProcessor);

instanceQueue.on('completed', (job) => {
    logger.succ(`Instance: ${job.data.id} の処理が完了しました`);
})

noteQueue.on('completed', (job) => {
    logger.succ(`Note: ${job.data.id} の処理が完了しました`);
})

hashtagQueue.on('completed', (job) => {
    logger.succ(`Hashtag: ${job.data.id} の処理が完了しました`);
})

userQueue.on('completed', (job) => {
    logger.succ(`User: ${job.data.id} の処理が完了しました`);
})

usedUsernameQueue.on('completed', (job) => {
    logger.succ(`UsedUsername: ${job.data.id} の処理が完了しました`);
})

userAfterHookQueue.on('completed', (job) => {
    logger.succ(`UserAfterHook: ${job.data.id} の処理が完了しました`);
})
