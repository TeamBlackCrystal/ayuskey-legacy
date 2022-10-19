import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './const';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RedocOptions, RedocModule } from '@nicholas.braun/nestjs-redoc'
import { Logger } from 'nestjs-pino';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';


async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter()
	);
	const logger = app.get(Logger);
	app.useLogger(logger);
	app.setGlobalPrefix('/api/v2')


	app.useStaticAssets({
		root: join(__dirname, '..', 'public'),
		prefix: '/public/',
	});

	app.setViewEngine({
		engine: {
			handlebars: require('handlebars'),
		},
		templates: join(__dirname, '..', 'views'),
	});

	const options = new DocumentBuilder()
		.setTitle('Ayuskey Next API')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document)

	logger.log(`port: ${config.port}`);
	await app.listen(config.port, '0.0.0.0');
}
bootstrap();
