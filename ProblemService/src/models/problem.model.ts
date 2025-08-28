import mongoose from 'mongoose';

export interface ITestCase {
	input: string;
	output: string;
}

export interface IProblem extends Document {
	title: string;
	description: string;
	difficulty: 'easy' | 'medium' | 'hard';
	editorial?: string;
	createdAt: Date;
	updatedAt: Date;
	testCases: ITestCase[];
}

const testCaseSchema = new mongoose.Schema({
	input: { type: String, required: true, trim: true },
	output: { type: String, required: true, trim: true },
});

const problemSchema = new mongoose.Schema<IProblem>(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			max: [100, 'Title must be less than 100 characters'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			trim: true,
		},
		difficulty: {
			type: String,
			required: [true, 'Difficulty is required'],
			enum: {
				values: ['easy', 'medium', 'hard'],
				message: 'Difficulty must be either easy, medium, or hard',
			},
			default: 'easy',
		},
		editorial: {
			type: String,
			required: false,
			trim: true,
		},
		testCases: {
			type: [testCaseSchema],
			required: [true, 'Test cases are required'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);
