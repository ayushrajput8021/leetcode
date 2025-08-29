import { z } from 'zod';
import { SubmissionLanguage } from '../models/submission.model';

export const createSubmissionSchema = z.object({
	problemId: z.string(),
	code: z.string(),
	language: z.nativeEnum(SubmissionLanguage),
});

export type CreateSubmissionDto = z.infer<typeof createSubmissionSchema>;
