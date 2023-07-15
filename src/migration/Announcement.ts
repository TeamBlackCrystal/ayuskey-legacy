import { Announcement } from "@/models/entities/announcement";
import { Announcement as V13Announcement } from "@/v13/models";
import { getConnection } from "typeorm";
import { createPagination, logger } from "./common";
import { createUser } from "./user";
import { migrateUserList } from "./UserList";

export async function migrateAnnouncement(options: {
	announcementId?: string;
	announcement?: Announcement;
}) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const originalPollVoteRepository = originalDb.getRepository(Announcement);
	const announcementRepository = nextDb.getRepository(V13Announcement);

	let announcement: Announcement;

	if (options.announcement) {
		announcement = options.announcement;
	} else {
		const result = await originalPollVoteRepository.findOne({
			where: { id: options.announcementId },
		});
		if (!result)
			throw Error(`Announcement: ${options.announcementId} が見つかりません`);
		announcement = result;
	}

	const checkExists = await announcementRepository.findOne({
		where: { id: announcement.id },
	});
	if (checkExists) {
		logger.info(`Announcement: ${announcement.id} は移行済みです`);
		return;
	}

	await announcementRepository.save({
		id: announcement.id,
		createdAt: announcement.createdAt,
        updatedAt: announcement.updatedAt,
        text: announcement.text,
        title: announcement.title,
        imageUrl: announcement.imageUrl,

	});
	logger.succ(`Announcement: ${announcement.id} の移行が完了しました`);
}

export async function migrateAnnouncements() {
	const originalDb = getConnection();
	const pagination = createPagination(originalDb, Announcement);

	while (true) {
		const Announcements = await pagination.next();
		for (const announcement of Announcements) {
			await migrateAnnouncement({ announcement });
		}

		if (Announcements.length === 0) break; // 100以下になったら止める
	}
}
