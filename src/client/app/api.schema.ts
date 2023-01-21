
export interface Error {error: {code?: string, message?: string, id?: string}}

export interface User {id: string, name?: string, onlineStatus: 'online' | 'active' | 'offline' | 'unknown', username: string, host?: string, avatarUrl?: string, avatarBlurhash?: any, avatarColor?: any, isAdmin: boolean, isModerator: boolean, isVerified: boolean, isBot: boolean, isCat: boolean, isLady: boolean, emojis?: {name: string, host: string, url: string, aliases: string}, url?: string, createdAt: string, updatedAt?: string, bannerUrl?: string, bannerBlurhash?: any, bannerColor?: any, isLocked: boolean, isSuspended: boolean, description?: string, location?: string, birthday?: string, fields: {name: string, value: string}, followersCount: number, followingCount: number, notesCount: number, pinnedNoteIds: string, pinnedNotes: Note[], pinnedPageId?: string, pinnedPage?: Page, twoFactorEnabled: boolean, usePasswordLessLogin: boolean, securityKeys: boolean, avatarId?: string, bannerId?: string, autoWatch: boolean, injectFeaturedNote: boolean, alwaysMarkNsfw: boolean, carefulBot: boolean, autoAcceptFollowed: boolean, hasUnreadSpecifiedNotes: boolean, hasUnreadMentions: boolean, hasUnreadAnnouncement: boolean, hasUnreadAntenna: boolean, hasUnreadChannel: boolean, hasUnreadMessagingMessage: boolean, hasUnreadNotification: boolean, hasPendingReceivedFollowRequest: boolean, mutingNotificationTypes: any, isFollowing: boolean, hasPendingFollowRequestFromYou: boolean, hasPendingFollowRequestToYou: boolean, isFollowed: boolean, isBlocking: boolean, isBlocked: boolean, isMuted: boolean}

export interface Me {id: string, name?: string, onlineStatus: 'online' | 'active' | 'offline' | 'unknown', username: string, host?: string, avatarUrl?: string, avatarBlurhash?: any, avatarColor?: any, isAdmin: boolean, isModerator: boolean, isVerified: boolean, isBot: boolean, isCat: boolean, isLady: boolean, emojis?: {name: string, host: string, url: string, aliases: string}, url?: string, createdAt: string, updatedAt?: string, bannerUrl?: string, bannerBlurhash?: any, bannerColor?: any, isLocked: boolean, isSuspended: boolean, description?: string, location?: string, birthday?: string, fields: {name: string, value: string}, followersCount: number, followingCount: number, notesCount: number, pinnedNoteIds: string, pinnedNotes: Note[], pinnedPageId?: string, pinnedPage?: Page, twoFactorEnabled: boolean, usePasswordLessLogin: boolean, securityKeys: boolean, avatarId?: string, bannerId?: string, autoWatch: boolean, injectFeaturedNote: boolean, alwaysMarkNsfw: boolean, carefulBot: boolean, autoAcceptFollowed: boolean, hasUnreadSpecifiedNotes: boolean, hasUnreadMentions: boolean, hasUnreadAnnouncement: boolean, hasUnreadAntenna: boolean, hasUnreadChannel: boolean, hasUnreadMessagingMessage: boolean, hasUnreadNotification: boolean, hasPendingReceivedFollowRequest: boolean, mutingNotificationTypes: any, isFollowing: boolean, hasPendingFollowRequestFromYou: boolean, hasPendingFollowRequestToYou: boolean, isFollowed: boolean, isBlocking: boolean, isBlocked: boolean, isMuted: boolean, emailVerified?: boolean, pendingReceivedFollowRequestsCount?: boolean, carefulMassive?: boolean, noCrawle?: boolean, isExplorable?: boolean, hideOnlineStatus?: boolean, email?: string}

export interface UserList {id: string, createdAt: string, name: string, userIds: string}

export interface UserGroup {id: string, createdAt: string, name: string, ownerId: string, userIds: string}

export interface App {id: string, name: string, callbackUrl?: string, permission: string, secret: string, isAuthorized: boolean}

export interface MessagingMessage {id: string, createdAt: string, userId: string, user: User, text?: string, fileId?: string, file?: DriveFolder, recipientId?: string, recipient?: User, groupId?: string, group?: UserGroup, isRead: boolean, reads: string}

export interface Note {id: string, createdAt: string, text?: string, cw?: string, userId: string, user: User, replyId?: string, renoteId?: string, reply?: Note, renote?: Note, viaMobile: boolean, isHidden: boolean, visibility: string, mentions: string, visibleUserIds: string, fileIds: string, files: DriveFile[], tags: string, poll?: object, geo?: object, channelId?: string, channel: {id: string, name: string}, localOnly: boolean}

export interface NoteReaction {id: string, createdAt: string, user: User, type: string}

export interface NoteFavorite {id: string, createdAt: string, note: Note, noteId: string}

export interface Notification {id: string, createdAt: string, isRead: boolean, type: 'follow' | 'mention' | 'reply' | 'renote' | 'quote' | 'reaction' | 'pollVote' | 'receiveFollowRequest' | 'followRequestAccepted' | 'groupInvited' | 'app', user?: User, userId?: string, note?: Note, reaction?: string, choice?: number, invitation?: object, body?: string, header?: string, icon?: string}

export interface DriveFile {id: string, createdAt: string, name: string, type: string, md5: string, size: number, isSensitive: boolean, blurhash?: string, properties: {width: number, height: number, avgColor: string}, url?: string, thumbnailUrl?: string, comment?: string, folderId?: string, userId?: string, user?: User}

export interface DriveFolder {id: string, createdAt: string, name: string, foldersCount: number, filesCount: number, parentId?: string, parent?: DriveFolder}

export interface Following {id: string, createdAt: string, followeeId: string, followee: User, followerId: string, follower: User}

export interface Muting {id: string, createdAt: string, muteeId: string, mutee: User}

export interface Blocking {id: string, createdAt: string, blockeeId: string, blockee: User}

