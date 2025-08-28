import { Request, Response } from 'express';

import { IProblem } from '../models/problem.model';
import { ProblemService } from '../services/problem.service';
import { ProblemRepository } from '../repositories/problem.repository';

export interface IProblemController {
	createProblem(req: Request, res: Response): Promise<IProblem>;
	getProblemById(req: Request, res: Response): Promise<IProblem | null>;
	getAllProblems(
		req: Request,
		res: Response
	): Promise<{
		total: number;
		problems: IProblem[];
	}>;
	updateProblem(req: Request, res: Response): Promise<IProblem | null>;
	deleteProblem(req: Request, res: Response): Promise<void>;
	findProblemsByTitle(req: Request, res: Response): Promise<IProblem[]>;
	findProblemsByDifficulty(req: Request, res: Response): Promise<IProblem[]>;
}
const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);

export const ProblemController = {
	async createProblem(req: Request, res: Response): Promise<IProblem> {
		const createdProblem = await problemService.createProblem(req.body);
		res.status(201).json({
			status: true,
			message: 'Problem created successfully',
			data: createdProblem,
		});
		return createdProblem;
	},

	async getProblemById(req: Request, res: Response): Promise<IProblem | null> {
		const id = req.params.id;
		const problem = await problemService.getProblemById(id);
		if (!problem) {
			res.status(404).json({
				status: false,
				message: 'Problem not found',
			});
			return null;
		}
		res.status(200).json({
			status: true,
			message: 'Problem fetched successfully',
			data: problem,
		});
		return problem;
	},

	async getAllProblems(
		req: Request,
		res: Response
	): Promise<{
		total: number;
		problems: IProblem[];
	}> {
		const problems = await problemService.getAllProblems();
		if (problems.total === 0) {
			res.status(404).json({
				status: false,
				message: 'No problems found',
			});
			return { total: 0, problems: [] };
		}
		res.status(200).json({
			status: true,
			message: 'Problems fetched successfully',
			data: problems,
		});
		return problems;
	},

	async updateProblem(req: Request, res: Response): Promise<IProblem | null> {
		const id = req.params.id;
		const problem = await problemService.updateProblem(id, req.body);
		if (!problem) {
			res.status(404).json({
				status: false,
				message: 'Problem not found',
			});
			return null;
		}
		res.status(200).json({
			status: true,
			message: 'Problem updated successfully',
			data: problem,
		});
		return problem;
	},

	async deleteProblem(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		const deleted = await problemService.deleteProblem(id);
		if (!deleted) {
			res.status(404).json({
				status: false,
				message: 'Problem not found',
			});
			return;
		}
		res.status(200).json({
			status: true,
			message: 'Problem deleted successfully',
		});
	},

	async findProblemsByTitle(req: Request, res: Response): Promise<IProblem[]> {
		const title = req.params.title;
		const problems = await problemService.findProblemsByTitle(title);
		if (problems.length === 0) {
			res.status(404).json({
				status: false,
				message: 'No problems found',
			});
			return [];
		}
		res.status(200).json({
			status: true,
			message: 'Problems fetched successfully',
			data: problems,
		});
		return problems;
	},

	async findProblemsByDifficulty(
		req: Request,
		res: Response
	): Promise<IProblem[]> {
		const difficulty = req.params.difficulty;
		const problems = await problemService.findProblemsByDifficulty(difficulty);
		res.status(200).json({
			status: true,
			message: 'Problems fetched successfully',
			data: problems,
		});
		return problems;
	},
};
