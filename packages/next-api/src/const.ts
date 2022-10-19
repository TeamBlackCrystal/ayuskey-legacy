import { Config, tryCreateUrl } from '@ayuskey/shared';
import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';

export const config = yaml.load(
	readFileSync('../../.config/default.yml', 'utf-8'),
) as Config;

config.port = config.port + 100

const url = tryCreateUrl(config.url);

export const redisConfig = {
	path: config.redis.path,
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.pass,
    db: config.redis.db,
    family: config.redis.family,
    keyPrefix: `${config.redis.prefix ? config.redis.prefix : url.host}:`
}