export interface Hashtag {tag: string, mentionedUsersCount: number, mentionedLocalUsersCount: number, mentionedRemoteUsersCount: number, attachedUsersCount: number, attachedLocalUsersCount: number, attachedRemoteUsersCount: number}

export interface Page {id: string, createdAt: string, updatedAt: string, title: string, name: string, summary?: string, content: any, variables: any, userId: string, user: User}

export interface Channel {id: string, createdAt: string, lastNotedAt?: string, name: string, description?: string, bannerUrl?: string, notesCount: number, usersCount: number, isFollowing: boolean, userId?: string}

export interface Antenna {id: string, createdAt: string, name: string, keywords: string[], excludeKeywords: string[], src: 'home' | 'all' | 'users' | 'list' | 'group', userListId?: string, userGroupId?: string, users: string, caseSensitive: boolean, notify: boolean, withReplies: boolean, withFile: boolean, hasUnreadNote: boolean}

export interface Clip {id: string, createdAt: string, userId: string, user: User, name: string, description?: string, isPublic: boolean}

export interface Emoji {id: string, aliases: string, name: string, category?: string, host?: string, url: string}

export interface ReversiGame {id: string, createdAt: string, startedAt?: string, isStarted: boolean, isEnded: boolean, form1?: any, form2?: any, user1Accepted: boolean, user2Accepted: boolean, user1Id: string, user2Id: string, user1: User, user2: User, winnerId?: string, winner?: User, surrendered?: string, black?: number, bw: string, isLlotheo: boolean, canPutEverywhere: boolean, loopedBoard: boolean, logs: {at: string, color: boolean, pos: number}, map: string}

export interface ReversiMatching {id: string, createdAt: string, parentId: string, parent?: User, childId: string, child: User}
export type Schema = {resource: {
"/admin/abuse-user-reports": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/admin/accounts/delete": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/announcements/create": {
    POST: {
        body: {
            title: string,
            text: string,
            imageUrl: string
        },
        response: {
            id?: string,
            createdAt?: string,
            updatedAt?: string,
            title?: string,
            text?: string,
            imageUrl?: string
        }
    }
}

"/admin/announcements/delete": {
    POST: {
        body: {
            id: string
        },
        response: any
    }
}

"/admin/announcements/list": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: {
            id: string,
            createdAt: string,
            updatedAt: string,
            text: string,
            title: string,
            imageUrl: string,
            reads: number
        }
    }
}

"/admin/announcements/update": {
    POST: {
        body: {
            id: string,
            title: string,
            text: string,
            imageUrl: string
        },
        response: any
    }
}

"/admin/delete-all-files-of-a-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/delete-logs": {
    POST: {
        response: any
    }
}

"/admin/drive/clean-remote-files": {
    POST: {
        response: any
    }
}

"/admin/drive/cleanup": {
    POST: {
        response: any
    }
}

"/admin/drive/files": {
    POST: {
        body: {
            limit?: number,
            offset?: number,
            sort?: '+createdAt' | '-createdAt' | '+size' | '-size',
            origin?: 'combined' | 'local' | 'remote'
        },
        response: any
    }
}

"/admin/drive/show-file": {
    POST: {
        body: {
            fileId: string
        },
        response: any
    }
}

"/admin/emoji/add": {
    POST: {
        body: {
            name: string,
            url: string,
            category?: string,
            aliases?: string
        },
        response: any
    }
}

"/admin/emoji/copy": {
    POST: {
        body: {
            emojiId: string
        },
        response: any
    }
}

