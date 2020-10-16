import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';
import fetch from 'node-fetch';
import { httpAgent, httpsAgent } from './fetch';
import { AbortController } from 'abort-controller';
import * as ContentDisposition from 'content-disposition';
import config from '../config';
import * as chalk from 'chalk';
import Logger from '../services/logger';
import { TimeoutStream } from './timeout-stream';

const pipeline = util.promisify(stream.pipeline);

export async function downloadUrl(url: string, path: string) {
	const wholeOperationTimeout = 300 * 1000;
	const responseTimeout = 10 * 1000;
	const readTimeout = 10 * 1000;

	const logger = new Logger('download-url');

	logger.info(`Downloading ${chalk.cyan(url)} ...`);

	const controller = new AbortController();
	setTimeout(() => {
		controller.abort();
	}, wholeOperationTimeout);

	const response = await fetch(new URL(url).href, {
		headers: {
			'User-Agent': config.userAgent
		},
		timeout: responseTimeout,
		size: config.maxFileSize || 262144000,
		signal: controller.signal,
		agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent,
	});

	if (!response.ok) {
		logger.error(`Got ${response.status} (${url})`);
		throw response.status;
	}

	// Content-Lengthがあればとっておく
	const contentLength = response.headers.get('content-length');
	const expectedLength = contentLength != null ? Number(contentLength) : null;

	await pipeline(
		response.body,
		new TimeoutStream(readTimeout, () => controller.abort()),
		fs.createWriteStream(path)
	);

	// 可能ならばサイズ比較
	const actualLength = (await util.promisify(fs.stat)(path)).size;

	if (response.headers.get('content-encoding') == null && expectedLength != null && expectedLength !== actualLength) {
		throw `size error: expected: ${expectedLength}, but got ${actualLength}`;
	}

	logger.succ(`Download finished: ${chalk.cyan(url)}`);

	let filename: string | null = null;
	try {
		const contentDisposition = response.headers.get('content-disposition');
		if (contentDisposition) {
			const cd = ContentDisposition.parse(contentDisposition);
			if (cd.parameters?.filename) filename = cd.parameters.filename;
		}
	} catch { }

	return {
		filename,
		url: response.url
	};
}
