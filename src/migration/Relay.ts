import { Connection } from "typeorm";
import { Relay } from "@/models/entities/relay";
import { Relay as v13Relay } from "@/v13/models";
import { createPagination, logger } from "./common";

export async function migrateRelay(
	originalDb: Connection,
	nextDb: Connection,
	relayId: string
) {
	const relayRepository = nextDb.getRepository(v13Relay);
	const originalRelayRepository = originalDb.getRepository(Relay);

	const checkExists = await relayRepository.findOne({
		where: { id: relayId },
	});
	if (checkExists) return;
	const relay = await originalRelayRepository.findOne({
		where: { id: relayId },
	});
	if (!relay) throw new Error(`relay: ${relayId} が見つかりません`);

    await relayRepository.save({
		id: relay.id,
        inbox: relay.inbox,
        status: relay.status
	});
	logger.succ(`relay: ${relayId} の移行が完了しました`);
}

export async function migrateRelaies(
	originalDb: Connection,
	nextDb: Connection,
) {
	const pagination = createPagination(originalDb, Relay);

	while (true) {
		const relays = await pagination.next();
		for (const relay of relays) {
			await migrateRelay(originalDb, nextDb, relay.id);
		}
		if (relays.length === 0) break; // 100以下になったら止める
	}
}
