import * as redis from 'redis';
import config from '../config';

export function createConnection() {
	if (!config.redis.url) { 
		return redis.createClient(
			config.redis.port,
			config.redis.host,
			{
				password: config.redis.pass,
				prefix: config.redis.prefix,
				db: config.redis.db || 0
			}
		);
	} else {
		return redis.createClient(
			config.redis.url,
			{
				password: config.redis.pass,
				prefix: config.redis.prefix,
				db: config.redis.db || 0
			}
		);
	}
}

export const subsdcriber = createConnection();
subsdcriber.subscribe(config.host);

export const redisClient = createConnection();
