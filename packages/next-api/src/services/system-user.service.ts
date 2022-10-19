import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@ayuskey/nestjs-typeorm';
import { UsedUsername, User, UserKeypair, UserProfile } from '@ayuskey/models';
import { Repository } from 'typeorm';
import {generateNativeUserToken, genId, genRsaKeyPair} from '@ayuskey/shared';

@Injectable()
export class SystemUserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserKeypair)
        private userKeyPairRepository: Repository<UserKeypair>,
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
        @InjectRepository(UsedUsername)
        private usedUsernameRepository: Repository<UsedUsername>
    ) {}

 async createSystemUser(username: string) {
	const password = uuid();

	// Generate hash of password
	const salt = await bcrypt.genSalt(8);
	const hash = await bcrypt.hash(password, salt);

	// Generate secret
	const secret = generateNativeUserToken();

	const keyPair = await genRsaKeyPair(4096);

	let account!: User;

    const exist = await this.userRepository.findOne({where: {usernameLower: username.toLowerCase(), host: null}})

    if (exist) throw new Error('the user is already exists');

    account = await this.userRepository.insert({
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
    }).then((user) => this.userRepository.findOneOrFail(user.identifiers[0]))

    
    await this.userKeyPairRepository.insert({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        userId: account.id,
    })


    await this.userProfileRepository.insert({
        userId: account.id,
        autoAcceptFollowed: false,
        password: hash,
    })

    await this.usedUsernameRepository.insert({
        createdAt: new Date(),
        username: username.toLowerCase(),
    })

	return account;
}
}