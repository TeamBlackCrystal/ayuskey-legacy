import Redis from 'ioredis';
import { config } from './const';
import {tryCreateUrl} from '../../../built/config'

const url = tryCreateUrl(config.url);

export const redisClient = new Redis({
    path: config.redis.path,
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.pass,
    db: config.redis.db,
    family: config.redis.family,
    keyPrefix: `${config.redis.prefix ? config.redis.prefix : url.host}:`
})