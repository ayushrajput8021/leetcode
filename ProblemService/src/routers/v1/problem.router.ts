import express from 'express';
import { ProblemController } from '../../controllers/problem.controller';
import { validateRequestBody, validateRequestParams } from '../../validators';
import {
	createProblemSchema,
	findByDifficultySchema,
	findByTitleSchema,
	updateProblemSchema,
} from '../../validators/problem.validator';

const problemRouter = express.Router();

problemRouter.post(
	'/',
	validateRequestBody(createProblemSchema),
	ProblemController.createProblem
);
problemRouter.get('/', ProblemController.getAllProblems);
problemRouter.get('/:id', ProblemController.getProblemById);
problemRouter.put(
	':id',
	validateRequestBody(updateProblemSchema),
	ProblemController.updateProblem
);
problemRouter.delete(':id', ProblemController.deleteProblem);
problemRouter.get(
	'/title/:title',
	validateRequestParams(findByTitleSchema),
	ProblemController.findProblemsByTitle
);
problemRouter.get(
	'/difficulty/:difficulty',
	validateRequestParams(findByDifficultySchema),
	ProblemController.findProblemsByDifficulty
);

export default problemRouter;
