import { Job, Worker } from 'bullmq';
import { SUBMISSION_QUEUE } from '../utils/constants';
import logger from '../config/logger.config';
import { createNewRedisConnection } from '../config/redis.config';
import { EvaluationJobData } from '../interfaces/evaluation.interface';
import { runCode } from '../utils/containers/codeRunner.util';
import { LANGUAGE_CONFIG } from '../config/language.config';

async function setupEvaluationWorker() {
	const evaluationWorker = new Worker(
		SUBMISSION_QUEUE,
		async (job: Job) => {
			logger.info(
				`Evaluation worker started for job ${job.id} with data ${job.data}`
			);
			// return 'Evaluation worker started';
			const data: EvaluationJobData = job.data;
			console.log('Data: ', data);

			try {
				const testCasesRunnerPromises = data.problem.testCases.map(
					async (testCase) => {
						return await runCode({
							code: data.code,
							language: data.language,
							timeout: LANGUAGE_CONFIG[data.language].timeout,
							input: testCase.input,
						});
					}
				);
				const testCasesResults = await Promise.all(testCasesRunnerPromises);


				console.log('Result: ', testCasesResults);
				return testCasesResults;
			} catch (error) {
				logger.error('Error running code', error);
			}
		},
		{
			connection: createNewRedisConnection(),
		}
	);

	evaluationWorker.on('error', (error) => {
		logger.error('Evaluation worker error', error);
	});

	evaluationWorker.on('completed', (job: Job) => {
		logger.info(`Evaluation worker completed for job ${job.id}`);
	});

	evaluationWorker.on('failed', (job: Job | undefined, error: Error) => {
		logger.error(
			`Evaluation worker failed for job ${job?.id} with error ${error}`
		);
	});
}

export async function setupWorkers() {
	await setupEvaluationWorker();
	logger.info('Workers started successfully');
}
