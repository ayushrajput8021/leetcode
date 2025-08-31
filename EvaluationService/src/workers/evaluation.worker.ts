import { Job, Worker } from 'bullmq';
import { SUBMISSION_QUEUE } from '../utils/constants';
import logger from '../config/logger.config';
import { createNewRedisConnection } from '../config/redis.config';
import {
	EvaluationJobData,
	EvaluationResult,
	ITestCase,
} from '../interfaces/evaluation.interface';
import { runCode } from '../utils/containers/codeRunner.util';
import { LANGUAGE_CONFIG } from '../config/language.config';
import { updateSubmissionStatus } from '../api/submission.api';


function matchTestCasesWithResults(
	testCases: ITestCase[],
	results: EvaluationResult[]
) {
	const output: Record<string, string> = {};
	if (results.length !== testCases.length) {
		console.log('WA');
		return;
	}
	testCases.map((testCase, index) => {
		let retval = '';
		if (results[index].status === 'time_limit_exceeded') {
			retval = 'TLE';
		} else if (results[index].status === 'failed') {
			retval = 'Error';
		} else {
			// match the output with the test case output
			if (results[index].output === testCase.output) {
				retval = 'AC';
			} else {
				retval = 'WA';
			}
		}

		output[testCase._id] = retval;
	});

	return output;
}
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

				const output = matchTestCasesWithResults(
					data.problem.testCases,
					testCasesResults
				);
				console.log('Output: ', output);
				await updateSubmissionStatus(data.submissionId, 'completed', output as Record<string, string>);
				return output;
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
