import { submissionQueue } from '../src/queues/submission.queue';
import { IProblemDetails } from '../src/api/problem.api';
import { SubmissionLanguage } from '../src/models/submission.model';
import logger from '../src/config/logger.config';

export interface ISubmissionJob {
	submissionId: string;
	problem: IProblemDetails;
	code: string;
	language: SubmissionLanguage;
}

export async function addSubmissionToQueue(
	submissionJob: ISubmissionJob
): Promise<string | null> {
	try {
		const job = await submissionQueue.add('evaluate-submission', submissionJob);
		logger.info(`Submission job ${job.id} added to queue`);
		return job.id || null;
	} catch (error) {
		logger.error('Error adding submission to queue', error);
		return null;
	}
}
