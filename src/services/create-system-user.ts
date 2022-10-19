import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import generateNativeUserToken from '@ayuskey/shared';
import { genRsaKeyPair } from '../misc/gen-key-pair';
import { User, UserProfile, UserKeypair, UsedUsername } from '@ayuskey/models';
import { getConnection } from 'typeorm';
import { genId } from '@ayuskey/shared';

export async function createSystemUser(username: string) {
	const password = uuid();

	// Generate hash of password
	const salt = await bcrypt.genSalt(8);
	const hash = await bcrypt.hash(password, salt);

	// Generate secret
	const secret = generateNativeUserToken();

	const keyPair = await genRsaKeyPair(4096);

	let account!: User;

	// Start transaction
	await getConnection().transaction(async transactionalEntityManager => {
		const exist = await transactionalEntityManager.findOne(User, {
			usernameLower: username.toLowerCase(),
			host: null,
		});

		if (exist) throw new Error('the user is already exists');

		account = await transactionalEntityManager.insert(User, {
			id: genId(),
			createdAt: new Date(),
			username: username,
			usernameLower: username.toLowerCase(),
			host: null,
			token: secret,
			isAdmin: false,
			isLocked: true,
			isExplorable: false,
			isBot: true,
		}).then(x => transactionalEntityManager.findOneOrFail(User, x.identifiers[0]));

		await transactionalEntityManager.insert(UserKeypair, {
			publicKey: keyPair.publicKey,
			privateKey: keyPair.privateKey,
			userId: account.id,
		});

		await transactionalEntityManager.insert(UserProfile, {
			userId: account.id,
			autoAcceptFollowed: false,
			password: hash,
		});

		await transactionalEntityManager.insert(UsedUsername, {
			createdAt: new Date(),
			username: username.toLowerCase(),
		});
	});

	return account;
}
