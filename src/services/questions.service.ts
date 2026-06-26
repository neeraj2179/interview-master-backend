import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';

export class QuestionsService {
  static async getAll(params: any) {
    const { technologyId, topicId, difficulty, page = 1, limit = 10 } = params;
    
    const where: Prisma.QuestionWhereInput = {};
    if (technologyId) where.technologyId = technologyId;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        where, skip, take,
        include: {
          options: true,
          technology: { select: { id: true, name: true } },
          topic: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.question.count({ where }),
    ]);

    return {
      items,
      meta: {
        total, page: Number(page), limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  static async getById(id: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        options: true,
        technology: { select: { id: true, name: true } },
        topic: { select: { id: true, name: true } },
      },
    });
    if (!question) throw { status: 404, message: 'Question not found' };
    return question;
  }
}
