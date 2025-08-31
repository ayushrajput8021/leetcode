import {
	ISubmission,
	ISubmissionData,
	SubmissionStatus,
	Submission,
} from '../models/submission.model';

export interface ISubmissionRepository {
	createSubmission(submission: Partial<ISubmission>): Promise<ISubmission>;
	findById(id: string): Promise<ISubmission | null>;
	findByProblemId(problemId: string): Promise<ISubmission[]>;
	deleteById(id: string): Promise<boolean>;
	updateStatus(
		id: string,
		status: SubmissionStatus,
		submissionData: ISubmissionData
	): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {
	async createSubmission(
		submission: Partial<ISubmission>
	): Promise<ISubmission> {
		const newSubmission = new Submission(submission);
		return newSubmission.save();
	}

	async findById(id: string): Promise<ISubmission | null> {
		return Submission.findById(id).lean();
	}

	async findByProblemId(problemId: string): Promise<ISubmission[]> {
		return Submission.find({ problemId }).lean();
	}

	async deleteById(id: string): Promise<boolean> {
		const result = await Submission.deleteOne({ _id: id });
		return result.deletedCount > 0;
	}

	async updateStatus(
		id: string,
		status: SubmissionStatus,
		submissionData: ISubmissionData
	): Promise<ISubmission | null> {
		return Submission.findByIdAndUpdate(
			id,
			{ status, submissionData },
			{ new: true }
		).lean();
	}
}
