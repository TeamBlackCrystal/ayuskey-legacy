import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { Config } from '../../../built/config/types';

export const config = yaml.load(
	readFileSync('../../.config/default.yml', 'utf-8'),
) as Config;
