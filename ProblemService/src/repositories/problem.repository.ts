import { Problem, IProblem } from '../models/problem.model';

export interface IProblemRepository {
	createProblem(problem: Partial<IProblem>): Promise<IProblem>;
	getProblemById(id: string): Promise<IProblem | null>;
	getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
	updateProblem(
		id: string,
		problem: Partial<IProblem>
	): Promise<IProblem | null>;
	deleteProblem(id: string): Promise<boolean>;
	findProblemsByDifficulty(difficulty: string): Promise<IProblem[]>;
	findProblemsByTitle(title: string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository {
	async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
		return Problem.create(problem);
	}

	async getProblemById(id: string): Promise<IProblem | null> {
		return Problem.findById(id);
	}

	async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
		const [problems, total] = await Promise.all([
			Problem.find().sort({ createdAt: -1 }),
			Problem.countDocuments(),
		]);
		return { problems, total };
	}

	async updateProblem(
		id: string,
		problem: Partial<IProblem>
	): Promise<IProblem | null> {
		return Problem.findByIdAndUpdate(id, problem, { new: true });
	}

	async deleteProblem(id: string): Promise<boolean> {
		const result = await Problem.findByIdAndDelete(id);
		return result !== null;
	}

	async findProblemsByTitle(title: string): Promise<IProblem[]> {
		return Problem.find({ title: { $regex: title, $options: 'i' } }).sort({
			createdAt: -1,
		});
	}

	async findProblemsByDifficulty(difficulty: string): Promise<IProblem[]> {
		return Problem.find({ difficulty }).sort({ createdAt: -1 });
	}
}
