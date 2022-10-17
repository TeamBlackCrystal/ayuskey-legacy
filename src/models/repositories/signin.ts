import { EntityRepository, Repository } from 'typeorm';
import { Signin } from '@ayuskey/models';

@EntityRepository(Signin)
export class SigninRepository extends Repository<Signin> {
	public async pack(
		src: any,
	) {
		return src;
	}
}
