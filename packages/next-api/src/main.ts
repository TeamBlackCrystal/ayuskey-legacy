import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { Config } from '../../../built/config/types';

const config = yaml.load(
	readFileSync('../../.config/default.yml', 'utf-8'),
) as Config;

// TODO: まともにする
const port = config.port + 100;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	console.log(`port: ${port}`);
	await app.listen(port);
}
bootstrap();