"/admin/emoji/list-remote": {
    POST: {
        body: {
            query?: string,
            host?: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/admin/emoji/list": {
    POST: {
        body: {
            host?: string
        },
        response: any
    }
}

"/admin/emoji/remove": {
    POST: {
        body: {
            id: string
        },
        response: any
    }
}

"/admin/emoji/update": {
    POST: {
        body: {
            id: string,
            name: string,
            category?: string,
            url: string,
            aliases: string
        },
        response: any
    }
}

"/admin/federation/delete-all-files": {
    POST: {
        body: {
            host: string
        },
        response: any
    }
}

"/admin/federation/refresh-remote-instance-metadata": {
    POST: {
        body: {
            host: string
        },
        response: any
    }
}

"/admin/federation/remove-all-following": {
    POST: {
        body: {
            host: string
        },
        response: any
    }
}

"/admin/federation/update-instance": {
    POST: {
        body: {
            host: string,
            isSuspended: boolean
        },
        response: any
    }
}

"/admin/get-table-stats": {
    POST: {
        response: any
    }
}

"/admin/invite": {
    POST: {
        response: any
    }
}

"/admin/logs": {
    POST: {
        body: {
            limit?: number,
            level?: string,
            domain?: string
        },
        response: any
    }
}

"/admin/moderators/add": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/moderators/remove": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/queue/clear": {
    POST: {
        response: any
    }
}

"/admin/queue/deliver-delayed": {
    POST: {
        response: any
    }
}

"/admin/queue/inbox-delayed": {
    POST: {
        response: any
    }
}

"/admin/queue/jobs": {
    POST: {
        body: {
            domain: 'deliver' | 'inbox' | 'db' | 'objectStorage',
            state: 'active' | 'waiting' | 'delayed',
            limit?: number
        },
        response: any
    }
}

"/admin/queue/stats": {
    POST: {
        response: any
    }
}

"/admin/relays/add": {
    POST: {
        body: {
            inbox: string
        },
        response: any
    }
}

"/admin/relays/list": {
    POST: {
        response: any
    }
}

"/admin/relays/remove": {
    POST: {
        body: {
            inbox: string
        },
        response: any
    }
}

"/admin/remove-abuse-user-report": {
    POST: {
        body: {
            reportId: string
        },
        response: any
    }
}

"/admin/reset-password": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/resync-chart": {
    POST: {
        response: any
    }
}

"/admin/send-email": {
    POST: {
        body: {
            to: string,
            subject: string,
            html: string,
            text: string
        },
        response: any
    }
}

"/admin/server-info": {
    POST: {
        response: any
    }
}

"/admin/set-premium": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/show-moderation-logs": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/admin/show-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/show-users": {
    POST: {
        body: {
            limit?: number,
            offset?: number,
            sort?: '+follower' | '-follower' | '+createdAt' | '-createdAt' | '+updatedAt' | '-updatedAt',
            state?: 'all' | 'available' | 'admin' | 'moderator' | 'adminOrModerator' | 'silenced' | 'suspended',
            origin?: 'combined' | 'local' | 'remote',
            username?: string,
            hostname?: string
        },
        response: any
    }
}

"/admin/silence-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/suspend-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/unset-premium": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/unsilence-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/unsuspend-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/unverify-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/update-meta": {
    POST: {
        body: {
            announcements?: {},
            disableRegistration?: boolean,
            disableLocalTimeline?: boolean,
            disableGlobalTimeline?: boolean,
            enableEmojiReaction?: boolean,
            useStarForReactionFallback?: boolean,
            pinnedUsers?: string,
            hiddenTags?: string,
            blockedHosts?: string,
            mascotImageUrl?: string,
            bannerUrl?: string,
            errorImageUrl?: string,
            iconUrl?: string,
            name?: string,
            description?: string,
            maxNoteTextLength?: number,
            localDriveCapacityMb?: number,
            remoteDriveCapacityMb?: number,
            cacheRemoteFiles?: boolean,
            proxyRemoteFiles?: boolean,
            enableRecaptcha?: boolean,
            recaptchaSiteKey?: string,
            recaptchaSecretKey?: string,
            enableTurnstile?: boolean,
            turnstileSiteKey?: string,
            turnstileSecretKey?: string,
            proxyAccount?: string,
            maintainerName?: string,
            maintainerEmail?: string,
            langs?: string,
            summalyProxy?: string,
            enableTwitterIntegration?: boolean,
            twitterConsumerKey?: string,
            twitterConsumerSecret?: string,
            enableGithubIntegration?: boolean,
            githubClientId?: string,
            githubClientSecret?: string,
            enableDiscordIntegration?: boolean,
            discordClientId?: string,
            discordClientSecret?: string,
            enableEmail?: boolean,
            email?: string,
            smtpSecure?: boolean,
            smtpHost?: string,
            smtpPort?: number,
            smtpUser?: string,
            smtpPass?: string,
            enableServiceWorker?: boolean,
            swPublicKey?: string,
            swPrivateKey?: string,
            ToSUrl?: string,
            ToSTextUrl?: string,
            repositoryUrl?: string,
            feedbackUrl?: string,
            useObjectStorage?: boolean,
            objectStorageBaseUrl?: string,
            objectStorageBucket?: string,
            objectStoragePrefix?: string,
            objectStorageEndpoint?: string,
            objectStorageRegion?: string,
            objectStoragePort?: number,
            objectStorageAccessKey?: string,
            objectStorageSecretKey?: string,
            objectStorageUseSSL?: boolean,
            objectStorageUseProxy?: boolean,
            objectStorageSetPublicRead?: boolean,
            objectStorageS3ForcePathStyle?: boolean
        },
        response: any
    }
}

"/admin/update-remote-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/admin/vacuum": {
    POST: {
        body: {
            full: boolean,
            analyze: boolean
        },
        response: any
    }
}

"/admin/verify-user": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/announcements": {
    POST: {
        body: {
            limit?: number,
            withUnreads?: boolean,
            sinceId?: string,
            untilId?: string
        },
        response: {
            id: string,
            createdAt: string,
            updatedAt: string,
            text: string,
            title: string,
            imageUrl: string,
            isRead: boolean
        }
    }
}

"/antennas/create": {
    POST: {
        body: {
            name: string,
            src: 'home' | 'all' | 'users' | 'list' | 'group',
            userListId?: string,
            userGroupId?: string,
            keywords: string[],
            excludeKeywords: string[],
            users: string,
            caseSensitive: boolean,
            withReplies: boolean,
            withFile: boolean,
            notify: boolean
        },
        response: any
    }
}

"/antennas/delete": {
    POST: {
        body: {
            antennaId: string
        },
        response: any
    }
}

"/antennas/list": {
    POST: {
        response: any
    }
}

"/antennas/notes": {
    POST: {
        body: {
            antennaId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/antennas/show": {
    POST: {
        body: {
            antennaId: string
        },
        response: any
    }
}

"/antennas/update": {
    POST: {
        body: {
            antennaId: string,
            name: string,
            src: 'home' | 'all' | 'users' | 'list' | 'group',
            userListId?: string,
            userGroupId?: string,
            keywords: string[],
            excludeKeywords: string[],
            users: string,
            caseSensitive: boolean,
            withReplies: boolean,
            withFile: boolean,
            notify: boolean
        },
        response: any
    }
}

"/ap/get": {
    POST: {
        body: {
            uri: string
        },
        response: object
    }
}

"/ap/show": {
    POST: {
        body: {
            uri: string
        },
        response: any
    }
}

"/app/create": {
    POST: {
        body: {
            name: string,
            description: string,
            permission: string,
            callbackUrl?: string
        },
        response: App
    }
}

"/app/show": {
    POST: {
        body: {
            appId: string
        },
        response: App
    }
}

"/auth/session/generate": {
    POST: {
        body: {
            appSecret: string
        },
        response: {
            token?: string,
            url?: string
        }
    }
}

"/auth/session/show": {
    POST: {
        body: {
            token: string
        },
        response: any
    }
}

"/auth/session/userkey": {
    POST: {
        body: {
            appSecret: string,
            token: string
        },
        response: {
            accessToken?: string,
            user?: User
        }
    }
}

"/blocking/create": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/blocking/delete": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/blocking/list": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: Blocking[]
    }
}

"/channels/create": {
    POST: {
        body: {
            name: string,
            description?: string,
            bannerId?: string
        },
        response: Channel
    }
}

"/channels/featured": {
    POST: {
        response: Channel[]
    }
}

"/channels/follow": {
    POST: {
        body: {
            channelId: string
        },
        response: any
    }
}

