import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';

export class TestsService {
  static async getAll(technologyId?: string) {
    const where: Prisma.TestWhereInput = {};
    if (technologyId) where.technologyId = technologyId;

    return prisma.test.findMany({
      where,
      include: {
        technology: { select: { id: true, name: true, slug: true } },
        _count: { select: { testQuestions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        technology: true,
        testQuestions: {
          include: {
            question: {
              include: { options: true },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!test) throw { status: 404, message: 'Test not found' };

    // Transform testQuestions to match expected output
    const { testQuestions, ...testData } = test;
    return {
      ...testData,
      questions: testQuestions.map(tq => tq.question),
    };
  }
}
