import axios, { AxiosResponse } from 'axios';
import { serverConfig } from '../config';
import { InternalServerError } from '../utils/errors/app.error';
import logger from '../config/logger.config';

export async function updateSubmissionStatus(
	submissionId: string,
	status: string,
	submissionData: Record<string, string>
) {
	try {
		const response: AxiosResponse = await axios.patch(
			`${serverConfig.SUBMISSION_SERVICE_URL}/submissions/${submissionId}`,
			{
				status,
				submissionData,
			}
		);

		if (response.status !== 200) {
			throw new InternalServerError(response.statusText);
		}
		console.log('Submission status updated successfully', response.data);
		return;
	} catch (error) {
		logger.error(
			`Error fetching problem details: ${JSON.stringify(error, null, 2)}`
		);
		return null;
	}
}
