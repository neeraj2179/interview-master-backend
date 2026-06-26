import { z } from 'zod';

export const getQuestionsSchema = z.object({
  query: z.object({
    technologyId: z.string().optional(),
    topicId: z.string().optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
