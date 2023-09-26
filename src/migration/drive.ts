import { DriveFolder } from "@/models/entities/drive-folder";
import { DriveFile } from "@/models/entities/drive-file";
import { createPagination, logger } from "./common";
import { Connection, getConnection } from "typeorm";
import {
	DriveFolder as v13DriveFolder,
	DriveFile as v13DriveFile,
} from "@/v13/models";
import { driveFileQueue } from "./jobqueue";
import { createUser } from "./user";
import { LRUCache } from "lru-cache";

const driveFileCache = new LRUCache<string, v13DriveFile>({
	max: 1000,
});

export async function migrateDriveFile(
	driveFileId: string,
	useFile?: DriveFile
) {
	const cacheKey = `migrateDriveFile${driveFileId}`;
	const cacheResult = driveFileCache.get(cacheKey);
	if (cacheResult) return cacheResult;

	const originalDb = getConnection();
	const nextDb = getConnection("nextDb");
	const driveFileRepository = nextDb.getRepository(v13DriveFile);
	const originalDriveFileRepository = originalDb.getRepository(DriveFile);

	const checkExists = await driveFileRepository.findOne({
		where: { id: driveFileId },
	});
	if (checkExists) {
		logger.info(`DriveFile: ${driveFileId} は移行済みです`);
		return;
	}

	let file: DriveFile;
	if (useFile) {
		file = useFile;
	} else {
		const result = await originalDriveFileRepository.findOne({
			where: { id: driveFileId },
		});
		if (!result) throw Error(`DriveFile: ${driveFileId} が見つかりません`);
		file = result;
	}

	if (file.folderId)
		await migrateDriveFolder(originalDb, nextDb, file.folderId);
	if (file.userId) await createUser({ userId: file.userId }); // ユーザーその物しか作成しない。migrateUsersであとでその他の情報は作成される

	const createdDriveFile = await driveFileRepository.save({
		id: file.id,
		createdAt: file.createdAt,
		userId: file.userId,
		userHost: file.user?.host,
		md5: file.md5,
		name: file.name,
		type: file.type,
		size: file.size,
		comment: file.comment,
		blurhash: file.blurhash,
		properties: file.properties,
		storedInternal: file.storedInternal,
		url: file.url,
		thumbnailUrl: file.thumbnailUrl,
		webpublicUrl: file.webpublicUrl,
		accessKey: file.accessKey,
		thumbnailAccessKey: file.thumbnailAccessKey,
		webpublicAccessKey: file.webpublicAccessKey,
		uri: file.url,
		src: file.src,
		folderId: file.folderId,
		isSensitive: file.isSensitive,
		isLink: file.isLink,
	});
	driveFileCache.set(cacheKey, createdDriveFile);
	return createdDriveFile;
}

export async function migrateDriveFiles(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const pagination = createPagination(originalDb, DriveFile, {
		where: { userId },
	});
	const driveFileRepository = nextDb.getRepository(v13DriveFile);
	while (true) {
		const files = await pagination.next();
		for (const file of files) {
			const checkExists = await driveFileRepository.findOne({
				where: { id: file.id },
			});
			if (checkExists) {
				continue;
			}
			driveFileQueue.add({ driveFileId: file.id, useFile: file });
		}
		if (files.length === 0) break; // 100以下になったら止める
	}
}

export async function migrateDriveFolder(
	originalDb: Connection,
	nextDb: Connection,
	folderId: string,
	useFolder?: DriveFolder
) {
	const originalDriveFolderRepository = originalDb.getRepository(DriveFolder);
	const driveFolderRepository = nextDb.getRepository(v13DriveFolder);

	async function save(folder: DriveFolder) {
		if (folder.userId) await createUser({ userId: folder.userId });
		return await driveFolderRepository.save({
			createdAt: folder.createdAt,
			id: folder.id,
			name: folder.name,
			parentId: folder.parentId,
			user: folder.user,
			userId: folder.userId,
		});
	}
	async function checkParent(parentId: string) {
		const checkExistsParent = await driveFolderRepository.findOne(parentId); // 移行先に親フォルダがあるか確認
		if (!checkExistsParent) {
			// 無いなら作成
			const result = await originalDriveFolderRepository.findOne(parentId);
			if (!result) throw Error("parent フォルダーが見つからない");
			if (result.parentId) {
				// 親の親みたいなことがあるので、再帰的に確認して上から順に作る
				await checkParent(result.parentId);
			}
			await save(result); // parentを作成する
		}
	}

	let folder: DriveFolder;

	if (useFolder) {
		folder = useFolder;
	} else {
		const result = await originalDriveFolderRepository.findOne({
			where: { id: folderId },
		});
		if (!result)
			throw new Error(
				`DriveFolder: ${folderId} フォルダが見つかりませんでした`
			);
		folder = result;
	}

	if (folder.parentId) await checkParent(folder.parentId); // 親フォルダを再帰的に検索し、無い場合は追加する
	await save(folder);
}

export async function migrateDriveFolders(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const driveFolderRepository = nextDb.getRepository(v13DriveFolder);
	const pagination = createPagination(originalDb, DriveFolder, {
		where: { userId },
	});

	while (true) {
		const folders = await pagination.next();
		for (const folder of folders) {
			const checkExists = await driveFolderRepository.findOne(folder.id); // 既に移行済みか確認
			if (checkExists) continue; // 移行済みならスキップする
			await migrateDriveFolder(originalDb, nextDb, folder.id, folder);
		}
		if (folders.length === 0) break; // 100以下になったら止める
	}
}
