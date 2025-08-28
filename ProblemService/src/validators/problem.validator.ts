import { z } from 'zod';

export const createProblemSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	editorial: z.string().optional(),
	difficulty: z.enum(['easy', 'medium', 'hard']),
	testCases: z
		.array(
			z.object({
				input: z.string().min(1),
				output: z.string().min(1),
			})
		)
		.optional(),
});

export const updateProblemSchema = createProblemSchema.partial();

export const findByDifficultySchema = z.object({
	difficulty: z.enum(['easy', 'medium', 'hard']),
});

export const findByTitleSchema = z.object({
	title: z.string().min(1),
});
export type CreateProblemDto = z.infer<typeof createProblemSchema>;
export type UpdateProblemDto = z.infer<typeof updateProblemSchema>;
