import { User } from '@ayuskey/models';

export default function(user: User): string {
	return user.name || user.username;
}
