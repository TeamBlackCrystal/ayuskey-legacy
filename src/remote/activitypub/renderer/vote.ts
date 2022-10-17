import config from '../../../config';
import { Note, IRemoteUser, ILocalUser, PollVote, Poll } from '@ayuskey/models';

export default async function renderVote(user: ILocalUser, vote: PollVote, note: Note, poll: Poll, pollOwner: IRemoteUser): Promise<any> {
	return {
		id: `${config.url}/users/${user.id}#votes/${vote.id}/activity`,
		actor: `${config.url}/users/${user.id}`,
		type: 'Create',
		to: [pollOwner.uri],
		published: new Date().toISOString(),
		object: {
			id: `${config.url}/users/${user.id}#votes/${vote.id}`,
			type: 'Note',
			attributedTo: `${config.url}/users/${user.id}`,
			to: [pollOwner.uri],
			inReplyTo: note.uri,
			name: poll.choices[vote.choice],
		},
	};
}