"/channels/followed": {
    POST: {
        body: {
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Channel[]
    }
}

"/channels/owned": {
    POST: {
        body: {
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Channel[]
    }
}

"/channels/pin-note": {
    POST: {
        response: any
    }
}

"/channels/show": {
    POST: {
        body: {
            channelId: string
        },
        response: Channel
    }
}

"/channels/timeline": {
    POST: {
        body: {
            channelId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number
        },
        response: Note[]
    }
}

"/channels/unfollow": {
    POST: {
        body: {
            channelId: string
        },
        response: any
    }
}

"/channels/update": {
    POST: {
        body: {
            channelId: string,
            name?: string,
            description?: string,
            bannerId?: string
        },
        response: Channel
    }
}

"/charts/active-users": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number
        },
        response: {
            local?: {
                count: number
            },
            remote?: {
                count: number
            }
        }
    }
}

"/charts/drive": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number
        },
        response: {
            local?: {
                totalCount: number,
                totalSize: number,
                incCount: number,
                incSize: number,
                decCount: number,
                decSize: number
            },
            remote?: {
                totalCount: number,
                totalSize: number,
                incCount: number,
                incSize: number,
                decCount: number,
                decSize: number
            }
        }
    }
}

"/charts/federation": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number
        },
        response: {
            instance?: {
                total: number,
                inc: number,
                dec: number
            }
        }
    }
}

"/charts/hashtag": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number,
            tag: string
        },
        response: {
            local?: {
                count: number
            },
            remote?: {
                count: number
            }
        }
    }
}

"/charts/instance": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number,
            host: string
        },
        response: {
            requests?: {
                failed: number,
                succeeded: number,
                received: number
            },
            notes?: {
                total: number,
                inc: number,
                dec: number,
                diffs: {
                    normal: number,
                    reply: number,
                    renote: number
                }
            },
            users?: {
                total: number,
                inc: number,
                dec: number
            },
            following?: {
                total: number,
                inc: number,
                dec: number
            },
            followers?: {
                total: number,
                inc: number,
                dec: number
            },
            drive?: {
                totalFiles: number,
                totalUsage: number,
                incFiles: number,
                incUsage: number,
                decFiles: number,
                decUsage: number
            }
        }
    }
}

"/charts/network": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number
        },
        response: {
            incomingRequests?: number,
            outgoingRequests?: number,
            totalTime?: number,
            incomingBytes?: number,
            outgoingBytes?: number
        }
    }
}

"/charts/notes": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number
        },
        response: {
            local?: {
                total: number,
                inc: number,
                dec: number,
                diffs: {
                    normal: number,
                    reply: number,
                    renote: number
                }
            },
            remote?: {
                total: number,
                inc: number,
                dec: number,
                diffs: {
                    normal: number,
                    reply: number,
                    renote: number
                }
            }
        }
    }
}

"/charts/user/drive": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number,
            userId: string
        },
        response: {
            totalCount?: number,
            totalSize?: number,
            incCount?: number,
            incSize?: number,
            decCount?: number,
            decSize?: number
        }
    }
}

"/charts/user/following": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number,
            userId: string
        },
        response: {
            local?: {
                followings: {
                    total: number,
                    inc: number,
                    dec: number
                },
                followers: {
                    total: number,
                    inc: number,
                    dec: number
                }
            },
            remote?: {
                followings: {
                    total: number,
                    inc: number,
                    dec: number
                },
                followers: {
                    total: number,
                    inc: number,
                    dec: number
                }
            }
        }
    }
}

"/charts/user/notes": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number,
            userId: string
        },
        response: {
            total?: number,
            inc?: number,
            dec?: number,
            diffs?: {
                normal: number,
                reply: number,
                renote: number
            }
        }
    }
}

"/charts/user/reactions": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number,
            userId: string
        },
        response: {
            local?: {
                count: number
            },
            remote?: {
                count: number
            }
        }
    }
}

"/charts/users": {
    POST: {
        body: {
            span: 'day' | 'hour',
            limit?: number
        },
        response: {
            local?: {
                total: number,
                inc: number,
                dec: number
            },
            remote?: {
                total: number,
                inc: number,
                dec: number
            }
        }
    }
}

"/clips/add-note": {
    POST: {
        body: {
            clipId: string,
            noteId: string
        },
        response: any
    }
}

"/clips/create": {
    POST: {
        body: {
            name: string,
            isPublic?: boolean,
            description?: string
        },
        response: Clip
    }
}

"/clips/delete": {
    POST: {
        body: {
            clipId: string
        },
        response: any
    }
}

"/clips/list": {
    POST: {
        response: Clip[]
    }
}

"/clips/notes": {
    POST: {
        body: {
            clipId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: Note[]
    }
}

"/clips/show": {
    POST: {
        body: {
            clipId: string
        },
        response: Clip
    }
}

"/clips/update": {
    POST: {
        body: {
            clipId: string,
            name: string,
            isPublic?: boolean,
            description?: string
        },
        response: Clip
    }
}

"/drive": {
    POST: {
        response: {
            capacity?: number,
            usage?: number
        }
    }
}

"/drive/files": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            folderId?: string,
            type?: string
        },
        response: DriveFile[]
    }
}

"/drive/files/attached-notes": {
    POST: {
        body: {
            fileId: string
        },
        response: Note[]
    }
}

"/drive/files/check-existence": {
    POST: {
        body: {
            md5: string
        },
        response: boolean
    }
}

"/drive/files/create": {
    POST: {
        body: {
            folderId?: string,
            name?: string,
            isSensitive?: any,
            force?: any
        },
        response: DriveFile
    }
}

"/drive/files/delete": {
    POST: {
        body: {
            fileId: string
        },
        response: any
    }
}

"/drive/files/find-by-hash": {
    POST: {
        body: {
            md5: string
        },
        response: DriveFile[]
    }
}

"/drive/files/find": {
    POST: {
        body: {
            name: string,
            folderId?: string
        },
        response: DriveFile[]
    }
}

