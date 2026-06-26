import { z } from 'zod';

export const submitAttemptSchema = z.object({
  body: z.object({
    testId: z.string().optional(),
    technologyId: z.string().optional(),
    topicId: z.string().optional(),
    timeSpentSeconds: z.number().int().min(0).optional(),
    answers: z.array(z.object({
      questionId: z.string(),
      selectedOptionId: z.string(),
    })),
  }),
});
