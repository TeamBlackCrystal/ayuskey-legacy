import { UserProfile } from "@/models/entities/user-profile";
import { UserProfile as v13UserProfile } from "@/v13/models";
import { Connection } from "typeorm";
import { logger } from "./common";
import { migratePage } from "./Page";
import { precisionTruncate } from "@/misc/truncate";

export async function migrateUserProfile(
	originalDb: Connection,
	nextDb: Connection,
	userId: string
) {
	const userProfileRepository = nextDb.getRepository(v13UserProfile);
	const originalUserProfileRepository = originalDb.getRepository(UserProfile);

	const checkExists = await userProfileRepository.findOne({where: {userId}});
	const userProfile = await originalUserProfileRepository.findOne({where: {userId}});
	if (!userProfile) throw Error(`UserProfile: ユーザーID ${userId} のプロフィールが見つかりません`);
    
    if (checkExists) {
        logger.info(`UserProfile: ユーザーID ${userId} は移行済みです`)
        return
    }
    if (userProfile.pinnedPageId) await migratePage(originalDb, nextDb, userProfile.pinnedPageId);
    await userProfileRepository.save({
        userId: userProfile.userId,
        location: userProfile.location,
        birthday: userProfile.birthday,
        description: userProfile.description ? precisionTruncate(userProfile.description, 2048) : null,
        fields: userProfile.fields,
        // lang ない
        url: userProfile.url,
        email: userProfile.email,
        emailVerifyCode: userProfile.emailVerifyCode,
        emailVerified: userProfile.emailVerified,
        // emailNotificationTypes ない
        // publicReactions: ない
        // ffVisibility: ない
        twoFactorTempSecret: userProfile.twoFactorTempSecret,
        twoFactorSecret: userProfile.twoFactorSecret,
        twoFactorEnabled: userProfile.twoFactorEnabled,
        securityKeysAvailable: userProfile.securityKeysAvailable,
        usePasswordLessLogin: userProfile.usePasswordLessLogin,
        password: userProfile.password,
        // moderationNote: ない
        clientData: userProfile.clientData,
        room: userProfile.room,
        autoAcceptFollowed: userProfile.autoAcceptFollowed,
        noCrawle: userProfile.noCrawle,
        // preventAiLearning:  ない
        alwaysMarkNsfw: userProfile.alwaysMarkNsfw,
        // autoSensitive: ない
        carefulBot: userProfile.carefulBot,
        // injectFeaturedNote: ない
        // receiveAnnouncementEmail: ない
        pinnedPageId: userProfile.pinnedPageId,
        // enableWordMute: ない
        // mutedWords: ない
        // mutedInstances: ない
        mutingNotificationTypes: userProfile.mutingNotificationTypes,
        // loggedInDates: ない
        userHost: userProfile.userHost

    });

	// await migrateNotes(originalDb, nextDb, resultUserProfile.id);
	logger.succ(`UserProfile: ユーザーID ${userId} のプロフィールの移行が完了しました`);
}