"/drive/files/show": {
    POST: {
        body: {
            fileId?: string,
            url?: string
        },
        response: DriveFile
    }
}

"/drive/files/update": {
    POST: {
        body: {
            fileId: string,
            folderId?: string,
            name?: string,
            isSensitive?: boolean,
            comment?: string
        },
        response: any
    }
}

"/drive/files/upload-from-url": {
    POST: {
        body: {
            url: string,
            folderId?: string,
            isSensitive?: boolean,
            comment?: string,
            force?: boolean
        },
        response: any
    }
}

"/drive/folders": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            folderId?: string
        },
        response: DriveFolder[]
    }
}

"/drive/folders/create": {
    POST: {
        body: {
            name?: string,
            parentId?: string
        },
        response: any
    }
}

"/drive/folders/delete": {
    POST: {
        body: {
            folderId: string
        },
        response: any
    }
}

"/drive/folders/find": {
    POST: {
        body: {
            name: string,
            parentId?: string
        },
        response: DriveFolder[]
    }
}

"/drive/folders/show": {
    POST: {
        body: {
            folderId: string
        },
        response: DriveFolder
    }
}

"/drive/folders/update": {
    POST: {
        body: {
            folderId: string,
            name?: string,
            parentId?: string
        },
        response: any
    }
}

"/drive/stream": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            type?: string
        },
        response: DriveFile[]
    }
}

"/endpoint": {
    POST: {
        body: {
            endpoint: string
        },
        response: any
    }
}

"/endpoints": {
    POST: {
        response: any
    }
}

"/federation/followers": {
    POST: {
        body: {
            host: string,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Following[]
    }
}

"/federation/following": {
    POST: {
        body: {
            host: string,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Following[]
    }
}

"/federation/instances": {
    POST: {
        body: {
            host?: string,
            blocked?: boolean,
            notResponding?: boolean,
            suspended?: boolean,
            federating?: boolean,
            subscribing?: boolean,
            publishing?: boolean,
            limit?: number,
            offset?: number,
            sort?: string
        },
        response: any
    }
}

"/federation/show-instance": {
    POST: {
        body: {
            host: string
        },
        response: any
    }
}

"/federation/users": {
    POST: {
        body: {
            host: string,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: User[]
    }
}

"/following/create": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/following/delete": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/following/requests/accept": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/following/requests/cancel": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/following/requests/list": {
    POST: {
        response: any
    }
}

"/following/requests/reject": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/games/reversi/games": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            my?: boolean
        },
        response: any
    }
}

"/games/reversi/games/show": {
    POST: {
        body: {
            gameId: string
        },
        response: any
    }
}

"/games/reversi/games/surrender": {
    POST: {
        body: {
            gameId: string
        },
        response: any
    }
}

"/games/reversi/invitations": {
    POST: {
        response: any
    }
}

"/games/reversi/match": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/games/reversi/match/cancel": {
    POST: {
        response: any
    }
}

"/get-online-users-count": {
    POST: {
        response: any
    }
}

"/hashtags/list": {
    POST: {
        body: {
            limit?: number,
            attachedToUserOnly?: boolean,
            attachedToLocalUserOnly?: boolean,
            attachedToRemoteUserOnly?: boolean,
            sort: '+mentionedUsers' | '-mentionedUsers' | '+mentionedLocalUsers' | '-mentionedLocalUsers' | '+mentionedRemoteUsers' | '-mentionedRemoteUsers' | '+attachedUsers' | '-attachedUsers' | '+attachedLocalUsers' | '-attachedLocalUsers' | '+attachedRemoteUsers' | '-attachedRemoteUsers'
        },
        response: Hashtag[]
    }
}

"/hashtags/search": {
    POST: {
        body: {
            limit?: number,
            query: string,
            offset?: number
        },
        response: string
    }
}

"/hashtags/show": {
    POST: {
        body: {
            tag: string
        },
        response: Hashtag
    }
}

"/hashtags/trend": {
    POST: {
        response: {
            tag: string,
            chart: number,
            usersCount: number
        }
    }
}

"/hashtags/users": {
    POST: {
        body: {
            tag: string,
            limit?: number,
            sort: '+follower' | '-follower' | '+createdAt' | '-createdAt' | '+updatedAt' | '-updatedAt',
            state?: 'all' | 'alive',
            origin?: 'combined' | 'local' | 'remote'
        },
        response: User[]
    }
}

"/i": {
    POST: {
        response: Me
    }
}

"/i/favorites": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: NoteFavorite[]
    }
}

"/i/notifications": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            following?: boolean,
            markAsRead?: boolean,
            includeTypes?: 'follow' | 'mention' | 'reply' | 'renote' | 'quote' | 'reaction' | 'pollVote' | 'receiveFollowRequest' | 'followRequestAccepted' | 'groupInvited' | 'app',
            excludeTypes?: 'follow' | 'mention' | 'reply' | 'renote' | 'quote' | 'reaction' | 'pollVote' | 'receiveFollowRequest' | 'followRequestAccepted' | 'groupInvited' | 'app'
        },
        response: Notification[]
    }
}

"/i/page-likes": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/i/pages": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/i/pin": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/i/read-all-messaging-messages": {
    POST: {
        response: any
    }
}

"/i/read-all-unread-notes": {
    POST: {
        response: any
    }
}

"/i/read-announcement": {
    POST: {
        body: {
            announcementId: string
        },
        response: any
    }
}

"/i/registry/get-all": {
    POST: {
        body: {
            scope?: string
        },
        response: any
    }
}

"/i/registry/get-detail": {
    POST: {
        body: {
            key: string,
            scope?: string
        },
        response: any
    }
}

"/i/registry/get": {
    POST: {
        body: {
            key: string,
            scope?: string
        },
        response: any
    }
}

"/i/registry/keys-with-type": {
    POST: {
        body: {
            scope?: string
        },
        response: any
    }
}

"/i/registry/keys": {
    POST: {
        body: {
            scope?: string
        },
        response: any
    }
}

"/i/registry/remove": {
    POST: {
        body: {
            key: string,
            scope?: string
        },
        response: any
    }
}

