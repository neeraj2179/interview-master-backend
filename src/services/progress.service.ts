import { prisma } from '../prisma';

export class ProgressService {
  static async getMyProgress(userId: string) {
    return prisma.userProgress.findMany({
      where: { userId },
      include: {
        technology: { select: { id: true, name: true, icon: true } },
      },
      orderBy: { lastActivityAt: 'desc' },
    });
  }
}
