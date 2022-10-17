import { publishUserListStream } from '../stream';
import { User, UserList, UserListJoining } from '@ayuskey/models';
import { UserListJoinings, Users } from '../../models';
import { genId } from '../../misc/gen-id';
import { fetchProxyAccount } from '../../misc/fetch-proxy-account';
import createFollowing from '../following/create';

export async function pushUserToUserList(target: User, list: UserList) {
	await UserListJoinings.save({
		id: genId(),
		createdAt: new Date(),
		userId: target.id,
		userListId: list.id,
	} as UserListJoining);

	publishUserListStream(list.id, 'userAdded', await Users.pack(target));

	// このインスタンス内にこのリモートユーザーをフォローしているユーザーがいなくても投稿を受け取るためにダミーのユーザーがフォローしたということにする
	if (Users.isRemoteUser(target)) {
		const proxy = await fetchProxyAccount();
		createFollowing(proxy, target);
	}
}