"/i/registry/scopes": {
    POST: {
        response: any
    }
}

"/i/registry/set": {
    POST: {
        body: {
            key: string,
            value: any,
            scope?: string
        },
        response: any
    }
}

"/i/unpin": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/i/update": {
    POST: {
        body: {
            name?: any,
            description?: any,
            lang?: 'ach' | 'ady' | 'af' | 'af-NA' | 'af-ZA' | 'ak' | 'ar' | 'ar-AR' | 'ar-MA' | 'ar-SA' | 'ay-BO' | 'az' | 'az-AZ' | 'be-BY' | 'bg' | 'bg-BG' | 'bn' | 'bn-IN' | 'bn-BD' | 'bs-BA' | 'ca' | 'ca-ES' | 'cak' | 'ck-US' | 'cs' | 'cs-CZ' | 'cy' | 'cy-GB' | 'da' | 'da-DK' | 'de' | 'de-AT' | 'de-DE' | 'de-CH' | 'dsb' | 'el' | 'el-GR' | 'en' | 'en-GB' | 'en-AU' | 'en-CA' | 'en-IE' | 'en-IN' | 'en-PI' | 'en-UD' | 'en-US' | 'en-ZA' | 'en@pirate' | 'eo' | 'eo-EO' | 'es' | 'es-AR' | 'es-419' | 'es-CL' | 'es-CO' | 'es-EC' | 'es-ES' | 'es-LA' | 'es-NI' | 'es-MX' | 'es-US' | 'es-VE' | 'et' | 'et-EE' | 'eu' | 'eu-ES' | 'fa' | 'fa-IR' | 'fb-LT' | 'ff' | 'fi' | 'fi-FI' | 'fo-FO' | 'fr' | 'fr-CA' | 'fr-FR' | 'fr-BE' | 'fr-CH' | 'fy-NL' | 'ga' | 'ga-IE' | 'gl' | 'gl-ES' | 'gn-PY' | 'gu-IN' | 'gx-GR' | 'he' | 'he-IL' | 'hi' | 'hi-IN' | 'hr' | 'hr-HR' | 'hsb' | 'ht' | 'hu' | 'hu-HU' | 'hy-AM' | 'id' | 'id-ID' | 'is' | 'is-IS' | 'it' | 'it-IT' | 'ja' | 'ja-JP' | 'jv-ID' | 'ka-GE' | 'kk-KZ' | 'km' | 'km-KH' | 'kab' | 'kn' | 'kn-IN' | 'ko' | 'ko-KR' | 'ku-TR' | 'la' | 'la-VA' | 'lb' | 'li-NL' | 'lt' | 'lt-LT' | 'lv' | 'lv-LV' | 'mai' | 'mg-MG' | 'mk' | 'mk-MK' | 'ml' | 'ml-IN' | 'mn-MN' | 'mr' | 'mr-IN' | 'ms' | 'ms-MY' | 'mt' | 'mt-MT' | 'my' | 'no' | 'nb' | 'nb-NO' | 'ne' | 'ne-NP' | 'nl' | 'nl-BE' | 'nl-NL' | 'nn-NO' | 'oc' | 'or-IN' | 'pa' | 'pa-IN' | 'pl' | 'pl-PL' | 'ps-AF' | 'pt' | 'pt-BR' | 'pt-PT' | 'qu-PE' | 'rm-CH' | 'ro' | 'ro-RO' | 'ru' | 'ru-RU' | 'sa-IN' | 'se-NO' | 'si-LK' | 'sk' | 'sk-SK' | 'sl' | 'sl-SI' | 'so-SO' | 'sq' | 'sq-AL' | 'sr' | 'sr-RS' | 'su' | 'sv' | 'sv-SE' | 'sw' | 'sw-KE' | 'ta' | 'ta-IN' | 'te' | 'te-IN' | 'tg' | 'tg-TJ' | 'th' | 'th-TH' | 'tl' | 'tl-PH' | 'tlh' | 'tr' | 'tr-TR' | 'tt-RU' | 'uk' | 'uk-UA' | 'ur' | 'ur-PK' | 'uz' | 'uz-UZ' | 'vi' | 'vi-VN' | 'xh-ZA' | 'yi' | 'yi-DE' | 'zh' | 'zh-Hans' | 'zh-Hant' | 'zh-CN' | 'zh-HK' | 'zh-SG' | 'zh-TW' | 'zu-ZA',
            location?: any,
            birthday?: any,
            avatarId?: string,
            bannerId?: string,
            fields?: {},
            isLocked?: boolean,
            isExplorable?: boolean,
            hideOnlineStatus?: boolean,
            carefulBot?: boolean,
            carefulMassive?: boolean,
            autoAcceptFollowed?: boolean,
            noCrawle?: boolean,
            isBot?: boolean,
            isCat?: boolean,
            isLady?: boolean,
            autoWatch?: boolean,
            alwaysMarkNsfw?: boolean,
            pinnedPageId?: string
        },
        response: any
    }
}

"/i/user-group-invites": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/messaging/history": {
    POST: {
        body: {
            limit?: number,
            group?: boolean
        },
        response: MessagingMessage[]
    }
}

"/messaging/messages": {
    POST: {
        body: {
            userId?: string,
            groupId?: string,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            markAsRead?: boolean
        },
        response: MessagingMessage[]
    }
}

"/messaging/messages/create": {
    POST: {
        body: {
            userId?: string,
            groupId?: string,
            text?: string,
            fileId?: string
        },
        response: MessagingMessage
    }
}

"/messaging/messages/delete": {
    POST: {
        body: {
            messageId: string
        },
        response: any
    }
}

"/messaging/messages/read": {
    POST: {
        body: {
            messageId: string
        },
        response: any
    }
}

"/meta": {
    POST: {
        body: {
            detail?: boolean
        },
        response: {
            version?: string,
            name?: string,
            description?: string,
            announcements?: {
                title: string,
                text: string
            },
            disableRegistration?: boolean,
            disableLocalTimeline?: boolean,
            disableGlobalTimeline?: boolean,
            enableEmojiReaction?: boolean
        }
    }
}

