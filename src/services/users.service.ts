import { prisma } from '../prisma';

export class UsersService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, _count: { select: { attempts: true } } },
    });
    if (!user) throw { status: 404, message: 'User not found' };
    const { password, refreshToken, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }

  static async updateProfile(userId: string, data: { name?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
      include: { role: true },
    });
    const { password, refreshToken, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }
}
