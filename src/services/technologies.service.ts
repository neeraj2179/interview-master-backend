import { prisma } from '../prisma';

export class TechnologiesService {
  static async getAll() {
    return prisma.technology.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { topics: true, questions: true, tests: true },
        },
      },
    });
  }

  static async getBySlug(slug: string) {
    const tech = await prisma.technology.findUnique({
      where: { slug },
      include: {
        topics: {
          orderBy: { sortOrder: 'asc' },
          include: { _count: { select: { questions: true } } },
        },
        _count: {
          select: { questions: true, tests: true },
        },
      },
    });
    if (!tech) throw { status: 404, message: 'Technology not found' };
    return tech;
  }
}
