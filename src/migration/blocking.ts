import { Connection } from "typeorm";
import { Blocking } from "@/models/entities/blocking";
import { Blocking as v13Blocking } from "@/v13/models";
import { migrateUser } from "./user";
import { createPagination } from "./common";

export async function migrateBlocking(
	originalDb: Connection,
	nextDb: Connection,
	blockingId: string
) {
	const blockingRepository = nextDb.getRepository(v13Blocking);
	const originalBlockingRepository = originalDb.getRepository(Blocking);

	const checkExists = await blockingRepository.findOne({
		where: { id: blockingId },
	});
	if (checkExists) return;
	const blocking = await originalBlockingRepository.findOne({
		where: { id: blockingId },
	});
	if (!blocking) throw new Error(`blocking: ${blockingId} が見つかりません`);
	await migrateUser(originalDb, nextDb, blocking.blockeeId);
	await blockingRepository.save({
		id: blocking.id,
		blockeeId: blocking.blockeeId,
		blockerId: blocking.blockerId,
		createdAt: blocking.createdAt,
	});
    console.log(`blocking: ${blockingId} の移行が完了しました`);
}

export async function migrateBlockings(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Blocking, {
		where: { blockerId: userId },
	});

	while (true) {
		const blockings = await pagination.next();
		for (const blocking of blockings) {
			await migrateBlocking(originalDb, nextDb, blocking.id);
		}
		if (blockings.length < 100) break; // 100以下になったら止める
	}
}
