import Redis, { RedisOptions } from 'ioredis';
import logger from './logger.config';
import { serverConfig } from './index';

const redisConfig: RedisOptions = {
	host: serverConfig.REDIS_HOST,
	port: serverConfig.REDIS_PORT,
	maxRetriesPerRequest: null,
	retryStrategy: (times: number) => {
		if (times > 3) {
			return null;
		}
		return Math.min(times * 50, 1000);
	},
};

export const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => logger.info('Connected to Redis'));

redisClient.on('end', () => logger.info('Redis connection closed'));

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

/**
 * Create a new Redis connection
 * @returns Redis client
 */
export const createNewRedisConnection = () => new Redis(redisConfig);
