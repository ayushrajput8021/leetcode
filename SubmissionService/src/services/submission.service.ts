import { ISubmission, SubmissionStatus } from '../models/submission.model';
import { ISubmissionRepository } from '../repositories/submission.model';
import { NotFoundError } from '../utils/errors/app.error';

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
		submission: Partial<ISubmission>
	): Promise<ISubmission> {
		// TODO: check if problem exists
		// TODO: add submission to db
		// TODO: add submission to queue
		return this.submissionRepository.createSubmission(submission);
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
