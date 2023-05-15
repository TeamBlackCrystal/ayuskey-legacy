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
		max: 100000,
		duration: 100,
	},
};
export const userKeypairQueue = new Queue("user keypair", queueRedisConf);
export const hashtagQueue = new Queue("hashtag", queueRedisConf);

export const queues = [userKeypairQueue, hashtagQueue];
