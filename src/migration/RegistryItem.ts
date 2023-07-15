import { Connection } from "typeorm";
import { RegistryItem } from "@/models/entities/registry-item";
import { RegistryItem as v13RegistryItem } from "@/v13/models";
import { createUser } from "./user";
import { createPagination, logger } from "./common";

export async function migrateRegistryItem(
	originalDb: Connection,
	nextDb: Connection,
	registryItemId: string
) {
	const registryItemRepository = nextDb.getRepository(v13RegistryItem);
	const originalRegistryItemRepository = originalDb.getRepository(RegistryItem);

	const checkExists = await registryItemRepository.findOne({
		where: { id: registryItemId },
	});
	if (checkExists) return;
	const registryItem = await originalRegistryItemRepository.findOne({
		where: { id: registryItemId },
	});
	if (!registryItem) throw new Error(`registryItem: ${registryItemId} が見つかりません`);
	if (registryItem.userId) await createUser({userId: registryItem.userId});
	await registryItemRepository.save({
		id: registryItem.id,
		createdAt: registryItem.createdAt,
		updatedAt: registryItem.updatedAt,
		userId: registryItem.userId,
		key: registryItem.key,
		value: registryItem.value,
		scope: registryItem.scope,
		domain: registryItem.domain,
	});
	logger.succ(`registryItem: ${registryItemId} の移行が完了しました`);
}

export async function migrateRegistryItems(
	originalDb: Connection,
	nextDb: Connection,
) {
	const pagination = createPagination(originalDb, RegistryItem);

	while (true) {
		const registryItems = await pagination.next();
		for (const registryItem of registryItems) {
			await migrateRegistryItem(originalDb, nextDb, registryItem.id);
		}
		if (registryItems.length === 0) break; // 100以下になったら止める
	}
}
