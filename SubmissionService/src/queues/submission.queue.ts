import { Queue } from 'bullmq';

import { createNewRedisConnection } from '../config/redis';
import logger from '../config/logger.config';

export const submissionQueue = new Queue('submission', {
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
