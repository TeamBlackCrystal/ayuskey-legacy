import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { Config } from './types';

export const config = yaml.load(
	readFileSync('../../.config/default.yml', 'utf-8'),
) as Config;

export function tryCreateUrl(url: string) {
	try {
		return new URL(url);
	} catch (e) {
		throw `url="${url}" is not a valid URL.`;
	}
}
