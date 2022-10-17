import { getRepository, getCustomRepository } from 'typeorm';
import {
	Announcement,
	AnnouncementRead,
	NoteWatching,
	NoteUnread,
	Poll,
	PollVote,
	UserProfile,
	UserKeypair,
	AttestationChallenge,
	UserSecurityKey,
	UserPublickey,
	UserListJoining,
	UserGroupJoining,
	UserNotePining,
	UsedUsername,
	Instance,
	Meta,
	SwSubscription,
	RegistrationTicket,
	AccessToken,
	Log,
	ClipNote,
	AntennaNote,
	RegistryItem,
	ChannelFollowing,
	ChannelNotePining,
	PasswordResetRequest
} from '@ayuskey/models';
import { EmojiRepository } from './repositories/emoji';
import { UserRepository } from './repositories/user';
import { NoteRepository } from './repositories/note';
import { DriveFileRepository } from './repositories/drive-file';
import { DriveFolderRepository } from './repositories/drive-folder';
import { SigninRepository } from './repositories/signin';
import { MessagingMessageRepository } from './repositories/messaging-message';
import { ReversiGameRepository } from './repositories/games/reversi/game';
import { UserListRepository } from './repositories/user-list';
import { UserGroupRepository } from './repositories/user-group';
import { UserGroupInviteRepository } from './repositories/user-group-invite';
import { FollowRequestRepository } from './repositories/follow-request';
import { MutingRepository } from './repositories/muting';
import { BlockingRepository } from './repositories/blocking';
import { NoteReactionRepository } from './repositories/note-reaction';
import { NotificationRepository } from './repositories/notification';
import { NoteFavoriteRepository } from './repositories/note-favorite';
import { ReversiMatchingRepository } from './repositories/games/reversi/matching';
import { AppRepository } from './repositories/app';
import { FollowingRepository } from './repositories/following';
import { AbuseUserReportRepository } from './repositories/abuse-user-report';
import { AuthSessionRepository } from './repositories/auth-session';
import { HashtagRepository } from './repositories/hashtag';
import { PageRepository } from './repositories/page';
import { PageLikeRepository } from './repositories/page-like';
import { ModerationLogRepository } from './repositories/moderation-logs';
import { ClipRepository } from './repositories/clip';
import { AntennaRepository } from './repositories/antenna';
import { RelayRepository } from './repositories/relay';
import { ChannelRepository } from './repositories/channel';

export const Announcements = getRepository(Announcement);
export const AnnouncementReads = getRepository(AnnouncementRead);
export const Apps = getCustomRepository(AppRepository);
export const Notes = getCustomRepository(NoteRepository);
export const NoteFavorites = getCustomRepository(NoteFavoriteRepository);
export const NoteWatchings = getRepository(NoteWatching);
export const NoteReactions = getCustomRepository(NoteReactionRepository);
export const NoteUnreads = getRepository(NoteUnread);
export const Polls = getRepository(Poll);
export const PollVotes = getRepository(PollVote);
export const Users = getCustomRepository(UserRepository);
export const UserProfiles = getRepository(UserProfile);
export const UserKeypairs = getRepository(UserKeypair);
export const AttestationChallenges = getRepository(AttestationChallenge);
export const UserSecurityKeys = getRepository(UserSecurityKey);
export const UserPublickeys = getRepository(UserPublickey);
export const UserLists = getCustomRepository(UserListRepository);
export const UserListJoinings = getRepository(UserListJoining);
export const UserGroups = getCustomRepository(UserGroupRepository);
export const UserGroupJoinings = getRepository(UserGroupJoining);
export const UserGroupInvites = getCustomRepository(UserGroupInviteRepository);
export const UserNotePinings = getRepository(UserNotePining);
export const UsedUsernames = getRepository(UsedUsername);
export const Followings = getCustomRepository(FollowingRepository);
export const FollowRequests = getCustomRepository(FollowRequestRepository);
export const Instances = getRepository(Instance);
export const Emojis = getCustomRepository(EmojiRepository);
export const DriveFiles = getCustomRepository(DriveFileRepository);
export const DriveFolders = getCustomRepository(DriveFolderRepository);
export const Notifications = getCustomRepository(NotificationRepository);
export const Metas = getRepository(Meta);
export const Mutings = getCustomRepository(MutingRepository);
export const Blockings = getCustomRepository(BlockingRepository);
export const SwSubscriptions = getRepository(SwSubscription);
export const Hashtags = getCustomRepository(HashtagRepository);
export const AbuseUserReports = getCustomRepository(AbuseUserReportRepository);
export const RegistrationTickets = getRepository(RegistrationTicket);
export const AuthSessions = getCustomRepository(AuthSessionRepository);
export const AccessTokens = getRepository(AccessToken);
export const Signins = getCustomRepository(SigninRepository);
export const MessagingMessages = getCustomRepository(MessagingMessageRepository);
export const ReversiGames = getCustomRepository(ReversiGameRepository);
export const ReversiMatchings = getCustomRepository(ReversiMatchingRepository);
export const Logs = getRepository(Log);
export const Pages = getCustomRepository(PageRepository);
export const PageLikes = getCustomRepository(PageLikeRepository);
export const ModerationLogs = getCustomRepository(ModerationLogRepository);
export const Clips = getCustomRepository(ClipRepository);
export const ClipNotes = getRepository(ClipNote);
export const Antennas = getCustomRepository(AntennaRepository);
export const AntennaNotes = getRepository(AntennaNote);
export const Relays = getCustomRepository(RelayRepository);
export const RegistryItems = getRepository(RegistryItem);
export const Channels = getCustomRepository(ChannelRepository);
export const ChannelFollowings = getRepository(ChannelFollowing);
export const ChannelNotePinings = getRepository(ChannelNotePining);
export const PasswordResetRequests = getRepository(PasswordResetRequest);
