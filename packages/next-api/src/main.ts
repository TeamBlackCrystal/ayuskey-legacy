import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './const';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RedocOptions, RedocModule } from '@nicholas.braun/nestjs-redoc'
import { Logger } from 'nestjs-pino';

// TODO: まともにする
const port = config.port + 100;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(app.get(Logger));
	app.setGlobalPrefix('/api/v2')
	const options = new DocumentBuilder()
		.setTitle('Ayuskey Next API')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	const redocOptions: RedocOptions = {
		title: 'Ayuskey Next API Doc',
		sortPropsAlphabetically: true,
		hideDownloadButton: false,
		hideHostname: false,

	};
	SwaggerModule.setup('/docs', app, document)
	await RedocModule.setup('/redoc', app, document, redocOptions);
	console.log(`port: ${port}`);
	await app.listen(port);
}
bootstrap();
