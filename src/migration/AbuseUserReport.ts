import { Connection } from "typeorm";
import { AbuseUserReport } from "@/models/entities/abuse-user-report";
import { AbuseUserReport as v13AbuseUserReport } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateAbuseUserReport(
	originalDb: Connection,
	nextDb: Connection,
	abuseUserReportId: string
) {
	const abuseUserReportRepository = nextDb.getRepository(v13AbuseUserReport);
	const originalAbuseUserReportRepository = originalDb.getRepository(AbuseUserReport);

	const checkExists = await abuseUserReportRepository.findOne({
		where: { id: abuseUserReportId },
	});
	if (checkExists) return;
	const abuseUserReport = await originalAbuseUserReportRepository.findOne({
		where: { id: abuseUserReportId },
	});
	if (!abuseUserReport) throw new Error(`AbuseUserReport: ${abuseUserReportId} が見つかりません`);
	if (abuseUserReport.userId) await createUser({userId: abuseUserReport.userId});

	await createUser({userId: abuseUserReport.userId})
	await createUser({userId: abuseUserReport.reporterId})

	await abuseUserReportRepository.save({
		id: abuseUserReport.id,
		createdAt: abuseUserReport.createdAt,
		targetUserId: abuseUserReport.userId,
		reporterId: abuseUserReport.reporterId,
		comment: abuseUserReport.comment,
	});
	logger.succ(`AbuseUserReport: ${abuseUserReportId} の移行が完了しました`);
}

export async function migrateAbuseUserReports(  // TODO: 使う
	originalDb: Connection,
	nextDb: Connection,
) {
	const pagination = createPagination(originalDb, AbuseUserReport);

	while (true) {
		const abuseUserReports = await pagination.next();
		for (const abuseUserReport of abuseUserReports) {
			await migrateAbuseUserReport(originalDb, nextDb, abuseUserReport.id);
		}
		if (abuseUserReports.length === 0) break; // 100以下になったら止める
	}
}
