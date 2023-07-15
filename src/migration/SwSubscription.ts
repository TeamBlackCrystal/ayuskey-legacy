import { SwSubscription } from "@/models/entities/sw-subscription";
import { SwSubscription as V13SwSubscription } from "@/v13/models";
import { getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { createUser } from "./user";

export async function migrateSwSubscription(options: {
	swSubscriptionId?: string;
	swSubscription?: SwSubscription;
}) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const originalPollVoteRepository = originalDb.getRepository(SwSubscription);
	const swSubscriptionRepository = nextDb.getRepository(V13SwSubscription);

	let swSubscription: SwSubscription;

	if (options.swSubscription) {
		swSubscription = options.swSubscription;
	} else {
		const result = await originalPollVoteRepository.findOne({
			where: { id: options.swSubscriptionId },
		});
		if (!result)
			throw Error(`SwSubscription: ${options.swSubscriptionId} が見つかりません`);
		swSubscription = result;
	}

	const checkExists = await swSubscriptionRepository.findOne({
		where: { id: swSubscription.id },
	});
	if (checkExists) {
		logger.info(`SwSubscription: ${swSubscription.id} は移行済みです`);
		return;
	}

	await createUser({ userId: swSubscription.userId });

	await swSubscriptionRepository.save({
		id: swSubscription.id,
		createdAt: swSubscription.createdAt,
		userId: swSubscription.userId,
		endpoint: swSubscription.endpoint,
		auth: swSubscription.auth,
		publickey: swSubscription.publickey,
	});
	logger.succ(`SwSubscription: ${swSubscription.id} の移行が完了しました`);
}

export async function migrateSwSubscriptions() {
	const originalDb = getConnection();
	const pagination = createPagination(originalDb, SwSubscription);

	while (true) {
		const SwSubscriptions = await pagination.next();
		for (const swSubscription of SwSubscriptions) {
			await migrateSwSubscription({ swSubscription });
		}

		if (SwSubscriptions.length === 0) break; // 100以下になったら止める
	}
}
