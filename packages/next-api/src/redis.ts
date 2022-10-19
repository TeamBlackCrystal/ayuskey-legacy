import Redis from 'ioredis';
import { redisConfig } from './const';

export const redisClient = new Redis(redisConfig)