import { Request, Response } from 'express';
import { ISubmission } from '../models/submission.model';
import { SubmissionService } from '../services/submission.service';
import { SubmissionRepository } from '../repositories/submission.model';

export interface ISubmissionController {
	createSubmission(req: Request, res: Response): Promise<ISubmission>;
	getSubmissionById(req: Request, res: Response): Promise<ISubmission | null>;
	getSubmissionsByProblemId(
		req: Request,
		res: Response
	): Promise<ISubmission[]>;
	deleteSubmissionById(req: Request, res: Response): Promise<boolean | null>;
	updateSubmissionStatus(
		req: Request,
		res: Response
	): Promise<ISubmission | null>;
}

const submissionService = new SubmissionService(new SubmissionRepository());
export const SubmissionController: ISubmissionController = {
	async createSubmission(req: Request, res: Response): Promise<ISubmission> {
		const submission = await submissionService.createSubmission(req.body);
		res.status(201).json(submission);
		return submission;
	},

	async getSubmissionById(
		req: Request,
		res: Response
	): Promise<ISubmission | null> {
		const submission = await submissionService.getSubmissionById(req.params.id);

		res.status(200).json(submission);
		return submission;
	},

	async getSubmissionsByProblemId(
		req: Request,
		res: Response
	): Promise<ISubmission[]> {
		const submissions = await submissionService.getSubmissionsByProblemId(
			req.params.id
		);
		res.status(200).json(submissions);
		return submissions;
	},

	async deleteSubmissionById(
		req: Request,
		res: Response
	): Promise<boolean | null> {
		const submission = await submissionService.deleteSubmissionById(
			req.params.id
		);
		res.status(200).json(submission);
		return submission;
	},

	async updateSubmissionStatus(
		req: Request,
		res: Response
	): Promise<ISubmission | null> {
		const submission = await submissionService.updateSubmissionStatus(
			req.params.id,
			req.body.status
		);
		res.status(200).json(submission);
		return submission;
	},
};
