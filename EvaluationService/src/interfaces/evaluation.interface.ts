export interface ITestCase {
	input: string;
	output: string;
}

export interface IProblemDetails {
	id: string;
	title: string;
	description: string;
	difficulty: string;
	editorial?: string;
	testCases: ITestCase[];
	createdAt: Date;
	updatedAt: Date;
}
export interface EvaluationJobData {
	submissionId: string;
	code: string;
	language: 'python' | 'cpp';
	problem: IProblemDetails;
	timeout: number;
}
