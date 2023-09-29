import { logger } from "./common";
import { userQueue } from "./jobqueue";

async function main() {
	await userQueue.clean(0, 'completed')
    logger.succ(`UserQueueのcompletedを削除しました`);
}

main().catch((e) => {
    console.warn(e);
    process.exit(1);
});