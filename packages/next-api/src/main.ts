import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './const';

// TODO: まともにする
const port = config.port + 100;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	console.log(`port: ${port}`);
	await app.listen(port);
}
bootstrap();
