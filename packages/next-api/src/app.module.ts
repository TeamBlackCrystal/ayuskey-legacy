import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { config } from './const';
import { entities } from './db/entities';
import { AuthGuard } from './auth.guard';
import { User } from '@ayuskey/models';

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
		TypeOrmModule.forFeature([User]),
		NotesModule,
	],
	controllers: [AppController],
	providers: [AppService, AuthGuard],
})
export class AppModule {}
