import config from '../../../config';
import { ILocalUser, MessagingMessage } from '@ayuskey/models';

export const renderReadActivity = (user: ILocalUser, message: MessagingMessage) => ({
	type: 'Read',
	actor: `${config.url}/users/${user.id}`,
	object: message.uri,
});
