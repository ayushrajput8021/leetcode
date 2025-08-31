import { PYTHON_IMAGE } from '../constants';
import { createNewDockerContainer } from './createContainer.util';

import { commands } from './commands.util';

export interface RunCodeOptions {
	code: string;
	language: 'python' | 'cpp' | 'java';
	timeout: number;
}

export async function runCode(options: RunCodeOptions) {
	const { code, language, timeout } = options;

	const timeLimitExceededTimeout = setTimeout(() => {
		console.log('Time limit exceeded');
		container?.kill();

		return;
	}, timeout);

	const container = await createNewDockerContainer({
		imageName: PYTHON_IMAGE,
		cmdExecutable: commands[language](code),
		memoryLimit: 1024 * 1024 * 1024,
	});
	await container?.start();

	const status = await container?.wait();

	const logs = await container?.logs({
		stderr: true,
		stdout: true,
	});
	console.log('Logs: ', logs?.toString());
	await container?.remove();
	clearTimeout(timeLimitExceededTimeout);
	if (status?.StatusCode == 0) {
		console.log('container killed due to timeout');
	} else {
		console.log('container killed due to error');
	}
}
