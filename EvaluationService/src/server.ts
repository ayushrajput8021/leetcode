import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import {
	appErrorHandler,
	genericErrorHandler,
} from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { redisClient } from './config/redis.config';
import { setupWorkers } from './workers/evaluation.worker';
import { pullAllImages } from './utils/containers/pullImage.util';

const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
	logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
	logger.info(`Press Ctrl+C to stop the server.`);
	await redisClient.ping();
	await setupWorkers();
	await pullAllImages();
	// await testCodeRunner();
	// await testCPPCodeRunner();
});

// async function testCodeRunner() {
// 	const code = `
// for i in range(10):
//    import time
//    time.sleep(10)
//    print(i * 2, "Hello, World")
// 	`;
// 	await runCode({ code, language: 'python', timeout: 1000, input: '' });
// }

// async function testCPPCodeRunner() {
// 	const code = `
// #include <iostream>
// using namespace std;
// int main() {
//   int n;
//   cin >> n;
//   for (int i = 0; i < n; i++) {
//     cout << i * 2 << endl;
//   }
// 	return 0;
// }
// 	`;
// 	await runCode({ code, language: 'cpp', timeout: 1000, input: '5' });
// }
