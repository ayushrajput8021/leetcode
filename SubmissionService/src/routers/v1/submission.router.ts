import express from 'express';
import { SubmissionController } from '../../controllers/submission.controller';
import { validateRequestBody } from '../../validators';
import { createSubmissionSchema } from '../../validators/submission.validator';

const submissionRouter = express.Router();

submissionRouter.post(
	'/',
	validateRequestBody(createSubmissionSchema),
	SubmissionController.createSubmission
);

submissionRouter.get('/:id', SubmissionController.getSubmissionById);

submissionRouter.get(
	'/problem/:id',
	SubmissionController.getSubmissionsByProblemId
);

submissionRouter.delete('/:id', SubmissionController.deleteSubmissionById);

submissionRouter.patch('/:id', SubmissionController.updateSubmissionStatus);
submissionRouter.get('/health', (req, res) => {
	res.status(200).send('OK');
});

export default submissionRouter;
