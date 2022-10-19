import { Controller, Get, Header, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import { config } from './const';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('/redoc')
	@Render('redoc.handlebars')
	@Header(
		'Content-Security-Policy',
		"default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; child-src * 'unsafe-inline' 'unsafe-eval' blob:; worker-src * 'unsafe-inline' 'unsafe-eval' blob:; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';",
	)
	@ApiExcludeEndpoint()
	getDocs() {
		return {
			data: {
			  docUrl: `http://${config.host ? config.host : 'localhost'}:${config.port}/api-json`,
			//   favicon: '/public/icon.svg',
			  options: JSON.stringify({
				theme: {
				  logo: {
					gutter: '15px',
				  },
				},
				sortPropsAlphabetically: true,
				hideDownloadButton: false,
				hideHostname: false,
				noAutoAuth: true,
				pathInMiddlePanel: true,
			  }),
			},
		  };
	}
}
