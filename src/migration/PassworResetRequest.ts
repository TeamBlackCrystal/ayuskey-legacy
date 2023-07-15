import { Connection } from "typeorm";
import { PasswordResetRequest } from "@/models/entities/password-reset-request";
import { PasswordResetRequest as v13PasswordResetRequest } from "@/v13/models";
import { createPagination, logger } from "./common";

export async function migratePasswordResetRequest(
	originalDb: Connection,
	nextDb: Connection,
	passwordResetRequestId: string
) {
	const passwordResetRequestRepository = nextDb.getRepository(v13PasswordResetRequest);
	const originalPasswordResetRequestRepository = originalDb.getRepository(PasswordResetRequest);

	const checkExists = await passwordResetRequestRepository.findOne({
		where: { id: passwordResetRequestId },
	});
	if (checkExists) return;
	const passwordResetRequest = await originalPasswordResetRequestRepository.findOne({
		where: { id: passwordResetRequestId },
	});
	if (!passwordResetRequest) throw new Error(`passwordResetRequest: ${passwordResetRequestId} が見つかりません`);

    await passwordResetRequestRepository.save({
		id: passwordResetRequest.id,
		createdAt: passwordResetRequest.createdAt,
		token: passwordResetRequest.token,
		userId: passwordResetRequest.userId
	});
	logger.succ(`passwordResetRequest: ${passwordResetRequestId} の移行が完了しました`);
}

export async function migratePasswordResetRequests(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, PasswordResetRequest, {where: {userId}});

	while (true) {
		const passwordResetRequests = await pagination.next();
		for (const passwordResetRequest of passwordResetRequests) {
			await migratePasswordResetRequest(originalDb, nextDb, passwordResetRequest.id);
		}
		if (passwordResetRequests.length === 0) break; // 100以下になったら止める
	}
}
