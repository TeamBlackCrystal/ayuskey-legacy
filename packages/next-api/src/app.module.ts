import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { Config } from '../../../built/config/types';

const config = yaml.load(
	readFileSync('../../.config/default.yml', 'utf-8'),
) as Config;

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: config.db.host,
			port: config.db.port,
			username: config.db.user,
			password: config.db.pass,
			database: config.db.db,
			entities: ['../../../built/models/entities/**/*.js'],
		}),
		NotesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
