import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { config, redisConfig } from './const';
import { entities } from './db/entities';
import { AuthGuard } from './auth.guard';
import { User } from '@ayuskey/models';
import { UtilsModule } from './utils/utils.module';
import { BullModule } from '@nestjs/bull';
import { ServicesModule } from './services/services.module';
import { RendererModule } from './remote/activitypub/renderer/renderer.module';
import { QueueModule } from './queue/queue.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: config.db.host,
			port: config.db.port,
			username: config.db.user,
			password: config.db.pass,
			database: config.db.db,
			entities: entities,
		}),
		BullModule.forRoot({
			redis: redisConfig
		}),
		TypeOrmModule.forFeature([User]),
		NotesModule,
		UtilsModule,
		ServicesModule,
		RendererModule,
		QueueModule
	],
	controllers: [AppController],
	providers: [AppService, AuthGuard],
})
export class AppModule { }
