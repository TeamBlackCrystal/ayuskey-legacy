import { Connection } from "typeorm";
import { Page } from "@/models/entities/page";
import { Page as v13Page } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";
import { migrateDriveFile } from "./drive";

export async function migratePage(
	originalDb: Connection,
	nextDb: Connection,
	pageId: string
) {
	const pageRepository = nextDb.getRepository(v13Page);
	const originalPageRepository = originalDb.getRepository(Page);

	const checkExists = await pageRepository.findOne({
		where: { id: pageId },
	});
	if (checkExists) return;
	const page = await originalPageRepository.findOne({
		where: { id: pageId },
	});

	if (!page)
		throw new Error(`Page: ${pageId} が見つかりません`);

    const userIds = [page.userId, ...page.visibleUserIds]
    for (const userId of userIds) {
        await createUser({userId: userId});
    }

    if (page.eyeCatchingImageId) await migrateDriveFile(page.eyeCatchingImageId);

	await pageRepository.save({
		id: page.id,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        title: page.title,
        name: page.name,
        summary: page.summary,
        alignCenter: page.alignCenter,
        hideTitleWhenPinned: page.hideTitleWhenPinned,
        font: page.font,
        userId: page.userId,
        eyeCatchingImageId: page.eyeCatchingImageId,
        content: page.content,
        variables: page.variables,
        // script: ない
        visibility: page.visibility,
        visibleUserIds: page.visibleUserIds,
        likedCount: page.likedCount

	});
	logger.succ(`Page: ${page.id} の移行が完了しました`);

}

export async function migratePages(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, Page, {where: {userId}})

	while (true) {
		const pages = await pagination.next();
		for (const page of pages) {
			await migratePage(originalDb, nextDb, page.id);
		}
		if (pages.length === 0) break; // 100以下になったら止める
	}
}
