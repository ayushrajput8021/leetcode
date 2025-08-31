import { CPP_IMAGE, PYTHON_IMAGE } from '../constants';
import { createNewDockerContainer } from './createContainer.util';
import { EvaluationResult } from '../../interfaces/evaluation.interface';
import { commands } from './commands.util';

export interface RunCodeOptions {
	code: string;
	language: 'python' | 'cpp' | 'java';
	timeout: number;
	input: string;
}

export async function runCode(
	options: RunCodeOptions
): Promise<EvaluationResult> {
	const { code, language, timeout, input } = options;

	let isTimeLimitExceeded = false;
	const timeLimitExceededTimeout = setTimeout(() => {
		isTimeLimitExceeded = true;
		console.log('Time limit exceeded');

		container?.stop();

		container?.remove({ force: true });
		return;
	}, timeout);

	const container = await createNewDockerContainer({
		imageName:
			language === 'python'
				? PYTHON_IMAGE
				: language === 'cpp'
				? CPP_IMAGE
				: '',
		cmdExecutable: commands[language](code, input),
		memoryLimit: 1024 * 1024 * 1024,
	});
	await container?.start();

	const status = await container?.wait();

	if (isTimeLimitExceeded) {
		return {
			status: 'time_limit_exceeded',
			output: 'Time limit exceeded',
		};
	}

	const logs = await container?.logs({
		stderr: true,
		stdout: true,
	});

	const containerLogs = processLogs(logs);

	await container?.remove({ force: true });

	clearTimeout(timeLimitExceededTimeout);
	if (status?.StatusCode == 0) {
		return {
			status: 'success',
			output: containerLogs,
		};
	} else {
		return {
			status: 'failed',
			output: containerLogs,
		};
	}
}

function processLogs(logs: Buffer | undefined) {
	return logs
		?.toString()
		.replace(/\x00/g, '')
		.replace(/\x1b\[[0-9;]*m/g, '')
		.replace(/[\x00-\x1f-]/g, '')
		.replace(/\n/g, '')
		.replace(/\r/g, '')
		.trim();
}
