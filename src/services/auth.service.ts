import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { config } from '../config';

export class AuthService {
  static async register(data: any) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw { status: 400, message: 'Email already exists' };

    const role = await prisma.role.findUnique({ where: { name: 'USER' } });
    if (!role) throw { status: 500, message: 'Default role not found' };

    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: role.id,
      },
      include: { role: true },
    });

    const tokens = this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSecrets } = user;
    return { user: userWithoutSecrets, ...tokens };
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true },
    });
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw { status: 401, message: 'Invalid credentials' };

    const tokens = this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSecrets } = user;
    return { user: userWithoutSecrets, ...tokens };
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  static async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        include: { role: true },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw { status: 401, message: 'Invalid refresh token' };
      }

      const tokens = this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (e) {
      throw { status: 401, message: 'Invalid refresh token' };
    }
  }

  private static generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn as any });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn as any });
    return { accessToken, refreshToken };
  }

  private static async updateRefreshToken(userId: string, refreshToken: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
