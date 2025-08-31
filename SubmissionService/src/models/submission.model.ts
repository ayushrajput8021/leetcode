import { Document, Schema, model } from 'mongoose';

export enum SubmissionStatus {
	COMPLETED = 'completed',
	PENDING = 'pending',
}

export enum SubmissionLanguage {
	PYTHON = 'python',
	JAVA = 'java',
	CPP = 'cpp',
}
export interface ISubmissionData {
	status: string;
	testCaseId: string;
}
export interface ISubmission extends Document {
	problemId: string;
	code: string;
	language: SubmissionLanguage;
	status: SubmissionStatus;
	createdAt: Date;
	updatedAt: Date;
	submissionData: ISubmissionData;
}

export const SubmissionSchema = new Schema<ISubmission>(
	{
		problemId: { type: String, required: true, trim: true },
		code: {
			type: String,
			required: [true, 'Code is required for evaluation'],
			trim: true,
		},
		language: {
			type: String,
			required: [true, 'Language is required'],
			enum: Object.values(SubmissionLanguage),
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(SubmissionStatus),
			default: SubmissionStatus.PENDING,
			trim: true,
		},
		submissionData: {
			type: Object,
			required: true,
			default: {},
		},
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: (_, ret) => {
				delete (ret as any).__v;
				ret.id = ret._id;
				delete (ret as any)._id;
				return ret;
			},
		},
	}
);

SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ createdAt: -1 });

export const Submission = model<ISubmission>('Submission', SubmissionSchema);
