import { Connection, getConnection } from "typeorm";
import { Instance } from "@/models/entities/instance";
import { Instance as v13Instance } from "@/v13/models";
import { createPagination, logger } from "./common";
import { instanceQueue } from "./jobqueue";

export async function migrateInstance(instanceId: string) {
	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const instanceRepository = nextDb.getRepository(v13Instance);
	const originalInstanceRepository = originalDb.getRepository(Instance);

	const checkExists = await instanceRepository.findOne({
		where: { id: instanceId },
	});

	if (checkExists) {
		logger.info(`Instance: ${instanceId} は移行済みです`)
	};
	const instance = await originalInstanceRepository.findOne({
		where: { id: instanceId },
	});

	if (!instance) throw new Error(`Instance: ${instanceId}`);
	await instanceRepository.save({
		id: instance.id,
		host: instance.host,
		usersCount: instance.usersCount,
		notesCount: instance.notesCount,
		followingCount: instance.followingCount,
		followersCount: instance.followersCount,
		latestRequestReceivedAt: instance.latestRequestReceivedAt,
		isNotResponding: instance.isNotResponding,
		isSuspended: instance.isSuspended,
		softwareName: instance.softwareName,
		softwareVersion: instance.softwareVersion,
		openRegistrations: instance.openRegistrations,
		name: instance.name,
		description: instance.description,
		maintainerName: instance.maintainerName,
		maintainerEmail: instance.maintainerEmail,
		iconUrl: instance.iconUrl,
		faviconUrl: instance.faviconUrl,
		themeColor: instance.themeColor,
		infoUpdatedAt: instance.infoUpdatedAt,
		firstRetrievedAt: new Date(), // 現行のAyuskeyに存在しない為実行した日時を入れる
	});
	logger.succ(`Instance: ${instanceId} の移行が完了しました`);
}

export async function migrateInstances(
	originalDb: Connection,
	nextDb: Connection
) {
	const pagination = await createPagination(originalDb, Instance);
	const instanceRepository = nextDb.getRepository(v13Instance);

	while (true) {
		const instances = await pagination.next();
		for (const instance of instances) {
			const checkExists = await instanceRepository.findOne({where: {id: instance.id}})
			if (checkExists) {
				logger.info(`Instance: ${instance.id} は移行済みです`)
				continue
			}

			instanceQueue.add({instanceId: instance.id});
		}
		if (instances.length === 0) break; // 100以下になったら止める
	}
}
