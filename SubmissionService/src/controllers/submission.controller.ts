import { Request, Response } from 'express';

import { SubmissionService } from '../services/submission.service';
import { SubmissionRepository } from '../repositories/submission.model';

export interface ISubmissionController {
	createSubmission(req: Request, res: Response): Promise<void>;
	getSubmissionById(req: Request, res: Response): Promise<void>;
	getSubmissionsByProblemId(req: Request, res: Response): Promise<void>;
	deleteSubmissionById(req: Request, res: Response): Promise<void>;
	updateSubmissionStatus(req: Request, res: Response): Promise<void>;
}

const submissionService = new SubmissionService(new SubmissionRepository());
export const SubmissionController: ISubmissionController = {
	async createSubmission(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.createSubmission(req.body);
		res.status(201).json({
			status: true,
			message: 'Submission created successfully',
			submission,
		});
	},

	async getSubmissionById(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.getSubmissionById(req.params.id);

		res.status(200).json({
			status: true,
			message: 'Submission fetched successfully',
			submission,
		});
	},

	async getSubmissionsByProblemId(req: Request, res: Response): Promise<void> {
		const submissions = await submissionService.getSubmissionsByProblemId(
			req.params.id
		);
		res.status(200).json({
			status: true,
			message: 'Submissions fetched successfully',
			submissions,
		});
	},

	async deleteSubmissionById(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.deleteSubmissionById(
			req.params.id
		);
		res.status(200).json({
			status: true,
			message: 'Submission deleted successfully',
			submission,
		});
	},

	async updateSubmissionStatus(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.updateSubmissionStatus(
			req.params.id,
			req.body.status,
			req.body.submissionData
		);
		res.status(200).json({
			status: true,
			message: 'Submission status updated successfully',
			submission,
		});
	},
};
