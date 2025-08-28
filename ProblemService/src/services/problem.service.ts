import { IProblem } from '../models/problem.model';
import { CreateProblemDto, UpdateProblemDto } from '../dtos/problem.dto';
import { IProblemRepository } from '../repositories/problem.repository';
import { BadRequestError, NotFoundError } from '../utils/errors/app.error';
import { sanitizeMarkdown } from '../utils/markdown.sanitize';

export interface IProblemService {
	createProblem(problem: CreateProblemDto): Promise<IProblem>;
	getProblemById(id: string): Promise<IProblem | null>;
	getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
	updateProblem(
		id: string,
		problem: UpdateProblemDto
	): Promise<IProblem | null>;
	deleteProblem(id: string): Promise<boolean>;
	findProblemsByTitle(title: string): Promise<IProblem[]>;
	findProblemsByDifficulty(difficulty: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
	private problemRepository: IProblemRepository;
	constructor(problemRepository: IProblemRepository) {
		this.problemRepository = problemRepository; // Dependency Injection
	}

	async createProblem(problem: CreateProblemDto): Promise<IProblem> {
		const sanitizedProblem = {
			...problem,
			description: await sanitizeMarkdown(problem.description),
			editorial:
				problem.editorial && (await sanitizeMarkdown(problem.editorial)),
		};
		return this.problemRepository.createProblem(sanitizedProblem);
	}

	async getProblemById(id: string): Promise<IProblem | null> {
		const problem = await this.problemRepository.getProblemById(id);
		if (!problem) {
			throw new NotFoundError('Problem not found');
		}
		return problem;
	}

	async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
		return this.problemRepository.getAllProblems();
	}

	async updateProblem(
		id: string,
		problem: UpdateProblemDto
	): Promise<IProblem | null> {
		const existingProblem = await this.problemRepository.getProblemById(id);
		if (!existingProblem) {
			throw new NotFoundError('Problem not found');
		}
		const sanitizedProblem: Partial<IProblem> = {
			...problem,
		};
		if (problem.description) {
			sanitizedProblem.description = await sanitizeMarkdown(
				problem.description
			);
		}
		if (problem.editorial) {
			sanitizedProblem.editorial = await sanitizeMarkdown(
				problem.editorial
			);
		}
		return this.problemRepository.updateProblem(id, sanitizedProblem);
	}

	async deleteProblem(id: string): Promise<boolean> {
		const existingProblem = await this.problemRepository.getProblemById(id);
		if (!existingProblem) {
			throw new NotFoundError('Problem not found');
		}
		return this.problemRepository.deleteProblem(id);
	}

	async findProblemsByTitle(title: string): Promise<IProblem[]> {
		if (!title) {
			throw new BadRequestError('Title is required');
		}
		const problems = await this.problemRepository.findProblemsByTitle(title);
		if (problems.length === 0) {
			throw new NotFoundError('No problems found');
		}
		return problems;
	}

	async findProblemsByDifficulty(difficulty: string): Promise<IProblem[]> {
		const problems = await this.problemRepository.findProblemsByDifficulty(
			difficulty
		);
		if (problems.length === 0) {
			throw new NotFoundError('No problems found');
		}
		return problems;
	}
}
