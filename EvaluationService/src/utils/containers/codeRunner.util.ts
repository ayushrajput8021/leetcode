import { CPP_IMAGE, PYTHON_IMAGE } from '../constants';
import { createNewDockerContainer } from './createContainer.util';

import { commands } from './commands.util';

export interface RunCodeOptions {
	code: string;
	language: 'python' | 'cpp' | 'java';
	timeout: number;
	input: string;
}

export async function runCode(options: RunCodeOptions) {
	const { code, language, timeout, input } = options;

	const timeLimitExceededTimeout = setTimeout(() => {
		console.log('Time limit exceeded');
		container?.kill();

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

	const logs = await container?.logs({
		stderr: true,
		stdout: true,
	});

	const sampleOutput = '8';
	const containerLogs = processLogs(logs);
	console.log('Container Logs: ', containerLogs);
	console.log('Sample Output: ', containerLogs === sampleOutput);
	await container?.remove();
	clearTimeout(timeLimitExceededTimeout);
	if (status?.StatusCode == 0) {
		console.log('container killed due to timeout');
	} else {
		console.log('container killed due to error');
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
