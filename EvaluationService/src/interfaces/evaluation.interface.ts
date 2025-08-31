export interface ITestCase {
	_id: string;
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

export interface EvaluationResult {
	status: 'success' | 'time_limit_exceeded' | 'error' | 'failed';
	output: string | undefined;
}
