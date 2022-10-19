import { ILocalUser } from '@ayuskey/models/built/entities/user';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { config } from 'src/const';
import {DeliverJobData}  from '../../../../built/queue'

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('deliver')
        private deliverQueue: Queue<DeliverJobData>
    ) {}

    deliver(user: ILocalUser, content: any, to: string) {
        if (config.disableFederation) return;
    
        if (content == null) return null;
        if (to == null) return null;
    
        const data = {
            user: {
                id: user.id,
            },
            content,
            to,
        };
    
        return this.deliverQueue.add(data, {
            attempts: config.deliverJobMaxAttempts || 12,
            backoff: {
                type: 'apBackoff',
            },
            removeOnComplete: true,
            removeOnFail: true,
        });
    }
}
