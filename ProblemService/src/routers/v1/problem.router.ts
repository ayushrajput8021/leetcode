import express from 'express';
import { ProblemController } from '../../controllers/problem.controller';
import { validateRequestBody, validateRequestParams } from '../../validators';
import {
	createProblemSchema,
	findByDifficultySchema,
	findByTitleSchema,
	updateProblemSchema,
} from '../../validators/problem.validator';
import { ProblemService } from '../../services/problem.service';
import { ProblemRepository } from '../../repositories/problem.repository';

const problemRouter = express.Router();

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);
const problemController = new ProblemController(problemService);

problemRouter.post(
	'/',
	validateRequestBody(createProblemSchema),
	problemController.createProblem
);
problemRouter.get(':id', problemController.getProblemById);
problemRouter.get('/', problemController.getAllProblems);
problemRouter.put(
	':id',
	validateRequestBody(updateProblemSchema),
	problemController.updateProblem
);
problemRouter.delete(':id', problemController.deleteProblem);
problemRouter.get(
	'/title/:title',
	validateRequestParams(findByTitleSchema),
	problemController.findProblemsByTitle
);
problemRouter.get(
	'/difficulty/:difficulty',
	validateRequestParams(findByDifficultySchema),
	problemController.findProblemsByDifficulty
);

export default problemRouter;
