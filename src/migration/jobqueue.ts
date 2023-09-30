import config from "@/config";
import * as Queue from "bull";

const queueRedisConf: Queue.QueueOptions = {
	redis: {
		port: config.redis.port,
		host: config.redis.host,
		password: config.redis.pass,
	},
	prefix: "ayuskey_next",
	limiter: {
		max: 1000,
		duration: 1000,
	},
};
export const hashtagQueue = new Queue("hashtag", queueRedisConf);
export const instanceQueue = new Queue("instance", queueRedisConf);
export const noteQueue = new Queue("note", queueRedisConf);
export const usedUsernameQueue = new Queue("used username", queueRedisConf);
export const driveFileQueue = new Queue("drive file", queueRedisConf);
export const userQueue = new Queue("user", queueRedisConf);
export const userAfterHookQueue = new Queue("user after hook", queueRedisConf);

export const queues = [hashtagQueue, instanceQueue, noteQueue, usedUsernameQueue, driveFileQueue, userQueue, userAfterHookQueue];
