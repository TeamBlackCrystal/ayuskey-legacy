import { Module } from '@nestjs/common';
import { APRelayService } from './relay';
import { SystemUserService } from './system-user.service';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { Relay, UsedUsername, User, UserKeypair, UserProfile } from '@ayuskey/models';
import { RendererService } from 'src/remote/activitypub/renderer/renderer.service';
import { QueueService } from 'src/queue/queue.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserKeypair,
            UserProfile,
            UsedUsername,
            Relay
]),
    ],
    providers: [
        APRelayService,
        SystemUserService,
        RendererService,
        QueueService
    ],
    exports: [APRelayService, SystemUserService]
})
export class ServicesModule { }
