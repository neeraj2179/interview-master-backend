import { prisma } from '../prisma';

export class TopicsService {
  static async getByTechnology(technologySlug: string) {
    const tech = await prisma.technology.findUnique({
      where: { slug: technologySlug },
    });
    if (!tech) throw { status: 404, message: 'Technology not found' };

    return prisma.topic.findMany({
      where: { technologyId: tech.id },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { questions: true } },
      },
    });
  }

  static async getById(id: string) {
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: { technology: true },
    });
    if (!topic) throw { status: 404, message: 'Topic not found' };
    return topic;
  }

  static async getBySlugs(technologySlug: string, topicSlug: string) {
    const tech = await prisma.technology.findUnique({
      where: { slug: technologySlug },
    });
    if (!tech) throw { status: 404, message: 'Technology not found' };

    const topic = await prisma.topic.findUnique({
      where: { technologyId_slug: { technologyId: tech.id, slug: topicSlug } },
      include: { technology: true },
    });
    if (!topic) throw { status: 404, message: 'Topic not found' };
    return topic;
  }
}
