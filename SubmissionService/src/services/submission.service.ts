import { getProblemById } from '../api/problem.api';
import { ISubmission, SubmissionStatus } from '../models/submission.model';
import { ISubmissionRepository } from '../repositories/submission.model';
import { BadRequestError, NotFoundError } from '../utils/errors/app.error';

export interface ISubmissionService {
	createSubmission(submission: Partial<ISubmission>): Promise<ISubmission>;
	getSubmissionById(id: string): Promise<ISubmission | null>;
	getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
	deleteSubmissionById(id: string): Promise<boolean>;
	updateSubmissionStatus(
		id: string,
		status: SubmissionStatus
	): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {
	constructor(private readonly submissionRepository: ISubmissionRepository) {}

	async createSubmission(
		submissionData: Partial<ISubmission>
	): Promise<ISubmission> {
		if (!submissionData.problemId) {
			throw new BadRequestError('Problem ID is required');
		}
		const problem = await getProblemById(submissionData.problemId);
		if (!problem) {
			throw new NotFoundError('Problem not found');
		}
		const submission = await this.submissionRepository.createSubmission(
			submissionData
		);
		// TODO: add submission to queue
		return submission;
	}

	async getSubmissionById(id: string): Promise<ISubmission | null> {
		const submission = await this.submissionRepository.findById(id);
		if (!submission) {
			throw new NotFoundError('Submission not found');
		}
		return submission;
	}

	async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
		const submissions = await this.submissionRepository.findByProblemId(
			problemId
		);
		if (submissions.length === 0) {
			throw new NotFoundError('No submissions found for this problem');
		}
		return submissions;
	}

	async deleteSubmissionById(id: string): Promise<boolean> {
		const submission = await this.submissionRepository.findById(id);
		if (!submission) {
			throw new NotFoundError('Submission not found');
		}
		return this.submissionRepository.deleteById(id);
	}

	async updateSubmissionStatus(
		id: string,
		status: SubmissionStatus
	): Promise<ISubmission | null> {
		const submission = await this.submissionRepository.findById(id);
		if (!submission) {
			throw new NotFoundError('Submission not found');
		}
		return this.submissionRepository.updateStatus(id, status);
	}
}
