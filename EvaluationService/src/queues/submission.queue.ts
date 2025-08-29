import { Queue } from 'bullmq';

import { createNewRedisConnection } from '../config/redis.config';
import logger from '../config/logger.config';
import { SUBMISSION_QUEUE } from '../utils/constants';

export const submissionQueue = new Queue(SUBMISSION_QUEUE, {
	connection: createNewRedisConnection(),
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: 'exponential',
			delay: 1000,
		},
	},
});

submissionQueue.on('error', (error) => {
	logger.error('Submission Queue Error', error);
});

submissionQueue.on('waiting', (job) => {
	logger.info(`Submission Job ${job.id} is waiting`);
});
