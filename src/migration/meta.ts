import { Meta } from "@/models/entities/meta";
import { Meta as v13Meta } from "@/v13/models";
import { Connection } from "typeorm";
import { migrateUser } from "./user";

export async function migrateMeta(originalDb: Connection, nextDb: Connection) {
    const metaRepository = nextDb.getRepository(v13Meta);
    const originalMetaRepository = originalDb.getRepository(Meta);

    const meta = await metaRepository.findOne()
    const originalMeta = await originalMetaRepository.findOne()
    
    if (!meta) throw Error('metaが見つからないよー')
    if (!originalMeta) throw Error('移行元が壊れてるかも〜')

    if (meta.preservedUsernames) return;

    if (meta.proxyAccountId) await migrateUser(originalDb, nextDb, meta.proxyAccountId)

    await metaRepository.save({
        id: originalMeta.id,
        name: originalMeta.name,
        description: originalMeta.description,
        maintainerName: originalMeta.maintainerName,
        maintainerEmail: originalMeta.maintainerEmail,
        disableRegistration: originalMeta.disableRegistration,
        langs: originalMeta.langs,
        pinnedUsers: originalMeta.pinnedUsers,
        hiddenTags: originalMeta.hiddenTags,
        blockedHosts: originalMeta.blockedHosts,
        // sensitiveWordsはない
        // themeColorはない
        mascotImageUrl: originalMeta.mascotImageUrl,
        bannerUrl: originalMeta.bannerUrl,
        backgroundImageUrl: originalMeta.backgroundImageUrl,
        logoImageUrl: originalMeta.logoImageUrl,
        errorImageUrl: originalMeta.errorImageUrl,
        iconUrl: originalMeta.iconUrl,
        cacheRemoteFiles: originalMeta.cacheRemoteFiles,
        proxyAccountId: originalMeta.proxyAccount,
        // proxyAccountは要らない
        // emailRequiredForSignupはない
        // enableHcaptchaはない
        // hcaptchaSiteKeyはない
        // hcaptchaSecretKeyはない
        enableRecaptcha: originalMeta.enableRecaptcha,
        recaptchaSiteKey: originalMeta.recaptchaSiteKey,
        recaptchaSecretKey: originalMeta.recaptchaSecretKey,
        // skip enableTurnstile
        // skip turnstileSiteKey
        // skip turnstileSecretKey
        // sensitiveMediaDetectionはない
        // sensitiveMediaDetectionSensitivityはない
        // setSensitiveFlagAutomaticallyはない
        // enableSensitiveMediaDetectionForVideosはない
        summalyProxy: originalMeta.summalyProxy,
        enableEmail: originalMeta.enableEmail,
        email: originalMeta.email,
        smtpSecure: originalMeta.smtpSecure,
        smtpHost: originalMeta.smtpHost,
        smtpPort: originalMeta.smtpPort,
        smtpUser: originalMeta.smtpUser,
        smtpPass: originalMeta.smtpPass,
        enableServiceWorker: originalMeta.enableServiceWorker,
        swPublicKey: originalMeta.swPublicKey,
        swPrivateKey: originalMeta.swPrivateKey,
        // deeplAuthKeyはない
        // deeplIsProはない
        termsOfServiceUrl: originalMeta.ToSUrl,
        repositoryUrl: originalMeta.repositoryUrl,
        feedbackUrl: originalMeta.feedbackUrl,
        // defaultLightThemeはない
        // defaultDarkThemeはない
        useObjectStorage: originalMeta.useObjectStorage,
        objectStorageBucket: originalMeta.objectStorageBucket,
        objectStoragePrefix: originalMeta.objectStoragePrefix,
        objectStorageBaseUrl: originalMeta.objectStorageBaseUrl,
        objectStorageEndpoint: originalMeta.objectStorageEndpoint,
        objectStorageRegion: originalMeta.objectStorageRegion,
        objectStorageAccessKey: originalMeta.objectStorageAccessKey,
        objectStorageSecretKey: originalMeta.objectStorageSecretKey,
        objectStoragePort: originalMeta.objectStoragePort,
        objectStorageUseSSL: originalMeta.objectStorageUseSSL,
        objectStorageUseProxy: originalMeta.objectStorageUseProxy,
        objectStorageSetPublicRead: originalMeta.objectStorageSetPublicRead,
        objectStorageS3ForcePathStyle: originalMeta.objectStorageS3ForcePathStyle,
        // enableIpLoggingはない
        // enableActiveEmailValidationはない
        // enableChartsForRemoteUserはない
        // enableChartsForFederatedInstancesはない
        // policiesはない
        // serverRulesはない
        // preservedUsernamesはない
    })
}