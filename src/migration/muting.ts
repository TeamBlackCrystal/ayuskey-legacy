import { Connection } from "typeorm";
import { Muting } from "@/models/entities/muting";
import { Muting as v13Muting } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateMuting(
	originalDb: Connection,
	nextDb: Connection,
	mutingId: string
) {
	const mutingRepository = nextDb.getRepository(v13Muting);
	const originalMutingRepository = originalDb.getRepository(Muting);

	const checkExists = await mutingRepository.findOne({
		where: { id: mutingId },
	});
	if (checkExists) return;
	const muting = await originalMutingRepository.findOne({
		where: { id: mutingId },
	});

	if (!muting) throw new Error(`muting: ${mutingId} が見つかりません`);
	await createUser({userId: muting.muteeId}); // ミュート対象のユーザーが作成されてない可能性を考慮する

	await mutingRepository.save({
		id: mutingId,
		createdAt: muting.createdAt,
		muteeId: muting.muteeId,
		muterId: muting.muterId,
	});
	logger.succ(`muting: ${muting.id} の移行が完了しました`);
}

export async function migrateMutings(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Muting, {
		where: { muterId: userId },
	});

	while (true) {
		const mutings = await pagination.next();
		for (const muting of mutings) {
			await migrateMuting(originalDb, nextDb, muting.id);
		}
		if (mutings.length === 0) break; // 100以下になったら止める
	}
}
