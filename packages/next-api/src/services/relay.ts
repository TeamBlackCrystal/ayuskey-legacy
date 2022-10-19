import { renderUndo } from '@ayuskey/shared';
import { ILocalUser, User, Relay } from '@ayuskey/models';
import { genId, renderFollowRelay } from '@ayuskey/shared';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@ayuskey/nestjs-typeorm';
import { Repository } from 'typeorm';
import { SystemUserService } from './system-user.service';
import { RendererService } from 'src/remote/activitypub/renderer/renderer.service';
import { QueueService } from 'src/queue/queue.service';

const ACTOR_USERNAME = 'relay.actor' as const;


@Injectable()
export class APRelayService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Relay)
        private relayRepository: Repository<Relay>,
        private systemUserService: SystemUserService,
        private rendererService: RendererService,
        private ququeService: QueueService
    ) { }

    async getRelayActor(): Promise<ILocalUser> {
        const user = await this.userRepository.findOne({
            host: null,
            username: ACTOR_USERNAME,
        });

        if (user) return user as ILocalUser;

        const created = await this.systemUserService.createSystemUser(ACTOR_USERNAME);
        return created as ILocalUser;
    }

    async addRelay(inbox: string) {
        const relay = await this.relayRepository.save({
            id: genId(),
            inbox,
            status: 'requesting',
        });

        const relayActor = await this.getRelayActor();
        const follow = await renderFollowRelay(relay, relayActor);
        const activity = this.rendererService.renderActivity(follow);
        this.ququeService.deliver(relayActor, activity, relay.inbox);

        return relay;
    }

    async removeRelay(inbox: string) {
        const relay = await this.relayRepository.findOne({
            inbox,
        });

        if (relay == null) {
            throw 'relay not found';
        }

        const relayActor = await this.getRelayActor();
        const follow = renderFollowRelay(relay, relayActor);
        const undo = renderUndo(follow, relayActor);
        const activity = this.rendererService.renderActivity(undo);
        this.ququeService.deliver(relayActor, activity, relay.inbox);

        await this.relayRepository.delete(relay.id);
    }

    async listRelay() {
        const relays = await this.relayRepository.find();
        return relays;
    }

    async relayAccepted(id: string) {
        const result = await this.relayRepository.update(id, {
            status: 'accepted',
        });

        return JSON.stringify(result);
    }

    async relayRejected(id: string) {
        const result = await this.relayRepository.update(id, {
            status: 'rejected',
        });

        return JSON.stringify(result);
    }

    async deliverToRelays(user: ILocalUser, activity: any) {
        if (activity == null) return;

        const relays = await this.relayRepository.find({
            status: 'accepted',
        });
        if (relays.length === 0) return;

        const copy = JSON.parse(JSON.stringify(activity));
        if (!copy.to) copy.to = ['https://www.w3.org/ns/activitystreams#Public'];

        const signed = await this.rendererService.attachLdSignature(copy, user);

        for (const relay of relays) {
            this.ququeService.deliver(user, signed, relay.inbox);
        }
    }
}