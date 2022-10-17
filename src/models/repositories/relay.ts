import { EntityRepository, Repository } from 'typeorm';
import { Relay } from '@ayuskey/models';

@EntityRepository(Relay)
export class RelayRepository extends Repository<Relay> {
}