"/mute/create": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/mute/delete": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/mute/list": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: Muting[]
    }
}

"/my/apps": {
    POST: {
        body: {
            limit?: number,
            offset?: number
        },
        response: any
    }
}

"/notes": {
    POST: {
        body: {
            local?: boolean,
            reply?: boolean,
            renote?: boolean,
            withFiles?: boolean,
            poll?: boolean,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: Note[]
    }
}

"/notes/children": {
    POST: {
        body: {
            noteId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: Note[]
    }
}

"/notes/clips": {
    POST: {
        body: {
            noteId: string
        },
        response: Note[]
    }
}

"/notes/conversation": {
    POST: {
        body: {
            noteId: string,
            limit?: number,
            offset?: number
        },
        response: Note[]
    }
}

"/notes/create": {
    POST: {
        body: {
            visibility?: 'public' | 'home' | 'followers' | 'specified',
            visibleUserIds?: string,
            text?: string,
            cw?: string,
            viaMobile?: boolean,
            localOnly?: boolean,
            noExtractMentions?: boolean,
            noExtractHashtags?: boolean,
            noExtractEmojis?: boolean,
            preview?: boolean,
            geo?: {
                coordinates?: any,
                altitude?: number,
                accuracy?: number,
                altitudeAccuracy?: number,
                heading?: number,
                speed?: number
            },
            fileIds?: string,
            mediaIds?: string,
            replyId?: string,
            renoteId?: string,
            channelId?: string,
            poll?: {
                choices?: string,
                multiple?: boolean,
                expiresAt?: number,
                expiredAfter?: number
            }
        },
        response: {
            createdNote?: Note
        }
    }
}

"/notes/delete": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/favorites/create": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/favorites/delete": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/featured": {
    POST: {
        body: {
            limit?: number
        },
        response: Note[]
    }
}

"/notes/global-timeline": {
    POST: {
        body: {
            withFiles?: boolean,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number
        },
        response: Note[]
    }
}

"/notes/hybrid-timeline": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number,
            includeMyRenotes?: boolean,
            includeRenotedMyNotes?: boolean,
            includeLocalRenotes?: boolean,
            withFiles?: boolean
        },
        response: Note[]
    }
}

"/notes/local-timeline": {
    POST: {
        body: {
            withFiles?: boolean,
            fileType?: string,
            excludeNsfw?: boolean,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number
        },
        response: Note[]
    }
}

"/notes/mentions": {
    POST: {
        body: {
            following?: boolean,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            visibility?: string
        },
        response: Note[]
    }
}

"/notes/polls/recommendation": {
    POST: {
        body: {
            limit?: number,
            offset?: number
        },
        response: any
    }
}

"/notes/polls/vote": {
    POST: {
        body: {
            noteId: string,
            choice: number
        },
        response: any
    }
}

"/notes/reactions": {
    POST: {
        body: {
            noteId: string,
            type?: string,
            limit?: number,
            offset?: number,
            sinceId?: string,
            untilId?: string
        },
        response: NoteReaction[]
    }
}

"/notes/reactions/create": {
    POST: {
        body: {
            noteId: string,
            reaction: string,
            dislike?: boolean
        },
        response: any
    }
}

"/notes/reactions/delete": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/renotes": {
    POST: {
        body: {
            noteId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: Note[]
    }
}

"/notes/replies": {
    POST: {
        body: {
            noteId: string,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Note[]
    }
}

"/notes/search-by-tag": {
    POST: {
        body: {
            tag?: string,
            query?: string[],
            reply?: boolean,
            renote?: boolean,
            withFiles?: boolean,
            poll?: boolean,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Note[]
    }
}

"/notes/search": {
    POST: {
        body: {
            query: string,
            sinceId?: string,
            untilId?: string,
            limit?: number,
            offset?: number,
            host?: string,
            userId?: string,
            channelId?: string
        },
        response: Note[]
    }
}

"/notes/show": {
    POST: {
        body: {
            noteId: string
        },
        response: Note
    }
}

"/notes/state": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/timeline": {
    POST: {
        body: {
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number,
            includeMyRenotes?: boolean,
            includeRenotedMyNotes?: boolean,
            includeLocalRenotes?: boolean,
            withFiles?: boolean
        },
        response: Note[]
    }
}

"/notes/unrenote": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/user-list-timeline": {
    POST: {
        body: {
            listId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number,
            includeMyRenotes?: boolean,
            includeRenotedMyNotes?: boolean,
            includeLocalRenotes?: boolean,
            withFiles?: boolean
        },
        response: Note[]
    }
}

"/notes/watching/create": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notes/watching/delete": {
    POST: {
        body: {
            noteId: string
        },
        response: any
    }
}

"/notifications/mark-all-as-read": {
    POST: {
        response: any
    }
}

"/pages/create": {
    POST: {
        body: {
            title: string,
            name: string,
            summary?: string,
            content: {},
            variables: {},
            eyeCatchingImageId?: string,
            font?: 'serif' | 'sans-serif',
            alignCenter?: boolean,
            hideTitleWhenPinned?: boolean
        },
        response: Page
    }
}

"/pages/delete": {
    POST: {
        body: {
            pageId: string
        },
        response: any
    }
}

"/pages/like": {
    POST: {
        body: {
            pageId: string
        },
        response: any
    }
}

"/pages/show": {
    POST: {
        body: {
            pageId?: string,
            name?: string,
            username?: string
        },
        response: Page
    }
}

"/pages/unlike": {
    POST: {
        body: {
            pageId: string
        },
        response: any
    }
}

"/pages/update": {
    POST: {
        body: {
            pageId: string,
            title: string,
            name: string,
            summary?: string,
            content: {},
            variables: {},
            eyeCatchingImageId?: string,
            font?: 'serif' | 'sans-serif',
            alignCenter?: boolean,
            hideTitleWhenPinned?: boolean
        },
        response: any
    }
}

