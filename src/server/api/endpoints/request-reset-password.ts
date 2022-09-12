import $ from 'cafy';
import define from '../define';
import * as ms from 'ms';
import { sendEmail } from '../../../services/send-email';
import { Users, UserProfiles, PasswordResetRequests } from '../../../models';
import config from '../../../config';
import { secureRndstr } from '../../../misc/secure-rndstr';
import { apiLogger } from '../logger';
import { genId } from '../../../misc/gen-id';
import { IsNull } from 'typeorm';

export const meta = {
	requireCredential: false as const,

	limit: {
		duration: ms('1hour'),
		max: 3
	},

	params: {
		username: {
			validator: $.str.min(1)
		},

		email: {
			validator: $.str.min(1)
		},
	},

	errors: {
	}
};

export default define(meta, async (ps) => {
	const user = await Users.findOne({
		usernameLower: ps.username.toLowerCase(),
		host: IsNull()
	});

	// そのユーザーは存在しない
	if (user == null) {
		apiLogger.warn(`Reset password requested for ${ps.username}, but not found.`);
		return;	// エラー内容を返してもいい
	}

	// ローカルユーザーではない
	if (user.host !== null) {
		apiLogger.warn(`Reset password requested for ${ps.username}, but not local user.`);
		return;	// 何も返さない
	}

	// 削除済み
	if (user.isDeleted) {
		apiLogger.warn(`Reset password requested for ${ps.username}, but deleted.`);
		return;	// エラー内容を返してもいい
	}

	// 凍結されている
	if (user.isSuspended) {
		apiLogger.warn(`Reset password requested for ${ps.username}, but suspended.`);
		return;	// エラー内容を返してもいい
	}

  const profile = await UserProfiles.findOneOrFail(user.id);

	// 合致するメアドが登録されていなかったら無視
	if (profile.email !== ps.email) {
		try {
			apiLogger.warn(`Reset password requested for ${ps.username}, but email missmatch.`);
		} catch {}
		return;	// エラー内容はあえて返さない
	}

	// メアドが認証されていなかったら無視
	if (!profile.emailVerified) {
		try {
			apiLogger.warn(`Reset password requested for ${ps.username}, but email not verified.`);
		} catch {}
		return;	// エラー内容はあえて返さない
	}

	const token = secureRndstr(50);

	await PasswordResetRequests.insert({
		id: genId(),
		createdAt: new Date(),
		userId: profile.userId,
		token
	});

	const link = `${config.url}/reset-password/${token}`;

	sendEmail(ps.email, 'Password reset requested', `To reset password, please click the URL below.\n${link}`);
});
