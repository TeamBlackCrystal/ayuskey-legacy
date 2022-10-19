import { Instance } from '@ayuskey/models';
import { InjectRepository } from '@ayuskey/nestjs-typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { toPuny, genId } from '@ayuskey/shared';

@Injectable()
export class UtilsService {
    constructor(
        @InjectRepository(Instance)
        private instanceRepository: Repository<Instance>
    ) { }

    async registerOrFetchInstanceDoc(host: string): Promise<Instance> {
        host = toPuny(host);

        const index = await this.instanceRepository.findOne({ host });

        if (index == null) {
            const i = await this.instanceRepository.save({
                id: genId(),
                host,
                caughtAt: new Date(),
                lastCommunicatedAt: new Date(),
            });

            // federationChart.update(true);

            return i;
        } else {
            return index;
        }
    }

}
