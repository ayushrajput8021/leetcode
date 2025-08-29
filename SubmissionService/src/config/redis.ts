import Redis from 'ioredis';
import logger from './logger.config';
import { serverConfig } from '.';

const redisConfig = {
	url: serverConfig.REDIS_URL,
	maxRetriesPerRequest: null,
	enableReadyCheck: true,
	showFriendlyErrorStack: true,
};

const redisClient = new Redis(redisConfig);

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

redisClient.on('connect', () => logger.info('Connected to Redis'));

/**
 * Create a new Redis connection
 * @returns Redis client
 */
export const createNewRedisConnection = () => new Redis(redisConfig);