"/ping": {
    POST: {
        response: {
            pong?: number
        }
    }
}

"/pinned-users": {
    POST: {
        response: User[]
    }
}

"/request-reset-password": {
    POST: {
        body: {
            username: string,
            email: string
        },
        response: any
    }
}

"/reset-password": {
    POST: {
        body: {
            token: string,
            password: string
        },
        response: any
    }
}

"/room/show": {
    POST: {
        body: {
            userId?: string,
            username?: string,
            host?: string
        },
        response: any
    }
}

"/room/update": {
    POST: {
        body: {
            room: {
                furnitures?: {
                    id?: string,
                    type?: string,
                    position?: {
                        x?: number,
                        y?: number,
                        z?: number
                    },
                    rotation?: {
                        x?: number,
                        y?: number,
                        z?: number
                    },
                    props?: {}
                },
                roomType?: string,
                carpetColor?: string
            }
        },
        response: any
    }
}

"/server-info": {
    POST: {
        response: any
    }
}

"/stats": {
    POST: {
        response: {
            notesCount?: number,
            originalNotesCount?: number,
            usersCount?: number,
            originalUsersCount?: number,
            reactionsCount?: number,
            instances?: number
        }
    }
}

"/sw/register": {
    POST: {
        body: {
            endpoint: string,
            auth: string,
            publickey: string
        },
        response: any
    }
}

"/username/available": {
    POST: {
        body: {
            username: any
        },
        response: any
    }
}

"/users": {
    POST: {
        body: {
            limit?: number,
            offset?: number,
            sort?: '+follower' | '-follower' | '+createdAt' | '-createdAt' | '+updatedAt' | '-updatedAt',
            state?: 'all' | 'admin' | 'moderator' | 'adminOrModerator' | 'verified' | 'alive',
            origin?: 'combined' | 'local' | 'remote'
        },
        response: User[]
    }
}

"/users/clips": {
    POST: {
        body: {
            userId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/users/followers": {
    POST: {
        body: {
            userId?: string,
            username?: string,
            host?: string,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Following[]
    }
}

"/users/following": {
    POST: {
        body: {
            userId?: string,
            username?: string,
            host?: string,
            sinceId?: string,
            untilId?: string,
            limit?: number
        },
        response: Following[]
    }
}

"/users/get-frequently-replied-users": {
    POST: {
        body: {
            userId: string,
            limit?: number
        },
        response: User[]
    }
}

"/users/groups/create": {
    POST: {
        body: {
            name: string
        },
        response: UserGroup
    }
}

"/users/groups/delete": {
    POST: {
        body: {
            groupId: string
        },
        response: any
    }
}

"/users/groups/invitations/accept": {
    POST: {
        body: {
            inviteId: string
        },
        response: any
    }
}

"/users/groups/invitations/reject": {
    POST: {
        body: {
            inviteId: string
        },
        response: any
    }
}

"/users/groups/invite": {
    POST: {
        body: {
            groupId: string,
            userId: string
        },
        response: any
    }
}

"/users/groups/joined": {
    POST: {
        response: UserGroup[]
    }
}

"/users/groups/owned": {
    POST: {
        response: UserGroup[]
    }
}

"/users/groups/pull": {
    POST: {
        body: {
            groupId: string,
            userId: string
        },
        response: any
    }
}

"/users/groups/show": {
    POST: {
        body: {
            groupId: string
        },
        response: UserGroup
    }
}

"/users/groups/transfer": {
    POST: {
        body: {
            groupId: string,
            userId: string
        },
        response: UserGroup
    }
}

"/users/groups/update": {
    POST: {
        body: {
            groupId: string,
            name: string
        },
        response: UserGroup
    }
}

"/users/lists/create": {
    POST: {
        body: {
            name: string
        },
        response: UserList
    }
}

"/users/lists/delete": {
    POST: {
        body: {
            listId: string
        },
        response: any
    }
}

"/users/lists/list": {
    POST: {
        response: UserList[]
    }
}

"/users/lists/pull": {
    POST: {
        body: {
            listId: string,
            userId: string
        },
        response: any
    }
}

"/users/lists/push": {
    POST: {
        body: {
            listId: string,
            userId: string
        },
        response: any
    }
}

"/users/lists/show": {
    POST: {
        body: {
            listId: string
        },
        response: UserList
    }
}

"/users/lists/update": {
    POST: {
        body: {
            listId: string,
            name: string
        },
        response: any
    }
}

"/users/notes": {
    POST: {
        body: {
            userId: string,
            includeReplies?: boolean,
            limit?: number,
            sinceId?: string,
            untilId?: string,
            sinceDate?: number,
            untilDate?: number,
            includeMyRenotes?: boolean,
            withFiles?: boolean,
            fileType?: string,
            excludeNsfw?: boolean
        },
        response: Note[]
    }
}

"/users/pages": {
    POST: {
        body: {
            userId: string,
            limit?: number,
            sinceId?: string,
            untilId?: string
        },
        response: any
    }
}

"/users/recommendation": {
    POST: {
        body: {
            limit?: number,
            offset?: number
        },
        response: User[]
    }
}

"/users/relation": {
    POST: {
        body: {
            userId: any
        },
        response: any
    }
}

"/users/report-abuse": {
    POST: {
        body: {
            userId: string,
            comment: string
        },
        response: any
    }
}

"/users/search-by-username-and-host": {
    POST: {
        body: {
            username?: string,
            host?: string,
            offset?: number,
            limit?: number,
            detail?: boolean
        },
        response: User[]
    }
}

"/users/search": {
    POST: {
        body: {
            query: string,
            offset?: number,
            limit?: number,
            localOnly?: boolean,
            detail?: boolean
        },
        response: User[]
    }
}

"/users/show": {
    POST: {
        body: {
            userId?: string,
            userIds?: string,
            username?: string,
            host?: string
        },
        response: User
    }
}

"/users/stats": {
    POST: {
        body: {
            userId: string
        },
        response: any
    }
}

"/version": {
    POST: {
        response: {
            version?: string
        }
    }
}
}}