import { PYTHON_IMAGE } from '../constants';
import { createNewDockerContainer } from './createContainer.util';
import logger from '../../config/logger.config';

export async function runPythonCode(code: string) {
	const runCommand = `echo '${code}' > code.py && python3 code.py`;
	const container = await createNewDockerContainer({
		imageName: PYTHON_IMAGE,
		cmdExecutable: ['/bin/sh', '-c', runCommand],
		memoryLimit: 1024 * 1024 * 1024,
	});
	await container?.start();
	logger.info('Python code tested successfully');

	const status = await container?.wait();
	logger.info('Status: ', status);
	const logs = await container?.logs({
		stderr: true,
		stdout: true,
	});
	console.log('Logs: ', logs?.toString());
	await container?.remove();
}
